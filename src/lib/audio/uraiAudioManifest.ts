export type UraiAudioCategory =
  | "ambient"
  | "orb"
  | "portal"
  | "transition"
  | "ui"
  | "notification"
  | "mood";

export type UraiAudioFallback = "noop";

export type UraiAudioKey =
  | "sky-calm-loop"
  | "sky-night-loop"
  | "sky-soft-wind-loop"
  | "ground-soft-loop"
  | "ground-root-hum-loop"
  | "orb-hum-loop"
  | "orb-wake"
  | "orb-tap"
  | "orb-thinking-soft"
  | "orb-close"
  | "galaxy-open"
  | "mirror-open"
  | "shadow-open"
  | "legacy-open"
  | "passport-open"
  | "settings-open"
  | "soft-bloom"
  | "life-map-swell"
  | "ground-open-bloom"
  | "mirror-ripple"
  | "shadow-soft-gate"
  | "legacy-scroll-open"
  | "soft-tap"
  | "panel-open"
  | "panel-close"
  | "permission-toggle"
  | "confirm-soft"
  | "dismiss-soft"
  | "gentle-chime"
  | "passport-pulse"
  | "recovery-bloom"
  | "ritual-ready"
  | "export-ready"
  | "calm-bed"
  | "heavy-bed"
  | "focused-bed"
  | "anxious-bed"
  | "hopeful-bed"
  | "recovering-bed"
  | "shadow-bed"
  | "threshold-bed"
  | "luminous-bed";

export type UraiAudioAsset = {
  key: UraiAudioKey;
  path: string;
  category: UraiAudioCategory;
  loop: boolean;
  defaultVolume: number;
  critical: boolean;
  lazy: boolean;
  fallback: UraiAudioFallback;
};

