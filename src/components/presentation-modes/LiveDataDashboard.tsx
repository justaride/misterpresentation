import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RefreshCcw,
} from "lucide-react";

const MAX_POINTS = 60;
const BASE_TICK_MS = 1000;

const CHANNELS = ["Organic", "Paid", "Referral", "Direct", "Partners"] as const;
type Channel = (typeof CHANNELS)[number];

type LivePoint = {
  ts: number;
  activeUsers: number;
  signups: number;
  conversions: number;
  revenue: number;
  latencyP95: number;
  errorRate: number; // 0..1
  channels: Record<Channel, number>; // shares, 0..1
};

type FeedSeverity = "info" | "warn" | "danger";
type FeedEventType = "signup" | "purchase" | "incident" | "deploy";
type FeedEvent = {
  id: string;
  ts: number;
  type: FeedEventType;
  severity: FeedSeverity;
  message: string;
};

type SceneId = "pulse" | "acquisition" | "performance" | "revenue";
type Scene = {
  id: SceneId;
  title: string;
  subtitle: string;
  focus: string[];
};

const SCENES: Scene[] = [
  {
    id: "pulse",
    title: "Pulse",
    subtitle: "Who is here right now — and where the curve is heading.",
    focus: ["kpi-active", "chart-active"],
  },
  {
    id: "acquisition",
    title: "Acquisition",
    subtitle: "Signups and conversion — split by channel.",
    focus: ["kpi-signups", "kpi-conversion", "chart-bars", "chart-donut"],
  },
  {
    id: "performance",
    title: "Performance",
    subtitle: "Latency and errors — the cost of growth.",
    focus: ["kpi-latency", "kpi-errors", "panel-alerts", "panel-feed"],
  },
  {
    id: "revenue",
    title: "Revenue",
    subtitle: "Conversions turning into dollars (in real time).",
    focus: ["kpi-revenue", "kpi-conversion", "panel-feed"],
  },
];

const formatInt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const formatUsd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function normalizeShares(shares: Record<Channel, number>): Record<Channel, number> {
  const total = CHANNELS.reduce((sum, ch) => sum + shares[ch], 0);
  const safeTotal = total > 0 ? total : 1;
  const out = {} as Record<Channel, number>;
  for (const ch of CHANNELS) out[ch] = shares[ch] / safeTotal;
  return out;
}

function toPct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function deltaTone(delta: number, invert = false) {
  const effective = invert ? -delta : delta;
  if (effective > 0) return "text-emerald-300";
  if (effective < 0) return "text-rose-300";
  return "text-slate-300/80";
}

function panelClasses({
  focused,
  dimmed,
}: {
  focused: boolean;
  dimmed: boolean;
}) {
  return clsx(
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
    "shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] overflow-hidden",
    dimmed && "opacity-55",
    focused && "ring-2 ring-cyan-300/70 shadow-[0_0_0_1px_rgba(34,211,238,0.2)_inset]",
  );
}

