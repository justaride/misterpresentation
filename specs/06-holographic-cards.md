# Spec: Holographic Card Deck

## ID

`holographic-cards`

## Priority

6

## Category

`3d-webgl`

## Description

A presentation styled as a deck of holographic cards with 3D perspective tilt that follows the mouse/gyroscope. Cards have iridescent rainbow reflections, foil texture shimmer, and glassmorphism effects. Swipe through cards like a card game hand.

## Content Theme

"Startup Pitch: NeonPay" — a fintech startup pitch presented as collectible holographic cards, each card covering: problem, solution, market, traction, team, financials, ask.

## Requirements

- 3D card perspective that tilts with mouse position (CSS transform perspective)
- Holographic rainbow gradient overlay that shifts with tilt angle
- Foil shimmer effect using CSS gradients and mix-blend-mode
- Glassmorphism card surface (backdrop-filter blur, semi-transparent)
- Card stack visualization: see edges of upcoming cards
- Swipe gesture to move between cards (Framer Motion drag)
- Card flip animation to reveal back side with additional details
- Sparkle/glint particle effects on card surface
- At least 8 cards for the pitch deck
- Light rays / bokeh background
- Device gyroscope support on mobile (DeviceOrientationEvent)
- Smooth 60fps tilt tracking

## Tech

- React + TypeScript + Framer Motion
- CSS transforms (perspective, rotateX, rotateY)
- CSS backdrop-filter for glassmorphism
- CSS gradients + mix-blend-mode for holographic effect
- DeviceOrientationEvent API for mobile gyroscope
- No Three.js needed — pure CSS 3D

## Acceptance Criteria

- [ ] Component exports `HolographicCards` from `src/components/presentation-modes/HolographicCards.tsx`
- [ ] Example entry added to `src/data/examples.ts` with id `holographic-cards`
- [ ] Lazy import + case added in `src/pages/ExampleViewer.tsx`
- [ ] 3D perspective tilt follows mouse on desktop
- [ ] Holographic rainbow gradient shifts with tilt angle
- [ ] Glassmorphism card surface with backdrop-filter
- [ ] Swipe/drag gesture to navigate between cards
- [ ] Card flip animation (front/back)
- [ ] 8+ cards with startup pitch content
- [ ] Card stack visualization (see upcoming cards)
- [ ] Sparkle/glint effects on card surface
- [ ] Mobile gyroscope tilt support (with permission request)
- [ ] Respects `prefers-reduced-motion`
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] `npm run build` passes with no errors

**Output when complete:** `<promise>DONE</promise>`
