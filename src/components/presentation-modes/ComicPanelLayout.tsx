import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PanelData = {
  type: "speech" | "thought" | "narration" | "sfx";
  text: string;
  character?: string;
  bg: string;
  position?: "left" | "right" | "center";
};

type PageData = {
  grid: string;
  panels: PanelData[];
};

const PAGES: PageData[] = [
  {
    grid: "grid-cols-2 grid-rows-2",
    panels: [
      {
        type: "narration",
        text: "It was a dark and stormy sprint...",
        bg: "from-slate-800 to-slate-900",
        position: "center",
      },
      {
        type: "speech",
        text: "We need a design system. Our UI is chaos.",
        character: "PM",
        bg: "from-blue-900 to-slate-900",
        position: "left",
      },
      {
        type: "thought",
        text: "Not another meeting about consistency...",
        character: "Dev",
        bg: "from-purple-900 to-slate-900",
        position: "right",
      },
      {
        type: "sfx",
        text: "SLACK!",
        bg: "from-red-900 to-orange-900",
        position: "center",
      },
    ],
  },
  {
    grid: "grid-cols-3 grid-rows-2",
    panels: [
      {
        type: "narration",
        text: "The team assembled their weapons...",
        bg: "from-indigo-900 to-slate-900",
        position: "center",
      },
      {
        type: "speech",
        text: "Figma tokens. That's where we start.",
        character: "Designer",
        bg: "from-pink-900 to-slate-900",
        position: "left",
      },
      {
        type: "speech",
        text: "I vote for Tailwind as the foundation.",
        character: "Dev",
        bg: "from-cyan-900 to-slate-900",
        position: "right",
      },
      {
        type: "sfx",
        text: "TYPES!",
        bg: "from-yellow-900 to-orange-900",
        position: "center",
      },
      {
        type: "thought",
        text: "What if we just... used a component library?",
        character: "Intern",
        bg: "from-green-900 to-slate-900",
        position: "left",
      },
      {
        type: "speech",
        text: "We need OUR identity. Not someone else's.",
        character: "Designer",
        bg: "from-violet-900 to-slate-900",
        position: "right",
      },
    ],
  },
  {
    grid: "grid-cols-2 grid-rows-3",
    panels: [
      {
        type: "narration",
        text: "Chapter 2: The Token Wars",
        bg: "from-amber-900 to-slate-900",
        position: "center",
      },
      {
        type: "speech",
        text: "Colors first. We define our palette.",
        character: "Designer",
        bg: "from-rose-900 to-slate-900",
        position: "left",
      },
      {
        type: "speech",
        text: "`--color-primary-500` or `--brand-main`?",
        character: "Dev",
        bg: "from-blue-900 to-indigo-900",
        position: "right",
      },
      {
        type: "sfx",
        text: "DEBATE!!",
        bg: "from-red-800 to-red-950",
        position: "center",
      },
      {
        type: "thought",
        text: "Three hours on naming conventions...",
        character: "PM",
        bg: "from-gray-800 to-slate-900",
        position: "left",
      },
      {
        type: "speech",
        text: "Semantic names. `--color-action`, `--color-surface`.",
        character: "Designer",
        bg: "from-emerald-900 to-slate-900",
        position: "right",
      },
    ],
  },
  {
    grid: "grid-cols-3 grid-rows-2",
    panels: [
      {
        type: "narration",
        text: "Chapter 3: Component Forge",
        bg: "from-orange-900 to-slate-900",
        position: "center",
      },
      {
        type: "speech",
        text: "Button, Input, Card. The holy trinity.",
        character: "Dev",
        bg: "from-teal-900 to-slate-900",
        position: "left",
      },
      {
        type: "sfx",
        text: "CODE!",
        bg: "from-green-800 to-emerald-950",
        position: "center",
      },
      {
        type: "speech",
        text: "Every variant. Every state. Document it all.",
        character: "Designer",
        bg: "from-fuchsia-900 to-slate-900",
        position: "right",
      },
      {
        type: "thought",
        text: "This actually... makes sense?",
        character: "Intern",
        bg: "from-sky-900 to-slate-900",
        position: "left",
      },
      {
        type: "speech",
        text: "Storybook for visual testing. Non-negotiable.",
        character: "Dev",
        bg: "from-violet-900 to-indigo-900",
        position: "right",
      },
    ],
  },
  {
    grid: "grid-cols-2 grid-rows-2",
    panels: [
      {
        type: "narration",
        text: "Chapter 4: The Great Migration",
        bg: "from-slate-800 to-zinc-900",
        position: "center",
      },
      {
        type: "sfx",
        text: "REFACTOR!!!",
        bg: "from-red-900 to-yellow-900",
        position: "center",
      },
      {
        type: "speech",
        text: "47 components. 200+ files touched. Zero regressions.",
        character: "Dev",
        bg: "from-emerald-900 to-green-950",
        position: "left",
      },
      {
        type: "thought",
        text: "We actually pulled this off...",
        character: "PM",
        bg: "from-blue-900 to-indigo-950",
        position: "right",
      },
    ],
  },
  {
    grid: "grid-cols-3 grid-rows-2",
    panels: [
      {
        type: "narration",
        text: "Epilogue: Six Months Later",
        bg: "from-amber-900 to-yellow-950",
        position: "center",
      },
      {
        type: "speech",
        text: "New feature? Just compose existing components.",
        character: "Dev",
        bg: "from-green-900 to-emerald-950",
        position: "left",
      },
      {
        type: "speech",
        text: "Onboarding is 3x faster now.",
        character: "PM",
        bg: "from-blue-900 to-sky-950",
        position: "right",
      },
      {
        type: "speech",
        text: "The design system is our product's backbone.",
        character: "Designer",
        bg: "from-purple-900 to-violet-950",
        position: "left",
      },
      {
        type: "speech",
        text: "I built a whole page using just the system!",
        character: "Intern",
        bg: "from-pink-900 to-rose-950",
        position: "right",
      },
      {
        type: "sfx",
        text: "THE END",
        bg: "from-slate-900 to-black",
        position: "center",
      },
    ],
  },
];

