"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { buildPermissionedLifeMap } from "@/lib/lifemap/buildPermissionedLifeMap";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import type { LifeMapChapter, LifeMapData, LifeMapStar, LifeMapStarType } from "@/lib/lifemap/lifeMapTypes";

type UraiLifeMapContextValue = {
  lifeMapData: LifeMapData;
  selectedStar: LifeMapStar | null;
  selectedChapter: LifeMapChapter | null;
  isLifeMapOpen: boolean;
  openLifeMap: () => void;
  closeLifeMap: () => void;
  selectStar: (starId: string) => void;
  clearSelectedStar: () => void;
  regenerateLifeMap: (moodState?: GenesisMoodState) => void;
  filterByType: LifeMapStarType | "all";
  setFilterByType: (type: LifeMapStarType | "all") => void;
  showPrivateStars: boolean;
  setShowPrivateStars: (show: boolean) => void;
};

const UraiLifeMapContext = createContext<UraiLifeMapContextValue | null>(null);

export function UraiLifeMapProvider({ children }: { children: ReactNode }) {
  const [lifeMapData, setLifeMapData] = useState<LifeMapData>(() => buildPermissionedLifeMap({ moodState: "luminous" }));
  const [selectedStar, setSelectedStar] = useState<LifeMapStar | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<LifeMapChapter | null>(lifeMapData.chapters[0] ?? null);
  const [isLifeMapOpen, setIsLifeMapOpen] = useState(false);
  const [filterByType, setFilterByType] = useState<LifeMapStarType | "all">("all");
  const [showPrivateStars, setShowPrivateStars] = useState(false);

  const openLifeMap = useCallback(() => setIsLifeMapOpen(true), []);
  const closeLifeMap = useCallback(() => {
    setIsLifeMapOpen(false);
    setSelectedStar(null);
  }, []);

  const selectStar = useCallback((starId: string) => {
    const star = lifeMapData.stars.find((item) => item.id === starId) ?? null;
    setSelectedStar(star);
    setSelectedChapter(star?.chapterId ? lifeMapData.chapters.find((item) => item.id === star.chapterId) ?? null : null);
  }, [lifeMapData]);

  const clearSelectedStar = useCallback(() => setSelectedStar(null), []);

  const regenerateLifeMap = useCallback((moodState: GenesisMoodState = "luminous") => {
    const next = buildPermissionedLifeMap({ moodState });
    setLifeMapData(next);
    setSelectedChapter(next.chapters[0] ?? null);
    setSelectedStar(null);
  }, []);

  const value = useMemo<UraiLifeMapContextValue>(() => ({
    lifeMapData,
    selectedStar,
    selectedChapter,
    isLifeMapOpen,
    openLifeMap,
    closeLifeMap,
    selectStar,
    clearSelectedStar,
    regenerateLifeMap,
    filterByType,
    setFilterByType,
    showPrivateStars,
    setShowPrivateStars,
  }), [clearSelectedStar, closeLifeMap, filterByType, isLifeMapOpen, lifeMapData, openLifeMap, regenerateLifeMap, selectStar, selectedChapter, selectedStar, showPrivateStars]);

  return <UraiLifeMapContext.Provider value={value}>{children}</UraiLifeMapContext.Provider>;
}

export function useUraiLifeMap(): UraiLifeMapContextValue {
  const context = useContext(UraiLifeMapContext);
  if (!context) throw new Error("useUraiLifeMap must be used inside UraiLifeMapProvider");
  return context;
}
