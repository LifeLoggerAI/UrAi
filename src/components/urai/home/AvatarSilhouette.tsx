"use client";

import { motion } from "framer-motion";
import { cinematicEase, type AscentPhase } from "@/components/urai/motion/ascentMotion";

export function AvatarSilhouette({ phase }: { phase: AscentPhase }) {
  return (
    <motion.div
      className="urai-avatar-wrap"
      animate={
        phase === "portal"
          ? { y: "22vh", opacity: 0.08, filter: "blur(10px)" }
          : phase === "lift"
            ? { y: "5vh", opacity: 0.72, filter: "blur(0px)" }
            : { y: "0vh", opacity: 1, filter: "blur(0px)" }
      }
      transition={{ duration: 0.5, ease: cinematicEase }}
      aria-hidden
    >
      <div className="urai-avatar-aura" />
      <svg className="urai-avatar-silhouette" viewBox="0 0 260 420" role="img" aria-label="URAI symbolic avatar silhouette">
        <defs>
          <linearGradient id="uraiAvatarGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#bffaff" stopOpacity="0.28" />
            <stop offset="0.46" stopColor="#4ee8f2" stopOpacity="0.21" />
            <stop offset="1" stopColor="#4e6caa" stopOpacity="0" />
          </linearGradient>
          <filter id="softAvatarGlow">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d="M130 18 C82 58 68 124 84 190 C93 229 112 248 92 306 C78 346 88 391 130 412 C172 391 182 346 168 306 C148 248 167 229 176 190 C192 124 178 58 130 18Z" fill="url(#uraiAvatarGradient)" filter="url(#softAvatarGlow)" />
        <path d="M130 44 C104 82 100 134 112 184 C119 214 132 234 122 282" fill="none" stroke="rgba(218,250,255,.22)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="130" cy="172" r="7" fill="rgba(225,255,255,.38)" />
      </svg>
    </motion.div>
  );
}
