import { ParticleDeckEngine } from "./webgl-particles/ParticleDeckEngine";
import { classicVariant } from "./webgl-particles/variants/classic";

export function WebGLParticleDeck() {
  return <ParticleDeckEngine variant={classicVariant} />;
}

