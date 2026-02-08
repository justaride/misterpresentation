# Spec: Voice-Controlled Deck

## ID

`voice-controlled-deck`

## Priority

3

## Category

`interactive-data`

## Description

A presentation controlled by voice commands using the Web Speech API. Users say "next", "back", "go to slide 5", etc. Visual feedback shows speech recognition status, a waveform visualizer reacts to voice input, and slides have a clean, futuristic aesthetic.

## Content Theme

"The Rise of Voice Interfaces" — 8 slides covering voice UI history, design principles, accessibility benefits, and the future of conversational design.

## Requirements

- Web Speech API (`SpeechRecognition`) for voice input
- Recognized commands: "next", "back", "go to [number]", "first", "last"
- Real-time audio waveform visualizer (Web Audio API + Canvas)
- Visual command feedback: show recognized text with confidence score
- Microphone permission request with clear UI
- Fallback: arrow keys / click still work when mic unavailable
- Status indicator: listening, processing, command recognized
- At least 8 slides with content about voice interfaces
- Clean futuristic UI: dark theme, neon accent lines, glass panels
- Graceful degradation: works as normal deck if Speech API unavailable

## Tech

- React + TypeScript
- Web Speech API (SpeechRecognition)
- Web Audio API + Canvas for waveform
- Framer Motion for slide transitions
- No external dependencies beyond existing

## Acceptance Criteria

- [ ] Component exports `VoiceControlledDeck` from `src/components/presentation-modes/VoiceControlledDeck.tsx`
- [ ] Example entry added to `src/data/examples.ts` with id `voice-controlled-deck`
- [ ] Lazy import + case added in `src/pages/ExampleViewer.tsx`
- [ ] Speech recognition activates on user permission grant
- [ ] "next", "back", "go to [N]" voice commands work
- [ ] Audio waveform visualizer renders when mic is active
- [ ] Visual feedback shows recognized speech text
- [ ] Status indicator for mic state (off/listening/recognized)
- [ ] Keyboard fallback (arrows/space) always works
- [ ] Graceful degradation if SpeechRecognition API unavailable
- [ ] 8+ slides about voice interfaces
- [ ] Respects `prefers-reduced-motion`
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] `npm run build` passes with no errors

**Output when complete:** `<promise>DONE</promise>`
