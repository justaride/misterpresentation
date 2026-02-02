import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Copy,
  Code,
} from "lucide-react";

interface CodeStep {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  highlightLines?: number[];
  type: "single" | "dual" | "final";
  secondaryCode?: string; // For comparison
}

const STEPS: CodeStep[] = [
  {
    id: "start",
    title: "Starting Point: The Window Width Component",
    subtitle: "A simple component that tracks window size using local state.",
    type: "single",
    code: `function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div>Window width: {width}px</div>;
}`,
  },
  {
    id: "problem",
    title: "The Problem: Code Duplication",
    subtitle: "We need this exact same logic in other components.",
    type: "dual",
    code: `function ProfileCard() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div className={width < 600 ? "card-v" : "card-h"}>...</div>;
}`,
    secondaryCode: `function Navbar() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <nav>{width < 768 ? <MobileNav /> : <DesktopNav />}</nav>;
}`,
  },
  {
    id: "extract",
    title: "Step 1: Extract the Logic",
    subtitle:
      "Move the useState and useEffect into a new function starting with 'use'.",
    type: "single",
    highlightLines: [1, 11],
    code: `function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}`,
  },
  {
    id: "refactor",
    title: "Step 2: Use the Hook",
    subtitle: "The component is now focused solely on rendering.",
    type: "single",
    highlightLines: [2],
    code: `function WindowWidth() {
  const width = useWindowWidth();

  return <div>Window width: {width}px</div>;
}`,
  },
  {
    id: "antipattern",
    title: "Anti-Pattern: useEffect for Derived State",
    subtitle: "A common mistake — don't sync state you can compute.",
    type: "dual",
    code: `function BadExample({ items }) {
  const [count, setCount] = useState(0);

  // Don't do this!
  useEffect(() => {
    setCount(items.length);
  }, [items]);

  return <div>{count} items</div>;
}`,
    secondaryCode: `function GoodExample({ items }) {
  // Just compute it directly
  const count = items.length;

  return <div>{count} items</div>;
}`,
  },
  {
    id: "testing",
    title: "Testing Custom Hooks",
    subtitle: "Hooks are just functions — test them like functions.",
    type: "single",
    highlightLines: [1, 2, 8],
    code: `import { renderHook, act } from '@testing-library/react';
import { useWindowWidth } from './useWindowWidth';

test('returns initial window width', () => {
  const { result } = renderHook(() => useWindowWidth());
  expect(result.current).toBe(window.innerWidth);

  act(() => window.dispatchEvent(new Event('resize')));
  expect(result.current).toBe(window.innerWidth);
});`,
  },
  {
    id: "advanced",
    title: "Advanced: Debounced Hook",
    subtitle: "Add debouncing for performance-sensitive scenarios.",
    type: "dual",
    code: `function useWindowWidth(delay = 150) {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let timeout: number;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(
        () => setWidth(window.innerWidth),
        delay
      );
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [delay]);

  return width;
}`,
    secondaryCode: `// Usage with custom delay
function Dashboard() {
  const width = useWindowWidth(300);

  return (
    <div className={width < 1024 ? "compact" : "full"}>
      <Charts />
    </div>
  );
}`,
  },
  {
    id: "final",
    title: "Hook Extracted!",
    subtitle: "One hook, infinite components. Reusable, testable, and clean.",
    type: "final",
    code: `// The Final Pattern
export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  // ... effect logic ...
  return width;
}

// Any component can now use it:
const width = useWindowWidth();`,
  },
];

