import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

function Masthead() {
  return (
    <header className="text-center border-b-4 border-double border-gray-900 pb-4 mb-6">
      <div className="flex items-center justify-between text-[10px] sm:text-xs uppercase tracking-widest text-gray-600 mb-2">
        <span>Vol. CXLII No. 47</span>
        <span>{today}</span>
        <span>$2.50</span>
      </div>
      <h1
        className="text-5xl sm:text-7xl font-black tracking-tight text-gray-900 leading-none"
        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
      >
        THE DAILY DEVELOPER
      </h1>
      <div className="flex items-center justify-center gap-4 mt-2 text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
        <span>All the Code That&apos;s Fit to Ship</span>
        <span>|</span>
        <span>Founded 2024</span>
      </div>
    </header>
  );
}

function DropCap({ children }: { children: string }) {
  const first = children[0];
  const rest = children.slice(1);
  return (
    <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
      <span
        className="float-left text-5xl sm:text-6xl font-bold leading-[0.8] mr-2 mt-1 text-gray-900"
        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
      >
        {first}
      </span>
      {rest}
    </p>
  );
}

function PullQuote({ text, author }: { text: string; author: string }) {
  return (
    <blockquote className="my-6 mx-4 py-4 border-t-2 border-b-2 border-gray-900">
      <p
        className="text-xl sm:text-2xl italic text-gray-900 text-center leading-snug"
        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
      >
        <span className="text-4xl leading-none text-gray-400">&ldquo;</span>
        {text}
        <span className="text-4xl leading-none text-gray-400">&rdquo;</span>
      </p>
      <p className="text-xs text-gray-500 text-center mt-2 uppercase tracking-wider">
        — {author}
      </p>
    </blockquote>
  );
}

function ArticleHeadline({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <h2
        className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight"
        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-gray-600 mt-1 italic">{subtitle}</p>
      )}
      <div className="w-12 h-0.5 bg-gray-900 mt-2" />
    </div>
  );
}

function Byline({ name, role }: { name: string; role: string }) {
  return (
    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
      By <span className="font-bold">{name}</span>, {role}
    </p>
  );
}

