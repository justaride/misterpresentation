import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { clsx } from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

type TileTone = "ink" | "accent" | "muted" | "warn";

type Tile = {
  id: string;
  title: string;
  body?: string;
  kicker?: string;
  tone?: TileTone;
  // bento placement for lg+; on mobile these stack
  col: number; // 1..12
  row: number; // 1..8
  colSpan: number; // 1..12
  rowSpan: number; // 1..8
};

type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  tiles: Tile[];
  notes?: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function toneClasses(tone: TileTone | undefined) {
  if (tone === "accent") {
    return "border-cyan-300/25 bg-cyan-500/10";
  }
  if (tone === "warn") {
    return "border-amber-300/25 bg-amber-500/10";
  }
  if (tone === "muted") {
    return "border-white/10 bg-white/5";
  }
  return "border-white/15 bg-black/20";
}

const SLIDES: Slide[] = [
  {
    id: "cover",
    title: "Bento Grid Deck",
    subtitle: "A practical template for product updates and decisions.",
    tiles: [
      {
        id: "hero",
        kicker: "FORMAT",
        title: "Scan first.\nRead second.",
        body: "One hero tile. Supporting tiles. No mush.",
        tone: "accent",
        col: 1,
        row: 1,
        colSpan: 8,
        rowSpan: 5,
      },
      {
        id: "rules",
        kicker: "RULES",
        title: "1 hero.\n3 supports.\nEverything else optional.",
        tone: "muted",
        col: 9,
        row: 1,
        colSpan: 4,
        rowSpan: 3,
      },
      {
        id: "cta",
        kicker: "NAV",
        title: "Arrow keys",
        body: "Use Left/Right to move.",
        tone: "ink",
        col: 9,
        row: 4,
        colSpan: 4,
        rowSpan: 2,
      },
      {
        id: "footer",
        kicker: "TIP",
        title: "Make decisions explicit.",
        body: "A bento deck is a decision machine, not a scrapbook.",
        tone: "warn",
        col: 1,
        row: 6,
        colSpan: 12,
        rowSpan: 3,
      },
    ],
  },
  {
    id: "what-changed",
    title: "What Changed",
    subtitle: "Last 30 days, no fluff.",
    tiles: [
      {
        id: "hero",
        kicker: "HERO",
        title: "Activation +12%",
        body: "New onboarding path: fewer steps, clearer promise.",
        tone: "accent",
        col: 1,
        row: 1,
        colSpan: 7,
        rowSpan: 5,
      },
      {
        id: "metric1",
        kicker: "METRIC",
        title: "Churn -0.6pp",
        body: "Saved accounts: cancellation flow fix.",
        tone: "muted",
        col: 8,
        row: 1,
        colSpan: 5,
        rowSpan: 2,
      },
      {
        id: "metric2",
        kicker: "METRIC",
        title: "P95 310ms",
        body: "Caching + query rewrite.",
        tone: "muted",
        col: 8,
        row: 3,
        colSpan: 5,
        rowSpan: 2,
      },
      {
        id: "note",
        kicker: "NOTE",
        title: "One caveat",
        body: "Paid acquisition dipped. We traded volume for quality.",
        tone: "ink",
        col: 1,
        row: 6,
        colSpan: 12,
        rowSpan: 3,
      },
    ],
  },
  {
    id: "problem",
    title: "Problem",
    subtitle: "Where users stall.",
    tiles: [
      {
        id: "hero",
        kicker: "TOP DROP",
        title: "Step 2: Setup",
        body: "Users don't understand what to do first.",
        tone: "warn",
        col: 1,
        row: 1,
        colSpan: 8,
        rowSpan: 5,
      },
      {
        id: "evidence",
        kicker: "EVIDENCE",
        title: "Heatmaps + support tickets agree.",
        body: "Confusion clusters around terminology.",
        tone: "muted",
        col: 9,
        row: 1,
        colSpan: 4,
        rowSpan: 3,
      },
      {
        id: "quote",
        kicker: "QUOTE",
        title: "\"I don't know what success looks like.\"",
        tone: "ink",
        col: 9,
        row: 4,
        colSpan: 4,
        rowSpan: 2,
      },
      {
        id: "decision",
        kicker: "DECISION",
        title: "Rename + add example",
        body: "Ship the smallest clarity fix first.",
        tone: "accent",
        col: 1,
        row: 6,
        colSpan: 12,
        rowSpan: 3,
      },
    ],
  },
  {
    id: "solution",
    title: "Solution",
    subtitle: "What we're shipping next.",
    tiles: [
      {
        id: "hero",
        kicker: "SHIP",
        title: "Guided setup\nwith one default path",
        body: "Reduce choices. Teach by doing.",
        tone: "accent",
        col: 1,
        row: 1,
        colSpan: 7,
        rowSpan: 5,
      },
      {
        id: "scope",
        kicker: "SCOPE",
        title: "2 screens",
        body: "Setup wizard + success state.",
        tone: "muted",
        col: 8,
        row: 1,
        colSpan: 5,
        rowSpan: 2,
      },
      {
        id: "risk",
        kicker: "RISK",
        title: "Edge cases",
        body: "Power users may want to skip.",
        tone: "warn",
        col: 8,
        row: 3,
        colSpan: 5,
        rowSpan: 2,
      },
      {
        id: "mitigation",
        kicker: "MITIGATION",
        title: "Skip link + docs",
        body: "Keep the fast path for experts.",
        tone: "ink",
        col: 1,
        row: 6,
        colSpan: 12,
        rowSpan: 3,
      },
    ],
  },
  {
    id: "roadmap",
    title: "Roadmap",
    subtitle: "3 bets, 3 months.",
    tiles: [
      {
        id: "hero",
        kicker: "Q1",
        title: "Onboarding clarity",
        body: "Ship wizard, measure activation lift.",
        tone: "muted",
        col: 1,
        row: 1,
        colSpan: 6,
        rowSpan: 4,
      },
      {
        id: "q2",
        kicker: "Q2",
        title: "Teams",
        body: "Shared workspaces + permissions.",
        tone: "accent",
        col: 7,
        row: 1,
        colSpan: 6,
        rowSpan: 4,
      },
      {
        id: "q3",
        kicker: "Q3",
        title: "Automation",
        body: "Rules + templates + alerts.",
        tone: "warn",
        col: 1,
        row: 5,
        colSpan: 12,
        rowSpan: 4,
      },
    ],
  },
  {
    id: "kpis",
    title: "KPIs",
    subtitle: "What we measure every week.",
    tiles: [
      {
        id: "hero",
        kicker: "NORTH STAR",
        title: "Weekly activated teams",
        body: "If teams activate, retention follows.",
        tone: "accent",
        col: 1,
        row: 1,
        colSpan: 8,
        rowSpan: 5,
      },
      {
        id: "kpi1",
        kicker: "INPUT",
        title: "Setup completion",
        body: "Wizard completion rate.",
        tone: "muted",
        col: 9,
        row: 1,
        colSpan: 4,
        rowSpan: 2,
      },
      {
        id: "kpi2",
        kicker: "INPUT",
        title: "Time-to-value",
        body: "First success moment.",
        tone: "muted",
        col: 9,
        row: 3,
        colSpan: 4,
        rowSpan: 2,
      },
      {
        id: "guardrail",
        kicker: "GUARDRAIL",
        title: "Support volume",
        body: "Avoid hidden complexity.",
        tone: "warn",
        col: 1,
        row: 6,
        colSpan: 12,
        rowSpan: 3,
      },
    ],
  },
  {
    id: "risks",
    title: "Risks",
    subtitle: "Name them early.",
    tiles: [
      {
        id: "hero",
        kicker: "RISK 1",
        title: "Ambiguity",
        body: "If success isn't defined, nobody wins.",
        tone: "warn",
        col: 1,
        row: 1,
        colSpan: 7,
        rowSpan: 5,
      },
      {
        id: "r2",
        kicker: "RISK 2",
        title: "Scope creep",
        body: "Bento decks tempt you to add more tiles.",
        tone: "muted",
        col: 8,
        row: 1,
        colSpan: 5,
        rowSpan: 2,
      },
      {
        id: "r3",
        kicker: "RISK 3",
        title: "Mixed audiences",
        body: "One deck can't serve everyone equally.",
        tone: "muted",
        col: 8,
        row: 3,
        colSpan: 5,
        rowSpan: 2,
      },
      {
        id: "mit",
        kicker: "MITIGATION",
        title: "Cut ruthlessly",
        body: "One decision per slide.",
        tone: "accent",
        col: 1,
        row: 6,
        colSpan: 12,
        rowSpan: 3,
      },
    ],
  },
  {
    id: "team",
    title: "Team",
    subtitle: "Who owns what.",
    tiles: [
      {
        id: "hero",
        kicker: "OWNERSHIP",
        title: "Design + Eng + PM",
        body: "One triad per bet. Clear handoffs.",
        tone: "accent",
        col: 1,
        row: 1,
        colSpan: 8,
        rowSpan: 5,
      },
      {
        id: "roles",
        kicker: "ROLES",
        title: "PM: scope\nDesign: clarity\nEng: speed",
        tone: "muted",
        col: 9,
        row: 1,
        colSpan: 4,
        rowSpan: 3,
      },
      {
        id: "cadence",
        kicker: "CADENCE",
        title: "Weekly demo",
        body: "Decisions are made in public.",
        tone: "ink",
        col: 9,
        row: 4,
        colSpan: 4,
        rowSpan: 2,
      },
      {
        id: "principle",
        kicker: "PRINCIPLE",
        title: "The deck is the system.",
        body: "If it isn't in the deck, it isn't decided.",
        tone: "warn",
        col: 1,
        row: 6,
        colSpan: 12,
        rowSpan: 3,
      },
    ],
  },
  {
    id: "ask",
    title: "Ask",
    subtitle: "Make the next step explicit.",
    tiles: [
      {
        id: "hero",
        kicker: "DECISION",
        title: "Approve the wizard scope",
        body: "2 screens. 2 weeks. Measure activation.",
        tone: "accent",
        col: 1,
        row: 1,
        colSpan: 8,
        rowSpan: 5,
      },
      {
        id: "options",
        kicker: "OPTIONS",
        title: "A) Ship now\nB) Wait for more data",
        tone: "muted",
        col: 9,
        row: 1,
        colSpan: 4,
        rowSpan: 3,
      },
      {
        id: "default",
        kicker: "RECOMMEND",
        title: "A) Ship now",
        body: "Small bet, fast feedback.",
        tone: "warn",
        col: 9,
        row: 4,
        colSpan: 4,
        rowSpan: 2,
      },
      {
        id: "close",
        kicker: "CLOSE",
        title: "Questions?",
        body: "Then we decide.",
        tone: "ink",
        col: 1,
        row: 6,
        colSpan: 12,
        rowSpan: 3,
      },
    ],
  },
  {
    id: "appendix",
    title: "Appendix",
    subtitle: "Back pocket tiles.",
    tiles: [
      {
        id: "hero",
        kicker: "BACKUP",
        title: "Experiment plan",
        body: "Ship -> measure -> decide -> iterate.",
        tone: "muted",
        col: 1,
        row: 1,
        colSpan: 7,
        rowSpan: 5,
      },
      {
        id: "a",
        kicker: "A",
        title: "Segmented onboarding",
        body: "Different paths per persona.",
        tone: "accent",
        col: 8,
        row: 1,
        colSpan: 5,
        rowSpan: 2,
      },
      {
        id: "b",
        kicker: "B",
        title: "In-product examples",
        body: "Show not tell.",
        tone: "warn",
        col: 8,
        row: 3,
        colSpan: 5,
        rowSpan: 2,
      },
      {
        id: "c",
        kicker: "C",
        title: "Instrumentation",
        body: "Tight event names. Clear funnels.",
        tone: "ink",
        col: 1,
        row: 6,
        colSpan: 12,
        rowSpan: 3,
      },
    ],
  },
];

