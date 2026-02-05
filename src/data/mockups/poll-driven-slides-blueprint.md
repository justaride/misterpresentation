# Presentation Blueprint: Poll-Driven Slides (Live Audience)

## Goal
Turn “slides” into a live room instrument: the audience votes, the slide updates in real time, and the presenter narrates the results.

This mode is designed for:
- Workshops (“decide what we cover next”)
- Keynotes (“ask the room, then tell the story”)
- Demos (“interactive moment without any backend”)

---

## Core Concept
Each slide is a poll:
- A bold question
- 3–5 options
- A live results panel with animated bars

Real-time sync is achieved via **BroadcastChannel** (same-origin, cross-tab).

---

## Roles
### Host
- Can navigate slides (← / →)
- Can reset votes (R)
- Broadcasts periodic sync snapshots
- Shares an “Audience link” with `?role=audience&session=CODE`

### Audience
- Can vote (1–N)
- Receives slide navigation + sync updates

---

## Slide Flow (Example Deck)
1. “What should we ship next?”
2. “What matters most in a web presentation?”
3. “Where should the story live?”
4. “How spicy should the motion be?”

---

## Layout
Two-column presenter-friendly layout:

### Left Column (Slide)
- “Live poll” badge
- Big uppercase question
- Short subtitle
- Option cards (2×2 grid on desktop)
  - Number badge (1–N)
  - Option title
  - “press 1” hint
  - Selected state highlight

### Right Column (Results + Note)
- Results panel
  - Votes count
  - One bar per option
  - Winner label (“leading”)
  - Percent + count
- Presenter note panel
  - Reminders / controls
  - Audience link (copyable)
  - Online count

---

## Interaction Spec
Keyboard:
- **1..N** vote
- **← / →** (host) previous/next slide
- **R** (host) reset votes

UI:
- Role toggle (Host/Audience)
- Copy audience link button
- Prev/Next buttons

Motion:
- Slide transitions (fade + horizontal move)
- Bars animate width using spring
- Selected option has subtle glow/outline

---

## Data + Sync Model
### Session
Use `session` query param to isolate rooms:
- Host generates a short session code if missing.

### Messages (BroadcastChannel)
- `presence` (heartbeat): `{ from, ts, role }`
- `vote`: `{ from, pollId, option, ts }`
- `nav`: `{ slide, ts }` (host only)
- `reset`: clear votes (host only)
- `sync`: snapshot `{ slide, votersByPoll, ts }` (host every ~2s)

### Vote semantics
Per poll, each client has **one active vote** (vote changes overwrite previous).

---

## Visual Style
“Neon ops” theme (consistent with Live Data mode):
- Background: deep slate + subtle grid
- Accent: cyan/violet
- Winner: emerald highlight
- Fonts: display for titles, mono for UI labels

