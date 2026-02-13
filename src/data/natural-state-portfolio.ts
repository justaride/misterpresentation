export type App = {
  id: string;
  name: string;
  description: string;
  keyMetric?: string;
  status: "running" | "building" | "stopped";
  tags: string[];
};

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  apps: App[];
  color: { from: string; to: string };
};

export const PORTFOLIO_CATEGORIES: Category[] = [
  {
    id: "place",
    name: "PLACE",
    description: "Regional & Destination Platforms",
    icon: "MapPin",
    color: { from: "#10b981", to: "#0891b2" },
    apps: [
      {
        id: "sunnmorsalpene",
        name: "Sunnmørsalpene Dashboard",
        description: "Alpine regional monitoring + tourism analytics",
        status: "running",
        tags: ["tourism", "analytics"],
      },
      {
        id: "lokka",
        name: "Løkka Gardeierforening",
        description: "51 properties, 10 tenants, Grünerløkka Oslo",
        keyMetric: "51 properties",
        status: "running",
        tags: ["property", "multi-tenant"],
      },
      {
        id: "rendalen-dashboard",
        name: "Rendalen Dashboard",
        description: "Housing survey: 1,015 responses",
        keyMetric: "1,015 responses",
        status: "running",
        tags: ["survey", "housing"],
      },
      {
        id: "rendalen-tourism",
        name: "Rendalen Besøksstrategi",
        description: "Tourism strategy + destination management",
        status: "running",
        tags: ["tourism", "strategy"],
      },
      {
        id: "sundland",
        name: "Sundland Bolig",
        description: "Housing & commerce analysis, Drammen",
        status: "running",
        tags: ["housing", "analysis"],
      },
    ],
  },
  {
    id: "market",
    name: "MARKET",
    description: "Commercial & Circular Economy",
    icon: "Store",
    color: { from: "#a855f7", to: "#06b6d4" },
    apps: [
      {
        id: "circular-buildings",
        name: "Nordic Circular Buildings",
        description: "195 circular projects, 5 Nordic countries",
        keyMetric: "195 projects",
        status: "running",
        tags: ["circular", "database"],
      },
      {
        id: "fyra",
        name: "FYRA Circular Platform",
        description: "Circular construction supplier intelligence",
        status: "running",
        tags: ["circular", "suppliers"],
      },
      {
        id: "funding-map",
        name: "Finansieringskart",
        description: "EU grants + Forskningsrådet discovery",
        status: "running",
        tags: ["funding", "grants"],
      },
      {
        id: "summit",
        name: "Nordic Circular Summit 2025",
        description: "Summit intelligence hub with AI analysis",
        status: "running",
        tags: ["event", "AI"],
      },
      {
        id: "design",
        name: "Natural State Design",
        description: "Brand website + design system",
        status: "running",
        tags: ["design", "brand"],
      },
    ],
  },
  {
    id: "internal",
    name: "INTERNAL",
    description: "Operations & Management Tools",
    icon: "Settings",
    color: { from: "#f59e0b", to: "#dc2626" },
    apps: [
      {
        id: "lokka-internal",
        name: "Løkka Internal Dashboard",
        description: "Project management + documentation",
        status: "running",
        tags: ["ops", "docs"],
      },
      {
        id: "hovfaret",
        name: "Hovfaret 13",
        description: "Real estate transformation tracking",
        status: "running",
        tags: ["real-estate", "tracking"],
      },
      {
        id: "coffee-forest",
        name: "Coffee & Forest",
        description: "EUDR compliance + satellite verification",
        status: "running",
        tags: ["compliance", "AI"],
      },
    ],
  },
  {
    id: "lab",
    name: "LAB",
    description: "Experimental & Research",
    icon: "Beaker",
    color: { from: "#06b6d4", to: "#0ea5e9" },
    apps: [
      {
        id: "docker-graphics",
        name: "Docker Graphics",
        description: "Creative direction + generative art engine",
        status: "running",
        tags: ["creative", "art"],
      },
      {
        id: "perronggarden",
        name: "Perronggården",
        description: "Historic building transformation",
        status: "running",
        tags: ["heritage", "analysis"],
      },
    ],
  },
];

export const PORTAL_STATS = {
  totalApps: 16,
  categories: 4,
  liveApps: 16,
  uptime: "99.8%",
};
