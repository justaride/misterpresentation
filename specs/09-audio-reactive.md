# Spec: Audio Reactive Visualizer Presentation

## ID

`audio-reactive`

## Priority

9

## Category

`3d-webgl`

## Description

A presentation driven by audio analysis. Background visualizations react to music/audio in real-time — frequency bars, waveforms, particle explosions on beats. Text content overlays the visualizations. Users can play built-in ambient tracks or use their microphone.

## Content Theme

"The Science of Sound" — 7 slides about audio: how sound works, frequency spectrums, human hearing range, digital audio, compression, spatial audio, and the future of audio tech.

## Requirements

- Web Audio API: AnalyserNode for FFT frequency data
- Canvas visualizations reacting to audio:
  - Circular frequency bars (radial equalizer)
  - Waveform oscilloscope
  - Particle burst on beat detection
- Built-in ambient audio track (generate with Web Audio oscillators — no audio files)
- Microphone input option (Web Audio from getUserMedia)
- Beat detection algorithm (energy threshold on bass frequencies)
- Text slides overlay on top of visualizations
- Each slide changes the visualization style
- Volume control and mute toggle
- At least 7 slides about sound science
- Color palette shifts with dominant frequency
- Smooth transitions between visualization modes

## Tech

- React + TypeScript
- Web Audio API (AudioContext, AnalyserNode, OscillatorNode)
- Canvas 2D for visualizations
- Framer Motion for text overlays
- No external audio files or libraries

## Acceptance Criteria

- [ ] Component exports `AudioReactive` from `src/components/presentation-modes/AudioReactive.tsx`
- [ ] Example entry added to `src/data/examples.ts` with id `audio-reactive`
- [ ] Lazy import + case added in `src/pages/ExampleViewer.tsx`
- [ ] Web Audio API integration with AnalyserNode
- [ ] Circular frequency bar visualization
- [ ] Waveform oscilloscope visualization
- [ ] Beat detection with visual response (particle burst or flash)
- [ ] Built-in audio generated via Web Audio oscillators
- [ ] Microphone input option with permission request
- [ ] Volume control and mute toggle
- [ ] 7+ slides about sound science overlaying visualizations
- [ ] Each slide changes visualization style
- [ ] Color shifts based on frequency content
- [ ] Respects `prefers-reduced-motion`
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] `npm run build` passes with no errors

**Output when complete:** `<promise>DONE</promise>`
