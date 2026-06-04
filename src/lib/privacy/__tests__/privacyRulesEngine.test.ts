import { normalizePassportContextPermissions } from "@/lib/passport/passportContextTypes";
import { canExportLayer, canSendLayerToAI, canSyncLayerToCloud, canUseLayerInLegacy, canUseLayerInShadow, getPrivacyBlockReason } from "../privacyRulesEngine";

describe("privacyRulesEngine", () => {
  it("blocks closed layers from AI, cloud, export, Shadow, and Legacy", () => {
    const profile = normalizePassportContextPermissions();
    expect(canSendLayerToAI("gmail", profile)).toBe(false);
    expect(canSyncLayerToCloud("shadow", profile)).toBe(false);
    expect(canExportLayer("memory", profile)).toBe(false);
    expect(canUseLayerInShadow("memory", profile)).toBe(false);
    expect(canUseLayerInLegacy("memory", profile)).toBe(false);
  });

  it("does not safe-default enable Shadow, Legacy, or Export", () => {
    const profile = normalizePassportContextPermissions();
    expect(canSendLayerToAI("shadow", profile)).toBe(false);
    expect(canSendLayerToAI("legacy", profile)).toBe(false);
    expect(canExportLayer("memory", profile)).toBe(false);
  });

  it("requires both layer and context permissions for Shadow and Legacy", () => {
    expect(canSendLayerToAI("shadow", normalizePassportContextPermissions({ allowShadowCloudSync: true }))).toBe(false);
    expect(canSendLayerToAI("shadow", normalizePassportContextPermissions({ allowShadowCloudSync: true, allowLongTermPatternContext: true }))).toBe(true);
    expect(canSendLayerToAI("legacy", normalizePassportContextPermissions({ allowLegacyCloudSync: true }))).toBe(false);
    expect(canSendLayerToAI("legacy", normalizePassportContextPermissions({ allowLegacyCloudSync: true, allowMemoryContext: true }))).toBe(true);
  });

  it("returns plain-language safe block reasons", () => {
    expect(getPrivacyBlockReason("shadow", "ai_context")).toContain("closed");
    expect(getPrivacyBlockReason("health", "ai_context")).toContain("does not diagnose");
  });
});
