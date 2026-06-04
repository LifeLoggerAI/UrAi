
export type UraiSoundId =
  | "genesis_ambient"
  | "orb_open"
  | "orb_close"
  | "companion_open"
  | "companion_message"
  | "passport_open"
  | "lifemap_star"
  | "ground_bloom"
  | "mirror_reflection"
  | "ritual_chime"
  | "system_soft";

export type UraiSoundCategory =
  | "ambient"
  | "ui"
  | "companion"
  | "ritual"
  | "system";

export type UraiSoundDefinition = {
  id: UraiSoundId;
  label: string;
  category: UraiSoundCategory;
  src: string;
  defaultVolume: number;
  loop?: boolean;
  userGestureRequired: boolean;
};

export type UraiVoiceLineId =
  | "welcome"
  | "passport_privacy"
  | "companion_intro"
  | "reflection_ready"
  | "spatial_optional"
  | "shadow_protected"
  | "legacy_protected"
  | "sound_not_recording";

export type UraiVoiceLine = {
  id: UraiVoiceLineId;
  title: string;
  text: string;
  context: "genesis" | "passport" | "companion" | "mirror" | "shadow" | "legacy" | "spatial" | "system";
};

export type UraiSoundPreference = {
  enabled: boolean;
  ambientEnabled: boolean;
  voiceEnabled: boolean;
  volume: number;
};
