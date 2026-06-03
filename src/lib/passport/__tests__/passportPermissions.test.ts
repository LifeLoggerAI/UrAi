import { DEFAULT_PASSPORT_CONTEXT_PERMISSIONS, normalizePassportContextPermissions } from "@/lib/passport/passportContextTypes";
import { canExportLayer, canSendLayerToAI, canSyncLayerToCloud } from "@/lib/privacy/privacyRulesEngine";

describe("Passport permissions", () => {
  it("keeps sensitive layers off by default", () => {
    expect(DEFAULT_PASSPORT_CONTEXT_PERMISSIONS).toMatchObject({
      allowRelationshipContext: false,
      allowLocationContext: false,
      allowAudioTranscriptContext: false,
      allowCalendarContext: false,
      allowGmailContext: false,
      allowShadowCloudSync: false,
      allowLegacyCloudSync: false,
      allowCompanionSessionMemory: false,
      allowCompanionCloudSync: false,
      allowExportMetadataCloudSync: false,
    });
  });

  it("normalizes partial permissions without enabling sensitive defaults", () => {
    const profile = normalizePassportContextPermissions({ allowMoodContext: true });
    expect(profile.allowMoodContext).toBe(true);
    expect(profile.allowGmailContext).toBe(false);
    expect(profile.allowLocationContext).toBe(false);
    expect(profile.allowShadowCloudSync).toBe(false);
  });

  it("blocks AI, cloud, and export use when a layer is disabled", () => {
    const profile = normalizePassportContextPermissions();
    expect(canSendLayerToAI("gmail", profile)).toBe(false);
    expect(canSendLayerToAI("location", profile)).toBe(false);
    expect(canSendLayerToAI("shadow", profile)).toBe(false);
    expect(canSyncLayerToCloud("shadow", profile)).toBe(false);
    expect(canExportLayer("shadow", profile)).toBe(false);
  });

  it("requires explicit opt-in for high-sensitivity layers", () => {
    const profile = normalizePassportContextPermissions({ allowShadowCloudSync: true, allowLegacyCloudSync: true });
    expect(canSendLayerToAI("shadow", profile)).toBe(false);
    expect(canSendLayerToAI("legacy", profile)).toBe(false);
    expect(canExportLayer("legacy", profile)).toBe(false);
  });

  it("uses the most restrictive conflict outcome", () => {
    const profile = normalizePassportContextPermissions({ allowCompanionCloudSync: true, allowCompanionSessionMemory: false });
    expect(canSyncLayerToCloud("companionMemory", profile)).toBe(false);
  });
});
