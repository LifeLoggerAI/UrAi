"use client";

import type { KeyboardEvent } from "react";
import { motion } from "framer-motion";
import type { LifeMapStar } from "@/lib/lifemap/lifeMapTypes";

type LifeMapStarNodeProps = {
  star: LifeMapStar;
  isSelected?: boolean;
  onSelect: (starId: string) => void;
};

const sizeByIntensity: Record<LifeMapStar["intensity"], number> = {
  quiet: 8,
  soft: 12,
  bright: 16,
  flare: 22,
  threshold: 26,
};

// New color config for a more refined, glowy look.
const colorConfig: Record<LifeMapStar["type"], { core: string; aura: string }> = {
  memory: { core: "#FDE68A", aura: "rgba(253, 230, 138, 0.4)" },
  mood: { core: "#A5B4FC", aura: "rgba(165, 180, 252, 0.4)" },
  relationship: { core: "#C4B5FD", aura: "rgba(196, 181, 253, 0.4)" },
  ritual: { core: "#6EE7B7", aura: "rgba(110, 231, 183, 0.4)" },
  milestone: { core: "#FCD34D", aura: "rgba(252, 211, 77, 0.5)" },
  recovery: { core: "#5EEAD4", aura: "rgba(94, 234, 212, 0.4)" },
  shadow: { core: "#A78BFA", aura: "rgba(167, 139, 250, 0.4)" },
  legacy: { core: "#FDBA74", aura: "rgba(253, 186, 116, 0.4)" },
  passport: { core: "#7DD3FC", aura: "rgba(125, 211, 252, 0.4)" },
  system: { core: "#FFFFFF", aura: "rgba(255, 255, 255, 0.5)" },
};

export function LifeMapStarNode({ star, isSelected = false, onSelect }: LifeMapStarNodeProps) {
  const size = sizeByIntensity[star.intensity];
  const { core, aura } = colorConfig[star.type];

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(star.id);
    }
  };

  return (
    <motion.button
      type="button"
      aria-label={`Open ${star.title}`}
      onClick={() => onSelect(star.id)}
      onKeyDown={handleKeyDown}
      className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/70"
      style={{ left: `${star.x}%`, top: `${star.y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: { delay: 0.2 + Math.random() * 0.4, duration: 0.5, ease: "easeOut" } }}
      whileHover={{ scale: 1.15, zIndex: 10 }}
    >
      {/* Selection Glow - more prominent and animated */}
      {isSelected && (
        <motion.div
          className="absolute -inset-2.5 rounded-full"
          style={{ boxShadow: `0 0 24px 10px ${aura}, inset 0 0 12px 4px ${core}` }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { repeat: Infinity, repeatType: "mirror", duration: 2, ease: "easeInOut" } }}
          exit={{ scale: 0.8, opacity: 0 }}
        />
      )}

      {/* Star body: Core, Aura, and Glyph */}
      <motion.div className="relative rounded-full" style={{ width: size, height: size }} animate={{ scale: isSelected ? 1.25 : 1 }}>
        {/* Aura */}
        <div
          className="absolute inset-0 rounded-full transition-opacity"
          style={{
            boxShadow: `0 0 ${size * 1.5}px ${aura}`,
            opacity: star.visibility === "requires_permission" ? 0.3 : 0.9,
          }}
        />
        {/* Core light */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${core} 15%, transparent 70%)`,
            opacity: star.visibility === "requires_permission" ? 0.4 : 1,
          }}
        />
        {/* Solid center + Glyph */}
        <div
          className={`absolute inset-0 grid place-items-center rounded-full text-black/70`} style={{ fontSize: Math.max(8, size / 1.8) }}>
          {star.glyph}
        </div>
      </motion.div>

      {/* Label: Polished with glass style */}
      {(isSelected || star.intensity === "flare" || star.intensity === "threshold") && (
        <motion.div
          className="absolute left-1/2 top-[calc(50%+18px)] min-w-max -translate-x-1/2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        >
          <div className="rounded-md bg-black/50 px-2.5 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
            {star.title}
          </div>
        </motion.div>
      )}
    </motion.button>
  );
}
