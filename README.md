# Mister Presentations

A showcase of creative, interactive, and experimental web presentation modes built with React, Vite, Framer Motion, and Tailwind CSS.

**Live:** [mister-presentations.vercel.app](https://mister-presentations.vercel.app)

## Overview

This project explores various ways to present information on the web, moving beyond standard slide decks into scroll-driven narratives, typography-focused experiences, and interactive visualizations.

## Presentation Modes

### 1. The Takahashi Method

- **Style:** Rapid-fire, high-impact typography.
- **Features:** Big text, high contrast, synchronized with speech rhythm.
- **Examples:**
  - _Demo:_ 22-slide startup pitch narrative ("Imagine a world where meetings don't suck.")
  - _Full Example:_ 50-slide manifesto on visual storytelling.

### 2. Scroll-Snap Deck

- **Style:** Vertical, full-screen sections with native scrolling physics.
- **Slides:** 10 sections
- **Features:**
  - CSS Scroll Snap for "buttery" friction.
  - Progress tracking.
  - Mobile-first, accessibility, color palette, and performance sections.
- **Example:** "The Art of Vertical Storytelling"

### 3. Typewriter Narrative

- **Style:** Noir / Detective Case File.
- **Slides:** 12 slides
- **Features:**
  - Character-by-character text reveal.
  - "Dialogue" mode for interrogation scenes.
  - Evidence locker, accomplices list, stakeout, and confession scenes.
  - Retro paper textures and stamp effects.
- **Example:** "Case File: #404 - The Missing Pixel"

### 4. Reveal.js Classic

- **Style:** Standard corporate slide deck (satire).
- **Slides:** 9 horizontal + 3 vertical sub-slides
- **Features:**
  - 2D Navigation (Horizontal & Vertical slides).
  - Overview mode (Press 'O').
  - Roadmap timeline, org chart, financials, and testimonials.
  - Progress bar and speaker notes.
- **Example:** "Q3 Strategic Performance Review"

### 5. Lottie Storyboard

- **Style:** Animated user journey.
- **Slides:** 8 steps with 5 unique Lottie animations
- **Features:**
  - Per-step inline vector animations (spinner, heart, rocket, star, checkmark).
  - Smooth background color transitions.
  - Storyboard-style narrative: overwhelm, spark, liftoff, encore.
- **Example:** "User Journey: The Happy Path"

### 6. MDX Presentation

- **Style:** Technical talk / Documentation.
- **Slides:** 10 slides
- **Features:**
  - Embedded interactive React components (counter, focus input).
  - useRef, useMemo, Hook Patterns, and Class vs Hooks slides.
  - Professional code syntax highlighting.
- **Example:** "Introduction to React Hooks"

### 7. Parallax Storyteller

- **Style:** Immersive Scrollytelling.
- **Depth Zones:** 8 (surface to 10,000m)
- **Features:**
  - Depth-based parallax layers with 8-stop gradient.
  - Whale, submarine, and anglerfish SVG creatures.
  - Mesopelagic, Bathyal, and Hadal zones.
  - Sticky scroll depth gauge.
- **Example:** "The Deep Sea Expedition"

### 8. Live Code Walkthrough

- **Style:** Educational coding tutorial.
- **Steps:** 8 (including anti-pattern, testing, debounced hook)
- **Features:**
  - Step-by-step refactoring guide.
  - Side-by-side code and live preview.
  - Line highlighting and contextual lesson notes.
- **Example:** "Building a Custom React Hook"

### 9. NECC x Grit.ai Intro

- **Style:** Nordic light scroll-snap presentation.
- **Slides:** 13
- **Features:**
  - Light stone/green Nordic color palette.
  - SVG radial ecosystem mind map (responsive: full map on desktop, vertical list on mobile).
  - Framer Motion scroll animations and progress bar.
  - Norwegian language content covering circular construction across 5 Nordic countries.
- **Example:** "NECC — Nordic Ecosystem for Circular Construction"

### 10. Live Data Dashboard

- **Style:** Real-time ops / KPI dashboard.
- **Scenes:** 4 (Pulse, Acquisition, Performance, Revenue)
- **Features:**
  - Live-updating KPI cards with sparklines.
  - Active users trend chart + traffic mix + signups by channel.
  - Rule-based alerts and a rolling activity feed.
  - Presenter controls: pause, speed, focus mode, reset + keyboard shortcuts.

### 11. Poll-Driven Slides

- **Style:** Audience-interactive polling.
- **Slides:** 4 polls (demo deck)
- **Features:**
  - Real-time voting synced across tabs (BroadcastChannel).
  - Animated result bars and “leading” highlight.
  - Host/Audience roles with shareable audience link + reset + slide controls.

## Upcoming Modes

- **Kinetic Typography**
- **3D Globe Explorer**
- **GSAP Showreel**
- **Branching Narrative**
- And more...

## Tech Stack

- **Framework:** React 19 + Vite 7
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion, Lottie React
- **Code:** React Syntax Highlighter (Prism)
- **Icons:** Lucide React

## Development

```bash
npm install
npm run dev
```

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start dev server                    |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview production build locally    |

## Project Structure

```
src/
  components/
    presentation-modes/   # All presentation components
  data/
    examples.ts           # Example metadata (available + coming-soon)
    presentation-content.ts # Full Takahashi slide data
    mockups/              # Blueprint docs for each mode
  pages/                  # Route pages (gallery + viewer)
  hooks/                  # Shared hooks
  types.ts                # Shared types
```

## Deployment

Hosted on Vercel. Push to `master` or run:

```bash
vercel --prod
```
