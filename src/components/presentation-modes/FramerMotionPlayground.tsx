import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

type DemoId = "layout" | "gestures" | "springs" | "stagger" | "morphing";

const DEMOS: { id: DemoId; title: string; description: string }[] = [
  {
    id: "layout",
    title: "Layout Animations",
    description: "Shared layout transitions between states",
  },
  {
    id: "gestures",
    title: "Gesture Controls",
    description: "Drag, tap, hover — all animated",
  },
  {
    id: "springs",
    title: "Spring Physics",
    description: "Configurable spring dynamics",
  },
  {
    id: "stagger",
    title: "Stagger Effects",
    description: "Orchestrated sequential reveals",
  },
  {
    id: "morphing",
    title: "Shape Morphing",
    description: "Smooth border-radius transitions",
  },
];

function LayoutDemo() {
  const [selected, setSelected] = useState(0);
  const items = ["Design", "Develop", "Deploy", "Iterate"];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex gap-3">
        {items.map((item, i) => (
          <button
            key={item}
            onClick={() => setSelected(i)}
            className="relative px-6 py-3 text-lg font-mono rounded-xl"
          >
            {selected === i && (
              <motion.div
                layoutId="highlight"
                className="absolute inset-0 bg-blue-500 rounded-xl"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-white">{item}</span>
          </button>
        ))}
      </div>
      <motion.div
        layout
        className="bg-white/10 rounded-2xl p-8 text-center"
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <motion.h3
          key={selected}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          {items[selected]}
        </motion.h3>
        <p className="text-white/60 font-mono text-sm">
          Click the tabs above — the highlight follows with a shared layout
          animation
        </p>
      </motion.div>
    </div>
  );
}

function GestureDemo() {
  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-white/60 font-mono text-sm">
        Drag, hover, and tap the boxes
      </p>
      <div className="flex gap-6">
        <motion.div
          drag
          dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
          whileDrag={{ scale: 1.1, boxShadow: "0 0 30px rgba(59,130,246,0.5)" }}
          className="w-28 h-28 bg-blue-500 rounded-2xl flex items-center justify-center text-white font-mono text-sm cursor-grab active:cursor-grabbing"
        >
          Drag me
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="w-28 h-28 bg-purple-500 rounded-2xl flex items-center justify-center text-white font-mono text-sm cursor-pointer"
        >
          Hover / Tap
        </motion.div>
        <motion.div
          whileHover={{ borderRadius: "50%" }}
          transition={{ duration: 0.3 }}
          className="w-28 h-28 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-mono text-sm cursor-pointer"
        >
          Morph
        </motion.div>
      </div>
    </div>
  );
}

function SpringDemo() {
  const [toggled, setToggled] = useState(false);
  const configs = [
    { label: "Bouncy", stiffness: 600, damping: 10 },
    { label: "Smooth", stiffness: 100, damping: 20 },
    { label: "Stiff", stiffness: 1000, damping: 50 },
  ];

  return (
    <div className="flex flex-col items-center gap-8">
      <button
        onClick={() => setToggled((p) => !p)}
        className="px-6 py-2 bg-white/10 rounded-lg text-white font-mono text-sm hover:bg-white/20 transition-colors"
      >
        Toggle Springs
      </button>
      <div className="flex gap-8">
        {configs.map((config) => (
          <div key={config.label} className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ y: toggled ? -60 : 0, rotate: toggled ? 180 : 0 }}
              transition={{
                type: "spring",
                stiffness: config.stiffness,
                damping: config.damping,
              }}
              className="w-20 h-20 bg-amber-500 rounded-xl"
            />
            <span className="text-white/60 font-mono text-xs">
              {config.label}
            </span>
            <span className="text-white/40 font-mono text-xs">
              s:{config.stiffness} d:{config.damping}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaggerDemo() {
  const [visible, setVisible] = useState(true);
  const items = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-8">
      <button
        onClick={() => setVisible((p) => !p)}
        className="px-6 py-2 bg-white/10 rounded-lg text-white font-mono text-sm hover:bg-white/20 transition-colors"
      >
        {visible ? "Hide" : "Show"} Grid
      </button>
      <div className="grid grid-cols-4 gap-3">
        <AnimatePresence>
          {visible &&
            items.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{
                  delay: item * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className="w-16 h-16 bg-rose-500 rounded-xl"
              />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MorphDemo() {
  const [shape, setShape] = useState(0);
  const shapes = [
    { borderRadius: "16px", width: 200, height: 200, bg: "bg-cyan-500" },
    { borderRadius: "50%", width: 200, height: 200, bg: "bg-pink-500" },
    {
      borderRadius: "50% 0% 50% 0%",
      width: 200,
      height: 200,
      bg: "bg-yellow-500",
    },
    {
      borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
      width: 250,
      height: 180,
      bg: "bg-indigo-500",
    },
  ];

  const current = shapes[shape];

  return (
    <div className="flex flex-col items-center gap-8">
      <button
        onClick={() => setShape((p) => (p + 1) % shapes.length)}
        className="px-6 py-2 bg-white/10 rounded-lg text-white font-mono text-sm hover:bg-white/20 transition-colors"
      >
        Next Shape ({shape + 1}/{shapes.length})
      </button>
      <motion.div
        animate={{
          borderRadius: current.borderRadius,
          width: current.width,
          height: current.height,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`${current.bg} flex items-center justify-center text-white font-mono text-sm`}
      >
        {current.borderRadius}
      </motion.div>
    </div>
  );
}

export function FramerMotionPlayground() {
  const [activeDemo, setActiveDemo] = useState<DemoId>("layout");

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const idx = DEMOS.findIndex((d) => d.id === activeDemo);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setActiveDemo(DEMOS[(idx + 1) % DEMOS.length].id);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setActiveDemo(DEMOS[(idx - 1 + DEMOS.length) % DEMOS.length].id);
      }
    },
    [activeDemo],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const renderDemo = () => {
    switch (activeDemo) {
      case "layout":
        return <LayoutDemo />;
      case "gestures":
        return <GestureDemo />;
      case "springs":
        return <SpringDemo />;
      case "stagger":
        return <StaggerDemo />;
      case "morphing":
        return <MorphDemo />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white flex flex-col">
      <nav className="border-b border-white/10 p-4">
        <LayoutGroup>
          <div className="flex gap-2 justify-center flex-wrap">
            {DEMOS.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className="relative px-4 py-2 rounded-lg font-mono text-sm"
              >
                {activeDemo === demo.id && (
                  <motion.div
                    layoutId="nav-highlight"
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${activeDemo === demo.id ? "text-white" : "text-white/50"}`}
                >
                  {demo.title}
                </span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDemo}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-2">
                {DEMOS.find((d) => d.id === activeDemo)?.title}
              </h2>
              <p className="text-white/50 font-mono text-sm">
                {DEMOS.find((d) => d.id === activeDemo)?.description}
              </p>
            </div>
            {renderDemo()}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="border-t border-white/10 p-4 text-center">
        <p className="text-white/30 font-mono text-xs">
          ← → Arrow keys to navigate demos
        </p>
      </footer>
    </div>
  );
}
