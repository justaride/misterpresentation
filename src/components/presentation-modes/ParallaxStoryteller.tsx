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
    description:
      "Where sunlight struggles to reach. Photosynthesis stops here.",
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
    depth: 500,
    title: "The Mesopelagic",
    description:
      "Faint blue light filters through. Giant squid hunt in silence.",
    color: "#001F3F",
    align: "right",
  },
  {
    depth: 2000,
    title: "The Bathyal Zone",
    description:
      "Bioluminescence replaces sunlight. Every flash is a conversation.",
    color: "#001028",
    align: "left",
  },
  {
    depth: 4000,
    title: "The Abyss",
    description:
      "Crushing pressure. Near freezing temperatures. Yet, life finds a way.",
    color: "#000000",
    align: "right",
  },
  {
    depth: 6000,
    title: "The Hadal Zone",
    description:
      "Named after Hades. Only the most extreme organisms survive here.",
    color: "#000000",
    align: "center",
  },
  {
    depth: 10000,
    title: "Challenger Deep",
    description: "We have touched the bottom.",
    color: "#000000",
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
    [0, 0.12, 0.25, 0.37, 0.5, 0.62, 0.75, 1],
    [
      "#00A8E8",
      "#003459",
      "#00171F",
      "#001F3F",
      "#001028",
      "#000000",
      "#000000",
      "#000000",
    ],
  );

  return (
    <div className="relative w-full h-screen overflow-hidden font-serif">
      {/* Scrollable Container */}
      <motion.div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto"
        style={{ backgroundColor: bg }}
      >
        <div className="relative min-h-[800vh]">
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
              data.depth === 1000
                ? "text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                : ""
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

  const whaleX = useTransform(progress, [0.2, 0.5], ["-100vw", "100vw"]);
  const subY = useTransform(progress, [0.5, 0.75], ["120%", "-20%"]);
  const anglerX = useTransform(progress, [0.7, 0.95], ["100vw", "-100vw"]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Bubbles Layer */}
      <motion.div
        style={{ y: bubblesY }}
        className="absolute top-0 left-0 w-full h-screen"
      >
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
        <svg
          viewBox="0 0 100 50"
          fill="currentColor"
          className="text-black w-full h-full"
        >
          <path d="M10,25 Q30,5 60,25 T100,25 L90,35 Q60,55 30,35 Z" />
        </svg>
      </motion.div>

      {/* Jellyfish Layer */}
      <motion.div
        style={{ y: jellyY, top: "45%", left: "50%" }}
        className="absolute w-32 h-48 opacity-60"
      >
        <svg
          viewBox="0 0 100 150"
          fill="none"
          className="text-green-400 w-full h-full drop-shadow-[0_0_15px_rgba(74,222,128,0.6)]"
        >
          <path
            d="M10,40 Q50,-20 90,40"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M15,40 L15,120 M35,35 L35,130 M65,35 L65,130 M85,40 L85,120"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="5 5"
          />
        </svg>
      </motion.div>

      {/* Whale Layer */}
      <motion.div
        style={{ x: whaleX, top: "35%" }}
        className="absolute w-80 h-32 opacity-15"
      >
        <svg
          viewBox="0 0 200 80"
          fill="currentColor"
          className="text-blue-200 w-full h-full"
        >
          <ellipse cx="80" cy="40" rx="70" ry="30" />
          <path d="M150,40 Q180,20 200,5 L200,75 Q180,60 150,40" />
          <circle cx="30" cy="35" r="3" fill="#001028" />
        </svg>
      </motion.div>

      {/* Submarine Layer */}
      <motion.div
        style={{ y: subY, left: "20%" }}
        className="absolute w-48 h-24 opacity-30"
      >
        <svg
          viewBox="0 0 120 60"
          fill="none"
          className="text-yellow-400 w-full h-full drop-shadow-[0_0_10px_rgba(250,204,21,0.4)]"
        >
          <ellipse
            cx="60"
            cy="35"
            rx="50"
            ry="18"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="45"
            y="15"
            width="30"
            height="12"
            rx="6"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="60"
            cy="21"
            r="4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle cx="40" cy="35" r="2" fill="currentColor" />
          <circle cx="60" cy="35" r="2" fill="currentColor" />
          <circle cx="80" cy="35" r="2" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Anglerfish Layer */}
      <motion.div
        style={{ x: anglerX, top: "75%" }}
        className="absolute w-40 h-32 opacity-40"
      >
        <svg
          viewBox="0 0 100 80"
          fill="none"
          className="text-green-400 w-full h-full drop-shadow-[0_0_12px_rgba(74,222,128,0.5)]"
        >
          <ellipse
            cx="55"
            cy="50"
            rx="35"
            ry="22"
            fill="currentColor"
            fillOpacity="0.3"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="40" cy="45" r="4" fill="currentColor" />
          <path
            d="M35,55 L25,60 M35,58 L28,65 M40,60 L35,68"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path d="M55,28 Q50,5 45,8" stroke="currentColor" strokeWidth="1.5" />
          <circle
            cx="45"
            cy="8"
            r="4"
            fill="currentColor"
            className="animate-pulse"
          />
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
