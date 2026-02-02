import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ChevronDown, Code2, MousePointer2, Zap, Smartphone, Layers } from "lucide-react";

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
    subtitle: "\"When the page stops, the mind focuses.\"",
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
        <code className="text-pink-400">.container</code>{" {"}{"\n"}
        {"  "}overflow-y: <span className="text-yellow-300">scroll</span>;{"\n"}
        {"  "}scroll-snap-type: <span className="text-blue-300">y mandatory</span>;{"\n"}
        {"}"}{"\n\n"}
        <code className="text-pink-400">.section</code>{" {"}{"\n"}
        {"  "}height: <span className="text-yellow-300">100vh</span>;{"\n"}
        {"  "}scroll-snap-align: <span className="text-blue-300">start</span>;{"\n"}
        {"}"}
      </pre>
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
    restDelta: 0.001
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
