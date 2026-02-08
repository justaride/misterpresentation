# Spec: Comic Panel Layout Presentation

## ID

`comic-panel-layout`

## Priority

2

## Category

`storytelling`

## Description

A manga/comic book-style presentation where content is laid out in dynamic panel grids. Panels reveal sequentially with pop-in animations, speech bubbles contain text, and action lines emphasize transitions. Each "page" is a different panel arrangement.

## Content Theme

"How We Built Our Design System" — a story told through comic panels about a team creating a design system, with characters, dialogue, and visual metaphors.

## Requirements

- CSS Grid-based panel layouts with at least 5 distinct grid arrangements
- Panels reveal one-by-one with scale + fade animations (Framer Motion)
- Speech bubbles with tail pointers, thought clouds
- Action lines (speed lines) SVG effects on transitions
- Bold comic typography (impact/bold fonts, ALL CAPS headers)
- Halftone dot pattern overlay on images/backgrounds
- At least 6 pages of panels (5-8 panels per page)
- Click/tap or arrow keys to reveal next panel, page auto-advances when full
- Sound effect text ("POW!", "BOOM!", "WHOOSH!") with animated reveals
- Mobile responsive: panels stack vertically on small screens

## Tech

- React + TypeScript + Framer Motion
- CSS Grid for panel layouts
- SVG for action lines and halftone patterns
- Tailwind for typography and colors

## Acceptance Criteria

- [ ] Component exports `ComicPanelLayout` from `src/components/presentation-modes/ComicPanelLayout.tsx`
- [ ] Example entry added to `src/data/examples.ts` with id `comic-panel-layout`
- [ ] Lazy import + case added in `src/pages/ExampleViewer.tsx`
- [ ] 6+ pages with varied CSS Grid panel arrangements
- [ ] Sequential panel reveal animations
- [ ] Speech bubbles and thought clouds with proper tail positioning
- [ ] SVG action lines on at least 2 transitions
- [ ] Sound effect text animations ("POW!", etc.)
- [ ] Arrow key / click navigation between panels and pages
- [ ] Responsive: panels reflow on mobile
- [ ] Respects `prefers-reduced-motion`
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] `npm run build` passes with no errors

**Output when complete:** `<promise>DONE</promise>`
