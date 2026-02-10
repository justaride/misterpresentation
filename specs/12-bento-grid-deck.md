# Bento Grid Deck (`bento-grid-deck`)

A modern bento-grid slide system: each slide is a modular grid of tiles with strong hierarchy.

## Goals

- High reuse for real decks (product updates, client briefs, strategy overviews).
- Deterministic layouts (no random masonry).
- Mobile-first fallback (tiles stack cleanly).

## Core Rules

- Each slide has:
  - 1 hero tile (largest)
  - 2-4 supporting tiles
  - 0-4 secondary tiles
- Typography hierarchy is enforced by tile type.

## Interaction

- Host-style navigation for everyone:
  - Arrow keys left/right
  - On-screen prev/next buttons
- Optional query params:
  - `slide=<n>` to start at slide n (1-based)

## Acceptance Criteria

- Renders at least 12 slides of a practical template.
- Deterministic bento layout per slide.
- Mobile stacks tiles (no overflow).
- Playwright test: renders and ArrowRight advances slide position.

