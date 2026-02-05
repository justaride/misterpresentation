import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SlideData = {
  title: string;
  content: string[];
  accent: string;
};

const SLIDES: SlideData[] = [
  {
    title: "The Rise of Voice Interfaces",
    content: [
      "From command lines to conversational AI",
      "Voice is the most natural human interface",
      'Try it: say "next" to advance this slide',
    ],
    accent: "from-cyan-500 to-blue-600",
  },
  {
    title: "A Brief History",
    content: [
      "1952 — Audrey: recognized 10 digits",
      "1990 — Dragon Dictate: first consumer product",
      "2011 — Siri launches on iPhone 4S",
      "2014 — Amazon Echo brings voice to the home",
      "2023 — LLMs make voice truly conversational",
    ],
    accent: "from-violet-500 to-purple-600",
  },
  {
    title: "Design Principles",
    content: [
      "Discoverability: users must know what to say",
      "Feedback: confirm what was heard",
      "Forgiveness: handle misrecognition gracefully",
      "Efficiency: voice should be faster than tap",
    ],
    accent: "from-emerald-500 to-teal-600",
  },
  {
    title: "The Accessibility Advantage",
    content: [
      "Motor impairments: hands-free navigation",
      "Visual impairments: natural audio interaction",
      "Cognitive load: speak naturally, don't decode UI",
      "Situational: driving, cooking, multitasking",
    ],
    accent: "from-amber-500 to-orange-600",
  },
  {
    title: "Technical Architecture",
    content: [
      "Web Speech API — browser-native recognition",
      "SpeechRecognition → interim + final results",
      "Web Audio API — real-time waveform analysis",
      "Intent parsing — map speech to commands",
    ],
    accent: "from-rose-500 to-pink-600",
  },
  {
    title: "Challenges",
    content: [
      "Ambient noise in real environments",
      "Accent and dialect diversity",
      "Privacy concerns with always-listening",
      "Latency expectations vs. reality",
      "Discoverability of voice commands",
    ],
    accent: "from-red-500 to-rose-600",
  },
  {
    title: "The Multimodal Future",
    content: [
      "Voice + gesture = spatial computing",
      "Voice + vision = context-aware AI",
      "Voice + haptics = immersive feedback",
      "Natural language replaces menus and forms",
    ],
    accent: "from-blue-500 to-indigo-600",
  },
  {
    title: "Voice Is the Future",
    content: [
      "Every interface becomes conversational",
      "AI bridges the gap between intent and action",
      "The best interface is no interface at all",
      "",
      'Commands: "next" • "back" • "go to [number]"',
    ],
    accent: "from-fuchsia-500 to-violet-600",
  },
];

type MicStatus = "off" | "listening" | "recognized" | "unavailable";

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

function WaveformVisualizer({ analyser }: { analyser: AnalyserNode | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!analyser) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, w, h);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#06b6d4";
      ctx.beginPath();

      const sliceWidth = w / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * h) / 2;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(w, h / 2);
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyser]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={60}
      className="w-full max-w-xs h-15 rounded-lg opacity-80"
    />
  );
}

