"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";

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
      className={`relative isolate flex items-center justify-center rounded-full border border-white/20 bg-transparent outline-none ${sizeClasses[size]}`}
      style={{ boxShadow: `0 0 ${90 * intensity}px ${theme.glow}`, cursor: interactive ? "pointer" : "default" }}
      whileHover={interactive && !reduceMotion ? { scale: 1.04 } : undefined}
      whileTap={interactive && !reduceMotion ? { scale: 0.98 } : undefined}
      animate={reduceMotion ? undefined : { scale: [1, 1.025, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="absolute inset-[-22%] rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)` }} />
      <motion.span
        className="absolute inset-[-8%] rounded-full border border-white/15"
        style={{ background: "conic-gradient(from 180deg, transparent, rgba(255,255,255,0.22), transparent, rgba(255,255,255,0.12), transparent)" }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <span className="absolute inset-[8%] rounded-full" style={{ background: `radial-gradient(circle at 38% 32%, rgba(255,255,255,0.95) 0%, ${theme.accent} 16%, ${theme.secondary} 42%, rgba(10,14,32,0.92) 72%, rgba(0,0,0,0.98) 100%)` }} />
      <span className="absolute inset-[18%] rounded-full bg-white/10 blur-xl" />
      <span className="absolute inset-[2%] rounded-full border border-white/25" style={{ boxShadow: `inset 0 0 34px rgba(255,255,255,0.16), 0 0 44px ${theme.glow}` }} />
      <motion.span
        className="absolute h-2/3 w-2/3 rounded-full opacity-40 blur-md"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.34), transparent 55%)" }}
        animate={reduceMotion ? undefined : { opacity: [0.22, 0.45, 0.22], x: [-8, 8, -8], y: [4, -6, 4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.button>
  );
}
