# Spec: Pirates of the Fjord Crown (Full Game Story)

## ID

`pirates-of-the-fjord-crown-story`

## Priority

25

## Status: COMPLETE

## Category

`storytelling`

## Description

Produce a complete, coherent game story for **Pirates of the Fjord Crown** (campaign arc, cast, factions, key choices, and endings) and publish it as both:

1. A readable Markdown story bible for writers/designers.
2. An updated web-native scroll page (`public/pirates-of-the-fjords.html`) that summarizes the full campaign and lets readers explore endings.

## Requirements

- Keep the tone: Scandinavian pirate saga, fjords, longboats, runestones that bend wind.
- Story must center Captain Soren and Astrid, with clear antagonists and faction pressure.
- Story must include multiple endings tied to player choices (not random).
- Web page remains self-contained (no build tooling required) and keeps current look/feel.

## Acceptance Criteria

- [ ] New story bible exists at `deliverables/pirates-of-the-fjord-crown-story.md` with:
  - Logline + themes
  - Setting + factions
  - Main cast (Soren, Astrid, and at least 3 additional named characters)
  - Full campaign outline (Acts/Chapters 1-4), with key missions and choice points
  - At least 3 distinct endings with unlock conditions
- [ ] `public/pirates-of-the-fjords.html` content is expanded to reflect the full story:
  - Chapters 01-04 are expanded with clearer objectives + stakes + choice hooks
  - New Chapter 05 ("People of the Fjords") introduces the cast/factions
  - New Chapter 06 ("Paths to the Crown") provides an interactive endings explorer
- [ ] Endings explorer supports clicking ending buttons and updates visible copy (no page reload).
- [ ] Playwright test `tests/pirates-of-the-fjords.spec.ts` verifies:
  - Page loads and renders hero title
  - 6 chapters exist (01-06)
  - Ending buttons update the ending detail text
- [ ] `npm run test:e2e -- tests/pirates-of-the-fjords.spec.ts` passes

**Output when complete:** `<promise>DONE</promise>`
