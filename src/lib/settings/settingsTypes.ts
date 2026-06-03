export type SettingsSectionId =
  | "account"
  | "passport"
  | "audio"
  | "voice"
  | "notifications"
  | "sensory"
  | "appearance"
  | "onboarding"
  | "exports"
  | "data"
  | "about";

export type SettingsControlState = {
  reducedSensoryMode: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  ambientAnimationEnabled: boolean;
  hapticsEnabled: boolean;
  lastUpdatedAt: string;
};

export type UraiSettingsProfile = {
  userId?: string;
  activeSection: SettingsSectionId;
  controlState: SettingsControlState;
  updatedAt: string;
  version: number;
};

export const SETTINGS_SECTIONS: Array<{ id: SettingsSectionId; label: string; description: string }> = [
  { id: "account", label: "Account", description: "Local mode, sync, deletion" },
  { id: "passport", label: "Passport", description: "Permissions and gates" },
  { id: "audio", label: "Sound", description: "Ambient sound and haptics" },
  { id: "voice", label: "Voice", description: "Voice and captions" },
  { id: "notifications", label: "Whispers", description: "Quiet notifications" },
  { id: "sensory", label: "Sensory", description: "Motion and intensity" },
  { id: "appearance", label: "Appearance", description: "Contrast and glow" },
  { id: "onboarding", label: "Onboarding", description: "First-run choices" },
  { id: "exports", label: "Exports", description: "Artifacts and reviews" },
  { id: "data", label: "Data", description: "Local reset controls" },
  { id: "about", label: "About", description: "URAI information" },
];

export const DEFAULT_SETTINGS_PROFILE: UraiSettingsProfile = {
  activeSection: "passport",
  controlState: {
    reducedSensoryMode: false,
    reducedMotion: false,
    highContrast: false,
    ambientAnimationEnabled: true,
    hapticsEnabled: true,
    lastUpdatedAt: new Date(0).toISOString(),
  },
  updatedAt: new Date(0).toISOString(),
  version: 1,
};
