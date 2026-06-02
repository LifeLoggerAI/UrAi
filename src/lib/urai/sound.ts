export type UraiSoundCue =
  | "homeAmbient"
  | "orbOpen"
  | "orbClose"
  | "memoryStarOpen"
  | "passportOpen"
  | "permissionsOpen"
  | "lifeMapTransition";

const SOUND_CUE_PATHS: Record<UraiSoundCue, string> = {
  homeAmbient: "/sounds/urai/home-ambient.mp3",
  orbOpen: "/sounds/urai/orb-open.mp3",
  orbClose: "/sounds/urai/orb-close.mp3",
  memoryStarOpen: "/sounds/urai/memory-star-open.mp3",
  passportOpen: "/sounds/urai/passport-open.mp3",
  permissionsOpen: "/sounds/urai/permissions-open.mp3",
  lifeMapTransition: "/sounds/urai/life-map-transition.mp3",
};

const audioCache = new Map<UraiSoundCue, HTMLAudioElement>();

function canPlayAudio(): boolean {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

function getAudio(cue: UraiSoundCue): HTMLAudioElement | null {
  if (!canPlayAudio()) return null;

  const cached = audioCache.get(cue);
  if (cached) return cached;

  const audio = new Audio(SOUND_CUE_PATHS[cue]);
  audio.preload = "auto";
  audio.volume = cue === "homeAmbient" ? 0.18 : 0.38;
  audio.loop = cue === "homeAmbient";
  audioCache.set(cue, audio);
  return audio;
}

export async function playUraiSound(cue: UraiSoundCue): Promise<void> {
  const audio = getAudio(cue);
  if (!audio) return;

  try {
    audio.currentTime = cue === "homeAmbient" ? audio.currentTime : 0;
    await audio.play();
  } catch {
    // Browsers can block audio before user interaction. Keep this silent for a polished UI.
  }
}

export function stopUraiSound(cue: UraiSoundCue): void {
  const audio = audioCache.get(cue);
  if (!audio) return;

  audio.pause();
  audio.currentTime = 0;
}

export function preloadUraiSounds(cues: UraiSoundCue[] = Object.keys(SOUND_CUE_PATHS) as UraiSoundCue[]): void {
  cues.forEach((cue) => {
    getAudio(cue);
  });
}
