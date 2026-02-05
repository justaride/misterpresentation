# Spec: AI Chat Presentation

## ID

`ai-chat-presentation`

## Priority

7

## Category

`interactive-data`

## Description

A presentation delivered through a simulated AI chat interface. The "AI" types out responses that form the presentation content. Users can click suggested prompts or type custom questions to navigate between topics. Includes typing indicators, message bubbles, and timestamps.

## Content Theme

"Ask Me Anything: Modern CSS" — an AI assistant answers questions about CSS Grid, Container Queries, :has() selector, Cascade Layers, Subgrid, View Transitions, and Nesting.

## Requirements

- Chat UI: message bubbles (user right-aligned, AI left-aligned)
- AI typing indicator (three bouncing dots) before each response
- Character-by-character text reveal for AI responses
- Suggested prompt chips below the chat (3 options per response)
- Users can also type custom messages (mapped to nearest topic)
- Code blocks within chat messages (syntax highlighted)
- Timestamps on messages
- Chat history scrolls naturally, auto-scrolls to latest
- At least 7 topic threads about modern CSS
- Avatar icons for user and AI
- "New conversation" button to reset
- Smooth scroll behavior

## Tech

- React + TypeScript
- Framer Motion for message entrance animations
- React Syntax Highlighter for code blocks in chat
- Tailwind for chat bubble styling
- No actual AI/API calls — all responses are pre-written

## Acceptance Criteria

- [ ] Component exports `AiChatPresentation` from `src/components/presentation-modes/AiChatPresentation.tsx`
- [ ] Example entry added to `src/data/examples.ts` with id `ai-chat-presentation`
- [ ] Lazy import + case added in `src/pages/ExampleViewer.tsx`
- [ ] Chat bubble UI with user/AI message distinction
- [ ] Typing indicator animation before AI responses
- [ ] Character-by-character text reveal for AI messages
- [ ] 3 suggested prompt chips after each AI response
- [ ] Text input field for custom questions
- [ ] Code blocks with syntax highlighting in responses
- [ ] Timestamps on messages
- [ ] Auto-scroll to latest message
- [ ] 7+ CSS topics covered in conversation threads
- [ ] Reset/new conversation button
- [ ] Respects `prefers-reduced-motion`
- [ ] TypeScript strict — no `any`, no `@ts-ignore`
- [ ] `npm run build` passes with no errors

**Output when complete:** `<promise>DONE</promise>`
