import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Waves,
  MapPin,
  Zap,
  ArrowLeft,
  ArrowRight,
  Store,
  Settings,
  Beaker,
  Database,
  Shield,
  Activity,
} from "lucide-react";
import {
  PORTFOLIO_CATEGORIES,
  PORTAL_STATS,
  type Category,
  type App,
} from "../../data/natural-state-portfolio";

type CommandSlide = {
  command: string;
  output: string[];
  asciiArt?: string[];
};

const TERMINAL_COMMANDS: CommandSlide[] = [
  {
    command: "initialize_blue_economy_session.sh",
    output: [
      "Connecting to North Atlantic network...",
      "Establishing secure channel...",
      "Connection established.",
    ],
  },
  {
    command: "load_guests --sector=maritime",
    output: [
      "Loading guest profiles...",
      "3 guests connected:",
      "",
      "[1] Linn Indrestrand",
      "    Organization: Port of Hirtshals & Danish Ocean Cluster",
      "    Expertise: Circular Economy, Port Management",
      "",
      "[2] Unni Grebstad",
      "    Organization: OceanVju AS",
      "    Expertise: 3D Visualization, Digital Twins",
      "",
      "[3] Marit Aune",
      "    Organization: Hitra Municipality",
      "    Expertise: Marine Spatial Planning, Energy Transition",
      "",
      "Welcome as friends and collaboration partners.",
    ],
  },
  {
    command: "show_portfolio --presenter=gabriel_boen",
    output: [
      "════════════════════════════════════════════",
      "  NATURAL STATE: AI, DATA & INSIGHTS",
      "════════════════════════════════════════════",
      "",
      "Presenter: Gabriel Boen",
      "",
      "Portfolio Overview:",
      "  → 16 live applications",
      "  → 4 categories: Place, Market, Internal, Lab",
      "  → Unified design system",
      "  → Zero Trust infrastructure",
      "",
      "Let me show you what we've built...",
      "",
      "Press ENTER to view portfolio",
    ],
  },
];

const PROMPT = "visitor@blue-economy:~$ ";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function MatrixRain({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 14;
    const cols = Math.floor(width / fontSize);
    columnsRef.current = Array.from({ length: cols }, () =>
      Math.floor((Math.random() * height) / fontSize),
    );

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#00ff4120";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < columnsRef.current.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = columnsRef.current[i] * fontSize;

        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.975) {
          columnsRef.current[i] = 0;
        }
        columnsRef.current[i]++;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(rafRef.current);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none"
    />
  );
}

