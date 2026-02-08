# Deploy Live Data Hub (Hetzner + Coolify)

This repo contains a “live data hub” that supports:

- SSE stream: `GET /api/live`
- WebSocket: `GET /api/live/ws`
- Push ingest: `POST /api/live/push` (optional bearer auth via `LIVE_PUSH_TOKEN`)

Coolify doesn’t require a special “app name”. Pick any name you like (examples: `live-data-hub`, `mp-live-hub`). What matters is the **domain** you attach and the **env vars** you set.

## Recommended Topology (Simple)

- Frontend (this app): `https://presentations.yourdomain.com`
- Live data hub (separate service): `https://live-data.yourdomain.com`

This avoids path-based routing complexity and works reliably with SSE + WebSockets.

## 1) Deploy The Hub Service In Coolify

1. In Coolify: create a **new application/service** from this repo.
2. Build settings:
   - Build type: Dockerfile
   - Dockerfile: `Dockerfile.live-data`
3. Runtime settings:
   - Exposed port: `8787`
   - Environment:
     - `MODE=hub`
     - `PORT=8787`
     - (recommended) `LIVE_PUSH_TOKEN=<strong-random-token>`
4. Domain:
   - Attach `live-data.yourdomain.com` (Coolify/Traefik should terminate TLS and support WS)

Sanity check:

- `GET https://live-data.yourdomain.com/health` should return JSON with `ok: true`.

## 2) Wire The Frontend Defaults

The dashboard will only auto-fill URLs if you set Vite build-time env vars.

If you deploy the frontend via `Dockerfile`, set **build args** in Coolify:

- `VITE_LIVE_SSE_URL=https://live-data.yourdomain.com/api/live`
- `VITE_LIVE_WS_URL=wss://live-data.yourdomain.com/api/live/ws`

Note: these are **build args**, not runtime env (Vite bakes them into the bundle).

`Dockerfile` supports these build args now.

## 3) Push Real Data

Example (authorized):

```bash
curl -X POST "https://live-data.yourdomain.com/api/live/push" \
  -H "content-type: application/json" \
  -H "authorization: Bearer <LIVE_PUSH_TOKEN>" \
  -d '{
    "ts": "2026-02-08T12:00:00Z",
    "activeUsers": 912,
    "signups": 14,
    "conversions": 3,
    "revenue": 269,
    "latencyP95": 320,
    "errorRate": 0.021,
    "channels": { "Organic": 0.41, "Paid": 0.2, "Referral": 0.15, "Direct": 0.19, "Partners": 0.05 }
  }'
```

If you don’t set `LIVE_PUSH_TOKEN`, the push endpoint is open.

## Troubleshooting

- SSE connects but doesn’t update:
  - Confirm your payload is valid JSON and not buffered by a proxy.
  - Confirm `GET /api/live` stays open (SSE).
- WebSocket doesn’t connect:
  - Confirm the URL uses `wss://` when your site is `https://`.
  - Confirm Coolify/Traefik has WS support enabled for the domain (it usually is).
- Dashboard shows “Missing URL” for SSE/WS:
  - Set `VITE_LIVE_SSE_URL` / `VITE_LIVE_WS_URL` build args on the frontend, or pass `?source=sse&url=...` / `?source=ws&url=...`.
