# Presentation Blueprint: Live Data Dashboard (Ops KPI)

## Goal
Create a “present while it changes” dashboard mode: a full-screen operational KPI view that updates continuously, with presenter-friendly focus steps (scenes) that highlight the story behind the numbers.

This mode is designed for:
- Product / Growth demos (“here’s what’s happening right now”)
- Ops reviews (“are we within SLO / error budget?”)
- Fundraising / stakeholder updates (“growth + reliability at a glance”)

---

## Core Story Structure (Scenes)
The dashboard is always visible, but the presenter can step through **4 scenes** using **← / →**:

1. **Pulse**
   - **Focus:** Active Users KPI + Active Users trend chart
   - **Message:** “The system is alive — volume, direction, and momentum.”

2. **Acquisition**
   - **Focus:** Signups KPI + Conversion KPI + Channel charts
   - **Message:** “Where users come from, and how efficiently they convert.”

3. **Performance**
   - **Focus:** p95 Latency KPI + Error Rate KPI + Alerts + Activity Feed
   - **Message:** “Growth is only good if it stays reliable.”

4. **Revenue**
   - **Focus:** Revenue KPI + Conversion KPI + Activity Feed
   - **Message:** “Conversions → dollars, with the ‘why’ visible in the feed.”

Optional presenter control:
- **Focus Mode toggle (F):** Dim non-focused panels for clarity.

---

## Layout (Executive Summary Pattern)
Use an “executive summary” hierarchy:

### Header (Top Bar)
**Purpose:** Context + controls without stealing attention.

**Elements:**
- Title: “Live Data Dashboard”
- Stream status: “streaming / paused”
- Controls:
  - Play/Pause (Space)
  - Speed (1× / 2× / 5×)
  - Focus On/Off (F)
  - Reset (R)
- Scene navigator:
  - Prev/Next buttons
  - Scene title + subtitle (“what to say”)

### Row 1 — Headline KPIs (6 cards)
**Purpose:** “At a glance” understanding.

**Cards (left → right):**
- Active Users (now) + sparkline
- Signups (per tick) + sparkline
- Conversion (signups → paid) + sparkline
- Revenue (per tick) + sparkline
- p95 Latency (ms) + sparkline
- Error Rate (% 5xx) + sparkline

**KPI card anatomy:**
- Label (mono, uppercase)
- Value (large)
- Value hint (small)
- Delta (colored; invert tone for latency & errors)
- Sparkline (filled area + stroke)

### Row 2 — Charts (3 columns)
**Left (wide):**
- Active Users line chart (last 60s)
- Min/Max footer for context

**Middle (stacked):**
- Donut: Traffic mix (live)
- Bar chart: Signups by channel (last 60s)

**Right (stacked):**
- Alerts (rule-based badges)
- Activity feed (recent events, time-stamped)

---

## Visual Style
**Theme:** “Neon ops” on deep slate background.

- Background: dark slate with subtle radial glows
- Cards: translucent panels with thin borders, soft inner stroke
- Accent: cyan for trends/focus ring
- Good: emerald
- Warning: amber
- Danger: rose
- Typography:
  - Title: display font (uppercase)
  - UI labels: mono
  - Values: bold sans

---

## Interaction Spec
Keyboard:
- **Space**: pause/resume stream
- **← / →**: previous/next scene
- **F**: toggle focus mode (dims non-focused panels)
- **R**: reset the simulation

Motion:
- Values animate on change (quick rise/fade)
- Charts update smoothly at tick cadence
- Focus ring + subtle emphasis on focused panels

---

## Data Model (Demo Stream)
This mode can be driven by simulated data (default) or later wired to real telemetry.

**Per-tick metrics:**
- Active users
- Signups
- Conversions
- Revenue
- p95 latency
- Error rate
- Channel shares (Organic/Paid/Referral/Direct/Partners)

**Events feed generation:**
- Trial started
- Conversion
- Latency warning / 5xx spike
- Deploy notice

**Alert rules (example):**
- Error rate > 8% → danger
- Error rate > 4.5% → warn
- p95 latency > 450ms → warn
- p95 latency > 620ms → danger
- Conversion < 12% → warn

