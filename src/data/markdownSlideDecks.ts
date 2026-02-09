export type MarkdownDeckId =
  | "md-investor-pitch-clearbox"
  | "md-client-proposal-pilot"
  | "md-technical-deep-dive"
  | "md-incident-postmortem"
  | "md-workshop-training";

type MarkdownDeck = {
  id: MarkdownDeckId;
  title: string;
  markdown: string;
};

// Keep the "source of truth" decks in repo `examples/`.
// Vite `?raw` imports bundle the markdown as strings.
import investorPitch from "../../examples/markdown-slides/01-investor-pitch-clearbox.md?raw";
import clientProposal from "../../examples/markdown-slides/02-client-proposal-pilot.md?raw";
import technicalDeepDive from "../../examples/markdown-slides/03-technical-deep-dive-architecture.md?raw";
import incidentPostmortem from "../../examples/markdown-slides/04-incident-postmortem.md?raw";
import workshopTraining from "../../examples/markdown-slides/05-workshop-training.md?raw";

export const MARKDOWN_SLIDE_DECKS: Record<MarkdownDeckId, MarkdownDeck> = {
  "md-investor-pitch-clearbox": {
    id: "md-investor-pitch-clearbox",
    title: "Markdown Slides: Investor Pitch",
    markdown: investorPitch,
  },
  "md-client-proposal-pilot": {
    id: "md-client-proposal-pilot",
    title: "Markdown Slides: Client Proposal",
    markdown: clientProposal,
  },
  "md-technical-deep-dive": {
    id: "md-technical-deep-dive",
    title: "Markdown Slides: Technical Deep Dive",
    markdown: technicalDeepDive,
  },
  "md-incident-postmortem": {
    id: "md-incident-postmortem",
    title: "Markdown Slides: Incident Postmortem",
    markdown: incidentPostmortem,
  },
  "md-workshop-training": {
    id: "md-workshop-training",
    title: "Markdown Slides: Workshop / Training",
    markdown: workshopTraining,
  },
};

