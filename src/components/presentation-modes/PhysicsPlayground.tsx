import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Vec2 = { x: number; y: number };

type PhysicsBody = {
  id: number;
  pos: Vec2;
  vel: Vec2;
  size: Vec2;
  mass: number;
  restitution: number;
  friction: number;
  color: string;
  label: string;
  isCircle: boolean;
  radius: number;
  grounded: boolean;
};

type SlideData = {
  title: string;
  subtitle: string;
  bodies: Omit<PhysicsBody, "id" | "vel" | "grounded">[];
  gravityAngle: number;
};

const SLIDES: SlideData[] = [
  {
    title: "Web Performance 101",
    subtitle: "Core metrics that matter",
    gravityAngle: 0,
    bodies: [
      {
        pos: { x: 200, y: -80 },
        size: { x: 160, y: 50 },
        mass: 3,
        restitution: 0.4,
        friction: 0.3,
        color: "#ef4444",
        label: "LCP",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 420, y: -160 },
        size: { x: 120, y: 50 },
        mass: 2,
        restitution: 0.5,
        friction: 0.3,
        color: "#3b82f6",
        label: "FID",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 600, y: -240 },
        size: { x: 140, y: 50 },
        mass: 2.5,
        restitution: 0.45,
        friction: 0.3,
        color: "#22c55e",
        label: "CLS",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 340, y: -320 },
        size: { x: 100, y: 50 },
        mass: 1.5,
        restitution: 0.6,
        friction: 0.3,
        color: "#a855f7",
        label: "INP",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 150, y: -400 },
        size: { x: 130, y: 50 },
        mass: 2,
        restitution: 0.5,
        friction: 0.3,
        color: "#f59e0b",
        label: "TTFB",
        isCircle: false,
        radius: 0,
      },
    ],
  },
  {
    title: "Largest Contentful Paint",
    subtitle: "Measures loading performance — aim for <2.5s",
    gravityAngle: 0,
    bodies: [
      {
        pos: { x: 150, y: -60 },
        size: { x: 0, y: 0 },
        mass: 4,
        restitution: 0.3,
        friction: 0.4,
        color: "#ef4444",
        label: "2.5s",
        isCircle: true,
        radius: 40,
      },
      {
        pos: { x: 350, y: -140 },
        size: { x: 180, y: 44 },
        mass: 3,
        restitution: 0.4,
        friction: 0.3,
        color: "#dc2626",
        label: "Hero Image",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 550, y: -220 },
        size: { x: 160, y: 44 },
        mass: 2.5,
        restitution: 0.5,
        friction: 0.3,
        color: "#b91c1c",
        label: "H1 Text",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 250, y: -300 },
        size: { x: 200, y: 44 },
        mass: 3.5,
        restitution: 0.35,
        friction: 0.3,
        color: "#991b1b",
        label: "Video Poster",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 480, y: -380 },
        size: { x: 0, y: 0 },
        mass: 1.5,
        restitution: 0.6,
        friction: 0.3,
        color: "#fca5a5",
        label: "Good",
        isCircle: true,
        radius: 28,
      },
    ],
  },
  {
    title: "Interaction to Next Paint",
    subtitle: "Replaces FID — measures full interaction responsiveness",
    gravityAngle: Math.PI / 6,
    bodies: [
      {
        pos: { x: 200, y: -80 },
        size: { x: 140, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.25,
        color: "#3b82f6",
        label: "Click",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 400, y: -160 },
        size: { x: 140, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.25,
        color: "#2563eb",
        label: "Keypress",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 300, y: -240 },
        size: { x: 120, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.25,
        color: "#1d4ed8",
        label: "Tap",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 550, y: -320 },
        size: { x: 0, y: 0 },
        mass: 3,
        restitution: 0.4,
        friction: 0.3,
        color: "#60a5fa",
        label: "200ms",
        isCircle: true,
        radius: 35,
      },
      {
        pos: { x: 150, y: -400 },
        size: { x: 180, y: 44 },
        mass: 2.5,
        restitution: 0.45,
        friction: 0.25,
        color: "#93c5fd",
        label: "Main Thread",
        isCircle: false,
        radius: 0,
      },
    ],
  },
  {
    title: "Cumulative Layout Shift",
    subtitle: "Visual stability — aim for <0.1",
    gravityAngle: -Math.PI / 8,
    bodies: [
      {
        pos: { x: 180, y: -100 },
        size: { x: 160, y: 44 },
        mass: 2,
        restitution: 0.6,
        friction: 0.2,
        color: "#22c55e",
        label: "Ad Inject",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 420, y: -180 },
        size: { x: 180, y: 44 },
        mass: 2.5,
        restitution: 0.55,
        friction: 0.2,
        color: "#16a34a",
        label: "Font Swap",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 600, y: -260 },
        size: { x: 200, y: 44 },
        mass: 3,
        restitution: 0.5,
        friction: 0.2,
        color: "#15803d",
        label: "Image Resize",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 300, y: -340 },
        size: { x: 0, y: 0 },
        mass: 1,
        restitution: 0.7,
        friction: 0.2,
        color: "#86efac",
        label: "0.1",
        isCircle: true,
        radius: 25,
      },
      {
        pos: { x: 500, y: -420 },
        size: { x: 170, y: 44 },
        mass: 2,
        restitution: 0.6,
        friction: 0.2,
        color: "#4ade80",
        label: "Dynamic DOM",
        isCircle: false,
        radius: 0,
      },
    ],
  },
  {
    title: "Time to First Byte",
    subtitle: "Server responsiveness — aim for <800ms",
    gravityAngle: 0,
    bodies: [
      {
        pos: { x: 160, y: -80 },
        size: { x: 140, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.3,
        color: "#f59e0b",
        label: "DNS",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 370, y: -160 },
        size: { x: 120, y: 44 },
        mass: 1.5,
        restitution: 0.55,
        friction: 0.3,
        color: "#d97706",
        label: "TLS",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 550, y: -240 },
        size: { x: 160, y: 44 },
        mass: 2.5,
        restitution: 0.45,
        friction: 0.3,
        color: "#b45309",
        label: "Server",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 250, y: -320 },
        size: { x: 0, y: 0 },
        mass: 3,
        restitution: 0.4,
        friction: 0.3,
        color: "#fbbf24",
        label: "800ms",
        isCircle: true,
        radius: 35,
      },
      {
        pos: { x: 450, y: -400 },
        size: { x: 140, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.3,
        color: "#fcd34d",
        label: "CDN",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 300, y: -480 },
        size: { x: 150, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.3,
        color: "#fde68a",
        label: "Cache",
        isCircle: false,
        radius: 0,
      },
    ],
  },
  {
    title: "Optimization Strategies",
    subtitle: "Lighten the load — smaller means faster",
    gravityAngle: Math.PI / 4,
    bodies: [
      {
        pos: { x: 200, y: -60 },
        size: { x: 0, y: 0 },
        mass: 1,
        restitution: 0.7,
        friction: 0.2,
        color: "#a855f7",
        label: "Lazy",
        isCircle: true,
        radius: 22,
      },
      {
        pos: { x: 400, y: -140 },
        size: { x: 160, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.25,
        color: "#9333ea",
        label: "Code Split",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 300, y: -220 },
        size: { x: 140, y: 44 },
        mass: 1.5,
        restitution: 0.6,
        friction: 0.25,
        color: "#7c3aed",
        label: "Compress",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 550, y: -300 },
        size: { x: 130, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.25,
        color: "#6d28d9",
        label: "Prefetch",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 180, y: -380 },
        size: { x: 0, y: 0 },
        mass: 1.5,
        restitution: 0.65,
        friction: 0.2,
        color: "#c084fc",
        label: "CDN",
        isCircle: true,
        radius: 26,
      },
      {
        pos: { x: 450, y: -460 },
        size: { x: 170, y: 44 },
        mass: 2.5,
        restitution: 0.45,
        friction: 0.25,
        color: "#a78bfa",
        label: "Tree Shake",
        isCircle: false,
        radius: 0,
      },
    ],
  },
  {
    title: "The Performance Budget",
    subtitle: "Set limits, measure always, ship fast",
    gravityAngle: 0,
    bodies: [
      {
        pos: { x: 250, y: -80 },
        size: { x: 0, y: 0 },
        mass: 5,
        restitution: 0.3,
        friction: 0.4,
        color: "#06b6d4",
        label: "170KB",
        isCircle: true,
        radius: 45,
      },
      {
        pos: { x: 480, y: -180 },
        size: { x: 180, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.3,
        color: "#0891b2",
        label: "JS Budget",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 200, y: -280 },
        size: { x: 170, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.3,
        color: "#0e7490",
        label: "CSS Budget",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 400, y: -360 },
        size: { x: 200, y: 44 },
        mass: 2.5,
        restitution: 0.45,
        friction: 0.3,
        color: "#155e75",
        label: "Image Budget",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 600, y: -440 },
        size: { x: 160, y: 44 },
        mass: 2,
        restitution: 0.5,
        friction: 0.3,
        color: "#67e8f9",
        label: "Font Budget",
        isCircle: false,
        radius: 0,
      },
      {
        pos: { x: 300, y: -520 },
        size: { x: 0, y: 0 },
        mass: 1.5,
        restitution: 0.6,
        friction: 0.3,
        color: "#a5f3fc",
        label: "CI",
        isCircle: true,
        radius: 24,
      },
    ],
  },
];

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function createBodies(slide: SlideData): PhysicsBody[] {
  return slide.bodies.map((b, i) => ({
    ...b,
    id: i,
    vel: { x: 0, y: 0 },
    grounded: false,
  }));
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function PhysicsPlayground() {
  const reducedMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bodies, setBodies] = useState<PhysicsBody[]>(() =>
    createBodies(SLIDES[0]),
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bodiesRef = useRef<PhysicsBody[]>(bodies);
  const animRef = useRef<number>(0);
  const dragRef = useRef<{
    bodyId: number;
    offset: Vec2;
    lastPos: Vec2;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: 800, h: 600 });

  const gravityAngle = SLIDES[currentSlide].gravityAngle;
  const gravityRef = useRef({
    x: Math.sin(gravityAngle) * 980,
    y: Math.cos(gravityAngle) * 980,
  });

  useEffect(() => {
    const angle = SLIDES[currentSlide].gravityAngle;
    gravityRef.current = { x: Math.sin(angle) * 980, y: Math.cos(angle) * 980 };
  }, [currentSlide]);

  useEffect(() => {
    bodiesRef.current = bodies;
  }, [bodies]);

  const resetSlide = useCallback((slideIdx: number) => {
    const newBodies = createBodies(SLIDES[slideIdx]);
    setBodies(newBodies);
    bodiesRef.current = newBodies;
  }, []);

  useEffect(() => {
    resetSlide(currentSlide);
  }, [currentSlide, resetSlide]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        sizeRef.current = {
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        };
        if (canvasRef.current) {
          canvasRef.current.width = sizeRef.current.w;
          canvasRef.current.height = sizeRef.current.h;
        }
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      const W = sizeRef.current.w;
      const H = sizeRef.current.h;
      const bds = bodiesRef.current;
      const g = gravityRef.current;

      for (const body of bds) {
        if (dragRef.current && dragRef.current.bodyId === body.id) continue;

        body.vel.x += g.x * dt;
        body.vel.y += g.y * dt;

        body.vel.x *= 0.999;
        body.vel.y *= 0.999;

        body.pos.x += body.vel.x * dt;
        body.pos.y += body.vel.y * dt;

        body.grounded = false;

        if (body.isCircle) {
          const r = body.radius;
          if (body.pos.y + r > H - 40) {
            body.pos.y = H - 40 - r;
            body.vel.y = -body.vel.y * body.restitution;
            body.vel.x *= 1 - body.friction;
            if (Math.abs(body.vel.y) < 15) {
              body.vel.y = 0;
              body.grounded = true;
            }
          }
          if (body.pos.y - r < 0) {
            body.pos.y = r;
            body.vel.y = -body.vel.y * body.restitution;
          }
          if (body.pos.x + r > W) {
            body.pos.x = W - r;
            body.vel.x = -body.vel.x * body.restitution;
          }
          if (body.pos.x - r < 0) {
            body.pos.x = r;
            body.vel.x = -body.vel.x * body.restitution;
          }
        } else {
          const hw = body.size.x / 2;
          const hh = body.size.y / 2;
          if (body.pos.y + hh > H - 40) {
            body.pos.y = H - 40 - hh;
            body.vel.y = -body.vel.y * body.restitution;
            body.vel.x *= 1 - body.friction;
            if (Math.abs(body.vel.y) < 15) {
              body.vel.y = 0;
              body.grounded = true;
            }
          }
          if (body.pos.y - hh < 0) {
            body.pos.y = hh;
            body.vel.y = -body.vel.y * body.restitution;
          }
          if (body.pos.x + hw > W) {
            body.pos.x = W - hw;
            body.vel.x = -body.vel.x * body.restitution;
          }
          if (body.pos.x - hw < 0) {
            body.pos.x = hw;
            body.vel.x = -body.vel.x * body.restitution;
          }
        }
      }

      for (let i = 0; i < bds.length; i++) {
        for (let j = i + 1; j < bds.length; j++) {
          const a = bds[i];
          const b = bds[j];
          resolveCollision(a, b);
        }
      }

      ctx.clearRect(0, 0, W, H);

      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.fillRect(0, H - 40, W, 40);
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(0, H - 40, W, 1);

      for (const body of bds) {
        ctx.save();
        if (body.isCircle) {
          ctx.beginPath();
          ctx.arc(body.pos.x, body.pos.y, body.radius, 0, Math.PI * 2);
          ctx.fillStyle = body.color + "30";
          ctx.fill();
          ctx.strokeStyle = body.color;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "#fff";
          ctx.font = `bold ${body.radius * 0.7}px ui-monospace, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(body.label, body.pos.x, body.pos.y);
        } else {
          const x = body.pos.x - body.size.x / 2;
          const y = body.pos.y - body.size.y / 2;
          ctx.fillStyle = body.color + "25";
          ctx.strokeStyle = body.color;
          ctx.lineWidth = 2;

          const r = 8;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + body.size.x - r, y);
          ctx.arcTo(x + body.size.x, y, x + body.size.x, y + r, r);
          ctx.lineTo(x + body.size.x, y + body.size.y - r);
          ctx.arcTo(
            x + body.size.x,
            y + body.size.y,
            x + body.size.x - r,
            y + body.size.y,
            r,
          );
          ctx.lineTo(x + r, y + body.size.y);
          ctx.arcTo(x, y + body.size.y, x, y + body.size.y - r, r);
          ctx.lineTo(x, y + r);
          ctx.arcTo(x, y, x + r, y, r);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#fff";
          ctx.font = "bold 14px ui-sans-serif, system-ui, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(body.label, body.pos.x, body.pos.y);
        }
        ctx.restore();
      }

      setBodies([...bds]);
      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [reducedMotion, currentSlide]);

  const resolveCollision = (a: PhysicsBody, b: PhysicsBody) => {
    const dx = b.pos.x - a.pos.x;
    const dy = b.pos.y - a.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist === 0) return;

    let overlap = 0;

    if (a.isCircle && b.isCircle) {
      overlap = a.radius + b.radius - dist;
    } else if (!a.isCircle && !b.isCircle) {
      const overlapX = a.size.x / 2 + b.size.x / 2 - Math.abs(dx);
      const overlapY = a.size.y / 2 + b.size.y / 2 - Math.abs(dy);
      if (overlapX <= 0 || overlapY <= 0) return;
      overlap = Math.min(overlapX, overlapY);
    } else {
      const circle = a.isCircle ? a : b;
      const rect = a.isCircle ? b : a;
      const cx = clamp(
        circle.pos.x,
        rect.pos.x - rect.size.x / 2,
        rect.pos.x + rect.size.x / 2,
      );
      const cy = clamp(
        circle.pos.y,
        rect.pos.y - rect.size.y / 2,
        rect.pos.y + rect.size.y / 2,
      );
      const cdx = circle.pos.x - cx;
      const cdy = circle.pos.y - cy;
      const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
      if (cdist >= circle.radius || cdist === 0) return;
      overlap = circle.radius - cdist;
    }

    if (overlap <= 0) return;

    const nx = dx / dist;
    const ny = dy / dist;
    const totalMass = a.mass + b.mass;
    const pushA = overlap * (b.mass / totalMass);
    const pushB = overlap * (a.mass / totalMass);

    a.pos.x -= nx * pushA;
    a.pos.y -= ny * pushA;
    b.pos.x += nx * pushB;
    b.pos.y += ny * pushB;

    const dvx = a.vel.x - b.vel.x;
    const dvy = a.vel.y - b.vel.y;
    const dvDotN = dvx * nx + dvy * ny;
    if (dvDotN <= 0) return;

    const restitution = Math.min(a.restitution, b.restitution);
    const impulse = (-(1 + restitution) * dvDotN) / totalMass;

    a.vel.x += impulse * b.mass * nx;
    a.vel.y += impulse * b.mass * ny;
    b.vel.x -= impulse * a.mass * nx;
    b.vel.y -= impulse * a.mass * ny;
  };

  const getPointerPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent): Vec2 => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    },
    [],
  );

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const pos = getPointerPos(e);
      const bds = bodiesRef.current;
      for (let i = bds.length - 1; i >= 0; i--) {
        const body = bds[i];
        let hit = false;
        if (body.isCircle) {
          const dx = pos.x - body.pos.x;
          const dy = pos.y - body.pos.y;
          hit = Math.sqrt(dx * dx + dy * dy) <= body.radius;
        } else {
          hit =
            pos.x >= body.pos.x - body.size.x / 2 &&
            pos.x <= body.pos.x + body.size.x / 2 &&
            pos.y >= body.pos.y - body.size.y / 2 &&
            pos.y <= body.pos.y + body.size.y / 2;
        }
        if (hit) {
          dragRef.current = {
            bodyId: body.id,
            offset: { x: pos.x - body.pos.x, y: pos.y - body.pos.y },
            lastPos: pos,
          };
          body.vel = { x: 0, y: 0 };
          break;
        }
      }
    },
    [getPointerPos],
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragRef.current) return;
      const pos = getPointerPos(e);
      const body = bodiesRef.current.find(
        (b) => b.id === dragRef.current!.bodyId,
      );
      if (body) {
        body.pos.x = pos.x - dragRef.current.offset.x;
        body.pos.y = pos.y - dragRef.current.offset.y;
        body.vel = {
          x: (pos.x - dragRef.current.lastPos.x) * 8,
          y: (pos.y - dragRef.current.lastPos.y) * 8,
        };
        dragRef.current.lastPos = pos;
      }
    },
    [getPointerPos],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const goToSlide = useCallback((idx: number) => {
    setCurrentSlide(clamp(idx, 0, SLIDES.length - 1));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      } else if (e.key === "r") {
        resetSlide(currentSlide);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentSlide, goToSlide, resetSlide]);

  const slide = SLIDES[currentSlide];

  if (reducedMotion) {
    return (
      <div className="w-full h-full min-h-screen bg-gray-950 text-white flex flex-col">
        <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
          <h1 className="text-lg font-bold">{slide.title}</h1>
          <span className="text-xs font-mono text-white/40">
            {currentSlide + 1}/{SLIDES.length}
          </span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-white/60 mb-8">{slide.subtitle}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {slide.bodies.map((b, i) => (
              <div
                key={i}
                className="px-4 py-2 rounded-lg border text-sm font-medium text-white"
                style={{
                  borderColor: b.color,
                  backgroundColor: b.color + "20",
                }}
              >
                {b.label}
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-gray-800 flex items-center justify-between">
          <button
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="text-xs text-white/40 hover:text-white disabled:opacity-30"
          >
            ← Prev
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2 h-2 rounded-full ${i === currentSlide ? "bg-white" : "bg-white/20"}`}
              />
            ))}
          </div>
          <button
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide === SLIDES.length - 1}
            className="text-xs text-white/40 hover:text-white disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-screen bg-gray-950 text-white flex flex-col relative"
    >
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-gray-950 via-gray-950/80 to-transparent pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <h1 className="text-xl font-bold">{slide.title}</h1>
            <p className="text-xs text-white/50">{slide.subtitle}</p>
          </motion.div>
        </AnimatePresence>
        <span className="text-xs font-mono text-white/40 pointer-events-auto">
          {currentSlide + 1}/{SLIDES.length}
        </span>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />

      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3 border-t border-gray-800/50 bg-gradient-to-t from-gray-950 via-gray-950/80 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => goToSlide(currentSlide - 1)}
              disabled={currentSlide === 0}
              className="text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => resetSlide(currentSlide)}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              Reset (R)
            </button>
          </div>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentSlide
                    ? "bg-white scale-150"
                    : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide === SLIDES.length - 1}
            className="text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
        <p className="text-[10px] text-white/30 text-center mt-1">
          Grab & throw objects | ←→ Navigate | R: Reset
        </p>
      </div>
    </div>
  );
}
