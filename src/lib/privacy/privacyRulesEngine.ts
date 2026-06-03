import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { ConsentLayerId } from "./consentCopyRegistry";

export type PrivacyAction = "enable" | "ai_context" | "cloud_sync" | "export" | "shadow" | "legacy" | "notification";
export type PrivacyLayerId = ConsentLayerId | "mood" | "memory" | "deviceBehavior" | "calendar" | "audioTranscript" | "longTermPattern";

const EXPLICIT_LAYERS = new Set<PrivacyLayerId>([
  "shadow", "legacy", "exports", "audio", "transcripts", "audioTranscript", "location", "gmail", "calendar", "health", "relationships", "cloudSync", "companionMemory",
]);

function p(profile?: Partial<PassportContextPermissions> | null): PassportContextPermissions {
  return normalizePassportContextPermissions(profile);
}

export function requiresExplicitConsent(layerId: PrivacyLayerId): boolean {
  return EXPLICIT_LAYERS.has(layerId);
}

export function canEnableLayer(layerId: PrivacyLayerId, passportProfile?: Partial<PassportContextPermissions> | null): boolean {
  const profile = p(passportProfile);
  if (layerId === "shadow") return profile.allowShadowCloudSync && profile.allowLongTermPatternContext;
  if (layerId === "legacy") return profile.allowLegacyCloudSync && profile.allowMemoryContext;
  if (layerId === "exports") return profile.allowExportMetadataCloudSync;
  if (layerId === "companionMemory") return profile.allowCompanionSessionMemory;
  if (layerId === "cloudSync") return profile.allowCompanionCloudSync || profile.allowExportMetadataCloudSync;
  if (layerId === "transcripts" || layerId === "audioTranscript") return profile.allowAudioTranscriptContext;
  if (layerId === "location") return profile.allowLocationContext;
  if (layerId === "gmail") return profile.allowGmailContext;
  if (layerId === "calendar") return profile.allowCalendarContext;
  if (layerId === "relationships") return profile.allowRelationshipContext;
  if (layerId === "health") return false;
  if (layerId === "memory" || layerId === "lifeMap" || layerId === "ground") return profile.allowMemoryContext;
  if (layerId === "mood") return profile.allowMoodContext;
  if (layerId === "mirror" || layerId === "longTermPattern") return profile.allowLongTermPatternContext;
  if (layerId === "deviceBehavior") return profile.allowDeviceBehaviorContext;
  if (layerId === "notifications" || layerId === "passport" || layerId === "aiCompanion") return true;
  return false;
}

export function canSendLayerToAI(layerId: PrivacyLayerId, passportProfile?: Partial<PassportContextPermissions> | null): boolean {
  const profile = p(passportProfile);
  if (layerId === "shadow") return profile.allowShadowCloudSync && profile.allowLongTermPatternContext;
  if (layerId === "legacy") return profile.allowLegacyCloudSync && profile.allowMemoryContext;
  if (layerId === "companionMemory") return profile.allowCompanionSessionMemory;
  if (layerId === "exports") return false;
  return canEnableLayer(layerId, profile);
}

export function canSyncLayerToCloud(layerId: PrivacyLayerId, passportProfile?: Partial<PassportContextPermissions> | null): boolean {
  const profile = p(passportProfile);
  if (layerId === "shadow") return profile.allowShadowCloudSync;
  if (layerId === "legacy") return profile.allowLegacyCloudSync;
  if (layerId === "companionMemory") return profile.allowCompanionCloudSync && profile.allowCompanionSessionMemory;
  if (layerId === "exports") return profile.allowExportMetadataCloudSync;
  if (layerId === "health") return false;
  return canEnableLayer(layerId, profile);
}

export function canExportLayer(layerId: PrivacyLayerId, passportProfile?: Partial<PassportContextPermissions> | null): boolean {
  const profile = p(passportProfile);
  if (!profile.allowExportMetadataCloudSync) return false;
  if (layerId === "shadow") return profile.allowShadowCloudSync && profile.allowLongTermPatternContext;
  if (layerId === "legacy") return profile.allowLegacyCloudSync && profile.allowMemoryContext;
  if (layerId === "health") return false;
  return canEnableLayer(layerId, profile) || layerId === "passport";
}

export function canUseLayerInShadow(layerId: PrivacyLayerId, passportProfile?: Partial<PassportContextPermissions> | null): boolean {
  const profile = p(passportProfile);
  return profile.allowShadowCloudSync && canSendLayerToAI(layerId, profile);
}

export function canUseLayerInLegacy(layerId: PrivacyLayerId, passportProfile?: Partial<PassportContextPermissions> | null): boolean {
  const profile = p(passportProfile);
  return profile.allowLegacyCloudSync && canSendLayerToAI(layerId, profile);
}

export function getPrivacyBlockReason(layerId: PrivacyLayerId, action: PrivacyAction): string {
  if (layerId === "health") return "Health context is closed. URAI does not diagnose, treat, or provide medical advice.";
  if (layerId === "shadow") return "That layer is closed in Passport. Shadow stays closed unless you explicitly open it.";
  if (layerId === "legacy") return "That layer is closed in Passport. Nothing is carried forward unless you choose.";
  if (action === "export") return "Review what leaves URAI. This layer is not open for export.";
  if (action === "cloud_sync") return "Sync copies only approved URAI state to your account. This layer is not approved for sync.";
  if (action === "ai_context") return "That layer is closed in Passport.";
  return "That layer is closed in Passport.";
}
