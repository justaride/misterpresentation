import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CommandSlide = {
  command: string;
  output: string[];
  asciiArt?: string[];
};

const ASCII_HEADERS: Record<string, string[]> = {
  intro: [
    "  ___  ____  _____ _   _   ____   ___  _   _ ____   ____ _____ ",
    " / _ \\|  _ \\| ____| \\ | | / ___| / _ \\| | | |  _ \\ / ___| ____|",
    "| | | | |_) |  _| |  \\| | \\___ \\| | | | | | | |_) | |   |  _|  ",
    "| |_| |  __/| |___| |\\  |  ___) | |_| | |_| |  _ <| |___| |___ ",
    " \\___/|_|   |_____|_| \\_| |____/ \\___/ \\___/|_| \\_\\\\____|_____|",
  ],
  community: [
    "  ____ ___  __  __ __  __ _   _ _   _ ___ _____ __   __",
    " / ___/ _ \\|  \\/  |  \\/  | | | | \\ | |_ _|_   _|\\ \\ / /",
    "| |  | | | | |\\/| | |\\/| | | | |  \\| || |  | |   \\ V / ",
    "| |__| |_| | |  | | |  | | |_| | |\\  || |  | |    | |  ",
    " \\____\\___/|_|  |_|_|  |_|\\___/|_| \\_|___| |_|    |_|  ",
  ],
  future: [
    " _____ _   _ _____ _   _ ____  _____ ",
    "|  ___| | | |_   _| | | |  _ \\| ____|",
    "| |_  | | | | | | | | | | |_) |  _|  ",
    "|  _| | |_| | | | | |_| |  _ <| |___ ",
    "|_|    \\___/  |_|  \\___/|_| \\_\\_____|",
  ],
};

const COMMANDS: CommandSlide[] = [
  {
    command: "whoami",
    output: [
      "open-source-developer",
      "",
      "> A builder of public goods.",
      "> A contributor to the commons.",
      "> One of 100 million+ developers on GitHub.",
    ],
  },
  {
    command: "cat /etc/motd",
    asciiArt: ASCII_HEADERS.intro,
    output: [
      "",
      "Welcome to the future of collaborative software.",
      "",
      "The open source movement has reshaped how",
      "the entire world builds technology.",
      "",
      "96% of all codebases contain open source components.",
    ],
  },
  {
    command: "ls -la projects/",
    output: [
      "total 2847291",
      "drwxr-xr-x  420M  linux-kernel/",
      "drwxr-xr-x  180M  kubernetes/",
      "drwxr-xr-x   95M  react/",
      "drwxr-xr-x   88M  vscode/",
      "drwxr-xr-x   72M  tensorflow/",
      "drwxr-xr-x   61M  rust-lang/",
      "",
      "> These projects power the modern internet.",
      "> Built by millions of volunteers worldwide.",
    ],
  },
  {
    command: 'grep -r "funding" ./ecosystem/',
    output: [
      "./ecosystem/sponsors.md:  GitHub Sponsors: $50M+ paid to maintainers",
      "./ecosystem/foundations.md: Linux Foundation: 1,800+ member companies",
      "./ecosystem/grants.md:     Sovereign Tech Fund: $20M for critical infra",
      "./ecosystem/corporate.md:  Google OSS: $100M+ committed since 2021",
      "",
      "> Funding is growing, but still a fraction of the",
      "> value open source creates ($8.8 trillion annually).",
    ],
  },
  {
    command: "git log --oneline --graph community/",
    asciiArt: ASCII_HEADERS.community,
    output: [
      "",
      "* 2024  100M+ developers on GitHub",
      "* 2023  Open source AI models explode (Llama, Mistral)",
      "* 2022  Rust enters Linux kernel",
      "* 2020  COVID accelerates remote OSS contribution",
      "* 2018  Microsoft acquires GitHub ($7.5B)",
      "* 2014  Docker democratizes containerization",
      "* 2008  GitHub launches — social coding begins",
      "* 1991  Linus posts Linux 0.01",
    ],
  },
  {
    command: "curl https://api.oss-trends.dev/challenges",
    output: [
      "{",
      '  "challenges": [',
      '    "Maintainer burnout — 60% work unpaid",',
      '    "Supply chain attacks — Log4Shell, XZ Utils",',
      '    "License compliance complexity",',
      '    "Corporate free-riding on volunteer labor",',
      '    "Sustainability of critical infrastructure"',
      "  ],",
      '  "status": "needs_attention"',
      "}",
    ],
  },
  {
    command: "cat solutions.md",
    output: [
      "# How We Fix Open Source",
      "",
      "1. **Pay maintainers** — not pizza, real money",
      "2. **SBOMs everywhere** — know your dependencies",
      "3. **Corporate give-back** — contribute, don't just consume",
      "4. **Government funding** — critical digital infrastructure",
      "5. **Better tooling** — reduce maintenance burden",
      "",
      "> The code is open. The question is whether",
      "> we can keep it sustainable.",
    ],
  },
  {
    command: "fortune",
    asciiArt: ASCII_HEADERS.future,
    output: [
      "",
      '"The best way to predict the future is to',
      ' invent it — and then open source it."',
      "",
      "> AI-assisted contributions lower the barrier.",
      "> New licensing models emerge.",
      "> The next billion developers are coming online.",
      "",
      "The future of software is open. Always has been.",
      "",
      "[Process complete — press ESC to return]",
    ],
  },
];

