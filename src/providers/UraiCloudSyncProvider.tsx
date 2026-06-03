"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getSyncStatePath } from "@/lib/firebase/firestoreCollections";
import { getUraiFirebaseClient } from "@/lib/firebase/firebaseClient";
import type { FirebaseSyncStatus, UraiSyncResult } from "@/lib/firebase/firebaseTypes";
import { CURRENT_SCHEMA_VERSION } from "@/lib/firebase/schemaVersions";
import { useUraiAuth } from "@/providers/UraiAuthProvider";

type UraiCloudSyncContextValue = {
  syncEnabled: boolean;
  syncStatus: FirebaseSyncStatus;
  lastSyncedAt: string | null;
  enableCloudSync: () => Promise<UraiSyncResult>;
  disableCloudSync: () => void;
  syncNow: () => Promise<UraiSyncResult>;
  pullFromCloud: <T>(path: string) => Promise<T | null>;
  pushToCloud: <T>(path: string, data: T) => Promise<UraiSyncResult>;
  resolveConflict: <T>(local: T, remote: T, resolver?: (local: T, remote: T) => T) => T;
};

const UraiCloudSyncContext = createContext<UraiCloudSyncContextValue | null>(null);
const ENABLED_KEY = "urai.cloudSync.enabled";
const LAST_SYNC_KEY = "urai.cloudSync.lastSyncedAt";

function readEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ENABLED_KEY) === "true";
}

function readLastSyncedAt(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LAST_SYNC_KEY);
}

function writeLocal(enabled: boolean, lastSyncedAt?: string | null) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ENABLED_KEY, String(enabled));
  if (lastSyncedAt) window.localStorage.setItem(LAST_SYNC_KEY, lastSyncedAt);
}

export function UraiCloudSyncProvider({ children }: { children: ReactNode }) {
  const auth = useUraiAuth();
  const client = getUraiFirebaseClient();
  const [syncEnabled, setSyncEnabled] = useState(readEnabled);
  const [syncStatus, setSyncStatus] = useState<FirebaseSyncStatus>(client.db ? "idle" : "offline");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(readLastSyncedAt);

  const canSync = Boolean(client.db && auth.userId && syncEnabled);

  const pushToCloud = useCallback(async <T,>(path: string, data: T): Promise<UraiSyncResult> => {
    if (!client.db || !auth.userId || !syncEnabled) return { ok: false, status: "offline" };
    setSyncStatus("saving");
    try {
      const now = new Date().toISOString();
      await setDoc(doc(client.db, path), { id: path.split("/").pop() ?? "profile", userId: auth.userId, data, updatedAt: now, createdAt: now, schemaVersion: CURRENT_SCHEMA_VERSION }, { merge: true });
      setSyncStatus("synced");
      setLastSyncedAt(now);
      writeLocal(syncEnabled, now);
      return { ok: true, status: "synced" };
    } catch {
      setSyncStatus("error");
      return { ok: false, status: "error", errorMessage: "Cloud sync is unavailable right now." };
    }
  }, [auth.userId, client.db, syncEnabled]);

  const pullFromCloud = useCallback(async <T,>(path: string): Promise<T | null> => {
    if (!client.db || !auth.userId || !syncEnabled) return null;
    setSyncStatus("loading");
    try {
      const snap = await getDoc(doc(client.db, path));
      setSyncStatus("synced");
      if (!snap.exists()) return null;
      const value = snap.data() as { data?: T };
      return value.data ?? (value as T);
    } catch {
      setSyncStatus("error");
      return null;
    }
  }, [auth.userId, client.db, syncEnabled]);

  const syncNow = useCallback(async (): Promise<UraiSyncResult> => {
    if (!client.db || !auth.userId || !syncEnabled) return { ok: false, status: "offline" };
    const now = new Date().toISOString();
    return pushToCloud(getSyncStatePath(auth.userId), { lastRequestedAt: now, syncEnabled: true });
  }, [auth.userId, client.db, pushToCloud, syncEnabled]);

  const enableCloudSync = useCallback(async (): Promise<UraiSyncResult> => {
    if (!client.db || !auth.userId) {
      setSyncEnabled(false);
      setSyncStatus("offline");
      return { ok: false, status: "offline" };
    }
    setSyncEnabled(true);
    writeLocal(true);
    const now = new Date().toISOString();
    return pushToCloud(getSyncStatePath(auth.userId), { enabledAt: now, syncEnabled: true });
  }, [auth.userId, client.db, pushToCloud]);

  const disableCloudSync = useCallback(() => {
    setSyncEnabled(false);
    setSyncStatus(client.db ? "idle" : "offline");
    writeLocal(false);
  }, [client.db]);

  const resolveConflict = useCallback(<T,>(local: T, remote: T, resolver?: (local: T, remote: T) => T): T => resolver ? resolver(local, remote) : local, []);

  const value = useMemo<UraiCloudSyncContextValue>(() => ({ syncEnabled: canSync, syncStatus, lastSyncedAt, enableCloudSync, disableCloudSync, syncNow, pullFromCloud, pushToCloud, resolveConflict }), [canSync, disableCloudSync, enableCloudSync, lastSyncedAt, pullFromCloud, pushToCloud, resolveConflict, syncNow, syncStatus]);

  return <UraiCloudSyncContext.Provider value={value}>{children}</UraiCloudSyncContext.Provider>;
}

export function useUraiCloudSync(): UraiCloudSyncContextValue {
  const context = useContext(UraiCloudSyncContext);
  if (!context) throw new Error("useUraiCloudSync must be used inside UraiCloudSyncProvider");
  return context;
}
