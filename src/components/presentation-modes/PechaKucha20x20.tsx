import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  StickyNote,
} from "lucide-react";
import {
  PECHA_KUCHA_20X20_SLIDES,
  type PechaKuchaPattern,
  type PechaKuchaSlide,
} from "../../data/pecha-kucha-20x20";

type Phase = "idle" | "running" | "finished";

type PechaKucha20x20Props = {
  slides?: PechaKuchaSlide[];
};

const PAPER_RGB = "244 237 224";
const INK_RGB = "11 15 26";

// Framer Motion's TS types expect cubic-bezier arrays to be a fixed-length tuple.
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatMmSs(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PatternOverlay({ pattern }: { pattern: PechaKuchaPattern }) {
  const strokeInk = "rgb(var(--pk-ink))";
  const strokeAccent = "rgb(var(--pk-a))";
  const opacityInk = 0.12;
  const opacityAccent = 0.1;

  if (pattern === "dots") {
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply pointer-events-none"
        viewBox="0 0 120 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="pkDots"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1.5"
              cy="1.5"
              r="1.1"
              fill={strokeInk}
              fillOpacity={opacityInk}
            />
            <circle
              cx="7.5"
              cy="7.5"
              r="0.9"
              fill={strokeAccent}
              fillOpacity={opacityAccent}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pkDots)" />
      </svg>
    );
  }

  if (pattern === "stripes") {
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="pkStripes"
            width="12"
            height="12"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(34)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="12"
              stroke={strokeInk}
              strokeOpacity={opacityInk}
              strokeWidth="2"
            />
            <line
              x1="6"
              y1="0"
              x2="6"
              y2="12"
              stroke={strokeAccent}
              strokeOpacity={opacityAccent}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pkStripes)" />
      </svg>
    );
  }

  if (pattern === "grid") {
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply pointer-events-none"
        viewBox="0 0 120 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="pkGrid"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 18 0 L 0 0 0 18"
              fill="none"
              stroke={strokeInk}
              strokeOpacity={0.1}
              strokeWidth="1"
            />
            <path
              d="M 18 9 L 0 9"
              fill="none"
              stroke={strokeAccent}
              strokeOpacity={0.08}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pkGrid)" />
      </svg>
    );
  }

  if (pattern === "waves") {
    return (
      <svg
        className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply pointer-events-none"
        viewBox="0 0 120 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="pkWaves"
            width="24"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 10 C 6 2, 18 18, 24 10"
              fill="none"
              stroke={strokeInk}
              strokeOpacity={0.12}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M 0 15 C 8 7, 16 23, 24 15"
              fill="none"
              stroke={strokeAccent}
              strokeOpacity={0.08}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#pkWaves)" />
      </svg>
    );
  }

  // rings
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply pointer-events-none"
      viewBox="0 0 120 120"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g fill="none">
        {Array.from({ length: 18 }).map((_, i) => (
          <circle
            key={i}
            cx="20"
            cy="26"
            r={6 + i * 6}
            stroke={i % 3 === 0 ? strokeAccent : strokeInk}
            strokeOpacity={i % 3 === 0 ? opacityAccent : opacityInk}
            strokeWidth={i % 4 === 0 ? 2 : 1}
          />
        ))}
      </g>
    </svg>
  );
}

function CornerMarks() {
  const base =
    "absolute w-10 h-10 pointer-events-none border-[rgb(var(--pk-ink)/0.22)]";
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className={`${base} left-6 top-6 border-l-2 border-t-2 rounded-tl-xl`} />
      <div
        className={`${base} right-6 top-6 border-r-2 border-t-2 rounded-tr-xl`}
      />
      <div
        className={`${base} left-6 bottom-6 border-l-2 border-b-2 rounded-bl-xl`}
      />
      <div
        className={`${base} right-6 bottom-6 border-r-2 border-b-2 rounded-br-xl`}
      />
      <div className="absolute left-6 top-6 w-2.5 h-2.5 rounded-full border-2 border-[rgb(var(--pk-ink)/0.22)]" />
      <div className="absolute right-6 top-6 w-2.5 h-2.5 rounded-full border-2 border-[rgb(var(--pk-ink)/0.22)]" />
      <div className="absolute left-6 bottom-6 w-2.5 h-2.5 rounded-full border-2 border-[rgb(var(--pk-ink)/0.22)]" />
      <div className="absolute right-6 bottom-6 w-2.5 h-2.5 rounded-full border-2 border-[rgb(var(--pk-ink)/0.22)]" />
    </div>
  );
}

