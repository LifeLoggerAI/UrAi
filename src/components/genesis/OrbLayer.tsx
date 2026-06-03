"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getAssetPath } from "@/lib/assets/uraiAssetManifest";
import { SafeLayerImage } from "@/components/common/SafeLayerImage";

type OrbLayerProps = {
  intensity?: number;
  interactive?: boolean;
  onClick?: () => void;
  isAwake?: boolean;
  isListening?: boolean;
  isThinking?: boolean;
  soundless?: boolean;
  className?: string;
};

export function OrbLayer({ intensity = 0.86, interactive = true, onClick, isAwake = false, isListening = false, isThinking = false, soundless = false, className = "" }: OrbLayerProps) {
  const reduceMotion = useReducedMotion();
  const [wake, setWake] = useState(false);
  const awakeBoost = isAwake ? 0.22 : 0;
  const stateBoost = isListening ? 0.14 : isThinking ? 0.2 : 0;
  const glowIntensity = intensity + awakeBoost + stateBoost;

  const handleClick = () => {
    if (!interactive) return;
    if (!reduceMotion) {
      setWake(true);
      window.setTimeout(() => setWake(false), 700);
    }
    onClick?.();
  };

  return (
    <motion.button
      type="button"
      aria-label={soundless ? "Open URAI Companion without sound" : "Open URAI Companion"}
      aria-pressed={isAwake}
      onClick={handleClick}
      disabled={!interactive}
      className={`relative isolate h-full w-full rounded-full bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${className}`}
      style={{ cursor: interactive ? "pointer" : "default" }}
      animate={reduceMotion ? undefined : { y: [0, -6, 0], scale: isAwake ? [1.02, 1.055, 1.02] : [1, 1.025, 1] }}
      transition={{ duration: isAwake ? 4.8 : 6, repeat: Infinity, ease: "easeInOut" }}
      whileHover={interactive && !reduceMotion ? { scale: 1.04 } : undefined}
      whileTap={interactive && !reduceMotion ? { scale: 0.98 } : undefined}
      data-state={isThinking ? "thinking" : isListening ? "listening" : isAwake ? "open" : soundless ? "soundless" : "idle"}
    >
      <SafeLayerImage layerKey="orbShadow" src={getAssetPath("orbShadow")} alt="" className="pointer-events-none absolute inset-[8%] h-[100%] w-[100%] object-contain opacity-55" />
      <SafeLayerImage layerKey="orbGlow" src={getAssetPath("orbGlow")} alt="" priority className="pointer-events-none absolute inset-[-30%] h-[160%] w-[160%] object-contain opacity-90 mix-blend-screen" style={{ filter: `brightness(${0.86 + glowIntensity * 0.42})` }} />
      {wake ? <SafeLayerImage layerKey="orbWakeFlare" src={getAssetPath("orbWakeFlare")} alt="" className="pointer-events-none absolute inset-[-42%] h-[184%] w-[184%] object-contain opacity-85 mix-blend-screen" /> : null}
      <SafeLayerImage layerKey="orbCore" src={getAssetPath("orbCore")} alt="" priority className="pointer-events-none absolute inset-0 h-full w-full object-contain" style={{ filter: `brightness(${0.9 + glowIntensity * 0.24}) saturate(${1 + glowIntensity * 0.18})` }} />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-12%] rounded-full border border-white/10"
        style={{ boxShadow: `0 0 ${42 + glowIntensity * 62}px rgba(248,217,139,${0.14 + glowIntensity * 0.2})` }}
        animate={reduceMotion ? undefined : { opacity: isAwake ? [0.34, 0.62, 0.34] : [0.24, 0.48, 0.24], rotate: 360 }}
        transition={{ opacity: { duration: isAwake ? 3.6 : 5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 30, repeat: Infinity, ease: "linear" } }}
      />
      <SafeLayerImage layerKey="orbParticles" src={getAssetPath("orbParticles")} alt="" className="pointer-events-none absolute inset-[-18%] h-[136%] w-[136%] object-contain opacity-75 mix-blend-screen" style={{ opacity: reduceMotion ? 0.35 : 0.75 }} />
    </motion.button>
  );
}
