"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";

export function CinematicBackdrop({ scene }: { scene: UraiScene }) {
  const theme = getSceneTheme(scene);
  const reduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: theme.background }}>
      <motion.div
        className="absolute inset-[-20%] opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 35%, rgba(255,255,255,0.18), transparent 28%), radial-gradient(circle at 20% 70%, rgba(147,197,253,0.16), transparent 30%), radial-gradient(circle at 80% 65%, rgba(250,204,21,0.12), transparent 26%)",
        }}
        animate={reduceMotion ? undefined : { x: [0, 18, -12, 0], y: [0, -14, 10, 0], scale: [1, 1.03, 1.01, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: "radial-gradient(circle at 50% 50%, transparent 0%, transparent 45%, rgba(0,0,0,0.72) 100%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-1/2 h-[38vh] w-[120vw] -translate-x-1/2 rounded-[100%] blur-3xl"
        style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 65%)`, opacity: scene === "ground" ? 0.7 : 0.35 }}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/50 to-transparent" />
    </div>
  );
}
