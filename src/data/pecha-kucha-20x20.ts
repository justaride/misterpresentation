export type PechaKuchaPattern = "dots" | "stripes" | "rings" | "grid" | "waves";

export type PechaKuchaSlide = {
  id: string;
  kicker: string;
  title: string;
  subtitle?: string;
  body?: string[];
  notes?: string;
  palette: {
    a: string; // "r g b" (space-separated) for CSS rgb(var(--...)) usage
    b: string; // "r g b"
  };
  pattern: PechaKuchaPattern;
  align?: "left" | "center";
};

export const PECHA_KUCHA_20X20_SLIDES: PechaKuchaSlide[] = [
  {
    id: "title",
    kicker: "Pecha Kucha",
    title: "20 slides. 20 seconds.",
    subtitle: "A talk with a built-in metronome.",
    notes:
      "Set the tone: this format is strict on purpose. Tell them it's 6 minutes and 40 seconds total.",
    palette: { a: "0 194 255", b: "182 255 77" },
    pattern: "rings",
    align: "center",
  },
  {
    id: "why",
    kicker: "Why",
    title: "Constraint makes you choose.",
    subtitle: "No room for the nice-to-have.",
    body: ["Pick the one thing they remember.", "Everything else is support."],
    notes: "Explain the benefit: clarity, pacing, and a clear editorial voice.",
    palette: { a: "255 176 0", b: "255 77 77" },
    pattern: "stripes",
  },
  {
    id: "one-idea",
    kicker: "Rule",
    title: "One idea per slide.",
    subtitle: "Let the visual do the heavy lifting.",
    body: ["If you need paragraphs, you need fewer slides."],
    notes: "Give an example: one image + one sentence beats five bullets.",
    palette: { a: "92 124 250", b: "0 194 255" },
    pattern: "dots",
  },
  {
    id: "pacing",
    kicker: "Pacing",
    title: "Write for your mouth, not your doc.",
    subtitle: "Short sentences. Breathable beats.",
    notes:
      "Read one line out loud. If it trips you up, it will trip the audience too.",
    palette: { a: "124 255 203", b: "255 176 0" },
    pattern: "waves",
  },
  {
    id: "structure",
    kicker: "Structure",
    title: "Hook. Three acts. Landing.",
    subtitle: "A story shape your timer can't break.",
    body: ["Setup", "Tension", "Release"],
    notes: "Make the structure visible; the audience relaxes when they can track you.",
    palette: { a: "255 140 200", b: "92 124 250" },
    pattern: "grid",
  },
  {
    id: "twenty-seconds",
    kicker: "Timing",
    title: "20 seconds is a paragraph.",
    subtitle: "Or one strong statement.",
    notes:
      "If you say more than a paragraph per slide, you'll sprint. If you say less, you'll drift.",
    palette: { a: "182 255 77", b: "255 107 0" },
    pattern: "rings",
  },
  {
    id: "rehearse",
    kicker: "Practice",
    title: "Rehearse with a timer.",
    subtitle: "Make the transitions feel inevitable.",
    body: ["Practice out loud.", "Record one run.", "Fix the worst 3 moments."],
    notes:
      "The best rehearsal trick: fix only the worst moments first. Big gains, low effort.",
    palette: { a: "0 194 255", b: "255 176 0" },
    pattern: "dots",
  },
  {
    id: "cut",
    kicker: "Editing",
    title: "Cut until it hurts.",
    subtitle: "Then cut once more.",
    notes:
      "Make the audience curious, not exhausted. If you can say it in Q&A, remove it now.",
    palette: { a: "255 77 77", b: "92 124 250" },
    pattern: "stripes",
  },
  {
    id: "data",
    kicker: "Data",
    title: "Show the number. Say the story.",
    subtitle: "Avoid explaining your chart.",
    body: ["Annotate the takeaway.", "Remove everything else."],
    notes: "One takeaway per chart. If it needs a lecture, it's the wrong chart.",
    palette: { a: "124 255 203", b: "0 194 255" },
    pattern: "grid",
  },
  {
    id: "silence",
    kicker: "Voice",
    title: "Use silence as design.",
    subtitle: "A pause is a slide transition.",
    notes:
      "Demonstrate a 1-second pause. It's dramatic, not awkward, when it's intentional.",
    palette: { a: "255 176 0", b: "182 255 77" },
    pattern: "waves",
  },
  {
    id: "motion",
    kicker: "Motion",
    title: "Keep motion intentional.",
    subtitle: "If it moves, it means something.",
    body: ["Use 1-2 transition styles.", "Repeat them on purpose."],
    notes:
      "In a timed deck, motion is pacing. Overdo it and you compete with your own words.",
    palette: { a: "92 124 250", b: "255 140 200" },
    pattern: "rings",
  },
  {
    id: "type",
    kicker: "Type",
    title: "Big type is kind.",
    subtitle: "If it can't be read, it can't be heard.",
    notes:
      "A rule of thumb: if you can't read it from 2 meters away on your laptop, it's too small.",
    palette: { a: "182 255 77", b: "124 255 203" },
    pattern: "dots",
  },
  {
    id: "headlines",
    kicker: "Titles",
    title: "Headlines, not labels.",
    subtitle: "Make each slide a promise.",
    body: ["Bad: \"Market\"", "Good: \"The market is lying\""],
    notes: "Rewrite 3 slide titles live (if you can). It's the fastest upgrade.",
    palette: { a: "255 107 0", b: "255 176 0" },
    pattern: "stripes",
  },
  {
    id: "motif",
    kicker: "Continuity",
    title: "Repeat a motif.",
    subtitle: "Color. Shape. Phrase. Rhythm.",
    notes:
      "Point out the consistency: it makes the talk feel designed, not assembled.",
    palette: { a: "0 194 255", b: "92 124 250" },
    pattern: "grid",
  },
  {
    id: "audience",
    kicker: "Audience",
    title: "Design for the back row.",
    subtitle: "And the distracted mind.",
    body: ["Contrast", "Whitespace", "One focal point"],
    notes:
      "Audience reality: people blink, glance at phones, and miss words. Design to survive that.",
    palette: { a: "255 77 77", b: "255 140 200" },
    pattern: "waves",
  },
  {
    id: "tech-check",
    kicker: "Tech",
    title: "Test the room.",
    subtitle: "Fonts. Aspect ratio. Clicker. Audio.",
    body: ["Bring a backup (PDF/video).", "Know your shortcuts.", "Have offline assets."],
    notes:
      "If the room is unfamiliar, show your first slide early. Fix the problem before the audience arrives.",
    palette: { a: "124 255 203", b: "255 176 0" },
    pattern: "rings",
  },
  {
    id: "nerves",
    kicker: "Nerves",
    title: "Trust the constraint.",
    subtitle: "It carries you when you rush.",
    notes:
      "Make it personal: everyone speeds up. The timer keeps you honest and keeps you moving.",
    palette: { a: "182 255 77", b: "0 194 255" },
    pattern: "dots",
  },
  {
    id: "ending",
    kicker: "Ending",
    title: "Land the plane early.",
    subtitle: "Last slide: no new ideas.",
    body: ["Summary", "One image", "One line"],
    notes:
      "If you add new information on the last slide, you steal the ending from yourself.",
    palette: { a: "255 176 0", b: "92 124 250" },
    pattern: "stripes",
  },
  {
    id: "next-step",
    kicker: "After",
    title: "Leave one next step.",
    subtitle: "A link. A question. A challenge.",
    notes:
      "Give them a single action. Too many options feels like none at all.",
    palette: { a: "92 124 250", b: "124 255 203" },
    pattern: "grid",
  },
  {
    id: "thanks",
    kicker: "Done",
    title: "Thank you.",
    subtitle: "Press R to restart. Space to pause.",
    notes: "Stop talking. Smile. Let the ending land.",
    palette: { a: "255 140 200", b: "255 77 77" },
    pattern: "waves",
    align: "center",
  },
];

