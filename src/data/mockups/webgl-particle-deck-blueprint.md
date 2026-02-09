# Presentation Blueprint: WebGL Particle Deck

## ID
`webgl-particle-deck`

## Overview
Particle system transitions between slides using raw WebGL and Three.js.

## Metadata
- Category: `3d-webgl`
- Format: `standard`
- Difficulty: `advanced`
- Tags: `webgl`, `three-js`

## Visual Style
- Typography: `var(--font-display)` for big headings, `var(--font-mono)` for UI labels, `var(--font-body)` for supporting text.
- Palette: cinematic dark + bright emissive accents; keep overlays readable over moving 3D.
- Signature elements:
  - 3D/WebGL: React Three Fiber + Three.js visuals.

## Navigation & Controls
- Next: `→` or `Space`.
- Previous: `←`.
- Exit: `Esc` (return to gallery).

## Slide Breakdown

## Slide 1 – Particle Systems

**Purpose:** Hook the audience and establish the premise.

**Content:**

**Headline (Center, Huge):**
"Particle Systems"

**Subheading (Center, Medium):**
"Where physics meets aesthetics"

**Particle Accent Color:**
`#3B82F6`

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
## Slide 2 – Flow Fields

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Flow Fields"

**Subheading (Center, Medium):**
"Noise-driven organic motion"

**Particle Accent Color:**
`#8B5CF6`

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
## Slide 3 – Gravitational Pull

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Gravitational Pull"

**Subheading (Center, Medium):**
"Attraction and repulsion forces"

**Particle Accent Color:**
`#EC4899`

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
## Slide 4 – Burst

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Burst"

**Subheading (Center, Medium):**
"Explosive scatter and reform"

**Particle Accent Color:**
`#F59E0B`

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
## Slide 5 – Vortex

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Vortex"

**Subheading (Center, Medium):**
"Spiral formations in 3D space"

**Particle Accent Color:**
`#10B981`

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
## Slide 6 – WebGL

**Purpose:** Close the loop with a memorable ending and a clear takeaway.

**Content:**

**Headline (Center, Huge):**
"WebGL"

**Subheading (Center, Medium):**
"GPU-accelerated beauty"

**Particle Accent Color:**
`#EF4444`

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
