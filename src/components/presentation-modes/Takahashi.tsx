import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Maximize2, Minimize2, Play, Pause } from "lucide-react";

const TAKAHASHI_SLIDES = [
  "TAKAHASHI",
  "METHOD",
  "BIG TEXT",
  "NO IMAGES",
  "HIGH IMPACT",
  "SYNCHRONIZED",
  "WITH SPEECH",
  "RAPID FIRE",
  "SIMPLE",
  "BOLD",
  "MISTER",
  "PRESENTATIONS",
];

export interface TakahashiPresentationProps {
  slides?: string[];
}

export function TakahashiPresentation({ slides = TAKAHASHI_SLIDES }: TakahashiPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 1500); // Fast pace for Takahashi
    }
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + slides.length) % slides.length,
    );

  return (
    <div className="relative w-full h-[600px] bg-black text-white overflow-hidden flex items-center justify-center font-black">
      {/* Controls Overlay */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full z-50 opacity-0 hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="hover:text-accent transition-colors"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <span className="font-mono text-sm opacity-50">
          {currentSlide + 1} / {slides.length}
        </span>
        <button
          onClick={toggleFullscreen}
          className="hover:text-accent transition-colors"
        >
          {isFullscreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>
      </div>

      {/* Navigation Areas */}
      <div
        className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-w-resize"
        onClick={prevSlide}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-e-resize"
        onClick={nextSlide}
      />

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.1, ease: "circOut" }}
          className="w-full text-center px-4"
        >
          <h1 className="text-[15vw] leading-none tracking-tighter uppercase select-none">
            {slides[currentSlide]}
          </h1>
        </motion.div>
      </AnimatePresence>

      {/* Scanlines / Retro Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay"></div>
    </div>
  );
}
