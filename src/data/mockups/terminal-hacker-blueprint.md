# Presentation Blueprint: Terminal Hacker

## ID
`terminal-hacker`

## Overview
Hacker-themed CLI presentation with Matrix rain, auto-typing commands, ASCII art, and CRT scanlines.

## Metadata
- Category: `code-focused`
- Format: `standard`
- Difficulty: `intermediate`
- Tags: `canvas`, `terminal`, `ascii-art`

## Visual Style
- Typography: `var(--font-display)` for big headings, `var(--font-mono)` for UI labels, `var(--font-body)` for supporting text.
- Palette: near-black background, high-contrast mono text, a single neon accent.
- Signature elements:
  - Background: subtle Matrix rain (Canvas).

## Navigation & Controls
- Advance: `Enter` or `Space` (next command).
- Back/Exit: `Esc` (return to gallery).
- Mobile: tap anywhere to advance.

## Slide Breakdown

## Slide 1 – whoami

**Purpose:** Hook the audience and establish the premise.

**Content:**

**Terminal Input:**
`whoami`

**Terminal Output:**
```text
open-source-developer

> A builder of public goods.
> A contributor to the commons.
> One of 100 million+ developers on GitHub.
```

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
## Slide 2 – cat /etc/motd

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Terminal Input:**
`cat /etc/motd`

**Terminal Output:**
```text

Welcome to the future of collaborative software.

The open source movement has reshaped how
the entire world builds technology.

96% of all codebases contain open source components.
```

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
## Slide 3 – ls -la projects/

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Terminal Input:**
`ls -la projects/`

**Terminal Output:**
```text
total 2847291
drwxr-xr-x  420M  linux-kernel/
drwxr-xr-x  180M  kubernetes/
drwxr-xr-x   95M  react/
drwxr-xr-x   88M  vscode/
drwxr-xr-x   72M  tensorflow/
drwxr-xr-x   61M  rust-lang/

> These projects power the modern internet.
> Built by millions of volunteers worldwide.
```

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
## Slide 4 – grep -r "funding" ./ecosystem/

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Terminal Input:**
`grep -r "funding" ./ecosystem/`

**Terminal Output:**
```text
./ecosystem/sponsors.md:  GitHub Sponsors: $50M+ paid to maintainers
./ecosystem/foundations.md: Linux Foundation: 1,800+ member companies
./ecosystem/grants.md:     Sovereign Tech Fund: $20M for critical infra
./ecosystem/corporate.md:  Google OSS: $100M+ committed since 2021

> Funding is growing, but still a fraction of the
> value open source creates ($8.8 trillion annually).
```

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
## Slide 5 – git log --oneline --graph community/

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Terminal Input:**
`git log --oneline --graph community/`

**Terminal Output:**
```text

* 2024  100M+ developers on GitHub
* 2023  Open source AI models explode (Llama, Mistral)
* 2022  Rust enters Linux kernel
* 2020  COVID accelerates remote OSS contribution
* 2018  Microsoft acquires GitHub ($7.5B)
* 2014  Docker democratizes containerization
* 2008  GitHub launches — social coding begins
* 1991  Linus posts Linux 0.01
```

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
## Slide 6 – curl https://api.oss-trends.dev/challenges

**Purpose:** Wrap up and provide a reset/replay prompt.

**Content:**

**Terminal Input:**
`curl https://api.oss-trends.dev/challenges`

**Terminal Output:**
```text
{
  "challenges": [
    "Maintainer burnout — 60% work unpaid",
    "Supply chain attacks — Log4Shell, XZ Utils",
    "License compliance complexity",
    "Corporate free-riding on volunteer labor",
    "Sustainability of critical infrastructure"
  ],
  "status": "needs_attention"
}
```

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
## Slide 7 – cat solutions.md

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Terminal Input:**
`cat solutions.md`

**Terminal Output:**
```text
# How We Fix Open Source

1. **Pay maintainers** — not pizza, real money
2. **SBOMs everywhere** — know your dependencies
3. **Corporate give-back** — contribute, don't just consume
4. **Government funding** — critical digital infrastructure
5. **Better tooling** — reduce maintenance burden

> The code is open. The question is whether
> we can keep it sustainable.
```

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
## Slide 8 – fortune

**Purpose:** Close the loop with a memorable ending and a clear takeaway.

**Content:**

**Terminal Input:**
`fortune`

**Terminal Output:**
```text

"The best way to predict the future is to
 invent it — and then open source it."

> AI-assisted contributions lower the barrier.
> New licensing models emerge.
> The next billion developers are coming online.

The future of software is open. Always has been.

[Process complete — press ESC to return]
```

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
