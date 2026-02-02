import {
  MonitorPlay,
  Cpu,
  Zap,
  Clock,
  Type,
  LayoutGrid,
  Box,
  MessageSquare,
  BarChart,
  MousePointer2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ResearchItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
};

export type ResearchCategory = {
  id: string;
  title: string;
  description: string;
  items: ResearchItem[];
};

export const RESEARCH_DATA: ResearchCategory[] = [
  {
    id: "philosophies",
    title: "Presentation Philosophies & Formats",
    description:
      "Structural rules and constraints that define the delivery method.",
    items: [
      {
        id: "pechakucha",
        title: "PechaKucha",
        description:
          "20 slides, 20 seconds each (6:40 total). Forces extreme conciseness and visual storytelling.",
        icon: Clock,
        tags: ["Strict Timing", "Visuals Only", "20x20"],
      },
      {
        id: "ignite",
        title: "Ignite",
        description:
          "20 slides, 15 seconds each (5:00 total). Faster paced, high energy, often auto-advancing.",
        icon: Zap,
        tags: ["High Energy", "Auto-advance", "Speed"],
      },
      {
        id: "takahashi",
        title: "Takahashi Method",
        description:
          "Massive text (1-3 words per slide). No images. Rapid-fire delivery synchronized with speech.",
        icon: Type,
        tags: ["Typography", "High Impact", "Rapid Fire"],
      },
      {
        id: "lessig",
        title: "Lessig Method",
        description:
          "Evolution of Takahashi. More slides, synchronized with every phrase or beat of the speech.",
        icon: MonitorPlay,
        tags: ["Synchronization", "Flow", "Text-heavy"],
      },
      {
        id: "10-20-30",
        title: "Guy Kawasaki's 10/20/30",
        description:
          "10 slides, 20 minutes, 30pt minimum font size. The gold standard for venture capital pitches.",
        icon: LayoutGrid,
        tags: ["Pitching", "Business", "Constraints"],
      },
    ],
  },
  {
    id: "visual-styles",
    title: "Visual Styles & Aesthetics",
    description:
      "Modern frontend design principles applied to presentation slides.",
    items: [
      {
        id: "bento",
        title: "Bento Grid",
        description:
          "Card-based, modular layouts. highly organized and information-dense yet clean. Popular in Apple/Linear marketing.",
        icon: LayoutGrid,
        tags: ["Modern", "Grid", "Clean"],
      },
      {
        id: "scrollytelling",
        title: "Scrollytelling",
        description:
          "Content reveals triggered by scroll position. Blends the line between article and presentation.",
        icon: MousePointer2,
        tags: ["Scroll", "Narrative", "Web-Native"],
      },
      {
        id: "brutalism",
        title: "Neo-Brutalism",
        description:
          "Raw, unpolished, bold typography, high contrast, hard shadows. 'Ugly-cool' aesthetic.",
        icon: Box,
        tags: ["Bold", "Raw", "High Contrast"],
      },
      {
        id: "kinetic",
        title: "Kinetic Typography",
        description:
          "Text is the main character. Words move, morph, and react to specific triggers or timing.",
        icon: Type,
        tags: ["Motion", "Text", "Animation"],
      },
    ],
  },
  {
    id: "tech-stack",
    title: "Technical Stack",
    description:
      "The libraries and frameworks that power modern web presentations.",
    items: [
      {
        id: "reveal",
        title: "Reveal.js",
        description:
          "The gold standard for HTML slides. Robust, extensible, and feature-rich.",
        icon: Cpu,
        tags: ["Standard", "HTML", "Robust"],
      },
      {
        id: "spectacle",
        title: "Spectacle",
        description:
          "React-first deck builder. Components as slides, with support for live code execution.",
        icon: MonitorPlay,
        tags: ["React", "Components", "Live Code"],
      },
      {
        id: "three-fiber",
        title: "React Three Fiber",
        description:
          "3D scenes in your slides. Immersive backgrounds, 3D models, and WebGL effects.",
        icon: Box,
        tags: ["3D", "WebGL", "Immersive"],
      },
      {
        id: "framer-motion",
        title: "Framer Motion",
        description:
          "Production-ready motion library for React. Essential for 'Magic Move' style transitions.",
        icon: Zap,
        tags: ["Animation", "React", "Transitions"],
      },
    ],
  },
  {
    id: "interactive",
    title: "Interactive Integrations",
    description: "Tools that turn a monologue into a dialogue.",
    items: [
      {
        id: "realtime-polling",
        title: "Real-time Polling",
        description:
          "Websockets/PartyKit integrations to let the audience vote from their phones.",
        icon: BarChart,
        tags: ["Websockets", "Voting", "Engagement"],
      },
      {
        id: "collaborative",
        title: "Collaborative Cursors",
        description:
          "See the audience on the screen. Multiplayer presence for shared whiteboard moments.",
        icon: MousePointer2,
        tags: ["Multiplayer", "Presence", "Fun"],
      },
      {
        id: "backchannel",
        title: "Q&A Backchannel",
        description:
          "Dedicated feed for audience questions, upvoted in real-time.",
        icon: MessageSquare,
        tags: ["Q&A", "Feedback", "Social"],
      },
    ],
  },
];
