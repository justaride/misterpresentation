import type { ParticleDeckVariantConfig } from "../types";
import { classicVariant } from "./classic";

export const inkVariant: ParticleDeckVariantConfig = {
  ...classicVariant,
  id: "webgl-particle-deck-ink",
  title: "WebGL Particle Deck: Ink",
  description: "Paper grain, monochrome particles, minimal FX.",
  ui: {
    overlay: "center",
    hintStyle: "minimal",
    progressStyle: "pills",
  },
  render: {
    backgroundOverlay: "grain",
    sparkle: 0.05,
    opacity: 0.85,
    bloomScale: 0.15,
    trailsScale: 1.0,
  },
  extras: {
    constellationLines: false,
  },
  slides: classicVariant.slides.map((s) => {
    const fx = {
      ...s.fx,
      bloomStrength: s.fx.bloomStrength * 0.15,
      trailsDamp: 1.0,
    };
    return {
      ...s,
      particleColor: "#0B0B0D",
      bgColor: "#F4F1EA",
      fx,
    };
  }),
};

