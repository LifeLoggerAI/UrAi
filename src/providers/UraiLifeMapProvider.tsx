"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import type {
  LifeMapChapter,
  LifeMapData,
  LifeMapStar,
  LifeMapStarType,
  LifeMapVisibility,
} from "@/lib/lifemap/lifeMapTypes";
import { getUraiMemories, type UraiMemory } from "@/lib/urai-memory";
import { PassportDataLayerId } from "@/lib/passport/passportLayerTypes";

type UraiLifeMapContextValue = {
  lifeMapData: LifeMapData;
  selectedStar: LifeMapStar | null;
  selectedChapter: LifeMapChapter | null;
  isLifeMapOpen: boolean;
  zoomLevel: number;
  setZoomLevel: (value: number) => void;
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
const ZOOM_KEY = "urai.lifemap.zoom";
const FILTER_KEY = "urai.lifemap.filter";
const LAST_VIEW_KEY = "urai.lifemap.lastView";

// Helper to transform UraiMemory to LifeMapStar, which the UI components expect.
const transformMemoryToStar = (memory: UraiMemory): LifeMapStar => ({
  id: memory.id,
  title: memory.title,
  subtitle: memory.subtitle,
  summary: memory.description,
  createdAt: memory.createdAt,
  type: memory.type,
  intensity: memory.glowIntensity,
  visibility: memory.visibility as LifeMapVisibility,
  x: memory.constellationPosition.x,
  y: memory.constellationPosition.y,
  glyph: memory.glyph,
  sourceLayerId: memory.sourceLayerId as PassportDataLayerId | undefined,
  // All memories are part of the first chapter for now. This can be expanded later.
  chapterId: "chapter-genesis",
  railPosition: 1,
});

// Initial empty state with chapter definition
const initialLifeMapData: LifeMapData = {
  stars: [],
  chapters: [
    {
      id: "chapter-genesis",
      title: "The Beginning",
      subtitle: "Where your story unfolds",
      railPosition: 1, // First chapter
    },
  ],
};

function readStoredFilter(): LifeMapStarType | "all" {
  if (typeof window === "undefined") return "all";
  return (window.localStorage.getItem(FILTER_KEY) as LifeMapStarType | "all" | null) ?? "all";
}

function readStoredZoom(): number {
  if (typeof window === "undefined") return 1;
  const parsed = Number(window.localStorage.getItem(ZOOM_KEY));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function UraiLifeMapProvider({ children }: { children: ReactNode }) {
  const [lifeMapData, setLifeMapData] = useState<LifeMapData>(initialLifeMapData);
  const [selectedStar, setSelectedStar] = useState<LifeMapStar | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<LifeMapChapter | null>(
    lifeMapData.chapters[0] ?? null
  );
  const [isLifeMapOpen, setIsLifeMapOpen] = useState(false);
  const [filterByType, setFilterByTypeState] = useState<LifeMapStarType | "all">("all");
  const [showPrivateStars, setShowPrivateStars] = useState(false);
  const [zoomLevel, setZoomLevelState] = useState(1);

  useEffect(() => {
    setFilterByTypeState(readStoredFilter());
    setZoomLevelState(readStoredZoom());
  }, []);

  const regenerateLifeMap = useCallback(() => {
    const fetchData = async () => {
      const memories = await getUraiMemories();
      const stars = memories.map(transformMemoryToStar);
      const next: LifeMapData = {
        ...initialLifeMapData,
        stars,
      };
      setLifeMapData(next);
      setSelectedChapter(next.chapters[0] ?? null);
      setSelectedStar(null);
    };
    void fetchData();
  }, []);

  useEffect(() => {
    regenerateLifeMap();
  }, [regenerateLifeMap]);

  const openLifeMap = useCallback(() => {
    setIsLifeMapOpen(true);
    if (typeof window !== "undefined") window.localStorage.setItem(LAST_VIEW_KEY, "galaxy");
  }, []);

  const closeLifeMap = useCallback(() => {
    setIsLifeMapOpen(false);
    setSelectedStar(null);
  }, []);

  const selectStar = useCallback(
    (starId: string) => {
      const star = lifeMapData.stars.find((item) => item.id === starId) ?? null;
      setSelectedStar(star);
      setSelectedChapter(
        star?.chapterId ? lifeMapData.chapters.find((item) => item.id === star.chapterId) ?? null : null
      );
    },
    [lifeMapData]
  );

  const clearSelectedStar = useCallback(() => setSelectedStar(null), []);

  const setFilterByType = useCallback((type: LifeMapStarType | "all") => {
    setFilterByTypeState(type);
    if (typeof window !== "undefined") window.localStorage.setItem(FILTER_KEY, type);
  }, []);

  const setZoomLevel = useCallback((value: number) => {
    const next = Math.max(0.7, Math.min(1.8, value));
    setZoomLevelState(next);
    if (typeof window !== "undefined") window.localStorage.setItem(ZOOM_KEY, String(next));
  }, []);

  const value = useMemo<UraiLifeMapContextValue>(
    () => ({
      lifeMapData,
      selectedStar,
      selectedChapter,
      isLifeMapOpen,
      zoomLevel,
      setZoomLevel,
      openLifeMap,
      closeLifeMap,
      selectStar,
      clearSelectedStar,
      regenerateLifeMap,
      filterByType,
      setFilterByType,
      showPrivateStars,
      setShowPrivateStars,
    }),
    [
      clearSelectedStar,
      closeLifeMap,
      filterByType,
      isLifeMapOpen,
      lifeMapData,
      openLifeMap,
      regenerateLifeMap,
      selectStar,
      selectedChapter,
      selectedStar,
      setFilterByType,
      setZoomLevel,
      showPrivateStars,
      zoomLevel,
    ]
  );

  return <UraiLifeMapContext.Provider value={value}>{children}</UraiLifeMapContext.Provider>;
}

export function useUraiLifeMap(): UraiLifeMapContextValue {
  const context = useContext(UraiLifeMapContext);
  if (!context) throw new Error("useUraiLifeMap must be used inside UraiLifeMapProvider");
  return context;
}
