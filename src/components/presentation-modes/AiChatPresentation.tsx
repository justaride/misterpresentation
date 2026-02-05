import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  role: "user" | "ai";
  text: string;
  code?: { language: string; content: string };
  timestamp: string;
};

type Topic = {
  prompt: string;
  response: string;
  code?: { language: string; content: string };
  followUps: string[];
};

const TOPICS: Record<string, Topic> = {
  "CSS Grid": {
    prompt: "Tell me about CSS Grid",
    response:
      "CSS Grid is a two-dimensional layout system that revolutionized web design. Unlike Flexbox (which is one-dimensional), Grid lets you control both rows and columns simultaneously. It's now supported in all modern browsers and is the go-to for complex page layouts.",
    code: {
      language: "css",
      content: `.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}`,
    },
    followUps: ["Container Queries", ":has() selector", "Subgrid"],
  },
  "Container Queries": {
    prompt: "What are Container Queries?",
    response:
      "Container Queries let components respond to their parent container's size rather than the viewport. This is a game-changer for component-based design — a card component can adapt whether it's in a sidebar or main content area without media queries.",
    code: {
      language: "css",
      content: `.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card { flex-direction: row; }
}`,
    },
    followUps: ["CSS Nesting", "View Transitions", "Cascade Layers"],
  },
  ":has() selector": {
    prompt: "How does the :has() selector work?",
    response:
      'The :has() selector is often called the "parent selector" — something CSS developers wanted for 20+ years. It lets you style an element based on its children or subsequent siblings. It\'s incredibly powerful for form validation, conditional styling, and more.',
    code: {
      language: "css",
      content: `/* Style form group when input is focused */
.form-group:has(input:focus) {
  border-color: blue;
}

/* Style article only if it has an image */
article:has(img) {
  grid-column: span 2;
}`,
    },
    followUps: ["CSS Grid", "CSS Nesting", "Cascade Layers"],
  },
  "Cascade Layers": {
    prompt: "Explain Cascade Layers",
    response:
      "Cascade Layers (@layer) give you explicit control over the cascade — the specificity order of your CSS. You define layers and their priority, making it much easier to manage CSS from different sources: resets, frameworks, components, and overrides.",
    code: {
      language: "css",
      content: `@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; box-sizing: border-box; }
}

@layer components {
  .btn { padding: 0.5rem 1rem; }
}

@layer utilities {
  .mt-4 { margin-top: 1rem; }
}`,
    },
    followUps: ["Subgrid", "View Transitions", ":has() selector"],
  },
  Subgrid: {
    prompt: "What is CSS Subgrid?",
    response:
      "Subgrid lets a grid item's children participate in the parent grid's track sizing. Before subgrid, nested grids couldn't align with their parent. Now, card titles across a row can align perfectly even with varying content lengths.",
    code: {
      language: "css",
      content: `.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}`,
    },
    followUps: ["CSS Grid", "Container Queries", "CSS Nesting"],
  },
  "View Transitions": {
    prompt: "How do View Transitions work?",
    response:
      "The View Transitions API enables smooth animated transitions between DOM states — even across page navigations in multi-page apps. The browser takes a snapshot before and after, then animates between them. It's like magic page transitions with minimal code.",
    code: {
      language: "javascript",
      content: `document.startViewTransition(() => {
  // Update the DOM
  updateContent();
});

/* CSS */
::view-transition-old(root) {
  animation: fade-out 0.3s;
}
::view-transition-new(root) {
  animation: fade-in 0.3s;
}`,
    },
    followUps: ["CSS Nesting", ":has() selector", "Cascade Layers"],
  },
  "CSS Nesting": {
    prompt: "Tell me about native CSS Nesting",
    response:
      "Native CSS nesting is finally here — no preprocessor needed. You can nest selectors inside parent rules just like in Sass or Less. The & symbol references the parent selector. It's supported in all modern browsers since 2023.",
    code: {
      language: "css",
      content: `.card {
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
}`,
    },
    followUps: ["Cascade Layers", "Container Queries", "Subgrid"],
  },
};

