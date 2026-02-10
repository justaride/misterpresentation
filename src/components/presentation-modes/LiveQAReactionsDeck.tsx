import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import {
  Copy,
  Users,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  ThumbsUp,
  Wifi,
  WifiOff,
  Pin,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Role = "host" | "audience";

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

type ReactionKey = "clap" | "lol" | "mindblown" | "heart" | "confused";

type PresenceByClient = Record<string, { ts: number; role: Role }>;

type Question = {
  id: string;
  text: string;
  slide: number;
  from: string;
  ts: number;
};

type VotesByQuestion = Record<string, Record<string, true>>;

type LiveMessage =
  | { type: "presence"; room: string; from: string; ts: number; role: Role }
  | { type: "nav"; room: string; from: string; ts: number; slide: number }
  | {
      type: "reaction";
      room: string;
      from: string;
      ts: number;
      slide: number;
      reaction: ReactionKey;
    }
  | {
      type: "question";
      room: string;
      from: string;
      ts: number;
      id: string;
      text: string;
      slide: number;
    }
  | {
      type: "upvote";
      room: string;
      from: string;
      ts: number;
      questionId: string;
    }
  | { type: "reset"; room: string; from: string; ts: number }
  | {
      type: "sync";
      room: string;
      from: string;
      ts: number;
      slide: number;
      questions: Question[];
      votesByQuestion: VotesByQuestion;
      pinnedQuestionId?: string;
    };

type OutgoingMessage =
  | { type: "presence"; role: Role }
  | { type: "nav"; slide: number }
  | { type: "reaction"; slide: number; reaction: ReactionKey }
  | { type: "question"; id: string; text: string; slide: number }
  | { type: "upvote"; questionId: string }
  | { type: "reset" }
  | {
      type: "sync";
      slide: number;
      questions: Question[];
      votesByQuestion: VotesByQuestion;
      pinnedQuestionId?: string;
    };

function safeClientId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `c_${Math.random().toString(16).slice(2)}`
  );
}

function generateRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function hasProtocol(raw: string) {
  return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(raw);
}

function resolveWsUrl(raw: string) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return "";

  const withProto = hasProtocol(trimmed)
    ? trimmed
    : `${window.location.protocol === "https:" ? "wss" : "ws"}://${trimmed}`;

  try {
    const u = new URL(withProto);
    if (u.protocol === "http:") u.protocol = "ws:";
    if (u.protocol === "https:") u.protocol = "wss:";
    return u.toString();
  } catch {
    return withProto;
  }
}

function resolveHttpUrl(raw: string) {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) return "";

  const withProto = hasProtocol(trimmed)
    ? trimmed
    : `${window.location.protocol}//${trimmed}`;

  try {
    const u = new URL(withProto);
    if (u.protocol === "ws:") u.protocol = "http:";
    if (u.protocol === "wss:") u.protocol = "https:";
    return u.toString();
  } catch {
    return withProto;
  }
}

