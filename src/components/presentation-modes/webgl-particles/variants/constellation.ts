import type { ParticleDeckVariantConfig } from "../types";
import { classicVariant } from "./classic";

export const constellationVariant: ParticleDeckVariantConfig = {
  ...classicVariant,
  id: "webgl-particle-deck-constellation",
  title: "WebGL Particle Deck: Constellation",
  description: "Starfield minimalism with faint constellation lines.",
  ui: {
    overlay: "center",
    hintStyle: "minimal",
    progressStyle: "ticks",
  },
  render: {
    backgroundOverlay: "starfield",
    sparkle: 0.2,
    opacity: 0.78,
    bloomScale: 0.65,
    trailsScale: 1.0,
  },
  extras: {
    constellationLines: true,
  },
  slides: classicVariant.slides.map((s) => {
    const fx = {
      ...s.fx,
      bloomStrength: s.fx.bloomStrength * 0.65,
      trailsDamp: 1.0,
    };
    // Cooler palette and calmer BG.
    const bg = "#020614";
    return {
      ...s,
      bgColor: bg,
      particleColor:
        s.id === "webgl" ? "#93C5FD" : s.particleColor.replace("#", "#"),
      fx,
    };
  }),
};

