"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buildPermissionedLegacy, legacyCandidateFromSummary } from "@/lib/legacy/buildPermissionedLegacy";
import type { LegacyArchive, LegacyCandidateSource, LegacyChapter, LegacyItem } from "@/lib/legacy/legacyTypes";
import type { GenesisMoodState } from "@/lib/companion/companionTypes";

type UraiLegacyContextValue = {
  legacyArchive: LegacyArchive;
  selectedLegacyItem: LegacyItem | null;
  selectedLegacyChapter: LegacyChapter | null;
  isLegacyOpen: boolean;
  hasConfirmedGate: boolean;
  openLegacy: () => void;
  closeLegacy: () => void;
  confirmLegacyAccess: () => void;
  addItemToLegacy: (item: LegacyCandidateSource) => void;
  removeItemFromLegacy: (itemId: string) => void;
  approveLegacyItem: (itemId: string) => void;
  sealLegacyItem: (itemId: string) => void;
  unsealLegacyItem: (itemId: string) => void;
  selectLegacyItem: (itemId: string) => void;
  selectLegacyChapter: (chapterId: string) => void;
  clearSelection: () => void;
  regenerateLegacy: (moodState?: GenesisMoodState) => void;
  disableLegacy: () => void;
};

const UraiLegacyContext = createContext<UraiLegacyContextValue | null>(null);
const LAST_VIEW_KEY = "urai.legacy.lastView";
const GATE_KEY = "urai.legacy.hasConfirmedGate";

function readConfirmedGate(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(GATE_KEY) === "true";
}

function createProfile(enabled: boolean) {
  return { legacyEnabled: enabled, permissionVersion: 1, enabledLayers: { system: true, passport: true, memory: true, legacy: true } };
}

export function UraiLegacyProvider({ children }: { children: ReactNode }) {
  const [hasConfirmedGate, setHasConfirmedGate] = useState(false);
  const [userApprovedItems, setUserApprovedItems] = useState<LegacyCandidateSource[]>([]);
  const [legacyArchive, setLegacyArchive] = useState<LegacyArchive>(() => buildPermissionedLegacy({ passportProfile: createProfile(false) }));
  const [selectedLegacyItem, setSelectedLegacyItem] = useState<LegacyItem | null>(null);
  const [selectedLegacyChapter, setSelectedLegacyChapter] = useState<LegacyChapter | null>(null);
  const [isLegacyOpen, setIsLegacyOpen] = useState(false);

  useEffect(() => {
    const confirmed = readConfirmedGate();
    setHasConfirmedGate(confirmed);
    setLegacyArchive(buildPermissionedLegacy({ passportProfile: createProfile(confirmed), userApprovedItems }));
  }, []);

  const rebuild = useCallback((confirmed: boolean, items: LegacyCandidateSource[]) => {
    const next = buildPermissionedLegacy({ passportProfile: createProfile(confirmed), userApprovedItems: items });
    setLegacyArchive(next);
    setSelectedLegacyChapter(next.chapters[0] ?? null);
  }, []);

  const openLegacy = useCallback(() => {
    setIsLegacyOpen(true);
    if (typeof window !== "undefined") window.localStorage.setItem(LAST_VIEW_KEY, "legacy");
  }, []);

  const closeLegacy = useCallback(() => {
    setIsLegacyOpen(false);
    setSelectedLegacyItem(null);
  }, []);

  const confirmLegacyAccess = useCallback(() => {
    setHasConfirmedGate(true);
    if (typeof window !== "undefined") window.localStorage.setItem(GATE_KEY, "true");
    rebuild(true, userApprovedItems);
  }, [rebuild, userApprovedItems]);

  const disableLegacy = useCallback(() => {
    setHasConfirmedGate(false);
    setUserApprovedItems([]);
    setSelectedLegacyItem(null);
    setSelectedLegacyChapter(null);
    if (typeof window !== "undefined") window.localStorage.setItem(GATE_KEY, "false");
    setLegacyArchive(buildPermissionedLegacy({ passportProfile: createProfile(false) }));
  }, []);

  const addItemToLegacy = useCallback((item: LegacyCandidateSource) => {
    const approved = { ...item, userApproved: true, exportAllowed: item.exportAllowed === true };
    setUserApprovedItems((current) => {
      const next = [approved, ...current.filter((existing) => existing.id !== approved.id)];
      rebuild(hasConfirmedGate, next);
      return next;
    });
  }, [hasConfirmedGate, rebuild]);

  const removeItemFromLegacy = useCallback((itemId: string) => {
    setUserApprovedItems((current) => {
      const next = current.filter((item) => item.id !== itemId);
      rebuild(hasConfirmedGate, next);
      return next;
    });
    setSelectedLegacyItem(null);
  }, [hasConfirmedGate, rebuild]);

  const approveLegacyItem = useCallback((itemId: string) => {
    setLegacyArchive((archive) => ({ ...archive, items: archive.items.map((item) => item.id === itemId ? { ...item, userApproved: true } : item) }));
  }, []);

  const sealLegacyItem = useCallback((itemId: string) => {
    setLegacyArchive((archive) => ({ ...archive, items: archive.items.map((item) => item.id === itemId ? { ...item, visibility: "sealed", exportAllowed: false } : item) }));
    setSelectedLegacyItem((item) => item?.id === itemId ? { ...item, visibility: "sealed", exportAllowed: false } : item);
  }, []);

  const unsealLegacyItem = useCallback((itemId: string) => {
    setLegacyArchive((archive) => ({ ...archive, items: archive.items.map((item) => item.id === itemId ? { ...item, visibility: "visible" } : item) }));
  }, []);

  const selectLegacyItem = useCallback((itemId: string) => setSelectedLegacyItem(legacyArchive.items.find((item) => item.id === itemId) ?? null), [legacyArchive.items]);
  const selectLegacyChapter = useCallback((chapterId: string) => setSelectedLegacyChapter(legacyArchive.chapters.find((chapter) => chapter.id === chapterId) ?? null), [legacyArchive.chapters]);
  const clearSelection = useCallback(() => { setSelectedLegacyItem(null); setSelectedLegacyChapter(null); }, []);
  const regenerateLegacy = useCallback((_moodState: GenesisMoodState = "luminous") => rebuild(hasConfirmedGate, userApprovedItems), [hasConfirmedGate, rebuild, userApprovedItems]);

  const value = useMemo<UraiLegacyContextValue>(() => ({ legacyArchive, selectedLegacyItem, selectedLegacyChapter, isLegacyOpen, hasConfirmedGate, openLegacy, closeLegacy, confirmLegacyAccess, addItemToLegacy, removeItemFromLegacy, approveLegacyItem, sealLegacyItem, unsealLegacyItem, selectLegacyItem, selectLegacyChapter, clearSelection, regenerateLegacy, disableLegacy }), [addItemToLegacy, approveLegacyItem, clearSelection, closeLegacy, confirmLegacyAccess, disableLegacy, hasConfirmedGate, isLegacyOpen, legacyArchive, openLegacy, regenerateLegacy, removeItemFromLegacy, sealLegacyItem, selectLegacyChapter, selectLegacyItem, selectedLegacyChapter, selectedLegacyItem, unsealLegacyItem]);

  return <UraiLegacyContext.Provider value={value}>{children}</UraiLegacyContext.Provider>;
}

export function useUraiLegacy(): UraiLegacyContextValue {
  const context = useContext(UraiLegacyContext);
  if (!context) throw new Error("useUraiLegacy must be used inside UraiLegacyProvider");
  return context;
}
