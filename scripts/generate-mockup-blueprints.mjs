#!/usr/bin/env node
/**
 * Generates missing presentation blueprint markdown files in `src/data/mockups/`
 * by extracting structured slide data from the implemented presentation-mode
 * components.
 *
 * This keeps the repo's "mockup presentations" in sync with what exists in code,
 * without hand-maintaining 30+ documents.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const EXAMPLES_PATH = path.join(ROOT, "src", "data", "examples.ts");
const PRESENTATION_CONTENT_PATH = path.join(
  ROOT,
  "src",
  "data",
  "presentation-content.ts",
);
const MODES_DIR = path.join(
  ROOT,
  "src",
  "components",
  "presentation-modes",
);
const MOCKUPS_DIR = path.join(ROOT, "src", "data", "mockups");

const COMPONENT_BY_ID = new Map([
  ["ai-chat-presentation", "AiChatPresentation.tsx"],
  ["audio-reactive", "AudioReactive.tsx"],
  ["branching-narrative", "BranchingNarrative.tsx"],
  ["comic-panel-layout", "ComicPanelLayout.tsx"],
  ["custom-slide-transitions", "CustomSlideTransitions.tsx"],
  ["framer-motion-playground", "FramerMotionPlayground.tsx"],
  ["globe-explorer", "GlobeExplorer.tsx"],
  ["gsap-showreel", "GsapShowreel.tsx"],
  ["holographic-cards", "HolographicCards.tsx"],
  ["kinetic-typography", "KineticTypography.tsx"],
  ["necc-grit-intro", "NeccGritIntro.tsx"],
  ["newspaper-editorial", "NewspaperEditorial.tsx"],
  ["physics-playground", "PhysicsPlayground.tsx"],
  ["presenter-mode-deck", "PresenterModeDeck.tsx"],
  ["scroll-timeline-showcase", "ScrollTimelineShowcase.tsx"],
  ["spatial-canvas", "SpatialCanvas.tsx"],
  ["terminal-hacker", "TerminalHacker.tsx"],
  ["timeline-explorer", "TimelineExplorer.tsx"],
  ["voice-controlled-deck", "VoiceControlledDeck.tsx"],
  ["webgl-particle-deck", "WebGLParticleDeck.tsx"],
  // Takahashi uses one component for two example IDs.
  ["takahashi-demo", "Takahashi.tsx"],
  ["full-takahashi-mockup", "Takahashi.tsx"],
]);

function readUtf8(p) {
  return fs.readFileSync(p, "utf8");
}

function writeUtf8(p, contents) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, contents, "utf8");
}

function parseSourceFile(filePath, kind) {
  const text = readUtf8(filePath);
  return ts.createSourceFile(
    filePath,
    text,
    ts.ScriptTarget.Latest,
    true,
    kind,
  );
}

function findVariableInitializerAnywhere(sf, varName) {
  /** @type {ts.Expression | null} */
  let found = null;
  const visit = (node) => {
    if (found) return;
    if (ts.isVariableDeclaration(node)) {
      if (ts.isIdentifier(node.name) && node.name.text === varName) {
        if (node.initializer) {
          found = node.initializer;
          return;
        }
      }
    }
    node.forEachChild(visit);
  };
  sf.forEachChild(visit);
  return found;
}

function getPropName(propNameNode) {
  if (!propNameNode) return null;
  if (ts.isIdentifier(propNameNode)) return propNameNode.text;
  if (ts.isStringLiteral(propNameNode)) return propNameNode.text;
  if (ts.isNumericLiteral(propNameNode)) return propNameNode.text;
  return null;
}

function asString(node) {
  if (!node) return null;
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

function asNumber(node) {
  if (!node) return null;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand)) {
    const operand = Number(node.operand.text);
    if (node.operator === ts.SyntaxKind.MinusToken) return -operand;
    if (node.operator === ts.SyntaxKind.PlusToken) return operand;
  }
  return null;
}

function asBool(node) {
  if (!node) return null;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  return null;
}

function asStringArray(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return null;
  const out = [];
  for (const el of node.elements) {
    const s = asString(el);
    if (s !== null) out.push(s);
  }
  return out;
}

