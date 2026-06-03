"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildPermissionedShadow } from "@/lib/shadow/buildPermissionedShadow";
import type { ShadowReflection, ShadowSession, ShadowViewMode } from "@/lib/shadow/shadowTypes";

type UraiShadowContextValue = {
  shadowSession: ShadowSession;
  selectedReflection: ShadowReflection | null;
  isShadowOpen: boolean;
  viewMode: ShadowViewMode;
  openShadow: () => void;
  closeShadow: () => void;
  selectReflection: (reflectionId: string) => void;
  clearSelectedReflection: () => void;
  regenerateShadow: () => void;
  setViewMode: (mode: ShadowViewMode) => void;
  softenSelectedReflection: () => void;
  hideSelectedReflection: () => void;
};

const UraiShadowContext = createContext<UraiShadowContextValue | null>(null);
const LAST_VIEW_KEY = "urai.shadow.lastView";
const MODE_KEY = "urai.shadow.mode";

function readMode(): ShadowViewMode {
  if (typeof window === "undefined") return "sealed";
  const stored = window.localStorage.getItem(MODE_KEY);
  return stored === "soft" || stored === "clear" || stored === "guardian" || stored === "sealed" ? stored : "sealed";
}

export function UraiShadowProvider({ children }: { children: ReactNode }) {
  const [shadowSession, setShadowSession] = useState<ShadowSession>(() => buildPermissionedShadow());
  const [selectedReflection, setSelectedReflection] = useState<ShadowReflection | null>(null);
  const [isShadowOpen, setIsShadowOpen] = useState(false);
  const [viewMode, setViewModeState] = useState<ShadowViewMode>("sealed");

  useEffect(() => setViewModeState(readMode()), []);

  const openShadow = useCallback(() => {
    setIsShadowOpen(true);
    if (typeof window !== "undefined") window.localStorage.setItem(LAST_VIEW_KEY, "shadow");
  }, []);

  const closeShadow = useCallback(() => {
    setIsShadowOpen(false);
    setSelectedReflection(null);
  }, []);

  const selectReflection = useCallback((reflectionId: string) => {
    setSelectedReflection(shadowSession.reflections.find((reflection) => reflection.id === reflectionId) ?? null);
  }, [shadowSession.reflections]);

  const clearSelectedReflection = useCallback(() => setSelectedReflection(null), []);

  const regenerateShadow = useCallback(() => {
    const next = buildPermissionedShadow();
    setShadowSession(next);
    setSelectedReflection(null);
  }, []);

  const setViewMode = useCallback((mode: ShadowViewMode) => {
    setViewModeState(mode);
    if (typeof window !== "undefined") window.localStorage.setItem(MODE_KEY, mode);
  }, []);

  const softenSelectedReflection = useCallback(() => {
    if (!selectedReflection) return;
    setSelectedReflection({ ...selectedReflection, visibility: "softened" });
  }, [selectedReflection]);

  const hideSelectedReflection = useCallback(() => {
    if (!selectedReflection) return;
    setShadowSession((session) => ({ ...session, reflections: session.reflections.map((reflection) => reflection.id === selectedReflection.id ? { ...reflection, visibility: "hidden" } : reflection) }));
    setSelectedReflection(null);
  }, [selectedReflection]);

  const value = useMemo<UraiShadowContextValue>(() => ({
    shadowSession,
    selectedReflection,
    isShadowOpen,
    viewMode,
    openShadow,
    closeShadow,
    selectReflection,
    clearSelectedReflection,
    regenerateShadow,
    setViewMode,
    softenSelectedReflection,
    hideSelectedReflection,
  }), [clearSelectedReflection, closeShadow, hideSelectedReflection, isShadowOpen, openShadow, regenerateShadow, selectReflection, selectedReflection, setViewMode, shadowSession, softenSelectedReflection, viewMode]);

  return <UraiShadowContext.Provider value={value}>{children}</UraiShadowContext.Provider>;
}

export function useUraiShadow(): UraiShadowContextValue {
  const context = useContext(UraiShadowContext);
  if (!context) throw new Error("useUraiShadow must be used inside UraiShadowProvider");
  return context;
}
