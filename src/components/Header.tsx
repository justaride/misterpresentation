import { Link, useLocation } from "react-router-dom";
import { MrNews } from "./mascot/MrNews";
import { clsx } from "clsx";

export function Header() {
  const { pathname } = useLocation();

  return (
    <header className="border-b-2 border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <MrNews size={48} state="online" />
            <div className="absolute -inset-1 bg-accent/20 rounded-full blur-sm group-hover:bg-accent/30 transition-colors -z-10" />
          </div>
          <div className="text-3xl font-display uppercase tracking-wide group-hover:text-accent transition-colors">
            MISTER PRESENTATIONS
          </div>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={clsx(
              "text-sm font-mono hover:text-accent transition-colors hidden md:block",
              pathname === "/" && "text-accent",
            )}
          >
            Home
          </Link>
          <Link
            to="/examples"
            className={clsx(
              "group relative inline-flex items-center justify-center px-5 py-2 font-mono text-sm font-bold transition-all duration-200 border-2 border-border",
              pathname === "/examples"
                ? "bg-accent text-fg shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]"
                : "bg-card text-fg shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none",
            )}
          >
            Browse Examples
          </Link>
          <Link
            to="/research"
            className={clsx(
              "text-sm font-mono hover:text-accent transition-colors hidden md:block",
              pathname === "/research" && "text-accent",
            )}
          >
            Research
          </Link>
        </nav>
      </div>
    </header>
  );
}
