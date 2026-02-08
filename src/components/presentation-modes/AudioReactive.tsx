import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type VisMode =
  | "radial"
  | "waveform"
  | "particles"
  | "rings"
  | "bars"
  | "spiral"
  | "blob";

type SlideData = {
  title: string;
  description: string;
  visMode: VisMode;
  hueBase: number;
};

const SLIDES: SlideData[] = [
  {
    title: "What Is Sound?",
    description:
      "Sound is a mechanical wave — vibrations traveling through air, water, or solids. Frequency determines pitch, amplitude determines volume.",
    visMode: "waveform",
    hueBase: 200,
  },
  {
    title: "The Frequency Spectrum",
    description:
      "Humans hear 20Hz to 20kHz. Bass (20-250Hz) you feel. Midrange (250-4kHz) carries speech. Treble (4-20kHz) adds brilliance.",
    visMode: "radial",
    hueBase: 280,
  },
  {
    title: "Human Hearing",
    description:
      "Our ears are most sensitive between 2-5kHz — the frequency range of a baby's cry. Loudness is measured in decibels (dB), a logarithmic scale.",
    visMode: "rings",
    hueBase: 120,
  },
  {
    title: "Digital Audio",
    description:
      "Analog waves become digital through sampling. CD quality: 44.1kHz sample rate, 16-bit depth = 1,411 kbps of raw data per second.",
    visMode: "bars",
    hueBase: 30,
  },
  {
    title: "Audio Compression",
    description:
      "MP3, AAC, and Opus use psychoacoustic models to remove sounds humans can't perceive. A 50MB WAV becomes a 5MB MP3 with minimal quality loss.",
    visMode: "particles",
    hueBase: 340,
  },
  {
    title: "Spatial Audio",
    description:
      "Binaural, Dolby Atmos, and ambisonics create 3D sound fields. Head-related transfer functions (HRTFs) simulate how ears locate sound in space.",
    visMode: "spiral",
    hueBase: 180,
  },
  {
    title: "The Future of Audio",
    description:
      "AI-generated music, real-time voice cloning, neural audio codecs. The Web Audio API puts a professional audio engine in every browser.",
    visMode: "blob",
    hueBase: 60,
  },
];

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

type AudioState = {
  ctx: AudioContext;
  analyser: AnalyserNode;
  gain: GainNode;
  source: OscillatorNode | MediaStreamAudioSourceNode | null;
  isPlaying: boolean;
  isMic: boolean;
};

function createAmbientAudio(
  ctx: AudioContext,
  gain: GainNode,
): OscillatorNode[] {
  const oscillators: OscillatorNode[] = [];
  const freqs = [110, 165, 220, 330, 440];
  const types: OscillatorType[] = ["sine", "sine", "triangle", "sine", "sine"];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = types[i];
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.06 / (i + 1), ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2 + i * 0.15, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(freq * 0.02, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    osc.connect(oscGain);
    oscGain.connect(gain);
    osc.start();
    oscillators.push(osc);
  });

  return oscillators;
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  hue: number;
  size: number;
};

