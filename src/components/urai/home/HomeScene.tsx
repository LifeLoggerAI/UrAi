"use client";

import { motion } from "framer-motion";
import { cinematicEase, softEase } from "@/components/urai/motion/ascentMotion";
import { useAscentTransition } from "@/components/urai/hooks/useAscentTransition";
import { AvatarSilhouette } from "./AvatarSilhouette";
import { CosmicSky } from "./CosmicSky";
import { EmotionalNebulaLayer } from "./EmotionalNebulaLayer";
import { GroundSystem } from "./GroundSystem";
import { MemoryOrb } from "./MemoryOrb";

export function HomeScene() {
  const { phase, beginAscent, isTransitioning } = useAscentTransition("/life-map");

  return (
    <main className={`urai-screen urai-home-screen phase-${phase}`} onClick={beginAscent}>
      <button className="urai-fullscreen-button" aria-label="Enter Memory Galaxy" disabled={isTransitioning} />
      <motion.div className="urai-home-camera" animate={{ scale: phase === "ignition" ? 1.025 : 1 }} transition={{ duration: 0.22, ease: softEase }}>
        <CosmicSky />
        <EmotionalNebulaLayer phase={phase} />
        <GroundSystem phase={phase} />
        <AvatarSilhouette phase={phase} />
        <MemoryOrb phase={phase} />
      </motion.div>
      <motion.div className="urai-ascent-bloom" animate={{ opacity: phase === "portal" ? 0.86 : phase === "emergence" ? 0.34 : 0 }} transition={{ duration: 0.5, ease: cinematicEase }} aria-hidden />
      <motion.div className="urai-star-emergence" animate={{ opacity: phase === "emergence" || phase === "settle" ? 1 : 0, scale: phase === "emergence" ? 1 : 0.92 }} transition={{ duration: 0.54, ease: cinematicEase }} aria-hidden />
      <div className="urai-home-label" aria-hidden>
        <span>URAI</span>
        <strong>Inner Sky Shrine</strong>
        <em>Tap the sky to enter memory</em>
      </div>
    </main>
  );
}
