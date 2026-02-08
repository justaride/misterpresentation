import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

type SlideData = {
  id: string;
  title: string;
  subtitle: string;
  particleColor: string;
  bgColor: string;
};

const SLIDES: SlideData[] = [
  {
    id: "intro",
    title: "Particle Systems",
    subtitle: "Where physics meets aesthetics",
    particleColor: "#3B82F6",
    bgColor: "#030712",
  },
  {
    id: "flow",
    title: "Flow Fields",
    subtitle: "Noise-driven organic motion",
    particleColor: "#8B5CF6",
    bgColor: "#0a0118",
  },
  {
    id: "gravity",
    title: "Gravitational Pull",
    subtitle: "Attraction and repulsion forces",
    particleColor: "#EC4899",
    bgColor: "#120a14",
  },
  {
    id: "explosion",
    title: "Burst",
    subtitle: "Explosive scatter and reform",
    particleColor: "#F59E0B",
    bgColor: "#120e03",
  },
  {
    id: "vortex",
    title: "Vortex",
    subtitle: "Spiral formations in 3D space",
    particleColor: "#10B981",
    bgColor: "#031210",
  },
  {
    id: "end",
    title: "WebGL",
    subtitle: "GPU-accelerated beauty",
    particleColor: "#EF4444",
    bgColor: "#120303",
  },
];

const PARTICLE_COUNT = 3000;

function Particles({
  slideIndex,
  color,
}: {
  slideIndex: number;
  color: string;
}) {
  const meshRef = useRef<THREE.Points>(null);
  const velocities = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
  const targetPositions = useRef<Float32Array>(
    new Float32Array(PARTICLE_COUNT * 3),
  );

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const sz = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      sz[i] = Math.random() * 3 + 1;
    }
    return [pos, sz];
  }, []);

  useEffect(() => {
    const targets = targetPositions.current;
    const vels = velocities.current;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const radius = Math.random() * 4;

      switch (slideIndex) {
        case 0: {
          targets[i3] = (Math.random() - 0.5) * 8;
          targets[i3 + 1] = (Math.random() - 0.5) * 8;
          targets[i3 + 2] = (Math.random() - 0.5) * 2;
          break;
        }
        case 1: {
          const t = i / PARTICLE_COUNT;
          targets[i3] = Math.sin(t * 20) * 3 * Math.cos(angle);
          targets[i3 + 1] = (t - 0.5) * 8;
          targets[i3 + 2] = Math.cos(t * 20) * 3 * Math.sin(angle);
          break;
        }
        case 2: {
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * Math.PI * 2;
          const r = 3 + Math.random() * 0.5;
          targets[i3] = r * Math.sin(phi) * Math.cos(theta);
          targets[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          targets[i3 + 2] = r * Math.cos(phi);
          break;
        }
        case 3: {
          targets[i3] = (Math.random() - 0.5) * 20;
          targets[i3 + 1] = (Math.random() - 0.5) * 20;
          targets[i3 + 2] = (Math.random() - 0.5) * 20;
          vels[i3] = (Math.random() - 0.5) * 0.1;
          vels[i3 + 1] = (Math.random() - 0.5) * 0.1;
          vels[i3 + 2] = (Math.random() - 0.5) * 0.1;
          break;
        }
        case 4: {
          const spiralAngle = (i / PARTICLE_COUNT) * Math.PI * 8;
          const spiralRadius = (i / PARTICLE_COUNT) * 4;
          targets[i3] = Math.cos(spiralAngle) * spiralRadius;
          targets[i3 + 1] = (i / PARTICLE_COUNT - 0.5) * 6;
          targets[i3 + 2] = Math.sin(spiralAngle) * spiralRadius;
          break;
        }
        case 5: {
          const cols = 60;
          const row = Math.floor(i / cols);
          const col = i % cols;
          targets[i3] = (col / cols - 0.5) * 8;
          targets[i3 + 1] = (row / (PARTICLE_COUNT / cols) - 0.5) * 8;
          targets[i3 + 2] = Math.sin(col * 0.3 + row * 0.3) * radius * 0.1;
          break;
        }
      }
    }
  }, [slideIndex]);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    const geometry = meshRef.current.geometry;
    const posAttr = geometry.getAttribute("position");
    const posArray = posAttr.array as Float32Array;
    const targets = targetPositions.current;

    const lerpFactor = Math.min(delta * 3, 1);

    for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
      posArray[i] += (targets[i] - posArray[i]) * lerpFactor;
    }

    posAttr.needsUpdate = true;
  });

  const particleColor = useMemo(() => new THREE.Color(color), [color]);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color={particleColor}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function ParticleScene({
  slideIndex,
  color,
}: {
  slideIndex: number;
  color: string;
}) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <Particles slideIndex={slideIndex} color={color} />
    </>
  );
}

export function WebGLParticleDeck() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((p) => Math.min(p + 1, SLIDES.length - 1));
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => Math.max(p - 1, 0));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const slide = SLIDES[current];

  return (
    <div
      className="w-full h-screen relative overflow-hidden"
      style={{ backgroundColor: slide.bgColor }}
    >
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ParticleScene slideIndex={current} color={slide.particleColor} />
        </Canvas>
      </div>

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
              className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4"
              style={{ textShadow: `0 0 60px ${slide.particleColor}40` }}
            >
              {slide.title}
            </h2>
            <p className="text-xl text-white/50 font-light">{slide.subtitle}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-8 h-1.5 rounded-full transition-all ${
              i === current ? "bg-white" : "bg-white/20"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-xs text-white/20 z-20">
        {current + 1} / {SLIDES.length}
      </div>

      <div
        className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize z-10"
        onClick={prev}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize z-10"
        onClick={next}
      />
    </div>
  );
}
