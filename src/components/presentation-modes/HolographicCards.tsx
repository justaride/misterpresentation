import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

type CardData = {
  title: string;
  subtitle: string;
  content: string[];
  gradient: string;
  number: string;
};

const CARDS: CardData[] = [
  {
    title: "The Problem",
    subtitle: "Payments are broken",
    content: [
      "Cross-border payments take 3-5 days",
      "Average fee: 3.5% per transaction",
      "$2.8T locked in settlement delays",
      "SMBs lose $120B/year to payment friction",
    ],
    gradient: "from-red-500 via-orange-500 to-yellow-500",
    number: "01",
  },
  {
    title: "The Solution",
    subtitle: "NeonPay: Instant global payments",
    content: [
      "Real-time settlement on any currency",
      "Flat 0.5% fee — 7x cheaper than incumbents",
      "API-first: integrate in under 10 minutes",
      "Built on next-gen blockchain rails",
    ],
    gradient: "from-cyan-500 via-blue-500 to-violet-500",
    number: "02",
  },
  {
    title: "Market Size",
    subtitle: "$150T opportunity",
    content: [
      "Global payments market: $150T annually",
      "Cross-border B2B: $35T and growing 8% YoY",
      "Digital payments growing 15% CAGR",
      "Incumbent disruption window: now",
    ],
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    number: "03",
  },
  {
    title: "Traction",
    subtitle: "Explosive growth",
    content: [
      "$12M ARR (up 400% YoY)",
      "2,400+ business customers",
      "$8.5B processed in last 12 months",
      "NPS: 78 (industry avg: 31)",
    ],
    gradient: "from-amber-500 via-yellow-500 to-lime-500",
    number: "04",
  },
  {
    title: "The Team",
    subtitle: "Operators who've been here before",
    content: [
      "CEO: Ex-Stripe, built merchant platform",
      "CTO: Ex-Coinbase, scaled to 100M users",
      "CPO: Ex-Square, launched Cash App International",
      "85 engineers across 4 continents",
    ],
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    number: "05",
  },
  {
    title: "Business Model",
    subtitle: "Multiple revenue streams",
    content: [
      "Transaction fees: 0.5% per transfer",
      "FX spread: 0.2% on currency conversion",
      "Enterprise SaaS: $2K-50K/mo tiers",
      "Gross margin: 72% and improving",
    ],
    gradient: "from-pink-500 via-rose-500 to-red-500",
    number: "06",
  },
  {
    title: "Financials",
    subtitle: "Path to profitability",
    content: [
      "Burn rate: $800K/mo (18-month runway)",
      "CAC payback: 4 months",
      "LTV:CAC ratio: 8:1",
      "Breakeven projected Q3 2026",
    ],
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    number: "07",
  },
  {
    title: "The Ask",
    subtitle: "Series B: $40M",
    content: [
      "Raising $40M at $320M pre-money",
      "Use of funds: 60% engineering, 25% GTM, 15% ops",
      "Target: 10x ARR in 24 months",
      "Join us in rebuilding global payments",
    ],
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    number: "08",
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

function HoloCard({
  card,
  isActive,
  onFlip,
  flipped,
}: {
  card: CardData;
  isActive: boolean;
  onFlip: () => void;
  flipped: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const holoX = useTransform(rotateY, [-15, 15], [0, 100]);
  const holoY = useTransform(rotateX, [-15, 15], [0, 100]);
  const glareOpacity = useTransform(rotateY, [-15, 0, 15], [0.3, 0, 0.3]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current || reducedMotion || !isActive) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateX.set(y * -20);
      rotateY.set(x * 20);
    },
    [rotateX, rotateY, reducedMotion, isActive],
  );

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onFlip}
      style={{
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative w-[340px] h-[480px] sm:w-[380px] sm:h-[520px] cursor-pointer"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full"
      >
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20`}
          />
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl" />

          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: useTransform(
                [holoX, holoY],
                ([x, y]) =>
                  `linear-gradient(${135 + (x as number) * 0.5}deg,
                    transparent 20%,
                    rgba(255,0,128,0.15) ${30 + (y as number) * 0.2}%,
                    rgba(0,200,255,0.15) ${50 + (x as number) * 0.3}%,
                    rgba(100,255,0,0.15) ${70 + (y as number) * 0.2}%,
                    transparent 80%)`,
              ),
            }}
          />

          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              opacity: glareOpacity,
              background:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4), transparent 70%)",
            }}
          />

          <div className="absolute inset-0 border border-white/10 rounded-2xl" />

          <div className="relative z-10 h-full flex flex-col p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                NeonPay
              </span>
              <span className="text-3xl font-black text-white/10">
                {card.number}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h3
                className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-2`}
              >
                {card.title}
              </h3>
              <p className="text-sm text-white/60 mb-6">{card.subtitle}</p>
              <div className="space-y-2.5">
                {card.content.map((line, i) => (
                  <p
                    key={i}
                    className="text-sm text-white/80 flex items-start gap-2"
                  >
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${card.gradient} flex-shrink-0`}
                    />
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-[10px] text-white/30">Tap to flip</span>
              <div
                className={`w-8 h-1 rounded-full bg-gradient-to-r ${card.gradient}`}
              />
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 rounded-2xl overflow-hidden backface-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-30`}
          />
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl" />
          <div className="absolute inset-0 border border-white/10 rounded-2xl" />

          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
            <span className="text-6xl font-black text-white/5 mb-4">
              {card.number}
            </span>
            <h3
              className={`text-2xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-3`}
            >
              {card.title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              {card.subtitle}. This card is part of the NeonPay Series B pitch
              deck. Swipe left or right to browse all cards.
            </p>
            <div
              className={`w-16 h-1 rounded-full bg-gradient-to-r ${card.gradient} mt-6`}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function HolographicCards() {
  const reducedMotion = useReducedMotion();
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const next = useCallback(() => {
    if (flipped) {
      setFlipped(false);
      return;
    }
    setCurrentCard((prev) => Math.min(prev + 1, CARDS.length - 1));
  }, [flipped]);

  const prev = useCallback(() => {
    if (flipped) {
      setFlipped(false);
      return;
    }
    setCurrentCard((prev) => Math.max(prev - 1, 0));
  }, [flipped]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "f" || e.key === "Enter") {
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  return (
    <div className="w-full h-full min-h-screen bg-gray-950 flex flex-col items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
          style={{
            background: `radial-gradient(circle, ${CARDS[currentCard].gradient.includes("cyan") ? "#06b6d4" : "#8b5cf6"}, transparent)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative" style={{ perspective: 1200 }}>
          {CARDS.map((_, i) => {
            if (Math.abs(i - currentCard) > 2) return null;
            const offset = i - currentCard;
            return (
              <motion.div
                key={i}
                className="absolute top-0 left-0"
                style={{ transformStyle: "preserve-3d" }}
                animate={{
                  x: offset * 30,
                  y: Math.abs(offset) * -10,
                  scale: i === currentCard ? 1 : 0.9 - Math.abs(offset) * 0.05,
                  zIndex: CARDS.length - Math.abs(offset),
                  opacity:
                    i === currentCard ? 1 : 0.5 - Math.abs(offset) * 0.15,
                }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 300, damping: 30 }
                }
              >
                {i === currentCard ? (
                  <HoloCard
                    card={CARDS[i]}
                    isActive
                    onFlip={() => setFlipped((f) => !f)}
                    flipped={flipped}
                  />
                ) : (
                  <div className="w-[340px] h-[480px] sm:w-[380px] sm:h-[520px] rounded-2xl bg-gray-800/50 border border-white/5" />
                )}
              </motion.div>
            );
          })}

          <div className="invisible">
            <div className="w-[340px] h-[480px] sm:w-[380px] sm:h-[520px]" />
          </div>
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) next();
            else if (info.offset.x > 50) prev();
          }}
          className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
        />

        <div className="flex items-center gap-3 mt-8">
          {CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setFlipped(false);
                setCurrentCard(i);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentCard
                  ? "bg-white scale-150"
                  : "bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-white/30 mt-4 text-center">
          ←→ Navigate | F: Flip | Swipe to browse
        </p>
      </div>
    </div>
  );
}
