# Spec: Newspaper Editorial Presentation

## ID

`newspaper-editorial`

## Priority

4

## Category

`typography`

## Description

A print-inspired editorial layout presentation styled like a premium newspaper or magazine. Multi-column text, drop caps, pull quotes, masthead, and article-style content. Scroll-driven with each "article" being a slide. Sepia/cream color palette with serif typography.

## Content Theme

"THE DAILY DEVELOPER" — a newspaper front page and article spreads covering tech stories: "AI Revolution Reaches Main Street", opinion columns, classified ads for developer jobs, weather widget showing deployment status.

## Requirements

- Newspaper masthead with date, edition number, price
- Multi-column CSS layout (2-4 columns depending on viewport)
- Drop caps on article openings (CSS `::first-letter`)
- Pull quotes with decorative quotation marks
- Horizontal rules and column dividers
- Serif font stack (Georgia, Times, or similar)
- At least 6 "articles" / sections scrolling vertically
- Classified ads section with grid layout
- "Weather" widget showing humorous deployment status
- Crossword puzzle teaser (static grid, visual only)
- Sepia/cream background with ink-black text
- Print button that triggers `window.print()` with print-optimized CSS
- Responsive: single column on mobile with preserved typography

## Tech

- React + TypeScript
- CSS multi-column layout
- Tailwind for utility classes + custom serif typography
- CSS `@media print` for print styles

## Acceptance Criteria

- [ ] Component exports `NewspaperEditorial` from `src/components/presentation-modes/NewspaperEditorial.tsx`
- [ ] Example entry added to `src/data/examples.ts` with id `newspaper-editorial`
- [ ] Lazy import + case added in `src/pages/ExampleViewer.tsx`
- [ ] Newspaper masthead with title, date, edition
- [ ] Multi-column article layout (2+ columns on desktop)
- [ ] Drop caps on article starts
- [ ] Pull quotes with decorative styling
- [ ] 6+ article sections with tech-themed content
- [ ] Classified ads grid section
- [ ] Responsive: single column on mobile
- [ ] Print-optimized CSS (`@media print`)
- [ ] Serif typography throughout
- [ ] Respects `prefers-reduced-motion`
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] `npm run build` passes with no errors

**Output when complete:** `<promise>DONE</promise>`
