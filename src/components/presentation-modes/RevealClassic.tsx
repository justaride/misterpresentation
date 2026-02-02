import { useState, useEffect, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Grid, X } from "lucide-react";

interface SlideData {
  id: string;
  title: string;
  headline: string;
  subheading?: string;
  body?: string[] | ReactNode;
  footer?: string;
  bg: string;
  textColor: string;
  verticalSlides?: Omit<SlideData, "verticalSlides">[];
}

const REVEAL_SLIDES: SlideData[] = [
  {
    id: "title",
    title: "Title",
    headline: "Q3 Strategic Performance Review",
    subheading: "Synergy, Optimization, and Paradigm Shifts",
    footer: "J. P. Buzzword, Senior VP of Cloud Synergy",
    bg: "bg-[#F7FAFC]",
    textColor: "text-[#1A365D]",
  },
  {
    id: "mission",
    title: "Mission",
    headline: "Our Core Competencies",
    body: [
      "Leveraging actionable analytics",
      "Driving ecosystemic growth",
      "Incentivizing proactive disruption",
    ],
    bg: "bg-[#F7FAFC]",
    textColor: "text-[#1A365D]",
    verticalSlides: [
      {
        id: "numbers",
        title: "Numbers",
        headline: "Up and To The Right",
        subheading: "Our synergistic growth trajectory is unassailable.",
        body: (
          <div className="mt-8 flex items-end gap-2 h-48 w-full max-w-md mx-auto">
            {[20, 45, 30, 60, 85, 70, 95].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1 + 0.5, duration: 1 }}
                className="flex-1 bg-blue-600 rounded-t-sm"
              />
            ))}
          </div>
        ),
        bg: "bg-white",
        textColor: "text-[#1A365D]",
      },
    ],
  },
  {
    id: "pivot",
    title: "The Pivot",
    headline: "THE PIVOT",
    subheading: "Why we are now a Coffee-as-a-Service Company",
    bg: "bg-[#4B3832]",
    textColor: "text-white",
  },
  {
    id: "global",
    title: "Global Reach",
    headline: "Global Footprint",
    body: [
      "London: Strategic Tea Supply",
      "Tokyo: Advanced Matcha R&D",
      "New York: Espresso Optimization",
    ],
    bg: "bg-[#2D3748]",
    textColor: "text-white",
  },
  {
    id: "questions",
    title: "Questions",
    headline: "Next Steps",
    subheading: "Please submit all inquiries via the Synergy Portal™.",
    footer: "Let's touch base offline.",
    bg: "bg-[#1A365D]",
    textColor: "text-white",
  },
];

