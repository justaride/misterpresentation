import { clsx } from "clsx";
import { CATEGORIES } from "../data/categories";

type CategoryFilterProps = {
  selected: string | null;
  onSelect: (id: string | null) => void;
};

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={clsx(
          "shrink-0 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-2 border-border transition-all",
          selected === null
            ? "bg-accent text-fg shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]"
            : "bg-card text-fg hover:bg-bg",
        )}
      >
        All
      </button>
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={clsx(
              "shrink-0 inline-flex items-center gap-2 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-2 border-border transition-all",
              selected === cat.id
                ? "bg-accent text-fg shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]"
                : "bg-card text-fg hover:bg-bg",
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
