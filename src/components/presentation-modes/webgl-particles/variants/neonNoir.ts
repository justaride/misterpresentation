import type { ParticleDeckVariantConfig } from "../types";
import { classicVariant } from "./classic";

export const neonNoirVariant: ParticleDeckVariantConfig = {
  ...classicVariant,
  id: "webgl-particle-deck-neon-noir",
  title: "WebGL Particle Deck: Neon Noir",
  description: "Cyberpunk HUD, hotter bloom, longer trails.",
  ui: {
    overlay: "hud-left",
    hintStyle: "hud",
    progressStyle: "ticks",
    hudLabel: "NEON NOIR",
  },
  render: {
    backgroundOverlay: "scanlines",
    sparkle: 0.55,
    opacity: 0.9,
    bloomScale: 1.25,
    trailsScale: 0.92,
  },
  extras: {
    constellationLines: false,
  },
  slides: classicVariant.slides.map((s, idx) => {
    // Push backgrounds deeper, colors more neon.
    const bg = idx % 2 === 0 ? "#02030a" : "#050011";
    const fx = {
      ...s.fx,
      bloomStrength: s.fx.bloomStrength * 1.25,
      trailsDamp: Math.min(0.985, s.fx.trailsDamp * 0.96),
    };
    return { ...s, bgColor: bg, fx };
  }),
};