function TerminalIntro({ onComplete }: { onComplete: () => void }) {
  const reducedMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [typedCommand, setTypedCommand] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<
    { command: string; output: string[]; asciiArt?: string[] }[]
  >([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const typingRef = useRef<number>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, []);

  const typeCommand = useCallback(
    (text: string) => {
      if (reducedMotion) {
        setTypedCommand(text);
        setShowOutput(true);
        return;
      }

      setIsTyping(true);
      setTypedCommand("");
      let i = 0;

      const type = () => {
        if (i < text.length) {
          setTypedCommand(text.slice(0, i + 1));
          scrollToBottom();
          i++;
          const delay = 30 + Math.random() * 60;
          typingRef.current = window.setTimeout(type, delay);
        } else {
          setIsTyping(false);
          window.setTimeout(() => {
            setShowOutput(true);
            scrollToBottom();
          }, 300);
        }
      };

      typingRef.current = window.setTimeout(type, 500);
    },
    [reducedMotion, scrollToBottom],
  );

  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  useEffect(() => {
    if (currentSlide < TERMINAL_COMMANDS.length) {
      setShowOutput(false);
      setTypedCommand("");
      typeCommand(TERMINAL_COMMANDS[currentSlide].command);
    }
  }, [currentSlide, typeCommand]);

  useEffect(() => {
    scrollToBottom();
  }, [history, typedCommand, showOutput, scrollToBottom]);

  const advance = useCallback(() => {
    if (isTyping) return;

    if (showOutput && currentSlide < TERMINAL_COMMANDS.length) {
      const cmd = TERMINAL_COMMANDS[currentSlide];
      setHistory((prev) => [
        ...prev,
        {
          command: cmd.command,
          output: cmd.output,
          asciiArt: cmd.asciiArt,
        },
      ]);
      setShowOutput(false);
      setTypedCommand("");

      if (currentSlide < TERMINAL_COMMANDS.length - 1) {
        setCurrentSlide((prev) => prev + 1);
      } else {
        setTimeout(onComplete, 1000);
      }
    }
  }, [isTyping, showOutput, currentSlide, onComplete]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        advance();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [advance]);

  const currentCommand =
    currentSlide < TERMINAL_COMMANDS.length
      ? TERMINAL_COMMANDS[currentSlide]
      : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-screen bg-black overflow-hidden cursor-pointer select-none"
      onClick={advance}
      style={{
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      }}
    >
      {!reducedMotion && (
        <MatrixRain width={dimensions.width} height={dimensions.height} />
      )}

      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,255,65,0.03) 0px, rgba(0,255,65,0.03) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2 border-b border-green-900/40">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-green-500/60 text-xs">
          blue-economy-summit — bash — [{currentSlide + 1}/
          {TERMINAL_COMMANDS.length}]
        </span>
      </div>

      <div
        ref={scrollRef}
        className="absolute inset-0 top-10 z-20 overflow-y-auto p-4 pb-8"
      >
        {history.map((entry, idx) => (
          <div key={idx} className="mb-4">
            <div className="text-green-400">
              <span className="text-green-600">{PROMPT}</span>
              {entry.command}
            </div>
            {entry.output.map((line, i) => (
              <div
                key={i}
                className={`text-sm ${
                  line.startsWith(">")
                    ? "text-green-300/90 italic"
                    : line.startsWith("═")
                      ? "text-cyan-400"
                      : line.includes("→")
                        ? "text-yellow-400/80"
                        : line.startsWith("[")
                          ? "text-green-400 font-bold"
                          : "text-green-500/80"
                }`}
              >
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        ))}

        {currentCommand && (
          <div className="mb-4">
            <div className="text-green-400 flex items-center">
              <span className="text-green-600">{PROMPT}</span>
              <span>{typedCommand}</span>
              {!showOutput && (
                <span className="inline-block w-2 h-5 bg-green-400 ml-0.5 animate-pulse" />
              )}
            </div>

            <AnimatePresence>
              {showOutput && (
                <motion.div
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentCommand.output.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={reducedMotion ? false : { opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`text-sm ${
                        line.startsWith(">")
                          ? "text-green-300/90 italic"
                          : line.startsWith("═")
                            ? "text-cyan-400"
                            : line.includes("→")
                              ? "text-yellow-400/80"
                              : line.startsWith("[")
                                ? "text-green-400 font-bold"
                                : "text-green-500/80"
                      }`}
                    >
                      {line || "\u00A0"}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 py-2 bg-black/80 border-t border-green-900/40 flex items-center justify-center text-green-600/60 text-xs">
        <span>Enter/Space: next | Click: advance</span>
      </div>
    </div>
  );
}

function PortalOverview() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-8 relative bg-gradient-to-br from-[#0a0f1c] via-[#1a2f3f] to-[#0a0f1c]">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="max-w-6xl w-full text-white space-y-12"
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: false }}
          className="text-center space-y-4"
        >
          <h2 className="text-6xl font-black tracking-tight mb-4">
            Natural State Portal
          </h2>
          <p className="text-2xl font-light opacity-90 max-w-3xl mx-auto">
            AI-powered applications for regional development, circular economy,
            and sustainable decision-making
          </p>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: false }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { label: "Live Applications", value: PORTAL_STATS.totalApps },
            { label: "Categories", value: PORTAL_STATS.categories },
            { label: "Uptime", value: PORTAL_STATS.uptime },
            { label: "Zero Trust", value: "100%" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
              viewport={{ once: false }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center"
            >
              <p className="text-4xl font-bold text-cyan-400">{stat.value}</p>
              <p className="text-sm opacity-70 uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: false }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Shield size={32} className="text-cyan-400" />
            Architecture
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-cyan-400 font-semibold mb-2">Security</p>
              <p className="opacity-80">
                Cloudflare Zero Trust authentication protecting all applications
              </p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold mb-2">Infrastructure</p>
              <p className="opacity-80">
                Coolify + Hetzner deployment with live monitoring
              </p>
            </div>
            <div>
              <p className="text-cyan-400 font-semibold mb-2">Tech Stack</p>
              <p className="opacity-80">
                React + TypeScript + Vite, unified design system
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function CategorySection({ category }: { category: Category }) {
  const reducedMotion = useReducedMotion();

  const iconMap: Record<string, typeof MapPin> = {
    MapPin,
    Store,
    Settings,
    Beaker,
  };

  const Icon = iconMap[category.icon] || Database;

  return (
    <section
      className="min-h-screen w-full flex items-center justify-center p-8 relative"
      style={{
        background: `linear-gradient(135deg, ${category.color.from} 0%, ${category.color.to} 100%)`,
      }}
    >
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="max-w-6xl w-full space-y-8"
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: false }}
          className="text-white text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Icon size={48} className="text-white/90" />
            <h2 className="text-5xl font-black tracking-tight">
              {category.name}
            </h2>
          </div>
          <p className="text-xl font-light opacity-90">
            {category.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.apps.map((app, i) => (
            <AppCard key={app.id} app={app} index={i} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function AppCard({ app, index }: { app: App; index: number }) {
  const reducedMotion = useReducedMotion();

  const statusColors = {
    running: "bg-green-500",
    building: "bg-yellow-500",
    stopped: "bg-red-500",
  };

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: false }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-white space-y-4 hover:bg-white/15 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold leading-tight">{app.name}</h3>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${statusColors[app.status]}`} />
          <Activity size={16} className="text-white/60" />
        </div>
      </div>

      <p className="text-sm opacity-80 leading-relaxed">{app.description}</p>

      {app.keyMetric && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="text-2xl font-bold">{app.keyMetric}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {app.tags.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium border border-white/30"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function DesignSystemSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-8 relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="max-w-6xl w-full text-white space-y-12"
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: false }}
          className="text-center space-y-4"
        >
          <h2 className="text-5xl font-black tracking-tight">Design System</h2>
          <p className="text-xl font-light opacity-90 max-w-3xl mx-auto">
            Unified design language across all 16 applications
          </p>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: false }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Design Tokens",
              description: "Colors, typography, spacing, and elevation",
              icon: "🎨",
            },
            {
              title: "Component Library",
              description: "Reusable UI components with consistent patterns",
              icon: "🧩",
            },
            {
              title: "Motion Primitives",
              description: "Standardized animations and transitions",
              icon: "✨",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.6 }}
              viewport={{ once: false }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center space-y-3"
            >
              <p className="text-5xl mb-4">{item.icon}</p>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-sm opacity-80">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function InfrastructureSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-8 relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="max-w-6xl w-full text-white space-y-12"
      >
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: false }}
          className="text-center space-y-4"
        >
          <h2 className="text-5xl font-black tracking-tight">Infrastructure</h2>
          <p className="text-xl font-light opacity-90 max-w-3xl mx-auto">
            Enterprise-grade deployment with Zero Trust security
          </p>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: false }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
        >
          <div className="flex items-center justify-center gap-8 text-center">
            <div>
              <Shield size={48} className="mx-auto mb-3 text-cyan-400" />
              <p className="font-bold">Cloudflare</p>
              <p className="text-sm opacity-70">Zero Trust</p>
            </div>
            <ChevronRight size={32} className="opacity-40" />
            <div>
              <Database size={48} className="mx-auto mb-3 text-green-400" />
              <p className="font-bold">Coolify</p>
              <p className="text-sm opacity-70">Orchestration</p>
            </div>
            <ChevronRight size={32} className="opacity-40" />
            <div>
              <Activity size={48} className="mx-auto mb-3 text-purple-400" />
              <p className="font-bold">Hetzner</p>
              <p className="text-sm opacity-70">Infrastructure</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: false }}
          className="grid md:grid-cols-2 gap-6"
        >
          {[
            {
              title: "Security",
              items: [
                "Zero Trust authentication",
                "@naturalstate.no access control",
                "Automatic SSL/TLS",
              ],
            },
            {
              title: "Monitoring",
              items: [
                "Live status tracking",
                "Performance metrics",
                "Automated health checks",
              ],
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
              viewport={{ once: false }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h3 className="text-xl font-bold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <ChevronRight className="flex-shrink-0 mt-1" size={16} />
                    <span className="text-sm opacity-90">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

function ClosingSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false, amount: 0.3 }}
        className="max-w-4xl text-center space-y-8 text-white"
      >
        <motion.h2
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: false }}
          className="text-6xl font-black tracking-tight"
        >
          Let's Collaborate
        </motion.h2>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: false }}
          className="text-2xl font-light opacity-90 max-w-2xl mx-auto"
        >
          From circular economy platforms to regional analytics and digital
          infrastructure—ready to support Blue Economy innovation.
        </motion.p>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: false }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          {[
            { title: "Circular Economy", icon: Waves },
            { title: "Digital Twins", icon: Zap },
            { title: "Spatial Planning", icon: MapPin },
          ].map((domain, i) => (
            <motion.div
              key={i}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.2, duration: 0.6 }}
              viewport={{ once: false }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <domain.icon className="mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold">{domain.title}</h3>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          viewport={{ once: false }}
          className="text-cyan-400 font-mono text-lg mt-12"
        >
          gabriel@naturalstate.no
        </motion.div>
      </motion.div>
    </section>
  );
}

