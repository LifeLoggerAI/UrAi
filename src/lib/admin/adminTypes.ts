export type UraiAdminRole = "founder" | "admin" | "support" | "viewer";
export type UraiFeatureFlagId = "genesis_enabled" | "public_demo_enabled" | "waitlist_enabled" | "companion_ai_enabled" | "life_map_enabled" | "ground_enabled" | "mirror_enabled" | "shadow_enabled" | "legacy_enabled" | "exports_enabled" | "rituals_enabled" | "notifications_enabled" | "audio_enabled" | "voice_enabled" | "cloud_sync_enabled" | "maintenance_mode";
export type UraiLaunchStatus = "local" | "private_alpha" | "public_demo" | "waitlist" | "beta" | "launched" | "maintenance";
export type UraiFeatureFlag = { id: UraiFeatureFlagId; label: string; description: string; enabled: boolean; defaultEnabled: boolean; safetyCritical: boolean; updatedAt: string; updatedBy?: string };
export type UraiAdminProfile = { userId: string; email?: string; role: UraiAdminRole; createdAt: string; updatedAt: string };
export type UraiAdminStatus = { launchStatus: UraiLaunchStatus; firebaseConfigured: boolean; aiProviderConfigured: boolean; storageConfigured: boolean; waitlistConfigured: boolean; updatedAt: string };
