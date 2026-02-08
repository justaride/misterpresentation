import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter";
import { ExampleCard } from "../components/ExampleCard";
import { useFilteredExamples } from "../hooks/useFilteredExamples";

export function Examples() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useFilteredExamples({ query, category, difficulty: null });

  return (
    <div className="min-h-screen bg-bg text-fg font-body overflow-x-hidden relative selection:bg-accent selection:text-fg">
      <div className="noise-overlay" />

      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight">
            Browse Examples
          </h1>
          <p className="text-muted font-medium max-w-lg">
            Explore presentation techniques across 8 categories, from beginner
            to advanced.
          </p>
        </div>

        <div className="space-y-4">
          <SearchBar value={query} onChange={setQuery} />
          <CategoryFilter selected={category} onSelect={setCategory} />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-muted text-sm uppercase tracking-wider">
              No examples match your filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ex) => (
              <ExampleCard key={ex.id} example={ex} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
