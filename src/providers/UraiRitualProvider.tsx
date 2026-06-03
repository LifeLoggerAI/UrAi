"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createSystemRitual, suggestRituals } from "@/lib/rituals/suggestRituals";
import type { RitualSuggestionContext, RitualStatus, UraiRitual } from "@/lib/rituals/ritualTypes";
import { legacyCandidateFromSummary } from "@/lib/legacy/buildPermissionedLegacy";
import { reviewExportCandidate } from "@/lib/exports/buildPermissionedExport";

export type RitualExportReview = ReturnType<typeof reviewExportCandidate>;

type UraiRitualContextValue = {
  rituals: UraiRitual[];
  selectedRitual: UraiRitual | null;
  activeRitual: UraiRitual | null;
  isRitualFlowOpen: boolean;
  suggestForContext: (context?: RitualSuggestionContext) => UraiRitual[];
  startRitual: (ritualId: string) => void;
  completeRitual: (ritualId: string) => void;
  skipRitual: (ritualId: string) => void;
  saveRitual: (ritualId: string) => void;
  hideRitual: (ritualId: string) => void;
  selectRitual: (ritualId: string) => void;
  clearSelectedRitual: () => void;
  closeRitualFlow: () => void;
  addRitualToLegacy: (ritualId: string) => ReturnType<typeof legacyCandidateFromSummary> | null;
  exportRitual: (ritualId: string) => RitualExportReview | null;
};

const UraiRitualContext = createContext<UraiRitualContextValue | null>(null);
const SAVED_KEY = "urai.rituals.saved";
const COMPLETED_KEY = "urai.rituals.completed.local";

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids))));
}

function updateStatus(rituals: UraiRitual[], ritualId: string, status: RitualStatus): UraiRitual[] {
  return rituals.map((ritual) => ritual.id === ritualId ? { ...ritual, status, completedAt: status === "completed" ? new Date().toISOString() : ritual.completedAt } : ritual);
}

export function UraiRitualProvider({ children }: { children: ReactNode }) {
  const [rituals, setRituals] = useState<UraiRitual[]>(() => [createSystemRitual()]);
  const [selectedRitual, setSelectedRitual] = useState<UraiRitual | null>(null);
  const [activeRitual, setActiveRitual] = useState<UraiRitual | null>(null);
  const [isRitualFlowOpen, setIsRitualFlowOpen] = useState(false);

  useEffect(() => {
    const saved = new Set(readIds(SAVED_KEY));
    const completed = new Set(readIds(COMPLETED_KEY));
    setRituals((current) => current.map((ritual) => completed.has(ritual.id) ? { ...ritual, status: "completed" } : saved.has(ritual.id) ? { ...ritual, status: "saved" } : ritual));
  }, []);

  const suggestForContext = useCallback((context: RitualSuggestionContext = {}) => {
    const next = suggestRituals({ passportProfile: { ritualsEnabled: true, enabledLayers: { system: true, passport: true, mood: true, recovery: true, memory: true, ritual: true, legacy: true } }, ...context });
    setRituals((current) => {
      const existing = new Set(current.map((ritual) => ritual.id));
      return [...next.filter((ritual) => !existing.has(ritual.id)), ...current].slice(0, 12);
    });
    setSelectedRitual(next[0] ?? null);
    return next;
  }, []);

  const startRitual = useCallback((ritualId: string) => {
    setRituals((current) => updateStatus(current, ritualId, "started"));
    setActiveRitual((current) => rituals.find((ritual) => ritual.id === ritualId) ?? current);
    setSelectedRitual(rituals.find((ritual) => ritual.id === ritualId) ?? null);
    setIsRitualFlowOpen(true);
  }, [rituals]);

  const completeRitual = useCallback((ritualId: string) => {
    setRituals((current) => updateStatus(current, ritualId, "completed"));
    writeIds(COMPLETED_KEY, [...readIds(COMPLETED_KEY), ritualId]);
    setActiveRitual((ritual) => ritual?.id === ritualId ? { ...ritual, status: "completed", completedAt: new Date().toISOString() } : ritual);
  }, []);

  const skipRitual = useCallback((ritualId: string) => setRituals((current) => updateStatus(current, ritualId, "skipped")), []);
  const saveRitual = useCallback((ritualId: string) => {
    setRituals((current) => updateStatus(current, ritualId, "saved"));
    writeIds(SAVED_KEY, [...readIds(SAVED_KEY), ritualId]);
  }, []);
  const hideRitual = useCallback((ritualId: string) => setRituals((current) => updateStatus(current, ritualId, "hidden")), []);
  const selectRitual = useCallback((ritualId: string) => setSelectedRitual(rituals.find((ritual) => ritual.id === ritualId) ?? null), [rituals]);
  const clearSelectedRitual = useCallback(() => setSelectedRitual(null), []);
  const closeRitualFlow = useCallback(() => setIsRitualFlowOpen(false), []);

  const addRitualToLegacy = useCallback((ritualId: string) => {
    const ritual = rituals.find((item) => item.id === ritualId);
    if (!ritual || !ritual.addToLegacyAllowed && ritual.status !== "completed" && ritual.status !== "saved") return null;
    return legacyCandidateFromSummary({ id: `legacy-ritual-${ritual.id}`, type: "ritual", title: ritual.title, summary: ritual.summary, sourceLayerIds: ritual.sourceLayerIds, tone: "grounded" });
  }, [rituals]);

  const exportRitual = useCallback((ritualId: string) => {
    const ritual = rituals.find((item) => item.id === ritualId);
    if (!ritual || (ritual.status !== "completed" && ritual.status !== "saved")) return null;
    return reviewExportCandidate({ id: `export-ritual-${ritual.id}`, type: "ritual_card", title: ritual.title, subtitle: ritual.subtitle, summary: ritual.summary, format: "png", privacyLevel: "summary_only", sourceType: "system", sourceIds: [ritual.id], sourceLayerIds: ritual.sourceLayerIds, userApproved: true }, { exportEnabled: true, shadowExportConfirmed: false, enabledLayers: { system: true, mood: true, recovery: true, memory: true, ritual: true } });
  }, [rituals]);

  const value = useMemo<UraiRitualContextValue>(() => ({ rituals, selectedRitual, activeRitual, isRitualFlowOpen, suggestForContext, startRitual, completeRitual, skipRitual, saveRitual, hideRitual, selectRitual, clearSelectedRitual, closeRitualFlow, addRitualToLegacy, exportRitual }), [activeRitual, addRitualToLegacy, clearSelectedRitual, closeRitualFlow, completeRitual, exportRitual, hideRitual, isRitualFlowOpen, rituals, saveRitual, selectedRitual, selectRitual, skipRitual, startRitual, suggestForContext]);

  return <UraiRitualContext.Provider value={value}>{children}</UraiRitualContext.Provider>;
}

export function useUraiRituals(): UraiRitualContextValue {
  const context = useContext(UraiRitualContext);
  if (!context) throw new Error("useUraiRituals must be used inside UraiRitualProvider");
  return context;
}
