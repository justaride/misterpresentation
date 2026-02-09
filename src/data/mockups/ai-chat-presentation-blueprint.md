# Presentation Blueprint: AI Chat Presentation

## ID
`ai-chat-presentation`

## Overview
Conversational AI chat interface that reveals presentation content through simulated dialogue with typing indicators.

## Metadata
- Category: `interactive-data`
- Format: `standard`
- Difficulty: `intermediate`
- Tags: `framer-motion`, `chat-ui`, `interactive`

## Visual Style
- Typography: `var(--font-display)` for big headings, `var(--font-mono)` for UI labels, `var(--font-body)` for supporting text.
- Palette: dashboard panels, muted surfaces, and status colors (good/warn/danger).
- Signature elements:
  - Transitions: View Transitions API demo content included.

## Navigation & Controls
- Next: `→` or `Space`.
- Previous: `←`.
- Exit: `Esc` (return to gallery).

## Slide Breakdown

## Slide 1 – CSS Grid

**Purpose:** Hook the audience and establish the premise.

**Content:**

**Headline (Center, Huge):**
"CSS Grid"

**User Prompt (Chat Bubble):**
"Tell me about CSS Grid"

**AI Response (Chat Bubble):**
CSS Grid is a two-dimensional layout system that revolutionized web design. Unlike Flexbox (which is one-dimensional), Grid lets you control both rows and columns simultaneously. It's now supported in all modern browsers and is the go-to for complex page layouts.

**Code Block (Monospace):**
```css
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}
```

**Body Beats:**
- Container Queries
- :has() selector
- Subgrid

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
## Slide 2 – Container Queries

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Container Queries"

**User Prompt (Chat Bubble):**
"What are Container Queries?"

**AI Response (Chat Bubble):**
Container Queries let components respond to their parent container's size rather than the viewport. This is a game-changer for component-based design — a card component can adapt whether it's in a sidebar or main content area without media queries.

**Code Block (Monospace):**
```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { flex-direction: row; }
}
```

**Body Beats:**
- CSS Nesting
- View Transitions
- Cascade Layers

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
## Slide 3 – :has() selector

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
":has() selector"

**User Prompt (Chat Bubble):**
"How does the :has() selector work?"

**AI Response (Chat Bubble):**
The :has() selector is often called the "parent selector" — something CSS developers wanted for 20+ years. It lets you style an element based on its children or subsequent siblings. It's incredibly powerful for form validation, conditional styling, and more.

**Code Block (Monospace):**
```css
/* Style form group when input is focused */
.form-group:has(input:focus) {
  border-color: blue;
}

/* Style article only if it has an image */
article:has(img) {
  grid-column: span 2;
}
```

**Body Beats:**
- CSS Grid
- CSS Nesting
- Cascade Layers

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
## Slide 4 – Cascade Layers

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Cascade Layers"

**User Prompt (Chat Bubble):**
"Explain Cascade Layers"

**AI Response (Chat Bubble):**
Cascade Layers (@layer) give you explicit control over the cascade — the specificity order of your CSS. You define layers and their priority, making it much easier to manage CSS from different sources: resets, frameworks, components, and overrides.

**Code Block (Monospace):**
```css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; box-sizing: border-box; }
}

@layer components {
  .btn { padding: 0.5rem 1rem; }
}

@layer utilities {
  .mt-4 { margin-top: 1rem; }
}
```

**Body Beats:**
- Subgrid
- View Transitions
- :has() selector

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
## Slide 5 – Subgrid

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"Subgrid"

**User Prompt (Chat Bubble):**
"What is CSS Subgrid?"

**AI Response (Chat Bubble):**
Subgrid lets a grid item's children participate in the parent grid's track sizing. Before subgrid, nested grids couldn't align with their parent. Now, card titles across a row can align perfectly even with varying content lengths.

**Code Block (Monospace):**
```css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
```

**Body Beats:**
- CSS Grid
- Container Queries
- CSS Nesting

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
## Slide 6 – View Transitions

**Purpose:** Advance the story with one clear idea and one visual beat.

**Content:**

**Headline (Center, Huge):**
"View Transitions"

**User Prompt (Chat Bubble):**
"How do View Transitions work?"

**AI Response (Chat Bubble):**
The View Transitions API enables smooth animated transitions between DOM states — even across page navigations in multi-page apps. The browser takes a snapshot before and after, then animates between them. It's like magic page transitions with minimal code.

**Code Block (Monospace):**
```javascript
document.startViewTransition(() => {
  // Update the DOM
  updateContent();
});

/* CSS */
::view-transition-old(root) {
  animation: fade-out 0.3s;
}
::view-transition-new(root) {
  animation: fade-in 0.3s;
}
```

**Body Beats:**
- CSS Nesting
- :has() selector
- Cascade Layers

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
## Slide 7 – CSS Nesting

**Purpose:** Close the loop with a memorable ending and a clear takeaway.

**Content:**

**Headline (Center, Huge):**
"CSS Nesting"

**User Prompt (Chat Bubble):**
"Tell me about native CSS Nesting"

**AI Response (Chat Bubble):**
Native CSS nesting is finally here — no preprocessor needed. You can nest selectors inside parent rules just like in Sass or Less. The & symbol references the parent selector. It's supported in all modern browsers since 2023.

**Code Block (Monospace):**
```css
.card {
  padding: 1rem;
  background: white;

  & .title {
    font-size: 1.25rem;
    font-weight: bold;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  @media (width >= 768px) {
    padding: 2rem;
  }
}
```

**Body Beats:**
- Cascade Layers
- Container Queries
- Subgrid

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
