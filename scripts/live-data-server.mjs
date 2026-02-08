import http from "node:http";
import { URL } from "node:url";
import WebSocket, { WebSocketServer } from "ws";

const PORT = Number(process.env.PORT ?? 8787);
const TICK_MS = Number(process.env.TICK_MS ?? 1000);
const MODE = (process.env.MODE ?? "generator").toLowerCase();
const SSE_PATH = "/api/live";
const WS_PATH = "/api/live/ws";
const PUSH_PATH = "/api/live/push";
const PUSH_TOKEN = process.env.LIVE_PUSH_TOKEN ?? "";
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES ?? 256_000);

const CHANNELS = ["Organic", "Paid", "Referral", "Direct", "Partners"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeShares(shares) {
  const total = CHANNELS.reduce((sum, ch) => sum + (shares[ch] ?? 0), 0);
  const safeTotal = total > 0 ? total : 1;
  const out = {};
  for (const ch of CHANNELS) out[ch] = (shares[ch] ?? 0) / safeTotal;
  return out;
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function buildInitialPoint(now) {
  return {
    ts: now,
    activeUsers: 820,
    signups: 8,
    conversions: 2,
    revenue: 180,
    latencyP95: 240,
    errorRate: 0.012,
    channels: normalizeShares({
      Organic: 0.42,
      Paid: 0.21,
      Referral: 0.14,
      Direct: 0.17,
      Partners: 0.06,
    }),
  };
}

function nextPoint(prev, now) {
  const prevChannels = prev.channels ?? {
    Organic: 0.4,
    Paid: 0.22,
    Referral: 0.14,
    Direct: 0.18,
    Partners: 0.06,
  };

  const drifted = { ...prevChannels };
  for (const ch of CHANNELS) {
    drifted[ch] = clamp((drifted[ch] ?? 0) + rand(-0.009, 0.009), 0.03, 0.72);
  }
  const channels = normalizeShares(drifted);

  const activeUsers = clamp(
    Math.round((prev.activeUsers ?? 800) + rand(-20, 22)),
    120,
    2400,
  );

  const signups = clamp(Math.round(activeUsers / 118 + rand(0, 9)), 0, 160);
  const conversions = clamp(
    Math.round(signups * (0.17 + rand(-0.05, 0.05))),
    0,
    signups,
  );

  const aov = 49 + Math.round(rand(0, 80));
  const revenue = conversions * aov;

  const spike = Math.random() < 0.05 ? 170 + Math.random() * 260 : 0;
  const latencyP95 = Math.round(
    clamp((prev.latencyP95 ?? 260) + rand(-16, 16) + spike, 150, 950),
  );

  const errorRate = clamp(
    0.007 +
      Math.random() * 0.012 +
      (latencyP95 > 500 ? 0.02 : 0) +
      (Math.random() < 0.02 ? 0.03 : 0),
    0.002,
    0.16,
  );

  return {
    ts: now,
    activeUsers,
    signups,
    conversions,
    revenue,
    latencyP95,
    errorRate,
    channels,
  };
}

function parseUrl(req) {
  const host = req.headers.host ?? "127.0.0.1";
  return new URL(req.url ?? "/", `http://${host}`);
}

const sseClients = new Set();
const wsClients = new Set();

const wss = new WebSocketServer({ noServer: true });
wss.on("connection", (ws) => {
  wsClients.add(ws);
  ws.on("close", () => wsClients.delete(ws));
  ws.on("error", () => wsClients.delete(ws));
});

function broadcast(obj) {
  const json = JSON.stringify(obj);

  for (const res of sseClients) {
    try {
      res.write(`data: ${json}\n\n`);
    } catch {
      sseClients.delete(res);
    }
  }

  for (const ws of wsClients) {
    try {
      if (ws.readyState === WebSocket.OPEN) ws.send(json);
    } catch {
      wsClients.delete(ws);
    }
  }
}

function commonCorsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
  };
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    ...commonCorsHeaders(),
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function bearerToken(req) {
  const raw = req.headers.authorization;
  if (!raw) return "";
  const match = String(raw).match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : "";
}

function isAuthorized(req) {
  if (!PUSH_TOKEN) return true;
  return bearerToken(req) === PUSH_TOKEN;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error("Body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });
    req.on("error", reject);
  });
}

const server = http.createServer((req, res) => {
  const url = parseUrl(req);

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      ...commonCorsHeaders(),
      "cache-control": "no-store",
    });
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(res, 200, {
      ok: true,
      mode: MODE,
      sse: SSE_PATH,
      ws: WS_PATH,
      push: PUSH_PATH,
      auth: PUSH_TOKEN ? "bearer" : "none",
    });
    return;
  }

  if (req.method === "GET" && url.pathname === SSE_PATH) {
    res.writeHead(200, {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      ...commonCorsHeaders(),
      "x-accel-buffering": "no",
    });

    res.write(`: connected\n\n`);
    sseClients.add(res);

    req.on("close", () => {
      sseClients.delete(res);
    });
    return;
  }

  if (req.method === "POST" && url.pathname === PUSH_PATH) {
    void (async () => {
      if (!isAuthorized(req)) {
        sendJson(res, 401, { ok: false, error: "Unauthorized" });
        return;
      }

      try {
        const body = await readBody(req);
        if (!body) {
          sendJson(res, 400, { ok: false, error: "Missing body" });
          return;
        }
        const parsed = JSON.parse(body);
        broadcast(parsed);
        sendJson(res, 200, { ok: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Bad request";
        const status = msg === "Body too large" ? 413 : 400;
        sendJson(res, status, { ok: false, error: msg });
      }
    })();
    return;
  }

  sendJson(res, 404, { error: "Not found", paths: [SSE_PATH, WS_PATH, PUSH_PATH] });
});

server.on("upgrade", (req, socket, head) => {
  const url = parseUrl(req);
  if (url.pathname !== WS_PATH) {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

let current = buildInitialPoint(Date.now());

const tick = () => {
  current = nextPoint(current, Date.now());
  broadcast(current);
};

const heartbeat = () => {
  for (const res of sseClients) {
    try {
      res.write(`: ping\n\n`);
    } catch {
      sseClients.delete(res);
    }
  }
};

server.listen(PORT, () => {
  console.log(
    `Live data server (${MODE}): http://127.0.0.1:${PORT}\nSSE: http://127.0.0.1:${PORT}${SSE_PATH}\n WS: ws://127.0.0.1:${PORT}${WS_PATH}\nPUSH: http://127.0.0.1:${PORT}${PUSH_PATH}`,
  );
});

if (MODE === "generator") setInterval(tick, TICK_MS);
setInterval(heartbeat, 15_000);
