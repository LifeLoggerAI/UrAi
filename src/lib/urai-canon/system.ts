export const URAI_REQUIRED_ROUTES = [
  "/home",
  "/life-map",
  "/life-map/star/[starId]",
  "/focus",
  "/focus/session/[sessionId]",
  "/replay",
  "/replay/[replayId]",
  "/ochat",
] as const;

export type UraiRouteId = (typeof URAI_REQUIRED_ROUTES)[number];

export type RouteFallbackBehavior =
  | "render-home"
  | "render-life-map"
  | "render-selected-star"
  | "render-focus-session"
  | "render-replay"
  | "render-ochat"
  | "show-parent-with-notice";

export type UraiRouteContract = {
  route: UraiRouteId;
  directLoad: true;
  refreshSafe: true;
  reducedMotionSafe: true;
  mobileSafe: true;
  loadingState: true;
  emptyState: true;
  errorState: true;
  invalidIdBehavior: RouteFallbackBehavior;
  lockedBehavior: RouteFallbackBehavior;
  deletedBehavior: RouteFallbackBehavior;
  archivedBehavior: RouteFallbackBehavior;
  unwindTarget: UraiRouteId | "/" | null;
};

export const URAI_ROUTE_CONTRACTS: Record<UraiRouteId, UraiRouteContract> = {
  "/home": {
    route: "/home",
    directLoad: true,
    refreshSafe: true,
    reducedMotionSafe: true,
    mobileSafe: true,
    loadingState: true,
    emptyState: true,
    errorState: true,
    invalidIdBehavior: "render-home",
    lockedBehavior: "render-home",
    deletedBehavior: "render-home",
    archivedBehavior: "render-home",
    unwindTarget: null,
  },
  "/life-map": {
    route: "/life-map",
    directLoad: true,
    refreshSafe: true,
    reducedMotionSafe: true,
    mobileSafe: true,
    loadingState: true,
    emptyState: true,
    errorState: true,
    invalidIdBehavior: "render-life-map",
    lockedBehavior: "show-parent-with-notice",
    deletedBehavior: "show-parent-with-notice",
    archivedBehavior: "render-life-map",
    unwindTarget: "/home",
  },
  "/life-map/star/[starId]": {
    route: "/life-map/star/[starId]",
    directLoad: true,
    refreshSafe: true,
    reducedMotionSafe: true,
    mobileSafe: true,
    loadingState: true,
    emptyState: true,
    errorState: true,
    invalidIdBehavior: "show-parent-with-notice",
    lockedBehavior: "show-parent-with-notice",
    deletedBehavior: "show-parent-with-notice",
    archivedBehavior: "render-selected-star",
    unwindTarget: "/life-map",
  },
  "/focus": {
    route: "/focus",
    directLoad: true,
    refreshSafe: true,
    reducedMotionSafe: true,
    mobileSafe: true,
    loadingState: true,
    emptyState: true,
    errorState: true,
    invalidIdBehavior: "render-life-map",
    lockedBehavior: "show-parent-with-notice",
    deletedBehavior: "show-parent-with-notice",
    archivedBehavior: "render-focus-session",
    unwindTarget: "/life-map",
  },
  "/focus/session/[sessionId]": {
    route: "/focus/session/[sessionId]",
    directLoad: true,
    refreshSafe: true,
    reducedMotionSafe: true,
    mobileSafe: true,
    loadingState: true,
    emptyState: true,
    errorState: true,
    invalidIdBehavior: "show-parent-with-notice",
    lockedBehavior: "show-parent-with-notice",
    deletedBehavior: "show-parent-with-notice",
    archivedBehavior: "render-focus-session",
    unwindTarget: "/life-map",
  },
  "/replay": {
    route: "/replay",
    directLoad: true,
    refreshSafe: true,
    reducedMotionSafe: true,
    mobileSafe: true,
    loadingState: true,
    emptyState: true,
    errorState: true,
    invalidIdBehavior: "render-life-map",
    lockedBehavior: "show-parent-with-notice",
    deletedBehavior: "show-parent-with-notice",
    archivedBehavior: "render-replay",
    unwindTarget: "/focus",
  },
  "/replay/[replayId]": {
    route: "/replay/[replayId]",
    directLoad: true,
    refreshSafe: true,
    reducedMotionSafe: true,
    mobileSafe: true,
    loadingState: true,
    emptyState: true,
    errorState: true,
    invalidIdBehavior: "show-parent-with-notice",
    lockedBehavior: "show-parent-with-notice",
    deletedBehavior: "show-parent-with-notice",
    archivedBehavior: "render-replay",
    unwindTarget: "/focus",
  },
  "/ochat": {
    route: "/ochat",
    directLoad: true,
    refreshSafe: true,
    reducedMotionSafe: true,
    mobileSafe: true,
    loadingState: true,
    emptyState: true,
    errorState: true,
    invalidIdBehavior: "render-ochat",
    lockedBehavior: "show-parent-with-notice",
    deletedBehavior: "render-home",
    archivedBehavior: "render-ochat",
    unwindTarget: "/home",
  },
};

