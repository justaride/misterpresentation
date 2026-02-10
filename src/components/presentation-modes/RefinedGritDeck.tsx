import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Slide = {
  id: string;
  kicker: string;
  headline: string;
  body?: string;
  layout: "title" | "two-col" | "callout";
  left?: string[];
  right?: string[];
  callout?: string;
};

const SLIDES: Slide[] = [
  {
    id: "cover",
    kicker: "REFINED GRIT",
    headline: "Tactile decks.\nReadable decisions.",
    body: "Grain, halftone, warm paper. No stock-photo mush.",
    layout: "title",
  },
  {
    id: "why",
    kicker: "WHY",
    headline: "People trust\nmade things.",
    body: "A little imperfection signals effort. Effort signals care.",
    layout: "callout",
    callout: "Make it feel authored. Then make it clear.",
  },
  {
    id: "principles",
    kicker: "RULES",
    headline: "Texture is not\ncontent.",
    layout: "two-col",
    left: ["Contrast first", "Whitespace stays sacred", "One decision per slide"],
    right: ["Grain stays subtle", "Halftone stays behind", "Misregistration is a hint"],
  },
  {
    id: "layout",
    kicker: "LAYOUT",
    headline: "Big type.\nHard edges.\nSoft paper.",
    body: "Use strict grids. Add tactile overlays.",
    layout: "title",
  },
  {
    id: "story",
    kicker: "STORY",
    headline: "Problem -> proof -> decision",
    body: "Don't let texture hide the ask.",
    layout: "two-col",
    left: ["Problem", "Constraints", "What changed"],
    right: ["Evidence", "Options", "Decision"],
  },
  {
    id: "callout",
    kicker: "HARD TRUTH",
    headline: "If it isn't decided,\nit isn't done.",
    layout: "callout",
    callout: "A deck without a decision is just vibes.",
  },
  {
    id: "examples",
    kicker: "USES",
    headline: "Product updates.\nClient briefs.\nWorkshops.",
    body: "When you need attention and alignment.",
    layout: "two-col",
    left: ["Roadmap snapshots", "Tradeoff slides", "Risk lists"],
    right: ["Principles", "Before/after", "Next step"],
  },
  {
    id: "motion",
    kicker: "MOTION",
    headline: "Minimal motion.\nMaximum intent.",
    body: "Let content land. Don't animate for entertainment.",
    layout: "title",
  },
  {
    id: "ship",
    kicker: "SHIP",
    headline: "Template it.\nReuse it.\nIterate it.",
    body: "The best deck is the one you can keep fresh.",
    layout: "title",
  },
  {
    id: "end",
    kicker: "END",
    headline: "Questions.\nThen a decision.",
    body: "Arrow keys to navigate.",
    layout: "callout",
    callout: "Make the next step explicit.",
  },
];

function HalftoneOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.14] mix-blend-multiply pointer-events-none"
      viewBox="0 0 160 160"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="rgDots"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.2" fill="rgba(12,18,20,0.85)" />
          <circle cx="9" cy="9" r="0.9" fill="rgba(12,18,20,0.55)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rgDots)" />
    </svg>
  );
}

function GrainOverlay() {
  // CSS-only "grain": two crossed repeating gradients with very low opacity.
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.20] mix-blend-multiply"
      aria-hidden="true"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(0,0,0,0.10) 0 1px, transparent 1px 3px), repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 4px)",
      }}
    />
  );
}

function PaperBg() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[rgb(246,241,233)]" />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, rgba(244,114,182,0.08), transparent 55%), radial-gradient(circle at 70% 30%, rgba(34,211,238,0.10), transparent 55%), radial-gradient(circle at 60% 80%, rgba(251,191,36,0.08), transparent 55%)",
        }}
      />
    </div>
  );
}

function Misregistration({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 translate-x-[2px] translate-y-[2px] text-amber-900/15"
        aria-hidden="true"
      >
        {children}
      </div>
      <div
        className="absolute inset-0 -translate-x-[1px] -translate-y-[1px] text-cyan-900/10"
        aria-hidden="true"
      >
        {children}
      </div>
      <div className="relative text-[rgb(20,23,24)]">{children}</div>
    </div>
  );
}