function extractObjectLiteral(objNode) {
  if (!objNode || !ts.isObjectLiteralExpression(objNode)) return null;
  /** @type {Record<string, any>} */
  const out = {};
  for (const prop of objNode.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = getPropName(prop.name);
    if (!key) continue;
    const vStr = asString(prop.initializer);
    if (vStr !== null) {
      out[key] = vStr;
      continue;
    }
    const vNum = asNumber(prop.initializer);
    if (vNum !== null) {
      out[key] = vNum;
      continue;
    }
    const vBool = asBool(prop.initializer);
    if (vBool !== null) {
      out[key] = vBool;
      continue;
    }
    const vArr = asStringArray(prop.initializer);
    if (vArr !== null) {
      out[key] = vArr;
      continue;
    }
    if (ts.isArrayLiteralExpression(prop.initializer)) {
      // Some arrays are arrays of objects (choices/panels/bodies). Preserve as a
      // best-effort object list by extracting stringy fields only.
      const maybeObjects = [];
      for (const el of prop.initializer.elements) {
        const obj = extractObjectLiteral(el);
        if (obj) maybeObjects.push(obj);
      }
      if (maybeObjects.length > 0) {
        out[key] = maybeObjects;
      } else {
        // Fallback to raw text (kept short in our markdown).
        out[key] = prop.initializer.getText().slice(0, 280);
      }
      continue;
    }
    if (ts.isObjectLiteralExpression(prop.initializer)) {
      const nested = extractObjectLiteral(prop.initializer);
      if (nested) out[key] = nested;
      continue;
    }
    // Ignore JSX-heavy fields (content/icon/demo) by default; they are not
    // reliably extractable without rendering.
  }
  return out;
}

function extractArrayConst(sf, varName) {
  const init = findVariableInitializerAnywhere(sf, varName);
  if (!init || !ts.isArrayLiteralExpression(init)) return null;
  const items = [];
  for (const el of init.elements) {
    const obj = extractObjectLiteral(el);
    if (obj) items.push(obj);
  }
  return items.length > 0 ? items : null;
}

function extractObjectConst(sf, varName) {
  const init = findVariableInitializerAnywhere(sf, varName);
  if (!init || !ts.isObjectLiteralExpression(init)) return null;
  /** @type {Record<string, any>} */
  const out = {};
  for (const prop of init.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = getPropName(prop.name);
    if (!key) continue;
    const value = extractObjectLiteral(prop.initializer);
    if (value) out[key] = value;
  }
  return Object.keys(out).length > 0 ? out : null;
}

function extractExamples() {
  const sf = parseSourceFile(EXAMPLES_PATH, ts.ScriptKind.TS);
  const items = extractArrayConst(sf, "EXAMPLES");
  if (!items) throw new Error("Failed to parse EXAMPLES from examples.ts");
  const byId = new Map();
  for (const it of items) {
    if (!it.id) continue;
    byId.set(it.id, it);
  }
  return byId;
}

function titleCaseFromId(id) {
  return id
    .split("-")
    .map((p) =>
      p.length === 0 ? p : p[0].toUpperCase() + p.slice(1).toLowerCase(),
    )
    .join(" ");
}

function detectHintsFromSource(sourceText) {
  const hints = [];
  const has = (s) => sourceText.includes(s);
  if (has("MatrixRain")) hints.push("Background: subtle Matrix rain (Canvas).");
  if (has("BroadcastChannel"))
    hints.push("Sync: BroadcastChannel for multi-tab audience sync.");
  if (has("EventSource") || has("WebSocket"))
    hints.push("Live data: supports SSE and WebSocket sources.");
  if (has("SpeechRecognition") || has("webkitSpeechRecognition"))
    hints.push("Voice: Web Speech API recognition + command parsing.");
  if (has("AudioContext") || has("AnalyserNode"))
    hints.push("Audio: Web Audio API analyser-driven visuals.");
  if (has("@react-three/fiber") || has("@react-three/drei") || has("three"))
    hints.push("3D/WebGL: React Three Fiber + Three.js visuals.");
  if (has("gsap") || has("ScrollTrigger"))
    hints.push("GSAP: ScrollTrigger timelines and scrubbed motion.");
  if (has("useScroll") || has("scrollYProgress"))
    hints.push("Scroll: scroll-linked progress and transforms.");
  if (has("startViewTransition"))
    hints.push("Transitions: View Transitions API demo content included.");
  return hints;
}

