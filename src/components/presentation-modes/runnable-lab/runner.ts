export type ConsoleLevel = "log" | "info" | "warn" | "error";

export type HostToSandboxMessage =
  | { type: "ping"; sessionId: string }
  | { type: "dispose"; sessionId: string }
  | { type: "clear"; sessionId: string };

export type SandboxToHostMessage =
  | { type: "ready"; sessionId: string }
  | { type: "console"; sessionId: string; level: ConsoleLevel; args: string[] }
  | { type: "error"; sessionId: string; message: string; stack?: string }
  | { type: "unhandledrejection"; sessionId: string; message: string };

export function createSessionId(): string {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `s_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`
  );
}

function escapeHtml(raw: string) {
  return String(raw ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsStringLiteral(raw: string) {
  // Safely embed user code inside a <script> tag without closing it.
  return String(raw ?? "").replace(/<\/script>/gi, "<\\/script>");
}

export function buildSrcDoc({
  html,
  css,
  js,
  sessionId,
}: {
  html: string;
  css: string;
  js: string;
  sessionId: string;
}): string {
  const csp = [
    "default-src 'none'",
    "img-src data:",
    "style-src 'unsafe-inline'",
    "script-src 'unsafe-inline'",
    "connect-src 'none'",
    "font-src data:",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join("; ");

  // NOTE: iframe will be sandboxed without allow-same-origin, so origin is null.
  // We rely on (source window + sessionId) validation on the host.
  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Security-Policy" content="${escapeHtml(csp)}" />
    <style>
      :root { color-scheme: light; }
      html, body { height: 100%; }
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
      /* A tiny default so empty HTML doesn't look broken. */
      .__mp_empty { padding: 24px; color: #111827; }
      ${css ?? ""}
    </style>
  </head>
  <body>
    ${html && String(html).trim() ? html : `<div class="__mp_empty">No HTML provided.</div>`}

    <script>
      (function() {
        const SESSION_ID = ${JSON.stringify(sessionId)};
        const send = (payload) => {
          try { parent.postMessage(Object.assign({ sessionId: SESSION_ID }, payload), "*"); } catch {}
        };

        const toText = (v) => {
          try {
            if (v == null) return String(v);
            if (v instanceof Error) return v.stack || v.message || String(v);
            if (typeof v === "string") return v;
            if (typeof v === "number" || typeof v === "boolean" || typeof v === "bigint") return String(v);
            if (typeof v === "function") return "[function " + (v.name || "anonymous") + "]";
            if (typeof v === "symbol") return v.toString();
            try { return JSON.stringify(v); } catch {}
            return Object.prototype.toString.call(v);
          } catch {
            return "[unprintable]";
          }
        };

        const wrapConsole = (level) => {
          const original = console[level] ? console[level].bind(console) : null;
          console[level] = function(...args) {
            send({ type: "console", level, args: args.map(toText) });
            if (original) original(...args);
          };
        };

        ["log","info","warn","error"].forEach(wrapConsole);

        window.addEventListener("error", (e) => {
          const message = e && e.message ? e.message : "Unknown error";
          const stack = e && e.error && e.error.stack ? e.error.stack : undefined;
          send({ type: "error", message, stack });
        });

        window.addEventListener("unhandledrejection", (e) => {
          const reason = e && e.reason;
          const message = reason instanceof Error ? (reason.stack || reason.message) : toText(reason);
          send({ type: "unhandledrejection", message });
        });

        // Prevent modal dialogs from blocking the talk.
        window.alert = (msg) => console.warn("alert blocked:", msg);
        window.confirm = (msg) => (console.warn("confirm blocked:", msg), false);
        window.prompt = (msg) => (console.warn("prompt blocked:", msg), null);

        // Basic host handshake.
        window.addEventListener("message", (evt) => {
          const msg = evt && evt.data;
          if (!msg || typeof msg !== "object") return;
          if (msg.sessionId !== SESSION_ID) return;
          if (msg.type === "ping") send({ type: "ready" });
          if (msg.type === "dispose") {
            // Best-effort cleanup; the document will be replaced on re-run anyway.
            send({ type: "console", level: "info", args: ["Disposed sandbox session"] });
          }
        });

        send({ type: "ready" });
        window.addEventListener("load", () => send({ type: "ready" }));
      })();
    </script>

    <script>
      (function() {
        try {
          ${jsStringLiteral(js)}
        } catch (e) {
          console.error(e);
        }
      })();
    </script>
  </body>
</html>`;
}
