"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cinematicEase } from "@/components/urai/motion/ascentMotion";
import type { GalaxyCameraState } from "@/components/urai/hooks/useGalaxyCamera";

export function GalaxyCamera({ camera, dragging, children }: { camera: GalaxyCameraState; dragging?: boolean; children: ReactNode }) {
  return (
    <motion.div
      className="urai-galaxy-camera"
      animate={{ x: camera.x, y: camera.y, scale: camera.scale }}
      transition={{ duration: dragging ? 0 : 0.42, ease: cinematicEase }}
    >
      {children}
    </motion.div>
  );
}