function renderHeaderBlock(example, id) {
  const title = example?.title ?? titleCaseFromId(id);
  const desc = example?.description ?? "";
  const lines = [];
  lines.push(`# Presentation Blueprint: ${title}`);
  lines.push("");
  lines.push("## ID");
  lines.push(`\`${id}\``);
  lines.push("");
  lines.push("## Overview");
  if (desc) lines.push(desc);
  else lines.push("A presentation mode blueprint extracted from implementation.");
  lines.push("");
  if (example?.category || example?.difficulty || example?.format) {
    lines.push("## Metadata");
    if (example?.category) lines.push(`- Category: \`${example.category}\``);
    if (example?.format) lines.push(`- Format: \`${example.format}\``);
    if (example?.difficulty) lines.push(`- Difficulty: \`${example.difficulty}\``);
    if (Array.isArray(example?.tags) && example.tags.length > 0)
      lines.push(`- Tags: ${example.tags.map((t) => `\`${t}\``).join(", ")}`);
    lines.push("");
  }
  return lines.join("\n");
}

function renderStyleBlock(id, example, sourceText) {
  const lines = [];
  lines.push("## Visual Style");
  lines.push(
    "- Typography: `var(--font-display)` for big headings, `var(--font-mono)` for UI labels, `var(--font-body)` for supporting text.",
  );

  // Category defaults (keep it simple and consistent).
  switch (example?.category) {
    case "code-focused":
      lines.push(
        "- Palette: near-black background, high-contrast mono text, a single neon accent.",
      );
      break;
    case "typography":
      lines.push(
        "- Palette: strong contrast and intentional whitespace; type is the primary visual.",
      );
      break;
    case "scroll-driven":
      lines.push(
        "- Palette: deep background with a scroll progress accent; large section titles with parallax depth cues.",
      );
      break;
    case "interactive-data":
      lines.push(
        "- Palette: dashboard panels, muted surfaces, and status colors (good/warn/danger).",
      );
      break;
    case "3d-webgl":
      lines.push(
        "- Palette: cinematic dark + bright emissive accents; keep overlays readable over moving 3D.",
      );
      break;
    case "animation-heavy":
      lines.push(
        "- Palette: bold gradients and high-saturation accents to make motion legible.",
      );
      break;
    case "storytelling":
      lines.push(
        "- Palette: narrative-first composition with chapter cards and deliberate reveals.",
      );
      break;
    case "slide-based":
      lines.push(
        "- Palette: clean slide surfaces, clear hierarchy, and consistent navigation affordances.",
      );
      break;
    default:
      lines.push("- Palette: consistent background + one accent color.");
      break;
  }

  const hints = detectHintsFromSource(sourceText);
  if (hints.length > 0) {
    lines.push("- Signature elements:");
    for (const h of hints) lines.push(`  - ${h}`);
  }
  lines.push("");
  return lines.join("\n");
}

function renderControlsBlock(id, kind) {
  const lines = [];
  lines.push("## Navigation & Controls");
  if (id === "terminal-hacker") {
    lines.push("- Advance: `Enter` or `Space` (next command).");
    lines.push("- Back/Exit: `Esc` (return to gallery).");
    lines.push("- Mobile: tap anywhere to advance.");
  } else if (id === "branching-narrative") {
    lines.push("- Choose: click buttons or press `[1]` / `[2]` (where available).");
    lines.push("- Back: `Backspace`.");
    lines.push("- Restart: `R`.");
  } else if (id === "voice-controlled-deck") {
    lines.push("- Voice commands: `next`, `back`, `go to [number]`, `first`, `last`.");
    lines.push("- Keyboard fallback: `←` / `→`, `Space`.");
  } else if (kind === "scroll") {
    lines.push("- Scroll: native scrolling drives progress.");
    lines.push("- Replay: scroll back up to re-run reveals.");
  } else {
    lines.push("- Next: `→` or `Space`.");
    lines.push("- Previous: `←`.");
    lines.push("- Exit: `Esc` (return to gallery).");
  }
  lines.push("");
  return lines.join("\n");
}

function purposeForSlide(i, total, title) {
  if (i === 1) return "Hook the audience and establish the premise.";
  if (i === total) return "Close the loop with a memorable ending and a clear takeaway.";
  if (/intro|welcome|start/i.test(title ?? "")) return "Introduce the mode and set expectations.";
  if (/end|thank|finale|epilogue/i.test(title ?? "")) return "Wrap up and provide a reset/replay prompt.";
  return "Advance the story with one clear idea and one visual beat.";
}

function transitionForSlide(i, title) {
  if (i === 1) return "Fade in from black, then reveal the headline.";
  if (/end|thank|finale|epilogue/i.test(title ?? "")) return "Hold for 1 beat, then fade out.";
  return "Quick cross-fade with a subtle slide/scale emphasis on the new headline.";
}

function renderSlideSection(i, total, slide) {
  const title = slide.title ?? slide.headline ?? slide.command ?? slide.name ?? slide.text ?? `Slide ${i}`;
  const subtitle = slide.subtitle ?? slide.subheading ?? slide.description ?? null;
  const bullets =
    slide.content ??
    slide.body ??
    slide.output ??
    slide.items ??
    slide.followUps ??
    null;

  const lines = [];
  lines.push(`## Slide ${i} – ${title}`);
  lines.push("");
  lines.push(`**Purpose:** ${purposeForSlide(i, total, title)}`);
  lines.push("");
  lines.push("**Content:**");
  lines.push("");

  if (slide.command) {
    lines.push("**Terminal Input:**");
    lines.push(`\`${slide.command}\``);
    lines.push("");
  }

  // Headline/subtitle use the slide's title/subtitle fields unless the slide
  // is a terminal command (already shown as input).
  if (!slide.command) {
    lines.push('**Headline (Center, Huge):**');
    lines.push(`"${title}"`);
    lines.push("");
  }
  if (subtitle) {
    lines.push("**Subheading (Center, Medium):**");
    lines.push(`"${subtitle}"`);
    lines.push("");
  }

  if (slide.notes) {
    lines.push("**Speaker Notes (Hidden Panel):**");
    lines.push(slide.notes);
    lines.push("");
  }

  if (slide.prompt && slide.response) {
    lines.push("**User Prompt (Chat Bubble):**");
    lines.push(`"${slide.prompt}"`);
    lines.push("");
    lines.push("**AI Response (Chat Bubble):**");
    lines.push(slide.response);
    lines.push("");
    if (slide.code?.language && slide.code?.content) {
      lines.push("**Code Block (Monospace):**");
      lines.push("```" + slide.code.language);
      lines.push(slide.code.content);
      lines.push("```");
      lines.push("");
    }
  }

  if (Array.isArray(bullets) && bullets.length > 0) {
    // Terminal output reads best as a monospace block.
    if (slide.output) {
      lines.push("**Terminal Output:**");
      lines.push("```text");
      lines.push(bullets.join("\n"));
      lines.push("```");
      lines.push("");
    } else {
      lines.push("**Body Beats:**");
      for (const b of bullets) lines.push(`- ${b}`);
      lines.push("");
    }
  } else if (typeof bullets === "string" && bullets.trim().length > 0) {
    lines.push("**Body:**");
    lines.push(bullets);
    lines.push("");
  }

  // Choice-heavy nodes.
  if (Array.isArray(slide.choices) && slide.choices.length > 0) {
    lines.push("**Choices (Buttons):**");
    for (const c of slide.choices) {
      if (c.label) lines.push(`- "${c.label}"`);
    }
    lines.push("");
  }

  // Comic panel pages.
  if (Array.isArray(slide.panels) && slide.panels.length > 0) {
    lines.push("**Panels (In Reading Order):**");
    for (const p of slide.panels) {
      const who = p.character ? `${p.character}: ` : "";
      const kind = p.type ? `${p.type.toUpperCase()}: ` : "";
      if (p.text) lines.push(`- ${kind}${who}${p.text}`);
    }
    lines.push("");
  }

  if (slide.grid) {
    lines.push("**Layout Grid:**");
    lines.push(`\`${slide.grid}\``);
    lines.push("");
  }

  // Optional meta lines for certain modes.
  if (slide.transition) {
    lines.push("**Transition Type:**");
    lines.push(`\`${slide.transition}\``);
    lines.push("");
  }
  if (slide.visMode) {
    lines.push("**Visualization Mode:**");
    lines.push(`\`${slide.visMode}\``);
    lines.push("");
  }
  if (slide.particleColor) {
    lines.push("**Particle Accent Color:**");
    lines.push(`\`${slide.particleColor}\``);
    lines.push("");
  }
  if (slide.accent) {
    lines.push("**Accent Gradient:**");
    lines.push(`\`${slide.accent}\``);
    lines.push("");
  }
  if (slide.gradient) {
    lines.push("**Card Gradient:**");
    lines.push(`\`${slide.gradient}\``);
    lines.push("");
  }
  if (slide.stat) {
    lines.push("**Key Stat (Overlay):**");
    lines.push(`"${slide.stat}"`);
    lines.push("");
  }

  lines.push("**Layout:**");
  lines.push("- Headline: center, dominant element.");
  lines.push("- Supporting text: below headline, max-width ~60ch for readability.");
  lines.push("- Navigation hint: bottom corner in mono (keys / progress).");
  lines.push("");
  lines.push("**Typography:**");
  lines.push("- Headline: `var(--font-display)`, uppercase, extra-bold, 72–120pt depending on length.");
  lines.push("- Supporting text: `var(--font-body)` or `var(--font-mono)` depending on mode.");
  lines.push("");
  lines.push("**Visual:**");
  lines.push("- Background: mode-appropriate texture/gradient; keep contrast high.");
  lines.push("- Decorative motif: one recurring element (progress bar, scanlines, grid, foil glare, etc.).");
  lines.push("");
  lines.push("**Transition from previous slide:**");
  lines.push(transitionForSlide(i, title));
  lines.push("");
  lines.push("---");
  lines.push("");
  return lines.join("\n");
}

