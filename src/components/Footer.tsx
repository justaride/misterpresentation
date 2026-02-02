export function Footer() {
  return (
    <footer className="bg-fg text-bg py-12 border-t-2 border-border">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-bg border-2 border-bg flex items-center justify-center">
            <span className="text-fg font-black text-xs">M</span>
          </div>
          <span className="font-mono text-sm">
            &copy; {new Date().getFullYear()} Mister Presentations
          </span>
        </div>

        <div className="flex gap-6 font-mono text-sm">
          <a href="#" className="hover:text-accent transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            Docs
          </a>
          <a href="#" className="hover:text-accent transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
