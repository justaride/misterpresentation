# Presentation Blueprint: The Art of Vertical Storytelling

## Slide 1 – The New Scroll
**Purpose:** Hook the viewer immediately with the core concept and the tactile nature of the medium.

**Content:**
**Headline (Center, Huge):**
"Vertical."
**Subheading (Center, Medium):**
"The native gesture of the web."
**Footer (Bottom-center, Small):**
"Scroll down to begin"

**Layout:**
- Centered layout.
- Headline takes up visual center.
- Subheading just below.
- Footer prompts interaction at the very bottom.

**Typography:**
- Headline: Inter Black, 120pt, White.
- Subheading: Inter Regular, 32pt, Light Gray (#A0A0A0).
- Footer: Inter Mono, 14pt, Blink Animation.

**Visual:**
- A subtle, large downward arrow animation behind the text, pulsing slowly.
- Background: Deep void black (#050505).

---

## Slide 2 – Friction vs. Flow
**Purpose:** Explain the mechanical difference between standard scrolling and scroll snapping.

**Content:**
**Headline (Top-Left):**
"Friction vs. Flow"
**Body Text (Left, Middle):**
"Standard scrolling is infinite, slippery, and unanchored.
Scroll Snap provides **friction**.
It gives weight to content."

**Layout:**
- Split layout. Text on the left (50%). Visual abstract representation on right.

**Typography:**
- Headline: Inter Bold, 64pt, White.
- Body Text: Inter Light, 24pt, White, leading-relaxed.
- "**friction**" in Bold and highlighted in Electric Blue (#007AFF).

**Visual:**
- Right side: A split graphic.
- Left half of graphic: A blurry streak (representing standard scroll).
- Right half of graphic: A series of distinct, magnetic blocks locking into place (representing snap).

---

## Slide 3 – The Physics of Attention
**Purpose:** psychological impact of the format.

**Content:**
**Headline (Center):**
"The Physics of Attention"
**Quote (Center):**
"When the page stops, the mind focuses."

**Layout:**
- Minimalist. Text floating in valid empty space.

**Typography:**
- Headline: Inter SemiBold, 48pt, Gray (#666).
- Quote: Inter ExtraBold, 72pt, White.

**Visual:**
- A single, sharp spotlight effect illuminating the quote from above. Rest of the slide in shadow.

---

## Slide 4 – Agency & Control
**Purpose:** Address the user experience aspect—giving control back to the user unlike auto-playing carousels.

**Content:**
**Headline (Bottom-Right):**
"You are in control."
**Body Text (Top-Left):**
"Unlike video, you set the pace.
Unlike sliders, you use the native gesture.
It respects the user's agency."

**Layout:**
- Diagonal balance. Body text top-left. Headline bottom-right.

**Typography:**
- Headline: Inter Black, 90pt, Electric Blue (#007AFF).
- Body Text: Inter Regular, 28pt, White.

**Visual:**
- Background is a subtle mesh wireframe that distorts slightly based on "scroll speed" (implied static visual of distortion).

---

## Slide 5 – Under the Hood
**Purpose:** Show how simple the implementation is (Code).

**Content:**
**Headline (Top-Left):**
"Just CSS."
**Code Block (Center):**
```css
.container {
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.section {
  height: 100vh;
  scroll-snap-align: start;
}
```

**Layout:**
- Headline small at top.
- Code block dominates the center, styled like a terminal.

**Typography:**
- Headline: Inter Bold, 32pt, Gray.
- Code: JetBrains Mono, 20pt, Syntax Highlighting (Green/Blue/Pink).

**Visual:**
- Dark gray terminal window background with macOS style window controls. Drop shadow.

---

## Slide 6 – The Future is Vertical
**Purpose:** Conclusion and call to action.

**Content:**
**Headline (Center):**
"The Future is Vertical."
**Subheading (Center):**
"Start snapping."

**Layout:**
- Centered.

**Typography:**
- Headline: Inter Black, 100pt, Transparent with White Stroke (Outline).
- Subheading: Inter Bold, 40pt, Electric Blue (#007AFF).

**Visual:**
- Background: A slow vertical gradient from Black to Deep Blue (#001040).
