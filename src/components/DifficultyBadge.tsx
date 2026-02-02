import { clsx } from "clsx";
import type { Difficulty } from "../types";

const STYLES: Record<Difficulty, string> = {
  beginner: "bg-accent/20 text-fg border-accent/40",
  intermediate: "bg-warn/20 text-fg border-warn/40",
  advanced: "bg-danger/20 text-fg border-danger/40",
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={clsx(
        "inline-block px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border",
        STYLES[difficulty],
      )}
    >
      {difficulty}
    </span>
  );
}
