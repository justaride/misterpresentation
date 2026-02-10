import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Trash2,
  Pencil,
  Lock,
  Copy,
} from "lucide-react";
import {
  buildSrcDoc,
  createSessionId,
  type ConsoleLevel,
  type SandboxToHostMessage,
} from "./runnable-lab/runner";

type LabStep = {
  id: string;
  title: string;
  subtitle?: string;
  notes?: string;
  html: string;
  css: string;
  js: string;
  autorun?: boolean;
};

type Tab = "html" | "css" | "js";

type Draft = { html: string; css: string; js: string };

type ConsoleEntry = {
  id: string;
  ts: number;
  level: ConsoleLevel;
  text: string;
};

const STEPS: LabStep[] = [
  {
    id: "hello",
    title: "Hello, Sandbox",
    subtitle: "Render a tiny UI and log to the host console panel.",
    autorun: true,
    html: `<div style="padding: 24px;">
  <h1>Hello, Runnable Code Lab</h1>
  <p>Open the console panel below.</p>
</div>`,
    css: `h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  letter-spacing: -0.02em;
}
p { margin: 0; opacity: 0.75; }`,
    js: `console.log("Sandbox booted.");
console.info("Tip: toggle Edit to change code live.");`,
  },
  {
    id: "dom-state",
    title: "DOM State",
    subtitle: "A counter implemented with plain DOM, no libraries.",
    autorun: true,
    html: `<div id="app" style="padding: 24px;"></div>`,
    css: `button{
  border: 2px solid #111827;
  background: #b6ff4d;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
}
.wrap { display: flex; align-items: center; gap: 12px; }
.count { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }`,
    js: `let count = 0;
const app = document.getElementById("app");
if (!app) throw new Error("#app not found");

const btn = document.createElement("button");
btn.textContent = "Increment";
const label = document.createElement("div");
label.className = "count";

function render() {
  label.textContent = "count = " + count;
}

btn.addEventListener("click", () => {
  count += 1;
  console.log("clicked", { count });
  render();
});

const wrap = document.createElement("div");
wrap.className = "wrap";
wrap.append(btn, label);
app.append(wrap);
render();`,
  },
  {
    id: "css-grid",
    title: "CSS Grid Layout",
    subtitle: "A slide-like grid that responds to a toggle.",
    autorun: true,
    html: `<div class="page">
  <div class="hero">
    <div class="kicker">FORM</div>
    <h2>Grid-Based Slide</h2>
    <p>Toggle density to see the layout reflow.</p>
    <button id="toggle">Toggle density</button>
  </div>
  <div class="tile a">A</div>
  <div class="tile b">B</div>
  <div class="tile c">C</div>
  <div class="tile d">D</div>
</div>`,
    css: `.page{
  padding: 24px;
  display: grid;
  gap: 14px;
  grid-template-columns: 1.2fr 1fr 1fr;
  grid-template-rows: auto 1fr 1fr;
  height: 100vh;
  box-sizing: border-box;
  background: #fffbf2;
}
.hero{
  grid-column: 1 / 4;
  border: 2px solid #111827;
  background: #f3e7d3;
  padding: 16px;
}
.kicker{
  font: 700 11px/1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.7;
}
h2{ margin: 6px 0 6px 0; font-size: 30px; letter-spacing: -0.02em; }
p{ margin: 0 0 10px 0; opacity: 0.75; }
button{
  border: 2px solid #111827;
  background: #b6ff4d;
  padding: 10px 12px;
  font-weight: 800;
  cursor: pointer;
}
.tile{
  border: 2px solid #111827;
  display: grid;
  place-items: center;
  font-size: 42px;
  font-weight: 900;
}
.a{ background: #b6ff4d; }
.b{ background: #ffb000; }
.c{ background: #fff; }
.d{ background: #ffd6d6; }
.dense .tile{ font-size: 28px; }
.dense{ grid-template-columns: 1fr 1fr 1fr 1fr; }
.dense .hero{ grid-column: 1 / 5; }`,
    js: `const root = document.querySelector(".page");
const btn = document.getElementById("toggle");
if (!root || !btn) throw new Error("missing elements");

btn.addEventListener("click", () => {
  root.classList.toggle("dense");
  console.log("density:", root.classList.contains("dense") ? "dense" : "normal");
});`,
  },
  {
    id: "raf",
    title: "Animation Loop",
    subtitle: "requestAnimationFrame with a simple FPS meter.",
    autorun: true,
    html: `<div style="padding: 24px;">
  <canvas id="c" width="720" height="360" style="border:2px solid #111827; background:#fff;"></canvas>
  <div id="fps" style="margin-top:10px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;"></div>
</div>`,
    css: ``,
    js: `const canvas = document.getElementById("c");
const fpsEl = document.getElementById("fps");
if (!(canvas instanceof HTMLCanvasElement) || !fpsEl) throw new Error("missing canvas/fps");
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("no 2d context");

let tPrev = performance.now();
let frames = 0;
let lastFpsUpdate = performance.now();

function draw(t) {
  const dt = t - tPrev;
  tPrev = t;
  frames += 1;

  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#111827";
  ctx.fillRect(0, 0, w, h);

  const x = (Math.sin(t / 500) * 0.5 + 0.5) * (w - 80) + 40;
  const y = (Math.cos(t / 650) * 0.5 + 0.5) * (h - 80) + 40;
  ctx.fillStyle = "#b6ff4d";
  ctx.beginPath();
  ctx.arc(x, y, 26, 0, Math.PI * 2);
  ctx.fill();

  if (t - lastFpsUpdate > 500) {
    const fps = Math.round((frames * 1000) / (t - lastFpsUpdate));
    fpsEl.textContent = "fps ≈ " + fps;
    frames = 0;
    lastFpsUpdate = t;
  }

  requestAnimationFrame(draw);
}

console.log("Starting animation loop…");
requestAnimationFrame(draw);`,
  },
  {
    id: "blocked-network",
    title: "Network Is Blocked (On Purpose)",
    subtitle: "The sandbox CSP disables fetch to keep demos deterministic.",
    autorun: true,
    html: `<div style="padding: 24px;">
  <h2>Try opening the console panel.</h2>
  <p>This step intentionally triggers a blocked request.</p>
</div>`,
    css: `h2{ margin: 0 0 10px 0; } p{ margin: 0; opacity: 0.75; }`,
    js: `console.log("Attempting fetch (should fail)…");
fetch("https://example.com").then(
  () => console.log("unexpected success"),
  (err) => console.error("fetch failed:", err)
);`,
  },
  {
    id: "svg-chart",
    title: "SVG Chart",
    subtitle: "Render simple data without external libraries.",
    autorun: true,
    html: `<div style="padding: 24px;">
  <svg id="chart" viewBox="0 0 800 260" width="800" height="260" style="max-width: 100%; height: auto; border:2px solid #111827; background:#fff;"></svg>
</div>`,
    css: ``,
    js: `const data = [14, 9, 21, 18, 26, 16, 30, 24];
const svg = document.getElementById("chart");
if (!(svg instanceof SVGElement)) throw new Error("chart svg missing");

const w = 800, h = 260;
const pad = 18;
const barW = (w - pad * 2) / data.length;
const max = Math.max(...data);

while (svg.firstChild) svg.removeChild(svg.firstChild);

data.forEach((v, i) => {
  const barH = Math.round(((h - pad * 2) * v) / max);
  const x = pad + i * barW + 10;
  const y = h - pad - barH;

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", String(x));
  rect.setAttribute("y", String(y));
  rect.setAttribute("width", String(Math.max(8, barW - 20)));
  rect.setAttribute("height", String(barH));
  rect.setAttribute("fill", i % 2 === 0 ? "#b6ff4d" : "#ffb000");
  rect.setAttribute("stroke", "#111827");
  rect.setAttribute("stroke-width", "2");
  svg.appendChild(rect);
});

console.log("Rendered", data.length, "bars.");`,
  },
];

