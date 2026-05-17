"use client";

import { motion } from "framer-motion";
import { cinematicEase, type AscentPhase } from "@/components/urai/motion/ascentMotion";

export function MemoryOrb({ phase }: { phase: AscentPhase }) {
  return (
    <motion.div
      className="urai-memory-orb-wrap"
      animate={
        phase === "portal"
          ? { y: "-4vh", scale: 8.5, opacity: 0.92 }
          : phase === "lift"
            ? { y: "-4vh", scale: 1.18, opacity: 1 }
            : phase === "ignition"
              ? { y: "0vh", scale: 1.08, opacity: 1 }
              : { y: "0vh", scale: 1, opacity: 1 }
      }
      transition={{ duration: phase === "portal" ? 0.5 : 0.42, ease: cinematicEase }}
      aria-hidden
    >
      <div className="urai-orb-beam" />
      <div className="urai-orb-halo" />
      <div className="urai-orb-ring urai-orb-ring-one" />
      <div className="urai-orb-ring urai-orb-ring-two" />
      <div className="urai-orb-core">
        <span className="urai-orb-highlight" />
        <span className="urai-orb-shadow" />
      </div>
      <div className="urai-orb-spark" />
    </motion.div>
  );
}
