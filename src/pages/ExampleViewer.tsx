import { Suspense, lazy } from "react";
import { useParams, Link } from "react-router-dom";
import { EXAMPLES } from "../data/examples";
import { FULL_TAKAHASHI_SLIDES } from "../data/presentation-content";
import { ArrowLeft } from "lucide-react";

const TakahashiPresentation = lazy(() =>
  import("../components/presentation-modes/Takahashi").then((m) => ({
    default: m.TakahashiPresentation,
  })),
);
const ScrollSnapPresentation = lazy(() =>
  import("../components/presentation-modes/ScrollSnap").then((m) => ({
    default: m.ScrollSnapPresentation,
  })),
);
const TypewriterNarrative = lazy(() =>
  import("../components/presentation-modes/TypewriterNarrative").then((m) => ({
    default: m.TypewriterNarrative,
  })),
);
const RevealClassic = lazy(() =>
  import("../components/presentation-modes/RevealClassic").then((m) => ({
    default: m.RevealClassic,
  })),
);
const MarkdownSlides = lazy(() =>
  import("../components/presentation-modes/MarkdownSlides").then((m) => ({
    default: m.MarkdownSlides,
  })),
);
const BentoGridDeck = lazy(() =>
  import("../components/presentation-modes/BentoGridDeck").then((m) => ({
    default: m.BentoGridDeck,
  })),
);
const LottieStoryboard = lazy(() =>
  import("../components/presentation-modes/LottieStoryboard").then((m) => ({
    default: m.LottieStoryboard,
  })),
);
const MDXPresentation = lazy(() =>
  import("../components/presentation-modes/MDXPresentation").then((m) => ({
    default: m.MDXPresentation,
  })),
);
const ParallaxStoryteller = lazy(() =>
  import("../components/presentation-modes/ParallaxStoryteller").then((m) => ({
    default: m.ParallaxStoryteller,
  })),
);
const LiveCodeWalkthrough = lazy(() =>
  import("../components/presentation-modes/LiveCodeWalkthrough").then((m) => ({
    default: m.LiveCodeWalkthrough,
  })),
);
const RunnableCodeLab = lazy(() =>
  import("../components/presentation-modes/RunnableCodeLab").then((m) => ({
    default: m.RunnableCodeLab,
  })),
);
const NeccGritIntro = lazy(() =>
  import("../components/presentation-modes/NeccGritIntro").then((m) => ({
    default: m.NeccGritIntro,
  })),
);
const LiveDataDashboard = lazy(() =>
  import("../components/presentation-modes/LiveDataDashboard").then((m) => ({
    default: m.LiveDataDashboard,
  })),
);
const PollDrivenSlides = lazy(() =>
  import("../components/presentation-modes/PollDrivenSlides").then((m) => ({
    default: m.PollDrivenSlides,
  })),
);
const LiveQAReactionsDeck = lazy(() =>
  import("../components/presentation-modes/LiveQAReactionsDeck").then((m) => ({
    default: m.LiveQAReactionsDeck,
  })),
);
const RemoteClickerDeck = lazy(() =>
  import("../components/presentation-modes/RemoteClickerDeck").then((m) => ({
    default: m.RemoteClickerDeck,
  })),
);
const LessigMethodDeck = lazy(() =>
  import("../components/presentation-modes/LessigMethodDeck").then((m) => ({
    default: m.LessigMethodDeck,
  })),
);
const FramerMotionPlayground = lazy(() =>
  import("../components/presentation-modes/FramerMotionPlayground").then(
    (m) => ({
      default: m.FramerMotionPlayground,
    }),
  ),
);
const KineticTypography = lazy(() =>
  import("../components/presentation-modes/KineticTypography").then((m) => ({
    default: m.KineticTypography,
  })),
);
const RefinedGritDeck = lazy(() =>
  import("../components/presentation-modes/RefinedGritDeck").then((m) => ({
    default: m.RefinedGritDeck,
  })),
);
const BranchingNarrative = lazy(() =>
  import("../components/presentation-modes/BranchingNarrative").then((m) => ({
    default: m.BranchingNarrative,
  })),
);
const CustomSlideTransitions = lazy(() =>
  import("../components/presentation-modes/CustomSlideTransitions").then(
    (m) => ({
      default: m.CustomSlideTransitions,
    }),
  ),
);
const ScrollTimelineShowcase = lazy(() =>
  import("../components/presentation-modes/ScrollTimelineShowcase").then(
    (m) => ({
      default: m.ScrollTimelineShowcase,
    }),
  ),
);
const PresenterModeDeck = lazy(() =>
  import("../components/presentation-modes/PresenterModeDeck").then((m) => ({
    default: m.PresenterModeDeck,
  })),
);
const PechaKucha20x20 = lazy(() =>
  import("../components/presentation-modes/PechaKucha20x20").then((m) => ({
    default: m.PechaKucha20x20,
  })),
);
const Ignite20x15 = lazy(() =>
  import("../components/presentation-modes/Ignite20x15").then((m) => ({
    default: m.Ignite20x15,
  })),
);
const EarlyAdopterClientDeck = lazy(() =>
  import("../components/presentation-modes/EarlyAdopterClientDeck").then(
    (m) => ({
      default: m.EarlyAdopterClientDeck,
    }),
  ),
);
const TenTwentyThirtyDeck = lazy(() =>
  import("../components/presentation-modes/TenTwentyThirtyDeck").then((m) => ({
    default: m.TenTwentyThirtyDeck,
  })),
);
const GsapShowreel = lazy(() =>
  import("../components/presentation-modes/GsapShowreel").then((m) => ({
    default: m.GsapShowreel,
  })),
);
const GlobeExplorer = lazy(() =>
  import("../components/presentation-modes/GlobeExplorer").then((m) => ({
    default: m.GlobeExplorer,
  })),
);
const WebGLParticleDeck = lazy(() =>
  import("../components/presentation-modes/WebGLParticleDeck").then((m) => ({
    default: m.WebGLParticleDeck,
  })),
);
const WebGLParticleDeckNeonNoir = lazy(() =>
  import("../components/presentation-modes/WebGLParticleDeckNeonNoir").then(
    (m) => ({
      default: m.WebGLParticleDeckNeonNoir,
    }),
  ),
);
const WebGLParticleDeckConstellation = lazy(() =>
  import("../components/presentation-modes/WebGLParticleDeckConstellation").then(
    (m) => ({
      default: m.WebGLParticleDeckConstellation,
    }),
  ),
);
const WebGLParticleDeckInk = lazy(() =>
  import("../components/presentation-modes/WebGLParticleDeckInk").then((m) => ({
    default: m.WebGLParticleDeckInk,
  })),
);
const TerminalHacker = lazy(() =>
  import("../components/presentation-modes/TerminalHacker").then((m) => ({
    default: m.TerminalHacker,
  })),
);
const ComicPanelLayout = lazy(() =>
  import("../components/presentation-modes/ComicPanelLayout").then((m) => ({
    default: m.ComicPanelLayout,
  })),
);
const VoiceControlledDeck = lazy(() =>
  import("../components/presentation-modes/VoiceControlledDeck").then((m) => ({
    default: m.VoiceControlledDeck,
  })),
);
const NewspaperEditorial = lazy(() =>
  import("../components/presentation-modes/NewspaperEditorial").then((m) => ({
    default: m.NewspaperEditorial,
  })),
);
const AiChatPresentation = lazy(() =>
  import("../components/presentation-modes/AiChatPresentation").then((m) => ({
    default: m.AiChatPresentation,
  })),
);
const HolographicCards = lazy(() =>
  import("../components/presentation-modes/HolographicCards").then((m) => ({
    default: m.HolographicCards,
  })),
);
const TimelineExplorer = lazy(() =>
  import("../components/presentation-modes/TimelineExplorer").then((m) => ({
    default: m.TimelineExplorer,
  })),
);
const PhysicsPlayground = lazy(() =>
  import("../components/presentation-modes/PhysicsPlayground").then((m) => ({
    default: m.PhysicsPlayground,
  })),
);
const SpatialCanvas = lazy(() =>
  import("../components/presentation-modes/SpatialCanvas").then((m) => ({
    default: m.SpatialCanvas,
  })),
);
const AudioReactive = lazy(() =>
  import("../components/presentation-modes/AudioReactive").then((m) => ({
    default: m.AudioReactive,
  })),
);

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
      case "reveal-classic":
        return <RevealClassic />;
      case "md-investor-pitch-clearbox":
        return <MarkdownSlides deckId="md-investor-pitch-clearbox" />;
      case "md-client-proposal-pilot":
        return <MarkdownSlides deckId="md-client-proposal-pilot" />;
      case "md-technical-deep-dive":
        return <MarkdownSlides deckId="md-technical-deep-dive" />;
      case "md-incident-postmortem":
        return <MarkdownSlides deckId="md-incident-postmortem" />;
	      case "md-workshop-training":
	        return <MarkdownSlides deckId="md-workshop-training" />;
	      case "bento-grid-deck":
	        return <BentoGridDeck />;
	      case "lottie-storyboard":
	        return <LottieStoryboard />;
      case "mdx-presentation":
        return <MDXPresentation />;
      case "parallax-storyteller":
        return <ParallaxStoryteller />;
      case "live-code-walkthrough":
        return <LiveCodeWalkthrough />;
      case "runnable-code-lab":
        return <RunnableCodeLab />;
      case "necc-grit-intro":
        return <NeccGritIntro />;
      case "live-data-dashboard":
        return <LiveDataDashboard />;
      case "poll-driven-slides":
        return <PollDrivenSlides />;
      case "live-qa-reactions":
        return <LiveQAReactionsDeck />;
      case "remote-clicker-deck":
        return <RemoteClickerDeck />;
      case "framer-motion-playground":
        return <FramerMotionPlayground />;
	      case "kinetic-typography":
	        return <KineticTypography />;
	      case "refined-grit-deck":
	        return <RefinedGritDeck />;
	      case "branching-narrative":
	        return <BranchingNarrative />;
      case "custom-slide-transitions":
        return <CustomSlideTransitions />;
      case "scroll-timeline-showcase":
        return <ScrollTimelineShowcase />;
      case "presenter-mode-deck":
        return <PresenterModeDeck />;
      case "pecha-kucha-20x20":
        return <PechaKucha20x20 />;
	      case "ignite-20x15":
	        return <Ignite20x15 />;
	      case "lessig-method-deck":
	        return <LessigMethodDeck />;
      case "early-adopter-client-deck":
        return <EarlyAdopterClientDeck />;
      case "ten-twenty-thirty":
        return <TenTwentyThirtyDeck />;
      case "gsap-showreel":
        return <GsapShowreel />;
      case "globe-explorer":
        return <GlobeExplorer />;
      case "webgl-particle-deck":
        return <WebGLParticleDeck />;
      case "webgl-particle-deck-neon-noir":
        return <WebGLParticleDeckNeonNoir />;
      case "webgl-particle-deck-constellation":
        return <WebGLParticleDeckConstellation />;
      case "webgl-particle-deck-ink":
        return <WebGLParticleDeckInk />;
      case "terminal-hacker":
        return <TerminalHacker />;
      case "comic-panel-layout":
        return <ComicPanelLayout />;
      case "voice-controlled-deck":
        return <VoiceControlledDeck />;
      case "newspaper-editorial":
        return <NewspaperEditorial />;
      case "ai-chat-presentation":
        return <AiChatPresentation />;
      case "holographic-cards":
        return <HolographicCards />;
      case "timeline-explorer":
        return <TimelineExplorer />;
      case "physics-playground":
        return <PhysicsPlayground />;
      case "spatial-canvas":
        return <SpatialCanvas />;
      case "audio-reactive":
        return <AudioReactive />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <h2 className="text-3xl font-display mb-4">Coming Soon</h2>
            <p className="max-w-md text-fg/60">
              The <strong>{example.title}</strong> example is currently under
              development. Check back later for the implementation!
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-bg text-fg font-body flex flex-col selection:bg-accent selection:text-fg">
      <header className="border-b-2 border-border bg-card/80 backdrop-blur-sm p-4 flex items-center gap-4 sticky top-0 z-40">
        <Link
          to="/examples"
          className="p-2 border-2 border-border bg-card rounded-full shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all focus:outline-none"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-xl leading-none uppercase">
            {example.title}
          </h1>
          <p className="text-xs font-mono text-fg/50">
            {example.format} • {example.difficulty}
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center p-10">
              <div className="text-center space-y-3">
                <div className="mx-auto h-10 w-10 rounded-full border-2 border-border/30 border-t-accent animate-spin" />
                <p className="font-mono text-xs text-fg/60 uppercase tracking-widest">
                  Loading example…
                </p>
              </div>
            </div>
          }
        >
          {renderExample()}
        </Suspense>
      </main>
    </div>
  );
}