const INITIAL_SUGGESTIONS = [
  "CSS Grid",
  "Container Queries",
  ":has() selector",
];

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function getTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CodeBlock({
  language,
  content,
}: {
  language: string;
  content: string;
}) {
  return (
    <div className="mt-3 rounded-lg overflow-hidden bg-gray-900 border border-gray-700">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 text-[10px] text-gray-400 font-mono">
        <span>{language}</span>
      </div>
      <pre className="p-3 text-xs sm:text-sm font-mono text-green-300 overflow-x-auto leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-gray-400"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

export function AiChatPresentation() {
  const reducedMotion = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hi! I'm your CSS expert. Ask me about modern CSS features — Grid, Container Queries, :has(), Cascade Layers, Subgrid, View Transitions, or Nesting. Pick a topic below or type your own question!",
      timestamp: getTime(),
    },
  ]);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [revealedChars, setRevealedChars] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, revealedChars, scrollToBottom]);

  const findTopic = useCallback((query: string): string | null => {
    const lower = query.toLowerCase();
    const topicKeys = Object.keys(TOPICS);

    const exact = topicKeys.find((k) => lower.includes(k.toLowerCase()));
    if (exact) return exact;

    const keywords: Record<string, string> = {
      grid: "CSS Grid",
      container: "Container Queries",
      has: ":has() selector",
      cascade: "Cascade Layers",
      layer: "Cascade Layers",
      subgrid: "Subgrid",
      view: "View Transitions",
      transition: "View Transitions",
      nest: "CSS Nesting",
    };

    for (const [kw, topic] of Object.entries(keywords)) {
      if (lower.includes(kw)) return topic;
    }

    return null;
  }, []);

  const sendMessage = useCallback(
    (topicName: string) => {
      const topic = TOPICS[topicName];
      if (!topic || isTyping) return;

      const userMsg: Message = {
        role: "user",
        text: topic.prompt,
        timestamp: getTime(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setSuggestions([]);
      setIsTyping(true);

      const typingDelay = reducedMotion ? 200 : 1200;

      setTimeout(() => {
        setIsTyping(false);
        const aiMsg: Message = {
          role: "ai",
          text: topic.response,
          code: topic.code,
          timestamp: getTime(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setSuggestions(topic.followUps);

        if (!reducedMotion) {
          setRevealedChars(0);
          let i = 0;
          const total = topic.response.length;
          const reveal = () => {
            if (i < total) {
              i += 3;
              setRevealedChars(Math.min(i, total));
              revealRef.current = requestAnimationFrame(reveal);
            } else {
              setRevealedChars(null);
            }
          };
          revealRef.current = requestAnimationFrame(reveal);
        }
      }, typingDelay);
    },
    [isTyping, reducedMotion],
  );

  useEffect(() => {
    return () => cancelAnimationFrame(revealRef.current);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim() || isTyping) return;

      const topicName = findTopic(inputValue);
      if (topicName) {
        setInputValue("");
        sendMessage(topicName);
      } else {
        const userMsg: Message = {
          role: "user",
          text: inputValue,
          timestamp: getTime(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        setTimeout(
          () => {
            setIsTyping(false);
            setMessages((prev) => [
              ...prev,
              {
                role: "ai",
                text: "I specialize in modern CSS features. Try asking about: CSS Grid, Container Queries, :has() selector, Cascade Layers, Subgrid, View Transitions, or CSS Nesting!",
                timestamp: getTime(),
              },
            ]);
            setSuggestions(INITIAL_SUGGESTIONS);
          },
          reducedMotion ? 200 : 800,
        );
      }
    },
    [inputValue, isTyping, findTopic, sendMessage, reducedMotion],
  );

  const handleReset = useCallback(() => {
    cancelAnimationFrame(revealRef.current);
    setMessages([
      {
        role: "ai",
        text: "Hi! I'm your CSS expert. Ask me about modern CSS features — Grid, Container Queries, :has(), Cascade Layers, Subgrid, View Transitions, or Nesting. Pick a topic below or type your own question!",
        timestamp: getTime(),
      },
    ]);
    setSuggestions(INITIAL_SUGGESTIONS);
    setIsTyping(false);
    setRevealedChars(null);
    setInputValue("");
  }, []);

  return (
    <div className="w-full h-full min-h-screen bg-gray-950 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
            AI
          </div>
          <div>
            <p className="text-sm font-medium text-white">CSS Expert</p>
            <p className="text-[10px] text-green-400">Online</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-gray-400 hover:text-white px-3 py-1 border border-gray-700 rounded-full transition-colors"
        >
          New Chat
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isAi = msg.role === "ai";
            const isLast = idx === messages.length - 1 && isAi;
            const displayText =
              isLast && revealedChars !== null
                ? msg.text.slice(0, revealedChars)
                : msg.text;

            return (
              <motion.div
                key={idx}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isAi ? "" : "flex-row-reverse"}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white ${
                    isAi
                      ? "bg-gradient-to-br from-violet-500 to-blue-500"
                      : "bg-gradient-to-br from-emerald-500 to-teal-500"
                  }`}
                >
                  {isAi ? "AI" : "U"}
                </div>

                <div className={`max-w-[80%] ${isAi ? "" : "text-right"}`}>
                  <div
                    className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isAi
                        ? "bg-gray-800 text-gray-200 rounded-tl-sm"
                        : "bg-blue-600 text-white rounded-tr-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{displayText}</p>
                    {msg.code && (isLast ? revealedChars === null : true) && (
                      <CodeBlock
                        language={msg.code.language}
                        content={msg.code.content}
                      />
                    )}
                  </div>
                  <p
                    className={`text-[10px] text-gray-500 mt-1 ${isAi ? "" : "text-right"}`}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
              AI
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-tl-sm">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
      </div>

      {suggestions.length > 0 && !isTyping && (
        <div className="px-4 py-2 flex gap-2 flex-wrap">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="px-3 py-1.5 text-xs rounded-full border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 border-t border-gray-800 flex gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about a CSS feature..."
          className="flex-1 bg-gray-800 text-white text-sm rounded-full px-4 py-2 border border-gray-700 focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={isTyping || !inputValue.trim()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
