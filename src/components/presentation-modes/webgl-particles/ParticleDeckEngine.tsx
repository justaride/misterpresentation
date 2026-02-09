import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AnimatePresence, motion } from "framer-motion";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js";
import type { FxPreset, ParticleDeckVariantConfig, Slide } from "./types";

type QualityTier = "low" | "medium" | "high" | "ultra";

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  } catch {
    return false;
  }
}

function pickQualityTier(reduced: boolean): QualityTier {
  if (reduced) return "low";

  const cores = navigator.hardwareConcurrency ?? 8;
  const dpr = window.devicePixelRatio ?? 1;
  const isMobile =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "") ||
    (navigator.maxTouchPoints ?? 0) > 1;

  if (isMobile || cores <= 4) return "medium";
  if (cores >= 10 && dpr <= 1.5) return "ultra";
  return "high";
}

function particleCountForTier(tier: QualityTier) {
  switch (tier) {
    case "low":
      return 1200;
    case "medium":
      return 2500;
    case "high":
      return 3500;
    case "ultra":
      return 5000;
  }
}

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function hash11(x: number) {
  const s = Math.sin(x * 127.1) * 43758.5453123;
  return s - Math.floor(s);
}

function generateTextPoints(text: string, countHint: number) {
  const w = 900;
  const h = 260;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 160px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto";
  ctx.fillText(text.toUpperCase(), w / 2, h / 2 + 8);

  const img = ctx.getImageData(0, 0, w, h).data;
  const pts: Array<[number, number]> = [];
  const step = Math.max(
    2,
    Math.floor(Math.sqrt((w * h) / Math.max(countHint, 1)) * 0.75),
  );
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const i = (y * w + x) * 4;
      if (img[i] > 40) {
        const nx = (x / w) * 2 - 1;
        const ny = (1 - y / h) * 2 - 1;
        pts.push([nx, ny]);
      }
    }
  }

  return pts;
}

function setTargetsFromPoints(
  state: ParticleState,
  points: Array<[number, number]>,
  scale: number,
  zJitter: number,
) {
  const { count, targets, seeds } = state;
  if (points.length === 0) return false;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const pick = Math.floor(seeds[i] * points.length) % points.length;
    const [x, y] = points[pick];
    targets[i3] = x * scale;
    targets[i3 + 1] = y * (scale * 0.35);
    targets[i3 + 2] = (hash11(seeds[i] * 99.1) - 0.5) * zJitter;
  }
  return true;
}

function applyFxScales(
  fx: FxPreset,
  render: ParticleDeckVariantConfig["render"],
  reducedMotion: boolean,
  degraded: boolean,
) {
  const trailsEnabledBase = fx.trailsDamp < 0.999;
  const trailsEnabled = trailsEnabledBase && !reducedMotion && !degraded;
  const trailsDamp = trailsEnabled
    ? clamp01(fx.trailsDamp * render.trailsScale)
    : 1.0;

  const bloomEnabled = !degraded && render.bloomScale > 0.001;
  const bloomStrength = bloomEnabled
    ? fx.bloomStrength * render.bloomScale
    : 0.0;

  return {
    trailsEnabled,
    trailsDamp,
    bloomEnabled,
    bloomStrength,
    bloomRadius: fx.bloomRadius,
    bloomThreshold: fx.bloomThreshold,
  };
}

const VERT = /* glsl */ `
  precision highp float;
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vSeed;
  void main() {
    vSeed = aSeed;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float tw = 0.85 + 0.15 * sin(uTime * 2.0 + aSeed * 13.0);
    float size = aSize * uPixelRatio * tw;
    gl_PointSize = size * (10.0 / max(1.0, -mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uSparkle;
  varying float vSeed;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d);
    float sparkle = mix(1.0, 0.7 + 0.3 * sin(uTime * 6.0 + vSeed * 17.0), uSparkle);
    vec3 col = uColor * sparkle;
    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`;

type ParticleState = {
  count: number;
  positions: Float32Array;
  velocities: Float32Array;
  targets: Float32Array;
  sizes: Float32Array;
  seeds: Float32Array;

  // Lorenz attractor state
  attractX: Float32Array;
  attractY: Float32Array;
  attractZ: Float32Array;

  // Boids spatial hash
  cellHeads: Int32Array;
  cellNext: Int32Array;
};

function createParticleState(count: number): ParticleState {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const s = hash11(i + 1.2345);
    const s2 = hash11(i * 1.7 + 9.87);
    const s3 = hash11(i * 2.3 + 5.43);
    seeds[i] = s;
    positions[i3] = (s - 0.5) * 10;
    positions[i3 + 1] = (s2 - 0.5) * 10;
    positions[i3 + 2] = (s3 - 0.5) * 6;
    sizes[i] = 1.4 + s2 * 2.8;
  }

  const attractX = new Float32Array(count);
  const attractY = new Float32Array(count);
  const attractZ = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    attractX[i] = (seeds[i] - 0.5) * 0.2;
    attractY[i] = (hash11(seeds[i] * 11.7) - 0.5) * 0.2;
    attractZ[i] = (hash11(seeds[i] * 37.9) - 0.5) * 0.2;
  }

  const cellHeads = new Int32Array(32 * 32 * 32);
  const cellNext = new Int32Array(count);

  return {
    count,
    positions,
    velocities,
    targets,
    sizes,
    seeds,
    attractX,
    attractY,
    attractZ,
    cellHeads,
    cellNext,
  };
}

