export type FxPreset = {
  bloomStrength: number;
  bloomRadius: number;
  bloomThreshold: number;
  trailsDamp: number; // AfterimagePass damp. 0.0 = infinite trail, 1.0 = none.
};

export type Slide = {
  id: string;
  title: string;
  subtitle: string;
  particleColor: string;
  bgColor: string;
  fx: FxPreset;
};

export type VariantUi = {
  overlay: "center" | "hud-left";
  hintStyle: "minimal" | "hud";
  progressStyle: "pills" | "ticks";
  hudLabel?: string;
};

export type VariantRender = {
  backgroundOverlay: "none" | "scanlines" | "grain" | "starfield";
  sparkle: number; // 0..1
  opacity: number; // 0..1
  bloomScale: number; // multiply bloom strength
  trailsScale: number; // multiply trails damp effect (closer to 1 = less trails)
};

export type VariantExtras = {
  constellationLines: boolean;
};

export type ParticleDeckVariantConfig = {
  id: string; // example route id
  title: string;
  description: string;
  slides: Slide[];
  ui: VariantUi;
  render: VariantRender;
  extras: VariantExtras;
};