function nowId(prefix: string) {
  return `${prefix}_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`;
}

function isTypingTarget(el: EventTarget | null) {
  const tag = (el as HTMLElement | null)?.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || (el as HTMLElement | null)?.isContentEditable;
}

function levelColor(level: ConsoleLevel) {
  switch (level) {
    case "error":
      return "text-danger";
    case "warn":
      return "text-warn";
    case "info":
      return "text-blue-500";
    default:
      return "text-fg/80";
  }
}

export function RunnableCodeLab() {
  const [stepIndex, setStepIndex] = useState(0);
  const step = STEPS[stepIndex] ?? STEPS[0]!;

  const [tab, setTab] = useState<Tab>("js");
  const [editEnabled, setEditEnabled] = useState(false);

  const [draftByStepId, setDraftByStepId] = useState<Record<string, Draft>>({});
  const draft = draftByStepId[step.id] ?? { html: step.html, css: step.css, js: step.js };

  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [lastError, setLastError] = useState<{ message: string; stack?: string } | null>(null);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const sessionIdRef = useRef<string>(createSessionId());
  const consoleRef = useRef<HTMLDivElement | null>(null);

  const [srcDoc, setSrcDoc] = useState(() =>
    buildSrcDoc({ html: draft.html, css: draft.css, js: draft.js, sessionId: sessionIdRef.current }),
  );

  useEffect(() => {
    // Initialize draft for unseen steps.
    setDraftByStepId((prev) => {
      if (prev[step.id]) return prev;
      return { ...prev, [step.id]: { html: step.html, css: step.css, js: step.js } };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step.id]);

  const clearConsole = useCallback(() => {
    setConsoleEntries([]);
  }, []);

  const scrollConsoleToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = consoleRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    });
  }, []);

  const pushConsole = useCallback((level: ConsoleLevel, parts: string[]) => {
    const text = parts.join(" ");
    setConsoleEntries((prev) => {
      const next = [...prev, { id: nowId("c"), ts: Date.now(), level, text }];
      // Keep memory bounded.
      return next.length > 200 ? next.slice(next.length - 200) : next;
    });
  }, []);

  const run = useCallback(
    (opts?: { clear?: boolean }) => {
      const nextSessionId = createSessionId();
      sessionIdRef.current = nextSessionId;
      if (opts?.clear !== false) clearConsole();
      setLastError(null);
      setSrcDoc(buildSrcDoc({ html: draft.html, css: draft.css, js: draft.js, sessionId: nextSessionId }));
    },
    [clearConsole, draft.css, draft.html, draft.js],
  );

  const reset = useCallback(() => {
    setDraftByStepId((prev) => ({
      ...prev,
      [step.id]: { html: step.html, css: step.css, js: step.js },
    }));
    setEditEnabled(false);
    setTab("js");
    // Re-run with the original code.
    requestAnimationFrame(() => run());
  }, [run, step.css, step.html, step.id, step.js]);

  const prev = useCallback(() => setStepIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(
    () => setStepIndex((i) => Math.min(STEPS.length - 1, i + 1)),
    [],
  );

  const updateDraft = useCallback(
    (partial: Partial<Draft>) => {
      setDraftByStepId((prevMap) => ({
        ...prevMap,
        [step.id]: { ...draft, ...partial },
      }));
    },
    [draft, step.id],
  );

  const copyCurrentTab = useCallback(async () => {
    const content = tab === "html" ? draft.html : tab === "css" ? draft.css : draft.js;
    try {
      await navigator.clipboard.writeText(content);
      pushConsole("info", ["Copied", tab.toUpperCase(), "to clipboard"]);
      scrollConsoleToBottom();
    } catch (e) {
      pushConsole("warn", ["Clipboard copy failed:", String(e)]);
      scrollConsoleToBottom();
    }
  }, [draft.css, draft.html, draft.js, pushConsole, scrollConsoleToBottom, tab]);

  useEffect(() => {
    const onMessage = (evt: MessageEvent) => {
      const iframeWin = iframeRef.current?.contentWindow;
      if (!iframeWin) return;
      if (evt.source !== iframeWin) return;

      const data = evt.data as Partial<SandboxToHostMessage> | null;
      if (!data || typeof data !== "object") return;
      if (data.sessionId !== sessionIdRef.current) return;

      if (data.type === "ready") {
        pushConsole("info", ["Sandbox ready"]);
        scrollConsoleToBottom();
        return;
      }
      if (data.type === "console") {
        pushConsole(data.level ?? "log", data.args ?? []);
        scrollConsoleToBottom();
        return;
      }
      if (data.type === "error") {
        const msg = data.message ?? "Unknown error";
        setLastError({ message: msg, stack: data.stack });
        pushConsole("error", [msg]);
        scrollConsoleToBottom();
        return;
      }
      if (data.type === "unhandledrejection") {
        const msg = data.message ?? "Unhandled rejection";
        pushConsole("error", ["Unhandled rejection:", msg]);
        scrollConsoleToBottom();
        return;
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [pushConsole, scrollConsoleToBottom]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "r" || e.key === "R") run();
      if (e.key === "c" || e.key === "C") clearConsole();
      if (e.key === "e" || e.key === "E") setEditEnabled((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clearConsole, next, prev, run]);

  useEffect(() => {
    // Auto-run on step change.
    setEditEnabled(false);
    setTab("js");
    setLastError(null);
    if (step.autorun === false) return;
    run();
  }, [run, step.autorun, step.id]);

  const editorValue = tab === "html" ? draft.html : tab === "css" ? draft.css : draft.js;
  const editorLabel = tab.toUpperCase();

  const headerPill = useMemo(
    () => (
      <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-border bg-white font-mono text-xs font-bold uppercase tracking-wider transform -rotate-1">
        Runnable Code Lab
      </div>
    ),
    [],
  );

  return (
    <div className="min-h-screen bg-bg text-fg font-body overflow-hidden selection:bg-accent selection:text-fg">
      <div className="noise-overlay" />

      <div className="sticky top-0 z-40 border-b-2 border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-3 justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              {headerPill}
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Step {stepIndex + 1} / {STEPS.length}
              </div>
            </div>
            <div className="mt-1 min-w-0">
              <div className="font-display text-xl uppercase leading-none truncate">
                {step.title}
              </div>
              {step.subtitle && (
                <div className="text-sm text-muted font-medium truncate">
                  {step.subtitle}
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={prev}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-2 px-3 py-2 border-2 border-border bg-card shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none font-mono text-xs uppercase tracking-wider"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            <button
              onClick={next}
              disabled={stepIndex >= STEPS.length - 1}
              className="inline-flex items-center gap-2 px-3 py-2 border-2 border-border bg-card shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:pointer-events-none font-mono text-xs uppercase tracking-wider"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="hidden md:block w-px h-8 bg-border/20 mx-1" />

            <button
              onClick={() => run()}
              className="inline-flex items-center gap-2 px-3 py-2 border-2 border-border bg-accent text-fg shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-3 py-2 border-2 border-border bg-card shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="border-2 border-border bg-card shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] overflow-hidden">
            <div className="border-b-2 border-border bg-bg px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {(["html", "css", "js"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={clsx(
                      "px-3 py-1.5 border-2 border-border font-mono text-xs font-bold uppercase tracking-wider transition-all",
                      tab === t
                        ? "bg-accent text-fg shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]"
                        : "bg-card text-fg shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none",
                    )}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyCurrentTab}
                  className="inline-flex items-center gap-2 px-3 py-2 border-2 border-border bg-card shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => setEditEnabled((v) => !v)}
                  className={clsx(
                    "inline-flex items-center gap-2 px-3 py-2 border-2 border-border shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider",
                    editEnabled ? "bg-warn/80 text-fg" : "bg-card text-fg",
                  )}
                >
                  {editEnabled ? (
                    <>
                      <Pencil className="w-4 h-4" /> Editing
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Locked
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {editorLabel} {editEnabled ? "(editable)" : "(read-only)"}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Keys: ← → Space | R run | C clear | E edit
                </div>
              </div>

              {editEnabled ? (
                <textarea
                  value={editorValue}
                  onChange={(e) =>
                    updateDraft(
                      tab === "html"
                        ? { html: e.target.value }
                        : tab === "css"
                          ? { css: e.target.value }
                          : { js: e.target.value },
                    )
                  }
                  className="w-full h-[420px] lg:h-[560px] resize-none rounded-lg border-2 border-border bg-white/60 text-fg font-mono text-xs leading-relaxed p-3 focus:outline-none focus:border-accent"
                  spellCheck={false}
                />
              ) : (
                <pre className="w-full h-[420px] lg:h-[560px] overflow-auto rounded-lg border-2 border-border bg-white/60 text-fg font-mono text-xs leading-relaxed p-3">
                  {editorValue}
                </pre>
              )}
            </div>
          </div>

          {/* Preview + Console */}
          <div className="border-2 border-border bg-card shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] overflow-hidden flex flex-col min-h-[640px]">
            <div className="border-b-2 border-border bg-bg px-4 py-3 flex items-center justify-between gap-3">
              <div className="font-mono text-xs font-bold uppercase tracking-wider">
                Preview
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearConsole}
                  className="inline-flex items-center gap-2 px-3 py-2 border-2 border-border bg-card shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all font-mono text-xs uppercase tracking-wider"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>

            <div className="relative bg-white border-b-2 border-border">
              <iframe
                ref={iframeRef}
                title="Runnable code preview"
                sandbox="allow-scripts"
                className="w-full h-[360px] lg:h-[420px]"
                srcDoc={srcDoc}
              />

              <AnimatePresence>
                {lastError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute top-3 left-3 right-3 border-2 border-border bg-danger/90 text-bg p-3 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]"
                  >
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest">
                      Runtime Error
                    </div>
                    <div className="mt-1 text-sm font-medium break-words">
                      {lastError.message}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 bg-fg text-bg">
              <div className="px-4 py-3 border-b border-bg/10 flex items-center justify-between">
                <div className="font-mono text-xs font-bold uppercase tracking-wider text-bg/80">
                  Console
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-bg/50">
                  {consoleEntries.length} lines
                </div>
              </div>

              <div
                ref={consoleRef}
                className="h-full max-h-[260px] overflow-auto px-4 py-3 font-mono text-xs leading-relaxed"
              >
                {consoleEntries.length === 0 ? (
                  <div className="text-bg/50">
                    No output yet. Press <span className="text-bg">R</span> to run.
                  </div>
                ) : (
                  consoleEntries.map((e) => (
                    <div key={e.id} className={clsx("whitespace-pre-wrap break-words", levelColor(e.level))}>
                      {e.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

