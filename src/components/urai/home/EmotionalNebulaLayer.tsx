"use client";

import { motion } from "framer-motion";
import { softEase, type AscentPhase } from "@/components/urai/motion/ascentMotion";

export function EmotionalNebulaLayer({ phase }: { phase: AscentPhase }) {
  return (
    <motion.div
      className="urai-nebula-layer"
      animate={{ opacity: phase === "portal" ? 0.9 : 0.62, y: phase === "lift" ? -18 : 0 }}
      transition={{ duration: 0.8, ease: softEase }}
      aria-hidden
    >
      <div className="urai-nebula urai-nebula-cyan" />
      <div className="urai-nebula urai-nebula-violet" />
      <div className="urai-nebula urai-nebula-gold" />
    </motion.div>
  );
}
