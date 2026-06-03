"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getExportArtifactsPath } from "@/lib/firebase/firestoreCollections";
import { serializeExportArtifact } from "@/lib/firebase/serializeForFirestore";
import { reviewExportCandidate } from "@/lib/exports/buildPermissionedExport";
import type { ExportArtifact, ExportCandidate, ExportReviewResult } from "@/lib/exports/exportTypes";
import { useUraiAuth } from "@/providers/UraiAuthProvider";
import { useUraiCloudSync } from "@/providers/UraiCloudSyncProvider";

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
const LOCAL_ARTIFACTS_KEY = "urai.export.artifacts.local";

function createProfile() {
  return { exportEnabled: true, legacyExportEnabled: false, shadowExportConfirmed: false, permissionVersion: 1, enabledLayers: { system: true, passport: true, memory: true, legacy: true, mood: true, recovery: true, ritual: true } };
}

function readLocalArtifacts(): ExportArtifact[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_ARTIFACTS_KEY) ?? "[]") as ExportArtifact[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalArtifacts(artifacts: ExportArtifact[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(LOCAL_ARTIFACTS_KEY, JSON.stringify(artifacts.slice(0, 20)));
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
  const auth = useUraiAuth();
  const cloud = useUraiCloudSync();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [currentReview, setCurrentReview] = useState<ExportReviewResult | null>(null);
  const [exportedArtifacts, setExportedArtifacts] = useState<ExportArtifact[]>([]);

  useEffect(() => {
    const local = readLocalArtifacts();
    setExportedArtifacts(local);
    if (!auth.userId || !cloud.syncEnabled) return;
    void cloud.pullFromCloud<ExportArtifact[]>(getExportArtifactsPath(auth.userId)).then((remote) => {
      if (remote?.length) {
        const merged = [...remote, ...local.filter((artifact) => !remote.some((item) => item.id === artifact.id))].slice(0, 20);
        setExportedArtifacts(merged);
        writeLocalArtifacts(merged);
      }
    });
  }, [auth.userId, cloud]);

  const syncArtifacts = useCallback((artifacts: ExportArtifact[]) => {
    writeLocalArtifacts(artifacts);
    if (!auth.userId || !cloud.syncEnabled) return;
    const safe = artifacts.filter((artifact) => artifact.exportAllowed && artifact.userApproved).map(serializeExportArtifact);
    void cloud.pushToCloud(getExportArtifactsPath(auth.userId), safe);
  }, [auth.userId, cloud]);

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
    setExportedArtifacts((current) => {
      const next = [currentReview.artifact, ...current.filter((artifact) => artifact.id !== currentReview.artifact.id)].slice(0, 20);
      syncArtifacts(next);
      return next;
    });
  }, [currentReview, syncArtifacts]);

  const value = useMemo<UraiExportContextValue>(() => ({ isExportOpen, currentReview, exportedArtifacts, openExport, closeExport, reviewCandidate, approveCurrentExport, clearCurrentReview }), [approveCurrentExport, clearCurrentReview, closeExport, currentReview, exportedArtifacts, isExportOpen, openExport, reviewCandidate]);
  return <UraiExportContext.Provider value={value}>{children}</UraiExportContext.Provider>;
}

export function useUraiExport(): UraiExportContextValue { const context = useContext(UraiExportContext); if (!context) throw new Error("useUraiExport must be used inside UraiExportProvider"); return context; }