function WeatherWidget() {
  const statuses = [
    { label: "Production", condition: "Stable", icon: "☀️" },
    { label: "Staging", condition: "Flaky", icon: "⛅" },
    { label: "Dev", condition: "Broken", icon: "🌧️" },
    { label: "CI/CD", condition: "Recovering", icon: "🌤️" },
  ];

  return (
    <div className="border border-gray-300 p-3 mb-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">
        Deployment Weather
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {statuses.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-lg">{s.icon}</div>
            <div className="text-[10px] font-bold text-gray-900">{s.label}</div>
            <div className="text-[10px] text-gray-500">{s.condition}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CrosswordTeaser() {
  const grid = [
    ["R", "E", "A", "C", "T", " ", " "],
    [" ", " ", "P", " ", "Y", " ", " "],
    ["N", "O", "D", "E", "P", " ", " "],
    [" ", " ", " ", " ", "E", " ", " "],
    ["V", "I", "T", "E", "S", " ", " "],
  ];

  return (
    <div className="border border-gray-300 p-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">
        Today&apos;s Crossword
      </h3>
      <div className="flex justify-center">
        <div className="inline-grid gap-0">
          {grid.map((row, ri) => (
            <div key={ri} className="flex">
              {row.map((cell, ci) => (
                <div
                  key={ci}
                  className={`w-5 h-5 flex items-center justify-center text-[9px] font-bold ${
                    cell === " "
                      ? "bg-gray-900"
                      : "border border-gray-400 bg-white text-gray-900"
                  }`}
                >
                  {cell !== " " ? cell : ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-gray-500 text-center mt-2">
        Solution on page B12
      </p>
    </div>
  );
}

function ClassifiedAds() {
  const ads = [
    {
      title: "Senior React Developer",
      company: "TechCorp",
      detail: "Remote • $180-220K • Must love hooks",
    },
    {
      title: "Rust Systems Engineer",
      company: "InfraCo",
      detail: "SF/NYC • $200-250K • Memory safety enthusiast",
    },
    {
      title: "DevOps Lead",
      company: "CloudScale",
      detail: "Remote • $170-210K • Terraform whisperer",
    },
    {
      title: "AI/ML Engineer",
      company: "ModelLab",
      detail: "NYC • $220-280K • GPU access included",
    },
    {
      title: "Open Source Maintainer",
      company: "OSS Foundation",
      detail: "Remote • $0 + Gratitude • Burnout risk: high",
    },
    {
      title: "Full Stack Developer",
      company: "StartupXYZ",
      detail: 'Anywhere • Equity only • "We\'re like a family"',
    },
  ];

  return (
    <div className="border-t-2 border-gray-900 pt-4 mt-6">
      <h3
        className="text-xl font-bold text-gray-900 mb-3 text-center"
        style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
      >
        CLASSIFIED ADVERTISEMENTS
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ads.map((ad) => (
          <div key={ad.title} className="border border-gray-300 p-2">
            <p className="text-xs font-bold text-gray-900">{ad.title}</p>
            <p className="text-[10px] text-gray-600">{ad.company}</p>
            <p className="text-[10px] text-gray-500 mt-1">{ad.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NewspaperEditorial() {
  const reducedMotion = useReducedMotion();

  const fadeIn = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
      };

  return (
    <div
      className="w-full min-h-screen bg-[#f5f0e8] text-gray-900"
      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
    >
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6">
        <Masthead />

        <motion.article {...fadeIn} className="mb-8">
          <ArticleHeadline
            title="AI REVOLUTION REACHES MAIN STREET"
            subtitle="From boardrooms to bodegas, artificial intelligence reshapes daily commerce"
          />
          <Byline name="Sarah Chen" role="Technology Correspondent" />
          <div className="sm:columns-2 gap-6">
            <DropCap>
              {
                "Artificial intelligence, once confined to research laboratories and Silicon Valley pitch decks, has arrived on Main Street with a force that even its most ardent proponents did not anticipate. Small business owners across the nation are reporting dramatic shifts in how they operate, from automated inventory management to AI-powered customer service that never sleeps."
              }
            </DropCap>
            <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
              The transformation is not without friction. Local shop owners
              describe a learning curve that ranges from gentle to vertical, and
              concerns about job displacement persist in communities already
              struggling with economic headwinds.
            </p>
            <PullQuote
              text="We went from spending 20 hours a week on bookkeeping to 20 minutes. But I still don't trust it with customer complaints."
              author="Maria Rodriguez, Downtown Bakery Owner"
            />
            <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
              Industry analysts project that by 2027, over 80% of small
              businesses will use at least one AI-powered tool in their daily
              operations. The question is no longer whether AI will reach Main
              Street, but whether Main Street is ready for it.
            </p>
            <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
              Meanwhile, developers building these tools face their own
              challenges: balancing capability with simplicity, ensuring
              accuracy without overwhelming users, and maintaining the human
              touch that small businesses are built on.
            </p>
          </div>
        </motion.article>

        <hr className="border-t border-gray-400 my-6" />

        <div className="sm:grid sm:grid-cols-3 sm:gap-6">
          <motion.article {...fadeIn} className="sm:col-span-2 mb-8">
            <ArticleHeadline
              title="THE GREAT FRAMEWORK DEBATE RAGES ON"
              subtitle="React, Vue, Svelte, and the newcomers battle for developer mindshare"
            />
            <Byline name="James Park" role="Staff Writer" />
            <div className="sm:columns-2 gap-6">
              <DropCap>
                {
                  "In the ever-churning seas of JavaScript frameworks, a new generation of contenders has emerged to challenge the established order. While React maintains its commanding market share, developers increasingly express fatigue with its complexity and seek alternatives that promise simplicity without sacrifice."
                }
              </DropCap>
              <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
                Svelte&apos;s compile-time approach continues to gain converts,
                with its creator Rich Harris now leading development full-time
                at Vercel. Vue maintains a loyal following in Asia and Europe,
                while newer entrants like Solid and Qwik propose radical
                rethinks of reactivity itself.
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
                &ldquo;The real winner is the developer who picks the right tool
                for their specific use case,&rdquo; argues Dr. Emily Watson,
                professor of computer science at Stanford. &ldquo;Framework
                tribalism serves no one.&rdquo;
              </p>
              <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
                Server components, islands architecture, and resumability have
                become the buzzwords du jour, as the industry collectively
                grapples with the tension between developer experience and
                end-user performance.
              </p>
            </div>
          </motion.article>

          <motion.aside {...fadeIn} className="mb-8">
            <WeatherWidget />
            <CrosswordTeaser />
          </motion.aside>
        </div>

        <hr className="border-t border-gray-400 my-6" />

        <motion.article {...fadeIn} className="mb-8">
          <ArticleHeadline title="OPINION: OPEN SOURCE IS NOT FREE LABOR" />
          <Byline name="Alex Rivera" role="Opinion Columnist" />
          <div className="sm:columns-2 gap-6">
            <DropCap>
              {
                "Every Fortune 500 company runs on open source software. Every major cloud provider profits from code written by volunteers. And yet, when Log4Shell threatened the internet, the world discovered that critical infrastructure was maintained by a handful of exhausted developers working in their spare time."
              }
            </DropCap>
            <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
              This editorial board has long advocated for sustainable funding
              models. We reiterate our position: corporations that profit from
              open source have a moral obligation — and, increasingly, a
              business imperative — to fund the ecosystem they depend on.
            </p>
            <PullQuote
              text="If open source maintainers all took a vacation at the same time, the internet would collapse within a week."
              author="This Paper's Editorial Board"
            />
            <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
              The path forward includes government funding for digital
              infrastructure, corporate sponsorship programs with teeth, and a
              culture shift that treats open source contribution as legitimate,
              compensated work rather than a hobby.
            </p>
          </div>
        </motion.article>

        <hr className="border-t border-gray-400 my-6" />

        <div className="sm:grid sm:grid-cols-2 sm:gap-6">
          <motion.article {...fadeIn} className="mb-8">
            <ArticleHeadline
              title="TYPESCRIPT ADOPTION HITS RECORD HIGH"
              subtitle="98% of new enterprise projects now use TypeScript"
            />
            <Byline name="Dev Survey Team" role="Data Desk" />
            <DropCap>
              {
                "The annual developer survey results are in, and TypeScript's dominance has never been more pronounced. For the first time, TypeScript has surpassed JavaScript in new enterprise project starts, with 98% of respondents reporting TypeScript as their primary language for new work."
              }
            </DropCap>
            <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
              The remaining 2% were reportedly &ldquo;still migrating from
              CoffeeScript.&rdquo; Industry veterans note the irony: the
              language that was once dismissed as &ldquo;just JavaScript with
              extra steps&rdquo; has become the industry standard.
            </p>
          </motion.article>

          <motion.article {...fadeIn} className="mb-8">
            <ArticleHeadline
              title="REMOTE WORK: THREE YEARS LATER"
              subtitle="The office is back, but developers aren't"
            />
            <Byline name="Workplace Desk" role="Special Report" />
            <DropCap>
              {
                "While many industries have returned to in-person work, software development remains stubbornly remote. A new study finds that 73% of developers would take a pay cut to maintain remote work arrangements, and 45% would leave their current job if forced to return full-time."
              }
            </DropCap>
            <p className="text-sm sm:text-base leading-relaxed text-gray-800 mb-4">
              Companies that mandate return-to-office are experiencing what
              recruiters call the &ldquo;talent sieve effect&rdquo; — their best
              developers quietly departing for remote-first competitors while
              less mobile employees remain.
            </p>
          </motion.article>
        </div>

        <ClassifiedAds />

        <footer className="mt-8 pt-4 border-t-2 border-gray-900 text-center">
          <p className="text-xs text-gray-500">
            The Daily Developer is a satirical newspaper presentation. No actual
            journalism was harmed in the making of this demo.
          </p>
          <button
            onClick={() => window.print()}
            className="no-print mt-3 px-4 py-1.5 text-xs border border-gray-400 rounded hover:bg-gray-200 transition-colors text-gray-700"
          >
            Print This Edition
          </button>
        </footer>
      </div>
    </div>
  );
}