export const URAI_AUDIO_MANIFEST: Record<UraiAudioKey, UraiAudioAsset> = {
  "sky-calm-loop": { key: "sky-calm-loop", path: "/assets/audio/genesis/ambient/sky-calm-loop.wav", category: "ambient", loop: true, defaultVolume: 0.24, critical: false, lazy: true, fallback: "noop" },
  "sky-night-loop": { key: "sky-night-loop", path: "/assets/audio/genesis/ambient/sky-night-loop.wav", category: "ambient", loop: true, defaultVolume: 0.2, critical: false, lazy: true, fallback: "noop" },
  "sky-soft-wind-loop": { key: "sky-soft-wind-loop", path: "/assets/audio/genesis/ambient/sky-soft-wind-loop.wav", category: "ambient", loop: true, defaultVolume: 0.18, critical: false, lazy: true, fallback: "noop" },
  "ground-soft-loop": { key: "ground-soft-loop", path: "/assets/audio/genesis/ambient/ground-soft-loop.wav", category: "ambient", loop: true, defaultVolume: 0.14, critical: false, lazy: true, fallback: "noop" },
  "ground-root-hum-loop": { key: "ground-root-hum-loop", path: "/assets/audio/genesis/ground/ground-root-hum-loop.wav", category: "ambient", loop: true, defaultVolume: 0.12, critical: false, lazy: true, fallback: "noop" },
  "orb-hum-loop": { key: "orb-hum-loop", path: "/assets/audio/genesis/orb/orb-hum-loop.wav", category: "orb", loop: true, defaultVolume: 0.14, critical: false, lazy: true, fallback: "noop" },
  "orb-wake": { key: "orb-wake", path: "/assets/audio/genesis/orb/orb-wake.wav", category: "orb", loop: false, defaultVolume: 0.3, critical: false, lazy: true, fallback: "noop" },
  "orb-tap": { key: "orb-tap", path: "/assets/audio/genesis/orb/orb-tap.wav", category: "orb", loop: false, defaultVolume: 0.32, critical: false, lazy: true, fallback: "noop" },
  "orb-thinking-soft": { key: "orb-thinking-soft", path: "/assets/audio/genesis/orb/orb-thinking-soft.wav", category: "orb", loop: false, defaultVolume: 0.18, critical: false, lazy: true, fallback: "noop" },
  "orb-close": { key: "orb-close", path: "/assets/audio/genesis/orb/orb-close.wav", category: "orb", loop: false, defaultVolume: 0.22, critical: false, lazy: true, fallback: "noop" },
  "galaxy-open": { key: "galaxy-open", path: "/assets/audio/genesis/portals/galaxy-open.wav", category: "portal", loop: false, defaultVolume: 0.32, critical: false, lazy: true, fallback: "noop" },
  "mirror-open": { key: "mirror-open", path: "/assets/audio/genesis/portals/mirror-open.wav", category: "portal", loop: false, defaultVolume: 0.28, critical: false, lazy: true, fallback: "noop" },
  "shadow-open": { key: "shadow-open", path: "/assets/audio/genesis/portals/shadow-open.wav", category: "portal", loop: false, defaultVolume: 0.22, critical: false, lazy: true, fallback: "noop" },
  "legacy-open": { key: "legacy-open", path: "/assets/audio/genesis/portals/legacy-open.wav", category: "portal", loop: false, defaultVolume: 0.28, critical: false, lazy: true, fallback: "noop" },
  "passport-open": { key: "passport-open", path: "/assets/audio/genesis/portals/passport-open.wav", category: "portal", loop: false, defaultVolume: 0.28, critical: false, lazy: true, fallback: "noop" },
  "settings-open": { key: "settings-open", path: "/assets/audio/genesis/portals/settings-open.wav", category: "portal", loop: false, defaultVolume: 0.18, critical: false, lazy: true, fallback: "noop" },
  "soft-bloom": { key: "soft-bloom", path: "/assets/audio/genesis/transitions/soft-bloom.wav", category: "transition", loop: false, defaultVolume: 0.26, critical: false, lazy: true, fallback: "noop" },
  "life-map-swell": { key: "life-map-swell", path: "/assets/audio/genesis/transitions/life-map-swell.wav", category: "transition", loop: false, defaultVolume: 0.22, critical: false, lazy: true, fallback: "noop" },
  "ground-open-bloom": { key: "ground-open-bloom", path: "/assets/audio/genesis/transitions/ground-open-bloom.wav", category: "transition", loop: false, defaultVolume: 0.24, critical: false, lazy: true, fallback: "noop" },
  "mirror-ripple": { key: "mirror-ripple", path: "/assets/audio/genesis/transitions/mirror-ripple.wav", category: "transition", loop: false, defaultVolume: 0.22, critical: false, lazy: true, fallback: "noop" },
  "shadow-soft-gate": { key: "shadow-soft-gate", path: "/assets/audio/genesis/transitions/shadow-soft-gate.wav", category: "transition", loop: false, defaultVolume: 0.18, critical: false, lazy: true, fallback: "noop" },
  "legacy-scroll-open": { key: "legacy-scroll-open", path: "/assets/audio/genesis/transitions/legacy-scroll-open.wav", category: "transition", loop: false, defaultVolume: 0.2, critical: false, lazy: true, fallback: "noop" },
  "soft-tap": { key: "soft-tap", path: "/assets/audio/genesis/ui/soft-tap.wav", category: "ui", loop: false, defaultVolume: 0.2, critical: false, lazy: true, fallback: "noop" },
  "panel-open": { key: "panel-open", path: "/assets/audio/genesis/ui/panel-open.wav", category: "ui", loop: false, defaultVolume: 0.2, critical: false, lazy: true, fallback: "noop" },
  "panel-close": { key: "panel-close", path: "/assets/audio/genesis/ui/panel-close.wav", category: "ui", loop: false, defaultVolume: 0.18, critical: false, lazy: true, fallback: "noop" },
  "permission-toggle": { key: "permission-toggle", path: "/assets/audio/genesis/ui/permission-toggle.wav", category: "ui", loop: false, defaultVolume: 0.2, critical: false, lazy: true, fallback: "noop" },
  "confirm-soft": { key: "confirm-soft", path: "/assets/audio/genesis/ui/confirm-soft.wav", category: "ui", loop: false, defaultVolume: 0.18, critical: false, lazy: true, fallback: "noop" },
  "dismiss-soft": { key: "dismiss-soft", path: "/assets/audio/genesis/ui/dismiss-soft.wav", category: "ui", loop: false, defaultVolume: 0.16, critical: false, lazy: true, fallback: "noop" },
  "gentle-chime": { key: "gentle-chime", path: "/assets/audio/genesis/notifications/gentle-chime.wav", category: "notification", loop: false, defaultVolume: 0.26, critical: false, lazy: true, fallback: "noop" },
  "passport-pulse": { key: "passport-pulse", path: "/assets/audio/genesis/notifications/passport-pulse.wav", category: "notification", loop: false, defaultVolume: 0.24, critical: false, lazy: true, fallback: "noop" },
  "recovery-bloom": { key: "recovery-bloom", path: "/assets/audio/genesis/notifications/recovery-bloom.wav", category: "notification", loop: false, defaultVolume: 0.24, critical: false, lazy: true, fallback: "noop" },
  "ritual-ready": { key: "ritual-ready", path: "/assets/audio/genesis/notifications/ritual-ready.wav", category: "notification", loop: false, defaultVolume: 0.2, critical: false, lazy: true, fallback: "noop" },
  "export-ready": { key: "export-ready", path: "/assets/audio/genesis/notifications/export-ready.wav", category: "notification", loop: false, defaultVolume: 0.18, critical: false, lazy: true, fallback: "noop" },
  "calm-bed": { key: "calm-bed", path: "/assets/audio/genesis/mood/calm-bed.wav", category: "mood", loop: true, defaultVolume: 0.14, critical: false, lazy: true, fallback: "noop" },
  "heavy-bed": { key: "heavy-bed", path: "/assets/audio/genesis/mood/heavy-bed.wav", category: "mood", loop: true, defaultVolume: 0.1, critical: false, lazy: true, fallback: "noop" },
  "focused-bed": { key: "focused-bed", path: "/assets/audio/genesis/mood/focused-bed.wav", category: "mood", loop: true, defaultVolume: 0.12, critical: false, lazy: true, fallback: "noop" },
  "anxious-bed": { key: "anxious-bed", path: "/assets/audio/genesis/mood/anxious-bed.wav", category: "mood", loop: true, defaultVolume: 0.1, critical: false, lazy: true, fallback: "noop" },
  "hopeful-bed": { key: "hopeful-bed", path: "/assets/audio/genesis/mood/hopeful-bed.wav", category: "mood", loop: true, defaultVolume: 0.15, critical: false, lazy: true, fallback: "noop" },
  "recovering-bed": { key: "recovering-bed", path: "/assets/audio/genesis/mood/recovering-bed.wav", category: "mood", loop: true, defaultVolume: 0.15, critical: false, lazy: true, fallback: "noop" },
  "shadow-bed": { key: "shadow-bed", path: "/assets/audio/genesis/mood/shadow-bed.wav", category: "mood", loop: true, defaultVolume: 0.08, critical: false, lazy: true, fallback: "noop" },
  "threshold-bed": { key: "threshold-bed", path: "/assets/audio/genesis/mood/threshold-bed.wav", category: "mood", loop: true, defaultVolume: 0.13, critical: false, lazy: true, fallback: "noop" },
  "luminous-bed": { key: "luminous-bed", path: "/assets/audio/genesis/mood/luminous-bed.wav", category: "mood", loop: true, defaultVolume: 0.16, critical: false, lazy: true, fallback: "noop" },
};

export const URAI_AUDIO_ASSETS: Record<UraiAudioKey, string> = Object.fromEntries(
  Object.entries(URAI_AUDIO_MANIFEST).map(([key, asset]) => [key, asset.path]),
) as Record<UraiAudioKey, string>;

export function getAudioAsset(key: UraiAudioKey | string): UraiAudioAsset | null {
  return URAI_AUDIO_MANIFEST[key as UraiAudioKey] ?? null;
}

export function getAudioPath(key: UraiAudioKey | string): string | null {
  return getAudioAsset(key)?.path ?? null;
}
