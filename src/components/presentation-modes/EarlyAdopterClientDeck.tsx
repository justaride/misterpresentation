import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Maximize2, Minimize2, ChevronLeft, ChevronRight } from "lucide-react";

type SlideLayout =
  | "title"
  | "bullets"
  | "pillars"
  | "deliverables"
  | "layers"
  | "two-col"
  | "timeline"
  | "grid"
  | "options"
  | "before-after"
  | "cta";

type Slide = {
  id: string;
  kicker: string;
  headline: string;
  subheading?: string;
  layout: SlideLayout;
  bullets?: string[];
  sticker?: string;
};

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function CornerMarks() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {[
        "left-6 top-6",
        "right-6 top-6",
        "left-6 bottom-6",
        "right-6 bottom-6",
      ].map((pos) => (
        <div
          key={pos}
          className={`absolute ${pos} h-5 w-5`}
          aria-hidden="true"
        >
          <div className="absolute inset-y-0 left-0 w-[2px] bg-border/80" />
          <div className="absolute inset-x-0 top-0 h-[2px] bg-border/80" />
        </div>
      ))}
    </div>
  );
}

function Sticker({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-border bg-card font-mono text-[11px] font-bold uppercase tracking-[0.26em] rotate-[-1.2deg] shadow-[3px_3px_0_0_rgba(17,24,39,1)]">
      <span className="h-2 w-2 rounded-[3px] bg-accent" aria-hidden="true" />
      {children}
    </div>
  );
}

function Pillar({ title }: { title: string }) {
  return (
    <div className="relative rounded-2xl border-2 border-border bg-card/70 p-6 shadow-[6px_6px_0_0_rgba(17,24,39,1)] overflow-hidden">
      <div
        className="absolute right-[-30%] top-[-40%] h-[140%] w-[140%] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgb(var(--accent) / 0.55) 0%, transparent 55%)",
        }}
        aria-hidden="true"
      />
      <div className="relative">
        <div className="font-display uppercase tracking-tight text-2xl md:text-3xl leading-[0.95]">
          {title}
        </div>
        <div className="mt-3 h-[2px] w-12 bg-border/80" aria-hidden="true" />
      </div>
    </div>
  );
}

