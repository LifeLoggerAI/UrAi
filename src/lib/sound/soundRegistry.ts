import { UraiSoundDefinition, UraiSoundId } from "./soundTypes";

export const URAI_SOUND_REGISTRY: Record<UraiSoundId, UraiSoundDefinition> = {
  genesis_ambient: {
    id: "genesis_ambient",
    label: "Genesis Ambient",
    category: "ambient",
    src: "/assets/audio/genesis-ambient-placeholder.mp3",
    defaultVolume: 0.2,
    loop: true,
    userGestureRequired: true,
  },
  orb_open: {
    id: "orb_open",
    label: "Orb Open",
    category: "ui",
    src: "/assets/audio/orb-open-placeholder.mp3",
    defaultVolume: 0.4,
    userGestureRequired: true,
  },
  orb_close: {
    id: "orb_close",
    label: "Orb Close",
    category: "ui",
    src: "/assets/audio/orb-close-placeholder.mp3",
    defaultVolume: 0.4,
    userGestureRequired: true,
  },
  companion_open: {
    id: "companion_open",
    label: "Companion Open",
    category: "companion",
    src: "/assets/audio/companion-open-placeholder.mp3",
    defaultVolume: 0.5,
    userGestureRequired: true,
  },
  companion_message: {
    id: "companion_message",
    label: "Companion Message",
    category: "companion",
    src: "/assets/audio/companion-message-placeholder.mp3",
    defaultVolume: 0.6,
    userGestureRequired: false,
  },
  passport_open: {
    id: "passport_open",
    label: "Passport Open",
    category: "ui",
    src: "/assets/audio/system-soft-placeholder.mp3",
    defaultVolume: 0.4,
    userGestureRequired: true,
  },
  lifemap_star: {
    id: "lifemap_star",
    label: "Lifemap Star",
    category: "ritual",
    src: "/assets/audio/system-soft-placeholder.mp3",
    defaultVolume: 0.5,
    userGestureRequired: false,
  },
  ground_bloom: {
    id: "ground_bloom",
    label: "Ground Bloom",
    category: "ritual",
    src: "/assets/audio/system-soft-placeholder.mp3",
    defaultVolume: 0.5,
    userGestureRequired: false,
  },
  mirror_reflection: {
    id: "mirror_reflection",
    label: "Mirror Reflection",
    category: "ritual",
    src: "/assets/audio/system-soft-placeholder.mp3",
    defaultVolume: 0.5,
    userGestureRequired: false,
  },
  ritual_chime: {
    id: "ritual_chime",
    label: "Ritual Chime",
    category: "ritual",
    src: "/assets/audio/system-soft-placeholder.mp3",
    defaultVolume: 0.5,
    userGestureRequired: false,
  },
  system_soft: {
    id: "system_soft",
    label: "System Soft",
    category: "system",
    src: "/assets/audio/system-soft-placeholder.mp3",
    defaultVolume: 0.4,
    userGestureRequired: false,
  },
};

export function getUraiSound(soundId: UraiSoundId): UraiSoundDefinition {
  return URAI_SOUND_REGISTRY[soundId];
}