const CHARACTER_COLORS: Record<string, string> = {
  PM: "bg-blue-500",
  Dev: "bg-green-500",
  Designer: "bg-pink-500",
  Intern: "bg-yellow-500",
};

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

function SpeechBubble({ text, character, type, position }: PanelData) {
  const isThought = type === "thought";
  const isSfx = type === "sfx";
  const isNarration = type === "narration";

  if (isSfx) {
    return (
      <div className="flex items-center justify-center h-full">
        <span
          className="text-4xl sm:text-5xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
          style={{
            fontFamily: '"Impact", "Arial Black", sans-serif',
            WebkitTextStroke: "2px rgba(0,0,0,0.3)",
            transform: `rotate(${-5 + Math.random() * 10}deg)`,
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  if (isNarration) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-amber-200/90 italic text-center text-sm sm:text-base font-serif">
          {text}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full p-3 ${position === "right" ? "items-end" : "items-start"}`}
    >
      {character && (
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-6 h-6 rounded-full ${CHARACTER_COLORS[character] ?? "bg-gray-500"} flex items-center justify-center text-[10px] font-bold text-white`}
          >
            {character[0]}
          </div>
          <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
            {character}
          </span>
        </div>
      )}
      <div
        className={`relative max-w-[90%] p-3 text-sm sm:text-base ${
          isThought
            ? "bg-white/10 rounded-[50%] border-2 border-dashed border-white/20 text-white/80 italic"
            : "bg-white text-gray-900 rounded-2xl"
        }`}
      >
        <p>{text}</p>
        {!isThought && (
          <div
            className={`absolute -bottom-2 ${position === "right" ? "right-4" : "left-4"} w-4 h-4 bg-white transform rotate-45`}
          />
        )}
        {isThought && (
          <div
            className={`absolute -bottom-3 ${position === "right" ? "right-6" : "left-6"} flex gap-1`}
          >
            <div className="w-2 h-2 rounded-full bg-white/20 border border-dashed border-white/20" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/15 border border-dashed border-white/15" />
          </div>
        )}
      </div>
    </div>
  );
}

function SpeedLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x1 = 50 + Math.cos(angle) * 50;
        const y1 = 50 + Math.sin(angle) * 50;
        const x2 = 50 + Math.cos(angle) * 20;
        const y2 = 50 + Math.sin(angle) * 20;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="white"
            strokeWidth="0.5"
            opacity="0.3"
          />
        );
      })}
    </svg>
  );
}

function HalftoneOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.04] z-20"
      style={{
        backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
        backgroundSize: "6px 6px",
      }}
    />
  );
}

export function ComicPanelLayout() {
  const reducedMotion = useReducedMotion();
  const [currentPage, setCurrentPage] = useState(0);
  const [revealedPanels, setRevealedPanels] = useState(0);

  const page = PAGES[currentPage];
  const allRevealed = revealedPanels >= page.panels.length;

  const advance = useCallback(() => {
    if (!allRevealed) {
      setRevealedPanels((prev) => prev + 1);
    } else if (currentPage < PAGES.length - 1) {
      setCurrentPage((prev) => prev + 1);
      setRevealedPanels(0);
    }
  }, [allRevealed, currentPage]);

  const goBack = useCallback(() => {
    if (revealedPanels > 0) {
      setRevealedPanels((prev) => prev - 1);
    } else if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      setRevealedPanels(PAGES[currentPage - 1].panels.length);
    }
  }, [revealedPanels, currentPage]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        advance();
      } else if (e.key === "ArrowLeft" || e.key === "Escape") {
        goBack();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [advance, goBack]);

  const progressText = useMemo(
    () => `Page ${currentPage + 1}/${PAGES.length}`,
    [currentPage],
  );

  return (
    <div
      className="w-full h-full min-h-screen bg-yellow-50 flex flex-col cursor-pointer select-none"
      onClick={advance}
    >
      <div className="flex-1 p-2 sm:p-4 flex flex-col">
        <div className="text-center mb-2">
          <h1
            className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-gray-900"
            style={{ fontFamily: '"Impact", "Arial Black", sans-serif' }}
          >
            How We Built Our Design System
          </h1>
          <p className="text-xs text-gray-500 mt-1">A Comic Presentation</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className={`flex-1 grid ${page.grid} gap-2 sm:gap-3`}
          >
            {page.panels.map((panel, idx) => {
              const isRevealed = reducedMotion || idx < revealedPanels;
              const isCurrent = idx === revealedPanels - 1;

              return (
                <motion.div
                  key={idx}
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
                  animate={
                    isRevealed
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0.15, scale: 0.95 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  className={`relative bg-gradient-to-br ${panel.bg} rounded-lg border-2 sm:border-3 border-gray-900 overflow-hidden`}
                >
                  {isRevealed && <SpeechBubble {...panel} />}
                  {isCurrent && panel.type === "sfx" && !reducedMotion && (
                    <SpeedLines />
                  )}
                  <HalftoneOverlay />
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-4 py-2 bg-gray-900 flex items-center justify-between text-xs text-gray-400">
        <span>Click/→/Space: next panel | ←/Esc: back</span>
        <span>
          {progressText} | Panel {Math.min(revealedPanels, page.panels.length)}/
          {page.panels.length}
        </span>
      </div>
    </div>
  );
}