const PROMPT = "visitor@mister-presentations:~$ ";

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

export function TerminalHacker() {
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
    if (currentSlide < COMMANDS.length) {
      setShowOutput(false);
      setTypedCommand("");
      typeCommand(COMMANDS[currentSlide].command);
    }
  }, [currentSlide, typeCommand]);

  useEffect(() => {
    scrollToBottom();
  }, [history, typedCommand, showOutput, scrollToBottom]);

  const advance = useCallback(() => {
    if (isTyping) return;

    if (showOutput && currentSlide < COMMANDS.length) {
      const cmd = COMMANDS[currentSlide];
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

      if (currentSlide < COMMANDS.length - 1) {
        setCurrentSlide((prev) => prev + 1);
      }
    }
  }, [isTyping, showOutput, currentSlide]);

  const goBack = useCallback(() => {
    if (isTyping || currentSlide === 0) return;
    setHistory((prev) => prev.slice(0, -1));
    setCurrentSlide((prev) => prev - 1);
  }, [isTyping, currentSlide]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        advance();
      } else if (e.key === "Escape" || e.key === "ArrowLeft") {
        goBack();
      } else if (e.key === "ArrowRight") {
        advance();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [advance, goBack]);

  const currentCommand =
    currentSlide < COMMANDS.length ? COMMANDS[currentSlide] : null;

  const progressText = useMemo(
    () => `[${currentSlide + 1}/${COMMANDS.length}]`,
    [currentSlide],
  );

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
          mister-presentations — bash — 80x24 {progressText}
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
            {entry.asciiArt && (
              <div className="text-green-300/80 text-[10px] leading-[12px] sm:text-xs sm:leading-tight mt-1">
                {entry.asciiArt.map((line, i) => (
                  <div key={i} className="whitespace-pre">
                    {line}
                  </div>
                ))}
              </div>
            )}
            {entry.output.map((line, i) => (
              <div
                key={i}
                className={`text-sm ${
                  line.startsWith(">")
                    ? "text-green-300/90 italic"
                    : line.startsWith("#")
                      ? "text-green-200 font-bold"
                      : line.startsWith("{") ||
                          line.startsWith("}") ||
                          line.startsWith('  "')
                        ? "text-cyan-400/80"
                        : line.startsWith("*")
                          ? "text-green-400"
                          : line.startsWith("./")
                            ? "text-yellow-400/80"
                            : line.match(/^\d+\./)
                              ? "text-green-300"
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
                  {currentCommand.asciiArt && (
                    <div className="text-green-300/80 text-[10px] leading-[12px] sm:text-xs sm:leading-tight mt-1">
                      {currentCommand.asciiArt.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={
                            reducedMotion ? false : { opacity: 0, x: -10 }
                          }
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="whitespace-pre"
                        >
                          {line}
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {currentCommand.output.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={reducedMotion ? false : { opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay:
                          (currentCommand.asciiArt?.length ?? 0) * 0.05 +
                          i * 0.04,
                      }}
                      className={`text-sm ${
                        line.startsWith(">")
                          ? "text-green-300/90 italic"
                          : line.startsWith("#")
                            ? "text-green-200 font-bold"
                            : line.startsWith("{") ||
                                line.startsWith("}") ||
                                line.startsWith('  "')
                              ? "text-cyan-400/80"
                              : line.startsWith("*")
                                ? "text-green-400"
                                : line.startsWith("./")
                                  ? "text-yellow-400/80"
                                  : line.match(/^\d+\./)
                                    ? "text-green-300"
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

      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 py-2 bg-black/80 border-t border-green-900/40 flex items-center justify-between text-green-600/60 text-xs">
        <span>Enter/Space: next | Esc/←: back | Click: advance</span>
        <span>{progressText}</span>
      </div>
    </div>
  );
}
