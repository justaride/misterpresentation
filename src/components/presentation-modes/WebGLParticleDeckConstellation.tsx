import { ParticleDeckEngine } from "./webgl-particles/ParticleDeckEngine";
import { constellationVariant } from "./webgl-particles/variants/constellation";

export function WebGLParticleDeckConstellation() {
  return <ParticleDeckEngine variant={constellationVariant} />;
}

