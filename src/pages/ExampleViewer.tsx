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
      case "lottie-storyboard":
        return <LottieStoryboard />;
      case "mdx-presentation":
        return <MDXPresentation />;
      case "parallax-storyteller":
        return <ParallaxStoryteller />;
      case "live-code-walkthrough":
        return <LiveCodeWalkthrough />;
      case "necc-grit-intro":
        return <NeccGritIntro />;
      case "live-data-dashboard":
        return <LiveDataDashboard />;
      case "poll-driven-slides":
        return <PollDrivenSlides />;
      case "framer-motion-playground":
        return <FramerMotionPlayground />;
      case "kinetic-typography":
        return <KineticTypography />;
      case "branching-narrative":
        return <BranchingNarrative />;
      case "custom-slide-transitions":
        return <CustomSlideTransitions />;
      case "scroll-timeline-showcase":
        return <ScrollTimelineShowcase />;
      case "presenter-mode-deck":
        return <PresenterModeDeck />;
      case "gsap-showreel":
        return <GsapShowreel />;
      case "globe-explorer":
        return <GlobeExplorer />;
      case "webgl-particle-deck":
        return <WebGLParticleDeck />;
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
    <div className="min-h-screen bg-bg text-fg flex flex-col">
      <header className="border-b border-border bg-card/50 p-4 flex items-center gap-4">
        <Link
          to="/examples"
          className="p-2 hover:bg-accent/10 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-lg leading-none">{example.title}</h1>
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
