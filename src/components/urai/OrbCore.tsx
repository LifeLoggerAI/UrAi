"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";
import { getAssetPath } from "@/lib/assets/uraiAssetManifest";
import { SafeLayerImage } from "@/components/common/SafeLayerImage";

type OrbCoreProps = {
  scene: UraiScene;
  size?: "small" | "medium" | "large" | "hero";
  intensity?: number;
  interactive?: boolean;
  onClick?: () => void;
};

const sizeClasses = {
  small: "h-20 w-20",
  medium: "h-32 w-32",
  large: "h-44 w-44 md:h-56 md:w-56",
  hero: "h-56 w-56 md:h-80 md:w-80",
};

export function OrbCore({ scene, size = "large", intensity = 1, interactive = false, onClick }: OrbCoreProps) {
  const theme = getSceneTheme(scene);
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      aria-label="URAI orb"
      onClick={onClick}
      disabled={!interactive}
      className={`relative isolate flex items-center justify-center rounded-full bg-transparent outline-none focus:ring-2 focus:ring-white/50 ${sizeClasses[size]}`}
      style={{ cursor: interactive ? "pointer" : "default" }}
      whileHover={interactive && !reduceMotion ? { scale: 1.04 } : undefined}
      whileTap={interactive && !reduceMotion ? { scale: 0.98 } : undefined}
      animate={reduceMotion ? undefined : { y: [0, -5, 0], scale: [1, 1.025, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <SafeLayerImage
        src={getAssetPath("orbGlow")}
        alt=""
        priority
        className="pointer-events-none absolute inset-[-24%] h-[148%] w-[148%] object-contain opacity-90 mix-blend-screen"
        style={{ filter: `brightness(${0.88 + intensity * 0.4}) drop-shadow(0 0 ${36 + intensity * 34}px ${theme.glow})` }}
      />
      <SafeLayerImage
        src={getAssetPath("orbCore")}
        alt=""
        priority
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        style={{ filter: `brightness(${0.92 + intensity * 0.22}) saturate(${1 + intensity * 0.18})` }}
      />
      <motion.span
        className="pointer-events-none absolute inset-[-10%] rounded-full border border-white/15"
        style={{ boxShadow: `0 0 ${48 + intensity * 52}px ${theme.glow}, inset 0 0 34px rgba(255,255,255,0.12)` }}
        animate={reduceMotion ? undefined : { opacity: [0.42, 0.76, 0.42], rotate: 360 }}
        transition={{ opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 28, repeat: Infinity, ease: "linear" } }}
      />
      <SafeLayerImage
        src={getAssetPath("orbParticles")}
        alt=""
        className="pointer-events-none absolute inset-[-16%] h-[132%] w-[132%] object-contain opacity-80 mix-blend-screen"
      />
    </motion.button>
  );
}
