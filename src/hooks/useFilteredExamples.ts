import { useMemo } from "react";
import { EXAMPLES } from "../data/examples";
import type { Difficulty } from "../types";

type FilterOptions = {
  query: string;
  category: string | null;
  difficulty: Difficulty | null;
};

export function useFilteredExamples({
  query,
  category,
  difficulty,
}: FilterOptions) {
  return useMemo(() => {
    const q = query.toLowerCase().trim();
    return EXAMPLES.filter((ex) => {
      if (category && ex.category !== category) return false;
      if (difficulty && ex.difficulty !== difficulty) return false;
      if (q) {
        const haystack =
          `${ex.title} ${ex.description} ${ex.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, category, difficulty]);
}
