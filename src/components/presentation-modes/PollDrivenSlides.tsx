import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import { Copy, RotateCcw, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Role = "host" | "audience";

type Poll = {
  id: string;
  title: string;
  subtitle: string;
  options: string[];
};

type VotersByPoll = Record<string, Record<string, number>>;
type PresenceByClient = Record<string, { ts: number; role: Role }>;

type PollMessage =
  | { type: "presence"; from: string; ts: number; role: Role }
  | { type: "nav"; from: string; slide: number; ts: number }
  | { type: "vote"; from: string; pollId: string; option: number; ts: number }
  | { type: "reset"; from: string; ts: number }
  | {
      type: "sync";
      from: string;
      ts: number;
      slide: number;
      votersByPoll: VotersByPoll;
    };

const POLLS: Poll[] = [
  {
    id: "next-mode",
    title: "What should we ship next?",
    subtitle: "Vote live. Open another tab as the audience.",
    options: [
      "Kinetic Typography",
      "GSAP Showreel",
      "Branching Narrative",
      "3D Globe Explorer",
    ],
  },
  {
    id: "focus",
    title: "What matters most in a web presentation?",
    subtitle: "Pick one. The room decides the shape of the story.",
    options: ["Clarity", "Emotion", "Interactivity", "Speed"],
  },
  {
    id: "format",
    title: "Where should the story live?",
    subtitle: "Slides are just one medium. Choose the canvas.",
    options: ["Scroll", "Slides", "Both", "It depends"],
  },
  {
    id: "spice",
    title: "How spicy should the motion be?",
    subtitle: "Honest answers only.",
    options: ["Subtle", "Crisp", "Bold", "Absurd"],
  },
];

function generateSessionCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function safeClientId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `c_${Math.random().toString(16).slice(2)}`
  );
}

function pct(value: number) {
  return `${Math.round(value * 100)}%`;
}

function panel(focused: boolean) {
  return clsx(
    "rounded-2xl border bg-white/5 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]",
    focused ? "border-cyan-300/30 ring-2 ring-cyan-300/30" : "border-white/10",
  );
}

function makeAudienceLink({
  base,
  session,
}: {
  base: string;
  session: string;
}) {
  const url = new URL(base);
  url.searchParams.set("session", session);
  url.searchParams.set("role", "audience");
  return url.toString();
}

