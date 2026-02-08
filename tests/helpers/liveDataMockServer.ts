import http from "node:http";
import { WebSocketServer } from "ws";

type LiveDataMockServer = {
  port: number;
  sseUrl: string;
  wsUrl: string;
  close: () => Promise<void>;
};

type StartOptions = {
  tickMs?: number;
};

const SSE_PATH = "/api/live";
const WS_PATH = "/api/live/ws";

const CHANNELS = ["Organic", "Paid", "Referral", "Direct", "Partners"] as const;
type Channel = (typeof CHANNELS)[number];

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

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

type LivePoint = {
  ts: number;
  activeUsers: number;
  signups: number;
  conversions: number;
  revenue: number;
  latencyP95: number;
  errorRate: number;
  channels: Record<Channel, number>;
};

function nextPoint(prev: LivePoint, now: number): LivePoint {
  const drifted = { ...prev.channels };
  for (const ch of CHANNELS) {
    drifted[ch] = clamp(drifted[ch] + rand(-0.009, 0.009), 0.03, 0.72);
  }
  const channels = normalizeShares(drifted);

  const activeUsers = clamp(
    Math.round(prev.activeUsers + rand(-20, 22)),
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
    clamp(prev.latencyP95 + rand(-16, 16) + spike, 150, 950),
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

export async function startLiveDataMockServer(
  options: StartOptions = {},
): Promise<LiveDataMockServer> {
  const tickMs = options.tickMs ?? 250;
  const sseClients = new Set<http.ServerResponse>();
  const wss = new WebSocketServer({ noServer: true });

  let current: LivePoint = {
    ts: Date.now(),
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

  const server = http.createServer((req, res) => {
    if (req.method !== "GET") {
      res.writeHead(405).end();
      return;
    }

    const pathname = new URL(req.url ?? "/", "http://127.0.0.1").pathname;

    if (pathname === "/health") {
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
        "cache-control": "no-store",
      });
      res.end(JSON.stringify({ ok: true, sse: SSE_PATH, ws: WS_PATH }));
      return;
    }

    if (pathname !== SSE_PATH) {
      res.writeHead(404, {
        "content-type": "application/json; charset=utf-8",
        "access-control-allow-origin": "*",
      });
      res.end(JSON.stringify({ error: "Not found" }));
      return;
    }

    res.writeHead(200, {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "access-control-allow-origin": "*",
      "x-accel-buffering": "no",
    });
    res.write(`: connected\n\n`);
    sseClients.add(res);
    req.on("close", () => sseClients.delete(res));
  });

  server.on("upgrade", (req, socket, head) => {
    const pathname = new URL(req.url ?? "/", "http://127.0.0.1").pathname;
    if (pathname !== WS_PATH) {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  const broadcast = (payload: unknown) => {
    const json = JSON.stringify(payload);
    for (const res of sseClients) {
      try {
        res.write(`data: ${json}\n\n`);
      } catch {
        sseClients.delete(res);
      }
    }
    for (const ws of wss.clients) {
      try {
        ws.send(json);
      } catch {
        // ignore
      }
    }
  };

  const interval = setInterval(() => {
    current = nextPoint(current, Date.now());
    broadcast(current);
  }, tickMs);

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to bind mock server port");
  }

  const port = address.port;
  const base = `http://127.0.0.1:${port}`;

  return {
    port,
    sseUrl: `${base}${SSE_PATH}`,
    wsUrl: `ws://127.0.0.1:${port}${WS_PATH}`,
    close: async () => {
      clearInterval(interval);
      for (const res of sseClients) {
        try {
          res.end();
        } catch {
          // ignore
        }
      }
      for (const ws of wss.clients) {
        try {
          ws.terminate();
        } catch {
          // ignore
        }
      }
      await new Promise<void>((resolve) => wss.close(() => resolve()));
      await new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      );
    },
  };
}
