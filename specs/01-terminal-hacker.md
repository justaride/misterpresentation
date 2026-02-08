# Spec: Terminal Hacker Presentation

## ID

`terminal-hacker`

## Priority

1

## Category

`code-focused`

## Description

A hacker/terminal-themed presentation that simulates a command-line interface. Each "slide" is a command the user types (or auto-types) that reveals content. Includes fake file system navigation, ASCII art headers, Matrix-style rain background, and glowing green-on-black aesthetic.

## Content Theme

"The Future of Open Source" — 8 terminal commands that reveal slides about OSS trends, community, funding, and impact.

## Requirements

- Full terminal UI: prompt line, blinking cursor, scrollback buffer
- Auto-type animation with realistic keystroke timing (variable speed, occasional pauses)
- User can press Enter or Space to advance to next command
- ASCII art section headers generated with figlet-style text
- Matrix digital rain canvas background (subtle, behind terminal)
- Scanline CRT effect overlay (CSS)
- At least 8 commands/slides: `whoami`, `cat intro.txt`, `ls projects/`, `grep -r "funding"`, etc.
- Sound effects toggle (optional keyboard clicks)
- Mobile: tap to advance, responsive terminal scaling

## Tech

- React + TypeScript
- Canvas API for Matrix rain
- CSS animations for CRT scanlines + cursor blink
- Monospace font (JetBrains Mono or system monospace)
- No external dependencies beyond what's in package.json

## Acceptance Criteria

- [ ] Component exports `TerminalHacker` from `src/components/presentation-modes/TerminalHacker.tsx`
- [ ] Example entry added to `src/data/examples.ts` with id `terminal-hacker`
- [ ] Lazy import + case added in `src/pages/ExampleViewer.tsx`
- [ ] 8+ terminal command slides with content about open source
- [ ] Auto-typing animation with blinking cursor
- [ ] Matrix rain canvas background renders without performance issues
- [ ] CRT scanline overlay effect visible
- [ ] Keyboard navigation (Enter/Space to advance, Escape to go back)
- [ ] Respects `prefers-reduced-motion` (skip animations, show content immediately)
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] `npm run build` passes with no errors

**Output when complete:** `<promise>DONE</promise>`
