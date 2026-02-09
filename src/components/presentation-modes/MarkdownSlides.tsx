import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MARKDOWN_SLIDE_DECKS, type MarkdownDeckId } from "../../data/markdownSlideDecks";

type ParsedSlide = {
  body: string;
  notes: string;
};

function normalizeNewlines(s: string) {
  return s.replace(/\r\n/g, "\n");
}

function stripFrontmatter(md: string) {
  // Deckset-style "key: value" lines at the top (not YAML).
  // We stop at the first blank line.
  const lines = normalizeNewlines(md).split("\n");
  let i = 0;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") break;
    const looksLikeKV = /^[A-Za-z][A-Za-z0-9_-]*:\s*.+$/.test(line);
    if (!looksLikeKV) return md;
  }
  if (i === 0) return md;
  // Remove the kv block + the blank line separator (if present)
  const rest = lines.slice(i + 1).join("\n");
  return rest.trimStart();
}

function splitSlides(md: string): string[] {
  const normalized = normalizeNewlines(md).trim();
  if (!normalized) return [];

  // Split on slide breaks that are on their own line.
  return normalized
    .split(/\n---\n+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSlide(slideMd: string): ParsedSlide {
  const lines = normalizeNewlines(slideMd).split("\n");
  const body: string[] = [];
  const notes: string[] = [];

  for (const line of lines) {
    if (line.startsWith("^ ")) {
      notes.push(line.slice(2));
      continue;
    }
    body.push(line);
  }

  return {
    body: body.join("\n").trim(),
    notes: notes.join("\n").trim(),
  };
}

export function MarkdownSlides({ deckId }: { deckId: MarkdownDeckId }) {
  const deck = MARKDOWN_SLIDE_DECKS[deckId];

  const slides = useMemo(() => {
    const md = stripFrontmatter(deck.markdown);
    return splitSlides(md).map(parseSlide);
  }, [deck.markdown]);

  const [index, setIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    setIndex(0);
    setShowNotes(false);
  }, [deckId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't hijack key presses when user is typing somewhere.
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const next = () => setIndex((i) => Math.min(i + 1, slides.length - 1));
      const prev = () => setIndex((i) => Math.max(i - 1, 0));

      switch (e.key) {
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          setIndex(0);
          break;
        case "End":
          e.preventDefault();
          setIndex(slides.length - 1);
          break;
        case "n":
        case "N":
          e.preventDefault();
          setShowNotes((v) => !v);
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [slides.length]);

  const slide = slides[index];

  if (!slide) {
    return (
      <div className="min-h-screen bg-bg text-fg flex items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <h1 className="font-display text-3xl mb-2">Empty Deck</h1>
          <p className="text-fg/70">No slides were found in this markdown file.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="sticky top-0 z-10 border-b border-fg/10 bg-bg/80 backdrop-blur px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-fg/60">
              {deck.title}
            </div>
            <div className="text-sm text-fg/80">
              Slide {index + 1} / {slides.length}
              <span className="ml-3 text-fg/50">Keys: ← → Space | N notes</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-fg/15 px-3 py-1.5 text-sm hover:bg-fg/5"
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              disabled={index === 0}
              aria-disabled={index === 0}
            >
              Prev
            </button>
            <button
              className="rounded-md border border-fg/15 px-3 py-1.5 text-sm hover:bg-fg/5"
              onClick={() => setIndex((i) => Math.min(i + 1, slides.length - 1))}
              disabled={index >= slides.length - 1}
              aria-disabled={index >= slides.length - 1}
            >
              Next
            </button>
            <button
              className="rounded-md border border-fg/15 px-3 py-1.5 text-sm hover:bg-fg/5"
              onClick={() => setShowNotes((v) => !v)}
            >
              Notes
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="rounded-2xl border border-fg/10 bg-bg p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div className="prose prose-invert max-w-none prose-headings:font-display prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:text-lg prose-li:text-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{slide.body}</ReactMarkdown>
          </div>
        </div>
      </div>

      {showNotes && (
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-fg/10 bg-bg/95 backdrop-blur">
          <div className="mx-auto max-w-5xl px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="text-xs uppercase tracking-wide text-fg/60">
                Speaker Notes
              </div>
              <button
                className="rounded-md border border-fg/15 px-3 py-1.5 text-sm hover:bg-fg/5"
                onClick={() => setShowNotes(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fg/80">
              {slide.notes ? slide.notes : "No notes on this slide."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

