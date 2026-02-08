import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Clock, Layers, Zap, Eye, Sparkles, ArrowDown } from "lucide-react";

type Section = {
  id: string;
  title: string;
  subtitle: string;
  body: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
};

const SECTIONS: Section[] = [
  {
    id: "intro",
    title: "Scroll-Driven Animations",
    subtitle: "The Future of Web Motion",
    body: "No JavaScript timers. No requestAnimationFrame. Just CSS binding animations directly to scroll position.",
    icon: <Clock size={48} />,
    color: "text-blue-400",
    bg: "from-blue-950/50 to-transparent",
  },
  {
    id: "scroll-timeline",
    title: "CSS scroll-timeline",
    subtitle: "animation-timeline: scroll()",
    body: "A new CSS property that lets you drive any animation based on scroll progress. Declarative. Performant. Composable.",
    icon: <Layers size={48} />,
    color: "text-purple-400",
    bg: "from-purple-950/50 to-transparent",
  },
  {
    id: "performance",
    title: "Off-Main-Thread",
    subtitle: "Compositor-driven animations",
    body: "Scroll-linked animations run on the compositor thread. Zero jank. Zero layout thrashing. Pure 60fps smoothness.",
    icon: <Zap size={48} />,
    color: "text-amber-400",
    bg: "from-amber-950/50 to-transparent",
  },
  {
    id: "view-timeline",
    title: "View Transitions API",
    subtitle: "document.startViewTransition()",
    body: "Morph between DOM states with a single API call. The browser handles cross-fade, position interpolation, and z-ordering.",
    icon: <Eye size={48} />,
    color: "text-emerald-400",
    bg: "from-emerald-950/50 to-transparent",
  },
  {
    id: "fallback",
    title: "Progressive Enhancement",
    subtitle: "Framer Motion as the fallback layer",
    body: "When CSS scroll-timeline is not supported, Framer Motion useScroll + useTransform provides the same experience via JavaScript.",
    icon: <Sparkles size={48} />,
    color: "text-rose-400",
    bg: "from-rose-950/50 to-transparent",
  },
];

function ParallaxSection({
  section,
  index,
}: {
  section: Section;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8],
  );
  const x = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [index % 2 === 0 ? -80 : 80, 0, 0, index % 2 === 0 ? 80 : -80],
  );

  return (
    <div
      ref={ref}
      className="min-h-screen flex items-center justify-center py-32 px-8 relative"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-b ${section.bg} pointer-events-none`}
      />

      <motion.div
        style={{ y, opacity, scale, x }}
        className="max-w-4xl w-full relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={index % 2 === 0 ? "order-1" : "order-1 md:order-2"}>
            <div className={`${section.color} mb-6`}>{section.icon}</div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              {section.title}
            </h2>
            <p className={`font-mono text-sm ${section.color} mb-6`}>
              {section.subtitle}
            </p>
            <p className="text-lg text-white/60 leading-relaxed">
              {section.body}
            </p>
          </div>

          <div
            className={`${index % 2 === 0 ? "order-2" : "order-2 md:order-1"} flex justify-center`}
          >
            <motion.div
              style={{
                rotate: useTransform(
                  scrollYProgress,
                  [0, 1],
                  [0, index % 2 === 0 ? 10 : -10],
                ),
              }}
              className={`w-64 h-64 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center ${section.color}`}
            >
              <div className="text-center">
                <div className="mb-4 flex justify-center">{section.icon}</div>
                <pre className="font-mono text-xs text-white/40 text-left">
                  {section.id === "scroll-timeline" &&
                    `animation-timeline:\n  scroll();`}
                  {section.id === "view-timeline" &&
                    `document\n  .startViewTransition(\n    callback\n  );`}
                  {section.id === "performance" &&
                    `will-change:\n  transform;\ncontain:\n  layout;`}
                  {section.id === "fallback" &&
                    `useScroll({\n  target: ref,\n  offset: [...]\n});`}
                  {section.id === "intro" &&
                    `@keyframes fade {\n  from { opacity: 0 }\n  to { opacity: 1 }\n}`}
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ScrollTimelineShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-scroll bg-zinc-950 text-white"
    >
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center text-center p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
            Scroll
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Timeline
            </span>
          </h1>
          <p className="text-xl text-white/50 max-w-xl mx-auto mb-12">
            Animation driven by scroll position — using Framer Motion as a
            progressive enhancement fallback for CSS scroll-timeline.
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/30"
          >
            <ArrowDown size={32} />
          </motion.div>
        </motion.div>
      </div>

      {SECTIONS.map((section, i) => (
        <ParallaxSection key={section.id} section={section} index={i} />
      ))}

      <div className="min-h-[50vh] flex items-center justify-center text-center p-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            The Scroll is the Timeline.
          </h2>
          <p className="text-white/40 font-mono text-sm">
            Scroll back up to replay the animations.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
