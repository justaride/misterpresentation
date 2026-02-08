# Spec: Timeline Explorer Presentation

## ID

`timeline-explorer`

## Priority

10

## Category

`scroll-driven`

## Description

A horizontal scrolling timeline presentation showing events along a visual timeline axis. Each event expands into a detail card on click. Eras are color-coded, the timeline has zoom levels (decades → years → months), and a scrubber bar shows progress.

## Content Theme

"History of the Web" — a timeline from 1989 (Tim Berners-Lee) to 2025, covering: HTML invention, Mosaic, CSS, JavaScript, AJAX, jQuery, Node.js, React, TypeScript, serverless, AI-assisted coding. 15+ events.

## Requirements

- Horizontal scrolling timeline with a visible axis line
- Events plotted as nodes on the timeline with dates
- Click/tap event node to expand detail card with description + image placeholder
- Era sections with distinct background colors (90s, 2000s, 2010s, 2020s)
- Timeline scrubber/progress bar at bottom
- Zoom: scroll wheel changes timeline scale
- Auto-play mode: slowly scrolls through timeline
- Current year indicator with pulsing dot
- At least 15 events across 35+ years
- Branching: some events have sub-timelines (e.g., "Browser Wars" branches)
- Keyboard: left/right arrows jump between events
- Smooth horizontal scroll with momentum

## Tech

- React + TypeScript
- CSS transforms for horizontal scroll (translateX)
- Framer Motion for card expand animations
- SVG for timeline axis and branch lines
- Tailwind for styling

## Acceptance Criteria

- [ ] Component exports `TimelineExplorer` from `src/components/presentation-modes/TimelineExplorer.tsx`
- [ ] Example entry added to `src/data/examples.ts` with id `timeline-explorer`
- [ ] Lazy import + case added in `src/pages/ExampleViewer.tsx`
- [ ] Horizontal scrolling timeline with visible axis
- [ ] 15+ events plotted chronologically (1989–2025)
- [ ] Click to expand event detail cards
- [ ] Era color coding (at least 4 eras)
- [ ] Progress scrubber bar
- [ ] Auto-play mode with scroll animation
- [ ] Current year indicator
- [ ] Arrow key navigation between events
- [ ] At least one branching sub-timeline
- [ ] Smooth horizontal scroll with momentum
- [ ] Responsive: vertical layout on mobile
- [ ] Respects `prefers-reduced-motion`
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] `npm run build` passes with no errors

**Output when complete:** `<promise>DONE</promise>`
