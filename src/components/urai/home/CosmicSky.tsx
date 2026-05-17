"use client";

import { StarParticleField } from "./StarParticleField";

export function CosmicSky() {
  return (
    <div className="urai-cosmic-sky" aria-hidden>
      <div className="urai-sky-gradient" />
      <StarParticleField density={0.88} className="urai-stars-far" />
      <StarParticleField density={0.32} className="urai-stars-near" />
      <div className="urai-sky-vignette" />
    </div>
  );
}
