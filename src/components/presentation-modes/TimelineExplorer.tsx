import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TimelineEvent = {
  year: number;
  title: string;
  description: string;
  era: "origins" | "dotcom" | "web2" | "modern";
  branch?: { title: string; year: number }[];
};

const ERA_COLORS: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  origins: {
    bg: "bg-amber-900/30",
    text: "text-amber-300",
    border: "border-amber-500",
    dot: "bg-amber-500",
  },
  dotcom: {
    bg: "bg-blue-900/30",
    text: "text-blue-300",
    border: "border-blue-500",
    dot: "bg-blue-500",
  },
  web2: {
    bg: "bg-emerald-900/30",
    text: "text-emerald-300",
    border: "border-emerald-500",
    dot: "bg-emerald-500",
  },
  modern: {
    bg: "bg-violet-900/30",
    text: "text-violet-300",
    border: "border-violet-500",
    dot: "bg-violet-500",
  },
};

const ERA_LABELS: Record<string, string> = {
  origins: "The Origins (1989-1998)",
  dotcom: "Dot-Com Era (1999-2005)",
  web2: "Web 2.0 (2006-2015)",
  modern: "Modern Web (2016-2025)",
};

const EVENTS: TimelineEvent[] = [
  {
    year: 1989,
    title: "World Wide Web Invented",
    description:
      "Tim Berners-Lee proposes the WWW at CERN, creating HTML, HTTP, and the first web server.",
    era: "origins",
  },
  {
    year: 1993,
    title: "Mosaic Browser",
    description:
      "NCSA Mosaic launches — the first popular graphical web browser. The web goes visual.",
    era: "origins",
  },
  {
    year: 1994,
    title: "Netscape Navigator",
    description:
      "Netscape goes public, sparking the commercial internet era. JavaScript is born a year later.",
    era: "origins",
    branch: [
      { title: "CSS 1.0 Published", year: 1996 },
      { title: "Internet Explorer 3", year: 1996 },
      { title: "Browser Wars Begin", year: 1997 },
    ],
  },
  {
    year: 1995,
    title: "JavaScript Created",
    description:
      "Brendan Eich creates JavaScript in 10 days at Netscape. The web becomes interactive.",
    era: "origins",
  },
  {
    year: 1998,
    title: "Google Founded",
    description:
      "Larry Page and Sergey Brin found Google. Search changes how we navigate the web.",
    era: "origins",
  },
  {
    year: 1999,
    title: "AJAX Emerges",
    description:
      "Microsoft introduces XMLHttpRequest. Asynchronous web interactions become possible.",
    era: "dotcom",
  },
  {
    year: 2004,
    title: "Web 2.0 & Social Media",
    description:
      "Facebook launches. Gmail uses AJAX extensively. User-generated content explodes.",
    era: "dotcom",
  },
  {
    year: 2005,
    title: "Ruby on Rails",
    description:
      "Rails popularizes convention over configuration. Web development becomes accessible.",
    era: "dotcom",
  },
  {
    year: 2006,
    title: "jQuery Released",
    description:
      "jQuery simplifies DOM manipulation and cross-browser compatibility. Becomes ubiquitous.",
    era: "web2",
  },
  {
    year: 2008,
    title: "Chrome & V8 Engine",
    description:
      "Google Chrome launches with V8, revolutionizing JavaScript performance.",
    era: "web2",
  },
  {
    year: 2009,
    title: "Node.js",
    description:
      "Ryan Dahl creates Node.js. JavaScript breaks free from the browser.",
    era: "web2",
  },
  {
    year: 2010,
    title: "npm & Mobile Web",
    description:
      "npm launches as Node package manager. Responsive design becomes essential with smartphone adoption.",
    era: "web2",
  },
  {
    year: 2013,
    title: "React by Facebook",
    description:
      "React introduces virtual DOM and component-based architecture. UI development transforms.",
    era: "web2",
  },
  {
    year: 2014,
    title: "TypeScript Gains Traction",
    description:
      "Microsoft's TypeScript reaches 1.0. Static typing comes to JavaScript at scale.",
    era: "web2",
  },
  {
    year: 2015,
    title: "ES6 / ES2015",
    description:
      "Massive JavaScript update: arrow functions, classes, modules, promises, template literals.",
    era: "web2",
  },
  {
    year: 2016,
    title: "Yarn & Create React App",
    description:
      "Facebook releases Yarn. Create React App lowers the barrier to React development.",
    era: "modern",
    branch: [
      { title: "Vue.js 2.0 Released", year: 2016 },
      { title: "Angular Rewrite", year: 2016 },
    ],
  },
  {
    year: 2018,
    title: "Deno Announced",
    description:
      "Ryan Dahl announces Deno — a secure runtime for JavaScript and TypeScript.",
    era: "modern",
  },
  {
    year: 2020,
    title: "Vite & Svelte 3",
    description:
      "Evan You creates Vite. Svelte 3 compiles away the framework. Build tools evolve rapidly.",
    era: "modern",
  },
  {
    year: 2022,
    title: "React Server Components",
    description:
      "React 18 ships with Server Components. Server-side rendering gets a modern rethink.",
    era: "modern",
  },
  {
    year: 2023,
    title: "AI-Assisted Coding",
    description:
      "GitHub Copilot, ChatGPT, and AI coding tools transform developer productivity.",
    era: "modern",
  },
  {
    year: 2025,
    title: "The AI-Native Web",
    description:
      "AI agents browse, build, and deploy. The line between developer and user blurs.",
    era: "modern",
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

export function TimelineExplorer() {
  const reducedMotion = useReducedMotion();
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [activeEvent, setActiveEvent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToEvent = useCallback(
    (idx: number) => {
      const el = eventRefs.current[idx];
      if (el && scrollRef.current) {
        const scrollLeft =
          el.offsetLeft -
          scrollRef.current.clientWidth / 2 +
          el.clientWidth / 2;
        scrollRef.current.scrollTo({
          left: scrollLeft,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }
      setActiveEvent(idx);
    },
    [reducedMotion],
  );

  const next = useCallback(() => {
    const n = Math.min(activeEvent + 1, EVENTS.length - 1);
    scrollToEvent(n);
  }, [activeEvent, scrollToEvent]);

  const prev = useCallback(() => {
    const n = Math.max(activeEvent - 1, 0);
    scrollToEvent(n);
  }, [activeEvent, scrollToEvent]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") setSelectedEvent(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      eventRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const dist = Math.abs(ref.offsetLeft + ref.clientWidth / 2 - center);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveEvent(closest);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const progress = EVENTS.length > 1 ? activeEvent / (EVENTS.length - 1) : 0;

  return (
    <div className="w-full h-full min-h-screen bg-gray-950 text-white flex flex-col">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <h1 className="text-lg font-bold">History of the Web</h1>
        <span className="text-xs font-mono text-white/40">
          {EVENTS[activeEvent].year} | {activeEvent + 1}/{EVENTS.length}
        </span>
      </div>

      <div className="px-4 py-2 flex gap-2 flex-wrap">
        {Object.entries(ERA_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${ERA_COLORS[key].dot}`} />
            <span className="text-[10px] text-white/50">{label}</span>
          </div>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden relative"
        style={{ scrollBehavior: reducedMotion ? "auto" : "smooth" }}
      >
        <div className="relative min-w-max h-full flex items-center px-[50vw]">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800" />

          {EVENTS.map((event, idx) => {
            const colors = ERA_COLORS[event.era];
            const isActive = idx === activeEvent;
            const isSelected = idx === selectedEvent;

            return (
              <div
                key={idx}
                ref={(el) => {
                  eventRefs.current[idx] = el;
                }}
                className="relative flex flex-col items-center mx-8 sm:mx-12"
                style={{ minWidth: 120 }}
              >
                <motion.button
                  onClick={() => {
                    scrollToEvent(idx);
                    setSelectedEvent(isSelected ? null : idx);
                  }}
                  animate={isActive ? { scale: 1.2 } : { scale: 1 }}
                  whileHover={{ scale: 1.3 }}
                  className={`relative z-10 w-5 h-5 rounded-full ${colors.dot} border-2 ${
                    isActive
                      ? "border-white shadow-lg shadow-white/20"
                      : "border-gray-700"
                  } transition-colors`}
                >
                  {event.year === 2025 && (
                    <div
                      className={`absolute inset-0 rounded-full ${colors.dot} animate-ping opacity-40`}
                    />
                  )}
                </motion.button>

                <div
                  className={`mt-2 text-center ${isActive ? "" : "opacity-60"}`}
                >
                  <p className={`text-xs font-bold ${colors.text}`}>
                    {event.year}
                  </p>
                  <p className="text-[10px] sm:text-xs text-white/70 max-w-[140px] leading-tight mt-0.5">
                    {event.title}
                  </p>
                </div>

                {event.branch && isActive && (
                  <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 flex gap-3">
                    {event.branch.map((b, bi) => (
                      <motion.div
                        key={bi}
                        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: bi * 0.1 }}
                        className={`px-2 py-1 rounded text-[9px] ${colors.bg} ${colors.text} border ${colors.border} whitespace-nowrap`}
                      >
                        {b.title} ({b.year})
                      </motion.div>
                    ))}
                  </div>
                )}

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={
                        reducedMotion
                          ? false
                          : { opacity: 0, y: 10, scale: 0.95 }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute top-[80px] left-1/2 -translate-x-1/2 w-72 p-4 rounded-lg ${colors.bg} border ${colors.border} z-20`}
                    >
                      <h3 className={`text-sm font-bold ${colors.text} mb-1`}>
                        {event.title}
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed">
                        {event.description}
                      </p>
                      <p
                        className={`text-[10px] ${colors.text} mt-2 opacity-60`}
                      >
                        {ERA_LABELS[event.era]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-800">
        <div className="relative h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 via-blue-500 via-emerald-500 to-violet-500 rounded-full"
            animate={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-white/40">
          <span>←→ Navigate | Click to expand</span>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={activeEvent === 0}
              className="hover:text-white disabled:opacity-30"
            >
              ← Prev
            </button>
            <button
              onClick={next}
              disabled={activeEvent === EVENTS.length - 1}
              className="hover:text-white disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
