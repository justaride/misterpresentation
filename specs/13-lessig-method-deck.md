# Lessig Method Deck (`lessig-method-deck`)

Lessig method: slides change rapidly as punctuation, synchronized to speech.

## Goals

- Autoplay "cue" deck with rehearsal controls.
- Tight typography and strong pacing.

## Interaction

- Query params:
  - `autostart=1` start running immediately
  - `tempoMs=<n>` cue duration in ms (default ~1200)
- Controls:
  - Space: pause/resume
  - ArrowLeft/ArrowRight: prev/next cue
  - R: reset to cue 1

## Acceptance Criteria

- Autoplay advances cues on schedule.
- Manual override works while running.
- Playwright test: in fast mode (`tempoMs=200`) cue position advances.

