# Presentation Blueprint: Timeline Explorer

## ID
`timeline-explorer`

## Overview
Horizontal scrolling timeline of web history from 1989-2025 with era color-coding, expandable events, and branching sub-timelines.

## Metadata
- Category: `scroll-driven`
- Format: `scrollytelling`
- Difficulty: `intermediate`
- Tags: `framer-motion`, `horizontal-scroll`, `timeline`

## Visual Style
- Typography: `var(--font-display)` for big headings, `var(--font-mono)` for UI labels, `var(--font-body)` for supporting text.
- Palette: deep background with a scroll progress accent; large section titles with parallax depth cues.

## Navigation & Controls
- Scroll: native scrolling drives progress.
- Replay: scroll back up to re-run reveals.

## Slide Breakdown

## Slide 1 – The Origins

**Purpose:** Hook the audience and establish the premise.

**Content:**

**Headline (Center, Huge):**
"The Origins"

**Subheading (Center, Medium):**
"1989–1998"

**Body Beats:**
- 1989 — World Wide Web Invented
- 1993 — Mosaic Browser
- 1994 — Netscape Navigator
- 1995 — JavaScript Created
- 1998 — Google Founded

**Layout:**
- Headline: center, dominant element.
- Supporting text: below headline, max-width ~60ch for readability.
- Navigation hint: bottom corner in mono (keys / progress).

**Typography:**
- Headline: `var(--font-display)`, uppercase, extra-bold, 72–120pt depending on length.
- Supporting text: `var(--font-body)` or `var(--font-mono)` depending on mode.

**Visual:**
- Background: mode-appropriate texture/gradient; keep contrast high.
- Decorative motif: one recurring element (progress bar, scanlines, grid, foil glare, etc.).

**Transition from previous slide:**
Fade in from black, then reveal the headline.

---
## Slide 2 – Dot-Com Era

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Dot-Com Era"

**Subheading (Center, Medium):**
"1999–2005"

**Body Beats:**
- 1999 — AJAX Emerges
- 2004 — Web 2.0 & Social Media
- 2005 — Ruby on Rails

**Layout:**
- Headline: center, dominant element.
- Supporting text: below headline, max-width ~60ch for readability.
- Navigation hint: bottom corner in mono (keys / progress).

**Typography:**
- Headline: `var(--font-display)`, uppercase, extra-bold, 72–120pt depending on length.
- Supporting text: `var(--font-body)` or `var(--font-mono)` depending on mode.

**Visual:**
- Background: mode-appropriate texture/gradient; keep contrast high.
- Decorative motif: one recurring element (progress bar, scanlines, grid, foil glare, etc.).

**Transition from previous slide:**
Quick cross-fade with a subtle slide/scale emphasis on the new headline.

---
## Slide 3 – Web 2.0

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Web 2.0"

**Subheading (Center, Medium):**
"2006–2015"

**Body Beats:**
- 2006 — jQuery Released
- 2008 — Chrome & V8 Engine
- 2009 — Node.js
- 2010 — npm & Mobile Web
- 2013 — React by Facebook
- 2014 — TypeScript Gains Traction
- 2015 — ES6 / ES2015

**Layout:**
- Headline: center, dominant element.
- Supporting text: below headline, max-width ~60ch for readability.
- Navigation hint: bottom corner in mono (keys / progress).

**Typography:**
- Headline: `var(--font-display)`, uppercase, extra-bold, 72–120pt depending on length.
- Supporting text: `var(--font-body)` or `var(--font-mono)` depending on mode.

**Visual:**
- Background: mode-appropriate texture/gradient; keep contrast high.
- Decorative motif: one recurring element (progress bar, scanlines, grid, foil glare, etc.).

**Transition from previous slide:**
Quick cross-fade with a subtle slide/scale emphasis on the new headline.

---
## Slide 4 – Modern Web

**Purpose:** Close the loop with a memorable ending and a clear takeaway.

**Content:**

**Headline (Center, Huge):**
"Modern Web"

**Subheading (Center, Medium):**
"2016–2025"

**Body Beats:**
- 2016 — Yarn & Create React App
- 2018 — Deno Announced
- 2020 — Vite & Svelte 3
- 2022 — React Server Components
- 2023 — AI-Assisted Coding
- 2025 — The AI-Native Web

**Layout:**
- Headline: center, dominant element.
- Supporting text: below headline, max-width ~60ch for readability.
- Navigation hint: bottom corner in mono (keys / progress).

**Typography:**
- Headline: `var(--font-display)`, uppercase, extra-bold, 72–120pt depending on length.
- Supporting text: `var(--font-body)` or `var(--font-mono)` depending on mode.

**Visual:**
- Background: mode-appropriate texture/gradient; keep contrast high.
- Decorative motif: one recurring element (progress bar, scanlines, grid, foil glare, etc.).

**Transition from previous slide:**
Quick cross-fade with a subtle slide/scale emphasis on the new headline.

---
## Implementation Notes

- Keep each slide to one primary idea. If a slide needs two ideas, split it.
- Prefer reduced-motion friendly variants (skip continuous animations, keep content readable).
- Ensure keyboard navigation always works (including when focus is inside inputs).
