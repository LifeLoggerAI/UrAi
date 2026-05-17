"use client";

import { motion } from "framer-motion";
import { emotionPalette } from "@/components/urai/data/emotionPalette";
import type { MemoryStar as MemoryStarData } from "@/components/urai/data/memoryStars";

export function MemoryStar({
  star,
  selected,
  dimmed,
  filteredOut,
  onSelect,
}: {
  star: MemoryStarData;
  selected: boolean;
  dimmed: boolean;
  filteredOut: boolean;
  onSelect: (id: string) => void;
}) {
  const palette = emotionPalette[star.category];
  return (
    <motion.button
      className={`urai-memory-star ${selected ? "is-selected" : ""} ${dimmed ? "is-dimmed" : ""} ${filteredOut ? "is-filtered-out" : ""}`}
      style={{ left: `calc(50% + ${star.x}px)`, top: `calc(50% + ${star.y}px)`, zIndex: Math.round(20 + star.z * 20) }}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(star.id);
      }}
      whileHover={{ scale: 1.18 }}
      animate={{ scale: selected ? 1.18 : 1, opacity: filteredOut ? 0.18 : 1 }}
      transition={{ duration: 0.22 }}
      aria-label={`Open ${star.title}`}
    >
      <span className="urai-star-halo" style={{ background: `radial-gradient(circle, ${palette.halo}, transparent 70%)` }} />
      <span className="urai-star-core" style={{ background: palette.core, boxShadow: `0 0 ${18 + star.magnitude * 10}px ${palette.halo}` }} />
      <span className="urai-star-label">
        <strong>{star.title}</strong>
        <em>{star.subtitle}</em>
      </span>
    </motion.button>
  );
}
