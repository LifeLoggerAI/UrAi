import { UraiSoundId, UraiSoundPreference } from "./soundTypes";
import { getUraiSound } from "./soundRegistry";

const PREFERENCE_KEY = "urai.sound.preference";
let ambientAudio: HTMLAudioElement | null = null;

export const DEFAULT_URAI_SOUND_PREFERENCE: UraiSoundPreference = {
  enabled: false,
  ambientEnabled: false,
  voiceEnabled: false,
  volume: 0.35,
};

export function getStoredSoundPreference(): UraiSoundPreference {
  if (typeof window === "undefined") {
    return DEFAULT_URAI_SOUND_PREFERENCE;
  }
  try {
    const stored = localStorage.getItem(PREFERENCE_KEY);
    if (stored) {
      return { ...DEFAULT_URAI_SOUND_PREFERENCE, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error("Could not get stored sound preference", error);
  }
  return DEFAULT_URAI_SOUND_PREFERENCE;
}

export function saveStoredSoundPreference(preference: UraiSoundPreference): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFERENCE_KEY, JSON.stringify(preference));
  } catch (error) {
    console.error("Could not save sound preference", error);
  }
}

export async function playUraiSound(
  soundId: UraiSoundId,
  preference?: Partial<UraiSoundPreference>
): Promise<boolean> {
  const prefs = { ...getStoredSoundPreference(), ...preference };
  const soundDef = getUraiSound(soundId);

  if (typeof window === "undefined" || !soundDef || !prefs.enabled) {
    return false;
  }

  if (soundDef.category === "ambient" && !prefs.ambientEnabled) {
    return false;
  }

  try {
    if (soundDef.loop) {
      if (ambientAudio && !ambientAudio.paused) {
        ambientAudio.pause();
      }
      ambientAudio = new Audio(soundDef.src);
      ambientAudio.loop = true;
      ambientAudio.volume = soundDef.defaultVolume * prefs.volume;
      await ambientAudio.play();
    } else {
      const audio = new Audio(soundDef.src);
      audio.volume = soundDef.defaultVolume * prefs.volume;
      await audio.play();
    }
    return true;
  } catch (error) {
    console.error(`Could not play sound: ${soundId}`, error);
    return false;
  }
}

export function stopUraiAmbient(): void {
  if (ambientAudio) {
    ambientAudio.pause();
    ambientAudio = null;
  }
}
