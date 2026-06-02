export type UraiAudioCategory =
  | "ambient"
  | "orb"
  | "portal"
  | "transition"
  | "ui"
  | "notification"
  | "mood";

export type UraiAudioKey =
  | "sky-calm-loop"
  | "sky-night-loop"
  | "ground-soft-loop"
  | "orb-hum-loop"
  | "orb-wake"
  | "orb-tap"
  | "galaxy-open"
  | "mirror-open"
  | "shadow-open"
  | "legacy-open"
  | "passport-open"
  | "soft-bloom"
  | "life-map-swell"
  | "soft-tap"
  | "panel-open"
  | "panel-close"
  | "permission-toggle"
  | "gentle-chime"
  | "passport-pulse"
  | "calm-bed"
  | "heavy-bed"
  | "focused-bed"
  | "anxious-bed"
  | "hopeful-bed"
  | "recovering-bed"
  | "shadow-bed"
  | "threshold-bed"
  | "luminous-bed";

export const URAI_AUDIO_ASSETS: Record<UraiAudioKey, string> = {
  "sky-calm-loop": "/assets/audio/genesis/ambient/sky-calm-loop.mp3",
  "sky-night-loop": "/assets/audio/genesis/ambient/sky-night-loop.mp3",
  "ground-soft-loop": "/assets/audio/genesis/ambient/ground-soft-loop.mp3",
  "orb-hum-loop": "/assets/audio/genesis/orb/orb-hum-loop.mp3",
  "orb-wake": "/assets/audio/genesis/orb/orb-wake.mp3",
  "orb-tap": "/assets/audio/genesis/orb/orb-tap.mp3",
  "galaxy-open": "/assets/audio/genesis/portals/galaxy-open.mp3",
  "mirror-open": "/assets/audio/genesis/portals/mirror-open.mp3",
  "shadow-open": "/assets/audio/genesis/portals/shadow-open.mp3",
  "legacy-open": "/assets/audio/genesis/portals/legacy-open.mp3",
  "passport-open": "/assets/audio/genesis/portals/passport-open.mp3",
  "soft-bloom": "/assets/audio/genesis/transitions/soft-bloom.mp3",
  "life-map-swell": "/assets/audio/genesis/transitions/life-map-swell.mp3",
  "soft-tap": "/assets/audio/genesis/ui/soft-tap.mp3",
  "panel-open": "/assets/audio/genesis/ui/panel-open.mp3",
  "panel-close": "/assets/audio/genesis/ui/panel-close.mp3",
  "permission-toggle": "/assets/audio/genesis/ui/permission-toggle.mp3",
  "gentle-chime": "/assets/audio/genesis/notifications/gentle-chime.mp3",
  "passport-pulse": "/assets/audio/genesis/notifications/passport-pulse.mp3",
  "calm-bed": "/assets/audio/genesis/mood/calm-bed.mp3",
  "heavy-bed": "/assets/audio/genesis/mood/heavy-bed.mp3",
  "focused-bed": "/assets/audio/genesis/mood/focused-bed.mp3",
  "anxious-bed": "/assets/audio/genesis/mood/anxious-bed.mp3",
  "hopeful-bed": "/assets/audio/genesis/mood/hopeful-bed.mp3",
  "recovering-bed": "/assets/audio/genesis/mood/recovering-bed.mp3",
  "shadow-bed": "/assets/audio/genesis/mood/shadow-bed.mp3",
  "threshold-bed": "/assets/audio/genesis/mood/threshold-bed.mp3",
  "luminous-bed": "/assets/audio/genesis/mood/luminous-bed.mp3",
};

export function getAudioPath(key: UraiAudioKey | string): string | null {
  return URAI_AUDIO_ASSETS[key as UraiAudioKey] ?? null;
}
