import { Search } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
      <input
        type="text"
        placeholder="Search examples..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 font-mono text-sm bg-card border-2 border-border rounded-lg text-fg placeholder:text-muted focus:outline-none focus:border-accent focus:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:bg-white/60 transition-all"
      />
    </div>
  );
}
