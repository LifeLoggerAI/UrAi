"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { reviewExportCandidate } from "@/lib/exports/buildPermissionedExport";
import type { ExportArtifact, ExportCandidate, ExportReviewResult } from "@/lib/exports/exportTypes";

type UraiExportContextValue = {
  isExportOpen: boolean;
  currentReview: ExportReviewResult | null;
  exportedArtifacts: ExportArtifact[];
  openExport: (candidate?: ExportCandidate) => void;
  closeExport: () => void;
  reviewCandidate: (candidate: ExportCandidate) => ExportReviewResult;
  approveCurrentExport: () => void;
  clearCurrentReview: () => void;
};

const UraiExportContext = createContext<UraiExportContextValue | null>(null);
const LAST_VIEW_KEY = "urai.export.lastView";

function createProfile() {
  return {
    exportEnabled: true,
    legacyExportEnabled: false,
    shadowExportConfirmed: false,
    permissionVersion: 1,
    enabledLayers: { system: true, passport: true, memory: true, legacy: true, mood: true, recovery: true, ritual: true },
  };
}

const defaultCandidate: ExportCandidate = {
  id: "export-safe-preview",
  type: "legacy_scroll",
  title: "Safe Export Preview",
  subtitle: "Summary only",
  summary: "This preview shows how an approved artifact can look without exposing private source data.",
  format: "png",
  privacyLevel: "summary_only",
  sourceType: "system",
  sourceIds: ["safe-preview"],
  sourceLayerIds: ["system"],
  userApproved: true,
};

export function UraiExportProvider({ children }: { children: ReactNode }) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<ExportReviewResult | null>(null);
  const [exportedArtifacts, setExportedArtifacts] = useState<ExportArtifact[]>([]);

  const reviewCandidate = useCallback((candidate: ExportCandidate) => {
    const review = reviewExportCandidate(candidate, createProfile());
    setCurrentReview(review);
    return review;
  }, []);

  const openExport = useCallback((candidate?: ExportCandidate) => {
    setIsExportOpen(true);
    reviewCandidate(candidate ?? defaultCandidate);
    if (typeof window !== "undefined") window.localStorage.setItem(LAST_VIEW_KEY, "scrolls");
  }, [reviewCandidate]);

  const closeExport = useCallback(() => setIsExportOpen(false), []);
  const clearCurrentReview = useCallback(() => setCurrentReview(null), []);

  const approveCurrentExport = useCallback(() => {
    if (!currentReview?.canExport) return;
    setExportedArtifacts((current) => [currentReview.artifact, ...current]);
  }, [currentReview]);

  const value = useMemo<UraiExportContextValue>(() => ({ isExportOpen, currentReview, exportedArtifacts, openExport, closeExport, reviewCandidate, approveCurrentExport, clearCurrentReview }), [approveCurrentExport, clearCurrentReview, closeExport, currentReview, exportedArtifacts, isExportOpen, openExport, reviewCandidate]);

  return <UraiExportContext.Provider value={value}>{children}</UraiExportContext.Provider>;
}

export function useUraiExport(): UraiExportContextValue {
  const context = useContext(UraiExportContext);
  if (!context) throw new Error("useUraiExport must be used inside UraiExportProvider");
  return context;
}
