# Mister Presentations — Constitution

## Vision

A developer showcase demonstrating cutting-edge, creative web presentation techniques. This is a portfolio piece that proves mastery of modern frontend — animations, 3D, interactivity, scroll-driven experiences.

## Target Audience

- Potential employers and clients evaluating frontend skill
- Developers seeking inspiration and reusable presentation patterns

## Tech Stack

- React 19 + TypeScript 5 (strict) + Vite 7
- Tailwind CSS 4
- Framer Motion, GSAP, Lottie (animation)
- Three.js + React Three Fiber + Drei (3D/WebGL)
- React Router 7 (routing)
- Deployed on Vercel

## Quality Bar: Production

- All code must be TypeScript strict — no `any`, no `@ts-ignore`
- Accessibility: respect `prefers-reduced-motion`, semantic HTML, keyboard navigation
- Performance: lazy load presentation components, optimize bundle size
- Responsive: mobile-first, works on all viewports
- Tests: unit tests for utilities, visual regression for key modes
- No dead code, no unused dependencies

## Architecture

- Each presentation mode = self-contained component in `src/components/presentation-modes/`
- Example metadata in `src/data/examples.ts`
- Dynamic routing via `ExampleViewer.tsx` with lazy loading
- 8 categories: Scroll-Driven, Slide-Based, Interactive Data, 3D/WebGL, Typography, Animation, Code-Focused, Storytelling

## Development Priorities

1. **More presentation modes** — expand beyond current 20 with novel, impressive techniques
2. **Polish & production** — refine existing modes, fix bugs, improve UX, optimize performance

## Coding Standards

- `type` over `interface`
- No enums — use string literal unions
- Explicit return types on exported functions
- camelCase variables/functions, PascalCase types/components, UPPER_SNAKE constants
- 2-space indentation, single quotes
- Early returns over nested conditionals
- DRY: extract common patterns
- KISS: simple over clever
- YAGNI: only what's needed now

## Git Workflow

- Feature branches from main
- Small, focused commits with descriptive messages
- Never force push to main
- PR with summary + test plan via `gh pr create`

## Ralph Guidelines

- Each spec = one presentation mode or one focused improvement
- Acceptance criteria must be specific and testable
- Verify in browser before marking done
- Commit after each completed spec
- Log learnings to `ralph_history.txt`