function usePostFX({
  enabled,
  slide,
  variant,
  degraded,
  reducedMotion,
}: {
  enabled: boolean;
  slide: Slide;
  variant: ParticleDeckVariantConfig;
  degraded: boolean;
  reducedMotion: boolean;
}) {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomRef = useRef<UnrealBloomPass | null>(null);
  const afterRef = useRef<AfterimagePass | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const composer = new EffectComposer(gl);
    composer.setSize(size.width, size.height);

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const after = new AfterimagePass();
    composer.addPass(after);

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      slide.fx.bloomStrength,
      slide.fx.bloomRadius,
      slide.fx.bloomThreshold,
    );
    composer.addPass(bloom);

    composerRef.current = composer;
    bloomRef.current = bloom;
    afterRef.current = after;

    return () => {
      composerRef.current = null;
      bloomRef.current = null;
      afterRef.current = null;
      composer.dispose();
    };
  }, [enabled, gl, scene, camera]);

  useEffect(() => {
    const composer = composerRef.current;
    if (!composer) return;
    composer.setSize(size.width, size.height);
  }, [size.width, size.height]);

  useEffect(() => {
    const bloom = bloomRef.current;
    const after = afterRef.current;
    if (!bloom || !after) return;

    const scaled = applyFxScales(slide.fx, variant.render, reducedMotion, degraded);

    after.enabled = scaled.trailsEnabled;
    after.uniforms.damp.value = scaled.trailsDamp;

    bloom.enabled = scaled.bloomEnabled;
    bloom.strength = scaled.bloomStrength;
    bloom.radius = scaled.bloomRadius;
    bloom.threshold = scaled.bloomThreshold;
  }, [slide.fx, variant.render, degraded, reducedMotion]);

  useFrame(() => {
    const composer = composerRef.current;
    if (!enabled || !composer) return;
    composer.render();
  }, 1);
}

