import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Vec2 = { x: number; y: number };

type CanvasStop = {
  id: string;
  pos: Vec2;
  scale: number;
  rotation: number;
  title: string;
  description: string;
  color: string;
  items?: string[];
};

type Connection = {
  from: string;
  to: string;
};

const STOPS: CanvasStop[] = [
  {
    id: "center",
    pos: { x: 2500, y: 2500 },
    scale: 1,
    rotation: 0,
    title: "The JavaScript Ecosystem",
    description:
      "A living, breathing universe of tools, frameworks, and runtimes.",
    color: "#f59e0b",
  },
  {
    id: "react",
    pos: { x: 1400, y: 1800 },
    scale: 1.2,
    rotation: -3,
    title: "React",
    description:
      "Component-based UI library. Virtual DOM, hooks, server components.",
    color: "#3b82f6",
    items: [
      "Hooks API",
      "Server Components",
      "Concurrent Mode",
      "React Native",
      "Next.js",
    ],
  },
  {
    id: "vue",
    pos: { x: 3400, y: 1600 },
    scale: 1.2,
    rotation: 2,
    title: "Vue.js",
    description:
      "Progressive framework. Reactivity system, Composition API, Nuxt.",
    color: "#22c55e",
    items: ["Composition API", "Pinia", "Nuxt 3", "Volar", "Vue Router"],
  },
  {
    id: "svelte",
    pos: { x: 2500, y: 1200 },
    scale: 1.3,
    rotation: -2,
    title: "Svelte",
    description: "Compile-time framework. No virtual DOM, runes, SvelteKit.",
    color: "#ef4444",
    items: [
      "Runes",
      "SvelteKit",
      "No Virtual DOM",
      "Compile-time",
      "Transitions",
    ],
  },
  {
    id: "runtimes",
    pos: { x: 1200, y: 3200 },
    scale: 1.1,
    rotation: 4,
    title: "Runtimes",
    description: "JavaScript beyond the browser: Node.js, Deno, Bun.",
    color: "#a855f7",
    items: [
      "Node.js (2009)",
      "Deno (2018)",
      "Bun (2022)",
      "Workers Runtime",
      "WinterCG",
    ],
  },
  {
    id: "build-tools",
    pos: { x: 3600, y: 3000 },
    scale: 1.15,
    rotation: -5,
    title: "Build Tools",
    description: "Bundlers and compilers that power the modern web.",
    color: "#06b6d4",
    items: ["Vite", "esbuild", "Turbopack", "Rollup", "webpack"],
  },
  {
    id: "testing",
    pos: { x: 800, y: 2500 },
    scale: 1.1,
    rotation: 3,
    title: "Testing",
    description: "Quality assurance across unit, integration, and E2E.",
    color: "#ec4899",
    items: ["Vitest", "Jest", "Playwright", "Cypress", "Testing Library"],
  },
  {
    id: "typescript",
    pos: { x: 2500, y: 3800 },
    scale: 1.2,
    rotation: -1,
    title: "TypeScript",
    description: "JavaScript with types. Now powering 78% of JS projects.",
    color: "#2563eb",
    items: [
      "Strict Mode",
      "Generics",
      "Type Guards",
      "Utility Types",
      "Declaration Files",
    ],
  },
  {
    id: "future",
    pos: { x: 4000, y: 2000 },
    scale: 1,
    rotation: 6,
    title: "The Future",
    description: "AI-assisted development, edge computing, WebAssembly.",
    color: "#f97316",
    items: [
      "AI Copilots",
      "Edge Functions",
      "WASM",
      "TC39 Proposals",
      "Web Components",
    ],
  },
];

const CONNECTIONS: Connection[] = [
  { from: "center", to: "react" },
  { from: "center", to: "vue" },
  { from: "center", to: "svelte" },
  { from: "center", to: "runtimes" },
  { from: "center", to: "build-tools" },
  { from: "center", to: "testing" },
  { from: "center", to: "typescript" },
  { from: "center", to: "future" },
  { from: "react", to: "testing" },
  { from: "vue", to: "build-tools" },
  { from: "svelte", to: "build-tools" },
  { from: "runtimes", to: "typescript" },
  { from: "typescript", to: "build-tools" },
  { from: "future", to: "svelte" },
];

