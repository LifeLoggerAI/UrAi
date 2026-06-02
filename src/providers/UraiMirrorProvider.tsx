"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildPermissionedMirror } from "@/lib/mirror/buildPermissionedMirror";
import type { MirrorPatternType, MirrorReflection, MirrorSession } from "@/lib/mirror/mirrorTypes";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";

type UraiMirrorContextValue = {
  mirrorSession: MirrorSession;
  selectedReflection: MirrorReflection | null;
  isMirrorOpen: boolean;
  openMirror: () => void;
  closeMirror: () => void;
  selectReflection: (reflectionId: string) => void;
  clearSelectedReflection: () => void;
  regenerateMirror: (moodState?: GenesisMoodState) => void;
  filterByPatternType: MirrorPatternType | "all";
  setFilterByPatternType: (type: MirrorPatternType | "all") => void;
};

const UraiMirrorContext = createContext<UraiMirrorContextValue | null>(null);
const FILTER_KEY = "urai.mirror.filter";
const LAST_VIEW_KEY = "urai.mirror.lastView";

function readFilter(): MirrorPatternType | "all" {
  if (typeof window === "undefined") return "all";
  return (window.localStorage.getItem(FILTER_KEY) as MirrorPatternType | "all" | null) ?? "all";
}

export function UraiMirrorProvider({ children }: { children: ReactNode }) {
  const [mirrorSession, setMirrorSession] = useState<MirrorSession>(() => buildPermissionedMirror({ moodState: "luminous" }));
  const [selectedReflection, setSelectedReflection] = useState<MirrorReflection | null>(null);
  const [isMirrorOpen, setIsMirrorOpen] = useState(false);
  const [filterByPatternType, setFilterByPatternTypeState] = useState<MirrorPatternType | "all">("all");

  useEffect(() => {
    setFilterByPatternTypeState(readFilter());
  }, []);

  const openMirror = useCallback(() => {
    setIsMirrorOpen(true);
    if (typeof window !== "undefined") window.localStorage.setItem(LAST_VIEW_KEY, "mirror");
  }, []);

  const closeMirror = useCallback(() => {
    setIsMirrorOpen(false);
    setSelectedReflection(null);
  }, []);

  const selectReflection = useCallback((reflectionId: string) => {
    setSelectedReflection(mirrorSession.reflections.find((reflection) => reflection.id === reflectionId) ?? null);
  }, [mirrorSession.reflections]);

  const clearSelectedReflection = useCallback(() => setSelectedReflection(null), []);

  const regenerateMirror = useCallback((moodState: GenesisMoodState = "luminous") => {
    const next = buildPermissionedMirror({ moodState });
    setMirrorSession(next);
    setSelectedReflection(null);
  }, []);

  const setFilterByPatternType = useCallback((type: MirrorPatternType | "all") => {
    setFilterByPatternTypeState(type);
    if (typeof window !== "undefined") window.localStorage.setItem(FILTER_KEY, type);
  }, []);

  const value = useMemo<UraiMirrorContextValue>(() => ({
    mirrorSession,
    selectedReflection,
    isMirrorOpen,
    openMirror,
    closeMirror,
    selectReflection,
    clearSelectedReflection,
    regenerateMirror,
    filterByPatternType,
    setFilterByPatternType,
  }), [clearSelectedReflection, closeMirror, filterByPatternType, isMirrorOpen, mirrorSession, openMirror, regenerateMirror, selectReflection, selectedReflection, setFilterByPatternType]);

  return <UraiMirrorContext.Provider value={value}>{children}</UraiMirrorContext.Provider>;
}

export function useUraiMirror(): UraiMirrorContextValue {
  const context = useContext(UraiMirrorContext);
  if (!context) throw new Error("useUraiMirror must be used inside UraiMirrorProvider");
  return context;
}
