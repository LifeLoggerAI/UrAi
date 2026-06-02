"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import type { TransitionDirection, UraiScene } from "@/lib/urai/scene-theme";

type SceneTransitionControllerProps = {
  activeScene: UraiScene;
  previousScene: UraiScene | null;
  direction: TransitionDirection;
  children: ReactNode;
};

export function SceneTransitionController({ activeScene, direction, children }: SceneTransitionControllerProps) {
  const reduceMotion = useReducedMotion();
  const variants = {
    initial: {
      opacity: 0,
      scale: reduceMotion ? 1 : direction === "return" ? 1.04 : 0.96,
      filter: reduceMotion ? "blur(0px)" : "blur(18px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
    },
    exit: {
      opacity: 0,
      scale: reduceMotion ? 1 : direction === "return" ? 0.96 : 1.04,
      filter: reduceMotion ? "blur(0px)" : "blur(18px)",
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeScene}
        className="relative z-10 min-h-screen w-full"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: reduceMotion ? 0.18 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
