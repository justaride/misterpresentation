# Deploy Live Data Hub (Fly.io)

The Live Data Dashboard can ingest real metrics via SSE or WebSocket. This guide deploys the hub as a small always-on Node service on Fly.io.

## What You Deploy

- SSE stream: `GET /api/live`
- WebSocket: `GET /api/live/ws`
- Push endpoint (your backend posts updates): `POST /api/live/push`
- Optional auth: set `LIVE_PUSH_TOKEN` and send `Authorization: Bearer <token>`

## Prereqs

- `flyctl` installed and authenticated
- Docker installed (or use Fly remote build)

## Deploy (Hub)

1. Create the app:

```bash
fly apps create <app-name>
```

2. Set an auth token for the push endpoint (recommended):

```bash
fly secrets set LIVE_PUSH_TOKEN="<strong-random-token>" -a <app-name>
```

3. Deploy:

```bash
fly deploy -c fly.live-data.toml -a <app-name>
```

## Wire The Frontend

Set these env vars on your frontend deploy (Vercel or similar) and redeploy:

- `VITE_LIVE_SSE_URL` = `https://<app-name>.fly.dev/api/live`
- `VITE_LIVE_WS_URL` = `wss://<app-name>.fly.dev/api/live/ws`

Then open the Live Data Dashboard and select `SSE` or `WS` without typing a URL.

## Push Real Data

Example payload (a single point; values mirror the dashboard model):

```bash
curl -X POST "https://<app-name>.fly.dev/api/live/push" \
  -H "content-type: application/json" \
  -H "authorization: Bearer <token>" \
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

Notes:

- `errorRate` can be `0..1` or a percent `0..100` (the UI will coerce).
- You can also POST objects shaped like `{ "type": "event", ... }` or `{ "events": [...] }` and the dashboard will add them to the activity feed.

## Ops Notes

- Long-lived connections: SSE/WS will keep the Fly machine “in use”. If you enable auto-sleep, clients can get disconnected.
- CORS is permissive (`*`) right now. If you need origin restrictions, we can tighten it (and/or move auth to mTLS / signed payloads).
