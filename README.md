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
  - Data sources: SIM (default), SSE, WS (switch in the header; shareable via `source` + `url` query params).
  - Local mock stream: `npm run live:data:server` (SSE `http://127.0.0.1:8787/api/live`, WS `ws://127.0.0.1:8787/api/live/ws`).
  - Hub mode (push real data): `npm run live:data:hub` then `POST http://127.0.0.1:8787/api/live/push` (optional auth via `LIVE_PUSH_TOKEN`).
  - Container: `docker build -f Dockerfile.live-data -t live-data-hub .`
  - Production defaults: set `VITE_LIVE_SSE_URL` / `VITE_LIVE_WS_URL` so selecting SSE/WS works without manual URL entry.
  - Presenter controls: pause, speed, focus mode, reset + keyboard shortcuts.

### 11. Poll-Driven Slides

- **Style:** Audience-interactive polling.
- **Slides:** 4 polls (demo deck)
- **Features:**
  - Real-time voting synced across tabs (BroadcastChannel).
  - Animated result bars and “leading” highlight.
  - Host/Audience roles with shareable audience link + reset + slide controls.

### 12. Framer Motion Playground

- **Style:** Interactive animation sandbox.
- **Demos:** 5 (Layout, Gestures, Springs, Stagger, Morphing)
- **Features:**
  - Shared layout animations with highlight follow.
  - Drag, hover, and tap gesture demos.
  - Configurable spring physics (bouncy, smooth, stiff).
  - Stagger grid with enter/exit orchestration.
  - Shape morphing via border-radius transitions.

### 13. Kinetic Typography

- **Style:** Motion-driven text art.
- **Slides:** 6 animation styles
- **Features:**
  - Explode: letters scatter from random positions.
  - Wave: continuous sinusoidal bounce.
  - Cascade: word-by-word drop with perspective.
  - Spiral: circular orbit convergence.
  - Glitch: RGB split with tremor loop.
  - Bounce: spring-loaded letter entry.

### 14. Branching Narrative

- **Style:** Choose-your-own-adventure.
- **Nodes:** 11 story nodes with 6 endings
- **Features:**
  - Decision-tree startup story (scale vs optimize, pitch vs cut, etc.).
  - Breadcrumb trail showing path history.
  - Keyboard shortcuts ([1]/[2] to choose, Backspace to go back, R to restart).

### 15. Custom Slide Transitions

- **Style:** Transition showcase deck.
- **Slides:** 6 (one per transition type)
- **Features:**
  - Fade, slide, zoom, 3D flip, morph (border-radius), and clip-path wipe.
  - Each slide labels its own transition type and CSS property.
  - Perspective container for 3D effects.

### 16. Scroll Timeline Showcase

- **Style:** Scroll-driven parallax.
- **Sections:** 5 + hero + outro
- **Features:**
  - Alternating left/right parallax sections with scroll-linked transforms.
  - Gradient progress bar (blue → purple → rose).
  - Code snippet previews for CSS scroll-timeline, View Transitions API, and Framer Motion fallback.

### 17. Presenter Mode Deck

- **Style:** Professional speaker deck.
- **Slides:** 6
- **Features:**
  - Live timer (per-slide + total) with color coding (green → yellow → red).
  - Toggleable speaker notes side panel (N key).
  - Browser Fullscreen API integration (F key).
  - Spring-physics slide transitions.

### 18. GSAP Showreel

- **Style:** GSAP ScrollTrigger demo reel.
- **Sections:** 6 (hero, ScrollTrigger, timelines, staggers, physics, finale)
- **Features:**
  - Scrub-linked animations: title reveals, shape staggers, bar charts.
  - Gradient progress bar synced to scroll.
  - Proper cleanup via `gsap.context().revert()` on unmount.

### 19. 3D Globe Explorer

- **Style:** Interactive 3D globe.
- **Locations:** 6 global offices
- **Features:**
  - Three.js + React Three Fiber wireframe globe with auto-rotation.
  - Clickable location markers with HTML overlay tooltips.
  - Star field background, orbit controls, sidebar location list.
  - Keyboard shortcuts (1-6 to select, Esc to deselect).

### 20. WebGL Particle Deck

- **Style:** GPU particle system.
- **Slides:** 6 formations, 3000 particles
- **Features:**
  - Particles morph between: random scatter, flow field helix, sphere, explosion, spiral vortex, grid.
  - Additive blending with slide-specific colors.
  - Lerp-based smooth transitions between formations.

### 21. Terminal Hacker

- **Style:** Hacker-themed CLI simulation.
- **Slides:** 8 auto-typing commands
- **Features:**
  - Matrix rain canvas background.
  - CRT scanline and vignette overlay.
  - Auto-typing command prompts with simulated output.
  - ASCII art headers, directory listings, and system scans.
- **Example:** "The Future of Open Source"

### 22. Comic Panel Layout

- **Style:** Manga / comic book panels.
- **Pages:** 6
- **Features:**
  - CSS Grid panel layouts with speech bubbles and thought clouds.
  - SFX text ("BOOM!", "SWOOSH!") with animated reveals.
  - Halftone dot overlay and speed lines SVG.
  - Sequential panel reveal with Framer Motion springs.
- **Example:** "How We Built Our Design System"

### 23. Voice-Controlled Deck

- **Style:** Futuristic voice-command interface.
- **Slides:** 8
- **Features:**
  - Web Speech API voice recognition ("next", "back", "goto 3").
  - Web Audio API real-time waveform visualizer.
  - Voice status indicator and command feedback.
  - Keyboard fallback and permission-gated microphone access.
