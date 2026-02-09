import { ParticleDeckEngine } from "./webgl-particles/ParticleDeckEngine";
import { inkVariant } from "./webgl-particles/variants/ink";

export function WebGLParticleDeckInk() {
  return <ParticleDeckEngine variant={inkVariant} />;
}