export function AudioReactive() {
  const reducedMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [audioMode, setAudioMode] = useState<"ambient" | "mic" | "off">("off");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<AudioState | null>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const beatRef = useRef({
    lastEnergy: 0,
    isBeat: false,
    cooldown: 0,
    flash: 0,
  });
  const sizeRef = useRef({ w: 800, h: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        sizeRef.current = {
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        };
        if (canvasRef.current) {
          canvasRef.current.width = sizeRef.current.w;
          canvasRef.current.height = sizeRef.current.h;
        }
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const initAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.connect(analyser);
    analyser.connect(ctx.destination);
    const state: AudioState = {
      ctx,
      analyser,
      gain,
      source: null,
      isPlaying: false,
      isMic: false,
    };
    audioRef.current = state;
    return state;
  }, [volume]);

  const startAmbient = useCallback(() => {
    const audio = initAudio();
    oscillatorsRef.current.forEach((o) => {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    });
    if (
      audio.source &&
      audio.isMic &&
      audio.source instanceof MediaStreamAudioSourceNode
    ) {
      const stream = (audio.source as MediaStreamAudioSourceNode).mediaStream;
      stream.getTracks().forEach((t) => t.stop());
    }
    audio.source = null;
    audio.isMic = false;

    if (audio.ctx.state === "suspended") audio.ctx.resume();
    const oscs = createAmbientAudio(audio.ctx, audio.gain);
    oscillatorsRef.current = oscs;
    audio.isPlaying = true;
    setAudioMode("ambient");
  }, [initAudio]);

  const startMic = useCallback(async () => {
    const audio = initAudio();
    oscillatorsRef.current.forEach((o) => {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    });
    oscillatorsRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audio.ctx.createMediaStreamSource(stream);
      source.connect(audio.gain);
      audio.source = source;
      audio.isMic = true;
      audio.isPlaying = true;
      setAudioMode("mic");
    } catch {
      setAudioMode("off");
    }
  }, [initAudio]);

  const stopAudio = useCallback(() => {
    oscillatorsRef.current.forEach((o) => {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    });
    oscillatorsRef.current = [];
    if (audioRef.current) {
      if (audioRef.current.isMic && audioRef.current.source) {
        const src = audioRef.current.source as MediaStreamAudioSourceNode;
        src.mediaStream.getTracks().forEach((t) => t.stop());
      }
      audioRef.current.isPlaying = false;
      audioRef.current.source = null;
    }
    setAudioMode("off");
  }, []);

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current);
      stopAudio();
      if (audioRef.current) {
        audioRef.current.ctx.close();
      }
    };
  }, [stopAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.gain.gain.setValueAtTime(
        muted ? 0 : volume,
        audioRef.current.ctx.currentTime,
      );
    }
  }, [volume, muted]);

  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const W = sizeRef.current.w;
      const H = sizeRef.current.h;
      const cx = W / 2;
      const cy = H / 2;
      const slide = SLIDES[currentSlide];

      ctx.fillStyle = "rgba(3,7,18,0.15)";
      ctx.fillRect(0, 0, W, H);

      const audioState = audioRef.current;
      const bufferLength = audioState?.analyser.frequencyBinCount ?? 128;
      const freqData = new Uint8Array(bufferLength);
      const timeData = new Uint8Array(bufferLength);

      if (audioState?.isPlaying) {
        audioState.analyser.getByteFrequencyData(freqData);
        audioState.analyser.getByteTimeDomainData(timeData);
      } else {
        const t = performance.now() / 1000;
        for (let i = 0; i < bufferLength; i++) {
          freqData[i] = Math.floor(
            40 +
              30 * Math.sin(t * 2 + i * 0.3) +
              20 * Math.sin(t * 3.7 + i * 0.5),
          );
          timeData[i] = Math.floor(128 + 40 * Math.sin(t * 4 + i * 0.2));
        }
      }

      let bassEnergy = 0;
      const bassEnd = Math.floor(bufferLength * 0.15);
      for (let i = 0; i < bassEnd; i++) {
        bassEnergy += freqData[i];
      }
      bassEnergy /= bassEnd;

      const beat = beatRef.current;
      if (beat.cooldown > 0) beat.cooldown--;
      if (
        bassEnergy > beat.lastEnergy * 1.4 &&
        bassEnergy > 120 &&
        beat.cooldown === 0
      ) {
        beat.isBeat = true;
        beat.flash = 1;
        beat.cooldown = 10;

        for (let k = 0; k < 8; k++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 4;
          particlesRef.current.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 60 + Math.random() * 40,
            maxLife: 100,
            hue: slide.hueBase + Math.random() * 60 - 30,
            size: 2 + Math.random() * 3,
          });
        }
      } else {
        beat.isBeat = false;
      }
      beat.lastEnergy = bassEnergy;
      if (beat.flash > 0) beat.flash *= 0.9;

      if (beat.flash > 0.05) {
        ctx.fillStyle = `hsla(${slide.hueBase}, 80%, 60%, ${beat.flash * 0.08})`;
        ctx.fillRect(0, 0, W, H);
      }

      let avgFreq = 0;
      for (let i = 0; i < bufferLength; i++) avgFreq += freqData[i];
      avgFreq /= bufferLength;
      const hueShift = (avgFreq / 255) * 60;
      const hue = slide.hueBase + hueShift;

      const mode = slide.visMode;

      if (mode === "radial") {
        const bars = bufferLength;
        for (let i = 0; i < bars; i++) {
          const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;
          const val = freqData[i] / 255;
          const innerR = 80;
          const outerR = innerR + val * Math.min(W, H) * 0.35;
          ctx.beginPath();
          ctx.moveTo(
            cx + Math.cos(angle) * innerR,
            cy + Math.sin(angle) * innerR,
          );
          ctx.lineTo(
            cx + Math.cos(angle) * outerR,
            cy + Math.sin(angle) * outerR,
          );
          ctx.strokeStyle = `hsla(${hue + (i / bars) * 60}, 80%, ${50 + val * 30}%, ${0.5 + val * 0.5})`;
          ctx.lineWidth = Math.max(1, ((Math.PI * 2 * innerR) / bars) * 0.6);
          ctx.stroke();
        }
      } else if (mode === "waveform") {
        ctx.beginPath();
        for (let i = 0; i < bufferLength; i++) {
          const x = (i / bufferLength) * W;
          const val = (timeData[i] - 128) / 128;
          const y = cy + val * H * 0.35;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${hue}, 80%, 65%, 0.8)`;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < bufferLength; i++) {
          const x = (i / bufferLength) * W;
          const val = (timeData[i] - 128) / 128;
          const y = cy - val * H * 0.35;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${hue + 40}, 70%, 55%, 0.4)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (mode === "bars") {
        const barW = W / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
          const val = freqData[i] / 255;
          const barH = val * H * 0.6;
          ctx.fillStyle = `hsla(${hue + (i / bufferLength) * 80}, 75%, ${45 + val * 30}%, ${0.6 + val * 0.4})`;
          ctx.fillRect(i * barW, H - barH - 40, barW - 1, barH);
        }
      } else if (mode === "rings") {
        for (let ring = 0; ring < 5; ring++) {
          const segStart = Math.floor((ring / 5) * bufferLength);
          const segEnd = Math.floor(((ring + 1) / 5) * bufferLength);
          let ringVal = 0;
          for (let j = segStart; j < segEnd; j++) ringVal += freqData[j];
          ringVal /= (segEnd - segStart) * 255;
          const r = 50 + ring * 50 + ringVal * 80;
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${hue + ring * 20}, 80%, 60%, ${0.3 + ringVal * 0.5})`;
          ctx.lineWidth = 2 + ringVal * 4;
          ctx.stroke();
        }
      } else if (mode === "particles") {
        // particle-only mode — handled below
      } else if (mode === "spiral") {
        ctx.beginPath();
        for (let i = 0; i < bufferLength; i++) {
          const t = (i / bufferLength) * Math.PI * 6;
          const val = freqData[i] / 255;
          const r = 30 + i * 1.5 + val * 60;
          const x = cx + Math.cos(t) * r;
          const y = cy + Math.sin(t) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${hue}, 80%, 65%, 0.7)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (mode === "blob") {
        const points = 64;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const fi = Math.floor((i / points) * bufferLength) % bufferLength;
          const val = freqData[fi] / 255;
          const r = 100 + val * 120;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.15)`;
        ctx.fill();
        ctx.strokeStyle = `hsla(${hue}, 80%, 65%, 0.6)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.life--;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.8})`;
        ctx.fill();
      }

      if (particles.length > 200) {
        particles.splice(0, particles.length - 200);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [reducedMotion, currentSlide]);

  const goToSlide = useCallback((idx: number) => {
    setCurrentSlide(Math.max(0, Math.min(idx, SLIDES.length - 1)));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToSlide(currentSlide + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToSlide(currentSlide - 1);
      } else if (e.key === "m") {
        setMuted((m) => !m);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentSlide, goToSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-screen bg-[#030712] text-white flex flex-col relative overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between bg-gradient-to-b from-[#030712] via-[#030712]/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <button
              onClick={() =>
                audioMode === "ambient" ? stopAudio() : startAmbient()
              }
              className={`px-2.5 py-1 text-[10px] rounded-full border transition-colors ${
                audioMode === "ambient"
                  ? "bg-white/10 border-white/30 text-white"
                  : "border-white/10 text-white/40 hover:text-white/60"
              }`}
            >
              {audioMode === "ambient" ? "Stop" : "Play"} Ambient
            </button>
            <button
              onClick={() => (audioMode === "mic" ? stopAudio() : startMic())}
              className={`px-2.5 py-1 text-[10px] rounded-full border transition-colors ${
                audioMode === "mic"
                  ? "bg-white/10 border-white/30 text-white"
                  : "border-white/10 text-white/40 hover:text-white/60"
              }`}
            >
              {audioMode === "mic" ? "Stop" : "Use"} Mic
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted((m) => !m)}
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 accent-white/60"
          />
          <span className="text-[10px] text-white/30 font-mono w-8">
            {currentSlide + 1}/{SLIDES.length}
          </span>
        </div>
      </div>

      <div className="flex-1 relative z-10 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl text-center px-6"
          >
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed drop-shadow-md">
              {slide.description}
            </p>
            <p className="text-[10px] text-white/30 mt-4 uppercase tracking-widest font-mono">
              {slide.visMode}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-3 bg-gradient-to-t from-[#030712] to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={() => goToSlide(currentSlide - 1)}
            disabled={currentSlide === 0}
            className="text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
          >
            ← Prev
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentSlide
                    ? "bg-white scale-150"
                    : "bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => goToSlide(currentSlide + 1)}
            disabled={currentSlide === SLIDES.length - 1}
            className="text-xs text-white/40 hover:text-white disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
        <p className="text-[10px] text-white/30 text-center mt-1">
          ←→ Navigate | M: Mute | Play ambient or use microphone
        </p>
      </div>
    </div>
  );
}
