"use client";

import { useEffect, useMemo, useState } from "react";
import type { MemoryStar } from "@/components/urai/data/memoryStars";

export function useStarSelection(stars: MemoryStar[], initialId: string | null = null) {
  const [selectedId, setSelectedId] = useState<string | null>(initialId);
  const selected = stars.find((star) => star.id === selectedId) ?? null;

  const relatedIds = useMemo(() => {
    if (!selected) return new Set<string>();
    const ids = new Set<string>([selected.id]);
    selected.threadIds.forEach((threadId) => {
      stars
        .filter((star) => star.threadIds.includes(threadId))
        .forEach((star) => ids.add(star.id));
    });
    return ids;
  }, [selected, stars]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return {
    selectedId,
    selected,
    relatedIds,
    selectStar: setSelectedId,
    clearSelection: () => setSelectedId(null),
  };
}