function derivePushUrl(wsUrl: string) {
  if (!wsUrl) return "";
  try {
    const u = new URL(wsUrl);
    if (u.protocol === "ws:") u.protocol = "http:";
    if (u.protocol === "wss:") u.protocol = "https:";

    if (u.pathname.endsWith("/api/live/ws")) {
      u.pathname = u.pathname.replace(/\/api\/live\/ws$/, "/api/live/push");
    } else if (u.pathname.endsWith("/ws")) {
      u.pathname = u.pathname.replace(/\/ws$/, "/push");
    } else if (!u.pathname.endsWith("/api/live/push")) {
      u.pathname = "/api/live/push";
    }
    return u.toString();
  } catch {
    return "";
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function panel(focused: boolean) {
  return clsx(
    "rounded-2xl border bg-white/5 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]",
    focused ? "border-cyan-300/30 ring-2 ring-cyan-300/30" : "border-white/10",
  );
}

const DEFAULT_WS_URL =
  import.meta.env.VITE_LIVE_WS_URL || "ws://127.0.0.1:8787/api/live/ws";

const SLIDES: Array<{
  title: string;
  body: string;
  prompt?: string;
}> = [
  {
    title: "Live Q&A",
    body: "This deck is a room.\nAudience participates in realtime.",
    prompt: "Open the audience link on your phone.",
  },
  {
    title: "Rules",
    body: "Ask crisp questions.\nReact honestly.\nWe'll pin the best ones.",
    prompt: "Send 1 reaction now.",
  },
  {
    title: "Friction",
    body: "Most talks are one-way.\nThe room goes quiet.\nSignal disappears.",
    prompt: "Submit a question you wish people asked more often.",
  },
  {
    title: "Signal",
    body: "Reactions are instant.\nQuestions are durable.\nVotes surface intent.",
  },
  {
    title: "Moderation",
    body: "Host navigates.\nAudience steers.\nPin what matters.",
    prompt: "Upvote the strongest question.",
  },
  {
    title: "Timing",
    body: "Slide changes are shared.\nLate joiners sync automatically.",
  },
  {
    title: "Decision",
    body: "End with a decision.\nNot a vibe.\nNot more slides.",
  },
  {
    title: "Q&A",
    body: "We'll take the top-voted questions.\nThen we ship the next iteration.",
  },
];

const REACTIONS: Array<{ key: ReactionKey; label: string; glyph: string }> = [
  { key: "clap", label: "Clap", glyph: "*" },
  { key: "lol", label: "LOL", glyph: ":)" },
  { key: "mindblown", label: "Mind blown", glyph: "!" },
  { key: "heart", label: "Love", glyph: "<3" },
  { key: "confused", label: "Confused", glyph: "?" },
];

export function LiveQAReactionsDeck() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlRole = searchParams.get("role");
  const urlRoom = searchParams.get("room");
  const urlWs = searchParams.get("ws");
  const urlPush = searchParams.get("push");
  const urlToken = searchParams.get("token");

  const [role, setRole] = useState<Role>(() =>
    urlRole === "audience" ? "audience" : "host",
  );
  const [room, setRoom] = useState<string>(() => urlRoom ?? generateRoomCode());

  const clientIdRef = useRef<string>(safeClientId());

  const [now, setNow] = useState(() => Date.now());
  const [connection, setConnection] = useState<{
    state: ConnectionState;
    url?: string;
    lastError?: string;
  }>({ state: "disconnected" });

  const wsUrl = useMemo(() => resolveWsUrl(urlWs || DEFAULT_WS_URL), [urlWs]);
  const pushUrl = useMemo(() => {
    const raw = urlPush ? resolveHttpUrl(urlPush) : "";
    return raw || derivePushUrl(wsUrl);
  }, [urlPush, wsUrl]);
  const token = urlToken ? String(urlToken) : "";

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttemptRef = useRef<number>(0);
  const lastSyncRef = useRef<number>(0);
  const unmountedRef = useRef<boolean>(false);

  const slideRef = useRef<number>(0);
  const questionsRef = useRef<Record<string, Question>>({});
  const votesRef = useRef<VotesByQuestion>({});
  const pinnedRef = useRef<string | null>(null);

  const [slide, setSlide] = useState(0);
  const [presenceByClient, setPresenceByClient] = useState<PresenceByClient>({});

  const [reactions, setReactions] = useState<
    Array<{ id: string; from: string; ts: number; reaction: ReactionKey; slide: number }>
  >([]);

  const [questionsById, setQuestionsById] = useState<Record<string, Question>>({});
  const [votesByQuestion, setVotesByQuestion] = useState<VotesByQuestion>({});
  const [pinnedQuestionId, setPinnedQuestionId] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [pushError, setPushError] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);
  useEffect(() => {
    questionsRef.current = questionsById;
  }, [questionsById]);
  useEffect(() => {
    votesRef.current = votesByQuestion;
  }, [votesByQuestion]);
  useEffect(() => {
    pinnedRef.current = pinnedQuestionId;
  }, [pinnedQuestionId]);

  useEffect(() => {
    const roleFromUrl = searchParams.get("role");
    const nextRole: Role = roleFromUrl === "audience" ? "audience" : "host";
    if (nextRole !== role) setRole(nextRole);

    const roomFromUrl = searchParams.get("room");
    if (roomFromUrl && roomFromUrl !== room) setRoom(roomFromUrl);
  }, [role, room, searchParams]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    let changed = false;
    if (!next.get("role")) {
      next.set("role", role);
      changed = true;
    }
    if (!next.get("room")) {
      next.set("room", room);
      changed = true;
    }
    if (changed) setSearchParams(next, { replace: true });
  }, [role, room, searchParams, setSearchParams]);

  const audienceLink = useMemo(() => {
    const base = new URL(window.location.href);
    base.searchParams.set("role", "audience");
    base.searchParams.set("room", room);
    if (urlWs) base.searchParams.set("ws", urlWs);
    if (urlPush) base.searchParams.set("push", urlPush);
    if (urlToken) base.searchParams.set("token", urlToken);
    return base.toString();
  }, [room, urlPush, urlToken, urlWs]);

  const send = useCallback(
    async (msg: OutgoingMessage) => {
      if (!pushUrl) {
        setPushError("Missing push URL");
        return;
      }

      const full = {
        ...msg,
        room,
        from: clientIdRef.current,
        ts: Date.now(),
      };

      try {
        setPushError(null);
        const res = await fetch(pushUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(token ? { authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(full),
        });
        if (!res.ok) {
          setPushError(`Push failed (${res.status})`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Push failed";
        setPushError(msg);
      }
    },
    [pushUrl, room, token],
  );

  const applyPresence = useCallback(
    (from: string, ts: number, r: Role) => {
      setPresenceByClient((prev) => ({
        ...prev,
        [from]: { ts, role: r },
      }));
    },
    [],
  );

  const applyQuestion = useCallback((q: Question) => {
    setQuestionsById((prev) => (prev[q.id] ? prev : { ...prev, [q.id]: q }));
  }, []);

  const applyUpvote = useCallback((questionId: string, from: string) => {
    setVotesByQuestion((prev) => {
      const current = prev[questionId] ?? {};
      if (current[from]) return prev;
      return { ...prev, [questionId]: { ...current, [from]: true } };
    });
  }, []);

  const applyReaction = useCallback(
    (evt: { reaction: ReactionKey; from: string; ts: number; slide: number }) => {
      setReactions((prev) => {
        const id = `${evt.from}:${evt.ts}:${evt.reaction}`;
        if (prev.some((r) => r.id === id)) return prev;
        return [
          ...prev,
          { id, from: evt.from, ts: evt.ts, reaction: evt.reaction, slide: evt.slide },
        ];
      });
    },
    [],
  );

  const resetRoom = useCallback(() => {
    setReactions([]);
    setQuestionsById({});
    setVotesByQuestion({});
    setPinnedQuestionId(null);
  }, []);

  const applySync = useCallback((msg: Extract<LiveMessage, { type: "sync" }>) => {
    if (msg.ts <= lastSyncRef.current) return;
    lastSyncRef.current = msg.ts;

    setSlide(clamp(msg.slide ?? 0, 0, SLIDES.length - 1));

    const qs = Array.isArray(msg.questions) ? msg.questions : [];
    const nextQuestions: Record<string, Question> = {};
    for (const q of qs) {
      if (!q || typeof q !== "object") continue;
      if (!q.id || !q.text) continue;
      nextQuestions[q.id] = q;
    }
    setQuestionsById(nextQuestions);

    setVotesByQuestion(msg.votesByQuestion ?? {});
    setPinnedQuestionId(msg.pinnedQuestionId ?? null);
  }, []);

  const onWsMessage = useCallback(
    (raw: unknown) => {
      if (typeof raw !== "string") return;
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return;
      }
      if (!parsed || typeof parsed !== "object") return;

      const msg = parsed as Partial<LiveMessage> & { [k: string]: unknown };
      if (!msg.type || typeof msg.type !== "string") return;
      if (msg.room !== room) return;
      if (msg.from === clientIdRef.current) return;

      if (msg.type === "presence") {
        if (msg.from && typeof msg.ts === "number" && (msg.role === "host" || msg.role === "audience")) {
          applyPresence(msg.from, msg.ts, msg.role);
        }
      }

      if (msg.type === "nav") {
        if (typeof msg.slide === "number") setSlide(clamp(msg.slide, 0, SLIDES.length - 1));
      }

      if (msg.type === "reaction") {
        if (
          msg.from &&
          typeof msg.ts === "number" &&
          typeof msg.slide === "number" &&
          typeof msg.reaction === "string"
        ) {
          const key = msg.reaction as ReactionKey;
          if (REACTIONS.some((r) => r.key === key)) {
            applyReaction({ reaction: key, from: msg.from, ts: msg.ts, slide: msg.slide });
          }
        }
      }

      if (msg.type === "question") {
        if (
          typeof msg.id === "string" &&
          typeof msg.text === "string" &&
          typeof msg.slide === "number" &&
          typeof msg.ts === "number" &&
          typeof msg.from === "string"
        ) {
          applyQuestion({
            id: msg.id,
            text: msg.text.trim(),
            slide: clamp(msg.slide, 0, SLIDES.length - 1),
            from: msg.from,
            ts: msg.ts,
          });
        }
      }

      if (msg.type === "upvote") {
        if (typeof msg.questionId === "string" && typeof msg.from === "string") {
          applyUpvote(msg.questionId, msg.from);
        }
      }

      if (msg.type === "reset") {
        resetRoom();
      }

      if (msg.type === "sync") {
        applySync(msg as Extract<LiveMessage, { type: "sync" }>);
      }
    },
    [applyPresence, applyQuestion, applyReaction, applySync, applyUpvote, resetRoom, room],
  );

  const connectWs = useCallback(() => {
    if (!wsUrl) {
      setConnection({ state: "disconnected", lastError: "Missing WebSocket URL" });
      return;
    }

    setConnection({ state: "connecting", url: wsUrl });

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptRef.current = 0;
      setConnection({ state: "connected", url: wsUrl });
    };

    ws.onmessage = (evt) => {
      onWsMessage(evt.data);
    };

    ws.onerror = () => {
      setConnection({ state: "error", url: wsUrl, lastError: "WebSocket error" });
    };

    ws.onclose = (evt) => {
      if (unmountedRef.current) return;
      const normal = evt.code === 1000;
      setConnection((c) => ({
        ...c,
        state: "disconnected",
        url: wsUrl,
        lastError: normal ? undefined : evt.reason || `WebSocket closed (${evt.code})`,
      }));

      // Exponential-ish backoff, capped.
      if (reconnectTimerRef.current != null) window.clearTimeout(reconnectTimerRef.current);
      const attempt = (reconnectAttemptRef.current = reconnectAttemptRef.current + 1);
      const delay = clamp(250 * Math.pow(1.7, attempt), 250, 10_000);
      reconnectTimerRef.current = window.setTimeout(() => {
        if (unmountedRef.current) return;
        connectWs();
      }, delay);
    };
  }, [onWsMessage, wsUrl]);

  useEffect(() => {
    unmountedRef.current = false;
    connectWs();
    return () => {
      unmountedRef.current = true;
      if (reconnectTimerRef.current != null) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      try {
        wsRef.current?.close(1000, "client disconnect");
      } catch {
        // ignore
      }
      wsRef.current = null;
    };
  }, [connectWs]);

  useEffect(() => {
    const pulse = () =>
      void send({ type: "presence", role });
    pulse();
    const id = window.setInterval(pulse, 2000);
    return () => window.clearInterval(id);
  }, [role, send]);

  useEffect(() => {
    // Track own presence locally for counts.
    applyPresence(clientIdRef.current, Date.now(), role);
  }, [applyPresence, role]);

  useEffect(() => {
    if (role !== "host") return;
    const id = window.setInterval(() => {
      void send({
        type: "sync",
        slide: slideRef.current,
        questions: Object.values(questionsRef.current),
        votesByQuestion: votesRef.current,
        pinnedQuestionId: pinnedRef.current ?? undefined,
      });
    }, 2000);
    return () => window.clearInterval(id);
  }, [role, send]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (role !== "host") return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        void goTo(slide + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        void goTo(slide - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [role, slide]);

  const activeParticipants = useMemo(() => {
    const aliveWindowMs = 6500;
    const entries = Object.entries(presenceByClient).filter(
      ([, p]) => now - p.ts < aliveWindowMs,
    );
    const total = entries.length;
    const hosts = entries.filter(([, p]) => p.role === "host").length;
    return { total, hosts };
  }, [now, presenceByClient]);

  const visibleReactions = useMemo(() => {
    const windowMs = 6500;
    return reactions.filter((r) => now - r.ts < windowMs).slice(-24);
  }, [now, reactions]);

  const questionsSorted = useMemo(() => {
    const qs = Object.values(questionsById);
    const voteCount = (id: string) => Object.keys(votesByQuestion[id] ?? {}).length;
    return qs.sort((a, b) => {
      const dv = voteCount(b.id) - voteCount(a.id);
      if (dv !== 0) return dv;
      return a.ts - b.ts;
    });
  }, [questionsById, votesByQuestion]);

  const slideCountLabel = `${slide + 1} / ${SLIDES.length}`;

  const goTo = useCallback(
    async (n: number) => {
      const clamped = clamp(n, 0, SLIDES.length - 1);
      setSlide(clamped);
      if (role === "host") {
        await send({
          type: "nav",
          slide: clamped,
        });
      }
    },
    [role, send],
  );

  const submitQuestion = useCallback(async () => {
    const text = questionText.trim();
    if (!text) return;
    const id = `q_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
    const q: Question = {
      id,
      text,
      slide,
      from: clientIdRef.current,
      ts: Date.now(),
    };
    applyQuestion(q); // optimistic
    setQuestionText("");
    await send({
      type: "question",
      id: q.id,
      text: q.text,
      slide: q.slide,
    });
  }, [applyQuestion, questionText, send, slide]);

  const upvote = useCallback(
    async (questionId: string) => {
      const already = votesByQuestion[questionId]?.[clientIdRef.current];
      if (already) return;
      applyUpvote(questionId, clientIdRef.current); // optimistic
      await send({
        type: "upvote",
        questionId,
      });
    },
    [applyUpvote, send, votesByQuestion],
  );

  const reactNow = useCallback(
    async (reaction: ReactionKey) => {
      applyReaction({ reaction, from: clientIdRef.current, ts: Date.now(), slide });
      await send({
        type: "reaction",
        reaction,
        slide,
      });
    },
    [applyReaction, send, slide],
  );

  const onReset = useCallback(async () => {
    if (role !== "host") return;
    resetRoom();
    await send({ type: "reset" });
  }, [resetRoom, role, send]);

  const copyAudienceLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(audienceLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }, [audienceLink]);

  const pinQuestion = useCallback(
    async (id: string) => {
      if (role !== "host") return;
      setPinnedQuestionId((prev) => (prev === id ? null : id));
    },
    [role],
  );

  const connectionLabel = useMemo(() => {
    if (connection.state === "connected") return "Connected";
    if (connection.state === "connecting") return "Connecting";
    if (connection.state === "error") return "Error";
    return "Disconnected";
  }, [connection.state]);

  const focused = role === "host";
  const currentSlide = SLIDES[slide] ?? SLIDES[0];

  return (
    <div
      className="min-h-screen bg-bg text-fg flex flex-col"
      data-testid="qa-deck"
    >
      <header className="border-b border-border bg-card/50 p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-400/20 border border-white/10 grid place-items-center">
            <Users className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <h1 className="font-display text-lg leading-none">
              Live Q&amp;A + Reactions
            </h1>
            <p className="text-xs font-mono text-fg/50">
              room <span className="text-fg/80">{room}</span> |{" "}
              <span className="text-fg/80">{role}</span> |{" "}
              <span data-testid="qa-slide-position">{slideCountLabel}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            data-testid="qa-connection-badge"
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono",
              connection.state === "connected" && "border-emerald-400/30 text-emerald-200 bg-emerald-500/10",
              connection.state === "connecting" && "border-cyan-300/30 text-cyan-200 bg-cyan-500/10",
              (connection.state === "disconnected" || connection.state === "error") &&
                "border-rose-400/30 text-rose-200 bg-rose-500/10",
            )}
            title={connection.lastError || pushError || undefined}
          >
            {connection.state === "connected" ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            {connectionLabel}
          </span>

          <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-mono text-fg/70 bg-white/5">
            <Users className="h-4 w-4" />
            {activeParticipants.total} online ({activeParticipants.hosts} host)
          </span>

          {role === "host" ? (
            <>
              <button
                type="button"
                onClick={copyAudienceLink}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-mono bg-white/5 hover:bg-white/10 transition-colors"
                data-testid="qa-copy-audience-link"
              >
                <Copy className="h-4 w-4" />
                {copied ? "Copied" : "Audience link"}
              </button>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-mono bg-white/5 hover:bg-white/10 transition-colors"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset
              </button>
            </>
          ) : null}
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4 p-4">
        <section className={panel(true) + " p-6 lg:p-8 relative overflow-hidden"}>
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs font-mono text-fg/60">
                Slide {slide + 1} of {SLIDES.length}
              </div>
              {role === "host" ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void goTo(slide - 1)}
                    disabled={slide === 0}
                    aria-disabled={slide === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-mono bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:hover:bg-white/5"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => void goTo(slide + 1)}
                    disabled={slide >= SLIDES.length - 1}
                    aria-disabled={slide >= SLIDES.length - 1}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-mono bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-40 disabled:hover:bg-white/5"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-10 space-y-6">
              <h2 className="font-display text-5xl sm:text-6xl leading-[0.95] tracking-tight">
                {currentSlide.title}
              </h2>
              <p className="text-lg sm:text-xl text-fg/80 whitespace-pre-line max-w-2xl">
                {currentSlide.body}
              </p>

              {currentSlide.prompt ? (
                <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-500/10 p-4 max-w-2xl">
                  <div className="text-xs font-mono uppercase tracking-widest text-cyan-200/80">
                    Prompt
                  </div>
                  <div className="mt-1 text-fg/90">{currentSlide.prompt}</div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <aside className={panel(focused) + " p-4 lg:p-5 space-y-4"}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl">Room Feed</h3>
            <div className="text-xs font-mono text-fg/50">
              {role === "host" ? "Host view" : "Audience view"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="text-xs font-mono uppercase tracking-widest text-fg/60">
              Reactions
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {REACTIONS.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => void reactNow(r.key)}
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors py-2"
                  aria-label={r.label}
                >
                  <div className="text-xl leading-none">{r.glyph}</div>
                  <div className="mt-1 text-[10px] font-mono text-fg/50">
                    {r.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 min-h-[34px]">
              <AnimatePresence initial={false}>
                {visibleReactions.slice(-6).map((r) => {
                  const meta = REACTIONS.find((x) => x.key === r.reaction);
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center justify-between gap-3 text-xs font-mono text-fg/70"
                    >
                      <span>
                        {meta?.glyph ?? "."} <span className="text-fg/50">slide</span>{" "}
                        {r.slide + 1}
                      </span>
                      <span className="text-fg/40">
                        {Math.max(0, Math.round((now - r.ts) / 1000))}s
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-mono uppercase tracking-widest text-fg/60">
                Questions
              </div>
              <div className="text-xs font-mono text-fg/50">
                {questionsSorted.length} total
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void submitQuestion();
                }}
                placeholder="Ask a question..."
                className="flex-1 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm outline-none focus:border-cyan-300/40"
                data-testid="qa-question-input"
              />
              <button
                type="button"
                onClick={() => void submitQuestion()}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-3 py-2 text-sm font-mono"
                data-testid="qa-submit-question"
              >
                Send
              </button>
            </div>

            {pushError ? (
              <div className="mt-2 text-xs font-mono text-rose-200/80">
                {pushError}
              </div>
            ) : null}

            <div className="mt-3 space-y-2 max-h-[46vh] overflow-auto pr-1" data-testid="qa-question-list">
              {questionsSorted.length === 0 ? (
                <div className="text-sm text-fg/50">
                  No questions yet. Start the room.
                </div>
              ) : null}

              {questionsSorted.map((q) => {
                const votes = Object.keys(votesByQuestion[q.id] ?? {}).length;
                const pinned = pinnedQuestionId === q.id;
                const youVoted = !!votesByQuestion[q.id]?.[clientIdRef.current];
                return (
                  <div
                    key={q.id}
                    className={clsx(
                      "rounded-xl border p-3 bg-black/20",
                      pinned ? "border-cyan-300/40" : "border-white/10",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm text-fg/90 break-words">
                          {q.text}
                        </div>
                        <div className="mt-1 text-[11px] font-mono text-fg/45">
                          slide {q.slide + 1} | {votes} votes
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => void upvote(q.id)}
                          disabled={youVoted}
                          aria-disabled={youVoted}
                          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors px-2 py-1 text-xs font-mono disabled:opacity-40 disabled:hover:bg-white/5"
                          data-testid={`qa-upvote-${q.id}`}
                          aria-label={`Upvote: ${q.text}`}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          {votes}
                        </button>
                        {role === "host" ? (
                          <button
                            type="button"
                            onClick={() => void pinQuestion(q.id)}
                            className={clsx(
                              "inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs font-mono transition-colors",
                              pinned
                                ? "border-cyan-300/40 bg-cyan-500/10 text-cyan-200"
                                : "border-white/10 bg-white/5 hover:bg-white/10 text-fg/80",
                            )}
                            aria-label={pinned ? "Unpin question" : "Pin question"}
                          >
                            <Pin className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {role === "host" && pinnedQuestionId ? (
            <div className="rounded-2xl border border-cyan-300/20 bg-cyan-500/10 p-3">
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-200/80 flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Pinned
              </div>
              <div className="mt-2 text-sm text-fg/90">
                {questionsById[pinnedQuestionId]?.text ?? "-"}
              </div>
            </div>
          ) : null}
        </aside>
      </main>
    </div>
  );
}
