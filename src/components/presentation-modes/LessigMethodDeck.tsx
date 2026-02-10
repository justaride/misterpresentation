import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Phase = "idle" | "running" | "paused" | "finished";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatMmSs(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const CUES: Array<{ text: string; sub?: string; tone?: "ink" | "accent" | "warn" }> = [
  { text: "Lessig", sub: "Slides as punctuation.", tone: "accent" },
  { text: "Speed", sub: "Not chaos.", tone: "ink" },
  { text: "Timing", sub: "Be intentional.", tone: "ink" },
  { text: "One idea", sub: "Per cue.", tone: "warn" },
  { text: "Change", sub: "On the beat.", tone: "accent" },
  { text: "Reset", sub: "If you lose the room.", tone: "warn" },
  { text: "Cue", sub: "As a sentence.", tone: "ink" },
  { text: "Cue", sub: "As a breath.", tone: "ink" },
  { text: "Cue", sub: "As a laugh.", tone: "ink" },
  { text: "Cut", sub: "Everything else.", tone: "warn" },
  { text: "Choreography", sub: "You are the motion.", tone: "accent" },
  { text: "Text", sub: "Big. Centered. Loud.", tone: "ink" },
  { text: "Contrast", sub: "Make it legible.", tone: "ink" },
  { text: "Silence", sub: "Is a slide too.", tone: "warn" },
  { text: "Signal", sub: "The room votes with attention.", tone: "accent" },
  { text: "Rehearse", sub: "Fast mode is a drill.", tone: "ink" },
  { text: "Pause", sub: "When meaning lands.", tone: "warn" },
  { text: "Resume", sub: "Before the energy drops.", tone: "accent" },
  { text: "End", sub: "With a decision.", tone: "warn" },
  { text: "Q&A", sub: "Then ship the next cut.", tone: "accent" },
];

function toneBg(tone: string | undefined) {
  if (tone === "accent") return "from-cyan-500/15 to-fuchsia-500/10";
  if (tone === "warn") return "from-amber-500/15 to-rose-500/10";
  return "from-white/10 to-white/0";
}

export function LessigMethodDeck() {
  const reducedMotion = useReducedMotion();
  const [searchParams] = useSearchParams();

  const tempoMs = clamp(Number(searchParams.get("tempoMs") ?? "1200") || 1200, 120, 60_000);
  const autostart = searchParams.get("autostart") === "1";

  const [phase, setPhase] = useState<Phase>(autostart ? "running" : "idle");
  const [index, setIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const startedAtRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);

  const cue = CUES[index] ?? CUES[0];
  const positionLabel = `${index + 1} / ${CUES.length}`;

  const setRunning = useCallback((running: boolean) => {
    setPhase((p) => {
      if (running) {
        return p === "finished" ? "finished" : "running";
      }
      return p === "finished" ? "finished" : "paused";
    });
  }, []);

  const reset = useCallback(() => {
    setIndex(0);
    setElapsedMs(0);
    elapsedRef.current = 0;
    startedAtRef.current = phase === "running" ? Date.now() : null;
    setPhase(autostart ? "running" : "idle");
  }, [autostart, phase]);

  const next = useCallback(() => {
    setIndex((p) => clamp(p + 1, 0, CUES.length - 1));
  }, []);

  const prev = useCallback(() => {
    setIndex((p) => clamp(p - 1, 0, CUES.length - 1));
  }, []);

  useEffect(() => {
    if (phase !== "running") return;

    const tick = () => {
      const now = Date.now();
      if (startedAtRef.current == null) startedAtRef.current = now;
      const total = elapsedRef.current + (now - startedAtRef.current);
      setElapsedMs(total);
    };

    const id = window.setInterval(tick, 100);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase !== "running") return;
    if (index >= CUES.length - 1) {
      setPhase("finished");
      return;
    }
    const id = window.setTimeout(() => {
      setIndex((p) => {
        const nextIdx = Math.min(p + 1, CUES.length - 1);
        if (nextIdx >= CUES.length - 1) setPhase("finished");
        return nextIdx;
      });
    }, tempoMs);
    return () => window.clearTimeout(id);
  }, [index, phase, tempoMs]);

  useEffect(() => {
    // Maintain elapsed clock across pauses.
    if (phase === "running") {
      startedAtRef.current = Date.now();
      return;
    }
    if (startedAtRef.current != null) {
      elapsedRef.current += Date.now() - startedAtRef.current;
      startedAtRef.current = null;
    }
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setRunning(!(phase === "running"));
      }
      if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, phase, prev, reset, setRunning]);

  const totalSeconds = useMemo(() => Math.floor(elapsedMs / 1000), [elapsedMs]);

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col" data-testid="lessig-deck">
      <header className="border-b border-border bg-card/40 p-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-lg leading-none">Lessig Method Deck</h1>
          <p className="text-xs font-mono text-fg/50">
            tempo {tempoMs}ms |{" "}
            <span data-testid="lessig-slide-position">{positionLabel}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-mono bg-white/5 text-fg/70">
            time {formatMmSs(totalSeconds)}
          </span>

          <button
            type="button"
            onClick={prev}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-mono bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Previous cue"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>

          <button
            type="button"
            onClick={() => setRunning(!(phase === "running"))}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-mono transition-colors",
              phase === "running"
                ? "border-amber-300/25 bg-amber-500/10 hover:bg-amber-500/15"
                : "border-cyan-300/25 bg-cyan-500/10 hover:bg-cyan-500/15",
            )}
            aria-label={phase === "running" ? "Pause" : "Play"}
          >
            {phase === "running" ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {phase === "running" ? "Pause" : "Play"}
          </button>

          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-mono bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Next cue"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-mono bg-white/5 hover:bg-white/10 transition-colors"
            aria-label="Reset"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </header>

      <main className="flex-1 grid place-items-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-70">
          <div
            className={clsx(
              "absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl",
              "bg-gradient-to-br",
              toneBg(cue.tone),
            )}
          />
          <div className="absolute -bottom-28 -right-28 h-[520px] w-[520px] rounded-full bg-white/5 blur-3xl" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${index}:${cue.text}`}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.99 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -14, scale: 0.99 }}
            transition={{ duration: 0.18 }}
            className="relative text-center max-w-5xl"
          >
            <div className="font-display uppercase tracking-tight text-6xl sm:text-7xl md:text-8xl leading-[0.9]">
              {cue.text}
            </div>
            {cue.sub ? (
              <div className="mt-6 text-xl sm:text-2xl text-fg/70">
                {cue.sub}
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-4 text-xs font-mono text-fg/50">
          <span>{phase}</span>
          <span className="hidden sm:inline">
            Space: pause/resume | R: reset | arrows: nav
          </span>
          <span>
            {formatMmSs(totalSeconds)} | {tempoMs}ms
          </span>
        </div>
      </main>
    </div>
  );
}

