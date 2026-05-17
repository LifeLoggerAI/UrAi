"use client";

import type { Dispatch, SetStateAction } from "react";
import type { MemoryCategory } from "@/components/urai/data/emotionPalette";
import type { MemoryStar } from "@/components/urai/data/memoryStars";
import type { GalaxyCameraState } from "@/components/urai/hooks/useGalaxyCamera";
import { CategoryFilterDock } from "./CategoryFilterDock";
import { CompanionInsightCard } from "./CompanionInsightCard";
import { GalaxyActionDock } from "./GalaxyActionDock";
import { ZoomMiniMap } from "./ZoomMiniMap";

export function GalaxyHUD({
  selected,
  camera,
  activeCategory,
  setActiveCategory,
  onCloseLine,
  onReplay,
  onReflect,
  onCenter,
}: {
  selected: MemoryStar | null;
  camera: GalaxyCameraState;
  activeCategory: MemoryCategory | "all";
  setActiveCategory: Dispatch<SetStateAction<MemoryCategory | "all">>;
  onCloseLine: () => void;
  onReplay: () => void;
  onReflect: () => void;
  onCenter: () => void;
}) {
  return (
    <>
      <CompanionInsightCard selected={selected} />
      <GalaxyActionDock onCloseLine={onCloseLine} onReplay={onReplay} onReflect={onReflect} onCenter={onCenter} />
      <CategoryFilterDock value={activeCategory} onChange={setActiveCategory} />
      <ZoomMiniMap camera={camera} />
    </>
  );
}
