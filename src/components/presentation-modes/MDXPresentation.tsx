import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Code,
  Layout as LayoutIcon,
} from "lucide-react";

interface MDXSlide {
  id: string;
  type: "hero" | "split" | "demo" | "code" | "summary";
  content: {
    headline: string;
    subheading?: string;
    code?: string;
    body?: string[];
    demo?: React.ReactNode;
  };
}

const SLIDES: MDXSlide[] = [
  {
    id: "hero",
    type: "hero",
    content: {
      headline: "React Hooks",
      subheading: "Functional components on steroids.",
      code: "const [state, setState] = useState(0);",
    },
  },
  {
    id: "why",
    type: "split",
    content: {
      headline: "The 'Why'",
      body: [
        "Plain functions instead of classes",
        "Better logic reuse with Custom Hooks",
        "No more lifecycle method mess",
        "Cleaner, more readable code",
      ],
    },
  },
  {
    id: "usestate",
    type: "demo",
    content: {
      headline: "useState",
      code: `function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
      demo: <CounterDemo />,
    },
  },
  {
    id: "useeffect",
    type: "code",
    content: {
      headline: "useEffect",
      subheading: "Synchronize with external systems.",
      code: `useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => clearInterval(timer);
}, []);`,
    },
  },
  {
    id: "custom",
    type: "code",
    content: {
      headline: "Custom Hooks",
      subheading: "Extract and reuse your logic.",
      code: `function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    // ... logic to track connectivity
  }, []);

  return isOnline;
}`,
    },
  },
  {
    id: "useref",
    type: "demo",
    content: {
      headline: "useRef",
      code: `function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>
        Focus
      </button>
    </>
  );
}`,
      demo: <FocusDemo />,
    },
  },
  {
    id: "usememo",
    type: "code",
    content: {
      headline: "useMemo",
      subheading: "Cache expensive computations between renders.",
      code: `function FilteredList({ items, query }) {
  const filtered = useMemo(
    () => items.filter(item =>
      item.name.toLowerCase().includes(query)
    ),
    [items, query]
  );

  return <ul>{filtered.map(i => <li key={i.id}>{i.name}</li>)}</ul>;
}`,
    },
  },
  {
    id: "patterns",
    type: "split",
    content: {
      headline: "Hook Patterns",
      body: [
        "useReducer for complex state logic",
        "useCallback to stabilize callbacks",
        "useId for accessible form labels",
        "useSyncExternalStore for external data",
      ],
    },
  },
  {
    id: "comparison",
    type: "split",
    content: {
      headline: "Class vs Hooks",
      body: [
        "componentDidMount → useEffect(() => {}, [])",
        "this.state → useState()",
        "shouldComponentUpdate → React.memo + useMemo",
        "refs → useRef()",
      ],
    },
  },
  {
    id: "summary",
    type: "summary",
    content: {
      headline: "Hooks = Happiness",
      body: [
        "Simpler components",
        "Better logic reuse",
        "Future-proof React code",
      ],
    },
  },
];

function CounterDemo() {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-black/40 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
      <div className="text-4xl font-mono text-cyan-400">{count}</div>
      <button
        onClick={() => setCount(count + 1)}
        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.4)]"
      >
        Click Me
      </button>
      <button
        onClick={() => setCount(0)}
        className="text-xs text-cyan-400/50 hover:text-cyan-400 underline"
      >
        Reset
      </button>
    </div>
  );
}

function FocusDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-black/40 rounded-2xl border border-cyan-500/30 backdrop-blur-sm">
      <input
        ref={inputRef}
        placeholder="Click the button..."
        className="px-4 py-2 bg-black/60 border border-slate-700 rounded-xl text-cyan-400 font-mono text-center focus:ring-2 focus:ring-cyan-500 outline-none"
      />
      <button
        onClick={() => inputRef.current?.focus()}
        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(8,145,178,0.4)]"
      >
        Focus Input
      </button>
    </div>
  );
}

export function MDXPresentation() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(
    () => setCurrent((s) => Math.min(s + 1, SLIDES.length - 1)),
    [],
  );
  const prev = useCallback(() => setCurrent((s) => Math.max(s - 1, 0)), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full h-screen bg-[#0B0F1A] text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center p-8 md:p-24"
        >
          <div className="w-full max-w-6xl">
            <SlideContent slide={slide} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-slate-900/80 backdrop-blur-xl px-6 py-3 rounded-full border border-slate-800 shadow-2xl z-50">
        <button
          onClick={prev}
          disabled={current === 0}
          className={`p-2 rounded-full transition-colors ${current === 0 ? "text-slate-700" : "text-cyan-400 hover:bg-cyan-400/10"}`}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-cyan-400 w-6"
                  : "bg-slate-700 w-1.5 hover:bg-slate-600"
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === SLIDES.length - 1}
          className={`p-2 rounded-full transition-colors ${current === SLIDES.length - 1 ? "text-slate-700" : "text-cyan-400 hover:bg-cyan-400/10"}`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 left-8 text-xs font-mono text-slate-500 flex items-center gap-4">
        <span>MDX_PRESENTATION_v1.0</span>
        <span className="h-3 w-px bg-slate-800" />
        <span className="text-cyan-400/50 uppercase tracking-widest">
          {slide.id}
        </span>
      </div>
    </div>
  );
}

function SlideContent({ slide }: { slide: MDXSlide }) {
  const { type, content } = slide;

  switch (type) {
    case "hero":
      return (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex p-4 bg-cyan-500/10 rounded-3xl text-cyan-400 mb-4"
          >
            <Zap size={48} />
          </motion.div>
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {content.headline}
          </h1>
          <p className="text-2xl md:text-3xl text-slate-400 font-light">
            {content.subheading}
          </p>
          {content.code && (
            <div className="max-w-md mx-auto mt-12 bg-black/50 p-6 rounded-2xl border border-slate-800 shadow-2xl">
              <code className="text-cyan-400 font-mono">{content.code}</code>
            </div>
          )}
        </div>
      );

    case "split":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              {content.headline}
            </h2>
            <ul className="space-y-6">
              {content.body?.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="flex items-start gap-4 text-xl md:text-2xl text-slate-400"
                >
                  <div className="mt-2.5 h-2 w-2 bg-cyan-500 rounded-full flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900/50 p-1 rounded-3xl border border-slate-800">
            <div className="aspect-video bg-black/40 rounded-[calc(1.5rem-1px)] flex items-center justify-center">
              <LayoutIcon size={120} className="text-slate-800" />
            </div>
          </div>
        </div>
      );

    case "demo":
      return (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-white flex items-center gap-3">
              <Code className="text-cyan-400" /> {content.headline}
            </h2>
            <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <SyntaxHighlighter
                language="jsx"
                style={atomDark}
                customStyle={{ margin: 0, padding: "2rem", fontSize: "1.1rem" }}
              >
                {content.code || ""}
              </SyntaxHighlighter>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-4 text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              Live Preview
            </div>
            {content.demo}
          </div>
        </div>
      );

    case "code":
      return (
        <div className="space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold text-white mb-4">
              {content.headline}
            </h2>
            <p className="text-2xl text-slate-400">{content.subheading}</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <SyntaxHighlighter
              language="jsx"
              style={atomDark}
              customStyle={{ margin: 0, padding: "2.5rem", fontSize: "1.2rem" }}
            >
              {content.code || ""}
            </SyntaxHighlighter>
          </div>
        </div>
      );

    case "summary":
      return (
        <div className="text-center space-y-12">
          <h2 className="text-7xl font-black text-white">{content.headline}</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {content.body?.map((item, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="bg-slate-900 border border-slate-800 p-8 rounded-3xl"
              >
                <div className="text-2xl font-bold text-cyan-400 mb-2">
                  {item}
                </div>
                <div className="text-sm text-slate-500">
                  Optimized for React 18+
                </div>
              </motion.div>
            ))}
          </div>
          <button className="px-10 py-4 bg-white text-black rounded-full font-black text-xl hover:scale-105 transition-transform">
            Start Hooking
          </button>
        </div>
      );

    default:
      return null;
  }
}
