"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getAssetPath } from "@/lib/assets/uraiAssetManifest";
import { SafeLayerImage } from "@/components/common/SafeLayerImage";

type OrbLayerProps = {
  intensity?: number;
  interactive?: boolean;
  onClick?: () => void;
  isAwake?: boolean;
  className?: string;
};

export function OrbLayer({ intensity = 0.86, interactive = true, onClick, isAwake = false, className = "" }: OrbLayerProps) {
  const reduceMotion = useReducedMotion();
  const awakeBoost = isAwake ? 0.22 : 0;

  return (
    <motion.button
      type="button"
      aria-label="Open URAI Companion"
      aria-pressed={isAwake}
      onClick={onClick}
      disabled={!interactive}
      className={`relative isolate h-[120px] w-[120px] rounded-full bg-transparent outline-none focus:ring-2 focus:ring-white/50 sm:h-[150px] sm:w-[150px] lg:h-[200px] lg:w-[200px] ${className}`}
      style={{ cursor: interactive ? "pointer" : "default" }}
      animate={reduceMotion ? undefined : { y: [0, -6, 0], scale: isAwake ? [1.02, 1.055, 1.02] : [1, 1.025, 1] }}
      transition={{ duration: isAwake ? 4.8 : 6, repeat: Infinity, ease: "easeInOut" }}
      whileHover={interactive && !reduceMotion ? { scale: 1.04 } : undefined}
      whileTap={interactive && !reduceMotion ? { scale: 0.98 } : undefined}
    >
      <SafeLayerImage
        src={getAssetPath("orbGlow")}
        alt=""
        priority
        className="pointer-events-none absolute inset-[-24%] h-[148%] w-[148%] object-contain opacity-90 mix-blend-screen"
        style={{ filter: `brightness(${0.86 + (intensity + awakeBoost) * 0.42})` }}
      />
      <SafeLayerImage
        src={getAssetPath("orbCore")}
        alt=""
        priority
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        style={{ filter: `brightness(${0.9 + (intensity + awakeBoost) * 0.24}) saturate(${1 + (intensity + awakeBoost) * 0.18})` }}
      />
      <motion.span
        className="pointer-events-none absolute inset-[-12%] rounded-full border border-white/15"
        style={{ boxShadow: `0 0 ${42 + (intensity + awakeBoost) * 62}px rgba(248,217,139,${0.18 + (intensity + awakeBoost) * 0.28})` }}
        animate={reduceMotion ? undefined : { opacity: isAwake ? [0.58, 0.86, 0.58] : [0.42, 0.74, 0.42], rotate: 360 }}
        transition={{ opacity: { duration: isAwake ? 3.6 : 5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 30, repeat: Infinity, ease: "linear" } }}
      />
      <SafeLayerImage
        src={getAssetPath("orbParticles")}
        alt=""
        className="pointer-events-none absolute inset-[-16%] h-[132%] w-[132%] object-contain opacity-80 mix-blend-screen"
      />
    </motion.button>
  );
}