const CANVAS_SIZE = 5000;
const OVERVIEW_SCALE = 0.12;

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

export function SpatialCanvas() {
  const reducedMotion = useReducedMotion();
  const [currentStop, setCurrentStop] = useState(0);
  const [overview, setOverview] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ w: 800, h: 600 });
  const [manualZoom, setManualZoom] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{
    x: number;
    y: number;
    cx: number;
    cy: number;
  } | null>(null);
  const [camera, setCamera] = useState<Vec2>(() => ({
    x: STOPS[0].pos.x,
    y: STOPS[0].pos.y,
  }));

  const stopMap = useMemo(() => {
    const map = new Map<string, CanvasStop>();
    for (const s of STOPS) map.set(s.id, s);
    return map;
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setViewportSize({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const navigateTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, STOPS.length - 1));
    setCurrentStop(clamped);
    setCamera({ x: STOPS[clamped].pos.x, y: STOPS[clamped].pos.y });
    setOverview(false);
    setManualZoom(null);
  }, []);

  const toggleOverview = useCallback(() => {
    setOverview((o) => {
      if (!o) {
        setCamera({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 });
        setManualZoom(null);
      } else {
        const stop = STOPS[currentStop];
        setCamera({ x: stop.pos.x, y: stop.pos.y });
      }
      return !o;
    });
  }, [currentStop]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        navigateTo(currentStop + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigateTo(currentStop - 1);
      } else if (e.key === "o" || e.key === "Escape") {
        e.preventDefault();
        toggleOverview();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentStop, navigateTo, toggleOverview]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setManualZoom((prev) => {
        const current =
          prev ?? (overview ? OVERVIEW_SCALE : STOPS[currentStop].scale * 0.5);
        const delta = e.deltaY > 0 ? 0.95 : 1.05;
        return Math.max(0.05, Math.min(2, current * delta));
      });
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [overview, currentStop]);

  const handlePointerDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        cx: camera.x,
        cy: camera.y,
      };
    },
    [camera],
  );

  const handlePointerMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || !dragStart.current) return;
      const currentScale =
        manualZoom ??
        (overview ? OVERVIEW_SCALE : STOPS[currentStop].scale * 0.5);
      const dx = (e.clientX - dragStart.current.x) / currentScale;
      const dy = (e.clientY - dragStart.current.y) / currentScale;
      setCamera({
        x: dragStart.current.cx - dx,
        y: dragStart.current.cy - dy,
      });
    },
    [isDragging, manualZoom, overview, currentStop],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        dragStart.current = {
          x: t.clientX,
          y: t.clientY,
          cx: camera.x,
          cy: camera.y,
        };
        setIsDragging(true);
      }
    },
    [camera],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || !dragStart.current || e.touches.length !== 1) return;
      const t = e.touches[0];
      const currentScale =
        manualZoom ??
        (overview ? OVERVIEW_SCALE : STOPS[currentStop].scale * 0.5);
      const dx = (t.clientX - dragStart.current.x) / currentScale;
      const dy = (t.clientY - dragStart.current.y) / currentScale;
      setCamera({
        x: dragStart.current.cx - dx,
        y: dragStart.current.cy - dy,
      });
    },
    [isDragging, manualZoom, overview, currentStop],
  );

  const scale =
    manualZoom ?? (overview ? OVERVIEW_SCALE : STOPS[currentStop].scale * 0.5);
  const rotation = overview ? 0 : STOPS[currentStop].rotation;
  const translateX = viewportSize.w / 2 - camera.x * scale;
  const translateY = viewportSize.h / 2 - camera.y * scale;

  const minimapScale = 0.025;
  const minimapW = CANVAS_SIZE * minimapScale;
  const minimapH = CANVAS_SIZE * minimapScale;
  const vpW = (viewportSize.w / scale) * minimapScale;
  const vpH = (viewportSize.h / scale) * minimapScale;
  const vpX = (camera.x - viewportSize.w / (2 * scale)) * minimapScale;
  const vpY = (camera.y - viewportSize.h / (2 * scale)) * minimapScale;

  const handleMinimapClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / minimapScale;
      const my = (e.clientY - rect.top) / minimapScale;
      setCamera({ x: mx, y: my });
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-screen bg-gray-950 text-white overflow-hidden relative select-none"
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handlePointerUp}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <motion.div
        animate={{
          x: translateX,
          y: translateY,
          scale,
          rotate: rotation,
        }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 80, damping: 20, mass: 1.5 }
        }
        style={{
          width: CANVAS_SIZE,
          height: CANVAS_SIZE,
          transformOrigin: "0 0",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
        >
          {CONNECTIONS.map((c, i) => {
            const from = stopMap.get(c.from);
            const to = stopMap.get(c.to);
            if (!from || !to) return null;
            const mx = (from.pos.x + to.pos.x) / 2;
            const my = (from.pos.y + to.pos.y) / 2 - 80;
            return (
              <path
                key={i}
                d={`M ${from.pos.x} ${from.pos.y} Q ${mx} ${my} ${to.pos.x} ${to.pos.y}`}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={2}
                fill="none"
                strokeDasharray="8 6"
              />
            );
          })}
        </svg>

        {STOPS.map((stop, idx) => {
          const isActive = idx === currentStop && !overview;
          return (
            <div
              key={stop.id}
              className="absolute"
              style={{
                left: stop.pos.x - 200,
                top: stop.pos.y - 120,
                width: 400,
              }}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.05 : 1,
                  opacity: overview ? 0.8 : isActive ? 1 : 0.4,
                }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.4 }}
                className={`p-6 rounded-xl border backdrop-blur-sm cursor-pointer`}
                style={{
                  borderColor: stop.color + (isActive ? "80" : "30"),
                  backgroundColor: stop.color + "10",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo(idx);
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: stop.color }}
                  />
                  <h2
                    className="text-xl font-bold"
                    style={{ color: stop.color }}
                  >
                    {stop.title}
                  </h2>
                </div>
                <p className="text-sm text-white/60 mb-3">{stop.description}</p>
                {stop.items && (
                  <div className="flex flex-wrap gap-1.5">
                    {stop.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 text-xs rounded-full border"
                        style={{
                          borderColor: stop.color + "40",
                          color: stop.color,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      <div className="absolute top-3 left-3 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={overview ? "overview" : currentStop}
            initial={reducedMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-gray-900/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700"
          >
            <h1 className="text-sm font-bold">
              {overview ? "Overview" : STOPS[currentStop].title}
            </h1>
            <p className="text-[10px] text-white/50">
              {overview
                ? "Click a cluster to zoom in"
                : `${currentStop + 1}/${STOPS.length} | O: Overview`}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className="absolute bottom-14 right-3 z-30 border border-gray-700 rounded-lg overflow-hidden bg-gray-900/80 backdrop-blur-sm cursor-crosshair"
        style={{ width: minimapW, height: minimapH }}
        onClick={handleMinimapClick}
      >
        {STOPS.map((stop) => (
          <div
            key={stop.id}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: stop.pos.x * minimapScale - 4,
              top: stop.pos.y * minimapScale - 4,
              backgroundColor: stop.color,
            }}
          />
        ))}
        <div
          className="absolute border border-white/40 rounded-sm"
          style={{
            left: Math.max(0, vpX),
            top: Math.max(0, vpY),
            width: Math.min(vpW, minimapW),
            height: Math.min(vpH, minimapH),
          }}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 py-3 bg-gradient-to-t from-gray-950 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo(currentStop - 1)}
              disabled={currentStop === 0}
              className="text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={toggleOverview}
              className="text-xs text-white/40 hover:text-white transition-colors"
            >
              {overview ? "Close" : "Overview (O)"}
            </button>
          </div>
          <div className="flex gap-1.5">
            {STOPS.map((_, i) => (
              <button
                key={i}
                onClick={() => navigateTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStop && !overview
                    ? "bg-white scale-150"
                    : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => navigateTo(currentStop + 1)}
            disabled={currentStop === STOPS.length - 1}
            className="text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
        <p className="text-[10px] text-white/30 text-center mt-1">
          ←→ Navigate | O: Overview | Scroll: Zoom | Drag: Pan
        </p>
      </div>
    </div>
  );
}
