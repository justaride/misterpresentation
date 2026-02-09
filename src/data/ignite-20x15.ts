export type IgnitePattern = "dots" | "stripes" | "rings" | "grid" | "waves";

export type IgniteSlide = {
  id: string;
  kicker: string;
  title: string;
  subtitle?: string;
  body?: string[];
  notes?: string;
  palette: {
    a: string; // "r g b" (space-separated)
    b: string; // "r g b"
  };
  pattern: IgnitePattern;
  align?: "left" | "center";
};

// Narrative: "The Next Presentation Form" told as an Ignite talk (20x15s).
// Keep slides scannable; the spoken track carries most of the nuance.
export const IGNITE_20X15_SLIDES: IgniteSlide[] = [
  {
    id: "title",
    kicker: "Ignite",
    title: "20 slides.\n15 seconds.",
    subtitle: "A talk that respects attention.",
    notes:
      "Set expectations: 5 minutes, auto-advancing. This is a rhythm game with ideas.",
    palette: { a: "79 70 229", b: "249 115 22" },
    pattern: "rings",
    align: "center",
  },
  {
    id: "cold-open",
    kicker: "Truth",
    title: "Your deck isn’t boring.\nYour form is.",
    subtitle: "Bullet slides are a document pretending to be a performance.",
    notes:
      "Punchy opener. Frame the problem as a mismatch between medium and moment.",
    palette: { a: "30 27 75", b: "129 140 248" },
    pattern: "stripes",
  },
  {
    id: "audience",
    kicker: "Audience",
    title: "They blink.\nThey scroll.\nThey miss lines.",
    subtitle: "Design for the distracted mind, not the ideal student.",
    notes:
      "Don’t shame the audience. Treat it as a design constraint you can win with.",
    palette: { a: "249 115 22", b: "79 70 229" },
    pattern: "dots",
  },
  {
    id: "constraint",
    kicker: "Constraint",
    title: "5 minutes forces a point of view.",
    subtitle: "If it doesn’t fit, it’s not the point.",
    notes:
      "Constraints aren’t a limitation. They’re an editorial tool that creates clarity.",
    palette: { a: "129 140 248", b: "249 115 22" },
    pattern: "grid",
  },
  {
    id: "rule-headlines",
    kicker: "Rule",
    title: "Headlines,\nnot labels.",
    subtitle: "Each slide makes a promise.",
    body: ["Bad: “Market”", "Good: “The market is lying”"],
    notes: "The fastest upgrade to any deck is rewriting titles as claims.",
    palette: { a: "79 70 229", b: "238 242 255" },
    pattern: "waves",
  },
  {
    id: "rhythm",
    kicker: "Rhythm",
    title: "Statement.\nProof.\nPause.",
    subtitle: "Repeat the beat until it feels inevitable.",
    notes:
      "Explain cadence. The timer is a metronome; your job is to sync the story to it.",
    palette: { a: "249 115 22", b: "30 27 75" },
    pattern: "rings",
  },
  {
    id: "form-follows-story",
    kicker: "Principle",
    title: "Form follows story.",
    subtitle: "Pick the constraint that matches the moment.",
    notes:
      "Transition into a quick tour of forms, each mapped to a narrative job.",
    palette: { a: "238 242 255", b: "79 70 229" },
    pattern: "grid",
  },
  {
    id: "takahashi",
    kicker: "Punch",
    title: "Takahashi",
    subtitle: "1–3 words.\nMaximum impact.",
    body: ["Perfect for: pitches", "Great for: opening + closing"],
    notes:
      "If you need a punch, use massive type and ruthless simplicity.",
    palette: { a: "30 27 75", b: "249 115 22" },
    pattern: "stripes",
  },
  {
    id: "pechakucha",
    kicker: "Imagery",
    title: "PechaKucha",
    subtitle: "20x20.\nVisual storytelling.",
    body: ["Perfect for: narratives", "Great for: conferences"],
    notes:
      "Pecha Kucha is a film trailer: fast, visual, no room for lecture.",
    palette: { a: "129 140 248", b: "79 70 229" },
    pattern: "dots",
  },
  {
    id: "lessig",
    kicker: "Cadence",
    title: "Lessig",
    subtitle: "Slides synced to every beat.",
    body: ["Perfect for: keynotes", "Great for: persuasion"],
    notes:
      "Lessig is choreography. The slide changes become punctuation.",
    palette: { a: "249 115 22", b: "129 140 248" },
    pattern: "waves",
  },
  {
    id: "scrollytelling",
    kicker: "Exploration",
    title: "Scrollytelling",
    subtitle: "Reveal on scroll.\nLet them explore.",
    body: ["Perfect for: explainers", "Great for: product stories"],
    notes:
      "When the audience needs to inspect, give them scroll, not clicks.",
    palette: { a: "79 70 229", b: "238 242 255" },
    pattern: "grid",
  },
  {
    id: "bento",
    kicker: "Density",
    title: "Bento grids",
    subtitle: "High information density.\nLow cognitive load.",
    body: ["Perfect for: features", "Great for: demos + docs"],
    notes:
      "Bento is for scanning. Strong hierarchy turns “a lot” into “clear.”",
    palette: { a: "30 27 75", b: "129 140 248" },
    pattern: "rings",
  },
  {
    id: "web-native",
    kicker: "Web-Native",
    title: "Interaction beats animation.",
    subtitle: "If it moves, it must mean something.",
    notes:
      "Call out restraint. Motion is pacing. Interaction is engagement.",
    palette: { a: "249 115 22", b: "79 70 229" },
    pattern: "stripes",
  },
  {
    id: "design-rules",
    kicker: "Design",
    title: "One focal point.\nBig type.\nHigh contrast.",
    subtitle: "Design for the back row.",
    notes:
      "Good rules. Remind them: readability is kindness.",
    palette: { a: "238 242 255", b: "30 27 75" },
    pattern: "dots",
  },
  {
    id: "performance",
    kicker: "Performance",
    title: "Fast is a UX feature.",
    subtitle: "Preload.\nReserve space.\nAvoid layout shifts.",
    notes:
      "In a live talk, delays are emotional. The audience feels every hiccup.",
    palette: { a: "129 140 248", b: "249 115 22" },
    pattern: "grid",
  },
  {
    id: "reduced-motion",
    kicker: "Accessibility",
    title: "Respect reduced motion.",
    subtitle: "Make the experience inclusive by default.",
    notes:
      "A11y is not optional. This deck respects prefers-reduced-motion.",
    palette: { a: "30 27 75", b: "238 242 255" },
    pattern: "waves",
  },
  {
    id: "live-data",
    kicker: "Proof",
    title: "Dashboards can be slides.",
    subtitle: "Live KPIs.\nLive stories.",
    notes:
      "Tie back to the repo: live data dashboard, polls, WebGL, scroll narratives.",
    palette: { a: "79 70 229", b: "249 115 22" },
    pattern: "rings",
  },
  {
    id: "tooling",
    kicker: "Tooling",
    title: "Mister Presentations",
    subtitle: "Pick a mode.\nShip a narrative.",
    body: ["Scroll", "Slide", "3D", "Code", "Data", "Story"],
    notes:
      "Position the collection as a menu of forms: choose the one your story needs.",
    palette: { a: "238 242 255", b: "79 70 229" },
    pattern: "grid",
  },
  {
    id: "next-step",
    kicker: "Next",
    title: "Pick one form.\nRehearse once.\nGo.",
    subtitle: "Constraint + repetition = confidence.",
    notes:
      "Give them a simple action: choose a format, draft 20 headlines, do one timed run.",
    palette: { a: "249 115 22", b: "30 27 75" },
    pattern: "stripes",
  },
  {
    id: "thanks",
    kicker: "Done",
    title: "Thank you.",
    subtitle: "Press R to restart. Space to pause.",
    notes: "Stop. Let it land.",
    palette: { a: "129 140 248", b: "79 70 229" },
    pattern: "waves",
    align: "center",
  },
];