export function LiveCodeWalkthrough() {
  const [current, setCurrent] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Sync a local width for the preview
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = useCallback(
    () => setCurrent((s) => Math.min(s + 1, STEPS.length - 1)),
    [],
  );
  const prev = useCallback(() => setCurrent((s) => Math.max(s - 1, 0)), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const step = STEPS[current];

  return (
    <div className="relative w-full h-screen bg-[#0D1117] text-slate-300 overflow-hidden font-sans">
      <div className="h-full flex flex-col p-8 md:p-12">
        {/* Header */}
        <header className="mb-8">
          <motion.div
            key={step.id + "header"}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {step.title}
            </h1>
            <p className="text-xl text-slate-400 font-light max-w-3xl">
              {step.subtitle}
            </p>
          </motion.div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 overflow-hidden">
          {/* Code Section */}
          <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-2 mb-2 px-4 py-2 bg-[#161B22] border border-slate-800 rounded-t-xl text-xs font-mono">
              <Code size={14} className="text-cyan-400" />
              <span>
                {step.id === "extract"
                  ? "useWindowWidth.js"
                  : "WindowWidth.jsx"}
              </span>
            </div>
            <div className="flex-1 bg-[#161B22] border-x border-b border-slate-800 rounded-b-xl overflow-hidden shadow-2xl relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id + "code"}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full overflow-auto"
                >
                  <div className="grid grid-cols-1 h-full">
                    <SyntaxHighlighter
                      language="javascript"
                      style={atomDark}
                      customStyle={{
                        margin: 0,
                        padding: "2rem",
                        fontSize: "1.1rem",
                        backgroundColor: "transparent",
                        height: "100%",
                      }}
                      wrapLines={true}
                      lineProps={(lineNumber) => {
                        const style: React.CSSProperties = { display: "block" };
                        if (step.highlightLines?.includes(lineNumber)) {
                          style.backgroundColor = "rgba(103, 232, 249, 0.1)";
                          style.borderLeft = "4px solid #22d3ee";
                        }
                        return { style };
                      }}
                    >
                      {step.code}
                    </SyntaxHighlighter>
                  </div>
                  {step.type === "dual" && step.secondaryCode && (
                    <div className="mt-4 border-t border-slate-800">
                      <div className="px-4 py-2 bg-slate-900/50 text-[10px] font-mono border-b border-slate-800 flex items-center gap-2">
                        <Copy size={10} /> Navbar.jsx
                      </div>
                      <SyntaxHighlighter
                        language="javascript"
                        style={atomDark}
                        customStyle={{
                          margin: 0,
                          padding: "2rem",
                          fontSize: "1.1rem",
                          backgroundColor: "transparent",
                        }}
                      >
                        {step.secondaryCode}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Preview Section */}
          <aside className="flex flex-col gap-8 h-full">
            <div className="bg-[#161B22] border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Live Preview
              </div>
              <div className="p-8 bg-black/40 rounded-3xl border border-slate-800 w-full">
                <div className="text-5xl font-mono text-white mb-2">
                  {windowWidth}
                  <span className="text-cyan-400 text-xl ml-1">px</span>
                </div>
                <div className="text-slate-500 text-sm uppercase tracking-tighter">
                  Current Width
                </div>
              </div>
            </div>

            <div className="flex-1 bg-gradient-to-br from-indigo-900/20 to-cyan-900/20 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Play size={18} className="text-cyan-400" /> Lesson Note
                </h3>
                <div className="space-y-4 text-slate-400">
                  {current === 0 && (
                    <p>
                      Notice the repetitive logic required to manage the resize
                      event listener. This component is doing too many things.
                    </p>
                  )}
                  {current === 1 && (
                    <p>
                      If we add this to every responsive component, our codebase
                      will quickly become bloated and hard to maintain.
                    </p>
                  )}
                  {current === 2 && (
                    <p>
                      Hooks allow us to extract component logic into reusable
                      functions. This function is now independent of any UI.
                    </p>
                  )}
                  {current === 3 && (
                    <p>
                      Look how much simpler the component is now. It describes
                      *what* to show, not *how* to calculate the data.
                    </p>
                  )}
                  {current === 4 && (
                    <p>
                      Avoid useEffect for values you can compute directly.
                      Derived state is a common source of unnecessary renders.
                    </p>
                  )}
                  {current === 5 && (
                    <p>
                      Custom hooks are just functions — use renderHook from
                      React Testing Library to test them in isolation.
                    </p>
                  )}
                  {current === 6 && (
                    <p>
                      Debouncing prevents excessive re-renders during rapid
                      window resizing. The delay parameter makes it
                      configurable.
                    </p>
                  )}
                  {current === 7 && (
                    <div className="flex flex-col items-center gap-6 mt-8">
                      <CheckCircle2 size={64} className="text-green-400" />
                      <p className="text-center font-bold text-white">
                        Refactoring Complete!
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {/* Decorative Background Icon */}
              <Copy
                size={200}
                className="absolute -bottom-10 -right-10 text-white/5 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700"
              />
            </div>
          </aside>
        </main>

        {/* Footer Navigation */}
        <footer className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border-2 border-[#0D1117] transition-colors ${
                    i <= current ? "bg-cyan-400" : "bg-slate-800"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-slate-500">
              STEP {current + 1} OF {STEPS.length}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              disabled={current === 0}
              className={`p-3 rounded-xl border border-slate-800 transition-all ${
                current === 0
                  ? "opacity-20 cursor-not-allowed"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              disabled={current === STEPS.length - 1}
              className={`px-8 py-3 rounded-xl bg-cyan-600 text-white font-bold transition-all flex items-center gap-2 ${
                current === STEPS.length - 1
                  ? "opacity-20 cursor-not-allowed"
                  : "hover:bg-cyan-500 hover:scale-105 active:scale-95"
              }`}
            >
              {current === STEPS.length - 1 ? "Finished" : "Next Step"}
              <ChevronRight size={20} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
