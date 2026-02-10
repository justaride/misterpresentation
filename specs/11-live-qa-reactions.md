# Live Q&A + Reactions Deck (`live-qa-reactions`)

A collaborative, room-based presentation mode:

- **Host view**: a normal slide deck with a live sidebar for audience Q&A and reactions.
- **Audience view** (phone-friendly): send quick reactions, submit questions, and upvote questions.

This mode is designed as a reusable template for real talks, workshops, and demos.

## Roles

Controlled via query params:

- `role=host` (default)
- `role=audience`

Both roles share a `room` code (e.g. `room=ABC123`).

## Realtime Transport

Uses the existing Live Data Hub as a generic broadcast bus:

- Receive messages over **WebSocket** (`ws` param or `VITE_LIVE_WS_URL`)
- Send messages via **HTTP push** (`push` param, derived from `ws`, or `POST /api/live/push`)

All messages include `room`, and clients ignore messages for other rooms.

## Message Schema (JSON)

All messages include:

```json
{ "type": "...", "room": "ABC123", "from": "client-id", "ts": 1730000000000 }
```

Types:

- `presence`: `{ role: "host" | "audience" }`
- `nav`: `{ slide: number }`
- `reaction`: `{ reaction: "clap" | "lol" | "mindblown" | "heart" | "confused", slide: number }`
- `question`: `{ id: string, text: string, slide: number }`
- `upvote`: `{ questionId: string }`
- `reset`: `{}`
- `sync`: `{ slide: number, questions: Question[], votesByQuestion: Record<string, Record<string, true>>, pinnedQuestionId?: string }`

## Core UX

Host:

- Navigate slides (buttons + arrow keys).
- Copy audience join link (same page with `role=audience`).
- See participant counts (based on recent `presence` pings).
- Live reaction ticker.
- Questions board sorted by upvotes, with optional pin.

Audience:

- Reaction buttons (single-tap).
- Question input + submit.
- Upvote questions.

## Acceptance Criteria

- Audience actions (reaction, question, upvote) show on host within ~1s on local hub.
- Late joiners receive current slide + existing questions via periodic host `sync`.
- Reconnect: if WS disconnects, it retries with backoff and resumes receiving.
- Playwright E2E test proves:
  - Audience submits a question and host sees it.
  - Upvote increments on host.
  - Host slide navigation propagates to audience.

