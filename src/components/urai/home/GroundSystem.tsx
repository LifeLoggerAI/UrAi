"use client";

import { motion } from "framer-motion";
import { cinematicEase, type AscentPhase } from "@/components/urai/motion/ascentMotion";

export function GroundSystem({ phase }: { phase: AscentPhase }) {
  return (
    <motion.div
      className="urai-ground-system urai-ground-final"
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
      <svg className="urai-terrain-svg" viewBox="0 0 1600 780" preserveAspectRatio="none">
        <defs>
          <linearGradient id="terrainBack" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(54,98,174,.52)" />
            <stop offset="0.45" stopColor="rgba(13,38,83,.72)" />
            <stop offset="1" stopColor="rgba(0,4,15,.98)" />
          </linearGradient>
          <linearGradient id="terrainMid" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="rgba(76,226,238,.23)" />
            <stop offset="0.18" stopColor="rgba(38,77,143,.62)" />
            <stop offset="1" stopColor="rgba(0,3,12,1)" />
          </linearGradient>
          <radialGradient id="terrainGlow" cx="50%" cy="8%" r="58%">
            <stop offset="0" stopColor="rgba(217,255,255,.42)" />
            <stop offset="0.24" stopColor="rgba(78,232,242,.18)" />
            <stop offset="0.58" stopColor="rgba(255,229,138,.08)" />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="terrainSoftGlow" x="-20%" y="-30%" width="140%" height="160%">
            <feGaussianBlur stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M0 315 C130 260 190 282 270 235 C368 176 432 220 520 188 C646 140 710 198 803 156 C904 110 1012 162 1108 128 C1213 90 1270 156 1370 176 C1460 194 1530 176 1600 214 L1600 780 L0 780 Z" fill="url(#terrainBack)" opacity=".82" />
        <path d="M0 415 C120 350 210 375 310 326 C420 270 505 312 625 268 C724 232 812 285 900 244 C1016 190 1125 248 1214 206 C1318 157 1430 235 1600 202 L1600 780 L0 780 Z" fill="url(#terrainMid)" opacity=".98" />
        <path d="M0 458 C155 417 250 465 365 410 C488 350 577 400 703 358 C802 325 910 382 1010 340 C1142 286 1280 360 1600 305 L1600 780 L0 780 Z" fill="rgba(0,8,23,.86)" />
        <ellipse cx="800" cy="326" rx="470" ry="122" fill="url(#terrainGlow)" filter="url(#terrainSoftGlow)" opacity=".95" />
        <ellipse cx="800" cy="468" rx="240" ry="60" fill="rgba(84,216,242,.22)" filter="url(#terrainSoftGlow)" opacity=".86" />
        <path d="M0 615 C260 560 364 644 568 590 C710 552 846 628 1010 572 C1210 504 1374 618 1600 550 L1600 780 L0 780 Z" fill="rgba(0,2,8,.92)" />
      </svg>
      <div className="urai-ground-light-spill" />
      <div className="urai-foreground-fog" />
    </motion.div>
  );
}
