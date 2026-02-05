import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Section = {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
};

const SECTIONS: Section[] = [
  {
    id: "hero",
    title: "GSAP",
    subtitle: "The Gold Standard of Web Animation",
    color: "#88CE02",
    bg: "#0e0e0e",
  },
  {
    id: "scroll",
    title: "ScrollTrigger",
    subtitle: "Scroll-linked animations with surgical precision",
    color: "#FF6B35",
    bg: "#111",
  },
  {
    id: "timeline",
    title: "Timelines",
    subtitle: "Orchestrate complex sequences with ease",
    color: "#5B8DEF",
    bg: "#0a0a0a",
  },
  {
    id: "stagger",
    title: "Staggers",
    subtitle: "Cascade animations across multiple elements",
    color: "#E056A0",
    bg: "#111",
  },
  {
    id: "physics",
    title: "Physics",
    subtitle: "Inertia, snap, and momentum-based motion",
    color: "#FFD93D",
    bg: "#0e0e0e",
  },
  {
    id: "finale",
    title: "Showreel",
    subtitle: "Scroll back up to replay",
    color: "#88CE02",
    bg: "#000",
  },
];

export function GsapShowreel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = sectionsRef.current.filter(Boolean) as HTMLDivElement[];

      sections.forEach((section, i) => {
        const title = section.querySelector(".section-title");
        const subtitle = section.querySelector(".section-subtitle");
        const shapes = section.querySelectorAll(".shape");
        const bars = section.querySelectorAll(".bar");

        if (title) {
          gsap.fromTo(
            title,
            { y: 100, opacity: 0, skewY: 5 },
            {
              y: 0,
              opacity: 1,
              skewY: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "top 20%",
                scrub: 1,
              },
            },
          );
        }

        if (subtitle) {
          gsap.fromTo(
            subtitle,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 70%",
                end: "top 30%",
                scrub: 1,
              },
            },
          );
        }

        if (shapes.length > 0) {
          gsap.fromTo(
            shapes,
            { scale: 0, rotation: -180, opacity: 0 },
            {
              scale: 1,
              rotation: 0,
              opacity: 1,
              duration: 1,
              stagger: { each: 0.1, from: "random" },
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: section,
                start: "top 60%",
                end: "top 20%",
                scrub: 1,
              },
            },
          );
        }

        if (bars.length > 0) {
          gsap.fromTo(
            bars,
            { scaleX: 0, opacity: 0 },
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.8,
              stagger: 0.05,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 60%",
                end: "top 20%",
                scrub: 1,
              },
            },
          );
        }

        if (i === sections.length - 1) {
          gsap.fromTo(
            title,
            { scale: 0.5, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "elastic.out(1, 0.5)",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "top 30%",
                scrub: 1,
              },
            },
          );
        }
      });

      const progressBar = containerRef.current?.querySelector(".progress-bar");
      if (progressBar) {
        gsap.to(progressBar, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const setRef = (el: HTMLDivElement | null, i: number) => {
    sectionsRef.current[i] = el;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen overflow-y-scroll bg-black text-white"
    >
      <div
        className="progress-bar fixed top-0 left-0 right-0 h-1 z-50 origin-left"
        style={{
          transform: "scaleX(0)",
          background:
            "linear-gradient(90deg, #88CE02, #FF6B35, #5B8DEF, #E056A0, #FFD93D)",
        }}
      />

      {SECTIONS.map((section, i) => (
        <div
          key={section.id}
          ref={(el) => setRef(el, i)}
          className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden"
          style={{ backgroundColor: section.bg }}
        >
          {i === 0 && (
            <>
              <h1
                className="section-title text-7xl md:text-[12rem] font-black tracking-tighter"
                style={{ color: section.color }}
              >
                {section.title}
              </h1>
              <p className="section-subtitle text-xl md:text-3xl text-white/50 mt-4 font-light">
                {section.subtitle}
              </p>
              <div className="absolute bottom-12 text-white/20 animate-bounce">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
            </>
          )}

          {i === 1 && (
            <div className="text-center max-w-4xl">
              <h2
                className="section-title text-5xl md:text-8xl font-black tracking-tight"
                style={{ color: section.color }}
              >
                {section.title}
              </h2>
              <p className="section-subtitle text-lg md:text-2xl text-white/50 mt-6">
                {section.subtitle}
              </p>
              <div className="mt-16 flex justify-center gap-4 flex-wrap">
                {Array.from({ length: 8 }).map((_, j) => (
                  <div
                    key={j}
                    className="shape w-16 h-16 rounded-2xl"
                    style={{
                      backgroundColor: section.color,
                      opacity: 0.3 + j * 0.1,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {i === 2 && (
            <div className="text-center max-w-4xl">
              <h2
                className="section-title text-5xl md:text-8xl font-black"
                style={{ color: section.color }}
              >
                {section.title}
              </h2>
              <p className="section-subtitle text-lg md:text-2xl text-white/50 mt-6 mb-16">
                {section.subtitle}
              </p>
              <div className="space-y-3 max-w-md mx-auto">
                {[
                  "tween",
                  "fromTo",
                  "staggerTo",
                  "timeline.add",
                  "onComplete",
                ].map((label, j) => (
                  <div
                    key={label}
                    className="bar flex items-center gap-3 origin-left"
                  >
                    <div
                      className="h-8 rounded-r-lg"
                      style={{
                        width: `${60 + j * 20}%`,
                        backgroundColor: section.color,
                        opacity: 0.5 + j * 0.1,
                      }}
                    />
                    <span className="font-mono text-xs text-white/40">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {i === 3 && (
            <div className="text-center max-w-4xl">
              <h2
                className="section-title text-5xl md:text-8xl font-black"
                style={{ color: section.color }}
              >
                {section.title}
              </h2>
              <p className="section-subtitle text-lg md:text-2xl text-white/50 mt-6 mb-16">
                {section.subtitle}
              </p>
              <div className="grid grid-cols-6 gap-3 max-w-sm mx-auto">
                {Array.from({ length: 24 }).map((_, j) => (
                  <div
                    key={j}
                    className="shape w-10 h-10 rounded-full"
                    style={{ backgroundColor: section.color }}
                  />
                ))}
              </div>
            </div>
          )}

          {i === 4 && (
            <div className="text-center max-w-4xl">
              <h2
                className="section-title text-5xl md:text-8xl font-black"
                style={{ color: section.color }}
              >
                {section.title}
              </h2>
              <p className="section-subtitle text-lg md:text-2xl text-white/50 mt-6 mb-16">
                {section.subtitle}
              </p>
              <div className="flex justify-center gap-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div
                    key={j}
                    className="shape flex flex-col items-center gap-2"
                  >
                    <div
                      className="w-12 rounded-t-lg"
                      style={{
                        height: 40 + j * 30,
                        backgroundColor: section.color,
                        opacity: 0.4 + j * 0.15,
                      }}
                    />
                    <span className="font-mono text-xs text-white/30">
                      {(j + 1) * 20}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {i === 5 && (
            <div className="text-center">
              <h2
                className="section-title text-6xl md:text-9xl font-black"
                style={{ color: section.color }}
              >
                {section.title}
              </h2>
              <p className="section-subtitle text-lg text-white/40 mt-6">
                {section.subtitle}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