function ConstellationLines({
  enabled,
  particlePositions,
  particleColor,
  reducedMotion,
}: {
  enabled: boolean;
  particlePositions: Float32Array;
  particleColor: THREE.Color;
  reducedMotion: boolean;
}) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const geomRef = useRef<THREE.BufferGeometry | null>(null);

  const sampleStride = 8; // use every Nth particle
  const maxPairs = 1200; // cap segments
  const threshold = 0.85;

  const [positions, colors] = useMemo(() => {
    // Each segment = 2 vertices => 6 floats. Preallocate.
    const pos = new Float32Array(maxPairs * 2 * 3);
    const col = new Float32Array(maxPairs * 2 * 3);
    return [pos, col];
  }, []);

  useFrame(() => {
    if (!enabled || reducedMotion || !lineRef.current) return;
    const n = Math.floor(particlePositions.length / 3);
    let seg = 0;
    const c = particleColor;

    for (let i = 0; i < n && seg < maxPairs; i += sampleStride) {
      const i3 = i * 3;
      const ax = particlePositions[i3];
      const ay = particlePositions[i3 + 1];
      const az = particlePositions[i3 + 2];

      // Find 2 nearest neighbors within threshold among a small forward window.
      let bestJ = -1;
      let bestD2 = threshold * threshold;
      let bestJ2 = -1;
      let bestD22 = threshold * threshold;

      for (let j = i + sampleStride; j < Math.min(n, i + sampleStride * 20); j += sampleStride) {
        const j3 = j * 3;
        const dx = particlePositions[j3] - ax;
        const dy = particlePositions[j3 + 1] - ay;
        const dz = particlePositions[j3 + 2] - az;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < bestD2) {
          bestJ2 = bestJ;
          bestD22 = bestD2;
          bestJ = j;
          bestD2 = d2;
        } else if (d2 < bestD22) {
          bestJ2 = j;
          bestD22 = d2;
        }
      }

      const emit = (j: number) => {
        const j3 = j * 3;
        const base = seg * 2 * 3;
        positions[base] = ax;
        positions[base + 1] = ay;
        positions[base + 2] = az;
        positions[base + 3] = particlePositions[j3];
        positions[base + 4] = particlePositions[j3 + 1];
        positions[base + 5] = particlePositions[j3 + 2];

        // Faint line color
        const alpha = 0.12;
        colors[base] = c.r * alpha;
        colors[base + 1] = c.g * alpha;
        colors[base + 2] = c.b * alpha;
        colors[base + 3] = c.r * alpha;
        colors[base + 4] = c.g * alpha;
        colors[base + 5] = c.b * alpha;
        seg++;
      };

      if (bestJ !== -1 && seg < maxPairs) emit(bestJ);
      if (bestJ2 !== -1 && seg < maxPairs) emit(bestJ2);
    }

    // Zero the rest so old segments disappear when seg count drops.
    const used = seg * 2 * 3;
    for (let k = used; k < positions.length; k++) positions[k] = 0;
    for (let k = used; k < colors.length; k++) colors[k] = 0;

    const geom = (lineRef.current.geometry as THREE.BufferGeometry);
    geom.getAttribute("position").needsUpdate = true;
    geom.getAttribute("color").needsUpdate = true;
    geom.setDrawRange(0, seg * 2);
  });

  useEffect(() => {
    if (!lineRef.current) return;
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geom.setDrawRange(0, 0);
    lineRef.current.geometry = geom;
    geomRef.current = geom;
    return () => {
      geom.dispose();
      geomRef.current = null;
    };
  }, [positions, colors]);

  if (!enabled || reducedMotion) return null;

  return (
    <lineSegments ref={lineRef}>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

function ParticleSystem({
  slideIndex,
  slide,
  variant,
  qualityTier,
  reducedMotion,
  onPerfSample,
  restartSignal,
  reportPositions,
}: {
  slideIndex: number;
  slide: Slide;
  variant: ParticleDeckVariantConfig;
  qualityTier: QualityTier;
  reducedMotion: boolean;
  onPerfSample: (fps: number) => void;
  restartSignal: number;
  reportPositions: (positions: Float32Array) => void;
}) {
  // Keeping slideIndex for future variant-specific behavior and to make it easy
  // to add cross-slide transitions without changing the interface.
  void slideIndex;

  const count = useMemo(() => particleCountForTier(qualityTier), [qualityTier]);
  const stateRef = useRef<ParticleState>(createParticleState(count));

  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const tmpTarget = useMemo(() => new THREE.Vector3(), []);
  const tmpVec = useMemo(() => new THREE.Vector3(), []);
  const tmpVec2 = useMemo(() => new THREE.Vector3(), []);

  const [meaningPoints, webglPoints] = useMemo(() => {
    const pts1 = generateTextPoints("MEANING", count);
    const pts2 = generateTextPoints("WEBGL", count);
    return [pts1, pts2];
  }, [count]);

  useEffect(() => {
    const st = stateRef.current;
    const { targets, velocities, attractX, attractY, attractZ, count: n } = st;

    for (let i = 0; i < n * 3; i++) velocities[i] *= 0.25;

    if (slide.id === "strange-attractor") {
      for (let i = 0; i < n; i++) {
        attractX[i] = (st.seeds[i] - 0.5) * 0.8;
        attractY[i] = (hash11(st.seeds[i] * 11.7) - 0.5) * 0.8;
        attractZ[i] = (hash11(st.seeds[i] * 37.9) - 0.5) * 0.8;
      }
    }

    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      const s = st.seeds[i];
      const a = s * Math.PI * 2;
      const u = i / Math.max(1, n - 1);

      switch (slide.id) {
        case "scatter": {
          targets[i3] = (hash11(i * 1.3) - 0.5) * 8;
          targets[i3 + 1] = (hash11(i * 2.1 + 5) - 0.5) * 8;
          targets[i3 + 2] = (hash11(i * 3.7 + 1) - 0.5) * 2;
          break;
        }
        case "curl-flow": {
          targets[i3] = Math.sin(u * 26) * 2.8 * Math.cos(a);
          targets[i3 + 1] = (u - 0.5) * 8.5;
          targets[i3 + 2] = Math.cos(u * 26) * 2.8 * Math.sin(a);
          break;
        }
        case "orbitals": {
          const ring = Math.floor(s * 4);
          const r = 1.5 + ring * 0.9 + (hash11(i * 9.1) - 0.5) * 0.1;
          const ang = a * (1 + ring * 0.35);
          targets[i3] = Math.cos(ang) * r;
          targets[i3 + 1] = (hash11(i * 7.3) - 0.5) * 0.25;
          targets[i3 + 2] = Math.sin(ang) * r;
          break;
        }
        case "gravity-wells": {
          targets[i3] = (hash11(i * 1.11) - 0.5) * 10;
          targets[i3 + 1] = (hash11(i * 2.17) - 0.5) * 10;
          targets[i3 + 2] = (hash11(i * 3.13) - 0.5) * 6;
          break;
        }
        case "repulsion-lattice": {
          targets[i3] = (hash11(i * 1.7) - 0.5) * 7;
          targets[i3 + 1] = (hash11(i * 2.9) - 0.5) * 7;
          targets[i3 + 2] = (hash11(i * 4.1) - 0.5) * 1.5;
          break;
        }
        case "wave-surface": {
          const cols = 70;
          const row = Math.floor(i / cols);
          const col = i % cols;
          const x = (col / (cols - 1) - 0.5) * 8;
          const y = (row / Math.max(1, Math.floor(n / cols) - 1) - 0.5) * 4.5;
          targets[i3] = x;
          targets[i3 + 1] = y;
          targets[i3 + 2] = 0;
          break;
        }
        case "vortex-column": {
          const ang = u * Math.PI * 10;
          const r = 0.5 + u * 3.8;
          targets[i3] = Math.cos(ang) * r;
          targets[i3 + 1] = (u - 0.5) * 7.0;
          targets[i3 + 2] = Math.sin(ang) * r;
          break;
        }
        case "burst": {
          const phi = Math.acos(2 * hash11(i * 7.9) - 1);
          const theta = hash11(i * 3.1 + 2) * Math.PI * 2;
          const r = 1.2 + hash11(i * 5.3 + 4) * 0.35;
          targets[i3] = r * Math.sin(phi) * Math.cos(theta);
          targets[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          targets[i3 + 2] = r * Math.cos(phi);
          break;
        }
        case "flock": {
          targets[i3] = (hash11(i * 1.1) - 0.5) * 6;
          targets[i3 + 1] = (hash11(i * 2.2) - 0.5) * 4;
          targets[i3 + 2] = (hash11(i * 3.3) - 0.5) * 6;
          break;
        }
        case "strange-attractor": {
          targets[i3] = 0;
          targets[i3 + 1] = 0;
          targets[i3 + 2] = 0;
          break;
        }
        case "meaning": {
          setTargetsFromPoints(st, meaningPoints, 7.5, 0.6);
          break;
        }
        case "glitch-grid": {
          const cols = 72;
          const row = Math.floor(i / cols);
          const col = i % cols;
          targets[i3] = (col / (cols - 1) - 0.5) * 8.2;
          targets[i3 + 1] = (row / Math.max(1, Math.floor(n / cols) - 1) - 0.5) * 8.2;
          targets[i3 + 2] = 0;
          break;
        }
        case "singularity": {
          targets[i3] = (hash11(i * 2.0) - 0.5) * 0.25;
          targets[i3 + 1] = (hash11(i * 3.0) - 0.5) * 0.25;
          targets[i3 + 2] = (hash11(i * 4.0) - 0.5) * 0.25;
          break;
        }
        case "webgl": {
          setTargetsFromPoints(st, webglPoints, 7.2, 0.75);
          break;
        }
        default: {
          targets[i3] = (hash11(i * 1.3) - 0.5) * 8;
          targets[i3 + 1] = (hash11(i * 2.1 + 5) - 0.5) * 8;
          targets[i3 + 2] = (hash11(i * 3.7 + 1) - 0.5) * 2;
        }
      }
    }
  }, [slide.id, meaningPoints, webglPoints]);

  useEffect(() => {
    const st = stateRef.current;
    const { positions, velocities, count: n } = st;
    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      const s = st.seeds[i];
      positions[i3] = (s - 0.5) * 10;
      positions[i3 + 1] = (hash11(s * 11.0) - 0.5) * 10;
      positions[i3 + 2] = (hash11(s * 37.0) - 0.5) * 6;
      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;
    }
  }, [restartSignal]);

  const fpsRef = useRef({ acc: 0, frames: 0, lastReport: 0 });

  useFrame((_state, dt) => {
    const st = stateRef.current;
    const n = st.count;
    const positions = st.positions;
    const velocities = st.velocities;
    const targets = st.targets;

    const now = performance.now();
    const fpsState = fpsRef.current;
    fpsState.frames += 1;
    fpsState.acc += dt;
    if (now - fpsState.lastReport > 1000) {
      const fps = fpsState.frames / Math.max(fpsState.acc, 1e-6);
      onPerfSample(fps);
      fpsState.frames = 0;
      fpsState.acc = 0;
      fpsState.lastReport = now;
    }

    const t = now * 0.001;
    const motionScale = reducedMotion ? 0.45 : 1.0;
    const dts = Math.min(dt, 0.033) * motionScale;

    let k = 8.0;
    let c = 2.8;
    let maxSpeed = 6.5;

    if (slide.id === "burst" || slide.id === "singularity") {
      k = 11.0;
      c = 2.6;
      maxSpeed = 9.0;
    }
    if (slide.id === "curl-flow" || slide.id === "vortex-column" || slide.id === "strange-attractor") {
      k = 6.5;
      c = 2.4;
      maxSpeed = 8.0;
    }
    if (slide.id === "meaning" || slide.id === "webgl") {
      k = 12.0;
      c = 3.6;
      maxSpeed = 6.0;
    }

    const phase = (now % 10_000) / 1000;
    const burstImpulse = slide.id === "burst" ? smoothstep(0.0, 0.35, phase) : 0;

    const wellA = tmpVec.set(-2.2, 1.6, 0.2);
    const wellB = tmpVec2.set(2.4, -1.2, -0.4);
    const wellC = tmpTarget.set(0.4, 0.6, 2.1);

    if (slide.id === "flock") {
      st.cellHeads.fill(-1);
      const gridSize = 32;
      const cellSize = 0.8;
      for (let i = 0; i < n; i++) {
        const i3 = i * 3;
        const px = positions[i3];
        const py = positions[i3 + 1];
        const pz = positions[i3 + 2];
        const gx = Math.max(0, Math.min(gridSize - 1, Math.floor((px + 6.5) / cellSize)));
        const gy = Math.max(0, Math.min(gridSize - 1, Math.floor((py + 6.5) / cellSize)));
        const gz = Math.max(0, Math.min(gridSize - 1, Math.floor((pz + 6.5) / cellSize)));
        const cell = gx + gy * gridSize + gz * gridSize * gridSize;
        st.cellNext[i] = st.cellHeads[cell];
        st.cellHeads[cell] = i;
      }
    }

    for (let i = 0; i < n; i++) {
      const i3 = i * 3;

      const px = positions[i3];
      const py = positions[i3 + 1];
      const pz = positions[i3 + 2];

      let vx = velocities[i3];
      let vy = velocities[i3 + 1];
      let vz = velocities[i3 + 2];

      let tx = targets[i3];
      let ty = targets[i3 + 1];
      let tz = targets[i3 + 2];

      if (slide.id === "wave-surface") {
        const ph = px * 0.8 + py * 0.9 + t * 1.2;
        tz = Math.sin(ph) * 0.55 + Math.sin(ph * 0.45) * 0.25;
      }

      if (slide.id === "orbitals") {
        const s = st.seeds[i];
        const ring = Math.floor(s * 4);
        const r = 1.5 + ring * 0.9;
        const base = s * Math.PI * 2;
        const speed = 0.45 + ring * 0.15;
        const ang = base + t * speed;
        tx = Math.cos(ang) * r;
        tz = Math.sin(ang) * r;
      }

      const dx = tx - px;
      const dy = ty - py;
      const dz = tz - pz;
      vx += dx * k * dts;
      vy += dy * k * dts;
      vz += dz * k * dts;
      vx *= Math.exp(-c * dts);
      vy *= Math.exp(-c * dts);
      vz *= Math.exp(-c * dts);

      if (slide.id === "curl-flow") {
        const f1 = Math.sin(py * 0.9 + t * 1.1);
        const f2 = Math.sin(pz * 0.8 + t * 0.9);
        const f3 = Math.sin(px * 0.85 + t * 1.0);
        vx += f1 * 0.9 * dts;
        vy += f2 * 0.7 * dts;
        vz += f3 * 0.9 * dts;
      }

      if (slide.id === "gravity-wells") {
        const strength = 2.4;
        const repel = 0.5;

        let wx = wellA.x - px;
        let wy = wellA.y - py;
        let wz = wellA.z - pz;
        let d2 = wx * wx + wy * wy + wz * wz + 0.1;
        let inv = 1.0 / d2;
        vx += wx * strength * inv * dts;
        vy += wy * strength * inv * dts;
        vz += wz * strength * inv * dts;

        wx = wellB.x - px;
        wy = wellB.y - py;
        wz = wellB.z - pz;
        d2 = wx * wx + wy * wy + wz * wz + 0.1;
        inv = 1.0 / d2;
        vx += wx * strength * inv * dts;
        vy += wy * strength * inv * dts;
        vz += wz * strength * inv * dts;

        wx = wellC.x - px;
        wy = wellC.y - py;
        wz = wellC.z - pz;
        d2 = wx * wx + wy * wy + wz * wz + 0.1;
        inv = 1.0 / d2;
        vx += wx * strength * inv * dts;
        vy += wy * strength * inv * dts;
        vz += wz * strength * inv * dts;

        const r2 = dx * dx + dy * dy + dz * dz;
        if (r2 < 0.25) {
          vx -= dx * repel * dts;
          vy -= dy * repel * dts;
          vz -= dz * repel * dts;
        }
      }

      if (slide.id === "repulsion-lattice") {
        const s = st.seeds[i];
        const ax = Math.sin(t * 0.5 + s * 9.0) * 1.2;
        const ay = Math.cos(t * 0.55 + s * 7.0) * 1.2;
        const az = Math.sin(t * 0.45 + s * 11.0) * 0.8;
        const rx = px - ax;
        const ry = py - ay;
        const rz = pz - az;
        const d2 = rx * rx + ry * ry + rz * rz + 0.35;
        const inv = 1.0 / d2;
        vx += rx * 0.6 * inv * dts;
        vy += ry * 0.6 * inv * dts;
        vz += rz * 0.6 * inv * dts;
      }

      if (slide.id === "vortex-column") {
        const ang = Math.atan2(pz, px);
        const r = Math.sqrt(px * px + pz * pz) + 1e-3;
        const spin = 1.7;
        vx += -Math.sin(ang) * spin * dts;
        vz += Math.cos(ang) * spin * dts;
        vx += (-px / r) * 0.6 * dts;
        vz += (-pz / r) * 0.6 * dts;
        vy += Math.sin(t * 0.7 + r) * 0.15 * dts;
      }

      if (slide.id === "burst") {
        const s = st.seeds[i];
        const ix = (hash11(s * 13.1) - 0.5) * 18;
        const iy = (hash11(s * 17.3) - 0.5) * 18;
        const iz = (hash11(s * 19.7) - 0.5) * 18;
        vx += ix * 0.0025 * dts;
        vy += iy * 0.0025 * dts;
        vz += iz * 0.0025 * dts;
        vx += ix * 0.002 * burstImpulse * dts;
        vy += iy * 0.002 * burstImpulse * dts;
        vz += iz * 0.002 * burstImpulse * dts;
      }

      if (slide.id === "flock") {
        const gridSize = 32;
        const cellSize = 0.8;
        const gx = Math.max(0, Math.min(gridSize - 1, Math.floor((px + 6.5) / cellSize)));
        const gy = Math.max(0, Math.min(gridSize - 1, Math.floor((py + 6.5) / cellSize)));
        const gz = Math.max(0, Math.min(gridSize - 1, Math.floor((pz + 6.5) / cellSize)));

        let sepX = 0, sepY = 0, sepZ = 0;
        let aliX = 0, aliY = 0, aliZ = 0;
        let cohX = 0, cohY = 0, cohZ = 0;
        let neighbors = 0;

        for (let dz0 = -1; dz0 <= 1; dz0++) {
          for (let dy0 = -1; dy0 <= 1; dy0++) {
            for (let dx0 = -1; dx0 <= 1; dx0++) {
              const nx = gx + dx0;
              const ny = gy + dy0;
              const nz = gz + dz0;
              if (nx < 0 || ny < 0 || nz < 0 || nx >= gridSize || ny >= gridSize || nz >= gridSize) continue;
              const cell = nx + ny * gridSize + nz * gridSize * gridSize;
              let j = st.cellHeads[cell];
              while (j !== -1) {
                if (j !== i) {
                  const j3 = j * 3;
                  const qx = positions[j3];
                  const qy = positions[j3 + 1];
                  const qz = positions[j3 + 2];
                  const ox = qx - px;
                  const oy = qy - py;
                  const oz = qz - pz;
                  const dist2 = ox * ox + oy * oy + oz * oz;
                  if (dist2 < 1.2) {
                    neighbors++;
                    const invd = 1.0 / (dist2 + 0.04);
                    sepX -= ox * invd;
                    sepY -= oy * invd;
                    sepZ -= oz * invd;
                    aliX += velocities[j3];
                    aliY += velocities[j3 + 1];
                    aliZ += velocities[j3 + 2];
                    cohX += qx;
                    cohY += qy;
                    cohZ += qz;
                  }
                }
                j = st.cellNext[j];
              }
            }
          }
        }

        if (neighbors > 0) {
          const invN = 1 / neighbors;
          aliX *= invN; aliY *= invN; aliZ *= invN;
          cohX = cohX * invN - px;
          cohY = cohY * invN - py;
          cohZ = cohZ * invN - pz;

          const sepW = 1.25;
          const aliW = 0.35;
          const cohW = 0.25;

          vx += (sepX * sepW + aliX * aliW + cohX * cohW) * dts;
          vy += (sepY * sepW + aliY * aliW + cohY * cohW) * dts;
          vz += (sepZ * sepW + aliZ * aliW + cohZ * cohW) * dts;
        }
      }

      if (slide.id === "strange-attractor") {
        const sigma = 10;
        const rho = 28;
        const beta = 8 / 3;
        const x = st.attractX[i];
        const y = st.attractY[i];
        const z = st.attractZ[i];

        const dx1 = sigma * (y - x);
        const dy1 = x * (rho - z) - y;
        const dz1 = x * y - beta * z;

        const step = dts * 0.9;
        st.attractX[i] = x + dx1 * step;
        st.attractY[i] = y + dy1 * step;
        st.attractZ[i] = z + dz1 * step;

        tx = st.attractX[i] * 0.11;
        ty = st.attractY[i] * 0.11;
        tz = st.attractZ[i] * 0.11;

        vx += (tx - px) * 5.5 * dts;
        vy += (ty - py) * 5.5 * dts;
        vz += (tz - pz) * 5.5 * dts;
      }

      if (slide.id === "glitch-grid") {
        const s = st.seeds[i];
        const glitch = smoothstep(0.85, 1.0, Math.sin(t * 2.2 + s * 50.0) * 0.5 + 0.5);
        vx += (hash11(s * 31.0) - 0.5) * glitch * 2.0 * dts;
        vy += (hash11(s * 47.0) - 0.5) * glitch * 2.0 * dts;
        vz += (hash11(s * 59.0) - 0.5) * glitch * 1.2 * dts;
      }

      if (slide.id === "singularity") {
        const r = Math.sqrt(px * px + pz * pz) + 1e-3;
        vx += (-px / r) * 1.8 * dts;
        vz += (-pz / r) * 1.8 * dts;
        vx += (-pz / r) * 1.0 * dts;
        vz += (px / r) * 1.0 * dts;
        vy += -py * 0.65 * dts;
      }

      const sp2 = vx * vx + vy * vy + vz * vz;
      if (sp2 > maxSpeed * maxSpeed) {
        const inv = maxSpeed / Math.sqrt(sp2);
        vx *= inv;
        vy *= inv;
        vz *= inv;
      }

      positions[i3] = px + vx * dts;
      positions[i3 + 1] = py + vy * dts;
      positions[i3 + 2] = pz + vz * dts;

      velocities[i3] = vx;
      velocities[i3 + 1] = vy;
      velocities[i3 + 2] = vz;
    }

    if (meshRef.current) {
      const geom = meshRef.current.geometry;
      const posAttr = geom.getAttribute("position");
      (posAttr.array as Float32Array).set(positions);
      posAttr.needsUpdate = true;
    }
    reportPositions(positions);

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = t;
    }
  });

  const particleColor = useMemo(() => new THREE.Color(slide.particleColor), [slide.particleColor]);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio ?? 1, 2) },
      uColor: { value: particleColor },
      uOpacity: { value: reducedMotion ? Math.min(0.78, variant.render.opacity) : variant.render.opacity },
      uSparkle: { value: variant.render.sparkle },
    };
  }, [particleColor, reducedMotion, variant.render.opacity, variant.render.sparkle]);

  useEffect(() => {
    uniforms.uColor.value = particleColor;
    uniforms.uSparkle.value = variant.render.sparkle;
  }, [uniforms, particleColor, variant.render.sparkle]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[stateRef.current.positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[stateRef.current.sizes, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[stateRef.current.seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={(m) => {
          materialRef.current = (m as unknown as THREE.ShaderMaterial) ?? null;
        }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
      />
    </points>
  );
}

function Scene({
  slideIndex,
  slide,
  variant,
  qualityTier,
  reducedMotion,
  degraded,
  onPerfSample,
  restartSignal,
}: {
  slideIndex: number;
  slide: Slide;
  variant: ParticleDeckVariantConfig;
  qualityTier: QualityTier;
  reducedMotion: boolean;
  degraded: boolean;
  onPerfSample: (fps: number) => void;
  restartSignal: number;
}) {
  const latestPositions = useRef<Float32Array | null>(null);
  const reportPositions = useCallback((p: Float32Array) => {
    latestPositions.current = p;
  }, []);

  usePostFX({
    enabled: true,
    slide,
    variant,
    degraded,
    reducedMotion,
  });

  const lineColor = useMemo(() => new THREE.Color(slide.particleColor), [slide.particleColor]);

  const allowLines =
    variant.extras.constellationLines &&
    !reducedMotion &&
    !degraded &&
    qualityTier !== "low";

  return (
    <>
      <ambientLight intensity={0.1} />
      <ParticleSystem
        slideIndex={slideIndex}
        slide={slide}
        variant={variant}
        qualityTier={qualityTier}
        reducedMotion={reducedMotion}
        onPerfSample={onPerfSample}
        restartSignal={restartSignal}
        reportPositions={reportPositions}
      />
      {allowLines && latestPositions.current && (
        <ConstellationLines
          enabled
          particlePositions={latestPositions.current}
          particleColor={lineColor}
          reducedMotion={reducedMotion}
        />
      )}
    </>
  );
}

function BackgroundOverlay({ variant }: { variant: ParticleDeckVariantConfig }) {
  // CSS-only overlays, blended on top of canvas.
  if (variant.render.backgroundOverlay === "none") return null;

  if (variant.render.backgroundOverlay === "scanlines") {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 1px)",
          backgroundSize: "100% 6px",
          mixBlendMode: "overlay",
          opacity: 0.25,
        }}
      />
    );
  }

  if (variant.render.backgroundOverlay === "grain") {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 10%, rgba(0,0,0,0.04) 0 1px, transparent 1px), radial-gradient(circle at 70% 40%, rgba(0,0,0,0.03) 0 1px, transparent 1px), radial-gradient(circle at 40% 80%, rgba(0,0,0,0.03) 0 1px, transparent 1px)",
          backgroundSize: "9px 9px, 11px 11px, 13px 13px",
          mixBlendMode: "multiply",
          opacity: 0.7,
        }}
      />
    );
  }

  if (variant.render.backgroundOverlay === "starfield") {
    return (
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.35) 0 1px, transparent 1px), radial-gradient(circle at 40% 70%, rgba(255,255,255,0.25) 0 1px, transparent 1px), radial-gradient(circle at 80% 35%, rgba(255,255,255,0.28) 0 1px, transparent 1px), radial-gradient(circle at 60% 10%, rgba(255,255,255,0.18) 0 1px, transparent 1px)",
          backgroundSize: "220px 220px, 260px 260px, 300px 300px, 340px 340px",
          opacity: 0.35,
        }}
      />
    );
  }

  return null;
}