export function RevealClassic() {
  const [hIndex, setHIndex] = useState(0);
  const [vIndex, setVIndex] = useState(0);
  const [isOverview, setIsOverview] = useState(false);

  const currentHSlide = REVEAL_SLIDES[hIndex];
  const totalH = REVEAL_SLIDES.length;
  const totalV = currentHSlide.verticalSlides?.length || 0;

  const navigateH = useCallback((dir: number) => {
    setHIndex((prev) => {
      const next = Math.max(0, Math.min(prev + dir, totalH - 1));
      if (next !== prev) setVIndex(0);
      return next;
    });
  }, [totalH]);

  const navigateV = useCallback((dir: number) => {
    setVIndex((prev) => Math.max(0, Math.min(prev + dir, totalV)));
  }, [totalV]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOverview) {
        if (e.key === "Escape") setIsOverview(false);
        return;
      }
      switch (e.key) {
        case "ArrowRight": navigateH(1); break;
        case "ArrowLeft": navigateH(-1); break;
        case "ArrowDown": navigateV(1); break;
        case "ArrowUp": navigateV(-1); break;
        case "o": setIsOverview(true); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateH, navigateV, isOverview]);

  const goToSlide = (h: number, v: number) => {
    setHIndex(h);
    setVIndex(v);
    setIsOverview(false);
  };

  return (
    <div className="relative w-full h-screen bg-[#111] overflow-hidden font-sans">
      {/* Overview Grid */}
      <AnimatePresence>
        {isOverview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/90 p-12 overflow-y-auto"
          >
            <button 
              onClick={() => setIsOverview(false)}
              className="fixed top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full"
            >
              <X size={32} />
            </button>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {REVEAL_SLIDES.map((s, hi) => (
                <div key={s.id} className="space-y-4">
                  <div 
                    onClick={() => goToSlide(hi, 0)}
                    className={`aspect-video ${s.bg} rounded border-2 transition-all cursor-pointer hover:scale-105 ${hi === hIndex && vIndex === 0 ? "border-blue-500 ring-4 ring-blue-500/50" : "border-transparent"}`}
                  >
                    <div className={`p-4 text-[10px] ${s.textColor} font-bold truncate`}>{s.headline}</div>
                  </div>
                  {s.verticalSlides?.map((vs, vi) => (
                    <div 
                      key={vs.id}
                      onClick={() => goToSlide(hi, vi + 1)}
                      className={`aspect-video ${vs.bg} rounded border-2 transition-all cursor-pointer hover:scale-105 ml-8 ${hi === hIndex && vIndex === vi + 1 ? "border-blue-500 ring-4 ring-blue-500/50" : "border-transparent"}`}
                    >
                       <div className={`p-4 text-[10px] ${vs.textColor} font-bold truncate`}>{vs.headline}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Slide Deck */}
      <div className="h-full w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${hIndex}-${vIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`absolute inset-0 flex flex-col items-center justify-center p-12 text-center ${
              vIndex === 0 ? currentHSlide.bg : currentHSlide.verticalSlides![vIndex - 1].bg
            } ${
              vIndex === 0 ? currentHSlide.textColor : currentHSlide.verticalSlides![vIndex - 1].textColor
            }`}
          >
            <SlideContent 
              data={vIndex === 0 ? currentHSlide : currentHSlide.verticalSlides![vIndex - 1]} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 z-50">
        <div className="flex flex-col items-center">
          <button 
            onClick={() => navigateV(-1)} 
            disabled={vIndex === 0}
            className={`p-2 transition-opacity ${vIndex === 0 ? "opacity-10" : "opacity-50 hover:opacity-100"}`}
          >
            <ChevronUp size={48} />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateH(-1)} 
              disabled={hIndex === 0}
              className={`p-2 transition-opacity ${hIndex === 0 ? "opacity-10" : "opacity-50 hover:opacity-100"}`}
            >
              <ChevronLeft size={48} />
            </button>
            <button 
              onClick={() => setIsOverview(true)}
              className="p-2 opacity-30 hover:opacity-100 transition-opacity"
            >
              <Grid size={24} />
            </button>
            <button 
              onClick={() => navigateH(1)} 
              disabled={hIndex === totalH - 1}
              className={`p-2 transition-opacity ${hIndex === totalH - 1 ? "opacity-10" : "opacity-50 hover:opacity-100"}`}
            >
              <ChevronRight size={48} />
            </button>
          </div>
          <button 
            onClick={() => navigateV(1)} 
            disabled={vIndex === totalV}
            className={`p-2 transition-opacity ${vIndex === totalV ? "opacity-10" : "opacity-50 hover:opacity-100"}`}
          >
            <ChevronDown size={48} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
        <motion.div 
          className="h-full bg-blue-500"
          initial={false}
          animate={{ width: `${((hIndex + 1) / totalH) * 100}%` }}
        />
      </div>
    </div>
  );
}

function SlideContent({ data }: { data: any }) {
  return (
    <div className="max-w-5xl w-full">
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-6xl md:text-8xl font-bold mb-8 tracking-tight"
      >
        {data.headline}
      </motion.h1>

      {data.subheading && (
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-light opacity-80 mb-12"
        >
          {data.subheading}
        </motion.p>
      )}

      {data.body && (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-left inline-block"
        >
          {Array.isArray(data.body) ? (
            <ul className="space-y-4">
              {data.body.map((item: string, i: number) => (
                <li key={i} className="flex items-center gap-4 text-2xl">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            data.body
          )}
        </motion.div>
      )}

      {data.footer && (
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="absolute bottom-12 right-12 text-sm italic"
        >
          {data.footer}
        </motion.footer>
      )}
    </div>
  );
}
