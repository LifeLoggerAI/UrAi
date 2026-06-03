"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getSettingsProfilePath } from "@/lib/firebase/firestoreCollections";
import { serializeSettingsProfile } from "@/lib/firebase/serializeForFirestore";
import { resolveSettingsConflict } from "@/lib/firebase/syncConflictResolution";
import { DEFAULT_SETTINGS_PROFILE, type SettingsSectionId, type UraiSettingsProfile } from "@/lib/settings/settingsTypes";
import { useUraiAuth } from "@/providers/UraiAuthProvider";
import { useUraiCloudSync } from "@/providers/UraiCloudSyncProvider";

type UraiSettingsContextValue = {
  settingsProfile: UraiSettingsProfile;
  activeSection: SettingsSectionId;
  isSettingsOpen: boolean;
  openSettings: (section?: SettingsSectionId) => void;
  closeSettings: () => void;
  setActiveSection: (section: SettingsSectionId) => void;
  setReducedSensoryMode: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setAmbientAnimationEnabled: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  resetSettingsProfile: () => void;
};

const UraiSettingsContext = createContext<UraiSettingsContextValue | null>(null);
const STORAGE_KEY = "urai.settings.profile";

function withTimestamp(profile: UraiSettingsProfile): UraiSettingsProfile {
  const now = new Date().toISOString();
  return { ...profile, updatedAt: now, controlState: { ...profile.controlState, lastUpdatedAt: now } };
}

function readProfile(): UraiSettingsProfile {
  if (typeof window === "undefined") return DEFAULT_SETTINGS_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return withTimestamp(DEFAULT_SETTINGS_PROFILE);
    return { ...DEFAULT_SETTINGS_PROFILE, ...JSON.parse(raw) };
  } catch {
    return withTimestamp(DEFAULT_SETTINGS_PROFILE);
  }
}

function writeProfile(profile: UraiSettingsProfile) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function UraiSettingsProvider({ children }: { children: ReactNode }) {
  const auth = useUraiAuth();
  const cloud = useUraiCloudSync();
  const [settingsProfile, setSettingsProfile] = useState<UraiSettingsProfile>(() => withTimestamp(DEFAULT_SETTINGS_PROFILE));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const local = readProfile();
    setSettingsProfile(local);
    if (!auth.userId || !cloud.syncEnabled) return;
    void cloud.pullFromCloud<UraiSettingsProfile>(getSettingsProfilePath(auth.userId)).then((remote) => {
      if (!remote) return;
      const resolved = resolveSettingsConflict(local, remote);
      setSettingsProfile(resolved);
      writeProfile(resolved);
    });
  }, [auth.userId, cloud]);

  const persist = useCallback((next: UraiSettingsProfile) => {
    const stamped = withTimestamp(next);
    setSettingsProfile(stamped);
    writeProfile(stamped);
    if (auth.userId && cloud.syncEnabled) {
      void cloud.pushToCloud(getSettingsProfilePath(auth.userId), serializeSettingsProfile(stamped));
    }
  }, [auth.userId, cloud]);

  const openSettings = useCallback((section?: SettingsSectionId) => { setIsSettingsOpen(true); if (section) persist({ ...settingsProfile, activeSection: section }); }, [persist, settingsProfile]);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
  const setActiveSection = useCallback((section: SettingsSectionId) => persist({ ...settingsProfile, activeSection: section }), [persist, settingsProfile]);
  const setReducedSensoryMode = useCallback((enabled: boolean) => persist({ ...settingsProfile, controlState: { ...settingsProfile.controlState, reducedSensoryMode: enabled, hapticsEnabled: enabled ? false : settingsProfile.controlState.hapticsEnabled, ambientAnimationEnabled: enabled ? false : settingsProfile.controlState.ambientAnimationEnabled } }), [persist, settingsProfile]);
  const setReducedMotion = useCallback((enabled: boolean) => persist({ ...settingsProfile, controlState: { ...settingsProfile.controlState, reducedMotion: enabled } }), [persist, settingsProfile]);
  const setHighContrast = useCallback((enabled: boolean) => persist({ ...settingsProfile, controlState: { ...settingsProfile.controlState, highContrast: enabled } }), [persist, settingsProfile]);
  const setAmbientAnimationEnabled = useCallback((enabled: boolean) => persist({ ...settingsProfile, controlState: { ...settingsProfile.controlState, ambientAnimationEnabled: enabled } }), [persist, settingsProfile]);
  const setHapticsEnabled = useCallback((enabled: boolean) => persist({ ...settingsProfile, controlState: { ...settingsProfile.controlState, hapticsEnabled: enabled } }), [persist, settingsProfile]);
  const resetSettingsProfile = useCallback(() => persist(DEFAULT_SETTINGS_PROFILE), [persist]);

  const value = useMemo<UraiSettingsContextValue>(() => ({ settingsProfile, activeSection: settingsProfile.activeSection, isSettingsOpen, openSettings, closeSettings, setActiveSection, setReducedSensoryMode, setReducedMotion, setHighContrast, setAmbientAnimationEnabled, setHapticsEnabled, resetSettingsProfile }), [closeSettings, isSettingsOpen, openSettings, resetSettingsProfile, setActiveSection, setAmbientAnimationEnabled, setHapticsEnabled, setHighContrast, setReducedMotion, setReducedSensoryMode, settingsProfile]);

  return <UraiSettingsContext.Provider value={value}>{children}</UraiSettingsContext.Provider>;
}

export function useUraiSettings(): UraiSettingsContextValue {
  const context = useContext(UraiSettingsContext);
  if (!context) throw new Error("useUraiSettings must be used inside UraiSettingsProvider");
  return context;
}
