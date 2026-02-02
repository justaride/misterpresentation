import { useParams, Link } from "react-router-dom";
import { EXAMPLES } from "../data/examples";
import { TakahashiPresentation } from "../components/presentation-modes/Takahashi";
import { ScrollSnapPresentation } from "../components/presentation-modes/ScrollSnap";
import { TypewriterNarrative } from "../components/presentation-modes/TypewriterNarrative";
import { FULL_TAKAHASHI_SLIDES } from "../data/presentation-content";
import { ArrowLeft } from "lucide-react";

export function ExampleViewer() {
  const { id } = useParams();
  const example = EXAMPLES.find((ex) => ex.id === id);

  if (!example) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-fg">
        <div className="text-center">
          <h1 className="text-4xl font-display mb-4">Example Not Found</h1>
          <Link to="/examples" className="text-accent hover:underline">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  // Map IDs to components
  // In a real app, you might use dynamic imports or a more robust registry
  const renderExample = () => {
    switch (example.id) {
      case "takahashi-demo":
        return <TakahashiPresentation />;
      case "full-takahashi-mockup":
        return <TakahashiPresentation slides={FULL_TAKAHASHI_SLIDES} />;
      case "scroll-snap-deck":
        return <ScrollSnapPresentation />;
      case "typewriter-narrative":
        return <TypewriterNarrative />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <h2 className="text-3xl font-display mb-4">Coming Soon</h2>
            <p className="max-w-md text-fg/60">
              The <strong>{example.title}</strong> example is currently under development. 
              Check back later for the implementation!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col">
      <header className="border-b border-border bg-card/50 p-4 flex items-center gap-4">
        <Link to="/examples" className="p-2 hover:bg-accent/10 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-lg leading-none">{example.title}</h1>
          <p className="text-xs font-mono text-fg/50">{example.format} • {example.difficulty}</p>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        {renderExample()}
      </main>
    </div>
  );
}
