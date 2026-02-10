import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { useSearchParams } from "react-router-dom";

type Slide = { id: string; kicker?: string; title: string; body?: string };

const SLIDES: Slide[] = [
  {
    id: "rule",
    kicker: "THE RULE",
    title: "10 / 20 / 30",
    body: "10 slides.\n20 minutes.\n30pt minimum.",
  },
  {
    id: "why",
    kicker: "WHY IT WORKS",
    title: "Forced clarity",
    body: "If it doesn’t fit,\nit isn’t ready.",
  },
  {
    id: "10",
    kicker: "10 SLIDES",
    title: "Only the spine",
    body: "No appendix.\nNo “just in case.”",
  },
  {
    id: "20",
    kicker: "20 MINUTES",
    title: "Respect time",
    body: "Pace is a feature.\nNot a vibe.",
  },
  {
    id: "30",
    kicker: "30 POINT",
    title: "Readable from the back",
    body: "Big type prevents\nsmall ideas.",
  },
  {
    id: "structure",
    kicker: "STRUCTURE",
    title: "Problem → Change → Proof",
    body: "One claim per slide.\nOne beat per slide.",
  },
  {
    id: "visual",
    kicker: "VISUALS",
    title: "One visual max",
    body: "Let it earn the space.",
  },
  {
    id: "numbers",
    kicker: "NUMBERS",
    title: "Make them legible",
    body: "If it needs a legend,\nit’s too small.",
  },
  {
    id: "demo",
    kicker: "DEMO",
    title: "Show the product",
    body: "Screens are evidence.\nWords are claims.",
  },
  {
    id: "close",
    kicker: "CLOSE",
    title: "End with a decision",
    body: "Ask for the next step.\nThen stop.",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function isTypingTarget(el: EventTarget | null) {
  const tag = (el as HTMLElement | null)?.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || (el as HTMLElement | null)?.isContentEditable;
}

function formatTime(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

export function TenTwentyThirtyDeck() {
  const [searchParams] = useSearchParams();
  const secondsPerMinute = Number(searchParams.get("seconds") ?? 60);
  const speed = secondsPerMinute > 0 ? 60 / secondsPerMinute : 1;
  const autostart = (searchParams.get("autostart") ?? "1") === "1";

  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(autostart);
  const startRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);

  const [tick, setTick] = useState(0);

  const totalTargetSeconds = 20 * 60;
  const virtualElapsedSeconds = useMemo(() => {
    const ms = elapsedRef.current + (running ? Date.now() - startRef.current : 0);
    return (ms / 1000) * speed;
  }, [running, speed, tick]);

  const progress = clamp(virtualElapsedSeconds / totalTargetSeconds, 0, 1);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 250);
    return () => window.clearInterval(id);
  }, []);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, SLIDES.length - 1)), []);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  const reset = useCallback(() => {
    elapsedRef.current = 0;
    startRef.current = Date.now();
    setRunning(true);
  }, []);

  const toggle = useCallback(() => {
    if (running) {
      elapsedRef.current += Date.now() - startRef.current;
      setRunning(false);
      return;
    }
    startRef.current = Date.now();
    setRunning(true);
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "r" || e.key === "R") reset();
      if (e.key === "p" || e.key === "P") toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, reset, toggle]);

  const slide = SLIDES[index] ?? SLIDES[0]!;

  return (
    <div
      data-testid="ttt-deck"
      className="relative w-full h-screen overflow-hidden bg-[#0A0A0A] text-[#F8F5EE] selection:bg-[#B6FF4D]/30"
    >
      {/* Grainy paper-ish glow (dark) */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(182,255,77,0.18),transparent_40%),radial-gradient(circle_at_85%_30%,rgba(255,176,0,0.12),transparent_45%),radial-gradient(circle_at_60%_85%,rgba(255,77,77,0.10),transparent_55%)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px]" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/50">
              10 / 20 / 30
              {secondsPerMinute !== 60 && (
                <span className="ml-2 text-white/35">
                  (rehearsal speed: 1 min = {secondsPerMinute}s)
                </span>
              )}
            </div>
            <div className="font-mono text-xs text-white/60">
              Slide{" "}
              <span data-testid="ttt-slide-position" className="text-white/80">
                {index + 1} / {SLIDES.length}
              </span>{" "}
              <span className="ml-3 text-white/35">Keys: ← → Space | P pause | R reset</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end">
              <div className="font-mono text-xs text-white/75">
                {formatTime(virtualElapsedSeconds)} / 20:00
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                pace
              </div>
            </div>

            <button
              onClick={toggle}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-mono text-xs"
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? "Pause" : "Play"}
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors font-mono text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="h-1 bg-white/5">
          <div
            className="h-1 bg-[#B6FF4D]"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center px-6 pt-28 pb-24"
        >
          <div className="w-full max-w-5xl">
            {slide.kicker && (
              <div className="font-mono text-sm uppercase tracking-[0.22em] text-white/55">
                {slide.kicker}
              </div>
            )}
            {/* Intentionally big type: minimum ~30pt visual on desktop */}
            <h1 className="mt-6 text-6xl md:text-8xl font-black tracking-tight leading-[0.92]">
              {slide.title}
            </h1>
            {slide.body && (
              <p className="mt-8 text-2xl md:text-3xl font-medium text-white/70 leading-relaxed whitespace-pre-line max-w-4xl">
                {slide.body}
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/40 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={index === 0}
            className={clsx(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm transition-colors",
              index === 0
                ? "opacity-40 border-white/10 bg-white/5 pointer-events-none"
                : "border-white/10 bg-white/5 hover:bg-white/10",
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <div className="font-mono text-xs text-white/45">
            30pt minimum is enforced by design, not a linter.
          </div>

          <button
            onClick={next}
            disabled={index >= SLIDES.length - 1}
            className={clsx(
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm transition-colors",
              index >= SLIDES.length - 1
                ? "opacity-40 border-white/10 bg-white/5 pointer-events-none"
                : "border-[#B6FF4D]/30 bg-[#B6FF4D]/10 hover:bg-[#B6FF4D]/15",
            )}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

