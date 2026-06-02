"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { uraiAudioEngine, type UraiAudioCategory, type UraiAudioKey, type UraiAudioSettings } from "@/lib/audio/uraiAudioEngine";

const STORAGE_KEYS = {
  enabled: "urai.audio.enabled",
  masterVolume: "urai.audio.masterVolume",
  ambientVolume: "urai.audio.ambientVolume",
  effectsVolume: "urai.audio.effectsVolume",
  voiceVolume: "urai.audio.voiceVolume",
  hapticsEnabled: "urai.audio.hapticsEnabled",
  reducedSensoryMode: "urai.audio.reducedSensoryMode",
} as const;

const DEFAULT_SETTINGS: UraiAudioSettings = {
  enabled: false,
  masterVolume: 0.65,
  ambientVolume: 0.35,
  effectsVolume: 0.55,
  voiceVolume: 0.8,
  hapticsEnabled: true,
  reducedSensoryMode: false,
};

type UraiAudioContextValue = {
  settings: UraiAudioSettings;
  isUnlocked: boolean;
  unlockAudio: () => Promise<void>;
  playOneShot: (key: UraiAudioKey | string, options?: { volume?: number; category?: UraiAudioCategory }) => Promise<void>;
  playLoop: (key: UraiAudioKey | string, options?: { volume?: number; category?: UraiAudioCategory; fadeMs?: number }) => Promise<void>;
  stopLoop: (key: UraiAudioKey | string, options?: { fadeMs?: number }) => Promise<void>;
  crossfadeMood: (fromKey: UraiAudioKey | string, toKey: UraiAudioKey | string, options?: { durationMs?: number; toVolume?: number }) => Promise<void>;
  setAudioEnabled: (enabled: boolean) => void;
  setMasterVolume: (value: number) => void;
  setAmbientVolume: (value: number) => void;
  setEffectsVolume: (value: number) => void;
  setVoiceVolume: (value: number) => void;
  setReducedSensoryMode: (enabled: boolean) => void;
  setHapticsEnabled: (enabled: boolean) => void;
};

const UraiAudioContext = createContext<UraiAudioContextValue | null>(null);

function readBoolean(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key);
  if (value === null) return fallback;
  return value === "true";
}

function readNumber(key: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const value = Number(window.localStorage.getItem(key));
  return Number.isFinite(value) ? value : fallback;
}

function persist(settings: UraiAudioSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.enabled, String(settings.enabled));
  window.localStorage.setItem(STORAGE_KEYS.masterVolume, String(settings.masterVolume));
  window.localStorage.setItem(STORAGE_KEYS.ambientVolume, String(settings.ambientVolume));
  window.localStorage.setItem(STORAGE_KEYS.effectsVolume, String(settings.effectsVolume));
  window.localStorage.setItem(STORAGE_KEYS.voiceVolume, String(settings.voiceVolume));
  window.localStorage.setItem(STORAGE_KEYS.hapticsEnabled, String(settings.hapticsEnabled));
  window.localStorage.setItem(STORAGE_KEYS.reducedSensoryMode, String(settings.reducedSensoryMode));
}

export function UraiAudioProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UraiAudioSettings>(DEFAULT_SETTINGS);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const loaded: UraiAudioSettings = {
      enabled: readBoolean(STORAGE_KEYS.enabled, DEFAULT_SETTINGS.enabled),
      masterVolume: readNumber(STORAGE_KEYS.masterVolume, DEFAULT_SETTINGS.masterVolume),
      ambientVolume: readNumber(STORAGE_KEYS.ambientVolume, DEFAULT_SETTINGS.ambientVolume),
      effectsVolume: readNumber(STORAGE_KEYS.effectsVolume, DEFAULT_SETTINGS.effectsVolume),
      voiceVolume: readNumber(STORAGE_KEYS.voiceVolume, DEFAULT_SETTINGS.voiceVolume),
      hapticsEnabled: readBoolean(STORAGE_KEYS.hapticsEnabled, DEFAULT_SETTINGS.hapticsEnabled),
      reducedSensoryMode: readBoolean(STORAGE_KEYS.reducedSensoryMode, DEFAULT_SETTINGS.reducedSensoryMode),
    };
    setSettings(loaded);
    uraiAudioEngine.applySettings(loaded);
    void uraiAudioEngine.init();
  }, []);

  const updateSettings = useCallback((patch: Partial<UraiAudioSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      persist(next);
      uraiAudioEngine.applySettings(next);
      return next;
    });
  }, []);

  const unlockAudio = useCallback(async () => {
    await uraiAudioEngine.unlock();
    setIsUnlocked(uraiAudioEngine.isUnlocked());
    if (settings.enabled) {
      await uraiAudioEngine.playOneShot("orb-wake", { category: "orb", volume: 0.32 });
    }
  }, [settings.enabled]);

  const value = useMemo<UraiAudioContextValue>(() => ({
    settings,
    isUnlocked,
    unlockAudio,
    playOneShot: (key, options) => uraiAudioEngine.playOneShot(key, options),
    playLoop: (key, options) => uraiAudioEngine.playLoop(key, options),
    stopLoop: (key, options) => uraiAudioEngine.stopLoop(key, options),
    crossfadeMood: (fromKey, toKey, options) => uraiAudioEngine.crossfadeLoop(fromKey, toKey, { ...options, category: "mood" }),
    setAudioEnabled: (enabled) => updateSettings({ enabled }),
    setMasterVolume: (masterVolume) => {
      uraiAudioEngine.setMasterVolume(masterVolume);
      updateSettings({ masterVolume });
    },
    setAmbientVolume: (ambientVolume) => updateSettings({ ambientVolume }),
    setEffectsVolume: (effectsVolume) => updateSettings({ effectsVolume }),
    setVoiceVolume: (voiceVolume) => updateSettings({ voiceVolume }),
    setReducedSensoryMode: (reducedSensoryMode) => updateSettings({ reducedSensoryMode }),
    setHapticsEnabled: (hapticsEnabled) => updateSettings({ hapticsEnabled }),
  }), [isUnlocked, settings, unlockAudio, updateSettings]);

  return <UraiAudioContext.Provider value={value}>{children}</UraiAudioContext.Provider>;
}

export function useUraiAudio(): UraiAudioContextValue {
  const context = useContext(UraiAudioContext);
  if (!context) {
    throw new Error("useUraiAudio must be used inside UraiAudioProvider");
  }
  return context;
}
