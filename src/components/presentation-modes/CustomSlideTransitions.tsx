import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TransitionType = "fade" | "slide" | "zoom" | "flip" | "morph" | "wipe";

type SlideData = {
  id: string;
  title: string;
  subtitle: string;
  bg: string;
  accent: string;
  transition: TransitionType;
};

const SLIDES: SlideData[] = [
  {
    id: "intro",
    title: "Custom Transitions",
    subtitle: "Every slide deserves its own entrance",
    bg: "from-zinc-900 to-black",
    accent: "text-blue-400",
    transition: "fade",
  },
  {
    id: "slide-left",
    title: "Slide & Push",
    subtitle: "Classic directional movement with spring physics",
    bg: "from-blue-950 to-zinc-950",
    accent: "text-blue-300",
    transition: "slide",
  },
  {
    id: "zoom-in",
    title: "Zoom Through",
    subtitle: "Dive deeper into each concept",
    bg: "from-purple-950 to-zinc-950",
    accent: "text-purple-300",
    transition: "zoom",
  },
  {
    id: "flip-card",
    title: "3D Flip",
    subtitle: "Perspective transforms for dramatic reveals",
    bg: "from-emerald-950 to-zinc-950",
    accent: "text-emerald-300",
    transition: "flip",
  },
  {
    id: "morph-shape",
    title: "Morph & Flow",
    subtitle: "Organic shape transitions between states",
    bg: "from-amber-950 to-zinc-950",
    accent: "text-amber-300",
    transition: "morph",
  },
  {
    id: "wipe-reveal",
    title: "Wipe Reveal",
    subtitle: "Theatrical curtain-style reveals",
    bg: "from-rose-950 to-zinc-950",
    accent: "text-rose-300",
    transition: "wipe",
  },
];

const TRANSITION_VARIANTS: Record<
  TransitionType,
  {
    initial: Record<string, number | string>;
    animate: Record<string, number | string>;
    exit: Record<string, number | string>;
  }
> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  zoom: {
    initial: { scale: 0.3, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 2, opacity: 0 },
  },
  flip: {
    initial: { rotateY: 90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: -90, opacity: 0 },
  },
  morph: {
    initial: { borderRadius: "50%", scale: 0, opacity: 0 },
    animate: { borderRadius: "0%", scale: 1, opacity: 1 },
    exit: { borderRadius: "50%", scale: 0, opacity: 0 },
  },
  wipe: {
    initial: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    animate: { clipPath: "inset(0 0% 0 0)", opacity: 1 },
    exit: { clipPath: "inset(0 0 0 100%)", opacity: 0 },
  },
};

export function CustomSlideTransitions() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  const next = useCallback(() => {
    if (current < SLIDES.length - 1) {
      setDirection(1);
      setCurrent((p) => p + 1);
    }
  }, [current]);

  const prev = useCallback(() => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((p) => p - 1);
    }
  }, [current]);

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
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const slide = SLIDES[current];
  const variants = TRANSITION_VARIANTS[slide.transition];

  return (
    <div
      className="w-full h-screen bg-black text-white overflow-hidden relative"
      style={{ perspective: 1200 }}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slide.id}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg} flex flex-col items-center justify-center p-8`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center max-w-3xl"
          >
            <div
              className={`font-mono text-sm ${slide.accent} uppercase tracking-[0.3em] mb-6`}
            >
              transition: {slide.transition}
            </div>
            <h2 className="text-5xl md:text-8xl font-black tracking-tight mb-6">
              {slide.title}
            </h2>
            <p className="text-xl md:text-2xl text-white/60">
              {slide.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2"
          >
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xs text-white/40">
              {slide.transition === "fade" && "opacity: 0 → 1"}
              {slide.transition === "slide" && "translateX: 100% → 0"}
              {slide.transition === "zoom" && "scale: 0.3 → 1 → 2"}
              {slide.transition === "flip" && "rotateY: 90° → 0° → -90°"}
              {slide.transition === "morph" && "borderRadius: 50% → 0%"}
              {slide.transition === "wipe" &&
                "clipPath: inset(0 100% 0 0) → inset(0)"}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-8 h-1.5 rounded-full transition-all ${
              i === current ? "bg-white" : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-xs text-white/20 z-20">
        {current + 1} / {SLIDES.length}
      </div>

      <div
        className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize z-10"
        onClick={prev}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize z-10"
        onClick={next}
      />
    </div>
  );
}
