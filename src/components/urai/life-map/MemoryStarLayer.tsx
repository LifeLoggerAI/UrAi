"use client";

import { MemoryStar } from "./MemoryStar";
import type { MemoryCategory } from "@/components/urai/data/emotionPalette";
import type { MemoryStar as MemoryStarData } from "@/components/urai/data/memoryStars";

export function MemoryStarLayer({
  stars,
  selectedId,
  selectedActive,
  relatedIds,
  activeCategory,
  onSelect,
}: {
  stars: MemoryStarData[];
  selectedId: string | null;
  selectedActive: boolean;
  relatedIds: Set<string>;
  activeCategory: MemoryCategory | "all";
  onSelect: (id: string) => void;
}) {
  return (
    <div className="urai-memory-star-layer">
      {stars.map((star) => {
        const isSelected = star.id === selectedId;
        const filteredOut = activeCategory !== "all" && star.category !== activeCategory;
        return (
          <MemoryStar
            key={star.id}
            star={star}
            selected={isSelected}
            dimmed={selectedActive && !relatedIds.has(star.id)}
            filteredOut={filteredOut}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}
