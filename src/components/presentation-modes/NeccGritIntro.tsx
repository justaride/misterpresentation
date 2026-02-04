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
  Network,
  Leaf,
  Landmark,
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

const EcosystemMindMap = () => {
  const cx = 300;
  const cy = 200;

  const countries = [
    { label: "NO", x: cx + 120, y: cy - 60 },
    { label: "SE", x: cx - 80, y: cy - 80 },
    { label: "DK", x: cx - 120, y: cy + 40 },
    { label: "FI", x: cx - 160, y: cy - 40 },
    { label: "IS", x: cx + 160, y: cy + 20 },
  ];

  const platforms = [
    { label: "Næste", x: cx - 60, y: cy + 120 },
    { label: "PCB", x: cx, y: cy + 140 },
    { label: "Løkka", x: cx + 80, y: cy + 120 },
  ];

  const funding = { label: "Nordic Innovation", x: cx, y: cy - 140 };

  return (
    <div className="mt-8 w-full max-w-2xl">
      <div className="hidden md:block relative" style={{ height: 380 }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 380"
          fill="none"
        >
          {countries.map((c) => (
            <line
              key={c.label}
              x1={cx}
              y1={cy}
              x2={c.x}
              y2={c.y}
              stroke="#d6d3d1"
              strokeWidth={1}
            />
          ))}
          {platforms.map((p) => (
            <line
              key={p.label}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="#d6d3d1"
              strokeWidth={1}
            />
          ))}
          <line
            x1={cx}
            y1={cy}
            x2={funding.x}
            y2={funding.y}
            stroke="#d6d3d1"
            strokeWidth={1}
          />
        </svg>

        <div
          className="absolute w-20 h-20 rounded-full bg-green-50 border-2 border-green-300 flex items-center justify-center text-green-900 font-bold text-sm"
          style={{ left: cx - 40, top: cy - 40 }}
        >
          NECC
        </div>

        {countries.map((c) => (
          <div
            key={c.label}
            className="absolute w-14 h-14 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center text-stone-700 font-mono text-xs font-medium"
            style={{ left: c.x - 28, top: c.y - 28 }}
          >
            {c.label}
          </div>
        ))}

        {platforms.map((p) => (
          <div
            key={p.label}
            className="absolute px-3 py-1.5 rounded-full bg-stone-100 border border-stone-300 text-stone-700 font-mono text-xs font-medium whitespace-nowrap"
            style={{ left: p.x - 30, top: p.y - 12 }}
          >
            {p.label}
          </div>
        ))}

        <div
          className="absolute px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-mono text-xs font-medium whitespace-nowrap"
          style={{ left: funding.x - 55, top: funding.y - 12 }}
        >
          {funding.label}
        </div>
      </div>

      <div className="md:hidden space-y-3">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-green-50 border-2 border-green-300 flex items-center justify-center text-green-900 font-bold text-xs">
            NECC
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {["NO", "SE", "DK", "FI", "IS"].map((c) => (
            <span
              key={c}
              className="px-2 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-700 font-mono text-xs"
            >
              {c}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {["Næste", "PCB", "Løkka"].map((p) => (
            <span
              key={p}
              className="px-2 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-700 font-mono text-xs"
            >
              {p}
            </span>
          ))}
        </div>
        <div className="flex justify-center">
          <span className="px-2 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-mono text-xs">
            Nordic Innovation
          </span>
        </div>
      </div>
    </div>
  );
};

const SECTIONS: Section[] = [
  {
    id: "intro",
    title: "NECC",
    subtitle: "Nordic Ecosystem for Circular Construction",
    bg: "bg-stone-50",
    icon: <Globe size={64} className="text-green-700" />,
  },
  {
    id: "vision",
    title: "Sirkulært som Standard",
    subtitle: "Et nordisk samarbeid for å gjøre sirkulær bygging til normen.",
    bg: "bg-stone-100",
    icon: <Recycle size={64} className="text-green-700" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          3 år
        </Badge>
        <Badge className="bg-teal-50 text-teal-700 border border-teal-200">
          11.84 MNOK
        </Badge>
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          5 land
        </Badge>
      </div>
    ),
  },
  {
    id: "nch",
    title: "Nordic Circular Hotspot",
    subtitle:
      "Paraplyorganisasjonen som akselererer sirkulær økonomi i Norden.",
    bg: "bg-stone-50",
    icon: <Landmark size={64} className="text-green-700" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          Siden 2018
        </Badge>
        <Badge className="bg-teal-50 text-teal-700 border border-teal-200">
          70+ partnere
        </Badge>
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          5 land
        </Badge>
        <Badge className="bg-teal-50 text-teal-700 border border-teal-200">
          Nordic Innovation
        </Badge>
      </div>
    ),
  },
  {
    id: "natural-state",
    title: "Natural State",
    subtitle:
      "Strategibyrået som leder NCC-prosjektet. Stedsutvikling, sirkulær økonomi, nordisk-japansk filosofi.",
    bg: "bg-stone-100",
    icon: <Leaf size={64} className="text-green-700" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          Einar Kleppe Holthe
        </Badge>
        <Badge className="bg-teal-50 text-teal-700 border border-teal-200">
          Jan Thomas Odegard
        </Badge>
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          Prosjektledelse
        </Badge>
      </div>
    ),
  },
  {
    id: "problem",
    title: "40% av alt avfall",
    subtitle:
      "Byggebransjen er Nordens største avfallskilde. Det må endre seg.",
    bg: "bg-stone-50",
    icon: <Trash2 size={64} className="text-red-600" />,
    content: (
      <div className="mt-8 w-full max-w-md">
        <div className="h-4 bg-stone-200 rounded-full overflow-hidden">
          <div className="h-full w-[40%] bg-gradient-to-r from-red-400 to-red-300 rounded-full" />
        </div>
        <p className="text-sm text-stone-500 mt-2 font-mono">
          40% av totalt avfall i Norden
        </p>
      </div>
    ),
  },
  {
    id: "portfolio",
    title: "3 Plattformer",
    subtitle:
      "Digitale verktøy for å skalere sirkulær bygging på tvers av Norden.",
    bg: "bg-stone-100",
    icon: <LayoutGrid size={64} className="text-green-700" />,
    content: (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
        {[
          {
            name: "Næste",
            desc: "Hjelper bedrifter forstå sirkulære markedsmuligheter med segmentanalyse og scoring.",
          },
          {
            name: "PCB",
            desc: "Åpen database som samler sirkulære byggeprosjekter — 55 prosjekter i 5 land.",
          },
          {
            name: "Løkka",
            desc: "Gir gårdeiere kontroll over sirkulær eiendomsforvaltning med multi-tenant plattform.",
          },
        ].map((p) => (
          <div
            key={p.name}
            className="bg-white border border-stone-200 rounded-xl p-5 text-left"
          >
            <h3 className="text-lg font-bold text-stone-900">{p.name}</h3>
            <p className="text-sm text-stone-500 mt-1">{p.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "pcb",
    title: "Public Circular Buildings",
    subtitle: "Åpen database for sirkulære byggeprosjekter i Norden.",
    bg: "bg-stone-50",
    icon: <Building2 size={64} className="text-teal-700" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-teal-50 text-teal-700 border border-teal-200">
          55 prosjekter
        </Badge>
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          Materialgjenbruk
        </Badge>
        <Badge className="bg-teal-50 text-teal-700 border border-teal-200">
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
    bg: "bg-stone-100",
    icon: <BarChart3 size={64} className="text-green-700" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-stone-100 text-stone-700 border border-stone-300">
          Segmentanalyse
        </Badge>
        <Badge className="bg-stone-100 text-stone-700 border border-stone-300">
          Sirkulær Scoring
        </Badge>
        <Badge className="bg-stone-100 text-stone-700 border border-stone-300">
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
    bg: "bg-stone-50",
    icon: <Home size={64} className="text-green-700" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          Multi-tenant
        </Badge>
        <Badge className="bg-teal-50 text-teal-700 border border-teal-200">
          Eiendomsforvaltning
        </Badge>
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          Sirkulær
        </Badge>
      </div>
    ),
  },
  {
    id: "reach",
    title: "360+ Sider. 5 Land.",
    subtitle: "En plattform som dekker hele Norden.",
    bg: "bg-stone-100",
    icon: <MapPin size={64} className="text-teal-700" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        {["Norge", "Sverige", "Danmark", "Finland", "Island"].map((c) => (
          <Badge
            key={c}
            className="bg-green-50 text-green-800 border border-green-200"
          >
            {c}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "ecosystem",
    title: "Hele Nettverket",
    subtitle: "NECC knytter sammen land, plattformer og finansiering.",
    bg: "bg-stone-50",
    icon: <Network size={64} className="text-green-700" />,
    content: <EcosystemMindMap />,
  },
  {
    id: "tech",
    title: "Bygget med AI",
    subtitle: "Moderne teknologi og AI-verktøy i hele utviklingsprosessen.",
    bg: "bg-stone-100",
    icon: <Cpu size={64} className="text-green-700" />,
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
            className="px-3 py-1.5 bg-stone-100 border border-stone-300 rounded-lg text-sm font-mono text-stone-700"
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
    bg: "bg-stone-50",
    icon: <Rocket size={64} className="text-green-700" />,
    content: (
      <div className="flex flex-wrap justify-center gap-3 mt-8">
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          AI-assistert
        </Badge>
        <Badge className="bg-teal-50 text-teal-700 border border-teal-200">
          3 plattformer
        </Badge>
        <Badge className="bg-green-50 text-green-800 border border-green-200">
          AI-drevet
        </Badge>
      </div>
    ),
  },
  {
    id: "collab",
    title: "GritAI + NECC?",
    subtitle: "Vi ser muligheter for samarbeid innen AI og utvikling.",
    bg: "bg-stone-100",
    icon: <Handshake size={64} className="text-green-700" />,
    content: (
      <div className="mt-8 space-y-3 text-left max-w-lg">
        {[
          "Kan GritAI bidra med AI-drevet utviklingskapasitet?",
          "Passer NECC som prosjekt for AI-konsultering og skalering?",
          "Åpent for innspill og samarbeid.",
        ].map((q) => (
          <div key={q} className="flex items-start gap-3">
            <span className="text-green-700 mt-0.5">&#8250;</span>
            <p className="text-stone-600">{q}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "contact",
    title: "La oss snakke videre",
    subtitle: "gabriel@necc.no • necc.no",
    bg: "bg-gradient-to-b from-stone-50 to-green-50",
    icon: <MessageCircle size={64} className="text-green-700" />,
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
    <div className="relative w-full h-screen bg-stone-50 text-stone-900 overflow-hidden">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-green-700 origin-left z-50"
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
              <p className="text-lg md:text-2xl font-light text-stone-500 max-w-2xl">
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
