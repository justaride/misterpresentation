import { AnimatePresence, motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Grid3X3,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Minus,
  Plus,
  X,
} from "lucide-react";

const TAKAHASHI_SLIDES = [
  "EVERY DAY",
  "4 BILLION",
  "EMAILS",
  "GO UNREAD.",
  "YOUR TEAM",
  "WASTES",
  "3 HOURS",
  "ON INBOX.",
  "WHAT IF",
  "AI",
  "READ THEM",
  "FOR YOU?",
  "MEET",
  "CLEARBOX.",
  "AI-POWERED",
  "EMAIL TRIAGE.",
  "READS.",
  "PRIORITIZES.",
  "RESPONDS.",
  "12 SECONDS",
  "PER EMAIL.",
  "NOT 4 MINUTES.",
  "BETA:",
  "9,400 USERS.",
  "NPS: 78.",
  "$1.2M",
  "ARR.",
  "MONTH 8.",
  "TEAM:",
  "6 ENGINEERS.",
  "2 DESIGNERS.",
  "WE NEED",
  "$4M",
  "SERIES A.",
  "LET'S BUILD",
  "THE FUTURE",
  "OF WORK.",
  "CLEARBOX.",
];

type TakahashiSlide = {
  text: string;
  kicker?: string;
};

export interface TakahashiPresentationProps {
  slides?: Array<string | TakahashiSlide>;
}