function detectKindFromConsts(sf) {
  const order = [
    ["COMMANDS", "commands"],
    ["STORY", "story"],
    ["PAGES", "pages"],
    ["CARDS", "cards"],
    ["TOPICS", "topics"],
    ["STOPS", "stops"],
    ["LOCATIONS", "locations"],
    ["EVENTS", "events"],
    ["DEMOS", "demos"],
    ["SECTIONS", "sections"],
    ["SLIDES", "slides"],
  ];
  for (const [name, kind] of order) {
    const init = findVariableInitializerAnywhere(sf, name);
    if (init) return { constName: name, kind };
  }
  return { constName: null, kind: "unknown" };
}

function buildSlidesFromExtract(kind, data) {
  if (!data) return [];

  if (kind === "topics") {
    // Turn TOPICS object into a deterministic order using its keys.
    return Object.entries(data).map(([k, v]) => ({
      title: k,
      prompt: v.prompt,
      response: v.response,
      code: v.code,
      followUps: v.followUps,
    }));
  }

  if (kind === "events") {
    const byEra = new Map();
    for (const ev of data) {
      if (!ev.era) continue;
      if (!byEra.has(ev.era)) byEra.set(ev.era, []);
      byEra.get(ev.era).push(ev);
    }
    const eraOrder = ["origins", "dotcom", "web2", "modern"];
    return eraOrder
      .filter((era) => byEra.has(era))
      .map((era) => {
        const events = byEra.get(era) ?? [];
        const bullets = [];
        for (const e of events) {
          if (typeof e.year === "number" && e.title) bullets.push(`${e.year} — ${e.title}`);
        }
        return {
          title:
            era === "origins"
              ? "The Origins"
              : era === "dotcom"
                ? "Dot-Com Era"
                : era === "web2"
                  ? "Web 2.0"
                  : "Modern Web",
          subtitle:
            era === "origins"
              ? "1989–1998"
              : era === "dotcom"
                ? "1999–2005"
                : era === "web2"
                  ? "2006–2015"
                  : "2016–2025",
          content: bullets,
        };
      });
  }

  if (kind === "pages") {
    return data.map((p, idx) => ({
      title: `Page ${idx + 1}`,
      subtitle: "Comic panel grid + sequential reveal",
      grid: p.grid,
      panels: p.panels,
    }));
  }

  if (kind === "commands") {
    return data.map((c) => ({
      title: c.command,
      command: c.command,
      output: c.output,
    }));
  }

  if (kind === "stops") {
    return data.map((s) => ({
      title: s.title,
      subtitle: s.description,
      items: s.items,
      content: Array.isArray(s.items) ? s.items : undefined,
    }));
  }

  if (kind === "locations") {
    return data.map((loc) => ({
      title: loc.name,
      subtitle: loc.description,
      stat: loc.stat,
      content: [`Lat: ${loc.lat}`, `Lng: ${loc.lng}`],
    }));
  }

  if (kind === "cards") {
    return data.map((c) => ({
      title: `${c.number}. ${c.title}`,
      subtitle: c.subtitle,
      gradient: c.gradient,
      content: c.content,
    }));
  }

  // Default: treat as slides/sections/demos/story.
  return data.map((it) => it);
}

