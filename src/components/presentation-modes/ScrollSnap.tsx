import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ChevronDown,
  Code2,
  MousePointer2,
  Zap,
  Smartphone,
  Layers,
  Accessibility,
  Palette,
  Gauge,
  MonitorSmartphone,
} from "lucide-react";

const SECTIONS = [
  {
    id: "intro",
    title: "Vertical.",
    subtitle: "The native gesture of the web.",
    bg: "bg-black",
    text: "text-white",
    icon: <ChevronDown size={64} className="animate-bounce opacity-50" />,
  },
  {
    id: "friction",
    title: "Friction vs. Flow",
    subtitle: "Standard scrolling is infinite. Snap gives it weight.",
    bg: "bg-zinc-900",
    text: "text-white",
    icon: <MousePointer2 size={64} className="text-blue-500" />,
    content: (
      <div className="flex gap-8 mt-8 opacity-80">
        <div className="w-32 h-32 border-2 border-white/20 rounded-xl flex items-center justify-center">
          <span className="text-xs font-mono">Infinite</span>
        </div>
        <div className="w-32 h-32 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.5)]">
          <span className="text-xs font-mono font-bold">Snap</span>
        </div>
      </div>
    ),
  },
  {
    id: "attention",
    title: "The Physics of Attention",
    subtitle: '"When the page stops, the mind focuses."',
    bg: "bg-black",
    text: "text-white",
    icon: <Zap size={64} className="text-yellow-400" />,
  },
  {
    id: "control",
    title: "You are in control.",
    subtitle: "Unlike video, you set the pace.",
    bg: "bg-zinc-900",
    text: "text-white",
    icon: <Smartphone size={64} className="text-purple-500" />,
  },
  {
    id: "code",
    title: "Just CSS.",
    subtitle: "Two properties. Infinite power.",
    bg: "bg-[#1e1e1e]",
    text: "text-green-400",
    icon: <Code2 size={64} />,
    content: (
      <pre className="mt-8 p-6 bg-black/50 rounded-xl border border-white/10 font-mono text-sm md:text-base text-left">
        <code className="text-pink-400">.container</code>
        {" {"}
        {"\n"}
        {"  "}overflow-y: <span className="text-yellow-300">scroll</span>;{"\n"}
        {"  "}scroll-snap-type:{" "}
        <span className="text-blue-300">y mandatory</span>;{"\n"}
        {"}"}
        {"\n\n"}
        <code className="text-pink-400">.section</code>
        {" {"}
        {"\n"}
        {"  "}height: <span className="text-yellow-300">100vh</span>;{"\n"}
        {"  "}scroll-snap-align: <span className="text-blue-300">start</span>;
        {"\n"}
        {"}"}
      </pre>
    ),
  },
  {
    id: "mobile",
    title: "Mobile-First.",
    subtitle: "Snap was born for thumbs, not mice.",
    bg: "bg-zinc-950",
    text: "text-white",
    icon: <MonitorSmartphone size={64} className="text-emerald-400" />,
    content: (
      <div className="mt-8 flex items-center justify-center gap-6">
        <div className="w-20 h-36 border-2 border-emerald-400/40 rounded-2xl flex items-center justify-center">
          <span className="text-xs font-mono text-emerald-400">375px</span>
        </div>
        <div className="w-40 h-28 border-2 border-white/20 rounded-xl flex items-center justify-center">
          <span className="text-xs font-mono opacity-50">1440px</span>
        </div>
      </div>
    ),
  },
  {
    id: "a11y",
    title: "Accessible by Default.",
    subtitle: "Keyboard navigation. Reduced motion. Focus rings.",
    bg: "bg-black",
    text: "text-white",
    icon: <Accessibility size={64} className="text-amber-400" />,
    content: (
      <div className="mt-8 flex gap-4 text-sm font-mono">
        <kbd className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/20">
          Tab
        </kbd>
        <kbd className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/20">
          Space
        </kbd>
        <kbd className="px-3 py-1.5 bg-white/10 rounded-lg border border-white/20">
          ↑ ↓
        </kbd>
      </div>
    ),
  },
  {
    id: "palette",
    title: "Color with Intent.",
    subtitle: "Each section earns its own palette.",
    bg: "bg-zinc-900",
    text: "text-white",
    icon: <Palette size={64} className="text-pink-400" />,
    content: (
      <div className="mt-8 grid grid-cols-4 gap-3 max-w-xs">
        {[
          "bg-blue-600",
          "bg-purple-600",
          "bg-emerald-600",
          "bg-amber-500",
          "bg-rose-600",
          "bg-cyan-500",
          "bg-indigo-600",
          "bg-lime-500",
        ].map((c, i) => (
          <div key={i} className={`w-12 h-12 ${c} rounded-xl shadow-lg`} />
        ))}
      </div>
    ),
  },
  {
    id: "performance",
    title: "60fps or Bust.",
    subtitle: "GPU-accelerated scroll. Zero jank.",
    bg: "bg-black",
    text: "text-white",
    icon: <Gauge size={64} className="text-red-500" />,
    content: (
      <div className="mt-8 flex items-center gap-4">
        <div className="px-4 py-2 bg-green-500/20 border border-green-500/40 rounded-full text-green-400 font-mono text-sm font-bold">
          60 FPS
        </div>
        <span className="text-white/40">|</span>
        <span className="text-sm text-white/50 font-mono">
          0ms layout shift
        </span>
      </div>
    ),
  },
  {
    id: "outro",
    title: "The Future is Vertical.",
    subtitle: "Start snapping.",
    bg: "bg-gradient-to-b from-black to-blue-950",
    text: "text-white",
    icon: <Layers size={64} className="text-blue-500" />,
  },
];

export function ScrollSnapPresentation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Snap Container */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {SECTIONS.map((section, index) => (
          <section
            key={section.id}
            className={`h-full w-full snap-start flex flex-col items-center justify-center p-8 text-center relative ${section.bg} ${section.text}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.5 }}
              className="max-w-4xl flex flex-col items-center gap-6"
            >
              <div className="mb-4">{section.icon}</div>

              <h2 className="text-5xl md:text-7xl font-black tracking-tighter">
                {section.title}
              </h2>

              <p className="text-xl md:text-3xl font-light opacity-80 max-w-2xl">
                {section.subtitle}
              </p>

              {section.content}
            </motion.div>

            {/* Hint for next slide */}
            {index < SECTIONS.length - 1 && (
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 opacity-30"
              >
                <ChevronDown size={32} />
              </motion.div>
            )}

            {/* Slide Number */}
            <div className="absolute bottom-8 right-8 font-mono text-sm opacity-20">
              {index + 1} / {SECTIONS.length}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
