import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { clsx } from "clsx";
import type { Example } from "../types";
import { CATEGORIES } from "../data/categories";
import { DifficultyBadge } from "./DifficultyBadge";
import { TagPill } from "./TagPill";
import { StatusBadge } from "./StatusBadge";

const GRADIENT_MAP: Record<string, string> = {
  "scroll-driven": "from-accent/30 to-accent/10",
  "slide-based": "from-warn/30 to-warn/10",
  "interactive-data": "from-blue-300/30 to-blue-300/10",
  "3d-webgl": "from-purple-300/30 to-purple-300/10",
  typography: "from-pink-300/30 to-pink-300/10",
  "animation-heavy": "from-orange-300/30 to-orange-300/10",
  "code-focused": "from-emerald-300/30 to-emerald-300/10",
  storytelling: "from-rose-300/30 to-rose-300/10",
};

export function ExampleCard({ example }: { example: Example }) {
  const category = CATEGORIES.find((c) => c.id === example.category);
  const Icon = category?.icon;
  const gradient =
    GRADIENT_MAP[example.category] ?? "from-accent/30 to-accent/10";

  return (
    <Link
      to={`/examples/${example.id}`}
      className="block h-full group focus:outline-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          "h-full border-2 border-border bg-card shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] flex flex-col cursor-pointer",
          "transition-all duration-200",
          "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] hover:border-accent",
          "group-focus-visible:-translate-y-1 group-focus-visible:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] group-focus-visible:border-accent",
        )}
      >
        <div
          className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center border-b-2 border-border scanlines overflow-hidden`}
        >
          {Icon && <Icon className="w-12 h-12 text-fg/30" />}
          <div className="absolute top-2 right-2">
            <StatusBadge status={example.status} />
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1 gap-3">
          <div>
            {category && (
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted">
                {category.label}
              </span>
            )}
            <h3 className="font-display text-xl uppercase mt-1 group-hover:text-accent group-focus-visible:text-accent transition-colors">
              {example.title}
            </h3>
          </div>

          <p className="text-sm text-muted leading-relaxed flex-1">
            {example.description}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/20">
            <DifficultyBadge difficulty={example.difficulty} />
            {example.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