export function PollDrivenSlides() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSession = searchParams.get("session");
  const urlRole = searchParams.get("role");

  const [session, setSession] = useState(() => urlSession ?? generateSessionCode());
  const [role, setRole] = useState<Role>(() =>
    urlRole === "audience" ? "audience" : "host",
  );

  const clientIdRef = useRef<string>(safeClientId());
  const channelRef = useRef<BroadcastChannel | null>(null);
  const lastSyncRef = useRef<number>(0);

  const slideRef = useRef<number>(0);
  const votersRef = useRef<VotersByPoll>({});

  const [clock, setClock] = useState(() => Date.now());
  const [slide, setSlide] = useState(0);
  const [votersByPoll, setVotersByPoll] = useState<VotersByPoll>({});
  const [presenceByClient, setPresenceByClient] = useState<PresenceByClient>({});
  const [copied, setCopied] = useState(false);

  const poll = POLLS[slide] ?? POLLS[0];
  const supportsBroadcast = typeof BroadcastChannel !== "undefined";

  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  useEffect(() => {
    votersRef.current = votersByPoll;
  }, [votersByPoll]);

  useEffect(() => {
    const interval = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const sessionFromUrl = searchParams.get("session");
    if (sessionFromUrl && sessionFromUrl !== session) setSession(sessionFromUrl);
    const roleFromUrl = searchParams.get("role");
    const nextRole: Role = roleFromUrl === "audience" ? "audience" : "host";
    if (nextRole !== role) setRole(nextRole);
  }, [role, searchParams, session]);

  useEffect(() => {
    const sessionFromUrl = searchParams.get("session");
    if (sessionFromUrl) return;
    const next = new URLSearchParams(searchParams);
    next.set("session", session);
    if (!next.get("role")) next.set("role", role);
    setSearchParams(next, { replace: true });
  }, [role, searchParams, session, setSearchParams]);

  useEffect(() => {
    if (!supportsBroadcast) return;
    const ch = new BroadcastChannel(`mister-presentations:poll:${session}`);
    channelRef.current = ch;

    const applyVote = ({ from, pollId, option }: { from: string; pollId: string; option: number }) => {
      setVotersByPoll((prev) => {
        const current = prev[pollId] ?? {};
        if (current[from] === option) return prev;
        return { ...prev, [pollId]: { ...current, [from]: option } };
      });
    };

    const applyPresence = ({ from, ts, role: r }: { from: string; ts: number; role: Role }) => {
      setPresenceByClient((prev) => ({
        ...prev,
        [from]: { ts, role: r },
      }));
    };

    ch.onmessage = (evt) => {
      const msg = evt.data as PollMessage;
      if (!msg || typeof msg !== "object") return;
      if ((msg as { from?: string }).from === clientIdRef.current) return;

      if (msg.type === "presence") applyPresence(msg);
      if (msg.type === "vote") applyVote(msg);
      if (msg.type === "nav") {
        setSlide(clampSlide(msg.slide));
      }
      if (msg.type === "reset") {
        setVotersByPoll({});
      }
      if (msg.type === "sync") {
        if (msg.ts <= lastSyncRef.current) return;
        lastSyncRef.current = msg.ts;
        setSlide(clampSlide(msg.slide));
        setVotersByPoll(msg.votersByPoll ?? {});
      }
    };

    return () => {
      ch.close();
      channelRef.current = null;
    };
  }, [session, supportsBroadcast]);

  const send = useCallback((message: PollMessage) => {
    if (!supportsBroadcast) return;
    const ch = channelRef.current;
    if (!ch) return;
    ch.postMessage(message);
  }, [supportsBroadcast]);

  const activeParticipants = useMemo(() => {
    const now = clock;
    const aliveWindowMs = 6500;
    const merged: PresenceByClient = {
      ...presenceByClient,
      [clientIdRef.current]: { ts: now, role },
    };
    const entries = Object.entries(merged).filter(
      ([, p]) => now - p.ts < aliveWindowMs,
    );
    return { total: entries.length, hosts: entries.filter(([, p]) => p.role === "host").length };
  }, [clock, presenceByClient, role]);

  useEffect(() => {
    setPresenceByClient((prev) => ({
      ...prev,
      [clientIdRef.current]: { ts: Date.now(), role },
    }));
  }, [role]);

  useEffect(() => {
    const pulse = () =>
      send({
        type: "presence",
        from: clientIdRef.current,
        ts: Date.now(),
        role,
      });
    pulse();
    const id = window.setInterval(pulse, 2000);
    return () => window.clearInterval(id);
  }, [role, send]);

  useEffect(() => {
    if (role !== "host") return;
    const id = window.setInterval(() => {
      send({
        type: "sync",
        from: clientIdRef.current,
        ts: Date.now(),
        slide: slideRef.current,
        votersByPoll: votersRef.current,
      });
    }, 2000);
    return () => window.clearInterval(id);
  }, [role, send]);

  const clampSlide = useCallback((n: number) => {
    return Math.max(0, Math.min(POLLS.length - 1, n));
  }, []);

  const go = useCallback((next: number) => {
    const clamped = clampSlide(next);
    setSlide(clamped);
    if (role === "host") {
      send({
        type: "nav",
        from: clientIdRef.current,
        ts: Date.now(),
        slide: clamped,
      });
    }
  }, [clampSlide, role, send]);

  const reset = useCallback(() => {
    setVotersByPoll({});
    if (role === "host") {
      send({ type: "reset", from: clientIdRef.current, ts: Date.now() });
    }
  }, [role, send]);

  const castVote = useCallback((option: number) => {
    const pollId = poll.id;
    setVotersByPoll((prev) => {
      const current = prev[pollId] ?? {};
      return { ...prev, [pollId]: { ...current, [clientIdRef.current]: option } };
    });
    send({
      type: "vote",
      from: clientIdRef.current,
      ts: Date.now(),
      pollId,
      option,
    });
  }, [poll.id, send]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && role === "host") go(slide + 1);
      if (e.key === "ArrowLeft" && role === "host") go(slide - 1);
      if (e.key.toLowerCase() === "r" && role === "host") reset();

      const num = Number.parseInt(e.key, 10);
      if (!Number.isNaN(num)) {
        const idx = num - 1;
        if (idx >= 0 && idx < poll.options.length) castVote(idx);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [castVote, go, poll.options.length, reset, role, slide]);

  const myVote = votersByPoll[poll.id]?.[clientIdRef.current];

  const results = useMemo(() => {
    const votes = votersByPoll[poll.id] ?? {};
    const counts = poll.options.map(() => 0);
    for (const v of Object.values(votes)) {
      const idx = typeof v === "number" ? v : -1;
      if (idx >= 0 && idx < counts.length) counts[idx] += 1;
    }
    const total = Object.keys(votes).length;
    const max = Math.max(...counts, 0);
    return { counts, total, max };
  }, [poll.id, poll.options, votersByPoll]);

  const audienceLink = useMemo(() => {
    const base = window.location.href;
    return makeAudienceLink({ base, session });
  }, [session]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(audienceLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }, [audienceLink]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(34,211,238,0.10),transparent_58%),radial-gradient(900px_circle_at_90%_20%,rgba(167,139,250,0.10),transparent_58%),radial-gradient(900px_circle_at_50%_100%,rgba(34,197,94,0.08),transparent_55%)]" />
      <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative z-10 h-full flex flex-col">
        <header className="px-6 py-5 border-b border-white/10 bg-slate-950/40 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
                <h2 className="font-display uppercase tracking-wider text-xl">
                  Poll-Driven Slides
                </h2>
                <span className="text-[11px] font-mono text-slate-400/90">
                  session {session} • {role}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] font-mono text-slate-300/70">
                <span className="inline-flex items-center gap-2">
                  <Users size={14} className="text-slate-300/70" />
                  {activeParticipants.total} online
                </span>
                {!supportsBroadcast && (
                  <span className="text-amber-200/80">
                    BroadcastChannel unsupported — single-tab demo only
                  </span>
                )}
                <span className="text-slate-300/70">
                  Vote with keys{" "}
                  <span className="text-slate-100/90">1</span>–
                  <span className="text-slate-100/90">{poll.options.length}</span>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className={panel(true)}>
                <div className="px-3 py-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextRole: Role = role === "host" ? "audience" : "host";
                      const next = new URLSearchParams(searchParams);
                      next.set("role", nextRole);
                      next.set("session", session);
                      setSearchParams(next, { replace: true });
                    }}
                    className={clsx(
                      "px-3 py-2 rounded-xl border text-[12px] font-mono transition-colors",
                      role === "host"
                        ? "bg-violet-300/15 border-violet-300/30 text-violet-100"
                        : "bg-emerald-300/15 border-emerald-300/30 text-emerald-100",
                    )}
                    aria-label="Toggle role"
                  >
                    {role === "host" ? "Host" : "Audience"}
                  </button>

                  <div className="h-8 w-px bg-white/10" />

                  <button
                    type="button"
                    onClick={onCopy}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    aria-label="Copy audience link"
                  >
                    <Copy size={16} />
                    <span className="text-[12px] font-mono">
                      {copied ? "Copied" : "Audience link"}
                    </span>
                  </button>

                  <div className="h-8 w-px bg-white/10" />

                  <button
                    type="button"
                    onClick={reset}
                    disabled={role !== "host"}
                    className={clsx(
                      "inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors",
                      role !== "host"
                        ? "opacity-35 cursor-not-allowed bg-white/5 border-white/10"
                        : "bg-white/5 hover:bg-white/10 border-white/10",
                    )}
                    aria-label="Reset votes"
                  >
                    <RotateCcw size={16} />
                    <span className="text-[12px] font-mono">Reset</span>
                  </button>
                </div>
              </div>

              <div className={panel(true)}>
                <div className="px-4 py-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => go(slide - 1)}
                    disabled={role !== "host" || slide === 0}
                    className={clsx(
                      "p-2 rounded-lg border transition-colors",
                      role !== "host" || slide === 0
                        ? "opacity-30 cursor-not-allowed border-white/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    )}
                    aria-label="Previous slide"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <div className="min-w-0">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-100/80">
                      Slide {slide + 1} / {POLLS.length}
                    </div>
                    <div className="text-sm font-semibold truncate">
                      {poll.title}
                    </div>
                    <div className="text-[12px] text-slate-300/70 truncate">
                      {poll.subtitle}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => go(slide + 1)}
                    disabled={role !== "host" || slide === POLLS.length - 1}
                    className={clsx(
                      "p-2 rounded-lg border transition-colors",
                      role !== "host" || slide === POLLS.length - 1
                        ? "opacity-30 cursor-not-allowed border-white/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10",
                    )}
                    aria-label="Next slide"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-6">
            <div className={panel(true)}>
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-300/20 bg-cyan-300/10 text-cyan-100/90 text-[11px] font-mono uppercase tracking-widest">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
                        Live poll
                      </div>
                      <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight leading-[0.95]">
                        {poll.title}
                      </h1>
                      <p className="text-slate-200/70 max-w-2xl">
                        {poll.subtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {poll.options.map((opt, i) => {
                        const selected = myVote === i;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => castVote(i)}
                            className={clsx(
                              "group text-left rounded-2xl border px-4 py-4 transition-all",
                              selected
                                ? "bg-cyan-300/15 border-cyan-300/30 shadow-[0_0_0_1px_rgba(34,211,238,0.20)_inset]"
                                : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20",
                            )}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <div
                                  className={clsx(
                                    "mt-0.5 shrink-0 h-8 w-8 rounded-xl border flex items-center justify-center font-mono text-sm",
                                    selected
                                      ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100"
                                      : "border-white/10 bg-white/5 text-slate-200/80",
                                  )}
                                  aria-hidden="true"
                                >
                                  {i + 1}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-lg font-semibold tracking-tight truncate">
                                    {opt}
                                  </div>
                                  <div className="text-[12px] font-mono text-slate-400/80">
                                    press {i + 1}
                                  </div>
                                </div>
                              </div>

                              <div
                                className={clsx(
                                  "shrink-0 inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px] font-mono uppercase tracking-wider",
                                  selected
                                    ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-100"
                                    : "border-white/10 bg-white/5 text-slate-200/60",
                                )}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
                                vote
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-6">
              <div className={panel(true)}>
                <div className="p-6">
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm font-mono text-slate-300/80">
                      Results
                    </div>
                    <div className="text-[11px] font-mono text-slate-400/80">
                      {results.total} votes
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {poll.options.map((opt, i) => {
                      const count = results.counts[i] ?? 0;
                      const share = results.total > 0 ? count / results.total : 0;
                      const winner = results.max > 0 && count === results.max;

                      return (
                        <div key={opt} className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={clsx(
                                    "inline-flex items-center justify-center h-6 w-6 rounded-lg border font-mono text-[11px]",
                                    winner
                                      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                                      : "border-white/10 bg-white/5 text-slate-200/70",
                                  )}
                                >
                                  {i + 1}
                                </span>
                                <span className="text-sm font-semibold truncate">
                                  {opt}
                                </span>
                                {winner && results.total > 0 && (
                                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-200/80">
                                    leading
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="shrink-0 text-[12px] font-mono text-slate-300/80">
                              {count} • {pct(share)}
                            </div>
                          </div>

                          <div className="h-3 rounded-full bg-white/8 overflow-hidden border border-white/10">
                            <motion.div
                              initial={false}
                              animate={{ width: `${Math.round(share * 100)}%` }}
                              transition={{ type: "spring", stiffness: 240, damping: 28 }}
                              className={clsx(
                                "h-full rounded-full",
                                winner
                                  ? "bg-gradient-to-r from-emerald-300/90 to-cyan-300/80"
                                  : "bg-white/20",
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={panel(true)}>
                <div className="p-6">
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm font-mono text-slate-300/80">
                      Presenter note
                    </div>
                    <div className="text-[11px] font-mono text-slate-400/80">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-violet-300/80" />
                        {role === "host" ? "controls enabled" : "audience view"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-9 w-9 rounded-2xl border border-violet-300/25 bg-violet-300/10 flex items-center justify-center">
                        <Users size={18} className="text-violet-200/90" />
                      </div>
                      <div className="space-y-2 min-w-0">
                        <p className="text-sm text-slate-100/80">
                          Use this as a live temperature check. The results are
                          the slide: you can narrate why the room chose what it
                          chose.
                        </p>
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] font-mono text-slate-300/70">
                          <span className="inline-flex items-center gap-2">
                            <span className="text-slate-100/90">←</span>
                            <span className="text-slate-100/90">→</span>
                            <span>slides</span>
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <span className="text-slate-100/90">R</span>
                            <span>reset</span>
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Copy size={14} className="text-slate-300/70" />
                            <span className="truncate max-w-[16rem]">{audienceLink}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-[11px] font-mono text-slate-400/80 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-300/70 animate-pulse" />
                      live sync
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Users size={14} className="text-slate-300/70" />
                      {activeParticipants.total} online • {activeParticipants.hosts} host(s)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