export function PechaKucha20x20({ slides = PECHA_KUCHA_20X20_SLIDES }: PechaKucha20x20Props) {
  const [search] = useSearchParams();

  const secondsPerSlide = useMemo(() => {
    const raw = Number.parseInt(search.get("seconds") ?? "", 10);
    if (Number.isFinite(raw) && raw >= 1 && raw <= 60) return raw;
    return 20;
  }, [search]);

  const autostart = useMemo(() => search.get("autostart") === "1", [search]);
  const loop = useMemo(() => search.get("loop") === "1", [search]);

  const durationMs = secondsPerSlide * 1000;
  const totalSeconds = slides.length * secondsPerSlide;

  const [phase, setPhase] = useState<Phase>("idle");
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [deckMs, setDeckMs] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastUiTickRef = useRef(0);
  const advanceLockRef = useRef(false);

  const slideElapsedMsRef = useRef(0);
  const slideStartedAtRef = useRef<number | null>(null);
  const deckElapsedMsRef = useRef(0);
  const deckStartedAtRef = useRef<number | null>(null);

  const currentSlide = slides[clamp(current, 0, Math.max(0, slides.length - 1))];
  const slideIndexLabel = `${current + 1} / ${slides.length}`;
  const slideStartSeconds = current * secondsPerSlide;

  const getSlideElapsed = useCallback((now: number) => {
    return (
      slideElapsedMsRef.current +
      (slideStartedAtRef.current == null ? 0 : now - slideStartedAtRef.current)
    );
  }, []);

  const getDeckElapsed = useCallback((now: number) => {
    return (
      deckElapsedMsRef.current +
      (deckStartedAtRef.current == null ? 0 : now - deckStartedAtRef.current)
    );
  }, []);

  const freezeClocks = useCallback(
    (now: number) => {
      if (slideStartedAtRef.current != null) {
        slideElapsedMsRef.current += now - slideStartedAtRef.current;
        slideStartedAtRef.current = null;
      }
      if (deckStartedAtRef.current != null) {
        deckElapsedMsRef.current += now - deckStartedAtRef.current;
        deckStartedAtRef.current = null;
      }
      setElapsedMs(slideElapsedMsRef.current);
      setDeckMs(deckElapsedMsRef.current);
    },
    [setElapsedMs, setDeckMs],
  );

  const resetSlideClock = useCallback(
    (now: number) => {
      slideElapsedMsRef.current = 0;
      slideStartedAtRef.current = isPaused ? null : now;
      setElapsedMs(0);
      advanceLockRef.current = false;
    },
    [isPaused],
  );

  const start = useCallback(
    async (opts?: { fullscreen?: boolean }) => {
      const now = performance.now();
      setPhase("running");
      setCurrent(0);
      setIsPaused(false);
      setHelpOpen(false);
      setNotesOpen(false);

      slideElapsedMsRef.current = 0;
      slideStartedAtRef.current = now;
      deckElapsedMsRef.current = 0;
      deckStartedAtRef.current = now;

      setElapsedMs(0);
      setDeckMs(0);
      advanceLockRef.current = false;

      if (opts?.fullscreen && containerRef.current && !document.fullscreenElement) {
        try {
          await containerRef.current.requestFullscreen();
        } catch {
          // ignore (user gesture rules vary)
        }
      }
    },
    [],
  );

  const finish = useCallback(
    (now: number) => {
      freezeClocks(now);
      setPhase("finished");
      setIsPaused(true);
    },
    [freezeClocks],
  );

  const goTo = useCallback(
    (index: number, now = performance.now()) => {
      const clampedIndex = clamp(index, 0, Math.max(0, slides.length - 1));
      setCurrent(clampedIndex);
      resetSlideClock(now);
    },
    [slides.length, resetSlideClock],
  );

  const next = useCallback(
    (reason: "auto" | "manual", now = performance.now()) => {
      if (phase !== "running") return;

      if (current >= slides.length - 1) {
        if (loop && reason === "auto") {
          goTo(0, now);
          return;
        }
        finish(now);
        return;
      }

      goTo(current + 1, now);
    },
    [phase, current, slides.length, loop, goTo, finish],
  );

  const prev = useCallback(() => {
    if (phase !== "running") return;
    const now = performance.now();
    goTo(current - 1, now);
  }, [phase, current, goTo]);

  const togglePause = useCallback(() => {
    if (phase !== "running") return;
    const now = performance.now();

    if (!isPaused) {
      freezeClocks(now);
      setIsPaused(true);
      return;
    }

    slideStartedAtRef.current = now;
    deckStartedAtRef.current = now;
    setIsPaused(false);
  }, [phase, isPaused, freezeClocks]);

  const restart = useCallback(
    (opts?: { fullscreen?: boolean }) => {
      void start(opts);
    },
    [start],
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Autostart support (useful for rehearsals/tests)
  useEffect(() => {
    if (!autostart) return;
    if (phase !== "idle") return;
    void start({ fullscreen: false });
  }, [autostart, phase, start]);

  // Clock loop
  useEffect(() => {
    if (phase !== "running") return;

    const loopTick = (now: number) => {
      rafRef.current = requestAnimationFrame(loopTick);

      const slideElapsed = getSlideElapsed(now);
      const deckElapsed = getDeckElapsed(now);

      // UI refresh ~30fps for smooth filmstrip fill without over-rendering.
      if (now - lastUiTickRef.current > 33) {
        lastUiTickRef.current = now;
        setElapsedMs(slideElapsed);
        setDeckMs(deckElapsed);
      }

      if (isPaused) return;

      if (slideElapsed >= durationMs) {
        if (advanceLockRef.current) return;
        advanceLockRef.current = true;
        next("auto", now);
      }
    };

    rafRef.current = requestAnimationFrame(loopTick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [phase, isPaused, durationMs, getSlideElapsed, getDeckElapsed, next]);

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setHelpOpen(false);
        setNotesOpen(false);
        return;
      }

      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      if (e.key === "h" || e.key === "H" || e.key === "?") {
        e.preventDefault();
        setHelpOpen((p) => !p);
        return;
      }

      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        setNotesOpen((p) => !p);
        return;
      }

      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        restart();
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (phase === "idle") {
          void start({ fullscreen: true });
          return;
        }
        if (phase === "finished") {
          restart();
          return;
        }
        next("manual");
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (phase === "running") prev();
        return;
      }

      if (e.key === " ") {
        e.preventDefault();
        if (phase === "idle") {
          void start({ fullscreen: true });
          return;
        }
        if (phase === "finished") {
          restart();
          return;
        }
        togglePause();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, start, restart, next, prev, togglePause, toggleFullscreen]);

  const progress = clamp(elapsedMs / durationMs, 0, 1);
  const remainingSeconds = Math.max(
    0,
    Math.ceil((durationMs - elapsedMs) / 1000),
  );

  const vars = useMemo(() => {
    const a = currentSlide?.palette.a ?? "0 194 255";
    const b = currentSlide?.palette.b ?? "182 255 77";
    return {
      ["--pk-paper" as never]: PAPER_RGB,
      ["--pk-ink" as never]: INK_RGB,
      ["--pk-a" as never]: a,
      ["--pk-b" as never]: b,
    } as React.CSSProperties;
  }, [currentSlide]);

  const bgGradientStyle = useMemo(() => {
    return {
      backgroundImage: [
        "radial-gradient(1200px circle at 12% 18%, rgb(var(--pk-a) / 0.22), transparent 60%)",
        "radial-gradient(980px circle at 88% 72%, rgb(var(--pk-b) / 0.20), transparent 62%)",
        "radial-gradient(700px circle at 55% 110%, rgb(var(--pk-ink) / 0.08), transparent 60%)",
        "linear-gradient(180deg, rgb(var(--pk-paper)) 0%, rgb(var(--pk-paper) / 0.94) 100%)",
      ].join(", "),
    } as React.CSSProperties;
  }, []);

  const contentVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 18 },
      show: {
        opacity: 1,
        y: 0,
        transition: { staggerChildren: 0.06, delayChildren: 0.12 },
      },
    }),
    [],
  );

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
	      show: {
	        opacity: 1,
	        y: 0,
	        filter: "blur(0px)",
	        transition: { duration: 0.55, ease: EASE_OUT },
	      },
	    }),
	    [],
	  );

  const deckModeLabel =
    secondsPerSlide === 20 ? "20x20" : `${slides.length}x${secondsPerSlide}s`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-hidden select-none"
      style={vars}
      data-testid="pk-deck"
    >
      <div className="absolute inset-0" style={bgGradientStyle} />

      <div
        className="absolute -left-[18%] -top-[30%] w-[70%] h-[70%] rounded-[48%] blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgb(var(--pk-a) / 0.6) 0%, transparent 58%), radial-gradient(circle at 70% 70%, rgb(var(--pk-b) / 0.5) 0%, transparent 62%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -right-[24%] -bottom-[38%] w-[78%] h-[78%] rounded-[46%] blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgb(var(--pk-b) / 0.55) 0%, transparent 60%), radial-gradient(circle at 75% 70%, rgb(var(--pk-a) / 0.45) 0%, transparent 64%)",
        }}
        aria-hidden="true"
      />

      <PatternOverlay pattern={currentSlide?.pattern ?? "dots"} />
      <CornerMarks />

      <div className="absolute inset-x-6 top-6 h-[2px] bg-[rgb(var(--pk-ink)/0.14)]" aria-hidden="true" />
      <div className="absolute inset-x-6 bottom-6 h-[2px] bg-[rgb(var(--pk-ink)/0.10)]" aria-hidden="true" />

      <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply">
        <div className="noise-overlay" />
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={currentSlide?.id ?? "missing"}
          className="absolute inset-0"
	          initial={{ opacity: 0, filter: "blur(14px)", scale: 0.992, y: 16 }}
	          animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
	          exit={{ opacity: 0, filter: "blur(14px)", scale: 0.992, y: -16 }}
	          transition={{ duration: 0.45, ease: EASE_OUT }}
	        >
          <div className="h-full w-full p-[clamp(1.5rem,3.2vw,3.25rem)]">
            <div className="h-full w-full rounded-[28px] border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.55)] backdrop-blur-[2px] shadow-[0_24px_60px_rgba(11,15,26,0.18)] overflow-hidden relative">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(900px circle at 15% 20%, rgb(var(--pk-ink) / 0.05), transparent 60%), radial-gradient(700px circle at 90% 80%, rgb(var(--pk-ink) / 0.04), transparent 62%)",
                }}
                aria-hidden="true"
              />

              <div className="absolute inset-0 p-[clamp(1.1rem,2.4vw,2.4rem)]">
                <div className="grid grid-cols-12 gap-6 h-full relative">
                  <motion.div
                    className={`col-span-12 lg:col-span-7 flex flex-col ${currentSlide?.align === "center" ? "items-center text-center" : "items-start text-left"} justify-center`}
                    variants={contentVariants}
                    initial="hidden"
                    animate="show"
                  >
                    <motion.div variants={itemVariants}>
                      <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[rgb(var(--pk-ink)/0.22)] bg-[rgb(var(--pk-paper)/0.8)] font-mono text-[11px] font-bold uppercase tracking-[0.28em]">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: "rgb(var(--pk-a))" }}
                          aria-hidden="true"
                        />
                        {currentSlide?.kicker ?? "Slide"}
                      </div>
                    </motion.div>

                    <motion.h2
                      variants={itemVariants}
                      className="mt-6 text-[clamp(2.4rem,5.2vw,5.4rem)] leading-[0.92] tracking-tight font-[var(--pk-font-display)]"
                      style={{
                        fontFamily:
                          '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                        fontVariationSettings: '"opsz" 96, "wght" 650',
                      }}
                    >
                      {currentSlide?.title ?? "Missing slide"}
                    </motion.h2>

                    {currentSlide?.subtitle ? (
                      <motion.p
                        variants={itemVariants}
                        className="mt-4 text-[clamp(1rem,1.6vw,1.4rem)] leading-relaxed text-[rgb(var(--pk-ink)/0.72)] max-w-[52ch]"
                        style={{
                          fontFamily:
                            '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                          fontVariationSettings: '"opsz" 72, "wght" 430',
                        }}
                      >
                        {currentSlide.subtitle}
                      </motion.p>
                    ) : null}

                    {currentSlide?.body?.length ? (
                      <motion.ul
                        variants={itemVariants}
                        className={`mt-7 space-y-3 text-[clamp(0.98rem,1.45vw,1.25rem)] leading-relaxed text-[rgb(var(--pk-ink)/0.78)] ${currentSlide.align === "center" ? "max-w-[46ch]" : "max-w-[54ch]"}`}
                        style={{
                          fontFamily:
                            '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                          fontVariationSettings: '"opsz" 72, "wght" 420',
                        }}
                      >
                        {currentSlide.body.map((line) => (
                          <li key={line} className="flex gap-3">
                            <span
                              className="mt-[0.45em] w-2 h-2 rounded-[3px] shrink-0"
                              style={{ backgroundColor: "rgb(var(--pk-b))" }}
                              aria-hidden="true"
                            />
                            <span>{line}</span>
                          </li>
                        ))}
                      </motion.ul>
                    ) : null}
                  </motion.div>

                  <div className="col-span-12 lg:col-span-5 relative flex items-center justify-center">
                    <div className="absolute inset-0 pointer-events-none">
                      <div
                        className="absolute left-0 top-0 w-full h-full opacity-70"
                        style={{
                          backgroundImage:
                            "radial-gradient(500px circle at 50% 30%, rgb(var(--pk-a) / 0.10), transparent 65%), radial-gradient(420px circle at 40% 70%, rgb(var(--pk-b) / 0.10), transparent 60%)",
                        }}
                      />
                    </div>

                    <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                      <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-[rgb(var(--pk-ink)/0.55)]">
                        T+{formatMmSs(slideStartSeconds)}
                      </div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-[rgb(var(--pk-ink)/0.55)]">
                        Total {formatMmSs(totalSeconds)}
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-6 flex justify-center">
                      <div className="px-3 py-1 border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.85)] font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--pk-ink)/0.58)]">
                        {deckModeLabel}
                        {loop ? " • loop" : ""}
                      </div>
                    </div>

                    <div
                      className="text-[clamp(7rem,15vw,16rem)] leading-none font-[var(--pk-font-number)]"
                      style={{
                        fontFamily:
                          '"Unbounded", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
                        fontVariationSettings: '"wght" 700',
                        color: "rgb(var(--pk-ink))",
                        opacity: 0.13,
                        transform: "translateY(-0.02em)",
                      }}
                      aria-hidden="true"
                    >
                      {String(current + 1).padStart(2, "0")}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute inset-x-0 bottom-0 h-2"
                style={{
                  background:
                    "linear-gradient(90deg, rgb(var(--pk-a) / 0.35), transparent 65%), linear-gradient(90deg, transparent 0%, rgb(var(--pk-b) / 0.25) 100%)",
                  opacity: 0.7,
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* HUD */}
      <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="px-3 py-2 rounded-xl border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.8)] backdrop-blur-[2px] shadow-[0_10px_26px_rgba(11,15,26,0.14)]">
            <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-[rgb(var(--pk-ink)/0.58)]">
              Pecha Kucha • {deckModeLabel}
            </div>
            <div className="mt-1 flex items-center gap-3">
              <div
                className="font-mono text-[12px] uppercase tracking-[0.22em] text-[rgb(var(--pk-ink)/0.72)]"
                data-testid="pk-slide-position"
              >
                {slideIndexLabel}
              </div>
              <div className="h-4 w-[2px] bg-[rgb(var(--pk-ink)/0.18)]" />
              <div className="font-mono text-[12px] uppercase tracking-[0.22em] text-[rgb(var(--pk-ink)/0.72)]">
                {phase === "idle"
                  ? "Ready"
                  : phase === "finished"
                    ? "Done"
                    : isPaused
                      ? "Paused"
                      : `-${formatMmSs(remainingSeconds)}`}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setNotesOpen((p) => !p)}
            className="group inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.8)] hover:bg-[rgb(var(--pk-paper)/0.92)] shadow-[0_10px_26px_rgba(11,15,26,0.14)] transition-colors"
            aria-label="Toggle notes"
            type="button"
          >
            <StickyNote className="w-5 h-5 text-[rgb(var(--pk-ink)/0.75)] group-hover:text-[rgb(var(--pk-ink)/0.9)] transition-colors" />
          </button>

          <button
            onClick={() => setHelpOpen((p) => !p)}
            className="group inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.8)] hover:bg-[rgb(var(--pk-paper)/0.92)] shadow-[0_10px_26px_rgba(11,15,26,0.14)] transition-colors"
            aria-label="Toggle help"
            type="button"
          >
            <HelpCircle className="w-5 h-5 text-[rgb(var(--pk-ink)/0.75)] group-hover:text-[rgb(var(--pk-ink)/0.9)] transition-colors" />
          </button>

          <button
            onClick={() => {
              if (phase === "idle") {
                void start({ fullscreen: true });
                return;
              }
              if (phase === "finished") {
                restart();
                return;
              }
              togglePause();
            }}
            className="group inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.8)] hover:bg-[rgb(var(--pk-paper)/0.92)] shadow-[0_10px_26px_rgba(11,15,26,0.14)] transition-colors"
            aria-label={isPaused ? "Resume" : "Pause"}
            type="button"
          >
            {isPaused || phase !== "running" ? (
              <Play className="w-5 h-5 text-[rgb(var(--pk-ink)/0.75)] group-hover:text-[rgb(var(--pk-ink)/0.9)] transition-colors" />
            ) : (
              <Pause className="w-5 h-5 text-[rgb(var(--pk-ink)/0.75)] group-hover:text-[rgb(var(--pk-ink)/0.9)] transition-colors" />
            )}
          </button>

          <button
            onClick={() => restart()}
            className="group inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.8)] hover:bg-[rgb(var(--pk-paper)/0.92)] shadow-[0_10px_26px_rgba(11,15,26,0.14)] transition-colors"
            aria-label="Restart"
            type="button"
          >
            <RotateCcw className="w-5 h-5 text-[rgb(var(--pk-ink)/0.75)] group-hover:text-[rgb(var(--pk-ink)/0.9)] transition-colors" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="group inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.8)] hover:bg-[rgb(var(--pk-paper)/0.92)] shadow-[0_10px_26px_rgba(11,15,26,0.14)] transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            type="button"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-[rgb(var(--pk-ink)/0.75)] group-hover:text-[rgb(var(--pk-ink)/0.9)] transition-colors" />
            ) : (
              <Maximize2 className="w-5 h-5 text-[rgb(var(--pk-ink)/0.75)] group-hover:text-[rgb(var(--pk-ink)/0.9)] transition-colors" />
            )}
          </button>
        </div>
      </div>

      {/* Filmstrip */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex items-end justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.75)] hover:bg-[rgb(var(--pk-paper)/0.9)] shadow-[0_10px_26px_rgba(11,15,26,0.14)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous slide"
            type="button"
            disabled={phase !== "running"}
          >
            <ChevronLeft className="w-5 h-5 text-[rgb(var(--pk-ink)/0.8)]" />
          </button>
          <button
            onClick={() => next("manual")}
            className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.75)] hover:bg-[rgb(var(--pk-paper)/0.9)] shadow-[0_10px_26px_rgba(11,15,26,0.14)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next slide"
            type="button"
            disabled={phase !== "running"}
          >
            <ChevronRight className="w-5 h-5 text-[rgb(var(--pk-ink)/0.8)]" />
          </button>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="px-4 py-3 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.72)] backdrop-blur-[2px] shadow-[0_10px_26px_rgba(11,15,26,0.14)]">
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => {
                const isPast = i < current;
                const isCurrent = i === current;
                return (
                  <div
                    key={i}
                    className="relative h-2.5 w-[18px] rounded-[5px] border border-[rgb(var(--pk-ink)/0.25)] bg-[rgb(var(--pk-paper)/0.55)] overflow-hidden"
                    title={`Slide ${i + 1}`}
                  >
                    {isPast ? (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: "rgb(var(--pk-ink))", opacity: 0.65 }}
                      />
                    ) : null}
                    {isCurrent ? (
                      <div
                        className="absolute inset-y-0 left-0"
                        style={{
                          width: `${Math.round(progress * 100)}%`,
                          backgroundColor: "rgb(var(--pk-a))",
                          opacity: isPaused ? 0.55 : 0.9,
                        }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.24em] text-[rgb(var(--pk-ink)/0.55)]">
              <span>{formatMmSs(Math.floor(deckMs / 1000))}</span>
              <span>Space: pause</span>
              <span>F: fullscreen</span>
            </div>
          </div>
        </div>

        <div className="w-[88px] text-right font-mono text-[11px] uppercase tracking-[0.24em] text-[rgb(var(--pk-ink)/0.55)]">
          {phase === "running" ? `${secondsPerSlide}s` : ""}
        </div>
      </div>

      {/* Start overlay */}
      <AnimatePresence>
        {phase === "idle" ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="max-w-xl w-full rounded-[28px] border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.86)] shadow-[0_30px_80px_rgba(11,15,26,0.22)] backdrop-blur-[3px] p-7">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgb(var(--pk-ink)/0.6)]">
                Pecha Kucha • {slides.length} slides • {secondsPerSlide}s each
              </div>
              <div
                className="mt-4 text-4xl leading-[0.95]"
                style={{
                  fontFamily:
                    '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                  fontVariationSettings: '"opsz" 96, "wght" 700',
                }}
              >
                Start the run.
              </div>
              <p
                className="mt-3 text-[rgb(var(--pk-ink)/0.72)] leading-relaxed"
                style={{
                  fontFamily:
                    '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                  fontVariationSettings: '"opsz" 60, "wght" 420',
                }}
              >
                This deck auto-advances. Press Space to pause/resume, Arrow keys
                to rehearse, and F for fullscreen.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => void start({ fullscreen: true })}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.22)] bg-[rgb(var(--pk-a))] text-[rgb(var(--pk-ink))] font-mono text-[12px] font-bold uppercase tracking-[0.24em] shadow-[6px_6px_0px_rgba(11,15,26,0.22)] hover:translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(11,15,26,0.22)] active:translate-y-1 active:shadow-none transition-all"
                  type="button"
                >
                  Start (Fullscreen)
                </button>
                <button
                  onClick={() => void start({ fullscreen: false })}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.22)] bg-[rgb(var(--pk-paper)/0.9)] text-[rgb(var(--pk-ink))] font-mono text-[12px] font-bold uppercase tracking-[0.24em] shadow-[6px_6px_0px_rgba(11,15,26,0.18)] hover:translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(11,15,26,0.18)] active:translate-y-1 active:shadow-none transition-all"
                  type="button"
                >
                  Start (Window)
                </button>
                <button
                  onClick={() => setHelpOpen(true)}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.22)] bg-transparent text-[rgb(var(--pk-ink))] font-mono text-[12px] font-bold uppercase tracking-[0.24em] hover:bg-[rgb(var(--pk-paper)/0.6)] transition-colors"
                  type="button"
                >
                  Controls
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Help overlay */}
      <AnimatePresence>
        {helpOpen ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Controls"
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgb(var(--pk-ink))", opacity: 0.28 }}
              onClick={() => setHelpOpen(false)}
            />

            <motion.div
              className="relative max-w-lg w-full rounded-[28px] border-2 border-[rgb(var(--pk-ink)/0.20)] bg-[rgb(var(--pk-paper)/0.92)] shadow-[0_30px_80px_rgba(11,15,26,0.26)] p-7"
              initial={{ y: 10, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgb(var(--pk-ink)/0.6)]">
                Controls
              </div>
              <div
                className="mt-4 text-3xl leading-[0.98]"
                style={{
                  fontFamily:
                    '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                  fontVariationSettings: '"opsz" 96, "wght" 700',
                }}
              >
                Keyboard shortcuts
              </div>

              <div className="mt-5 space-y-3">
                {[
                  { k: "Space", v: "Pause / resume (or start)" },
                  { k: "Arrow Left/Right", v: "Previous / next slide (rehearsal)" },
                  { k: "F", v: "Toggle fullscreen" },
                  { k: "N", v: "Toggle notes" },
                  { k: "H", v: "Toggle this help" },
                  { k: "R", v: "Restart run" },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl border border-[rgb(var(--pk-ink)/0.16)] bg-[rgb(var(--pk-paper)/0.6)]"
                  >
                    <kbd className="px-3 py-1.5 rounded-xl border border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.9)] font-mono text-[11px] uppercase tracking-[0.22em]">
                      {row.k}
                    </kbd>
                    <div
                      className="text-[rgb(var(--pk-ink)/0.76)]"
                      style={{
                        fontFamily:
                          '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                        fontVariationSettings: '"opsz" 60, "wght" 420',
                      }}
                    >
                      {row.v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setHelpOpen(false)}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.22)] bg-[rgb(var(--pk-paper)/0.9)] text-[rgb(var(--pk-ink))] font-mono text-[12px] font-bold uppercase tracking-[0.24em] hover:bg-[rgb(var(--pk-paper))] transition-colors"
                  type="button"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Notes overlay */}
      <AnimatePresence>
        {notesOpen ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-label="Notes"
          >
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgb(var(--pk-ink))", opacity: 0.26 }}
              onClick={() => setNotesOpen(false)}
            />

            <motion.div
              className="relative max-w-2xl w-full rounded-[28px] border-2 border-[rgb(var(--pk-ink)/0.20)] bg-[rgb(var(--pk-paper)/0.92)] shadow-[0_30px_80px_rgba(11,15,26,0.26)] p-7"
              initial={{ y: 10, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 10, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgb(var(--pk-ink)/0.6)]">
                    Notes • Slide {current + 1}
                  </div>
                  <div
                    className="mt-3 text-2xl leading-[1.05]"
                    style={{
                      fontFamily:
                        '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                      fontVariationSettings: '"opsz" 84, "wght" 680',
                    }}
                  >
                    {currentSlide?.kicker ?? "Slide"}
                  </div>
                </div>
                <button
                  onClick={() => setNotesOpen(false)}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.85)] hover:bg-[rgb(var(--pk-paper))] transition-colors"
                  aria-label="Close notes"
                  type="button"
                >
                  <Minimize2 className="w-5 h-5 text-[rgb(var(--pk-ink)/0.8)]" />
                </button>
              </div>

              <div
                className="mt-5 whitespace-pre-wrap text-[rgb(var(--pk-ink)/0.78)] leading-relaxed text-[1.06rem]"
                style={{
                  fontFamily:
                    '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                  fontVariationSettings: '"opsz" 60, "wght" 420',
                }}
              >
                {currentSlide?.notes?.trim() ||
                  "No notes for this slide. Add notes in src/data/pecha-kucha-20x20.ts."}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Finished overlay */}
      <AnimatePresence>
        {phase === "finished" ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="max-w-lg w-full rounded-[28px] border-2 border-[rgb(var(--pk-ink)/0.18)] bg-[rgb(var(--pk-paper)/0.92)] shadow-[0_30px_80px_rgba(11,15,26,0.22)] backdrop-blur-[3px] p-7 text-center">
              <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-[rgb(var(--pk-ink)/0.6)]">
                Completed
              </div>
              <div
                className="mt-4 text-4xl leading-[0.95]"
                style={{
                  fontFamily:
                    '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                  fontVariationSettings: '"opsz" 96, "wght" 720',
                }}
              >
                {formatMmSs(totalSeconds)}.
              </div>
              <p
                className="mt-3 text-[rgb(var(--pk-ink)/0.72)] leading-relaxed"
                style={{
                  fontFamily:
                    '"Fraunces", ui-serif, Georgia, "Times New Roman", serif',
                  fontVariationSettings: '"opsz" 60, "wght" 420',
                }}
              >
                Restart to rehearse again. Or tweak slide content in{" "}
                <span className="font-mono text-[rgb(var(--pk-ink)/0.8)]">
                  src/data/pecha-kucha-20x20.ts
                </span>
                .
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => restart()}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.22)] bg-[rgb(var(--pk-a))] text-[rgb(var(--pk-ink))] font-mono text-[12px] font-bold uppercase tracking-[0.24em] shadow-[6px_6px_0px_rgba(11,15,26,0.22)] hover:translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(11,15,26,0.22)] active:translate-y-1 active:shadow-none transition-all"
                  type="button"
                >
                  Restart
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border-2 border-[rgb(var(--pk-ink)/0.22)] bg-[rgb(var(--pk-paper)/0.9)] text-[rgb(var(--pk-ink))] font-mono text-[12px] font-bold uppercase tracking-[0.24em] hover:bg-[rgb(var(--pk-paper))] transition-colors"
                  type="button"
                >
                  {isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
