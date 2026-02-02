import { useState, useEffect, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lightbulb, FileText, Fingerprint } from "lucide-react";

// Types
type BaseSlide = {
  id: string;
};

type TitleSlide = BaseSlide & {
  type: "title";
  content: {
    headline: string;
    subheading: string;
    stamp: string;
  };
};

type NarrativeSlide = BaseSlide & {
  type: "narrative";
  content: {
    headline: string;
    body: string[];
    icon: ReactNode;
  };
};

type ListSlide = BaseSlide & {
  type: "list";
  content: {
    headline: string;
    items: string[];
    icon: ReactNode;
  };
};

type DialogueSlide = BaseSlide & {
  type: "dialogue";
  content: {
    headline: string;
    dialogue: { speaker: "detective" | "suspect"; text: string }[];
    icon: ReactNode;
  };
};

type StampSlide = BaseSlide & {
  type: "stamp";
  content: {
    stamp: string;
    body: string;
    footer: string;
    icon: ReactNode;
  };
};

type EndSlide = BaseSlide & {
  type: "end";
  content: {
    headline: string;
    subheading: string;
  };
};

type Slide = TitleSlide | NarrativeSlide | ListSlide | DialogueSlide | StampSlide | EndSlide;

// Slide Data
const SLIDES: Slide[] = [
  {
    id: "hook",
    type: "title",
    content: {
      headline: "CASE FILE: #404",
      subheading: "The Missing Pixel",
      stamp: "FEB 02 2026",
    },
  },
  {
    id: "scene",
    type: "narrative",
    content: {
      headline: "THE SCENE",
      body: [
        "It was a dark and stormy viewport.",
        "The layout was responsive. Too responsive.",
        "Then I saw it.",
        "A 1px gap between the header and the hero.",
        "Glaring. Mocking me.",
      ],
      icon: <Search size={64} />,
    },
  },
  {
    id: "suspects",
    type: "list",
    content: {
      headline: "THE USUAL SUSPECTS",
      items: [
        "1. Sub-pixel rendering",
        "2. Browser zoom levels",
        "3. Line-height shenaniganery",
        "4. That one unclosed <div> from 2019",
      ],
      icon: <Fingerprint size={64} />,
    },
  },
  {
    id: "interrogation",
    type: "dialogue",
    content: {
      headline: "INTERROGATION",
      dialogue: [
        { speaker: "detective", text: "Where were you on render?" },
        { speaker: "suspect", text: "I was display: block, I swear!" },
        { speaker: "detective", text: "Don't lie to me. Computed styles never lie." },
      ],
      icon: <Lightbulb size={64} />,
    },
  },
  {
    id: "verdict",
    type: "stamp",
    content: {
      stamp: "SOLVED",
      body: "It was `vertical-align: bottom` all along.\nThe case is closed.",
      footer: "Another layout saved.",
      icon: <FileText size={64} />,
    },
  },
  {
    id: "end",
    type: "end",
    content: {
      headline: "THE END",
      subheading: "Press 'R' to Reopen the Case",
    },
  },
];

export function TypewriterNarrative() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Navigation
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, SLIDES.length - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setCurrentSlide(0);
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key.toLowerCase() === "r") reset();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, reset]);

  return (
    <div className="relative w-full h-screen bg-[#f4e4bc] text-[#1a1a1a] overflow-hidden font-mono selection:bg-red-900 selection:text-white">
      {/* Paper Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />
      
      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />

      {/* Slide Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center p-8 md:p-16"
        >
          <SlideContent data={SLIDES[currentSlide]} />
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator (Typewriter scale) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 w-2 rounded-full border border-[#1a1a1a] transition-all duration-300 ${
              idx === currentSlide ? "bg-[#d00] scale-125" : "bg-transparent"
            }`}
          />
        ))}
      </div>

      {/* Navigation Areas */}
      <div className="absolute inset-y-0 left-0 w-1/4 cursor-w-resize z-10" onClick={prevSlide} />
      <div className="absolute inset-y-0 right-0 w-1/4 cursor-e-resize z-10" onClick={nextSlide} />
    </div>
  );
}

// Sub-component for individual slide rendering
function SlideContent({ data }: { data: Slide }) {
  const typewriterVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const TypewriterText = ({ text, className = "" }: { text: string; className?: string }) => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={typewriterVariants}>
          {char}
        </motion.span>
      ))}
    </motion.div>
  );

  switch (data.type) {
    case "title":
      return (
        <div className="text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 2, rotate: 15 }}
            animate={{ opacity: 1, scale: 1, rotate: -15 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
            className="absolute -top-16 -right-12 md:-right-24 border-4 border-[#d00] text-[#d00] p-2 md:p-4 text-xl md:text-2xl font-bold uppercase opacity-80"
            style={{ fontFamily: "serif" }}
          >
            {data.content.stamp}
          </motion.div>
          <TypewriterText
            text={data.content.headline}
            className="text-5xl md:text-8xl font-bold mb-4 tracking-tighter"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-2xl md:text-4xl italic opacity-75"
          >
            {data.content.subheading}
          </motion.div>
        </div>
      );

    case "narrative":
      return (
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold border-b-2 border-black inline-block mb-8">
              {data.content.headline}
            </h2>
            <div className="space-y-4 text-xl md:text-2xl leading-relaxed">
              {data.content.body.map((line, i) => (
                <TypewriterText key={i} text={line} />
              ))}
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.8, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="hidden md:flex justify-center text-[#d00] animate-pulse"
          >
            {data.content.icon}
          </motion.div>
        </div>
      );

    case "list":
      return (
        <div className="max-w-3xl w-full text-center">
          <h2 className="text-4xl font-bold mb-12">{data.content.headline}</h2>
          <motion.div className="space-y-6 text-2xl text-left inline-block">
            {data.content.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.8 }}
                className="flex items-center gap-4"
              >
                <div className="w-full bg-[#1a1a1a] text-[#f4e4bc] p-2">
                  {item}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      );

    case "dialogue":
      return (
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-bold mb-12 text-center border-b border-black pb-4">
            {data.content.headline}
          </h2>
          <div className="space-y-8">
            {data.content.dialogue.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: line.speaker === "detective" ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 1 }}
                className={`flex ${
                  line.speaker === "detective" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[80%] p-6 ${
                    line.speaker === "detective"
                      ? "bg-black text-[#f4e4bc]"
                      : "bg-white border-2 border-black text-black italic shadow-[4px_4px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <p className="text-xl md:text-2xl">{line.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case "stamp":
      return (
        <div className="text-center relative">
           <motion.div
            initial={{ opacity: 0, scale: 3, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 5 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 15 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[8px] border-[#d00] text-[#d00] px-12 py-4 text-6xl md:text-9xl font-bold uppercase opacity-90 z-10 mix-blend-multiply"
            style={{ fontFamily: "serif" }}
          >
            {data.content.stamp}
          </motion.div>
          <div className="blur-[2px] opacity-50">
             <div className="text-2xl md:text-4xl mb-8 whitespace-pre-wrap">{data.content.body}</div>
             <div className="text-sm font-bold uppercase tracking-widest">{data.content.footer}</div>
          </div>
        </div>
      );

    case "end":
      return (
        <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="text-6xl md:text-9xl font-bold mb-8"
          >
            {data.content.headline}
          </motion.h1>
           <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2, duration: 1 }}
            className="text-xl font-mono animate-pulse"
          >
            {data.content.subheading}
          </motion.p>
        </div>
      );

    default:
      return null;
  }
}