function LayerStack() {
  return (
    <div className="w-full max-w-xl mx-auto">
      {[
        { label: "STYLE TOKENS", desc: "Style tokens keep everything on-brand." },
        { label: "TEMPLATES", desc: "Templates keep layouts consistent." },
        { label: "CONTENT", desc: "Content stays fresh without rewrites." },
      ].map((l, idx) => (
        <div
          key={l.label}
          className="relative rounded-2xl border-2 border-border bg-card/70 p-6 shadow-[6px_6px_0_0_rgba(17,24,39,1)]"
          style={{ transform: `translateY(${idx * -10}px)` }}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                LAYER {idx + 1}
              </div>
              <div className="mt-2 font-display uppercase tracking-tight text-2xl">
                {l.label}
              </div>
              <p className="mt-2 text-[15px] md:text-[16px] leading-relaxed text-fg/80 max-w-[48ch]">
                {l.desc}
              </p>
            </div>
            <div className="h-10 w-10 rounded-2xl border-2 border-border bg-accent shadow-[3px_3px_0_0_rgba(17,24,39,1)] shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  const steps = [
    "Day 1: Kickoff + story spine",
    "Day 3: Template wireframes",
    "Day 7: Visual system locked",
    "Day 10: Build complete",
    "Day 14: Handoff + rehearsal",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="hidden md:block">
        <div className="relative mt-8">
          <div className="absolute left-0 right-0 top-7 h-[3px] bg-warn border-2 border-border" />
          <div className="grid grid-cols-5 gap-6">
            {steps.map((s, i) => (
              <div key={s} className="relative">
                <div className="mx-auto h-7 w-7 rounded-full bg-warn border-2 border-border shadow-[3px_3px_0_0_rgba(17,24,39,1)]" />
                <div className="mt-5 text-center">
                  <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                    Step {i + 1}
                  </div>
                  <div className="mt-1 text-[14px] leading-snug text-fg/85">
                    {s}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden mt-4 space-y-4">
        {steps.map((s, i) => (
          <div
            key={s}
            className="flex items-start gap-4 rounded-2xl border-2 border-border bg-card/70 p-5 shadow-[6px_6px_0_0_rgba(17,24,39,1)]"
          >
            <div className="h-8 w-8 rounded-2xl bg-warn border-2 border-border shadow-[3px_3px_0_0_rgba(17,24,39,1)] shrink-0 flex items-center justify-center font-mono text-[12px] font-bold">
              {i + 1}
            </div>
            <div className="text-[14px] leading-snug text-fg/85">{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Options() {
  const cards = [
    {
      title: "FAST PILOT",
      body: "One flagship deck + core templates. Built for speed.",
      bestFor: "launches + first customers",
      tab: "bg-accent",
    },
    {
      title: "FULL PILOT",
      body: "Flagship deck + templates + data hooks + rehearsal.",
      bestFor: "repeatable sales motion",
      tab: "bg-fg",
    },
    {
      title: "ROLL OUT",
      body: "Pilot plus enablement: team training + governance.",
      bestFor: "multi-team consistency",
      tab: "bg-warn",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
      {cards.map((c) => (
        <div
          key={c.title}
          className="relative rounded-2xl border-2 border-border bg-card/70 p-6 shadow-[8px_8px_0_0_rgba(17,24,39,1)] overflow-hidden"
        >
          <div className={`absolute right-0 top-0 h-3 w-16 ${c.tab}`} />
          <div className="font-display uppercase tracking-tight text-3xl leading-[0.95]">
            {c.title}
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-fg/85">
            {c.body}
          </p>
          <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
            BEST FOR
          </div>
          <div className="mt-1 text-[14px] text-fg/85">{c.bestFor}</div>
        </div>
      ))}
    </div>
  );
}

function BeforeAfter() {
  const pairs = [
    ["Before: Slides updated in batches. Decisions lag.", "After: Slides update as the product updates."],
    ["Before: Demos are separate. The story fragments.", "After: Demos live inside the narrative."],
    ["Before: Every team improvises.", "After: Templates enforce consistency."],
  ];
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-2xl border-2 border-border bg-card/70 p-6 shadow-[8px_8px_0_0_rgba(17,24,39,1)]">
        <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
          BEFORE / AFTER
        </div>
        <div className="mt-4 space-y-4">
          {pairs.map(([b, a]) => (
            <div key={b} className="space-y-2">
              <div className="text-[15px] leading-relaxed text-fg/85">{b}</div>
              <div className="text-[15px] leading-relaxed text-fg font-medium">
                <span className="inline-block px-2 py-0.5 bg-accent border-2 border-border shadow-[3px_3px_0_0_rgba(17,24,39,1)] mr-2">
                  After
                </span>
                {a.replace(/^After:\s*/, "")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border-2 border-border bg-card/70 p-8 shadow-[8px_8px_0_0_rgba(17,24,39,1)] flex flex-col justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
            QUOTE
          </div>
          <div className="mt-4 text-2xl md:text-3xl leading-snug font-medium">
            "We stopped rewriting decks and started shipping them."
          </div>
          <div className="mt-6 h-[2px] w-20 bg-accent border border-border" aria-hidden="true" />
        </div>
        <div className="mt-10 font-mono text-[12px] uppercase tracking-[0.26em] text-fg/75">
          Head of Product Marketing
        </div>
      </div>
    </div>
  );
}

export function EarlyAdopterClientDeck() {
  const slides = useMemo<Slide[]>(
    () => [
      {
        id: "be-the-first",
        kicker: "EARLY ADOPTER CLIENT DECK",
        headline: "BE THE FIRST",
        subheading: "Turn product truth into a deck that sells itself.",
        layout: "title",
      },
      {
        id: "last-mile",
        kicker: "PROBLEM",
        headline: "YOUR STORY BREAKS AT THE LAST MILE",
        layout: "bullets",
        bullets: [
          "The deck you shipped last month is already stale.",
          "Every update requires design time and a new export.",
          "Interactive demos live somewhere else, not in the narrative.",
          "Sales decks drift. Product decks drift. Everyone drifts.",
        ],
        sticker: "THIS IS FIXABLE.",
      },
      {
        id: "new-approach",
        kicker: "APPROACH",
        headline: "BUILD A DECK SYSTEM, NOT A DECK FILE",
        subheading:
          "Early adopters win by shipping the narrative as fast as the product.",
        layout: "pillars",
        bullets: [
          "Templates that match how you sell",
          "Styles that stay consistent under pressure",
          "Content that updates without re-exporting",
        ],
      },
      {
        id: "deliverables",
        kicker: "DELIVERABLES",
        headline: "YOUR PILOT DELIVERABLES",
        layout: "deliverables",
        bullets: [
          "One flagship client deck (the one you use every week)",
          "Three reusable slide templates (problem, proof, proposal)",
          "A style kit: type scale, colors, spacing, components",
          "A content model: what changes weekly vs. quarterly",
          "A handoff: your team can keep shipping without us",
        ],
      },
      {
        id: "layers",
        kicker: "MODEL",
        headline: "THREE LAYERS, ONE SOURCE OF TRUTH",
        layout: "layers",
      },
      {
        id: "scope",
        kicker: "PILOT",
        headline: "A LOW-RISK PILOT YOU CAN SAY YES TO",
        layout: "two-col",
      },
      {
        id: "timeline",
        kicker: "TIMELINE",
        headline: "14 DAYS TO A DECK YOU CAN SHIP",
        layout: "timeline",
      },
      {
        id: "stack",
        kicker: "ADOPTION",
        headline: "FITS YOUR STACK, NOT THE OTHER WAY AROUND",
        subheading:
          "We keep the narrative connected to reality: data, demos, and updates.",
        layout: "grid",
      },
      {
        id: "options",
        kicker: "CHOICE",
        headline: "PICK YOUR PILOT",
        layout: "options",
      },
      {
        id: "proof",
        kicker: "OUTCOME",
        headline: "WHAT CHANGES AFTER THE PILOT",
        layout: "before-after",
      },
      {
        id: "next-step",
        kicker: "NEXT STEP",
        headline: "NEXT STEP: SAY YES TO A KICKOFF",
        layout: "cta",
      },
    ],
    [],
  );

  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const clampIndex = useCallback(
    (idx: number) => clamp(idx, 0, Math.max(0, slides.length - 1)),
    [slides.length],
  );

  const next = useCallback(
    () => setCurrent((c) => clampIndex(c + 1)),
    [clampIndex],
  );
  const prev = useCallback(
    () => setCurrent((c) => clampIndex(c - 1)),
    [clampIndex],
  );

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFs);
    return () => document.removeEventListener("fullscreenchange", handleFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        prev();
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, toggleFullscreen]);

  const slide = slides[current];
  const positionLabel = `${current + 1} / ${slides.length}`;

  const pageVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
      show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.45, ease: EASE_OUT },
      },
      exit: { opacity: 0, y: -10, filter: "blur(10px)", transition: { duration: 0.25 } },
    }),
    [],
  );

  return (
    <div
      ref={containerRef}
      // Use viewport-relative height so the deck is a "real" box even when embedded
      // inside flex layouts (percentage heights can collapse when parents aren't definite).
      className={`relative w-full ${isFullscreen ? "h-[100dvh]" : "min-h-[100dvh]"} overflow-hidden select-none`}
      data-testid="ea-deck"
    >
      {/* Atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(1200px circle at 12% 18%, rgb(var(--accent) / 0.20), transparent 60%)",
            "radial-gradient(900px circle at 88% 72%, rgb(var(--fg) / 0.08), transparent 62%)",
            "linear-gradient(180deg, rgb(var(--bg)) 0%, rgb(var(--bg) / 0.95) 100%)",
          ].join(", "),
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply">
        <div className="noise-overlay" />
      </div>
      <CornerMarks />

      <AnimatePresence mode="wait">
        <motion.section
          key={slide.id}
          className="absolute inset-0"
          variants={pageVariants}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <div className="h-full w-full p-[clamp(1.25rem,3vw,3.25rem)]">
            <div className="h-full w-full rounded-[28px] border-2 border-border bg-card/55 backdrop-blur-[2px] shadow-[0_24px_60px_rgba(11,15,26,0.12)] overflow-hidden relative">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(900px circle at 15% 20%, rgb(var(--fg) / 0.04), transparent 60%), radial-gradient(700px circle at 90% 80%, rgb(var(--fg) / 0.03), transparent 62%)",
                }}
                aria-hidden="true"
              />

              <div className="absolute inset-0 p-[clamp(1rem,2.4vw,2.25rem)]">
                <div className="grid grid-cols-12 gap-6 h-full relative">
                  <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
                    <Sticker>{slide.kicker}</Sticker>
                    <h2 className="mt-6 font-display uppercase tracking-tight leading-[0.9] text-[clamp(2.6rem,5.4vw,5.8rem)]">
                      {slide.headline}
                    </h2>
                    {slide.subheading ? (
                      <p className="mt-4 text-[clamp(1rem,1.5vw,1.35rem)] leading-relaxed text-fg/75 max-w-[52ch]">
                        {slide.subheading}
                      </p>
                    ) : null}

                    {slide.layout === "bullets" && slide.bullets ? (
                      <ul className="mt-7 space-y-3 text-[clamp(0.98rem,1.35vw,1.2rem)] leading-relaxed text-fg/80 max-w-[58ch]">
                        {slide.bullets.map((b) => (
                          <li key={b} className="flex gap-3">
                            <span className="mt-[0.45em] w-2 h-2 rounded-[3px] shrink-0 bg-accent border border-border" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {slide.layout === "deliverables" && slide.bullets ? (
                      <div className="mt-7 grid grid-cols-1 gap-3 max-w-[60ch]">
                        {slide.bullets.map((b) => (
                          <div
                            key={b}
                            className="flex items-start gap-3 rounded-2xl border-2 border-border bg-card/70 px-4 py-3 shadow-[5px_5px_0_0_rgba(17,24,39,1)]"
                          >
                            <div className="h-6 w-6 rounded-xl bg-accent border-2 border-border shadow-[2px_2px_0_0_rgba(17,24,39,1)] shrink-0" />
                            <div className="text-[15px] leading-relaxed text-fg/85">
                              {b}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {slide.layout === "pillars" && slide.bullets ? (
                      <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {slide.bullets.map((t) => (
                          <Pillar key={t} title={t} />
                        ))}
                      </div>
                    ) : null}

                    {slide.layout === "two-col" ? (
                      <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[60ch]">
                        <div className="rounded-2xl border-2 border-border bg-card/70 p-5 shadow-[8px_8px_0_0_rgba(17,24,39,1)]">
                          <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                            INCLUDED
                          </div>
                          <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-fg/85">
                            {[
                              "Kickoff: goals, audience, story spine",
                              "Design: template + style kit",
                              "Build: interactive deck implementation",
                              "Review: two rounds of feedback",
                              "Handoff: documentation + training",
                            ].map((x) => (
                              <li key={x} className="flex gap-3">
                                <span className="mt-[0.42em] w-2 h-2 rounded-[3px] shrink-0 bg-accent border border-border" />
                                <span>{x}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl border-2 border-border bg-card/70 p-5 shadow-[8px_8px_0_0_rgba(17,24,39,1)]">
                          <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                            NOT INCLUDED
                          </div>
                          <ul className="mt-4 space-y-2 text-[15px] leading-relaxed text-fg/85">
                            {[
                              "A complete rebrand",
                              "Long-form copywriting for every business line",
                              "A custom CMS (we can integrate later)",
                            ].map((x) => (
                              <li key={x} className="flex gap-3">
                                <span className="mt-[0.42em] w-2 h-2 rounded-[3px] shrink-0 bg-fg border border-border" />
                                <span>{x}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : null}

                    {slide.layout === "cta" ? (
                      <div className="mt-7 max-w-[60ch]">
                        <ul className="space-y-3 text-[15px] md:text-[16px] leading-relaxed text-fg/85">
                          {[
                            "Send your flagship deck (or the last version you shipped).",
                            "Tell us who the early adopters are and what they must believe.",
                            "Pick the pilot option: FAST PILOT, FULL PILOT, or ROLL OUT.",
                          ].map((x) => (
                            <li key={x} className="flex gap-3">
                              <span className="mt-[0.42em] w-2 h-2 rounded-[3px] shrink-0 bg-accent border border-border" />
                              <span>{x}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-8 flex items-center justify-between gap-6">
                          <div className="font-mono text-[12px] uppercase tracking-[0.26em] text-fg/70">
                            If you can ship product weekly, you can ship your story weekly.
                          </div>
                          <div className="inline-flex items-center justify-center px-8 py-4 bg-accent text-fg font-display text-xl tracking-wide uppercase border-2 border-border shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]">
                            LET’S KICK OFF
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="col-span-12 lg:col-span-5 relative flex items-center justify-center">
                    {slide.layout === "title" ? (
                      <div className="relative w-full max-w-md aspect-[4/3] rounded-[28px] border-2 border-border bg-card/65 shadow-[10px_10px_0_0_rgba(17,24,39,1)] overflow-hidden">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage:
                              "radial-gradient(500px circle at 30% 30%, rgb(var(--accent) / 0.55), transparent 60%), radial-gradient(520px circle at 80% 70%, rgb(var(--fg) / 0.16), transparent 62%)",
                          }}
                          aria-hidden="true"
                        />
                        <div className="absolute inset-0 p-6">
                          <div className="h-full w-full border-2 border-border/40 rounded-2xl grid-paper" />
                        </div>
                        <div className="absolute left-6 bottom-6 right-6">
                          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-fg/65">
                            SIGNAL
                          </div>
                          <div className="mt-3 h-[2px] bg-border/60" />
                          <div className="mt-4 grid grid-cols-3 gap-3">
                            {[0, 1, 2].map((i) => (
                              <div
                                key={i}
                                className="h-12 rounded-2xl border-2 border-border bg-fg/10"
                                style={{
                                  transform: `translateY(${(2 - i) * 8}px)`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {slide.layout === "bullets" ? (
                      <div className="w-full max-w-md">
                        {slide.sticker ? (
                          <div className="mb-6">
                            <div className="inline-flex items-center px-4 py-2 bg-accent text-fg font-mono text-xs font-bold uppercase tracking-wider border-2 border-border shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] rotate-[1.4deg]">
                              {slide.sticker}
                            </div>
                          </div>
                        ) : null}
                        <div className="rounded-[28px] border-2 border-border bg-card/70 p-6 shadow-[10px_10px_0_0_rgba(17,24,39,1)]">
                          <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                            BROKEN HANDOFF
                          </div>
                          <div className="mt-6 space-y-4">
                            {[
                              { label: "Product" },
                              { label: "Design" },
                              { label: "Sales" },
                            ].map((x, idx) => (
                              <div key={x.label} className="relative">
                                <div className="rounded-2xl border-2 border-border bg-bg/60 px-4 py-3 shadow-[4px_4px_0_0_rgba(17,24,39,1)]">
                                  <div className="font-display uppercase tracking-tight text-xl">
                                    {x.label}
                                  </div>
                                </div>
                                {idx < 2 ? (
                                  <div className="mt-3 flex items-center justify-center">
                                    <div className="h-7 w-7 rounded-full border-2 border-border bg-accent shadow-[3px_3px_0_0_rgba(17,24,39,1)]" />
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 text-[13px] text-fg/70">
                            The arrows look fine until the day everything changes.
                          </div>
                        </div>
                      </div>
                    ) : null}

                    {slide.layout === "layers" ? <LayerStack /> : null}
                    {slide.layout === "timeline" ? <Timeline /> : null}
                    {slide.layout === "grid" ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-md">
                        {[
                          "FIGMA",
                          "NOTION",
                          "CMS",
                          "APIs",
                          "ANALYTICS",
                          "SALES ENABLEMENT",
                        ].map((x, i) => (
                          <div
                            key={x}
                            className="relative rounded-2xl border-2 border-border bg-card/70 p-5 shadow-[7px_7px_0_0_rgba(17,24,39,1)] overflow-hidden"
                          >
                            <div
                              className={`absolute right-0 top-0 h-3 w-14 ${i % 3 === 0 ? "bg-accent" : i % 3 === 1 ? "bg-fg" : "bg-warn"}`}
                            />
                            <div className="font-display uppercase tracking-tight text-xl leading-[0.95]">
                              {x}
                            </div>
                            <div className="mt-3 h-[2px] w-10 bg-border/70" />
                          </div>
                        ))}
                      </div>
                    ) : null}
                    {slide.layout === "options" ? <Options /> : null}
                    {slide.layout === "before-after" ? <BeforeAfter /> : null}
                    {slide.layout === "deliverables" ? (
                      <div className="hidden lg:block w-full max-w-sm rounded-[28px] border-2 border-border bg-card/70 p-6 shadow-[10px_10px_0_0_rgba(17,24,39,1)]">
                        <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                          DELIVERABLE STACK
                        </div>
                        <div className="mt-5 space-y-3">
                          {[
                            "Flagship deck",
                            "Templates",
                            "Style kit",
                            "Content model",
                            "Handoff",
                          ].map((x, i) => (
                            <div
                              key={x}
                              className="rounded-2xl border-2 border-border bg-bg/60 px-4 py-3 shadow-[4px_4px_0_0_rgba(17,24,39,1)]"
                              style={{ transform: `translateY(${i * -6}px)` }}
                            >
                              <div className="font-display uppercase tracking-tight text-lg">
                                {x}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {slide.layout === "pillars" ? (
                      <div className="hidden lg:block w-full max-w-sm rounded-[28px] border-2 border-border bg-card/70 p-6 shadow-[10px_10px_0_0_rgba(17,24,39,1)]">
                        <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                          REMINDER
                        </div>
                        <div className="mt-4 text-[15px] leading-relaxed text-fg/85">
                          Early adopters do not need more slides. They need a system that
                          stays true while everything changes.
                        </div>
                        <div className="mt-6 h-[2px] w-20 bg-accent border border-border" />
                      </div>
                    ) : null}
                    {slide.layout === "two-col" ? (
                      <div className="hidden lg:block w-full max-w-sm rounded-[28px] border-2 border-border bg-card/70 p-6 shadow-[10px_10px_0_0_rgba(17,24,39,1)]">
                        <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                          STAMP
                        </div>
                        <div className="mt-6 inline-flex items-center px-5 py-3 bg-accent text-fg font-display text-2xl tracking-wide uppercase border-2 border-border shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] rotate-[1.6deg]">
                          PILOT
                        </div>
                        <div className="mt-6 text-[13px] text-fg/75">
                          Scope stays tight so the decision stays easy.
                        </div>
                      </div>
                    ) : null}
                    {slide.layout === "cta" ? (
                      <div className="hidden lg:block w-full max-w-sm rounded-[28px] border-2 border-border bg-card/70 p-6 shadow-[10px_10px_0_0_rgba(17,24,39,1)]">
                        <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-muted">
                          DECISION
                        </div>
                        <div className="mt-4 text-[15px] leading-relaxed text-fg/85">
                          This is the moment you turn the deck into an artifact your team can
                          maintain, not a file you keep recreating.
                        </div>
                        <div className="mt-6 h-[2px] w-20 bg-accent border border-border" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* HUD */}
      <div className="absolute inset-x-0 top-0 p-4 flex items-start justify-between gap-4">
        <div className="px-3 py-2 rounded-xl border-2 border-border bg-card/80 backdrop-blur-[2px] shadow-[0_10px_26px_rgba(11,15,26,0.10)]">
          <div className="font-mono text-[11px] uppercase tracking-[0.26em] text-fg/60">
            Early Adopter Deck
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div
              className="font-mono text-[12px] uppercase tracking-[0.22em] text-fg/75"
              data-testid="ea-slide-position"
            >
              {positionLabel}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            disabled={current === 0}
            className="group inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-border bg-card/80 hover:bg-card shadow-[0_10px_26px_rgba(11,15,26,0.10)] disabled:opacity-40 disabled:hover:bg-card/80 transition-colors"
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="w-5 h-5 text-fg/75 group-hover:text-fg/90 transition-colors" />
          </button>
          <button
            onClick={next}
            disabled={current === slides.length - 1}
            className="group inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-border bg-card/80 hover:bg-card shadow-[0_10px_26px_rgba(11,15,26,0.10)] disabled:opacity-40 disabled:hover:bg-card/80 transition-colors"
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="w-5 h-5 text-fg/75 group-hover:text-fg/90 transition-colors" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="group inline-flex items-center justify-center w-11 h-11 rounded-2xl border-2 border-border bg-card/80 hover:bg-card shadow-[0_10px_26px_rgba(11,15,26,0.10)] transition-colors"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            type="button"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-fg/75 group-hover:text-fg/90 transition-colors" />
            ) : (
              <Maximize2 className="w-5 h-5 text-fg/75 group-hover:text-fg/90 transition-colors" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
