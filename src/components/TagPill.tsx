export function TagPill({ tag }: { tag: string }) {
  return (
    <span className="inline-block px-2 py-0.5 font-mono text-[10px] border border-border/30 bg-bg/50 text-muted">
      {tag}
    </span>
  );
}