function TileCard({ tile }: { tile: Tile }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border p-5 md:p-6 overflow-hidden relative",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]",
        toneClasses(tile.tone),
      )}
    >
      <div
        className="absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl opacity-40"
        style={{
          background:
            tile.tone === "accent"
              ? "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.35), transparent 60%)"
              : tile.tone === "warn"
                ? "radial-gradient(circle at 30% 30%, rgba(251,191,36,0.25), transparent 60%)"
                : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.10), transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative">
        {tile.kicker ? (
          <div className="text-[11px] font-mono uppercase tracking-[0.26em] text-fg/55">
            {tile.kicker}
          </div>
        ) : null}
        <div className="mt-2 font-display uppercase tracking-tight text-2xl md:text-3xl leading-[0.95] whitespace-pre-line">
          {tile.title}
        </div>
        {tile.body ? (
          <p className="mt-3 text-[14px] md:text-[15px] leading-relaxed text-fg/80 whitespace-pre-line max-w-[56ch]">
            {tile.body}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function BentoGridDeck() {
  const reducedMotion = useReducedMotion();
  const [searchParams] = useSearchParams();

  const startSlideParam = Number(searchParams.get("slide") ?? "1");
  const startIndex = Number.isFinite(startSlideParam) ? startSlideParam - 1 : 0;

  const [current, setCurrent] = useState(() =>
    clamp(startIndex, 0, SLIDES.length - 1),
  );

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

  const tileGrid = useMemo(() => {
    // Sort tiles so hero-ish ones tend to appear first on mobile stacking.
    return [...slide.tiles].sort((a, b) => {
      const areaA = a.colSpan * a.rowSpan;
      const areaB = b.colSpan * b.rowSpan;
      return areaB - areaA;
    });
  }, [slide.tiles]);

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col" data-testid="bento-deck">
      <header className="border-b border-border bg-card/40 p-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-lg leading-none">Bento Grid Deck</h1>
          <p className="text-xs font-mono text-fg/50">
            <span className="text-fg/80">{slide.title}</span> |{" "}
            <span data-testid="bento-slide-position">{positionLabel}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={current === 0}
            aria-disabled={current === 0}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-mono bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:hover:bg-white/5"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <button
            type="button"
            onClick={next}
            disabled={current >= SLIDES.length - 1}
            aria-disabled={current >= SLIDES.length - 1}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-mono bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:hover:bg-white/5"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 md:mb-6">
            <div className="font-display uppercase tracking-tight text-4xl md:text-5xl leading-[0.95]">
              {slide.title}
            </div>
            {slide.subtitle ? (
              <p className="mt-2 text-fg/70 max-w-2xl">{slide.subtitle}</p>
            ) : null}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={clsx(
                "grid gap-3 md:gap-4",
                "grid-cols-1",
                "lg:grid-cols-12 lg:grid-rows-8",
              )}
            >
              {tileGrid.map((t) => (
                <div
                  key={t.id}
                  className={clsx(
                    "lg:col-start-[var(--c)] lg:row-start-[var(--r)]",
                    "lg:col-span-[var(--cs)] lg:row-span-[var(--rs)]",
                  )}
                  style={
                    {
                      ["--c" as never]: String(clamp(t.col, 1, 12)),
                      ["--r" as never]: String(clamp(t.row, 1, 8)),
                      ["--cs" as never]: String(clamp(t.colSpan, 1, 12)),
                      ["--rs" as never]: String(clamp(t.rowSpan, 1, 8)),
                    } as React.CSSProperties
                  }
                >
                  <TileCard tile={t} />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

