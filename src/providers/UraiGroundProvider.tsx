"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildPermissionedGroundGarden } from "@/lib/ground/buildPermissionedGroundGarden";
import type { GroundElement, GroundElementType, GroundGardenData } from "@/lib/ground/groundTypes";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";

type UraiGroundContextValue = {
  groundData: GroundGardenData;
  selectedElement: GroundElement | null;
  isGroundOpen: boolean;
  zoomLevel: number;
  setZoomLevel: (value: number) => void;
  openGround: () => void;
  closeGround: () => void;
  selectElement: (elementId: string) => void;
  clearSelectedElement: () => void;
  regenerateGround: (moodState?: GenesisMoodState) => void;
  filterByType: GroundElementType | "all";
  setFilterByType: (type: GroundElementType | "all") => void;
};

const UraiGroundContext = createContext<UraiGroundContextValue | null>(null);
const ZOOM_KEY = "urai.ground.zoom";
const FILTER_KEY = "urai.ground.filter";
const LAST_VIEW_KEY = "urai.ground.lastView";

function readZoom(): number {
  if (typeof window === "undefined") return 1;
  const parsed = Number(window.localStorage.getItem(ZOOM_KEY));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function readFilter(): GroundElementType | "all" {
  if (typeof window === "undefined") return "all";
  return (window.localStorage.getItem(FILTER_KEY) as GroundElementType | "all" | null) ?? "all";
}

export function UraiGroundProvider({ children }: { children: ReactNode }) {
  const [groundData, setGroundData] = useState<GroundGardenData>(() => buildPermissionedGroundGarden({ moodState: "luminous" }));
  const [selectedElement, setSelectedElement] = useState<GroundElement | null>(null);
  const [isGroundOpen, setIsGroundOpen] = useState(false);
  const [zoomLevel, setZoomLevelState] = useState(1);
  const [filterByType, setFilterByTypeState] = useState<GroundElementType | "all">("all");

  useEffect(() => {
    setZoomLevelState(readZoom());
    setFilterByTypeState(readFilter());
  }, []);

  const openGround = useCallback(() => {
    setIsGroundOpen(true);
    if (typeof window !== "undefined") window.localStorage.setItem(LAST_VIEW_KEY, "garden");
  }, []);

  const closeGround = useCallback(() => {
    setIsGroundOpen(false);
    setSelectedElement(null);
  }, []);

  const selectElement = useCallback((elementId: string) => {
    setSelectedElement(groundData.elements.find((element) => element.id === elementId) ?? null);
  }, [groundData.elements]);

  const clearSelectedElement = useCallback(() => setSelectedElement(null), []);

  const regenerateGround = useCallback((moodState: GenesisMoodState = "luminous") => {
    const next = buildPermissionedGroundGarden({ moodState });
    setGroundData(next);
    setSelectedElement(null);
  }, []);

  const setZoomLevel = useCallback((value: number) => {
    const next = Math.max(0.7, Math.min(1.8, value));
    setZoomLevelState(next);
    if (typeof window !== "undefined") window.localStorage.setItem(ZOOM_KEY, String(next));
  }, []);

  const setFilterByType = useCallback((type: GroundElementType | "all") => {
    setFilterByTypeState(type);
    if (typeof window !== "undefined") window.localStorage.setItem(FILTER_KEY, type);
  }, []);

  const value = useMemo<UraiGroundContextValue>(() => ({
    groundData,
    selectedElement,
    isGroundOpen,
    zoomLevel,
    setZoomLevel,
    openGround,
    closeGround,
    selectElement,
    clearSelectedElement,
    regenerateGround,
    filterByType,
    setFilterByType,
  }), [clearSelectedElement, closeGround, filterByType, groundData, isGroundOpen, openGround, regenerateGround, selectElement, selectedElement, setFilterByType, setZoomLevel, zoomLevel]);

  return <UraiGroundContext.Provider value={value}>{children}</UraiGroundContext.Provider>;
}

export function useUraiGround(): UraiGroundContextValue {
  const context = useContext(UraiGroundContext);
  if (!context) throw new Error("useUraiGround must be used inside UraiGroundProvider");
  return context;
}