function Sparkline({
  data,
  color,
  fill = false,
}: {
  data: number[];
  color: string;
  fill?: boolean;
}) {
  const width = 120;
  const height = 32;
  const padding = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((d, i) => {
      const x =
        padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
      const y =
        height -
        padding -
        ((d - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const dPath = points
    .split(" ")
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.replace(",", " ")}`)
    .join(" ");

  const areaPath = `${dPath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-8"
      role="img"
      aria-label="Trend sparkline"
    >
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && (
        <path d={areaPath} fill="url(#sparkFill)" stroke="none" opacity={0.9} />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LineChart({
  data,
  labelLeft,
}: {
  data: number[];
  labelLeft: string;
}) {
  const width = 720;
  const height = 240;
  const padding = 18;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((d, i) => {
    const x =
      padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y =
      height -
      padding -
      ((d - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  const yTicks = 4;
  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => i);

  return (
    <div className="p-5">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-mono text-slate-300/80">{labelLeft}</div>
        <div className="text-[11px] font-mono text-slate-400/80">
          last {data.length}s
        </div>
      </div>

      <div className="mt-3 h-60">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.9" />
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid */}
          {ticks.map((t) => {
            const y = padding + (t / yTicks) * (height - padding * 2);
            return (
              <line
                key={t}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* Area + Line */}
          <path d={area} fill="url(#areaGlow)" stroke="none" />
          <path
            d={line}
            fill="none"
            stroke="url(#lineGlow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#softGlow)"
          />

          {/* End dot */}
          {pts.length > 0 && (
            <circle
              cx={pts[pts.length - 1]?.x ?? 0}
              cy={pts[pts.length - 1]?.y ?? 0}
              r="4"
              fill="#22d3ee"
            />
          )}
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400/80">
        <div>min {formatInt.format(Math.round(min))}</div>
        <div>max {formatInt.format(Math.round(max))}</div>
      </div>
    </div>
  );
}

function BarChart({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const width = 560;
  const height = 220;
  const paddingX = 18;
  const paddingY = 22;

  const max = Math.max(...values, 1);
  const barGap = 10;
  const barWidth =
    (width - paddingX * 2 - barGap * (values.length - 1)) / values.length;

  return (
    <div className="p-5">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-mono text-slate-300/80">
          Signups by channel
        </div>
        <div className="text-[11px] font-mono text-slate-400/80">last 60s</div>
      </div>

      <div className="mt-3 h-56">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {values.map((v, i) => {
            const h = ((v / max) * (height - paddingY * 2)) | 0;
            const x = paddingX + i * (barWidth + barGap);
            const y = height - paddingY - h;
            return (
              <g key={labels[i] ?? i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  rx={10}
                  fill="url(#barGrad)"
                  stroke="rgba(34,197,94,0.55)"
                />
              </g>
            );
          })}

          {labels.map((label, i) => {
            const x = paddingX + i * (barWidth + barGap) + barWidth / 2;
            return (
              <text
                key={label}
                x={x}
                y={height - 6}
                textAnchor="middle"
                fontSize="11"
                fill="rgba(148,163,184,0.9)"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-mono text-slate-400/80">
        {labels.map((l, i) => (
          <div key={l} className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400/80" />
            <span>
              {l}: {formatInt.format(Math.round(values[i] ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutChart({
  shares,
}: {
  shares: Array<{ label: string; value: number; color: string }>;
}) {
  const size = 180;
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const total = shares.reduce((sum, s) => sum + s.value, 0) || 1;
  let acc = 0;

  return (
    <div className="p-5">
      <div className="flex items-baseline justify-between">
        <div className="text-sm font-mono text-slate-300/80">Traffic mix</div>
        <div className="text-[11px] font-mono text-slate-400/80">live</div>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="shrink-0"
          role="img"
          aria-label="Traffic mix donut chart"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          {shares.map((s) => {
            const dash = (s.value / total) * c;
            const offset = (acc / total) * c;
            acc += s.value;
            return (
              <circle
                key={s.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            );
          })}
        </svg>

        <div className="flex-1 space-y-2">
          {shares.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-[12px] font-mono text-slate-300/90">
                  {s.label}
                </span>
              </div>
              <div className="text-[12px] font-mono text-slate-400/90">
                {toPct(s.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  id,
  label,
  value,
  valueHint,
  deltaValue,
  deltaText,
  invertDeltaTone = false,
  sparkline,
  focused,
  dimmed,
}: {
  id: string;
  label: string;
  value: string;
  valueHint: string;
  deltaValue: number;
  deltaText: string;
  invertDeltaTone?: boolean;
  sparkline: number[];
  focused: boolean;
  dimmed: boolean;
}) {
  return (
    <div className={panelClasses({ focused, dimmed })} id={id}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400/90">
              {label}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="text-2xl font-semibold tracking-tight"
                >
                  {value}
                </motion.div>
              </AnimatePresence>
              <div className="text-[11px] font-mono text-slate-400/80">
                {valueHint}
              </div>
            </div>
          </div>

          <div
            className={clsx(
              "text-[11px] font-mono",
              deltaTone(deltaValue, invertDeltaTone),
            )}
          >
            {deltaValue === 0
              ? "—"
              : deltaValue > 0
                ? `▲ ${deltaText}`
                : `▼ ${deltaText}`}
          </div>
        </div>

        <div className="mt-3">
          <Sparkline data={sparkline} color="#22d3ee" fill />
        </div>
      </div>
    </div>
  );
}

function severityBadge(sev: FeedSeverity) {
  if (sev === "danger")
    return "bg-rose-500/15 text-rose-200 border-rose-500/30";
  if (sev === "warn")
    return "bg-amber-500/15 text-amber-200 border-amber-500/30";
  return "bg-emerald-500/15 text-emerald-200 border-emerald-500/30";
}

function formatClock(ts: number) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function buildInitialPoints(now: number): LivePoint[] {
  const baseChannels: Record<Channel, number> = {
    Organic: 0.42,
    Paid: 0.21,
    Referral: 0.14,
    Direct: 0.17,
    Partners: 0.06,
  };

  const points: LivePoint[] = [];
  let activeUsers = 820;
  let latency = 240;
  let errorRate = 0.012;
  let channels = normalizeShares(baseChannels);

  for (let i = MAX_POINTS - 1; i >= 0; i -= 1) {
    const ts = now - i * BASE_TICK_MS;

    activeUsers = clamp(
      Math.round(activeUsers + (Math.random() - 0.48) * 35),
      120,
      2200,
    );

    const signups = clamp(
      Math.round(activeUsers / 120 + Math.random() * 8),
      0,
      120,
    );
    const conversions = clamp(
      Math.round(signups * (0.18 + (Math.random() - 0.5) * 0.08)),
      0,
      signups,
    );
    const aov = 49 + Math.round(Math.random() * 70);
    const revenue = conversions * aov;

    latency = clamp(latency + (Math.random() - 0.5) * 30, 160, 720);
    const spike = Math.random() < 0.04 ? 180 + Math.random() * 220 : 0;
    latency = clamp(latency + spike, 160, 940);

    errorRate = clamp(
      0.008 +
        (latency > 460 ? 0.02 : 0) +
        Math.random() * 0.01 +
        (Math.random() < 0.02 ? 0.03 : 0),
      0.002,
      0.14,
    );

    const nextShares = { ...channels };
    for (const ch of CHANNELS) {
      nextShares[ch] = clamp(nextShares[ch] + (Math.random() - 0.5) * 0.02, 0.03, 0.7);
    }
    channels = normalizeShares(nextShares);

    points.push({
      ts,
      activeUsers,
      signups,
      conversions,
      revenue,
      latencyP95: Math.round(latency),
      errorRate,
      channels,
    });
  }

  return points;
}

function randomFrom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

const NAMES = [
  "Ava",
  "Noah",
  "Mia",
  "Ethan",
  "Sofia",
  "Liam",
  "Zoe",
  "Lucas",
  "Priya",
  "Hiro",
  "Sam",
  "Fatima",
] as const;

const PLANS = ["Starter", "Pro", "Team", "Enterprise"] as const;

function generateEvents({
  now,
  point,
  idRef,
}: {
  now: number;
  point: LivePoint;
  idRef: React.MutableRefObject<number>;
}): FeedEvent[] {
  const next: FeedEvent[] = [];
  const mkId = () => `evt_${(idRef.current += 1)}`;

  const conversionRate = point.signups > 0 ? point.conversions / point.signups : 0;

  if (point.signups > 0 && Math.random() < 0.35) {
    next.push({
      id: mkId(),
      ts: now,
      type: "signup",
      severity: "info",
      message: `${randomFrom(NAMES)} started a ${randomFrom(PLANS)} trial`,
    });
  }

  if (point.conversions > 0 && Math.random() < 0.22) {
    const sale = 39 + Math.round(Math.random() * 220);
    next.push({
      id: mkId(),
      ts: now,
      type: "purchase",
      severity: "info",
      message: `Conversion: ${formatUsd.format(sale)} paid`,
    });
  }

  if ((point.errorRate > 0.05 || point.latencyP95 > 520) && Math.random() < 0.3) {
    next.push({
      id: mkId(),
      ts: now,
      type: "incident",
      severity: point.errorRate > 0.08 ? "danger" : "warn",
      message:
        point.errorRate > 0.08
          ? "Spike in 5xx responses detected"
          : "Latency creeping above SLO threshold",
    });
  }

  if (conversionRate < 0.12 && point.signups > 10 && Math.random() < 0.08) {
    next.push({
      id: mkId(),
      ts: now,
      type: "incident",
      severity: "warn",
      message: "Conversion dipped — check checkout funnel",
    });
  }

  if (Math.random() < 0.02) {
    const version = `v${1 + Math.floor(Math.random() * 3)}.${Math.floor(
      Math.random() * 10,
    )}.${Math.floor(Math.random() * 20)}`;
    next.push({
      id: mkId(),
      ts: now,
      type: "deploy",
      severity: "info",
      message: `Deployed ${version} to production`,
    });
  }

  return next;
}

export function LiveDataDashboard() {
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState<1 | 2 | 5>(1);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [focusMode, setFocusMode] = useState(true);

  const eventIdRef = useRef(0);
  const [points, setPoints] = useState<LivePoint[]>(() =>
    buildInitialPoints(Date.now()),
  );
  const [feed, setFeed] = useState<FeedEvent[]>(() => []);

  const scene = SCENES[sceneIndex] ?? SCENES[0];

  const isFocused = useCallback(
    (panelId: string) => (scene?.focus ?? []).includes(panelId),
    [scene],
  );

  const isDimmed = useCallback(
    (panelId: string) => focusMode && !isFocused(panelId),
    [focusMode, isFocused],
  );

  const reset = useCallback(() => {
    const now = Date.now();
    eventIdRef.current = 0;
    setPoints(buildInitialPoints(now));
    setFeed([]);
  }, []);

  useEffect(() => {
    if (!running) return;

    const tickMs = Math.round(BASE_TICK_MS / speed);
    const interval = window.setInterval(() => {
      const now = Date.now();
      setPoints((prevPoints) => {
        const last = prevPoints[prevPoints.length - 1];
        const prevChannels = last?.channels ?? {
          Organic: 0.4,
          Paid: 0.22,
          Referral: 0.14,
          Direct: 0.18,
          Partners: 0.06,
        };

        const drifted = { ...prevChannels } as Record<Channel, number>;
        for (const ch of CHANNELS) {
          drifted[ch] = clamp(drifted[ch] + (Math.random() - 0.5) * 0.018, 0.03, 0.72);
        }
        const channels = normalizeShares(drifted);

        const activeBase = last?.activeUsers ?? 800;
        const activeUsers = clamp(
          Math.round(activeBase + (Math.random() - 0.48) * 42),
          120,
          2400,
        );

        const signups = clamp(
          Math.round(activeUsers / 118 + Math.random() * 9),
          0,
          160,
        );
        const conversions = clamp(
          Math.round(signups * (0.17 + (Math.random() - 0.5) * 0.1)),
          0,
          signups,
        );

        const aov = 49 + Math.round(Math.random() * 80);
        const revenue = conversions * aov;

        const prevLatency = last?.latencyP95 ?? 260;
        const spike = Math.random() < 0.05 ? 170 + Math.random() * 260 : 0;
        const latencyP95 = Math.round(
          clamp(prevLatency + (Math.random() - 0.5) * 32 + spike, 150, 950),
        );

        const errorRate = clamp(
          0.007 +
            Math.random() * 0.012 +
            (latencyP95 > 500 ? 0.02 : 0) +
            (Math.random() < 0.02 ? 0.03 : 0),
          0.002,
          0.16,
        );

        const nextPoint: LivePoint = {
          ts: now,
          activeUsers,
          signups,
          conversions,
          revenue,
          latencyP95,
          errorRate,
          channels,
        };

        setFeed((prevFeed) => {
          const added = generateEvents({
            now,
            point: nextPoint,
            idRef: eventIdRef,
          });
          if (added.length === 0) return prevFeed;
          const nextFeed = [...added, ...prevFeed];
          return nextFeed.slice(0, 22);
        });

        const nextPoints = [...prevPoints, nextPoint];
        return nextPoints.length > MAX_POINTS
          ? nextPoints.slice(nextPoints.length - MAX_POINTS)
          : nextPoints;
      });
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [running, speed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setRunning((r) => !r);
      }
      if (e.key === "ArrowRight") {
        setSceneIndex((s) => Math.min(s + 1, SCENES.length - 1));
      }
      if (e.key === "ArrowLeft") {
        setSceneIndex((s) => Math.max(s - 1, 0));
      }
      if (e.key.toLowerCase() === "r") reset();
      if (e.key.toLowerCase() === "f") setFocusMode((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reset]);

  const latest = points[points.length - 1];
  const prev = points[points.length - 2];

  const series = useMemo(() => {
    const active = points.map((p) => p.activeUsers);
    const signups = points.map((p) => p.signups);
    const revenue = points.map((p) => p.revenue);
    const latency = points.map((p) => p.latencyP95);
    const errors = points.map((p) => p.errorRate);
    const conversion = points.map((p) =>
      p.signups > 0 ? p.conversions / p.signups : 0,
    );
    return { active, signups, revenue, latency, errors, conversion };
  }, [points]);

  const kpis = useMemo(() => {
    const activeUsers = latest?.activeUsers ?? 0;
    const signups = latest?.signups ?? 0;
    const conversions = latest?.conversions ?? 0;
    const conversionRate = signups > 0 ? conversions / signups : 0;
    const revenue = latest?.revenue ?? 0;
    const latency = latest?.latencyP95 ?? 0;
    const errorRate = latest?.errorRate ?? 0;

    return {
      activeUsers,
      signups,
      conversionRate,
      revenue,
      latency,
      errorRate,
    };
  }, [latest]);

  const deltas = useMemo(() => {
    const active = (latest?.activeUsers ?? 0) - (prev?.activeUsers ?? 0);
    const signups = (latest?.signups ?? 0) - (prev?.signups ?? 0);
    const revenue = (latest?.revenue ?? 0) - (prev?.revenue ?? 0);
    const latency = (latest?.latencyP95 ?? 0) - (prev?.latencyP95 ?? 0);
    const errors =
      ((latest?.errorRate ?? 0) - (prev?.errorRate ?? 0)) * 100;

    const prevConv =
      (prev?.signups ?? 0) > 0
        ? (prev?.conversions ?? 0) / Math.max(1, prev?.signups ?? 0)
        : 0;
    const latestConv =
      (latest?.signups ?? 0) > 0
        ? (latest?.conversions ?? 0) / Math.max(1, latest?.signups ?? 0)
        : 0;
    const conversion = (latestConv - prevConv) * 100;

    return { active, signups, revenue, latency, errors, conversion };
  }, [latest, prev]);

  const signupsByChannel = useMemo(() => {
    const sums: Record<Channel, number> = {
      Organic: 0,
      Paid: 0,
      Referral: 0,
      Direct: 0,
      Partners: 0,
    };

    for (const p of points) {
      for (const ch of CHANNELS) {
        sums[ch] += p.signups * p.channels[ch];
      }
    }
    return CHANNELS.map((ch) => Math.round(sums[ch]));
  }, [points]);

  const trafficShares = useMemo(() => {
    const s = latest?.channels;
    const safe = s ?? {
      Organic: 0.4,
      Paid: 0.22,
      Referral: 0.14,
      Direct: 0.18,
      Partners: 0.06,
    };
    const colors: Record<Channel, string> = {
      Organic: "#22d3ee",
      Paid: "#a78bfa",
      Referral: "#22c55e",
      Direct: "#f59e0b",
      Partners: "#fb7185",
    };
    return CHANNELS.map((ch) => ({
      label: ch,
      value: safe[ch],
      color: colors[ch],
    }));
  }, [latest]);

  const alerts = useMemo(() => {
    const list: Array<{ severity: FeedSeverity; title: string; detail: string }> = [];
    const latency = kpis.latency;
    const errorRate = kpis.errorRate;
    const conversion = kpis.conversionRate;

    if (errorRate > 0.08) {
      list.push({
        severity: "danger",
        title: "Incident: elevated 5xx rate",
        detail: `Error rate is ${toPct(errorRate)} (threshold 8.0%).`,
      });
    } else if (errorRate > 0.045) {
      list.push({
        severity: "warn",
        title: "Warning: error rate trending up",
        detail: `Error rate is ${toPct(errorRate)} (watch threshold 4.5%).`,
      });
    }

    if (latency > 620) {
      list.push({
        severity: "danger",
        title: "Latency breach",
        detail: `p95 is ${formatInt.format(latency)}ms (SLO 450ms).`,
      });
    } else if (latency > 450) {
      list.push({
        severity: "warn",
        title: "Latency above SLO",
        detail: `p95 is ${formatInt.format(latency)}ms (SLO 450ms).`,
      });
    }

    if (conversion > 0 && conversion < 0.12) {
      list.push({
        severity: "warn",
        title: "Conversion dip",
        detail: `Conversion is ${toPct(conversion)} (target 12–18%).`,
      });
    }

    if (list.length === 0) {
      list.push({
        severity: "info",
        title: "All systems nominal",
        detail: "No active alerts. Keep an eye on latency and conversion.",
      });
    }
    return list.slice(0, 3);
  }, [kpis.conversionRate, kpis.errorRate, kpis.latency]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(34,211,238,0.10),transparent_55%),radial-gradient(900px_circle_at_90%_10%,rgba(167,139,250,0.10),transparent_52%),radial-gradient(900px_circle_at_50%_100%,rgba(34,197,94,0.08),transparent_55%)]" />
      <div className="absolute inset-0 opacity-35 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <header className="px-6 py-5 border-b border-white/10 bg-slate-950/40 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(34,197,94,0.65)]" />
                <h2 className="font-display uppercase tracking-wider text-xl">
                  Live Data Dashboard
                </h2>
                <span className="text-[11px] font-mono text-slate-400/90">
                  {running ? "streaming" : "paused"} • {speed}×
                </span>
              </div>
              <p className="text-sm text-slate-300/70 max-w-2xl">
                Operational KPI snapshot with simulated real-time updates. Use{" "}
                <span className="font-mono text-slate-200/90">←</span>{" "}
                <span className="font-mono text-slate-200/90">→</span> to step
                scenes, <span className="font-mono text-slate-200/90">Space</span>{" "}
                to pause, <span className="font-mono text-slate-200/90">R</span>{" "}
                to reset, <span className="font-mono text-slate-200/90">F</span>{" "}
                to toggle focus.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className={panelClasses({ focused: false, dimmed: false })}>
                <div className="px-3 py-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRunning((r) => !r)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    {running ? <Pause size={16} /> : <Play size={16} />}
                    <span className="text-[12px] font-mono">
                      {running ? "Pause" : "Play"}
                    </span>
                  </button>

                  <div className="h-8 w-px bg-white/10" />

                  <div className="flex items-center gap-1">
                    {[1, 2, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSpeed(s as 1 | 2 | 5)}
                        className={clsx(
                          "px-2.5 py-2 rounded-lg border text-[12px] font-mono transition-colors",
                          speed === s
                            ? "bg-cyan-300/15 border-cyan-300/30 text-cyan-100"
                            : "bg-white/5 border-white/10 text-slate-200/80 hover:bg-white/10",
                        )}
                      >
                        {s}×
                      </button>
                    ))}
                  </div>

                  <div className="h-8 w-px bg-white/10" />

                  <button
                    type="button"
                    onClick={() => setFocusMode((v) => !v)}
                    className={clsx(
                      "px-3 py-2 rounded-xl border text-[12px] font-mono transition-colors",
                      focusMode
                        ? "bg-violet-300/15 border-violet-300/30 text-violet-100"
                        : "bg-white/5 border-white/10 text-slate-200/80 hover:bg-white/10",
                    )}
                  >
                    Focus {focusMode ? "On" : "Off"}
                  </button>

                  <div className="h-8 w-px bg-white/10" />

                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <RefreshCcw size={16} />
                    <span className="text-[12px] font-mono">Reset</span>
                  </button>
                </div>
              </div>

              <div className={panelClasses({ focused: true, dimmed: false })}>
                <div className="px-4 py-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSceneIndex((s) => Math.max(0, s - 1))}
                    disabled={sceneIndex === 0}
                    className={clsx(
                      "p-2 rounded-lg border transition-colors",
                      sceneIndex === 0
                        ? "opacity-30 cursor-not-allowed border-white/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    )}
                    aria-label="Previous scene"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="min-w-0">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-100/80">
                      Scene {sceneIndex + 1} / {SCENES.length}
                    </div>
                    <div className="text-sm font-semibold truncate">
                      {scene.title}
                    </div>
                    <div className="text-[12px] text-slate-300/70 truncate">
                      {scene.subtitle}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setSceneIndex((s) => Math.min(SCENES.length - 1, s + 1))
                    }
                    disabled={sceneIndex === SCENES.length - 1}
                    className={clsx(
                      "p-2 rounded-lg border transition-colors",
                      sceneIndex === SCENES.length - 1
                        ? "opacity-30 cursor-not-allowed border-white/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    )}
                    aria-label="Next scene"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-auto px-6 py-6 space-y-6">
          {/* KPI row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
            <KpiCard
              id="kpi-active"
              label="Active users"
              value={formatInt.format(kpis.activeUsers)}
              valueHint="now"
              deltaValue={deltas.active}
              deltaText={formatInt.format(Math.abs(deltas.active))}
              sparkline={series.active}
              focused={isFocused("kpi-active")}
              dimmed={isDimmed("kpi-active")}
            />
            <KpiCard
              id="kpi-signups"
              label="Signups"
              value={formatInt.format(kpis.signups)}
              valueHint="per tick"
              deltaValue={deltas.signups}
              deltaText={formatInt.format(Math.abs(deltas.signups))}
              sparkline={series.signups}
              focused={isFocused("kpi-signups")}
              dimmed={isDimmed("kpi-signups")}
            />
            <KpiCard
              id="kpi-conversion"
              label="Conversion"
              value={toPct(kpis.conversionRate)}
              valueHint="signups → paid"
              deltaValue={deltas.conversion}
              deltaText={`${Math.abs(deltas.conversion).toFixed(1)}pp`}
              sparkline={series.conversion}
              focused={isFocused("kpi-conversion")}
              dimmed={isDimmed("kpi-conversion")}
            />
            <KpiCard
              id="kpi-revenue"
              label="Revenue"
              value={formatUsd.format(kpis.revenue)}
              valueHint="per tick"
              deltaValue={deltas.revenue}
              deltaText={formatUsd.format(Math.abs(deltas.revenue))}
              sparkline={series.revenue}
              focused={isFocused("kpi-revenue")}
              dimmed={isDimmed("kpi-revenue")}
            />
            <KpiCard
              id="kpi-latency"
              label="p95 latency"
              value={`${formatInt.format(kpis.latency)}ms`}
              valueHint="API"
              deltaValue={deltas.latency}
              deltaText={`${formatInt.format(Math.abs(deltas.latency))}ms`}
              invertDeltaTone
              sparkline={series.latency}
              focused={isFocused("kpi-latency")}
              dimmed={isDimmed("kpi-latency")}
            />
            <KpiCard
              id="kpi-errors"
              label="Error rate"
              value={toPct(kpis.errorRate)}
              valueHint="5xx"
              deltaValue={deltas.errors}
              deltaText={`${Math.abs(deltas.errors).toFixed(1)}pp`}
              invertDeltaTone
              sparkline={series.errors.map((v) => v * 100)}
              focused={isFocused("kpi-errors")}
              dimmed={isDimmed("kpi-errors")}
            />
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div
              className={panelClasses({
                focused: isFocused("chart-active"),
                dimmed: isDimmed("chart-active"),
              })}
            >
              <LineChart data={series.active} labelLeft="Active users" />
            </div>

            <div className="grid grid-rows-2 gap-4">
              <div
                className={panelClasses({
                  focused: isFocused("chart-donut"),
                  dimmed: isDimmed("chart-donut"),
                })}
              >
                <DonutChart shares={trafficShares} />
              </div>
              <div
                className={panelClasses({
                  focused: isFocused("chart-bars"),
                  dimmed: isDimmed("chart-bars"),
                })}
              >
                <BarChart labels={[...CHANNELS]} values={signupsByChannel} />
              </div>
            </div>

            <div className="grid grid-rows-2 gap-4">
              <div
                className={panelClasses({
                  focused: isFocused("panel-alerts"),
                  dimmed: isDimmed("panel-alerts"),
                })}
              >
                <div className="p-5">
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm font-mono text-slate-300/80">
                      Alerts
                    </div>
                    <div className="text-[11px] font-mono text-slate-400/80">
                      live rules
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {alerts.map((a) => (
                      <div
                        key={a.title}
                        className={clsx(
                          "rounded-xl border px-4 py-3",
                          severityBadge(a.severity),
                        )}
                      >
                        <div className="text-[12px] font-mono font-bold uppercase tracking-wider">
                          {a.title}
                        </div>
                        <div className="mt-1 text-sm text-slate-100/80">
                          {a.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={panelClasses({
                  focused: isFocused("panel-feed"),
                  dimmed: isDimmed("panel-feed"),
                })}
              >
                <div className="p-5">
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm font-mono text-slate-300/80">
                      Activity feed
                    </div>
                    <div className="text-[11px] font-mono text-slate-400/80">
                      {latest ? formatClock(latest.ts) : "—"}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {feed.length === 0 ? (
                      <div className="text-sm text-slate-300/70">
                        Waiting for events…
                      </div>
                    ) : (
                      feed.map((e) => (
                        <div
                          key={e.id}
                          className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span
                                className={clsx(
                                  "inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase tracking-wider",
                                  severityBadge(e.severity),
                                )}
                              >
                                {e.type}
                              </span>
                              <span className="text-[11px] font-mono text-slate-400/80">
                                {formatClock(e.ts)}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-slate-100/85 truncate">
                              {e.message}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
