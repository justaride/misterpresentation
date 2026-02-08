# Spec: Physics Playground Presentation

## ID

`physics-playground`

## Priority

5

## Category

`animation-heavy`

## Description

A presentation where slide elements obey physics. Text blocks fall with gravity, can be dragged and thrown, bounce off walls, and stack on each other. Each slide starts with elements dropping in, and transitions use physics-based explosions or gravity shifts.

## Content Theme

"Understanding Web Performance" — 7 slides where performance metrics (LCP, FID, CLS, etc.) are physical objects you can interact with. Heavy elements = slow metrics, light elements = fast ones.

## Requirements

- 2D physics engine (implement with requestAnimationFrame, no external physics lib)
- Rigid body simulation: gravity, collision detection, bounce, friction
- Draggable elements: grab and throw with velocity
- Elements: rectangular text blocks, circular badges, ground plane
- Each slide has 4-8 physics objects that drop in sequentially
- Gravity direction changes on slide transition (flip, rotate)
- Objects have mass proportional to their visual size
- Wall boundaries (viewport edges)
- At least 7 slides about web performance metrics
- Reset button to replay physics animation
- Performance: maintain 60fps with up to 20 objects

## Tech

- React + TypeScript
- Canvas 2D for physics rendering (overlay on React content)
- requestAnimationFrame loop for physics step
- Framer Motion for non-physics UI elements
- No external physics libraries

## Acceptance Criteria

- [ ] Component exports `PhysicsPlayground` from `src/components/presentation-modes/PhysicsPlayground.tsx`
- [ ] Example entry added to `src/data/examples.ts` with id `physics-playground`
- [ ] Lazy import + case added in `src/pages/ExampleViewer.tsx`
- [ ] Physics simulation with gravity, collision, and bounce
- [ ] Elements are draggable and throwable with mouse/touch
- [ ] 7+ slides about web performance
- [ ] Objects drop in with physics on each slide
- [ ] Gravity direction changes on transitions
- [ ] Wall boundaries prevent objects leaving viewport
- [ ] Reset button replays physics animation
- [ ] Maintains smooth performance (no frame drops with 15+ objects)
- [ ] Respects `prefers-reduced-motion` (static layout, no physics)
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] `npm run build` passes with no errors

**Output when complete:** `<promise>DONE</promise>`
