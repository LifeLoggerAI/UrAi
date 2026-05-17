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
  onHideThread,
  onReplay,
  onMirror,
  onRecenter,
}: {
  selected: MemoryStar | null;
  camera: GalaxyCameraState;
  activeCategory: MemoryCategory | "all";
  setActiveCategory: Dispatch<SetStateAction<MemoryCategory | "all">>;
  onHideThread: () => void;
  onReplay: () => void;
  onMirror: () => void;
  onRecenter: () => void;
}) {
  return (
    <>
      <CompanionInsightCard selected={selected} />
      <GalaxyActionDock onHideThread={onHideThread} onReplay={onReplay} onMirror={onMirror} onRecenter={onRecenter} />
      <CategoryFilterDock activeCategory={activeCategory} onChange={setActiveCategory} />
      <ZoomMiniMap camera={camera} />
    </>
  );
}
