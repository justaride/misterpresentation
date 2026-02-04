import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Globe,
  Recycle,
  Trash2,
  LayoutGrid,
  Building2,
  BarChart3,
  Home,
  MapPin,
  Cpu,
  Rocket,
  Handshake,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

type Section = {
  id: string;
  title: string;
  subtitle: string;
  bg: string;
  icon: React.ReactNode;
  content?: React.ReactNode;
};

const Badge = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`px-3 py-1 rounded-full text-sm font-mono font-medium ${className}`}
  >
    {children}
  </span>
);

const SECTIONS: Section[] = [
  {
    id: "intro",
    title: "NECC",
    subtitle: "Nordic Ecosystem for Circular Construction",
    bg: "bg-zinc-950",
    icon: <Globe size={64} className="text-emerald-500" />,
  },
  {
    id: "vision",
    title: "Sirkulært som Standard",
    subtitle: "Et nordisk samarbeid for å gjøre sirkulær bygging til normen.",
    bg: "bg-zinc-900",
    icon: <Recycle size={64} className="text-emerald-500" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          3 år
        </Badge>
        <Badge className="bg-teal-500/20 text-teal-400 border border-teal-500/30">
          11.84 MNOK
        </Badge>
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          5 land
        </Badge>
      </div>
    ),
  },
  {
    id: "problem",
    title: "40% av alt avfall",
    subtitle:
      "Byggebransjen er Nordens største avfallskilde. Det må endre seg.",
    bg: "bg-zinc-950",
    icon: <Trash2 size={64} className="text-red-400" />,
    content: (
      <div className="mt-8 w-full max-w-md">
        <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-[40%] bg-gradient-to-r from-red-500 to-red-400 rounded-full" />
        </div>
        <p className="text-sm text-zinc-500 mt-2 font-mono">
          40% av totalt avfall i Norden
        </p>
      </div>
    ),
  },
  {
    id: "portfolio",
    title: "3 Plattformer. 85 500+ Kodelinjer.",
    subtitle: "Alt bygget fra bunnen av — åpen kildekode, moderne stack.",
    bg: "bg-zinc-900",
    icon: <LayoutGrid size={64} className="text-emerald-500" />,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
        {[
          { name: "Næste", desc: "Markedsintelligens", loc: "21 847" },
          { name: "PCB", desc: "Åpen database", loc: "14 220" },
          { name: "Løkka", desc: "Gårdeierplattform", loc: "49 433" },
        ].map((p) => (
          <div
            key={p.name}
            className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-5 text-left"
          >
            <h3 className="text-lg font-bold text-white">{p.name}</h3>
            <p className="text-sm text-zinc-400 mt-1">{p.desc}</p>
            <p className="text-emerald-400 font-mono text-sm mt-3">
              {p.loc} LOC
            </p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "pcb",
    title: "Public Circular Buildings",
    subtitle: "Åpen database for sirkulære byggeprosjekter i Norden.",
    bg: "bg-zinc-950",
    icon: <Building2 size={64} className="text-teal-400" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-teal-500/20 text-teal-400 border border-teal-500/30">
          55 prosjekter
        </Badge>
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Materialgjenbruk
        </Badge>
        <Badge className="bg-teal-500/20 text-teal-400 border border-teal-500/30">
          5 land
        </Badge>
      </div>
    ),
  },
  {
    id: "naeste",
    title: "Næste Dashboard",
    subtitle:
      "Markedsintelligens, segmentanalyse, og sirkulær scoring for aktører i byggebransjen.",
    bg: "bg-zinc-900",
    icon: <BarChart3 size={64} className="text-emerald-500" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700">
          Segmentanalyse
        </Badge>
        <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700">
          Sirkulær Scoring
        </Badge>
        <Badge className="bg-zinc-800 text-zinc-300 border border-zinc-700">
          Markedsdata
        </Badge>
      </div>
    ),
  },
  {
    id: "lokka",
    title: "Løkka Plattform",
    subtitle:
      "Multi-tenant gårdeierplattform for sirkulær eiendomsforvaltning.",
    bg: "bg-zinc-950",
    icon: <Home size={64} className="text-emerald-500" />,
    content: (
      <p className="text-teal-400 font-mono text-2xl mt-6 font-bold">
        49 433 kodelinjer
      </p>
    ),
  },
  {
    id: "reach",
    title: "360+ Sider. 5 Land.",
    subtitle: "En plattform som dekker hele Norden.",
    bg: "bg-zinc-900",
    icon: <MapPin size={64} className="text-teal-400" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {["Norge", "Sverige", "Danmark", "Finland", "Island"].map((c) => (
          <Badge
            key={c}
            className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          >
            {c}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "tech",
    title: "Bygget med AI",
    subtitle: "Moderne teknologi og AI-verktøy i hele utviklingsprosessen.",
    bg: "bg-zinc-950",
    icon: <Cpu size={64} className="text-emerald-500" />,
    content: (
      <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-2xl">
        {[
          "Next.js 16",
          "React 19",
          "TypeScript",
          "Supabase",
          "Claude Code",
          "Tailwind CSS",
          "Framer Motion",
          "Vercel",
        ].map((t) => (
          <span
            key={t}
            className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-mono text-zinc-300"
          >
            {t}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "team",
    title: "Lite Team. Høy Fart.",
    subtitle: "AI-assistert utvikling gir startup-tempo med et lite team.",
    bg: "bg-zinc-900",
    icon: <Rocket size={64} className="text-emerald-500" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          85 500+ LOC
        </Badge>
        <Badge className="bg-teal-500/20 text-teal-400 border border-teal-500/30">
          3 plattformer
        </Badge>
        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          AI-drevet
        </Badge>
      </div>
    ),
  },
  {
    id: "collab",
    title: "Grit.ai + NECC?",
    subtitle: "Vi er nysgjerrige på mulighetene.",
    bg: "bg-zinc-950",
    icon: <Handshake size={64} className="text-emerald-500" />,
    content: (
      <div className="mt-8 space-y-3 text-left max-w-lg">
        {[
          "Passer prosjektet i inkubator-programmet?",
          "Kan Grit.ai bidra med sprint-kapasitet?",
          "Åpent for innspill og samarbeid.",
        ].map((q) => (
          <div key={q} className="flex items-start gap-3">
            <span className="text-emerald-500 mt-0.5">&#8250;</span>
            <p className="text-zinc-300">{q}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "contact",
    title: "La oss snakke videre",
    subtitle: "gabriel@necc.no • necc.no",
    bg: "bg-gradient-to-b from-zinc-950 to-emerald-950",
    icon: <MessageCircle size={64} className="text-emerald-500" />,
  },
];

export function NeccGritIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative w-full h-screen bg-zinc-950 text-white overflow-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-50"
        style={{ scaleX }}
      />

      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      >
        {SECTIONS.map((section, index) => (
          <section
            key={section.id}
            className={`h-full w-full snap-start flex flex-col items-center justify-center p-8 text-center relative ${section.bg}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.5 }}
              className="max-w-4xl flex flex-col items-center gap-6"
            >
              <div className="mb-4">{section.icon}</div>
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter">
                {section.title}
              </h2>
              <p className="text-lg md:text-2xl font-light text-zinc-400 max-w-2xl">
                {section.subtitle}
              </p>
              {section.content}
            </motion.div>

            {index < SECTIONS.length - 1 && (
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 opacity-30"
              >
                <ChevronDown size={32} />
              </motion.div>
            )}

            <div className="absolute bottom-8 right-8 font-mono text-sm opacity-20">
              {index + 1} / {SECTIONS.length}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
