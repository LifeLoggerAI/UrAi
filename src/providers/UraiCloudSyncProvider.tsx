"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getSyncStatePath } from "@/lib/firebase/firestoreCollections";
import { getUraiFirebaseClient } from "@/lib/firebase/firebaseClient";
import type { FirebaseSyncStatus, UraiSyncResult } from "@/lib/firebase/firebaseTypes";
import { CURRENT_SCHEMA_VERSION } from "@/lib/firebase/schemaVersions";
import { readUserScopedValue, writeUserScopedValue } from "@/lib/storage/userScopedStorage";
import { useUraiAuth } from "@/providers/UraiAuthProvider";

type UraiCloudSyncContextValue = {
  syncEnabled: boolean;
  syncRequested: boolean;
  syncStatus: FirebaseSyncStatus;
  lastSyncedAt: string | null;
  needsAccountForSync: boolean;
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
const SYNC_PRIVACY_COPY = "Sync copies only approved URAI state to your account. Passport still controls sensitive layers.";

export function UraiCloudSyncProvider({ children }: { children: ReactNode }) {
  const auth = useUraiAuth();
  const client = getUraiFirebaseClient();
  const [syncRequested, setSyncRequested] = useState(false);
  const [syncStatus, setSyncStatus] = useState<FirebaseSyncStatus>(client.db ? "idle" : "offline");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    const userId = auth.userId ?? "local";
    setSyncRequested(readUserScopedValue<boolean>(ENABLED_KEY, userId, false) === true);
    setLastSyncedAt(readUserScopedValue<string>(LAST_SYNC_KEY, userId, null));
    if (!client.db) setSyncStatus("offline");
  }, [auth.userId, client.db]);

  const canSync = Boolean(client.db && auth.userId && auth.isAuthenticated && !auth.isLocalOnly && syncRequested);
  const needsAccountForSync = Boolean(syncRequested && (!auth.isAuthenticated || auth.isLocalOnly));

  const writeLocal = useCallback((enabled: boolean, syncedAt?: string | null) => {
    const userId = auth.userId ?? "local";
    writeUserScopedValue(ENABLED_KEY, userId, enabled);
    if (syncedAt) writeUserScopedValue(LAST_SYNC_KEY, userId, syncedAt);
  }, [auth.userId]);

  const pushToCloud = useCallback(async <T,>(path: string, data: T): Promise<UraiSyncResult> => {
    if (!client.db || !auth.userId || !auth.isAuthenticated || auth.isLocalOnly || !syncRequested) {
      return { ok: false, status: needsAccountForSync ? "idle" : "offline", errorMessage: needsAccountForSync ? "Sign in only if you want cloud sync." : undefined };
    }
    setSyncStatus("saving");
    try {
      const now = new Date().toISOString();
      await setDoc(doc(client.db, path), { id: path.split("/").pop() ?? "profile", userId: auth.userId, data, updatedAt: now, createdAt: now, schemaVersion: CURRENT_SCHEMA_VERSION, syncScope: "approved-safe-state", privacyReminder: SYNC_PRIVACY_COPY }, { merge: true });
      setSyncStatus("synced");
      setLastSyncedAt(now);
      writeLocal(true, now);
      await auth.updateProfile({ cloudSyncEnabled: true });
      return { ok: true, status: "synced" };
    } catch {
      setSyncStatus("error");
      return { ok: false, status: "error", errorMessage: "Cloud sync is unavailable right now." };
    }
  }, [auth, client.db, needsAccountForSync, syncRequested, writeLocal]);

  const pullFromCloud = useCallback(async <T,>(path: string): Promise<T | null> => {
    if (!client.db || !auth.userId || !auth.isAuthenticated || auth.isLocalOnly || !syncRequested) return null;
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
  }, [auth.isAuthenticated, auth.isLocalOnly, auth.userId, client.db, syncRequested]);

  const syncNow = useCallback(async (): Promise<UraiSyncResult> => {
    if (!auth.userId) return { ok: false, status: "offline" };
    const now = new Date().toISOString();
    return pushToCloud(getSyncStatePath(auth.userId), { lastRequestedAt: now, syncEnabled: true, reminder: SYNC_PRIVACY_COPY });
  }, [auth.userId, pushToCloud]);

  const enableCloudSync = useCallback(async (): Promise<UraiSyncResult> => {
    setSyncRequested(true);
    writeLocal(true);
    if (!client.db) {
      setSyncStatus("offline");
      return { ok: false, status: "offline", errorMessage: "Cloud sync is unavailable right now." };
    }
    if (!auth.userId || !auth.isAuthenticated || auth.isLocalOnly) {
      setSyncStatus("idle");
      return { ok: false, status: "idle", errorMessage: "Sign in only if you want cloud sync." };
    }
    const now = new Date().toISOString();
    return pushToCloud(getSyncStatePath(auth.userId), { enabledAt: now, syncEnabled: true, passportReminder: SYNC_PRIVACY_COPY, sensitiveDefaults: "Shadow, Legacy, Companion memory, Export file upload, health, Gmail, calendar, transcripts, and location remain closed unless Passport opens them." });
  }, [auth.isAuthenticated, auth.isLocalOnly, auth.userId, client.db, pushToCloud, writeLocal]);

  const disableCloudSync = useCallback(() => {
    setSyncRequested(false);
    setSyncStatus(client.db ? "idle" : "offline");
    writeLocal(false);
    void auth.updateProfile({ cloudSyncEnabled: false });
  }, [auth, client.db, writeLocal]);

  const resolveConflict = useCallback(<T,>(local: T, remote: T, resolver?: (local: T, remote: T) => T): T => resolver ? resolver(local, remote) : local, []);

  const value = useMemo<UraiCloudSyncContextValue>(() => ({ syncEnabled: canSync, syncRequested, syncStatus, lastSyncedAt, needsAccountForSync, enableCloudSync, disableCloudSync, syncNow, pullFromCloud, pushToCloud, resolveConflict }), [canSync, disableCloudSync, enableCloudSync, lastSyncedAt, needsAccountForSync, pullFromCloud, pushToCloud, resolveConflict, syncNow, syncRequested, syncStatus]);

  return <UraiCloudSyncContext.Provider value={value}>{children}</UraiCloudSyncContext.Provider>;
}

export function useUraiCloudSync(): UraiCloudSyncContextValue {
  const context = useContext(UraiCloudSyncContext);
  if (!context) throw new Error("useUraiCloudSync must be used inside UraiCloudSyncProvider");
  return context;
}
