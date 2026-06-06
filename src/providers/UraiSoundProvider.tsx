'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  UraiSoundId, 
  UraiSoundPreference, 
  DEFAULT_URAI_SOUND_PREFERENCE, 
  getStoredSoundPreference, 
  saveStoredSoundPreference,
  playUraiSound,
  stopUraiAmbient
} from '@/lib/sound';

interface UraiSoundContextType {
  preference: UraiSoundPreference;
  setSoundEnabled: (enabled: boolean) => void;
  setAmbientEnabled: (enabled: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  playSound: (soundId: UraiSoundId) => Promise<boolean>;
  stopAmbient: () => void;
}

const UraiSoundContext = createContext<UraiSoundContextType | null>(null);

export function UraiSoundProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [preference, setPreference] = useState<UraiSoundPreference>(DEFAULT_URAI_SOUND_PREFERENCE);

  useEffect(() => {
    setPreference(getStoredSoundPreference());
  }, []);

  const updatePreference = useCallback((newPrefs: Partial<UraiSoundPreference>) => {
    const updated = { ...preference, ...newPrefs };
    setPreference(updated);
    saveStoredSoundPreference(updated);
  }, [preference]);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    updatePreference({ enabled });
    if (!enabled) {
      stopUraiAmbient();
    }
  }, [updatePreference]);

  const setAmbientEnabled = useCallback((enabled: boolean) => {
    updatePreference({ ambientEnabled: enabled });
    if (!enabled) {
      stopUraiAmbient();
    }
  }, [updatePreference]);

  const setVoiceEnabled = useCallback((enabled: boolean) => {
    updatePreference({ voiceEnabled: enabled });
  }, [updatePreference]);

  const setVolume = useCallback((volume: number) => {
    updatePreference({ volume });
  }, [updatePreference]);

  const playSound = useCallback(async (soundId: UraiSoundId) => {
    return playUraiSound(soundId, preference);
  }, [preference]);

  const stopAmbient = useCallback(() => {
    stopUraiAmbient();
  }, []);

  const value = {
    preference,
    setSoundEnabled,
    setAmbientEnabled,
    setVoiceEnabled,
    setVolume,
    playSound,
    stopAmbient,
  };

  return <UraiSoundContext.Provider value={value}>{children}</UraiSoundContext.Provider>;
}

export function useUraiSound(): UraiSoundContextType {
  const context = useContext(UraiSoundContext);
  if (!context) {
    return {
      preference: DEFAULT_URAI_SOUND_PREFERENCE,
      setSoundEnabled: () => {},
      setAmbientEnabled: () => {},
      setVoiceEnabled: () => {},
      setVolume: () => {},
      playSound: async () => false,
      stopAmbient: () => {},
    };
  }
  return context;
}