function LeftHud({ slide, index, total, variant }: { slide: Slide; index: number; total: number; variant: ParticleDeckVariantConfig }) {
  const label = variant.ui.hudLabel ?? "SYSTEM";
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <div className="absolute left-6 top-6 w-[420px] max-w-[72vw] rounded-2xl border border-white/10 bg-black/35 backdrop-blur px-5 py-4 text-white/85">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/55">
            {label}
          </div>
          <div className="font-mono text-xs text-white/40">
            {index + 1} / {total}
          </div>
        </div>
        <div className="mt-3">
          <div className="font-display text-3xl leading-tight tracking-tight">
            {slide.title}
          </div>
          <div className="mt-1 text-sm text-white/60">{slide.subtitle}</div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="font-mono text-xs text-white/45">
            STATUS:{" "}
            <span className="text-white/70">
              {slide.id === "burst" ? "IMPULSE" : "ACTIVE"}
            </span>
          </div>
          <div className="font-mono text-xs text-white/35">← → Space</div>
        </div>
      </div>
    </div>
  );
}

export function ParticleDeckEngine({ variant }: { variant: ParticleDeckVariantConfig }) {
  const navigate = useNavigate();
  const reducedMotion = useMemo(() => prefersReducedMotion(), []);
  const qualityTier = useMemo(() => pickQualityTier(reducedMotion), [reducedMotion]);

  const dpr = useMemo(() => {
    if (reducedMotion) return [1, 1] as [number, number];
    if (qualityTier === "medium") return [1, 1.25] as [number, number];
    if (qualityTier === "high") return [1, 1.5] as [number, number];
    return [1, 1.75] as [number, number];
  }, [qualityTier, reducedMotion]);

  const [current, setCurrent] = useState(0);
  const [showHud, setShowHud] = useState(false);
  const [degraded, setDegraded] = useState(false);
  const [restartSignal, setRestartSignal] = useState(0);

  const slides = variant.slides;
  const slide = slides[current];

  const next = useCallback(() => {
    setCurrent((p) => Math.min(p + 1, slides.length - 1));
  }, [slides.length]);
  const prev = useCallback(() => {
    setCurrent((p) => Math.max(p - 1, 0));
  }, []);

  const onPerfSample = useCallback((fps: number) => {
    if (!reducedMotion && fps < 42) setDegraded(true);
    if (fps > 55) setDegraded(false);
  }, [reducedMotion]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Home") {
        e.preventDefault();
        setCurrent(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        setCurrent(slides.length - 1);
      }
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setShowHud((v) => !v);
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        setRestartSignal((x) => x + 1);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        navigate("/examples");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate, next, prev, slides.length]);

  const webglOk = useMemo(() => canUseWebGL(), []);
  if (!webglOk) {
    return (
      <div className="min-h-screen bg-bg text-fg flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="font-display text-3xl mb-2">WebGL Not Available</h1>
          <p className="text-fg/70">
            Your browser or device does not appear to support WebGL.
          </p>
          <button
            className="mt-6 rounded-md border border-fg/15 px-4 py-2 text-sm hover:bg-fg/5"
            onClick={() => navigate("/examples")}
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const overlayTextColor =
    variant.render.backgroundOverlay === "grain" ? "text-black" : "text-white";
  const overlaySubColor =
    variant.render.backgroundOverlay === "grain" ? "text-black/60" : "text-white/50";

  return (
    <div
      className="w-full h-screen relative overflow-hidden"
      style={{ backgroundColor: slide.bgColor }}
    >
      <div className="absolute inset-0">
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene
            slideIndex={current}
            slide={slide}
            variant={variant}
            qualityTier={qualityTier}
            reducedMotion={reducedMotion}
            degraded={degraded}
            onPerfSample={onPerfSample}
            restartSignal={restartSignal}
          />
        </Canvas>
      </div>

      <BackgroundOverlay variant={variant} />

      {variant.ui.overlay === "hud-left" ? (
        <LeftHud slide={slide} index={current} total={slides.length} variant={variant} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2
                className={`text-6xl md:text-8xl font-black tracking-tighter mb-4 ${overlayTextColor}`}
                style={{
                  textShadow:
                    variant.render.backgroundOverlay === "grain"
                      ? "none"
                      : `0 0 60px ${slide.particleColor}40`,
                }}
              >
                {slide.title}
              </h2>
              <p className={`text-xl font-light ${overlaySubColor}`}>{slide.subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {variant.ui.progressStyle === "pills" ? (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-8 h-1.5 rounded-full transition-all ${
                i === current
                  ? variant.render.backgroundOverlay === "grain"
                    ? "bg-black"
                    : "bg-white"
                  : variant.render.backgroundOverlay === "grain"
                    ? "bg-black/20"
                    : "bg-white/20"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      ) : (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-1 rounded-sm transition-all ${
                i === current
                  ? variant.render.backgroundOverlay === "grain"
                    ? "bg-black"
                    : "bg-white"
                  : variant.render.backgroundOverlay === "grain"
                    ? "bg-black/20"
                    : "bg-white/20"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      <div
        className={`absolute bottom-8 right-8 font-mono text-xs z-20 ${
          variant.render.backgroundOverlay === "grain" ? "text-black/30" : "text-white/25"
        }`}
      >
        {current + 1} / {slides.length}
      </div>

      <div
        className={`absolute top-6 left-6 font-mono text-xs z-20 ${
          variant.render.backgroundOverlay === "grain" ? "text-black/35" : "text-white/35"
        }`}
      >
        {variant.ui.hintStyle === "hud"
          ? "← → Space | N HUD | R restart | Esc back"
          : "← → Space | N HUD | R restart | Esc back"}
      </div>

      {showHud && (
        <div
          className={`absolute top-14 left-6 z-30 w-[360px] rounded-xl border backdrop-blur px-4 py-3 ${
            variant.render.backgroundOverlay === "grain"
              ? "border-black/10 bg-white/65 text-black/80"
              : "border-white/10 bg-black/40 text-white/80"
          }`}
        >
          <div className="font-mono text-[11px] uppercase tracking-wide opacity-70">
            Particle HUD
          </div>
          <div className="mt-2 font-mono text-xs leading-relaxed">
            <div>variant: {variant.id}</div>
            <div>quality: {qualityTier}</div>
            <div>particles: {particleCountForTier(qualityTier)}</div>
            <div>reduced motion: {String(reducedMotion)}</div>
            <div>fx degraded: {String(degraded)}</div>
            <div>slide id: {slide.id}</div>
          </div>
        </div>
      )}

      <div className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize z-10" onClick={prev} />
      <div className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize z-10" onClick={next} />
    </div>
  );
}
