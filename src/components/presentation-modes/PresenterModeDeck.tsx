import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  StickyNote,
} from "lucide-react";

type SlideData = {
  id: string;
  title: string;
  content: React.ReactNode;
  notes: string;
};

const SLIDES: SlideData[] = [
  {
    id: "welcome",
    title: "Presenter Mode",
    content: (
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
          Presenter Mode
        </h1>
        <p className="text-2xl text-white/60">
          A professional deck with timer, notes, and transitions
        </p>
      </div>
    ),
    notes:
      "Welcome the audience. Mention this is a demo of the presenter mode feature. The timer starts automatically.",
  },
  {
    id: "features",
    title: "Key Features",
    content: (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-5xl font-black mb-12 text-center">What You Get</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "⏱️",
              title: "Live Timer",
              desc: "Track elapsed time per slide and overall",
            },
            {
              icon: "📝",
              title: "Speaker Notes",
              desc: "Hidden notes visible only to presenter",
            },
            {
              icon: "🎬",
              title: "Smooth Transitions",
              desc: "Web Animations API powered reveals",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/5 rounded-2xl p-6 text-center border border-white/10"
            >
              <span className="text-4xl mb-4 block">{f.icon}</span>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    notes:
      "Walk through each feature. The timer in the bottom bar shows both slide time and total time. Notes panel toggles with N key.",
  },
  {
    id: "keyboard",
    title: "Keyboard Shortcuts",
    content: (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-5xl font-black mb-12 text-center">Controls</h2>
        <div className="space-y-4">
          {[
            { keys: "← →", action: "Navigate slides" },
            { keys: "Space", action: "Next slide" },
            { keys: "N", action: "Toggle notes panel" },
            { keys: "F", action: "Toggle fullscreen" },
            { keys: "R", action: "Reset timer" },
          ].map((shortcut) => (
            <div
              key={shortcut.keys}
              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <span className="text-lg">{shortcut.action}</span>
              <kbd className="px-3 py-1.5 bg-white/10 rounded-lg font-mono text-sm border border-white/20">
                {shortcut.keys}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    ),
    notes:
      "Demonstrate each keyboard shortcut live. Show the notes panel toggle. Fullscreen uses the browser Fullscreen API.",
  },
  {
    id: "timing",
    title: "Time Management",
    content: (
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-5xl font-black mb-8">Pacing Your Talk</h2>
        <div className="grid grid-cols-3 gap-8 mb-12">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
            <div className="text-4xl font-black text-emerald-400 mb-2">
              0:00–5:00
            </div>
            <p className="text-white/60 text-sm">Introduction & Hook</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
            <div className="text-4xl font-black text-blue-400 mb-2">
              5:00–15:00
            </div>
            <p className="text-white/60 text-sm">Core Content</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="text-4xl font-black text-amber-400 mb-2">
              15:00–20:00
            </div>
            <p className="text-white/60 text-sm">Wrap-up & Q&A</p>
          </div>
        </div>
        <p className="text-white/50">
          The timer below changes color as you approach time limits
        </p>
      </div>
    ),
    notes:
      "Explain how the timer color-codes: green under 5 min, yellow 5-15 min, red over 15 min. This helps speakers pace their talk.",
  },
  {
    id: "transitions",
    title: "Transition Showcase",
    content: (
      <div className="text-center">
        <h2 className="text-5xl font-black mb-8">Smooth Transitions</h2>
        <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
          Each slide transition uses spring physics with configurable stiffness
          and damping for natural motion.
        </p>
        <div className="flex justify-center gap-4">
          {["Enter", "Exit", "Cross-fade"].map((label) => (
            <div
              key={label}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-sm"
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    notes:
      "Point out how the slide content enters with a spring animation. The exit is a fade + slide. This is all Framer Motion under the hood.",
  },
  {
    id: "end",
    title: "Thank You",
    content: (
      <div className="text-center">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
          Thank You
        </h2>
        <p className="text-2xl text-white/40">
          Press R to reset • ← to go back
        </p>
      </div>
    ),
    notes:
      "Thank the audience. Open for questions. The timer shows total presentation duration.",
  },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PresenterModeDeck() {
  const [current, setCurrent] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [slideTime, setSlideTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime((p) => p + 1);
      setSlideTime((p) => p + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSlideTime(0);
  }, [current]);

  const next = useCallback(() => {
    setCurrent((p) => Math.min(p + 1, SLIDES.length - 1));
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => Math.max(p - 1, 0));
  }, []);

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

  const resetTimer = useCallback(() => {
    setTotalTime(0);
    setSlideTime(0);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "n" || e.key === "N") setShowNotes((p) => !p);
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === "r" || e.key === "R") resetTimer();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev, toggleFullscreen, resetTimer]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const timerColor =
    totalTime < 300
      ? "text-emerald-400"
      : totalTime < 900
        ? "text-amber-400"
        : "text-red-400";

  return (
    <div
      ref={containerRef}
      className="w-full h-screen bg-zinc-950 text-white flex flex-col overflow-hidden"
    >
      <div className="flex-1 flex relative">
        <div
          className={`flex-1 flex items-center justify-center p-8 transition-all ${showNotes ? "pr-0" : ""}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-5xl"
            >
              {SLIDES[current].content}
            </motion.div>
          </AnimatePresence>

          <div
            className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize z-10"
            onClick={prev}
          />
          <div
            className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize z-10"
            onClick={next}
          />
        </div>

        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="border-l border-white/10 bg-zinc-900 overflow-hidden flex-shrink-0"
            >
              <div className="p-6 w-80">
                <div className="flex items-center gap-2 mb-4">
                  <StickyNote size={16} className="text-amber-400" />
                  <h3 className="font-mono text-sm text-white/60 uppercase tracking-wider">
                    Speaker Notes
                  </h3>
                </div>
                <p className="text-white/80 leading-relaxed text-sm">
                  {SLIDES[current].notes}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-white/10 bg-zinc-900/80 backdrop-blur px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            disabled={current === 0}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="font-mono text-sm text-white/60">
            {current + 1} / {SLIDES.length}
          </span>
          <button
            onClick={next}
            disabled={current === SLIDES.length - 1}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-20 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div
            className={`flex items-center gap-2 font-mono text-sm ${timerColor}`}
          >
            <Clock size={14} />
            <span>Slide: {formatTime(slideTime)}</span>
            <span className="text-white/20">|</span>
            <span>Total: {formatTime(totalTime)}</span>
          </div>

          <button
            onClick={() => setShowNotes((p) => !p)}
            className={`p-1.5 rounded-lg transition-colors ${showNotes ? "bg-white/10" : "hover:bg-white/10"}`}
          >
            <StickyNote size={16} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