export type UraiPrivacyState =
  | "public_to_user"
  | "private"
  | "sensitive"
  | "vaulted"
  | "shared"
  | "archived"
  | "deleted";

export type UraiPermissionPolicy = {
  visibleInMap: boolean | "shielded" | "locked-shell" | "optional";
  searchable: boolean | "scoped" | "optional";
  aiReadable: boolean | "scoped" | "permissioned" | "denied";
  replayable: boolean | "gated";
  shareable: boolean | "scoped" | "no-default";
  analytics: "metadata-only" | "content-free" | "deletion-audit-only" | "none";
};

export const URAI_PERMISSION_MATRIX: Record<UraiPrivacyState, UraiPermissionPolicy> = {
  public_to_user: {
    visibleInMap: true,
    searchable: true,
    aiReadable: "scoped",
    replayable: true,
    shareable: "no-default",
    analytics: "metadata-only",
  },
  private: {
    visibleInMap: true,
    searchable: true,
    aiReadable: "permissioned",
    replayable: true,
    shareable: "no-default",
    analytics: "metadata-only",
  },
  sensitive: {
    visibleInMap: "shielded",
    searchable: false,
    aiReadable: "denied",
    replayable: "gated",
    shareable: "no-default",
    analytics: "content-free",
  },
  vaulted: {
    visibleInMap: "locked-shell",
    searchable: false,
    aiReadable: "denied",
    replayable: "gated",
    shareable: false,
    analytics: "none",
  },
  shared: {
    visibleInMap: true,
    searchable: "scoped",
    aiReadable: "scoped",
    replayable: "gated",
    shareable: "scoped",
    analytics: "metadata-only",
  },
  archived: {
    visibleInMap: "optional",
    searchable: "optional",
    aiReadable: false,
    replayable: true,
    shareable: "no-default",
    analytics: "metadata-only",
  },
  deleted: {
    visibleInMap: false,
    searchable: false,
    aiReadable: false,
    replayable: false,
    shareable: false,
    analytics: "deletion-audit-only",
  },
};

export const URAI_CANONICAL_OBJECT_FIELDS = [
  "id",
  "userId",
  "schemaVersion",
  "createdAt",
  "updatedAt",
  "type",
  "title",
  "summary",
  "sourceRefs",
  "privacyState",
  "aiAccessState",
  "visibilityState",
  "lifecycleState",
  "confidence",
  "provenance",
  "deletedAt",
  "archivedAt",
  "lastOpenedAt",
] as const;

export const URAI_CANONICAL_SCHEMAS = [
  "LifeMapNode",
  "MemoryNode",
  "GoalNode",
  "RelationshipNode",
  "HabitPath",
  "LifeChapter",
  "GraphEdge",
  "AIInsight",
  "FocusSession",
  "Replay",
  "ReplayScene",
  "ReplayJourney",
  "Artifact",
  "PrivateVaultObject",
  "PermissionRule",
  "AuditLogEvent",
  "UserPreference",
] as const;

export type UraiAiClaimType = "fact" | "inference" | "pattern" | "suggestion" | "scenario";

export const URAI_AI_OUTPUT_REQUIRED_FIELDS = [
  "insightId",
  "claim",
  "claimType",
  "evidenceRefs",
  "confidence",
  "permissionScopeUsed",
  "generatedAt",
  "userActions",
  "explanationText",
  "prohibitedClaimsCheckPassed",
] as const;

export const URAI_AI_PROHIBITED_CLAIMS = [
  "diagnosis",
  "other_person_inner_state_as_fact",
  "permanent_user_label_without_confirmation",
  "vaulted_or_sensitive_exposure",
  "simulation_as_prediction",
  "hidden_or_deleted_content_use",
  "write_to_identity_without_confirmation",
] as const;

export const URAI_ASSET_MANIFEST_FIELDS = [
  "assetId",
  "type",
  "routeUsed",
  "tierIntroduced",
  "desktopVariant",
  "mobileVariant",
  "reducedMotionVariant",
  "fallbackVariant",
  "fileSizeBudget",
  "license",
  "source",
  "owner",
  "version",
  "preloadPolicy",
  "performanceClass",
] as const;

