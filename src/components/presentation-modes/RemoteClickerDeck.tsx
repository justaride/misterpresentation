import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Wifi,
  WifiOff,
  Smartphone,
  Presentation,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

type Role = "host" | "controller";
type Conn = "disconnected" | "connecting" | "connected" | "error";

type ClickerMessage =
  | { type: "clicker.presence"; room: string; from: string; ts: number; role: Role }
  | { type: "clicker.nav"; room: string; from: string; ts: number; slide: number }
  | { type: "clicker.sync"; room: string; from: string; ts: number; slide: number; total: number; title: string };

const DEFAULT_WS_URL =
  import.meta.env.VITE_LIVE_WS_URL || "ws://127.0.0.1:8787/api/live/ws";

const SLIDES: Array<{ title: string; body: string; kicker?: string }> = [
  {
    kicker: "PRESENTATION FORM",
    title: "Remote Clicker",
    body: "Your phone becomes the controller.\nThe talk stays full-screen.",
  },
  {
    kicker: "WHY",
    title: "Second Screen",
    body: "Laptop shows slides.\nPhone controls navigation.\nNo hunting for keys.",
  },
  {
    kicker: "RELIABILITY",
    title: "Room Code",
    body: "Every session is a room.\nLate joiners sync.\nWrong room is ignored.",
  },
  {
    kicker: "TRANSPORT",
    title: "Hub Mode",
    body: "Host listens via WebSocket.\nController sends HTTP pushes.\nCross-device by default.",
  },
  {
    kicker: "NEXT",
    title: "Make It Universal",
    body: "Once this exists, any deck can opt in.\nOne controller.\nMany forms.",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

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

function isTypingTarget(el: EventTarget | null) {
  const tag = (el as HTMLElement | null)?.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || (el as HTMLElement | null)?.isContentEditable;
}

function pill(conn: Conn) {
  const base =
    "inline-flex items-center gap-2 px-3 py-1 border-2 border-border font-mono text-[10px] font-bold uppercase tracking-widest";
  if (conn === "connected") return `${base} bg-accent text-fg`;
  if (conn === "connecting") return `${base} bg-warn/70 text-fg`;
  if (conn === "error") return `${base} bg-danger/80 text-bg`;
  return `${base} bg-card text-fg`;
}

export function RemoteClickerDeck() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlRole = searchParams.get("role");
  const urlRoom = searchParams.get("room");
  const urlWs = searchParams.get("url");

  const [role, setRole] = useState<Role>(() =>
    urlRole === "controller" ? "controller" : "host",
  );
  const [room, setRoom] = useState(() => urlRoom ?? generateRoomCode());
  const [wsUrl, setWsUrl] = useState(() => urlWs ?? DEFAULT_WS_URL);

  const clientIdRef = useRef<string>(safeClientId());
  const wsRef = useRef<WebSocket | null>(null);
  const presenceIntervalRef = useRef<number>(0);
  const reconnectTimerRef = useRef<number>(0);

  const [conn, setConn] = useState<Conn>("connecting");
  const [slide, setSlide] = useState(0);
  const slideRef = useRef<number>(0);
  useEffect(() => {
    slideRef.current = slide;
  }, [slide]);

  // Sync URL params (role/room/url) once we have defaults.
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("role", role);
    next.set("room", room);
    if (wsUrl) next.set("url", wsUrl);
    setSearchParams(next, { replace: true });
  }, [role, room, searchParams, setSearchParams, wsUrl]);

  useEffect(() => {
    const nextRole: Role = urlRole === "controller" ? "controller" : "host";
    if (nextRole !== role) setRole(nextRole);
    if (urlRoom && urlRoom !== room) setRoom(urlRoom);
    if (urlWs && urlWs !== wsUrl) setWsUrl(urlWs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlRole, urlRoom, urlWs]);

  const resolvedWsUrl = useMemo(() => resolveWsUrl(wsUrl), [wsUrl]);
  const pushUrl = useMemo(() => derivePushUrl(resolvedWsUrl), [resolvedWsUrl]);

  const sendHttp = useCallback(
    async (msg: ClickerMessage) => {
      if (!pushUrl) throw new Error("Missing push URL");
      const res = await fetch(pushUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(msg),
      });
      if (!res.ok) throw new Error(`Push failed (${res.status})`);
    },
    [pushUrl],
  );

  const broadcastPresence = useCallback(() => {
    const msg: ClickerMessage = {
      type: "clicker.presence",
      room,
      from: clientIdRef.current,
      ts: Date.now(),
      role,
    };
    // Presence is best-effort; host uses HTTP push (works cross-device).
    if (role === "host") void sendHttp(msg).catch(() => {});
  }, [role, room, sendHttp]);

  const broadcastSync = useCallback(
    (idx: number) => {
      const s = SLIDES[idx] ?? SLIDES[0]!;
      const msg: ClickerMessage = {
        type: "clicker.sync",
        room,
        from: clientIdRef.current,
        ts: Date.now(),
        slide: idx,
        total: SLIDES.length,
        title: s.title,
      };
      if (role === "host") void sendHttp(msg).catch(() => {});
    },
    [role, room, sendHttp],
  );

  const applySlide = useCallback((idx: number) => {
    setSlide(clamp(idx, 0, SLIDES.length - 1));
  }, []);

  const next = useCallback(() => {
    applySlide(slideRef.current + 1);
  }, [applySlide]);
  const prev = useCallback(() => {
    applySlide(slideRef.current - 1);
  }, [applySlide]);

  const navFromController = useCallback(
    async (idx: number) => {
      const msg: ClickerMessage = {
        type: "clicker.nav",
        room,
        from: clientIdRef.current,
        ts: Date.now(),
        slide: clamp(idx, 0, SLIDES.length - 1),
      };
      await sendHttp(msg);
    },
    [room, sendHttp],
  );

  useEffect(() => {
    // Connect WS to receive nav/sync updates.
    if (!resolvedWsUrl) {
      setConn("error");
      return;
    }

    let closed = false;
    const connect = () => {
      if (closed) return;
      window.clearTimeout(reconnectTimerRef.current);

      setConn("connecting");
      const ws = new WebSocket(resolvedWsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (closed) return;
        setConn("connected");
        // Host announces current state; controller will show it.
        broadcastSync(slideRef.current);
        broadcastPresence();

        window.clearInterval(presenceIntervalRef.current);
        presenceIntervalRef.current = window.setInterval(() => {
          broadcastPresence();
          if (role === "host") broadcastSync(slideRef.current);
        }, 4500);
      };

      ws.onmessage = (evt) => {
        let parsed: unknown;
        try {
          parsed = JSON.parse(String(evt.data ?? ""));
        } catch {
          return;
        }

        const msg = parsed as Partial<ClickerMessage>;
        if (!msg || typeof msg !== "object") return;
        if (msg.room !== room) return;
        if (!msg.type) return;

        if (msg.type === "clicker.nav" && typeof msg.slide === "number") {
          // Controllers drive nav; host applies it. Controllers can also update their local view.
          applySlide(msg.slide);
          if (role === "host") broadcastSync(msg.slide);
        }

        if (msg.type === "clicker.sync" && typeof msg.slide === "number") {
          // Host sync for late joiners.
          applySlide(msg.slide);
        }
      };

      ws.onerror = () => {
        if (closed) return;
        setConn("error");
      };

      ws.onclose = () => {
        if (closed) return;
        setConn("disconnected");
        window.clearInterval(presenceIntervalRef.current);
        // simple backoff
        reconnectTimerRef.current = window.setTimeout(connect, 1200);
      };
    };

    connect();

    return () => {
      closed = true;
      window.clearInterval(presenceIntervalRef.current);
      window.clearTimeout(reconnectTimerRef.current);
      try {
        wsRef.current?.close();
      } catch {}
      wsRef.current = null;
    };
  }, [applySlide, broadcastPresence, broadcastSync, resolvedWsUrl, role, room]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (role === "controller") {
        // controller keys trigger remote nav
        if (e.key === "ArrowLeft") void navFromController(slideRef.current - 1).catch(() => {});
        if (e.key === "ArrowRight" || e.key === " ") void navFromController(slideRef.current + 1).catch(() => {});
        return;
      }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight" || e.key === " ") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navFromController, next, prev, role]);

  // Host: on local slide change, broadcast sync so late joiners converge.
  useEffect(() => {
    if (role !== "host") return;
    broadcastSync(slide);
  }, [broadcastSync, role, slide]);

  const slideData = SLIDES[slide] ?? SLIDES[0]!;

  const controllerLink = useMemo(() => {
    const u = new URL(window.location.href);
    u.searchParams.set("role", "controller");
    u.searchParams.set("room", room);
    u.searchParams.set("url", wsUrl);
    return u.toString();
  }, [room, wsUrl]);

  const hostLink = useMemo(() => {
    const u = new URL(window.location.href);
    u.searchParams.set("role", "host");
    u.searchParams.set("room", room);
    u.searchParams.set("url", wsUrl);
    return u.toString();
  }, [room, wsUrl]);

  const canControl = role === "controller" && conn === "connected" && !!pushUrl;

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0B0F1A] text-slate-200 overflow-hidden selection:bg-cyan-500/30">
      {/* Background glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="absolute top-5 left-5 right-5 z-30 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur">
            {role === "host" ? (
              <>
                <Presentation className="w-4 h-4 text-cyan-300" />
                <span className="font-mono text-xs">HOST</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 text-cyan-300" />
                <span className="font-mono text-xs">CONTROLLER</span>
              </>
            )}
          </div>
          <div className={clsx("rounded-full", pill(conn))}>
            {conn === "connected" ? (
              <Wifi className="w-3.5 h-3.5" />
            ) : (
              <WifiOff className="w-3.5 h-3.5" />
            )}
            {conn}
          </div>
          <div className="hidden md:flex items-center gap-2 font-mono text-xs text-white/60">
            <span className="text-white/40">ROOM</span>
            <span className="px-2 py-0.5 rounded-md border border-white/10 bg-white/5 text-white/80">
              {room}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block font-mono text-xs text-white/50">
            {slide + 1} / {SLIDES.length}
          </div>
        </div>
      </div>

      {/* Host/Controller chrome */}
      <div className="absolute bottom-5 left-5 right-5 z-30">
        {role === "host" ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                Controller Link
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="font-mono text-xs text-white/80 truncate max-w-[50vw] md:max-w-[560px]">
                  {controllerLink}
                </div>
                <button
                  onClick={() => void copy(controllerLink)}
                  className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/10 hover:bg-white/15 transition-colors font-mono text-xs"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <div className="mt-1 text-xs text-white/40">
                Run a hub locally with <span className="font-mono text-white/60">npm run live:data:server</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                disabled={slide === 0}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 bg-white/10 hover:bg-white/15 transition-colors disabled:opacity-40 disabled:pointer-events-none font-mono text-sm"
              >
                <ChevronLeft className="w-5 h-5" />
                Prev
              </button>
              <button
                onClick={next}
                disabled={slide >= SLIDES.length - 1}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-cyan-300/30 bg-cyan-500/15 hover:bg-cyan-500/20 transition-colors disabled:opacity-40 disabled:pointer-events-none font-mono text-sm"
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                Host Link
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="font-mono text-xs text-white/80 truncate max-w-[50vw] md:max-w-[560px]">
                  {hostLink}
                </div>
                <button
                  onClick={() => void copy(hostLink)}
                  className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/10 hover:bg-white/15 transition-colors font-mono text-xs"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              {!pushUrl && (
                <div className="mt-1 text-xs text-rose-200/70">
                  Missing push endpoint for controller. Provide <span className="font-mono">url=ws://.../api/live/ws</span>.
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => void navFromController(slide - 1).catch(() => {})}
                disabled={!canControl || slide === 0}
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border border-white/10 bg-white/10 hover:bg-white/15 transition-colors disabled:opacity-40 disabled:pointer-events-none font-mono text-base"
              >
                <ChevronLeft className="w-6 h-6" />
                Prev
              </button>
              <button
                onClick={() => void navFromController(slide + 1).catch(() => {})}
                disabled={!canControl || slide >= SLIDES.length - 1}
                className="inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl border border-cyan-300/30 bg-cyan-500/15 hover:bg-cyan-500/20 transition-colors disabled:opacity-40 disabled:pointer-events-none font-mono text-base"
              >
                Next
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={slide}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center p-8 md:p-16"
        >
          <div className="w-full max-w-5xl">
            {slideData.kicker && (
              <div className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-white/50">
                {slideData.kicker}
              </div>
            )}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[0.95]">
              {slideData.title}
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-white/65 leading-relaxed whitespace-pre-line max-w-3xl">
              {slideData.body}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

