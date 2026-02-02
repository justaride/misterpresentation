import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowDown } from "lucide-react";

// Types
interface DepthSection {
  depth: number; // meters
  title: string;
  description: string;
  color: string;
  align: "left" | "center" | "right";
}

const SECTIONS: DepthSection[] = [
  {
    depth: 0,
    title: "THE DESCENT",
    description: "A journey to the bottom of the world.",
    color: "#00A8E8", // Surface Blue
    align: "center",
  },
  {
    depth: 200,
    title: "The Twilight Zone",
    description: "Where sunlight struggles to reach. Photosynthesis stops here.",
    color: "#003459", // Deep Blue
    align: "left",
  },
  {
    depth: 1000,
    title: "The Midnight Zone",
    description: '"The only light is the light we make."',
    color: "#00171F", // Dark Blue/Black
    align: "center",
  },
  {
    depth: 4000,
    title: "The Abyss",
    description: "Crushing pressure. Near freezing temperatures. Yet, life finds a way.",
    color: "#000000", // Void
    align: "right",
  },
  {
    depth: 10000,
    title: "Challenger Deep",
    description: "We have touched the bottom.",
    color: "#000000", // Void
    align: "center",
  },
];

export function ParallaxStoryteller() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end end"],
  });

  // Background Gradient Interpolation
  const bg = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    ["#00A8E8", "#003459", "#00171F", "#000000", "#000000"]
  );

  return (
    <div className="relative w-full h-screen overflow-hidden font-serif">
      {/* Scrollable Container */}
      <motion.div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto"
        style={{ backgroundColor: bg }}
      >
        <div className="relative min-h-[500vh]">
          {/* Depth Marker (Fixed) */}
          <DepthGauge progress={scrollYProgress} />

          {/* Parallax Elements */}
          <ParallaxElements progress={scrollYProgress} />

          {/* Content Sections */}
          {SECTIONS.map((section, index) => (
            <Section key={index} data={section} index={index} />
          ))}

          {/* Bottom Anchor */}
          <div className="h-screen flex items-end justify-center pb-24 text-white/20">
            End of Expedition
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Section({ data, index }: { data: DepthSection; index: number }) {
  // Calculate vertical position based on index (100vh per section roughly)
  // We use standard CSS positioning for the content flow
  return (
    <div className="h-screen flex items-center justify-center relative z-10 snap-center">
      <div
        className={`w-full max-w-4xl px-8 flex ${
          data.align === "left"
            ? "justify-start text-left"
            : data.align === "right"
            ? "justify-end text-right"
            : "justify-center text-center"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.5 }}
          className="max-w-xl"
        >
          <h2 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl">
            {data.title}
          </h2>
          <p
            className={`text-2xl md:text-3xl text-white/90 font-sans leading-relaxed ${
              data.depth === 1000 ? "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" : ""
            }`}
          >
            {data.description}
          </p>
          {index === 0 && (
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-12 flex justify-center opacity-50"
            >
              <ArrowDown size={48} className="text-white" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function DepthGauge({ progress }: { progress: MotionValue<number> }) {
  const depth = useTransform(progress, [0, 1], [0, 10935]);

  return (
    <div className="fixed top-1/2 right-8 -translate-y-1/2 z-50 flex flex-col items-center gap-2 mix-blend-difference">
      <div className="h-32 w-px bg-white/30" />
      <motion.div className="font-mono text-white text-xl tabular-nums">
        <DepthDisplay value={depth} />
      </motion.div>
      <div className="h-32 w-px bg-white/30" />
    </div>
  );
}

function DepthDisplay({ value }: { value: MotionValue<number> }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return value.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(v)}m`;
      }
    });
  }, [value]);

  return <span ref={ref}>0m</span>;
}

function ParallaxElements({ progress }: { progress: MotionValue<number> }) {
  // Bubbles (Surface to Twilight)
  const bubblesY = useTransform(progress, [0, 0.3], ["0%", "-100%"]);
  
  // Fish (Twilight)
  const fishX = useTransform(progress, [0.1, 0.4], ["100vw", "-100vw"]);
  
  // Jellyfish (Midnight)
  const jellyY = useTransform(progress, [0.4, 0.7], ["100%", "-50%"]);
  
  // Marine Snow (Abyss - Continuous)
  // We'll use CSS animation for the snow, but fade it in based on depth
  const snowOpacity = useTransform(progress, [0.5, 0.8], [0, 0.5]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Bubbles Layer */}
      <motion.div style={{ y: bubblesY }} className="absolute top-0 left-0 w-full h-screen">
        <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full border-2 border-white/20" />
        <div className="absolute top-1/3 left-2/3 w-12 h-12 rounded-full border-2 border-white/10" />
        <div className="absolute top-10 right-20 w-4 h-4 rounded-full border border-white/30" />
      </motion.div>

      {/* Fish Layer */}
      <motion.div 
        style={{ x: fishX, top: "25%" }} 
        className="absolute w-64 h-24 opacity-20"
      >
        {/* Simple SVG Fish Silhouette */}
        <svg viewBox="0 0 100 50" fill="currentColor" className="text-black w-full h-full">
          <path d="M10,25 Q30,5 60,25 T100,25 L90,35 Q60,55 30,35 Z" />
        </svg>
      </motion.div>

      {/* Jellyfish Layer */}
      <motion.div 
        style={{ y: jellyY, top: "45%", left: "50%" }} 
        className="absolute w-32 h-48 opacity-60"
      >
        <svg viewBox="0 0 100 150" fill="none" className="text-green-400 w-full h-full drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]">
          <path d="M10,40 Q50,-20 90,40" stroke="currentColor" strokeWidth="2" />
          <path d="M15,40 L15,120 M35,35 L35,130 M65,35 L65,130 M85,40 L85,120" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
        </svg>
      </motion.div>

      {/* Marine Snow */}
      <motion.div 
        style={{ opacity: snowOpacity }}
        className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"
      />
    </div>
  );
}
