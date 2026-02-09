# Presentation Blueprint: Voice-Controlled Deck

## ID
`voice-controlled-deck`

## Overview
Navigate slides with voice commands using the Web Speech API. Features waveform visualizer and futuristic UI.

## Metadata
- Category: `interactive-data`
- Format: `standard`
- Difficulty: `advanced`
- Tags: `web-speech-api`, `web-audio-api`, `canvas`

## Visual Style
- Typography: `var(--font-display)` for big headings, `var(--font-mono)` for UI labels, `var(--font-body)` for supporting text.
- Palette: dashboard panels, muted surfaces, and status colors (good/warn/danger).
- Signature elements:
  - Voice: Web Speech API recognition + command parsing.
  - Audio: Web Audio API analyser-driven visuals.

## Navigation & Controls
- Voice commands: `next`, `back`, `go to [number]`, `first`, `last`.
- Keyboard fallback: `←` / `→`, `Space`.

## Slide Breakdown

## Slide 1 – The Rise of Voice Interfaces

**Purpose:** Hook the audience and establish the premise.

**Content:**

**Headline (Center, Huge):**
"The Rise of Voice Interfaces"

**Body Beats:**
- From command lines to conversational AI
- Voice is the most natural human interface
- Try it: say "next" to advance this slide

**Accent Gradient:**
`from-cyan-500 to-blue-600`

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
## Slide 2 – A Brief History

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"A Brief History"

**Body Beats:**
- 1952 — Audrey: recognized 10 digits
- 1990 — Dragon Dictate: first consumer product
- 2011 — Siri launches on iPhone 4S
- 2014 — Amazon Echo brings voice to the home
- 2023 — LLMs make voice truly conversational

**Accent Gradient:**
`from-violet-500 to-purple-600`

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
## Slide 3 – Design Principles

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Design Principles"

**Body Beats:**
- Discoverability: users must know what to say
- Feedback: confirm what was heard
- Forgiveness: handle misrecognition gracefully
- Efficiency: voice should be faster than tap

**Accent Gradient:**
`from-emerald-500 to-teal-600`

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
## Slide 4 – The Accessibility Advantage

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"The Accessibility Advantage"

**Body Beats:**
- Motor impairments: hands-free navigation
- Visual impairments: natural audio interaction
- Cognitive load: speak naturally, don't decode UI
- Situational: driving, cooking, multitasking

**Accent Gradient:**
`from-amber-500 to-orange-600`

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
## Slide 5 – Technical Architecture

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Technical Architecture"

**Body Beats:**
- Web Speech API — browser-native recognition
- SpeechRecognition → interim + final results
- Web Audio API — real-time waveform analysis
- Intent parsing — map speech to commands

**Accent Gradient:**
`from-rose-500 to-pink-600`

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
## Slide 6 – Challenges

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Challenges"

**Body Beats:**
- Ambient noise in real environments
- Accent and dialect diversity
- Privacy concerns with always-listening
- Latency expectations vs. reality
- Discoverability of voice commands

**Accent Gradient:**
`from-red-500 to-rose-600`

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
## Slide 7 – The Multimodal Future

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"The Multimodal Future"

**Body Beats:**
- Voice + gesture = spatial computing
- Voice + vision = context-aware AI
- Voice + haptics = immersive feedback
- Natural language replaces menus and forms

**Accent Gradient:**
`from-blue-500 to-indigo-600`

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
## Slide 8 – Voice Is the Future

**Purpose:** Close the loop with a memorable ending and a clear takeaway.

**Content:**

**Headline (Center, Huge):**
"Voice Is the Future"

**Body Beats:**
- Every interface becomes conversational
- AI bridges the gap between intent and action
- The best interface is no interface at all
- 
- Commands: "next" • "back" • "go to [number]"

**Accent Gradient:**
`from-fuchsia-500 to-violet-600`

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
