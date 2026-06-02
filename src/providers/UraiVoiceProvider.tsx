"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useUraiAudio } from "@/providers/UraiAudioProvider";
import { uraiVoiceEngine, type UraiVoiceSettings } from "@/lib/voice/uraiVoiceEngine";

const STORAGE_KEYS = {
  voiceEnabled: "urai.voice.enabled",
  captionsEnabled: "urai.voice.captionsEnabled",
  voiceVolume: "urai.voice.volume",
  whispersEnabled: "urai.voice.whispersEnabled",
  councilNarrationEnabled: "urai.voice.councilNarrationEnabled",
} as const;

const DEFAULT_SETTINGS: UraiVoiceSettings = {
  voiceEnabled: false,
  captionsEnabled: true,
  voiceVolume: 0.8,
  whispersEnabled: false,
  councilNarrationEnabled: true,
  reducedSensoryMode: false,
};

type UraiVoiceContextValue = {
  voiceEnabled: boolean;
  captionsEnabled: boolean;
  currentCaption: string | null;
  voiceVolume: number;
  whispersEnabled: boolean;
  councilNarrationEnabled: boolean;
  playVoiceLine: (key: string, options?: { forceCaption?: boolean; priority?: "idle" | "normal" | "portal" | "council" }) => Promise<void>;
  stopVoiceLine: () => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setCaptionsEnabled: (enabled: boolean) => void;
  setVoiceVolume: (value: number) => void;
  setWhispersEnabled: (enabled: boolean) => void;
  setCouncilNarrationEnabled: (enabled: boolean) => void;
};

const UraiVoiceContext = createContext<UraiVoiceContextValue | null>(null);

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

function persist(settings: UraiVoiceSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.voiceEnabled, String(settings.voiceEnabled));
  window.localStorage.setItem(STORAGE_KEYS.captionsEnabled, String(settings.captionsEnabled));
  window.localStorage.setItem(STORAGE_KEYS.voiceVolume, String(settings.voiceVolume));
  window.localStorage.setItem(STORAGE_KEYS.whispersEnabled, String(settings.whispersEnabled));
  window.localStorage.setItem(STORAGE_KEYS.councilNarrationEnabled, String(settings.councilNarrationEnabled));
}

export function UraiVoiceProvider({ children }: { children: ReactNode }) {
  const audio = useUraiAudio();
  const [settings, setSettings] = useState<UraiVoiceSettings>(DEFAULT_SETTINGS);
  const [currentCaption, setCurrentCaption] = useState<string | null>(null);

  useEffect(() => {
    const loaded: UraiVoiceSettings = {
      voiceEnabled: readBoolean(STORAGE_KEYS.voiceEnabled, DEFAULT_SETTINGS.voiceEnabled),
      captionsEnabled: readBoolean(STORAGE_KEYS.captionsEnabled, DEFAULT_SETTINGS.captionsEnabled),
      voiceVolume: readNumber(STORAGE_KEYS.voiceVolume, DEFAULT_SETTINGS.voiceVolume),
      whispersEnabled: readBoolean(STORAGE_KEYS.whispersEnabled, DEFAULT_SETTINGS.whispersEnabled),
      councilNarrationEnabled: readBoolean(STORAGE_KEYS.councilNarrationEnabled, DEFAULT_SETTINGS.councilNarrationEnabled),
      reducedSensoryMode: audio.settings.reducedSensoryMode,
    };
    setSettings(loaded);
    uraiVoiceEngine.applySettings(loaded);
    return uraiVoiceEngine.subscribe(setCurrentCaption);
  }, [audio.settings.reducedSensoryMode]);

  useEffect(() => {
    uraiVoiceEngine.applySettings({ reducedSensoryMode: audio.settings.reducedSensoryMode });
  }, [audio.settings.reducedSensoryMode]);

  const updateSettings = useCallback((patch: Partial<UraiVoiceSettings>) => {
    setSettings((current) => {
      const next = { ...current, ...patch };
      persist(next);
      uraiVoiceEngine.applySettings(next);
      return next;
    });
  }, []);

  const setVoiceEnabled = useCallback(
    (enabled: boolean) => {
      updateSettings({ voiceEnabled: enabled });
      if (enabled) {
        void audio.unlockAudio();
        void uraiVoiceEngine.playVoiceLine("settings.voiceEnabled", { priority: "normal" });
      } else {
        uraiVoiceEngine.stopVoiceLine();
      }
    },
    [audio, updateSettings],
  );

  const value = useMemo<UraiVoiceContextValue>(() => ({
    voiceEnabled: settings.voiceEnabled,
    captionsEnabled: settings.captionsEnabled,
    currentCaption,
    voiceVolume: settings.voiceVolume,
    whispersEnabled: settings.whispersEnabled,
    councilNarrationEnabled: settings.councilNarrationEnabled,
    playVoiceLine: (key, options) => uraiVoiceEngine.playVoiceLine(key, options),
    stopVoiceLine: () => uraiVoiceEngine.stopVoiceLine(),
    setVoiceEnabled,
    setCaptionsEnabled: (captionsEnabled) => updateSettings({ captionsEnabled }),
    setVoiceVolume: (voiceVolume) => {
      uraiVoiceEngine.setVoiceVolume(voiceVolume);
      updateSettings({ voiceVolume });
    },
    setWhispersEnabled: (whispersEnabled) => updateSettings({ whispersEnabled }),
    setCouncilNarrationEnabled: (councilNarrationEnabled) => updateSettings({ councilNarrationEnabled }),
  }), [currentCaption, setVoiceEnabled, settings, updateSettings]);

  return <UraiVoiceContext.Provider value={value}>{children}</UraiVoiceContext.Provider>;
}

export function useUraiVoice(): UraiVoiceContextValue {
  const context = useContext(UraiVoiceContext);
  if (!context) throw new Error("useUraiVoice must be used inside UraiVoiceProvider");
  return context;
}
