"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useUraiVoice } from "@/providers/UraiVoiceProvider";

export function UraiCaptionBubble() {
  const { currentCaption, captionsEnabled } = useUraiVoice();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {captionsEnabled && currentCaption ? (
        <motion.div
          className="pointer-events-none fixed inset-x-4 bottom-24 z-[80] mx-auto max-w-md rounded-3xl border border-white/12 bg-black/35 px-5 py-4 text-center text-sm leading-6 text-white/78 shadow-2xl backdrop-blur-2xl md:bottom-12"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: shouldReduceMotion ? 0.12 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ boxShadow: "0 0 42px rgba(248,217,139,0.16)" }}
        >
          {currentCaption}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
