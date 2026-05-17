"use client";

import { useMemo, useState } from "react";
import type { LifeMapStar } from "@/lib/spatial-life-map/lifeMap.types";

export function useStarSelection(stars: LifeMapStar[]) {
  const [hoveredStarId, setHoveredStarId] = useState<string | null>(null);
  const [selectedStarId, setSelectedStarId] = useState<string | null>(stars[0]?.id ?? null);
  const [bloomStarId, setBloomStarId] = useState<string | null>(null);

  const hoveredStar = useMemo(() => stars.find((star) => star.id === hoveredStarId) ?? null, [hoveredStarId, stars]);
  const selectedStar = useMemo(() => stars.find((star) => star.id === selectedStarId) ?? null, [selectedStarId, stars]);
  const bloomStar = useMemo(() => stars.find((star) => star.id === bloomStarId) ?? null, [bloomStarId, stars]);

  function selectStar(star: LifeMapStar) {
    setSelectedStarId(star.id);
  }

  function openBloom(star?: LifeMapStar | null) {
    if (star) {
      setSelectedStarId(star.id);
      setBloomStarId(star.id);
    }
  }

  function closeBloom() {
    setBloomStarId(null);
  }

  return {
    hoveredStarId,
    selectedStarId,
    bloomStarId,
    hoveredStar,
    selectedStar,
    bloomStar,
    setHoveredStarId,
    setSelectedStarId,
    selectStar,
    openBloom,
    closeBloom,
  };
}