function renderBlueprintMarkdown({ id, example, sourceText, kind, slides }) {
  const lines = [];
  lines.push(renderHeaderBlock(example, id).trimEnd());
  lines.push("");
  lines.push(renderStyleBlock(id, example, sourceText).trimEnd());
  lines.push("");
  const controlsKind =
    kind === "sections" || kind === "events" || id === "gsap-showreel" || id === "scroll-timeline-showcase"
      ? "scroll"
      : kind;
  lines.push(renderControlsBlock(id, controlsKind).trimEnd());
  lines.push("");
  lines.push("## Slide Breakdown");
  lines.push("");

  // Inject a hero slide for certain scrolly/3D modes.
  /** @type {any[]} */
  const full = [];
  if (id === "scroll-timeline-showcase") {
    full.push({
      title: "Scroll Timeline",
      subtitle: "Animation driven by scroll position",
      content: [
        "One scroll = one timeline",
        "Progress bar at top",
        "Parallax cards + code snippets",
      ],
    });
  }
  if (id === "gsap-showreel") {
    full.push({
      title: "GSAP Showreel",
      subtitle: "ScrollTrigger demo reel",
      content: [
        "Scrub-linked motion",
        "Staggers + timelines",
        "Progress bar synced to scroll",
      ],
    });
  }
  if (id === "globe-explorer") {
    full.push({
      title: "3D Globe Explorer",
      subtitle: "Click markers to reveal locations",
      content: [
        "Wireframe globe + auto-rotation",
        "Starfield background",
        "Sidebar list + keyboard shortcuts (1–6, Esc)",
      ],
    });
  }

  full.push(...slides);

  // Add an outro slide for certain scrolly modes.
  if (id === "scroll-timeline-showcase" || id === "gsap-showreel") {
    full.push({
      title: "Replay",
      subtitle: "Scroll back up to replay the motion",
      content: ["Encourage exploration", "Call out progressive enhancement"],
    });
  }

  const total = full.length;
  for (let idx = 0; idx < total; idx++) {
    lines.push(renderSlideSection(idx + 1, total, full[idx]).trimEnd());
  }

  // Footer section with implementation notes.
  lines.push("## Implementation Notes");
  lines.push("");
  lines.push("- Keep each slide to one primary idea. If a slide needs two ideas, split it.");
  lines.push("- Prefer reduced-motion friendly variants (skip continuous animations, keep content readable).");
  lines.push("- Ensure keyboard navigation always works (including when focus is inside inputs).");
  lines.push("");

  return lines.join("\n");
}

