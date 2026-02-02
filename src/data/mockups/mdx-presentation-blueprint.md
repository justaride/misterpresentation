# Presentation Blueprint: Introduction to React Hooks

## Slide 1 – Welcome to the Future
**Purpose:** Introduce the topic and set a technical but accessible tone.

**Content:**
**Headline (Center):**
"React Hooks"
**Subheading (Center):**
"Functional components on steroids."
**Code Snippet (Center-Small):**
```jsx
const [state, setState] = useState(0);
```

**Layout:**
- Centered headline and subheading.
- Small, glowing code snippet floating below the subheading.

**Typography:**
- Headline: "Fira Code", Bold, 80pt, Cyan-400 (#22D3EE).
- Subheading: "Inter", Regular, 32pt, Gray-400 (#9CA3AF).

**Visual:**
- Background: Deep Dark Gray (#111827).
- Subtle "React" logo spinning slowly in the background with low opacity.

---

## Slide 2 – Why Hooks?
**Purpose:** Contrast old Class components with new Functional Hooks.

**Content:**
**Headline (Top-Left):**
"The 'Why'"
**Comparison (Left/Right):**
(Left: Class)
- `this.state`
- Lifecycle methods
- `bind(this)` boilerplate
(Right: Hooks)
- Plain functions
- Composable logic
- Clean, concise code

**Layout:**
- Split screen (50/50).
- Comparison lists side-by-side.

**Typography:**
- Headline: "Fira Code", Bold, 48pt, White.
- List Items: "Inter", Regular, 24pt, White.

**Visual:**
- Left side has a slightly muted, "legacy" feel (Gray-800 background).
- Right side is vibrant (Cyan-900 background).

---

## Slide 3 – useState
**Purpose:** Explain the most fundamental hook with a live demo.

**Content:**
**Headline (Top-Left):**
"`useState`"
**Code Block (Left, 60%):**
```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```
**Live Demo (Right, 40%):**
[Interactive Counter Button]

**Layout:**
- Code block on the left.
- Interactive demo area on the right with a border.

**Typography:**
- Headline: "Fira Code", Bold, 48pt, Cyan-400.
- Code: "Fira Code", 18pt.

**Visual:**
- Interactive demo area has a glowing border and a "Live" badge.

---

## Slide 4 – useEffect
**Purpose:** Explain side effects.

**Content:**
**Headline (Top-Left):**
"`useEffect`"
**Body Text (Left):**
"Synchronize your component with an external system."
**Code Block (Center):**
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => clearInterval(timer);
}, []);
```

**Layout:**
- Headline and text at top-left.
- Code block centered below.

**Typography:**
- Headline: "Fira Code", Bold, 48pt, Cyan-400.
- Body Text: "Inter", Regular, 24pt, Gray-300.

**Visual:**
- An animated "clock" icon or pulse effect appearing when the slide is active.

---

## Slide 5 – Custom Hooks
**Purpose:** Demonstrate the power of logic reuse.

**Content:**
**Headline (Top-Center):**
"Reuse Your Logic"
**Code Block (Center):**
```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  // ... event listener logic
  return isOnline;
}
```

**Layout:**
- Centered headline and code block.

**Typography:**
- Headline: "Fira Code", Bold, 48pt, Cyan-400.

**Visual:**
- A "Lego block" illustration showing two different components plugging into the same hook.

---

## Slide 6 – Summary
**Purpose:** Recap and final takeaway.

**Content:**
**Headline (Center):**
"Hooks = Happiness"
**Checklist (Center):**
- Simpler components
- Better logic reuse
- Future-proof React
**Footer (Bottom):**
"Start Hooking Today."

**Layout:**
- Centered.

**Typography:**
- Headline: "Fira Code", Bold, 72pt, Cyan-400.
- Checklist: "Inter", Medium, 32pt, White.