export function RefinedGritDeck() {
  const reducedMotion = useReducedMotion();
  const [current, setCurrent] = useState(0);

  const slide = SLIDES[current] ?? SLIDES[0];
  const positionLabel = `${current + 1} / ${SLIDES.length}`;

  const next = useCallback(() => {
    setCurrent((p) => Math.min(p + 1, SLIDES.length - 1));
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => Math.max(p - 1, 0));
  }, []);

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
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const layout = useMemo(() => slide.layout, [slide.layout]);

  return (
    <div className="min-h-screen flex flex-col" data-testid="grit-deck">
      <header className="border-b border-black/10 bg-[rgb(246,241,233)]/80 backdrop-blur p-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-lg leading-none text-[rgb(20,23,24)]">
            Refined Grit Deck
          </h1>
          <p className="text-xs font-mono text-black/50">
            <span className="text-black/70">{slide.kicker}</span> |{" "}
            <span data-testid="grit-slide-position">{positionLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={current === 0}
            aria-disabled={current === 0}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-3 py-2 text-xs font-mono bg-white/50 hover:bg-white/80 transition-colors disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <button
            type="button"
            onClick={next}
            disabled={current >= SLIDES.length - 1}
            aria-disabled={current >= SLIDES.length - 1}
            className="inline-flex items-center gap-2 rounded-full border border-black/15 px-3 py-2 text-xs font-mono bg-white/50 hover:bg-white/80 transition-colors disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <PaperBg />
        <HalftoneOverlay />
        <GrainOverlay />

        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute left-8 top-8 h-4 w-4 border-2 border-black/40" />
          <div className="absolute right-8 top-8 h-4 w-4 border-2 border-black/40" />
          <div className="absolute left-8 bottom-8 h-4 w-4 border-2 border-black/40" />
          <div className="absolute right-8 bottom-8 h-4 w-4 border-2 border-black/40" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-black/60 bg-white/60 font-mono text-[11px] font-bold uppercase tracking-[0.26em] rotate-[-0.8deg]">
            <span className="h-2 w-2 rounded-[3px] bg-[rgb(20,23,24)]" aria-hidden="true" />
            {slide.kicker}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="mt-8"
            >
              <Misregistration>
                <h2 className="font-display uppercase tracking-tight text-5xl md:text-7xl leading-[0.9] whitespace-pre-line">
                  {slide.headline}
                </h2>
              </Misregistration>

              {slide.body ? (
                <p className="mt-6 text-[16px] md:text-[18px] leading-relaxed text-black/70 max-w-3xl">
                  {slide.body}
                </p>
              ) : null}

              {layout === "two-col" ? (
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="rounded-2xl border-2 border-black/15 bg-white/55 p-6">
                    <div className="text-[11px] font-mono uppercase tracking-[0.26em] text-black/50">
                      LEFT
                    </div>
                    <ul className="mt-3 space-y-2">
                      {(slide.left ?? []).map((x) => (
                        <li key={x} className="text-black/75">
                          <span className="font-mono text-black/40 mr-2">-</span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border-2 border-black/15 bg-white/55 p-6">
                    <div className="text-[11px] font-mono uppercase tracking-[0.26em] text-black/50">
                      RIGHT
                    </div>
                    <ul className="mt-3 space-y-2">
                      {(slide.right ?? []).map((x) => (
                        <li key={x} className="text-black/75">
                          <span className="font-mono text-black/40 mr-2">-</span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}

              {layout === "callout" ? (
                <div
                  className={clsx(
                    "mt-10 rounded-2xl border-2 border-black/25 bg-white/65 p-7",
                    "shadow-[6px_6px_0_0_rgba(20,23,24,0.18)]",
                  )}
                >
                  <div className="text-[11px] font-mono uppercase tracking-[0.26em] text-black/55">
                    CALLOUT
                  </div>
                  <div className="mt-3 text-2xl md:text-3xl text-black/85 leading-snug">
                    {slide.callout}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
