# Presentation Blueprint: Audio Reactive Visualizer

## ID
`audio-reactive`

## Overview
Audio-driven visualizations with Web Audio API. Frequency bars, waveforms, beat detection, and particle bursts. Built-in ambient audio or microphone input.

## Metadata
- Category: `3d-webgl`
- Format: `standard`
- Difficulty: `advanced`
- Tags: `web-audio-api`, `canvas`, `beat-detection`

## Visual Style
- Typography: `var(--font-display)` for big headings, `var(--font-mono)` for UI labels, `var(--font-body)` for supporting text.
- Palette: cinematic dark + bright emissive accents; keep overlays readable over moving 3D.
- Signature elements:
  - Audio: Web Audio API analyser-driven visuals.

## Navigation & Controls
- Next: `→` or `Space`.
- Previous: `←`.
- Exit: `Esc` (return to gallery).

## Slide Breakdown

## Slide 1 – What Is Sound?

**Purpose:** Hook the audience and establish the premise.

**Content:**

**Headline (Center, Huge):**
"What Is Sound?"

**Subheading (Center, Medium):**
"Sound is a mechanical wave — vibrations traveling through air, water, or solids. Frequency determines pitch, amplitude determines volume."

**Visualization Mode:**
`waveform`

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
## Slide 2 – The Frequency Spectrum

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"The Frequency Spectrum"

**Subheading (Center, Medium):**
"Humans hear 20Hz to 20kHz. Bass (20-250Hz) you feel. Midrange (250-4kHz) carries speech. Treble (4-20kHz) adds brilliance."

**Visualization Mode:**
`radial`

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
## Slide 3 – Human Hearing

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Human Hearing"

**Subheading (Center, Medium):**
"Our ears are most sensitive between 2-5kHz — the frequency range of a baby's cry. Loudness is measured in decibels (dB), a logarithmic scale."

**Visualization Mode:**
`rings`

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
## Slide 4 – Digital Audio

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Digital Audio"

**Subheading (Center, Medium):**
"Analog waves become digital through sampling. CD quality: 44.1kHz sample rate, 16-bit depth = 1,411 kbps of raw data per second."

**Visualization Mode:**
`bars`

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
## Slide 5 – Audio Compression

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Audio Compression"

**Subheading (Center, Medium):**
"MP3, AAC, and Opus use psychoacoustic models to remove sounds humans can't perceive. A 50MB WAV becomes a 5MB MP3 with minimal quality loss."

**Visualization Mode:**
`particles`

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
## Slide 6 – Spatial Audio

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Spatial Audio"

**Subheading (Center, Medium):**
"Binaural, Dolby Atmos, and ambisonics create 3D sound fields. Head-related transfer functions (HRTFs) simulate how ears locate sound in space."

**Visualization Mode:**
`spiral`

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
## Slide 7 – The Future of Audio

**Purpose:** Close the loop with a memorable ending and a clear takeaway.

**Content:**

**Headline (Center, Huge):**
"The Future of Audio"

**Subheading (Center, Medium):**
"AI-generated music, real-time voice cloning, neural audio codecs. The Web Audio API puts a professional audio engine in every browser."

**Visualization Mode:**
`blob`

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