export function TakahashiPresentation({
  slides = TAKAHASHI_SLIDES,
}: TakahashiPresentationProps) {
  const deck = useMemo<TakahashiSlide[]>(() => {
    return (slides ?? []).map((s) =>
      typeof s === "string" ? { text: s } : s,
    );
  }, [slides]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempoMs, setTempoMs] = useState(1200); // Takahashi pace, adjustable
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && deck.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % deck.length);
      }, tempoMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, deck.length, tempoMs]);

  const clampIndex = useCallback(
    (idx: number) => {
      if (deck.length === 0) return 0;
      const m = idx % deck.length;
      return m < 0 ? m + deck.length : m;
    },
    [deck.length],
  );

  const nextSlide = useCallback(
    () => setCurrentSlide((prev) => clampIndex(prev + 1)),
    [clampIndex],
  );
  const prevSlide = useCallback(
    () => setCurrentSlide((prev) => clampIndex(prev - 1)),
    [clampIndex],
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current
        .requestFullscreen()
        .catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showGrid && e.key === "Escape") {
        e.preventDefault();
        setShowGrid(false);
        return;
      }
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prevSlide();
      }
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === "g" || e.key === "G") setShowGrid((p) => !p);
      if (e.key === "+" || e.key === "=") {
        setTempoMs((ms) => Math.max(400, ms - 100));
      }
      if (e.key === "-" || e.key === "_") {
        setTempoMs((ms) => Math.min(2600, ms + 100));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prevSlide, showGrid, toggleFullscreen]);

  useEffect(() => {
    // Keep index valid if a different deck is swapped in.
    setCurrentSlide((p) => clampIndex(p));
  }, [clampIndex]);

  const slide = deck[currentSlide] ?? { text: "" };
  const phase = deck.length > 0 ? currentSlide / deck.length : 0;
  const glowHue = Math.round(120 + phase * 70); // green -> cyan-ish
  const noiseDataUri =
    "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

  const computedFontVw = useMemo(() => {
    // Longer strings need slightly smaller type to keep the Takahashi punch without overflow.
    const len = (slide.text ?? "").replace(/\s+/g, " ").trim().length;
    if (len <= 6) return "18vw";
    if (len <= 12) return "15vw";
    if (len <= 20) return "12.5vw";
    return "10.5vw";
  }, [slide.text]);

  const renderText = (text: string) => {
    // Accent numbers/symbols without requiring author markup.
    const parts = text.split(/(\$?\d[\d,.\-]*%?)/g).filter(Boolean);
    return parts.map((p, i) => {
      const isNumberish = /^\$?\d/.test(p);
      return (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={`${i}-${p}`}
          className={
            isNumberish
              ? "text-accent drop-shadow-[0_0_24px_rgba(182,255,77,0.25)]"
              : ""
          }
        >
          {p}
        </span>
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-black text-white overflow-hidden flex items-center justify-center"
      style={
        {
          // Subtle per-slide glow shift for "full mockup" richness.
          ["--taka-hue" as any]: `${glowHue}deg`,
        } as CSSProperties
      }
    >
      {/* Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 50% 45%, hsla(var(--taka-hue), 95%, 60%, 0.18) 0%, rgba(0,0,0,0) 55%), radial-gradient(70% 70% at 20% 80%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-35"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px)",
          mixBlendMode: "overlay",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.10]"
        style={{
          backgroundImage: `url("${noiseDataUri}")`,
          mixBlendMode: "overlay",
          filter: "contrast(160%) brightness(120%)",
        }}
      />

      {/* Controls Overlay */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full z-50 border border-white/10 shadow-[0_16px_50px_rgba(0,0,0,0.55)]">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="hover:text-accent transition-colors p-2 rounded-full hover:bg-white/10"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full hover:bg-white/10 hover:text-accent transition-colors"
            onClick={() => setTempoMs((ms) => Math.min(2600, ms + 100))}
            aria-label="Slower"
          >
            <Minus size={18} />
          </button>
          <span className="font-mono text-xs text-white/60 tabular-nums min-w-[74px] text-center">
            {Math.round(tempoMs / 100) / 10}s/slide
          </span>
          <button
            className="p-2 rounded-full hover:bg-white/10 hover:text-accent transition-colors"
            onClick={() => setTempoMs((ms) => Math.max(400, ms - 100))}
            aria-label="Faster"
          >
            <Plus size={18} />
          </button>
        </div>

        <span className="font-mono text-xs text-white/45 tabular-nums">
          {currentSlide + 1} / {deck.length}
        </span>

        <button
          onClick={() => setShowGrid((p) => !p)}
          className={`p-2 rounded-full transition-colors ${showGrid ? "bg-white/15 text-accent" : "hover:bg-white/10 hover:text-accent"}`}
          aria-label="Grid"
        >
          <Grid3X3 size={20} />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-full hover:bg-white/10 hover:text-accent transition-colors"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>
      </div>

      {/* Navigation Areas */}
      <div
        className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-w-resize"
        onClick={prevSlide}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-e-resize"
        onClick={nextSlide}
      />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{ duration: 0.12, ease: "circOut" }}
          className="w-full text-center px-4"
        >
          {slide.kicker && (
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-white/55 mb-5">
              {slide.kicker}
            </div>
          )}
          <h1
            className="font-display font-black leading-[0.86] tracking-[-0.06em] uppercase select-none"
            style={{
              fontSize: `clamp(3rem, ${computedFontVw}, 12rem)`,
              textShadow:
                "0 1px 0 rgba(255,255,255,0.08), 0 24px 90px rgba(0,0,0,0.85)",
            }}
          >
            {renderText(slide.text)}
          </h1>
        </motion.div>
      </AnimatePresence>

      {/* Grid / Review Mode */}
      <AnimatePresence>
        {showGrid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md"
          >
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 4px)",
                mixBlendMode: "overlay",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.10]"
              style={{
                backgroundImage: `url("${noiseDataUri}")`,
                mixBlendMode: "overlay",
                filter: "contrast(160%) brightness(120%)",
              }}
            />

            <div className="h-full w-full flex flex-col">
              <div className="flex items-center justify-between gap-4 p-4 border-b border-white/10">
                <div className="min-w-0">
                  <div className="font-display uppercase tracking-tight text-xl">
                    Slide Grid
                  </div>
                  <div className="font-mono text-xs text-white/55">
                    Click to jump. Keys: `G` toggle, `Esc` close.
                  </div>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-white/10 hover:text-accent transition-colors"
                  onClick={() => setShowGrid(false)}
                  aria-label="Close grid"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {deck.map((s, idx) => (
                    <button
                      key={`${idx}-${s.text}`}
                      className={`group relative aspect-video w-full text-left rounded-xl border transition-colors overflow-hidden ${
                        idx === currentSlide
                          ? "border-accent"
                          : "border-white/10 hover:border-white/25"
                      }`}
                      onClick={() => {
                        setCurrentSlide(idx);
                        setShowGrid(false);
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0" />
                      <div
                        className="absolute inset-0 pointer-events-none opacity-[0.12]"
                        style={{
                          backgroundImage: `url("${noiseDataUri}")`,
                          mixBlendMode: "overlay",
                        }}
                      />
                      <div className="relative h-full w-full p-3 flex flex-col justify-between">
                        <div className="font-mono text-[10px] text-white/55 tabular-nums">
                          {idx + 1}
                        </div>
                        <div className="font-display uppercase leading-[0.95] tracking-[-0.04em] text-[clamp(0.9rem,2.2vw,1.4rem)]">
                          {s.text}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
