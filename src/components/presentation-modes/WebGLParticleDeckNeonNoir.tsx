import { ParticleDeckEngine } from "./webgl-particles/ParticleDeckEngine";
import { neonNoirVariant } from "./webgl-particles/variants/neonNoir";

export function WebGLParticleDeckNeonNoir() {
  return <ParticleDeckEngine variant={neonNoirVariant} />;
}

