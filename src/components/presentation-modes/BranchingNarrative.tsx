import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, RotateCcw } from "lucide-react";

type Choice = {
  label: string;
  nextId: string;
};

type StoryNode = {
  id: string;
  headline: string;
  body: string;
  choices?: Choice[];
  ending?: boolean;
  icon?: string;
};

const STORY: StoryNode[] = [
  {
    id: "start",
    headline: "The Launch",
    body: "Your startup just hit 10,000 users overnight. The servers are groaning. Your co-founder is panicking. You have two options.",
    choices: [
      {
        label: "Scale horizontally — spin up more instances",
        nextId: "scale-horizontal",
      },
      {
        label: "Optimize the code — find the bottleneck first",
        nextId: "optimize",
      },
    ],
    icon: "🚀",
  },
  {
    id: "scale-horizontal",
    headline: "Throwing Iron at the Problem",
    body: "You spin up 8 more instances behind a load balancer. The site stabilizes. But the AWS bill projection just tripled. Your runway shortened by 3 months.",
    choices: [
      {
        label: "Pitch investors now — ride the growth wave",
        nextId: "pitch-investors",
      },
      { label: "Cut features to reduce costs", nextId: "cut-features" },
    ],
    icon: "🖥️",
  },
  {
    id: "optimize",
    headline: "The Deep Dive",
    body: "You find it: an N+1 query in the dashboard endpoint. One line fix. Response times drop from 3s to 200ms. Your co-founder stares in disbelief.",
    choices: [
      {
        label: "Write a blog post about the fix — content marketing",
        nextId: "blog-post",
      },
      {
        label: "Focus on the product — ship the next feature",
        nextId: "ship-feature",
      },
    ],
    icon: "🔍",
  },
  {
    id: "pitch-investors",
    headline: "The Pitch",
    body: 'You walk into the VC office with a hockey-stick graph. "10K users in one day." They lean forward. The term sheet arrives the next morning. $2M seed round.',
    choices: [
      {
        label: "Hire aggressively — 10 engineers in 3 months",
        nextId: "ending-hypergrowth",
      },
      { label: "Stay lean — only hire 2 seniors", nextId: "ending-lean" },
    ],
    icon: "💰",
  },
  {
    id: "cut-features",
    headline: "The Hard Choices",
    body: "You kill the real-time notification system and the social feed. Users complain on Twitter. But server costs drop 60%. You buy time.",
    choices: [
      {
        label: "Rebuild those features better, later",
        nextId: "ending-rebuild",
      },
      { label: "Pivot to a simpler product", nextId: "ending-pivot" },
    ],
    icon: "✂️",
  },
  {
    id: "blog-post",
    headline: "The Viral Post",
    body: '"How a Single Query Nearly Killed Our Startup" hits #1 on Hacker News. 50,000 new signups in 48 hours. Your inbox is full of recruiter emails and acquisition offers.',
    ending: true,
    icon: "📝",
  },
  {
    id: "ship-feature",
    headline: "Heads Down, Shipping",
    body: "You launch the collaboration feature. Users love it. Retention jumps from 20% to 45%. Slow and steady. The compound growth kicks in at month 6.",
    ending: true,
    icon: "🚢",
  },
  {
    id: "ending-hypergrowth",
    headline: "Hypergrowth",
    body: "The team scales fast. Communication breaks down. Two engineers rewrite the same service. But the product ships fast and you hit 100K users by Q3. Chaotic, but alive.",
    ending: true,
    icon: "⚡",
  },
  {
    id: "ending-lean",
    headline: "The Lean Machine",
    body: "Two senior engineers. Zero meetings. They ship more than most teams of 10. You hit profitability at month 8. No more fundraising. Freedom.",
    ending: true,
    icon: "🎯",
  },
  {
    id: "ending-rebuild",
    headline: "The Comeback",
    body: "Six months later, you relaunch with a message queue architecture. Real-time is back, but it handles 100x the load. The users who left come back. And they brought friends.",
    ending: true,
    icon: "🔄",
  },
  {
    id: "ending-pivot",
    headline: "The Pivot",
    body: "You strip it down to a simple API tool. Developers adopt it instantly. What was a consumer app becomes a B2B SaaS. ARR hits $1M in year one.",
    ending: true,
    icon: "🔀",
  },
];

export function BranchingNarrative() {
  const [currentId, setCurrentId] = useState("start");
  const [history, setHistory] = useState<string[]>(["start"]);

  const currentNode = STORY.find((n) => n.id === currentId);

  const makeChoice = useCallback((nextId: string) => {
    setCurrentId(nextId);
    setHistory((prev) => [...prev, nextId]);
  }, []);

  const restart = useCallback(() => {
    setCurrentId("start");
    setHistory(["start"]);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setCurrentId(newHistory[newHistory.length - 1]);
    }
  }, [history]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") restart();
      if (e.key === "Backspace") goBack();
      if (currentNode?.choices) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= currentNode.choices.length) {
          makeChoice(currentNode.choices[num - 1].nextId);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [restart, goBack, makeChoice, currentNode]);

  if (!currentNode) return null;

  return (
    <div className="w-full min-h-screen bg-zinc-950 text-white flex flex-col">
      <div className="border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitBranch size={16} className="text-white/40" />
          <div className="flex gap-1">
            {history.map((nodeId, i) => (
              <span key={i} className="font-mono text-xs text-white/30">
                {i > 0 && " → "}
                {STORY.find((n) => n.id === nodeId)?.headline}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={restart}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <RotateCcw size={14} />
          <span className="font-mono text-xs">Restart</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentId}
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full"
          >
            <div className="text-center mb-12">
              <span className="text-6xl mb-6 block">{currentNode.icon}</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                {currentNode.headline}
              </h2>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                {currentNode.body}
              </p>
            </div>

            {currentNode.choices && (
              <div className="space-y-4 mt-12">
                {currentNode.choices.map((choice, i) => (
                  <motion.button
                    key={choice.nextId}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.2 }}
                    onClick={() => makeChoice(choice.nextId)}
                    className="w-full text-left p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <span className="font-mono text-sm text-white/40 group-hover:text-blue-400 transition-colors">
                      [{i + 1}]
                    </span>
                    <span className="ml-3 text-lg">{choice.label}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {currentNode.ending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-12"
              >
                <p className="font-mono text-sm text-white/30 mb-6 uppercase tracking-widest">
                  — End of this path —
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={goBack}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors font-mono text-sm"
                  >
                    ← Go Back
                  </button>
                  <button
                    onClick={restart}
                    className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition-colors font-mono text-sm"
                  >
                    Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="border-t border-white/10 p-4 text-center">
        <p className="text-white/30 font-mono text-xs">
          Press [1] [2] to choose • Backspace to go back • R to restart
        </p>
      </footer>
    </div>
  );
}
