# Presentation Blueprint: Presenter Mode Deck

## ID
`presenter-mode-deck`

## Overview
Full presenter mode with timer, notes panel, and Web Animations API transitions.

## Metadata
- Category: `slide-based`
- Format: `standard`
- Difficulty: `advanced`
- Tags: `web-animations-api`

## Visual Style
- Typography: `var(--font-display)` for big headings, `var(--font-mono)` for UI labels, `var(--font-body)` for supporting text.
- Palette: clean slide surfaces, clear hierarchy, and consistent navigation affordances.

## Navigation & Controls
- Next: `→` or `Space`.
- Previous: `←`.
- Exit: `Esc` (return to gallery).

## Slide Breakdown

## Slide 1 – Presenter Mode

**Purpose:** Hook the audience and establish the premise.

**Content:**

**Headline (Center, Huge):**
"Presenter Mode"

**Speaker Notes (Hidden Panel):**
Welcome the audience. Mention this is a demo of the presenter mode feature. The timer starts automatically.

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
## Slide 2 – Key Features

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Key Features"

**Speaker Notes (Hidden Panel):**
Walk through each feature. The timer in the bottom bar shows both slide time and total time. Notes panel toggles with N key.

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
## Slide 3 – Keyboard Shortcuts

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Keyboard Shortcuts"

**Speaker Notes (Hidden Panel):**
Demonstrate each keyboard shortcut live. Show the notes panel toggle. Fullscreen uses the browser Fullscreen API.

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
## Slide 4 – Time Management

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Time Management"

**Speaker Notes (Hidden Panel):**
Explain how the timer color-codes: green under 5 min, yellow 5-15 min, red over 15 min. This helps speakers pace their talk.

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
## Slide 5 – Transition Showcase

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Transition Showcase"

**Speaker Notes (Hidden Panel):**
Point out how the slide content enters with a spring animation. The exit is a fade + slide. This is all Framer Motion under the hood.

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
## Slide 6 – Thank You

**Purpose:** Close the loop with a memorable ending and a clear takeaway.

**Content:**

**Headline (Center, Huge):**
"Thank You"

**Speaker Notes (Hidden Panel):**
Thank the audience. Open for questions. The timer shows total presentation duration.

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
Hold for 1 beat, then fade out.

---
## Implementation Notes

- Keep each slide to one primary idea. If a slide needs two ideas, split it.
- Prefer reduced-motion friendly variants (skip continuous animations, keep content readable).
- Ensure keyboard navigation always works (including when focus is inside inputs).
