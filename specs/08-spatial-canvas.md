# Spec: Spatial Canvas Presentation (Prezi-style)

## ID

`spatial-canvas`

## Priority

8

## Category

`animation-heavy`

## Description

A Prezi-inspired infinite canvas presentation where all content exists on a large 2D plane. The camera zooms, pans, and rotates to navigate between content clusters. Users see the big picture, then zoom into details. Smooth animated camera transitions between stops.

## Content Theme

"The JavaScript Ecosystem" — a mind-map style overview of the JS ecosystem: frameworks (React, Vue, Svelte), runtimes (Node, Deno, Bun), build tools (Vite, webpack, esbuild), testing (Jest, Vitest, Playwright). Each cluster zooms in to reveal details.

## Requirements

- Large canvas (5000x5000 virtual space) with content placed at various positions/scales
- Camera system: pan, zoom, rotate with smooth CSS transform transitions
- At least 8 "stops" (zoom targets) connected in a presentation path
- Overview mode: zoom out to see entire canvas
- Content clusters: grouped elements at different scales
- Minimap in corner showing current viewport position
- Zoom transitions with rotation for dramatic effect
- Connection lines between related content (SVG paths)
- Navigation: arrow keys, click on minimap, or click "next"
- Scroll wheel zooms in/out
- Touch support: pinch to zoom, drag to pan
- Smooth 60fps camera animations

## Tech

- React + TypeScript
- CSS transforms (translate, scale, rotate) on a container
- Framer Motion `animate` for camera transitions
- SVG for connection lines
- No external canvas/map libraries

## Acceptance Criteria

- [ ] Component exports `SpatialCanvas` from `src/components/presentation-modes/SpatialCanvas.tsx`
- [ ] Example entry added to `src/data/examples.ts` with id `spatial-canvas`
- [ ] Lazy import + case added in `src/pages/ExampleViewer.tsx`
- [ ] Large virtual canvas with content at different positions and scales
- [ ] Smooth camera pan/zoom/rotate transitions between 8+ stops
- [ ] Overview mode (zoom out to see everything)
- [ ] Minimap showing current viewport
- [ ] Connection lines between content clusters
- [ ] Arrow key + click navigation
- [ ] Scroll wheel zoom
- [ ] Touch: pinch-to-zoom and drag-to-pan
- [ ] Content about JavaScript ecosystem with grouped clusters
- [ ] Respects `prefers-reduced-motion`
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] `npm run build` passes with no errors

**Output when complete:** `<promise>DONE</promise>`
