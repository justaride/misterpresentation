import http from "node:http";
import { WebSocketServer } from "ws";

type LiveQaHubMockServer = {
  port: number;
  wsUrl: string;
  pushUrl: string;
  close: () => Promise<void>;
};

const WS_PATH = "/api/live/ws";
const PUSH_PATH = "/api/live/push";

function json(res: http.ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type, authorization",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function readBody(req: http.IncomingMessage, maxBytes = 256_000): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error("Body too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

export async function startLiveQaHubMockServer(): Promise<LiveQaHubMockServer> {
  const wss = new WebSocketServer({ noServer: true });

  const broadcast = (payload: unknown) => {
    const text = JSON.stringify(payload);
    for (const ws of wss.clients) {
      try {
        ws.send(text);
      } catch {
        // ignore
      }
    }
  };

  const server = http.createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "content-type, authorization",
        "cache-control": "no-store",
      });
      res.end();
      return;
    }

    if (req.method === "GET" && url.pathname === "/health") {
      json(res, 200, { ok: true, ws: WS_PATH, push: PUSH_PATH });
      return;
    }

    if (req.method === "POST" && url.pathname === PUSH_PATH) {
      void (async () => {
        try {
          const body = await readBody(req);
          if (!body) {
            json(res, 400, { ok: false, error: "Missing body" });
            return;
          }
          const parsed = JSON.parse(body);
          broadcast(parsed);
          json(res, 200, { ok: true });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Bad request";
          json(res, msg === "Body too large" ? 413 : 400, { ok: false, error: msg });
        }
      })();
      return;
    }

    json(res, 404, { ok: false, error: "Not found" });
  });

  server.on("upgrade", (req, socket, head) => {
    const url = new URL(req.url ?? "/", "http://127.0.0.1");
    if (url.pathname !== WS_PATH) {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to bind mock server port");
  }

  const port = address.port;
  const base = `http://127.0.0.1:${port}`;

  return {
    port,
    wsUrl: `ws://127.0.0.1:${port}${WS_PATH}`,
    pushUrl: `${base}${PUSH_PATH}`,
    close: async () => {
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