export const URAI_VISUAL_TOKENS = {
  colors: {
    deepNavy: "#050814",
    blueBlack: "#070B18",
    blueViolet: "#272A66",
    moonlitSilver: "#C8D3E8",
    paleCyan: "#9FE7FF",
    softWhiteGold: "#F2DFA7",
    blackStone: "#05070C",
  },
  motion: {
    majorSettleMs: 1400,
    bloomRiseMs: 220,
    inputLockMinMs: 480,
    transitionBezier: "cubic-bezier(0.16, 1, 0.3, 1)",
    secondaryBezier: "cubic-bezier(0.22, 0.61, 0.36, 1)",
  },
  clarity: {
    mobileOrbProtectedRadiusVw: [18, 24],
    desktopOrbProtectedRadiusVw: [11, 15],
    topUiQuietZonePercent: [15, 22],
  },
} as const;

export const URAI_FAILURE_STATES = [
  "loading",
  "empty",
  "partial-data",
  "permission-denied",
  "locked",
  "offline",
  "stale-data",
  "failed-fetch",
  "corrupted-payload",
  "missing-asset",
  "failed-animation",
  "failed-replay-scene",
  "failed-ai-response",
] as const;

export const URAI_EMPTY_STATE_CANON = [
  "home",
  "life-core",
  "starter-constellation",
  "manual-memory-creation",
  "first-focus-session-path",
  "first-replay-manual-path",
  "privacy-explanation",
  "import-option",
  "no-fake-memories",
  "no-fake-ai-claims",
] as const;

export const URAI_ROUTE_TRANSITIONS = {
  homeToLifeMap: {
    from: "/home",
    to: "/life-map",
    emotionalIntent: "continuous ascension from sanctuary into personal universe",
    phasesMs: [0, 80, 220, 480, 900, 1400, 2200],
  },
  lifeMapStarToFocus: {
    from: "/life-map/star/[starId]",
    to: "/focus",
    emotionalIntent: "selected star expands into a calm focus chamber",
    phasesMs: [0, 80, 260, 620, 1100, 1700],
  },
  focusToReplay: {
    from: "/focus/session/[sessionId]",
    to: "/replay/[replayId]",
    emotionalIntent: "focus object opens into a source-backed memory theater",
    phasesMs: [0, 90, 280, 700, 1200, 1800],
  },
  replayToFocusEsc: {
    from: "/replay/[replayId]",
    to: "/focus/session/[sessionId]",
    emotionalIntent: "replay chamber closes and returns agency to focus",
    phasesMs: [0, 120, 360, 760, 1200],
  },
  focusToLifeMapEsc: {
    from: "/focus/session/[sessionId]",
    to: "/life-map",
    emotionalIntent: "focus chamber collapses back into its original star context",
    phasesMs: [0, 120, 420, 900, 1400],
  },
  lifeMapToHome: {
    from: "/life-map",
    to: "/home",
    emotionalIntent: "cosmic map descends back into grounded sanctuary",
    phasesMs: [0, 120, 440, 900, 1600, 2200],
  },
  homeToOchat: {
    from: "/home",
    to: "/ochat",
    emotionalIntent: "orb opens into a calm companion chamber without leaving the sanctuary",
    phasesMs: [0, 90, 260, 540, 900],
  },
  ochatToHome: {
    from: "/ochat",
    to: "/home",
    emotionalIntent: "companion chamber settles back into the grounded home orb",
    phasesMs: [0, 100, 280, 650],
  },
} as const;

export type UraiValidationResult = {
  ok: boolean;
  missing: string[];
  unsafe: string[];
};

function hasOwnRecordKey(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function missingRequiredFields(value: unknown, fields: readonly string[]): string[] {
  if (!value || typeof value !== "object") return [...fields];
  const record = value as Record<string, unknown>;
  return fields.filter((field) => !hasOwnRecordKey(record, field));
}

export function validateCanonicalObject(value: unknown): UraiValidationResult {
  const missing = missingRequiredFields(value, URAI_CANONICAL_OBJECT_FIELDS);
  const unsafe: string[] = [];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const privacyState = record.privacyState;
    if (typeof privacyState === "string" && privacyState in URAI_PERMISSION_MATRIX) {
      const policy = URAI_PERMISSION_MATRIX[privacyState as UraiPrivacyState];
      if (policy.aiReadable === true && (privacyState === "sensitive" || privacyState === "vaulted" || privacyState === "deleted")) {
        unsafe.push(`Unsafe AI readability for ${privacyState}`);
      }
    }
  }
  return { ok: missing.length === 0 && unsafe.length === 0, missing, unsafe };
}

export function validateAiOutput(value: unknown): UraiValidationResult {
  const missing = missingRequiredFields(value, URAI_AI_OUTPUT_REQUIRED_FIELDS);
  const unsafe: string[] = [];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (record.prohibitedClaimsCheckPassed !== true) {
      unsafe.push("AI output must pass prohibited claims check before display.");
    }
    if (!Array.isArray(record.evidenceRefs) || record.evidenceRefs.length === 0) {
      unsafe.push("AI output must include evidenceRefs.");
    }
  }
  return { ok: missing.length === 0 && unsafe.length === 0, missing, unsafe };
}