- **Example:** "The Rise of Voice Interfaces"

### 24. Newspaper Editorial

- **Style:** Print-inspired broadsheet layout.
- **Sections:** Masthead, 6+ articles, classifieds, crossword, weather
- **Features:**
  - Multi-column CSS layout with drop caps and pull quotes.
  - Serif typography with old-style numerals.
  - Classified ads section and crossword teaser grid.
  - `@media print` stylesheet for physical printing.
- **Example:** "THE DAILY DEVELOPER — Vol. CXVII"

### 25. AI Chat Presentation

- **Style:** Simulated AI chat interface.
- **Topics:** 7 (CSS Grid, Container Queries, :has(), Cascade Layers, Subgrid, View Transitions, Nesting)
- **Features:**
  - Typing indicator with bouncing dots.
  - Character-by-character text reveal via requestAnimationFrame.
  - Suggested prompt chips and free-text input with keyword matching.
  - Syntax-highlighted code blocks in responses.
- **Example:** "Modern CSS Features"

### 26. Holographic Card Deck

- **Style:** 3D holographic trading cards.
- **Cards:** 8 (startup pitch deck)
- **Features:**
  - Mouse-tracking 3D tilt via `useMotionValue` / `useTransform`.
  - Rainbow holographic gradient overlay and glare effect.
  - Card flip animation with spring physics.
  - Swipe gestures and dot indicator navigation.
- **Example:** "NeonPay Series B Pitch"

### 27. Timeline Explorer

- **Style:** Horizontal scrolling timeline.
- **Events:** 21 (1989–2025)
- **Features:**
  - Era color-coding: Origins, Dot-Com, Web 2.0, Modern.
  - Expandable event detail cards.
  - Branching sub-timelines for related events.
  - Gradient progress scrubber bar and scroll-position tracking.
- **Example:** "History of the Web"

### 28. Physics Playground

- **Style:** 2D physics sandbox.
- **Slides:** 7
- **Features:**
  - Custom physics engine: gravity, collision detection, bounce, friction.
  - Draggable and throwable elements with velocity transfer.
  - Rectangular and circular rigid bodies with mass-based interactions.
  - Gravity direction changes on slide transitions.
  - Reset button to replay physics animation.
- **Example:** "Understanding Web Performance"

### 29. Spatial Canvas

- **Style:** Prezi-style infinite canvas.
- **Stops:** 9 content clusters
- **Features:**
  - 5000×5000 virtual canvas with camera zoom, pan, and rotate.
  - Smooth spring-physics camera transitions between stops.
  - SVG connection lines between related content clusters.
  - Minimap with viewport indicator and click-to-navigate.
  - Scroll wheel zoom and touch drag-to-pan.
  - Overview mode to see entire canvas.
- **Example:** "The JavaScript Ecosystem"

### 30. Audio Reactive Visualizer

- **Style:** Audio-driven visual experience.
- **Slides:** 7 with 7 visualization modes
- **Features:**
  - Web Audio API with AnalyserNode for real-time FFT data.
  - Visualization modes: radial equalizer, waveform, bars, rings, particles, spiral, blob.
  - Beat detection with particle burst response.
  - Built-in ambient audio via Web Audio oscillators (no audio files).
  - Microphone input option with permission request.
  - Volume control and mute toggle.
  - Color palette shifts based on dominant frequency.
- **Example:** "The Science of Sound"

## Tech Stack

- **Framework:** React 19 + Vite 7
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion, GSAP + ScrollTrigger, Lottie React
- **3D/WebGL:** Three.js, React Three Fiber, Drei
- **Audio:** Web Audio API (AnalyserNode, OscillatorNode, getUserMedia)
- **Speech:** Web Speech API (SpeechRecognition)
- **Canvas:** Canvas 2D (physics engine, Matrix rain, waveform visualizer, audio visualizations)
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
| `npm run test:e2e` | Run Playwright E2E smoke tests     |
| `npm run test:e2e:ui` | Run Playwright UI runner        |
| `npm run live:data:server` | Local simulated live stream (SSE + WS) |
| `npm run live:data:hub` | Local hub mode (push real data) |

## CI

GitHub Actions runs `npm run build` and `npm run test:e2e` on pushes and pull requests.

## Project Structure

```
src/
  components/
    presentation-modes/   # All presentation components
  data/
    examples.ts           # Example metadata (all 30 modes available)
    presentation-content.ts # Full Takahashi slide data
    mockups/              # Blueprint docs for each mode
  pages/                  # Route pages (gallery + viewer)
  hooks/                  # Shared hooks
  types.ts                # Shared types
```

## Deployment

### Frontend

```bash
vercel --prod
```

This repo also supports a simple Docker + Nginx deploy:

- Docker build uses `Dockerfile` and `nginx.conf`.
- Vite env vars are compile-time. If you want SSE/WS defaults without manually typing URLs, pass build args:
  - `VITE_LIVE_SSE_URL=https://.../api/live`
  - `VITE_LIVE_WS_URL=wss://.../api/live/ws`

### Live Data Hub (optional)

To run SSE/WebSocket streaming in production, deploy the hub service separately (or behind your proxy):

- Docker image: `Dockerfile.live-data`
- Guides:
  - Coolify + Hetzner: `DEPLOY_LIVE_DATA_HUB_COOLIFY.md`
  - Fly.io: `DEPLOY_LIVE_DATA_HUB.md`
