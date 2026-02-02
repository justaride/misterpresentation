# Presentation Blueprint: Building a Custom React Hook

## Slide 1 – The Starting Point
**Purpose:** Introduce the initial component that has local state and logic that we want to extract.

**Content:**
**Headline (Top-Center):**
"Starting Point: The Window Width Component"
**Subheading (Below Headline):**
"A simple component that tracks window size."

**Layout:**
- Headline at the top.
- Code block on the left (60% width).
- Live preview on the right (40% width).

**Typography:**
- Headline: "Fira Code", Bold, 48pt, White.
- Subheading: "Inter", Light, 24pt, Gray-400.

**Code Snippet:**
```jsx
function WindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <div>Window width: {width}px</div>;
}
```

**Visual:**
- A dark themed IDE-like background for the code.
- A clean, bordered box for the live preview showing the current window width.

---

## Slide 2 – The Problem: Duplication
**Purpose:** Highlight why we want to extract this logic—reusability.

**Content:**
**Headline (Top-Center):**
"The Problem: We Need This Everywhere"
**Subheading (Below Headline):**
"Copy-pasting this logic into multiple components is a nightmare."

**Layout:**
- Two identical code blocks side-by-side, each with a different component name (`ProfileCard`, `Navbar`).

**Typography:**
- Headline: "Fira Code", Bold, 48pt, White.

**Visual:**
- A "Copy/Paste" icon appearing between the two components, indicating redundancy.

---

## Slide 3 – Extraction Phase 1: Creating the Hook
**Purpose:** Show the first step of extraction—moving the logic into a separate function.

**Content:**
**Headline (Top-Center):**
"Step 1: Extract the Logic"
**Subheading (Below Headline):**
"Move the `useState` and `useEffect` into a new function starting with `use`."

**Layout:**
- Code block centered.
- Highlight the new function definition.

**Code Snippet:**
```jsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}
```

**Typography:**
- Headline: "Fira Code", Bold, 48pt, White.

---

## Slide 4 – Phase 2: Refactoring the Component
**Purpose:** Show how much cleaner the original component becomes.

**Content:**
**Headline (Top-Center):**
"Step 2: Use the Hook"
**Subheading (Below Headline):**
"The component is now focused solely on rendering."

**Layout:**
- Comparison: Before (Old Code) on the left, After (New Code) on the right.

**Code Snippet (After):**
```jsx
function WindowWidth() {
  const width = useWindowWidth();

  return <div>Window width: {width}px</div>;
}
```

**Typography:**
- Headline: "Fira Code", Bold, 48pt, White.

---

## Slide 5 – The Final Result
**Purpose:** Recap and celebrate the clean, reusable solution.

**Content:**
**Headline (Center):**
"Hook Extracted!"
**Subheading (Center):**
"One hook, infinite components."

**Layout:**
- Centered.

**Typography:**
- Headline: "Fira Code", Bold, 64pt, Cyan-400.

**Visual:**
- A "Clean Code" badge or a high-five animation.
- Final live preview still working exactly the same.
