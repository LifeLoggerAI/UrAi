import {
  URAI_ASSET_MANIFEST_FIELDS,
  URAI_CANONICAL_OBJECT_FIELDS,
  URAI_CANONICAL_SCHEMAS,
  URAI_EMPTY_STATE_CANON,
  URAI_REQUIRED_ROUTES,
  URAI_ROUTE_CONTRACTS,
  URAI_ROUTE_TRANSITIONS,
  URAI_VISUAL_TOKENS,
  assertUraiCanonIntegrity,
  canAiReadPrivacyState,
  validateAiOutput,
  validateAssetManifestEntry,
  validateCanonicalObject,
} from "@/lib/urai-canon/system";

describe("URAI canonical system contracts", () => {
  it("keeps required route contracts direct-load and refresh safe", () => {
    expect(URAI_REQUIRED_ROUTES).toEqual([
      "/home",
      "/life-map",
      "/life-map/star/[starId]",
      "/focus",
      "/focus/session/[sessionId]",
      "/replay",
      "/replay/[replayId]",
    ]);

    for (const route of URAI_REQUIRED_ROUTES) {
      expect(URAI_ROUTE_CONTRACTS[route].directLoad).toBe(true);
      expect(URAI_ROUTE_CONTRACTS[route].refreshSafe).toBe(true);
      expect(URAI_ROUTE_CONTRACTS[route].loadingState).toBe(true);
      expect(URAI_ROUTE_CONTRACTS[route].emptyState).toBe(true);
      expect(URAI_ROUTE_CONTRACTS[route].errorState).toBe(true);
      expect(URAI_ROUTE_CONTRACTS[route].reducedMotionSafe).toBe(true);
      expect(URAI_ROUTE_CONTRACTS[route].mobileSafe).toBe(true);
    }
  });

  it("blocks AI reading for sensitive, vaulted, and deleted privacy states", () => {
    expect(canAiReadPrivacyState("public_to_user")).toBe(true);
    expect(canAiReadPrivacyState("private")).toBe(true);
    expect(canAiReadPrivacyState("sensitive")).toBe(false);
    expect(canAiReadPrivacyState("vaulted")).toBe(false);
    expect(canAiReadPrivacyState("deleted")).toBe(false);
  });

  it("defines canonical schemas, visual tokens, asset fields, and empty-state rules", () => {
    expect(URAI_CANONICAL_OBJECT_FIELDS).toContain("privacyState");
    expect(URAI_CANONICAL_OBJECT_FIELDS).toContain("provenance");
    expect(URAI_CANONICAL_SCHEMAS).toContain("LifeMapNode");
    expect(URAI_CANONICAL_SCHEMAS).toContain("ReplayJourney");
    expect(URAI_ASSET_MANIFEST_FIELDS).toContain("reducedMotionVariant");
    expect(URAI_ASSET_MANIFEST_FIELDS).toContain("fallbackVariant");
    expect(URAI_EMPTY_STATE_CANON).toContain("no-fake-memories");
    expect(URAI_EMPTY_STATE_CANON).toContain("no-fake-ai-claims");
    expect(URAI_VISUAL_TOKENS.colors.deepNavy).toBe("#050814");
    expect(URAI_VISUAL_TOKENS.motion.majorSettleMs).toBeGreaterThanOrEqual(1200);
  });

  it("documents continuous route transitions and passes integrity", () => {
    expect(URAI_ROUTE_TRANSITIONS.homeToLifeMap.emotionalIntent).toContain("ascension");
    expect(URAI_ROUTE_TRANSITIONS.lifeMapStarToFocus.emotionalIntent).toContain("focus chamber");
    expect(URAI_ROUTE_TRANSITIONS.focusToReplay.emotionalIntent).toContain("memory theater");
    expect(assertUraiCanonIntegrity()).toEqual([]);
  });

  it("validates canonical object lifecycle safety", () => {
    const validObject = Object.fromEntries(URAI_CANONICAL_OBJECT_FIELDS.map((field) => [field, field === "privacyState" ? "private" : "value"]));
    expect(validateCanonicalObject(validObject)).toEqual({ ok: true, missing: [], unsafe: [] });

    const deletedWithoutDeletedAt = {
      ...validObject,
      privacyState: "deleted",
      deletedAt: null,
    };
    expect(validateCanonicalObject(deletedWithoutDeletedAt).unsafe).toContain("deleted objects must include deletedAt");
  });

  it("validates AI truth and evidence contracts", () => {
    const validInsight = {
      insightId: "insight-1",
      claim: "You completed a focus session.",
      claimType: "fact",
      evidenceRefs: ["focus-session-1"],
      confidence: "high",
      permissionScopeUsed: "private",
      generatedAt: "2026-05-19T00:00:00.000Z",
      userActions: ["confirm", "edit", "reject", "hide", "vault", "delete"],
      explanationText: "Based on one completed session record.",
      prohibitedClaimsCheckPassed: true,
    };
    expect(validateAiOutput(validInsight)).toEqual({ ok: true, missing: [], unsafe: [] });

    expect(validateAiOutput({ ...validInsight, evidenceRefs: [], claimType: "fact" }).unsafe).toContain("AI fact claims require evidenceRefs");
    expect(validateAiOutput({ ...validInsight, permissionScopeUsed: "vaulted" }).unsafe).toContain(
      "AI output cannot use sensitive, vaulted, or deleted permission scopes",
    );
  });

  it("validates governed asset manifest entries", () => {
    const validAsset = Object.fromEntries(URAI_ASSET_MANIFEST_FIELDS.map((field) => [field, `${field}-value`]));
    validAsset.fileSizeBudget = 120000;
    validAsset.license = "owned";
    validAsset.fallbackVariant = "fallback-static";

    expect(validateAssetManifestEntry(validAsset)).toEqual({ ok: true, missing: [], unsafe: [] });
    expect(validateAssetManifestEntry({ ...validAsset, license: "unknown" }).unsafe).toContain("asset license cannot be unknown");
    expect(validateAssetManifestEntry({ ...validAsset, fileSizeBudget: 0 }).unsafe).toContain("fileSizeBudget must be positive");
  });
});
