"use client";

import { RealHumanPresence } from "@/components/urai/humans/RealHumanPresence";

/**
 * Compatibility wrapper for legacy Home imports.
 *
 * The old implementation rendered a glowing box. Home now shares the same
 * human-proportioned runtime representation used by Council so the spatial
 * world reads as inhabited by people rather than abstract placeholders.
 */
export function AvatarSilhouette() {
  return (
    <RealHumanPresence
      name="home-human-presence"
      position={[0, -0.5, -2]}
      rotation={[0, 0, 0]}
      scale={1}
      skinTone="#b8795e"
      hairColor="#241813"
      hairStyle="short"
      shirtColor="#26384a"
      trouserColor="#20252d"
      shoeColor="#161719"
      accentColor="#8ed7ff"
    />
  );
}
