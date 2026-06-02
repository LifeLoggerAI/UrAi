"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { UraiScene } from "@/lib/urai/scene-theme";
import { getSceneTheme } from "@/lib/urai/scene-theme";
import type { MemoryStar } from "@/lib/urai/mock-memory-stars";

type ConstellationLayerProps = {
  scene: UraiScene;
  stars?: MemoryStar[];
  interactive?: boolean;
  selectedMemoryId?: string | null;
  onSelectMemory?: (memoryId: string) => void;
};

const fallbackStars = [
  { x: 18, y: 24, size: 2 },
  { x: 28, y: 38, size: 1 },
  { x: 41, y: 21, size: 2 },
  { x: 56, y: 34, size: 1 },
  { x: 68, y: 18, size: 2 },
  { x: 79, y: 41, size: 1 },
  { x: 45, y: 62, size: 1 },
  { x: 62, y: 70, size: 2 },
];

export function ConstellationLayer({ scene, stars, interactive = false, selectedMemoryId, onSelectMemory }: ConstellationLayerProps) {
  const theme = getSceneTheme(scene);
  const shouldReduceMotion = useReducedMotion();
  const useMemoryStars = Boolean(stars?.length);

  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden">
      <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {useMemoryStars
          ? stars!.slice(0, -1).map((star, index) => {
              const next = stars![index + 1];
              return (
                <motion.line
                  key={`${star.id}-${next.id}`}
                  x1={star.x}
                  y1={star.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={theme.accent}
                  strokeWidth={0.08 + star.intensity * 0.04}
                  strokeOpacity={scene === "life-map" ? 0.45 : 0.22}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: scene === "life-map" ? 0.45 : 0.22 }}
                  transition={{ duration: shouldReduceMotion ? 0.2 : 1.8, delay: index * 0.12 }}
                />
              );
            })
          : fallbackStars.slice(0, -1).map((star, index) => {
              const next = fallbackStars[index + 1];
              return (
                <motion.line
                  key={`fallback-line-${index}`}
                  x1={star.x}
                  y1={star.y}
                  x2={next.x}
                  y2={next.y}
                  stroke={theme.accent}
                  strokeWidth="0.08"
                  strokeOpacity="0.2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.1, 0.28, 0.1] }}
                  transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
                />
              );
            })}
      </svg>

      {useMemoryStars
        ? stars!.map((star, index) => {
            const isSelected = selectedMemoryId === star.id;
            return (
              <motion.button
                key={star.id}
                type="button"
                aria-label={`Open memory ${star.label}`}
                disabled={!interactive}
                onClick={() => onSelectMemory?.(star.id)}
                className="pointer-events-auto absolute rounded-full border border-white/20 outline-none focus:ring-2 focus:ring-white/50"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: 10 + star.intensity * 18 + star.z * 2,
                  height: 10 + star.intensity * 18 + star.z * 2,
                  background: `radial-gradient(circle, white 0%, ${star.color} 34%, transparent 72%)`,
                  boxShadow: `0 0 ${24 + star.intensity * 34}px ${star.color}`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={shouldReduceMotion ? { opacity: 1, scale: isSelected ? 1.18 : 1 } : { opacity: 1, scale: isSelected ? [1.12, 1.26, 1.12] : [1, 1.08, 1], y: [0, -2 - star.z, 0] }}
                transition={{ duration: shouldReduceMotion ? 0.2 : 4 + index, repeat: shouldReduceMotion ? 0 : Infinity, ease: "easeInOut", delay: index * 0.08 }}
              >
                <span className="sr-only">{star.label}</span>
              </motion.button>
            );
          })
        : fallbackStars.map((star, index) => (
            <motion.span
              key={`fallback-star-${index}`}
              className="absolute rounded-full bg-white"
              style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size + 1, height: star.size + 1, boxShadow: `0 0 18px ${theme.glow}` }}
              animate={shouldReduceMotion ? undefined : { opacity: [0.22, 0.9, 0.22], scale: [1, 1.4, 1] }}
              transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
    </div>
  );
}