function extractTakahashiDeck(deckId) {
  if (deckId === "takahashi-demo") {
    const sf = parseSourceFile(path.join(MODES_DIR, "Takahashi.tsx"), ts.ScriptKind.TSX);
    const init = findVariableInitializerAnywhere(sf, "TAKAHASHI_SLIDES");
    if (!init || !ts.isArrayLiteralExpression(init)) return null;
    const out = [];
    for (const el of init.elements) {
      const s = asString(el);
      if (s !== null) out.push(s);
    }
    return out;
  }
  if (deckId === "full-takahashi-mockup") {
    const sf = parseSourceFile(PRESENTATION_CONTENT_PATH, ts.ScriptKind.TS);
    const init = findVariableInitializerAnywhere(sf, "FULL_TAKAHASHI_SLIDES");
    if (!init || !ts.isArrayLiteralExpression(init)) return null;
    const out = [];
    for (const el of init.elements) {
      const s = asString(el);
      if (s !== null) out.push(s);
    }
    return out;
  }
  return null;
}

function renderTakahashiBlueprint(id, example, deckSlides) {
  const lines = [];
  lines.push(renderHeaderBlock(example, id).trimEnd());
  lines.push("");
  lines.push("## Visual Style");
  lines.push("- Background: pure black with subtle scanlines + grain.");
  lines.push("- Typography: ultra-large uppercase type (Takahashi method).");
  lines.push("- Accent: highlight numbers and symbols in `--color-accent`.");
  lines.push("- Pace: rapid, rhythmic; one phrase per slide.");
  lines.push("");
  lines.push("## Navigation & Controls");
  lines.push("- Next: `→` / `PageDown`.");
  lines.push("- Previous: `←` / `PageUp`.");
  lines.push("- Auto-play: `Space` (toggle).");
  lines.push("- Fullscreen: `F`.");
  lines.push("- Grid view: `G` (thumbnail overview).");
  lines.push("- Tempo: `+` / `-` (ms per slide).");
  lines.push("");
  lines.push("## Slide Breakdown");
  lines.push("");
  lines.push(
    "This deck is authored as a list of punchy, single-line slides. Recreate it by rendering one line at a time, centered, at maximum readable size.",
  );
  lines.push("");
  lines.push("### Deck Script (In Order)");
  lines.push("");
  for (const [i, t] of deckSlides.entries()) {
    lines.push(`${String(i + 1).padStart(2, "0")}. ${t}`);
  }
  lines.push("");
  lines.push("## Implementation Notes");
  lines.push("");
  lines.push("- Auto-scale font size based on text length to prevent overflow.");
  lines.push("- Add subtle per-slide glow shift (green → cyan) to keep long decks visually alive.");
  lines.push("");
  return lines.join("\n");
}