export function VoiceControlledDeck() {
  const reducedMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [micStatus, setMicStatus] = useState<MicStatus>("off");
  const [recognizedText, setRecognizedText] = useState("");
  const [lastCommand, setLastCommand] = useState("");
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const goToSlide = useCallback((n: number) => {
    const clamped = Math.max(0, Math.min(n, SLIDES.length - 1));
    setCurrentSlide(clamped);
  }, []);

  const parseCommand = useCallback(
    (text: string) => {
      const lower = text.toLowerCase().trim();
      if (lower.includes("next") || lower.includes("forward")) {
        setLastCommand("next →");
        goToSlide(currentSlide + 1);
      } else if (lower.includes("back") || lower.includes("previous")) {
        setLastCommand("← back");
        goToSlide(currentSlide - 1);
      } else if (lower.includes("first") || lower.includes("beginning")) {
        setLastCommand("⏮ first");
        goToSlide(0);
      } else if (lower.includes("last") || lower.includes("end")) {
        setLastCommand("⏭ last");
        goToSlide(SLIDES.length - 1);
      } else {
        const match = lower.match(/(?:go\s*to\s*(?:slide\s*)?|slide\s*)(\d+)/);
        if (match) {
          const n = parseInt(match[1], 10);
          setLastCommand(`→ slide ${n}`);
          goToSlide(n - 1);
        }
      }
    },
    [currentSlide, goToSlide],
  );

  const startListening = useCallback(async () => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      setMicStatus("unavailable");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 2048;
      source.connect(analyserNode);
      audioCtxRef.current = audioCtx;
      setAnalyser(analyserNode);

      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEventType) => {
        let interim = "";
        let finalText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcript;
          } else {
            interim += transcript;
          }
        }

        setRecognizedText(interim || finalText);

        if (finalText) {
          setMicStatus("recognized");
          parseCommand(finalText);
          setTimeout(() => setMicStatus("listening"), 1500);
        }
      };

      recognition.onerror = () => {
        setMicStatus("off");
      };

      recognition.onend = () => {
        if (micStatus === "listening" || micStatus === "recognized") {
          try {
            recognition.start();
          } catch {
            /* already started */
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
      setMicStatus("listening");
    } catch {
      setMicStatus("off");
    }
  }, [parseCommand, micStatus]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
    setAnalyser(null);
    setMicStatus("off");
    setRecognizedText("");
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      audioCtxRef.current?.close();
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      } else if (e.key === "ArrowLeft") {
        goToSlide(currentSlide - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentSlide, goToSlide]);

  const slide = SLIDES[currentSlide];
  const statusColor =
    micStatus === "listening"
      ? "bg-green-500"
      : micStatus === "recognized"
        ? "bg-cyan-400"
        : micStatus === "unavailable"
          ? "bg-red-500"
          : "bg-gray-500";

  const statusLabel =
    micStatus === "listening"
      ? "Listening..."
      : micStatus === "recognized"
        ? "Command recognized"
        : micStatus === "unavailable"
          ? "Speech API unavailable"
          : "Microphone off";

  return (
    <div className="w-full h-full min-h-screen bg-gray-950 text-white flex flex-col select-none">
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-10`}
        />

        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={reducedMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-2xl text-center"
          >
            <h2 className="text-3xl sm:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              {slide.title}
            </h2>
            <div className="space-y-3">
              {slide.content.map((line, i) => (
                <motion.p
                  key={i}
                  initial={reducedMotion ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-base sm:text-lg text-white/70"
                >
                  {line || "\u00A0"}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              micStatus === "off" ? startListening() : stopListening();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
              micStatus === "listening" || micStatus === "recognized"
                ? "border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20"
                : "border-white/20 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${statusColor}`} />
              {micStatus === "listening" && (
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping" />
              )}
            </div>
            <span className="text-xs font-mono">{statusLabel}</span>
          </button>

          {recognizedText && micStatus !== "off" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 max-w-xs truncate"
            >
              "{recognizedText}"
            </motion.div>
          )}

          {lastCommand && (
            <motion.div
              key={lastCommand}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-xs font-mono text-cyan-400"
            >
              {lastCommand}
            </motion.div>
          )}
        </div>

        {analyser && micStatus !== "off" && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
            <WaveformVisualizer analyser={analyser} />
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="px-3 py-1 rounded text-xs font-mono border border-white/20 hover:bg-white/10 disabled:opacity-30 transition-all"
          >
            ← Back
          </button>
          <button
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide === SLIDES.length - 1}
            className="px-3 py-1 rounded text-xs font-mono border border-white/20 hover:bg-white/10 disabled:opacity-30 transition-all"
          >
            Next →
          </button>
        </div>

        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentSlide
                  ? "bg-cyan-400 scale-125"
                  : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <span className="text-xs font-mono text-white/40">
          {currentSlide + 1}/{SLIDES.length}
        </span>
      </div>
    </div>
  );
}

type SpeechRecognitionType = {
  new (): SpeechRecognitionInstance;
};

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventType) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventType = {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string; confidence: number };
    };
  };
};

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionType;
    webkitSpeechRecognition: SpeechRecognitionType;
  }
}
