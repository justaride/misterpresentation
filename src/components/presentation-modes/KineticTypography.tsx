import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Slide = {
  id: string;
  text: string;
  style: "explode" | "wave" | "cascade" | "spiral" | "glitch" | "bounce";
  color: string;
  bg: string;
};

const SLIDES: Slide[] = [
  {
    id: "intro",
    text: "KINETIC",
    style: "explode",
    color: "text-white",
    bg: "bg-black",
  },
  {
    id: "wave",
    text: "TYPOGRAPHY",
    style: "wave",
    color: "text-blue-400",
    bg: "bg-zinc-950",
  },
  {
    id: "cascade",
    text: "IS MOTION",
    style: "cascade",
    color: "text-emerald-400",
    bg: "bg-black",
  },
  {
    id: "spiral",
    text: "MEETS TYPE",
    style: "spiral",
    color: "text-purple-400",
    bg: "bg-zinc-950",
  },
  {
    id: "glitch",
    text: "BREAKING",
    style: "glitch",
    color: "text-red-500",
    bg: "bg-black",
  },
  {
    id: "bounce",
    text: "BOUNDARIES",
    style: "bounce",
    color: "text-amber-400",
    bg: "bg-zinc-950",
  },
];

function ExplodeText({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex justify-center flex-wrap">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{
            opacity: 0,
            scale: 3,
            rotate: Math.random() * 360,
            x: (Math.random() - 0.5) * 500,
            y: (Math.random() - 0.5) * 500,
          }}
          animate={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
          transition={{
            delay: i * 0.08,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className={`text-7xl md:text-9xl font-black ${color} inline-block`}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

function WaveText({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex justify-center">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          animate={{ y: [0, -40, 0] }}
          transition={{
            delay: i * 0.1,
            duration: 1,
            repeat: Infinity,
            repeatDelay: text.length * 0.1,
          }}
          className={`text-7xl md:text-9xl font-black ${color} inline-block`}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

function CascadeText({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex justify-center flex-wrap">
      {text.split(" ").map((word, wi) => (
        <motion.span
          key={wi}
          initial={{ opacity: 0, y: -200, rotateX: 90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: wi * 0.3,
            type: "spring",
            stiffness: 150,
            damping: 12,
          }}
          className={`text-7xl md:text-9xl font-black ${color} inline-block mx-4`}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

function SpiralText({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex justify-center flex-wrap">
      {text.split("").map((char, i) => {
        const angle = i * 30;
        const radius = 150;
        return (
          <motion.span
            key={i}
            initial={{
              opacity: 0,
              x: Math.cos((angle * Math.PI) / 180) * radius,
              y: Math.sin((angle * Math.PI) / 180) * radius,
              rotate: angle,
            }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            transition={{
              delay: i * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            className={`text-7xl md:text-9xl font-black ${color} inline-block`}
          >
            {char}
          </motion.span>
        );
      })}
    </div>
  );
}

function GlitchText({ text, color }: { text: string; color: string }) {
  return (
    <div className="relative flex justify-center">
      <motion.span
        animate={{ x: [0, -3, 3, -1, 1, 0], opacity: [1, 0.8, 1, 0.9, 1] }}
        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
        className={`text-7xl md:text-9xl font-black ${color} absolute`}
        style={{ textShadow: "3px 0 cyan, -3px 0 red" }}
      >
        {text}
      </motion.span>
      <span className={`text-7xl md:text-9xl font-black ${color} opacity-0`}>
        {text}
      </span>
    </div>
  );
}

function BounceText({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex justify-center">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 300 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.06,
            type: "spring",
            stiffness: 400,
            damping: 10,
            mass: 0.8,
          }}
          className={`text-7xl md:text-9xl font-black ${color} inline-block`}
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

const RENDERERS: Record<
  Slide["style"],
  (props: { text: string; color: string }) => React.ReactElement
> = {
  explode: ExplodeText,
  wave: WaveText,
  cascade: CascadeText,
  spiral: SpiralText,
  glitch: GlitchText,
  bounce: BounceText,
};

export function KineticTypography() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((p) => Math.min(p + 1, SLIDES.length - 1));
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => Math.max(p - 1, 0));
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
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const slide = SLIDES[current];
  const Renderer = RENDERERS[slide.style];

  return (
    <div
      className={`w-full h-screen ${slide.bg} flex flex-col items-center justify-center overflow-hidden relative transition-colors duration-500`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-8"
        >
          <Renderer text={slide.text} color={slide.color} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1 }}
            className="font-mono text-sm text-white/40 uppercase tracking-[0.3em]"
          >
            {slide.style}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-8 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full border border-white/30 transition-all ${
              i === current ? "bg-white scale-125" : "bg-transparent"
            }`}
          />
        ))}
      </div>

      <div
        className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize z-10"
        onClick={prev}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize z-10"
        onClick={next}
      />

      <div className="absolute bottom-8 right-8 font-mono text-xs text-white/20">
        {current + 1} / {SLIDES.length}
      </div>
    </div>
  );
}