function renderNewspaperBlueprint(id, example, sourceText) {
  // Extract a few hard-coded strings used in the implementation for fidelity.
  const sf = ts.createSourceFile(
    "NewspaperEditorial.tsx",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const ads = extractArrayConst(sf, "ads") ?? [];
  const statuses = extractArrayConst(sf, "statuses") ?? [];

  const lines = [];
  lines.push(renderHeaderBlock(example, id).trimEnd());
  lines.push("");
  lines.push("## Visual Style");
  lines.push("- Theme: print-inspired broadsheet.");
  lines.push("- Background: warm paper (#f5f1e8) with subtle grain.");
  lines.push("- Typography: classic serif for headlines (Georgia/Times), small caps + mono for metadata.");
  lines.push("- Layout: multi-column grid with rules, drop caps, pull quotes, and boxed widgets.");
  lines.push("");
  lines.push("## Navigation & Controls");
  lines.push("- Scroll: the page reads like an article; sections reveal as you scroll.");
  lines.push("- Print: include `@media print` styles for clean export.");
  lines.push("");
  lines.push("## Slide Breakdown");
  lines.push("");
  const slides = [
    {
      title: "Masthead",
      subtitle: "The front page identity",
      content: [
        "Top metadata line: volume, date, price",
        'Main title: "THE DAILY DEVELOPER"',
        "Tagline line below the masthead",
      ],
    },
    {
      title: "Lead Story",
      subtitle: "Big headline + byline + drop cap intro",
      content: [
        "Hero headline (serif, bold, tight leading)",
        "Byline in small caps",
        "Lead paragraph with large drop cap",
      ],
    },
    {
      title: "Pull Quote",
      subtitle: "A dramatic mid-page quote block",
      content: [
        "Centered quote with oversized opening/closing quotes",
        "Thin double rule above and below",
        "Attribution in tiny caps",
      ],
    },
    {
      title: "Sidebar Widgets",
      subtitle: "Weather + crossword teaser",
      content: [
        "Deployment Weather widget (4 statuses)",
        "Crossword teaser grid with black squares",
        "Small caption: 'Solution on page B12'",
      ],
    },
    {
      title: "Classifieds",
      subtitle: "Grid of small boxed ads",
      content: ads.slice(0, 6).map((a) =>
        a.title && a.company && a.detail
          ? `${a.title} — ${a.company} — ${a.detail}`
          : "",
      ).filter(Boolean),
    },
    {
      title: "Footer & Print Notes",
      subtitle: "Wrap-up and print styling",
      content: [
        "Add subtle column rules + margin gutters",
        "Use print-safe colors and avoid heavy shadows",
        "Ensure links show as plain text in print",
      ],
    },
  ];

  lines.push("### Deployment Weather States (Used In Widget)");
  lines.push("");
  for (const s of statuses) {
    if (s.label && s.condition) lines.push(`- ${s.label}: ${s.condition}`);
  }
  lines.push("");
  for (let i = 0; i < slides.length; i++) {
    lines.push(renderSlideSection(i + 1, slides.length, slides[i]).trimEnd());
  }
  return lines.join("\n");
}

function generateForId(id, example, examplesById) {
  // `scroll-snap-deck` is covered by the existing `scroll-snap-blueprint.md`.
  if (id === "scroll-snap-deck") return null;

  // Takahashi decks are defined as string arrays (different sources).
  if (id === "takahashi-demo" || id === "full-takahashi-mockup") {
    const deck = extractTakahashiDeck(id);
    if (!deck) return null;
    return renderTakahashiBlueprint(id, example, deck);
  }

  const compFile = COMPONENT_BY_ID.get(id);
  if (!compFile) return null;

  const compPath = path.join(MODES_DIR, compFile);
  const sourceText = readUtf8(compPath);

  if (id === "newspaper-editorial") {
    return renderNewspaperBlueprint(id, example, sourceText);
  }

  const sf = ts.createSourceFile(
    compPath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const { constName, kind } = detectKindFromConsts(sf);
  let extracted = null;
  if (kind === "topics") {
    extracted = extractObjectConst(sf, constName);
  } else if (constName) {
    extracted = extractArrayConst(sf, constName);
  }

  const slides = buildSlidesFromExtract(kind, extracted);
  if (!slides || slides.length === 0) return null;

  // Normalize story slides to use consistent keys for renderSlideSection.
  const normalized =
    kind === "story"
      ? slides.map((n) => ({
          title: n.headline ?? n.title,
          subtitle: n.ending ? "Ending" : "Decision point",
          body: n.body,
          choices: n.choices,
        }))
      : slides;

  return renderBlueprintMarkdown({
    id,
    example,
    sourceText,
    kind,
    slides: normalized,
  });
}

function main() {
  if (!fs.existsSync(MOCKUPS_DIR)) {
    throw new Error(`Missing mockups dir: ${MOCKUPS_DIR}`);
  }

  const examplesById = extractExamples();
  const existing = new Set(
    fs
      .readdirSync(MOCKUPS_DIR)
      .filter((f) => f.toLowerCase().endsWith(".md")),
  );

  const created = [];
  for (const [id, example] of examplesById.entries()) {
    const outName = `${id}-blueprint.md`;
    if (existing.has(outName)) continue;

    // scroll-snap lives under a legacy name.
    if (id === "scroll-snap-deck" && existing.has("scroll-snap-blueprint.md")) {
      continue;
    }

    const md = generateForId(id, example, examplesById);
    if (!md) continue;

    const outPath = path.join(MOCKUPS_DIR, outName);
    writeUtf8(outPath, md.trimEnd() + "\n");
    created.push(outName);
  }

  // Print a compact summary.
  if (created.length === 0) {
    console.log("No new blueprints generated (everything already exists).");
    return;
  }
  console.log(`Generated ${created.length} blueprint(s):`);
  for (const f of created) console.log(`- ${path.join("src/data/mockups", f)}`);
}

main();

