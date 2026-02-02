import { clsx } from "clsx";
import type { ExampleStatus } from "../types";

const STYLES: Record<ExampleStatus, { bg: string; label: string }> = {
  available: { bg: "bg-accent text-fg", label: "AVAILABLE" },
  "coming-soon": { bg: "bg-warn/80 text-fg", label: "COMING SOON" },
};

export function StatusBadge({ status }: { status: ExampleStatus }) {
  const style = STYLES[status];
  return (
    <span
      className={clsx(
        "inline-block px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider",
        style.bg,
      )}
    >
      {style.label}
    </span>
  );
}
