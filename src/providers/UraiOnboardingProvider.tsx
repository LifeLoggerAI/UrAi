"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getOnboardingProfilePath } from "@/lib/firebase/firestoreCollections";
import { serializeOnboardingPreferences } from "@/lib/firebase/serializeForFirestore";
import { resolveOnboardingConflict } from "@/lib/firebase/syncConflictResolution";
import { DEFAULT_ONBOARDING_PREFERENCES, ONBOARDING_STEP_ORDER, ONBOARDING_STEPS, type OnboardingPreferences, type OnboardingStep, type OnboardingStepId } from "@/lib/onboarding/onboardingTypes";
import { useUraiAuth } from "@/providers/UraiAuthProvider";
import { useUraiCloudSync } from "@/providers/UraiCloudSyncProvider";

type UraiOnboardingContextValue = {
  preferences: OnboardingPreferences;
  isFirstRun: boolean;
  currentStep: OnboardingStep;
  startOnboarding: () => void;
  completeStep: (stepId?: OnboardingStepId) => void;
  goToStep: (stepId: OnboardingStepId) => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  applySafeDefaults: () => void;
  markSoundOffered: () => void;
  markNotificationsOffered: () => void;
};

const UraiOnboardingContext = createContext<UraiOnboardingContextValue | null>(null);
const STORAGE_KEY = "urai.onboarding.preferences";

function readPreferences(): OnboardingPreferences {
  if (typeof window === "undefined") return DEFAULT_ONBOARDING_PREFERENCES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ONBOARDING_PREFERENCES;
    return { ...DEFAULT_ONBOARDING_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ONBOARDING_PREFERENCES;
  }
}

function writePreferences(preferences: OnboardingPreferences) {
  if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

function nextStepId(current: OnboardingStepId): OnboardingStepId {
  const index = ONBOARDING_STEP_ORDER.indexOf(current);
  return ONBOARDING_STEP_ORDER[Math.min(index + 1, ONBOARDING_STEP_ORDER.length - 1)] ?? "complete";
}

export function UraiOnboardingProvider({ children }: { children: ReactNode }) {
  const auth = useUraiAuth();
  const cloud = useUraiCloudSync();
  const [preferences, setPreferences] = useState<OnboardingPreferences>(DEFAULT_ONBOARDING_PREFERENCES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readPreferences();
    setPreferences(stored);
    setHydrated(true);
    if (!auth.userId || !cloud.syncEnabled) return;
    void cloud.pullFromCloud<OnboardingPreferences>(getOnboardingProfilePath(auth.userId)).then((remote) => {
      if (!remote) return;
      const resolved = resolveOnboardingConflict(stored, remote);
      setPreferences(resolved);
      writePreferences(resolved);
    });
  }, [auth.userId, cloud]);

  const persist = useCallback((next: OnboardingPreferences) => {
    setPreferences(next);
    writePreferences(next);
    if (auth.userId && cloud.syncEnabled) {
      void cloud.pushToCloud(getOnboardingProfilePath(auth.userId), serializeOnboardingPreferences(next));
    }
  }, [auth.userId, cloud]);

  const isFirstRun = hydrated && preferences.status !== "completed" && preferences.status !== "skipped";
  const currentStep = ONBOARDING_STEPS[preferences.currentStepId] ?? ONBOARDING_STEPS.welcome;
  const startOnboarding = useCallback(() => { if (preferences.status === "completed" || preferences.status === "skipped") return; persist({ ...preferences, status: "in_progress", hasSeenWelcome: true, currentStepId: preferences.currentStepId || "welcome" }); }, [persist, preferences]);
  const completeStep = useCallback((stepId?: OnboardingStepId) => { const id = stepId ?? preferences.currentStepId; const completedStepIds = Array.from(new Set([...preferences.completedStepIds, id])); const next = nextStepId(id); if (id === "complete") { persist({ ...preferences, status: "completed", completedStepIds, currentStepId: "complete", completedAt: new Date().toISOString() }); return; } persist({ ...preferences, status: "in_progress", completedStepIds, currentStepId: next, hasSeenWelcome: true }); }, [persist, preferences]);
  const goToStep = useCallback((stepId: OnboardingStepId) => persist({ ...preferences, status: "in_progress", currentStepId: stepId, hasSeenWelcome: true }), [persist, preferences]);
  const skipOnboarding = useCallback(() => persist({ ...preferences, status: "skipped", skippedAt: new Date().toISOString(), hasSeenWelcome: true }), [persist, preferences]);
  const completeOnboarding = useCallback(() => persist({ ...preferences, status: "completed", currentStepId: "complete", completedAt: new Date().toISOString(), hasSeenWelcome: true }), [persist, preferences]);
  const resetOnboarding = useCallback(() => persist(DEFAULT_ONBOARDING_PREFERENCES), [persist]);
  const applySafeDefaults = useCallback(() => persist({ ...preferences, safeDefaultsApplied: true, status: "in_progress" }), [persist, preferences]);
  const markSoundOffered = useCallback(() => persist({ ...preferences, soundOffered: true }), [persist, preferences]);
  const markNotificationsOffered = useCallback(() => persist({ ...preferences, notificationsOffered: true }), [persist, preferences]);
  const value = useMemo<UraiOnboardingContextValue>(() => ({ preferences, isFirstRun, currentStep, startOnboarding, completeStep, goToStep, skipOnboarding, completeOnboarding, resetOnboarding, applySafeDefaults, markSoundOffered, markNotificationsOffered }), [applySafeDefaults, completeOnboarding, completeStep, currentStep, goToStep, isFirstRun, markNotificationsOffered, markSoundOffered, preferences, resetOnboarding, skipOnboarding, startOnboarding]);
  return <UraiOnboardingContext.Provider value={value}>{children}</UraiOnboardingContext.Provider>;
}

export function useUraiOnboarding(): UraiOnboardingContextValue {
  const context = useContext(UraiOnboardingContext);
  if (!context) throw new Error("useUraiOnboarding must be used inside UraiOnboardingProvider");
  return context;
}
