"use client";

import { motion } from "framer-motion";
import { cinematicEase, type AscentPhase } from "@/components/urai/motion/ascentMotion";

export function GroundSystem({ phase }: { phase: AscentPhase }) {
  return (
    <motion.div
      className="urai-ground-system"
      animate={
        phase === "portal"
          ? { y: "28vh", opacity: 0.2, filter: "blur(8px)" }
          : phase === "lift"
            ? { y: "8vh", opacity: 1, filter: "blur(0px)" }
            : { y: "0vh", opacity: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 0.5, ease: cinematicEase }}
      aria-hidden
    >
      <div className="urai-horizon-mist" />
      <div className="urai-ground-back" />
      <div className="urai-ground-mid" />
      <div className="urai-ground-light-spill" />
      <div className="urai-ground-front" />
      <div className="urai-foreground-fog" />
    </motion.div>
  );
}