export function BlueEconomyLeaders() {
  const [phase, setPhase] = useState<"terminal" | "portfolio">("terminal");
  const [currentSection, setCurrentSection] = useState(0);

  const totalSections = PORTFOLIO_CATEGORIES.length + 3;

  useEffect(() => {
    if (phase !== "portfolio") return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        setCurrentSection((prev) => Math.min(prev + 1, totalSections - 1));
      } else if (e.key === "ArrowUp") {
        setCurrentSection((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Escape") {
        setPhase("terminal");
        setCurrentSection(0);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, totalSections]);

  if (phase === "terminal") {
    return <TerminalIntro onComplete={() => setPhase("portfolio")} />;
  }

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-x-hidden">
      <div className="snap-y snap-mandatory h-screen overflow-y-scroll">
        <div className="snap-start">
          <PortalOverview />
        </div>
        {PORTFOLIO_CATEGORIES.map((category) => (
          <div key={category.id} className="snap-start">
            <CategorySection category={category} />
          </div>
        ))}
        <div className="snap-start">
          <DesignSystemSection />
        </div>
        <div className="snap-start">
          <InfrastructureSection />
        </div>
        <div className="snap-start">
          <ClosingSection />
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
        {Array.from({ length: totalSections }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSection ? "bg-white w-8" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex gap-2 text-white/60 text-xs bg-black/80 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
        <ArrowLeft size={16} />
        <span>Scroll or arrow keys</span>
        <ArrowRight size={16} />
      </div>
    </div>
  );
}
