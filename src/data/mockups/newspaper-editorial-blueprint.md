# Presentation Blueprint: Newspaper Editorial

## ID
`newspaper-editorial`

## Overview
Print-inspired editorial layout with multi-column text, drop caps, pull quotes, classified ads, and a crossword teaser.

## Metadata
- Category: `typography`
- Format: `standard`
- Difficulty: `intermediate`
- Tags: `css-columns`, `typography`, `print-css`

## Visual Style
- Theme: print-inspired broadsheet.
- Background: warm paper (#f5f1e8) with subtle grain.
- Typography: classic serif for headlines (Georgia/Times), small caps + mono for metadata.
- Layout: multi-column grid with rules, drop caps, pull quotes, and boxed widgets.

## Navigation & Controls
- Scroll: the page reads like an article; sections reveal as you scroll.
- Print: include `@media print` styles for clean export.

## Slide Breakdown

### Deployment Weather States (Used In Widget)

- Production: Stable
- Staging: Flaky
- Dev: Broken
- CI/CD: Recovering

## Slide 1 – Masthead

**Purpose:** Hook the audience and establish the premise.

**Content:**

**Headline (Center, Huge):**
"Masthead"

**Subheading (Center, Medium):**
"The front page identity"

**Body Beats:**
- Top metadata line: volume, date, price
- Main title: "THE DAILY DEVELOPER"
- Tagline line below the masthead

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
## Slide 2 – Lead Story

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Lead Story"

**Subheading (Center, Medium):**
"Big headline + byline + drop cap intro"

**Body Beats:**
- Hero headline (serif, bold, tight leading)
- Byline in small caps
- Lead paragraph with large drop cap

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
## Slide 3 – Pull Quote

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Pull Quote"

**Subheading (Center, Medium):**
"A dramatic mid-page quote block"

**Body Beats:**
- Centered quote with oversized opening/closing quotes
- Thin double rule above and below
- Attribution in tiny caps

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
## Slide 4 – Sidebar Widgets

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Sidebar Widgets"

**Subheading (Center, Medium):**
"Weather + crossword teaser"

**Body Beats:**
- Deployment Weather widget (4 statuses)
- Crossword teaser grid with black squares
- Small caption: 'Solution on page B12'

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
## Slide 5 – Classifieds

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Classifieds"

**Subheading (Center, Medium):**
"Grid of small boxed ads"

**Body Beats:**
- Senior React Developer — TechCorp — Remote • $180-220K • Must love hooks
- Rust Systems Engineer — InfraCo — SF/NYC • $200-250K • Memory safety enthusiast
- DevOps Lead — CloudScale — Remote • $170-210K • Terraform whisperer
- AI/ML Engineer — ModelLab — NYC • $220-280K • GPU access included
- Open Source Maintainer — OSS Foundation — Remote • $0 + Gratitude • Burnout risk: high
- Full Stack Developer — StartupXYZ — Anywhere • Equity only • "We're like a family"

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
## Slide 6 – Footer & Print Notes

**Purpose:** Close the loop with a memorable ending and a clear takeaway.

**Content:**

**Headline (Center, Huge):**
"Footer & Print Notes"

**Subheading (Center, Medium):**
"Wrap-up and print styling"

**Body Beats:**
- Add subtle column rules + margin gutters
- Use print-safe colors and avoid heavy shadows
- Ensure links show as plain text in print

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
