import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, BookOpen, Copy } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MrNews } from "../components/mascot/MrNews";
import { SpeechBubble } from "../components/mascot/SpeechBubble";
import { CATEGORIES } from "../data/categories";
import { EXAMPLES } from "../data/examples";

export function Landing() {
  const exampleCount = EXAMPLES.length;
  const categoryCount = CATEGORIES.length;

  return (
    <div className="min-h-screen bg-bg text-fg font-body overflow-x-hidden relative selection:bg-accent selection:text-fg">
      <div className="noise-overlay" />

      <Header />

      <main className="relative">
        <section className="min-h-[calc(100vh-5rem)] max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-border bg-white font-mono text-xs font-bold uppercase tracking-wider transform -rotate-1">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              PRESENTATION EXAMPLES
            </div>

            <h1 className="text-6xl md:text-8xl font-display uppercase leading-[0.9] tracking-tighter">
              MODERN WEB <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fg to-muted">
                PRESENTATIONS
              </span>
            </h1>

            <p className="text-lg md:text-xl font-medium max-w-md leading-relaxed border-l-4 border-accent pl-6 py-1">
              A curated collection of presentation examples built with modern
              web technologies. Learn, copy, and create.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/examples"
                className="inline-flex items-center px-8 py-4 bg-accent text-fg font-display text-xl tracking-wide uppercase border-2 border-border shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all"
              >
                Browse Examples
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="#"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-border font-display text-xl tracking-wide uppercase shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] active:translate-y-1 active:shadow-none transition-all"
              >
                GitHub
              </a>
            </div>
          </div>

          <div className="relative flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <MrNews size={80} state="presenting" />
              <SpeechBubble
                status="live"
                message="Welcome to the showcase! Pick a category and start exploring."
                subtext={`${exampleCount} EXAMPLES ACROSS ${categoryCount} CATEGORIES`}
                position="left"
                className="max-w-xs"
              />
            </div>

            <div className="relative group">
              <div className="absolute -top-6 -right-6 w-32 h-8 bg-warn/90 rotate-12 z-20 flex items-center justify-center font-mono text-xs font-bold shadow-sm">
                SHOWCASE
              </div>

              <motion.div
                initial={{ rotateY: -5, rotateX: 5 }}
                animate={{ rotateY: 0, rotateX: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="bg-card border-2 border-border rounded-xl overflow-hidden shadow-[12px_12px_0px_0px_rgba(17,24,39,1)] relative"
              >
                <div className="bg-fg text-bg px-4 py-2 flex items-center justify-between border-b-2 border-border font-mono text-xs">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-danger border border-bg/20" />
                    <div className="w-3 h-3 rounded-full bg-warn border border-bg/20" />
                    <div className="w-3 h-3 rounded-full bg-accent border border-bg/20" />
                  </div>
                  <div className="uppercase tracking-widest opacity-80">
                    PRESENTATION CONSOLE
                  </div>
                </div>

                <div className="p-6 relative min-h-[320px] bg-bg scanlines">
                  <div className="grid grid-cols-4 gap-4 relative z-10">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <div
                          key={cat.id}
                          className="flex flex-col items-center gap-2 p-3 bg-white border-2 border-border hover:-translate-y-1 transition-transform cursor-default"
                        >
                          <div className="w-10 h-10 bg-bg border border-border flex items-center justify-center">
                            <Icon className="w-5 h-5 text-fg" />
                          </div>
                          <span className="font-mono text-[9px] font-bold uppercase text-center leading-tight">
                            {cat.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-fg text-accent font-mono text-xs py-2 px-4 overflow-hidden whitespace-nowrap border-t-2 border-border">
                    <span className="animate-pulse mr-4">&#9679; LIVE</span>
                    {categoryCount} CATEGORIES &mdash; {exampleCount} EXAMPLES
                    &mdash; SCROLL &bull; SLIDE
                    &bull; 3D &bull; CODE &bull; ANIMATION
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="border-y-2 border-border bg-white py-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#111827_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center relative z-10">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-accent border-2 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl uppercase">8 Categories</h3>
              <p className="text-muted font-medium">
                From scroll-driven narratives to WebGL particle systems.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-warn border-2 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl uppercase">
                {exampleCount}+ Examples
              </h3>
              <p className="text-muted font-medium">
                Beginner to advanced, each with full source code.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-card border-2 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
                <Copy className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl uppercase">
                Copy &amp; Learn
              </h3>
              <p className="text-muted font-medium">
                Every example is self-contained and ready to fork.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
