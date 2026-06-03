import type { UraiFeatureFlag, UraiFeatureFlagId, UraiLaunchStatus } from "./adminTypes";

const now = "2026-06-03T00:00:00.000Z";

export const DEFAULT_FEATURE_FLAGS: Record<UraiFeatureFlagId, UraiFeatureFlag> = {
  genesis_enabled: { id: "genesis_enabled", label: "Genesis", description: "Main Genesis experience.", enabled: true, defaultEnabled: true, safetyCritical: false, updatedAt: now },
  public_demo_enabled: { id: "public_demo_enabled", label: "Public demo", description: "Sample-only public demo routes.", enabled: true, defaultEnabled: true, safetyCritical: false, updatedAt: now },
  waitlist_enabled: { id: "waitlist_enabled", label: "Waitlist", description: "Public waitlist capture.", enabled: true, defaultEnabled: true, safetyCritical: false, updatedAt: now },
  companion_ai_enabled: { id: "companion_ai_enabled", label: "Companion AI", description: "Server-side Companion AI responses with fallback.", enabled: true, defaultEnabled: true, safetyCritical: false, updatedAt: now },
  life_map_enabled: { id: "life_map_enabled", label: "Life Map", description: "Life Map/Galaxy layer.", enabled: true, defaultEnabled: true, safetyCritical: false, updatedAt: now },
  ground_enabled: { id: "ground_enabled", label: "Ground", description: "Ground layer and rituals.", enabled: true, defaultEnabled: true, safetyCritical: false, updatedAt: now },
  mirror_enabled: { id: "mirror_enabled", label: "Mirror", description: "Mirror reflection layer.", enabled: true, defaultEnabled: true, safetyCritical: false, updatedAt: now },
  shadow_enabled: { id: "shadow_enabled", label: "Shadow", description: "Enables the Shadow portal only. Passport consent is still required per user.", enabled: false, defaultEnabled: false, safetyCritical: true, updatedAt: now },
  legacy_enabled: { id: "legacy_enabled", label: "Legacy", description: "Enables Legacy preview. User approval still controls memory carry-forward.", enabled: false, defaultEnabled: false, safetyCritical: true, updatedAt: now },
  exports_enabled: { id: "exports_enabled", label: "Exports", description: "Enables reviewed exports only.", enabled: false, defaultEnabled: false, safetyCritical: true, updatedAt: now },
  rituals_enabled: { id: "rituals_enabled", label: "Rituals", description: "Gentle ritual flows.", enabled: true, defaultEnabled: true, safetyCritical: false, updatedAt: now },
  notifications_enabled: { id: "notifications_enabled", label: "Notifications", description: "Generic URAI whispers. No sensitive details.", enabled: false, defaultEnabled: false, safetyCritical: true, updatedAt: now },
  audio_enabled: { id: "audio_enabled", label: "Audio", description: "Optional sound playback. Does not enable capture.", enabled: false, defaultEnabled: false, safetyCritical: false, updatedAt: now },
  voice_enabled: { id: "voice_enabled", label: "Voice", description: "Optional narrator voice playback.", enabled: false, defaultEnabled: false, safetyCritical: false, updatedAt: now },
  cloud_sync_enabled: { id: "cloud_sync_enabled", label: "Cloud sync", description: "Approved sync only. Sensitive layers remain closed unless Passport opens them.", enabled: false, defaultEnabled: false, safetyCritical: true, updatedAt: now },
  maintenance_mode: { id: "maintenance_mode", label: "Maintenance mode", description: "Shows a gentle maintenance state when enabled.", enabled: false, defaultEnabled: false, safetyCritical: true, updatedAt: now },
};

export const DEFAULT_LAUNCH_STATUS: UraiLaunchStatus = "public_demo";
export const FEATURE_FLAG_PATH = "system/featureFlags";
export function getDefaultFeatureFlags(): UraiFeatureFlag[] { return Object.values(DEFAULT_FEATURE_FLAGS); }
export function getDefaultFeatureFlagMap(): Record<UraiFeatureFlagId, UraiFeatureFlag> { return { ...DEFAULT_FEATURE_FLAGS }; }
export function isFeatureEnabled(flags: Partial<Record<UraiFeatureFlagId, UraiFeatureFlag>>, id: UraiFeatureFlagId): boolean { return flags[id]?.enabled ?? DEFAULT_FEATURE_FLAGS[id].enabled; }
