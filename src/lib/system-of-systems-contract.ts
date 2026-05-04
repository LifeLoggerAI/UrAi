export const FIRESTORE_DOMAINS = [
  "users",
  "events",
  "eventEnrichments",
  "memoryShards",
  "insights",
  "forecasts",
  "moodWeather",
  "lifeMapEvents",
  "constellations",
  "rituals",
  "scrolls",
  "storyScripts",
  "exports",
  "relationships",
  "socialGraph",
  "shadowMetrics",
  "obscuraSignals",
  "mentalLoadScores",
  "councilSessions",
  "narratorMessages",
  "marketplaceItems",
  "entitlements",
  "transactions",
  "auditLogs",
  "systemStatus",
  "incidents",
  "consents",
  "dataRequests",
  "featureFlags",
  "adminUsers",
] as const;

export type FirestoreDomain = (typeof FIRESTORE_DOMAINS)[number];

export type OwnerScopedDocument = {
  id: string;
  ownerUid: string;
  createdAt: string;
  updatedAt: string;
};

export type UraiSystemDocument = OwnerScopedDocument & {
  domain: FirestoreDomain;
  status: "seeded" | "active" | "archived";
  title: string;
  summary: string;
  source: "demo" | "user" | "service" | "admin";
};

export const UraiSystemDocumentSchema = {
  name: "UraiSystemDocumentSchema",
  required: ["id", "ownerUid", "createdAt", "updatedAt", "domain", "status", "title", "summary", "source"],
  validate(value: Partial<UraiSystemDocument>): value is UraiSystemDocument {
    return Boolean(
      value.id &&
        value.ownerUid &&
        value.createdAt &&
        value.updatedAt &&
        value.domain &&
        FIRESTORE_DOMAINS.includes(value.domain) &&
        value.status &&
        value.title &&
        value.summary &&
        value.source,
    );
  },
};

export const firestorePath = {
  collection(domain: FirestoreDomain) {
    return domain;
  },
  doc(domain: FirestoreDomain, id: string) {
    return `${domain}/${id}`;
  },
  user(uid: string) {
    return `users/${uid}`;
  },
};

export const FIREBASE_FUNCTIONS = [
  "health",
  "ingestEvent",
  "enrichEvent",
  "generateDailyInsights",
  "generateWeeklyRecap",
  "generateMoodForecast",
  "generateLifeMapStar",
  "generateConstellation",
  "generateRitualSuggestion",
  "completeRitual",
  "requestExport",
  "processExportJob",
  "storyAssemble",
  "ttsRender",
  "purchaseWebhook",
  "syncEntitlements",
  "deleteUserData",
  "exportUserData",
  "rollupDailyMetrics",
  "cleanupExpiredExports",
  "systemStatusCheck",
] as const;

export type FirebaseFunctionName = (typeof FIREBASE_FUNCTIONS)[number];

export const FEATURE_FLAGS = {
  "lifeMap.enabled": true,
  "council.enabled": true,
  "storyMode.enabled": true,
  "marketplace.enabled": true,
  "exports.enabled": true,
  "relationshipInsights.enabled": true,
  "mentalLoad.enabled": true,
  "obscura.enabled": true,
  "shadowMetrics.enabled": true,
  "xr.enabled": false,
  "proDashboard.enabled": true,
  "demoMode.enabled": true,
} as const;

export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

export const CONSENT_GATES = {
  audioProcessing: "Controls transcription, voice memory, and narrator audio enrichment.",
  locationContext: "Controls GPS/contextual place enrichment.",
  relationshipInsights: "Controls social graph and relationship-pattern processing.",
  healthWellnessInsights: "Controls wellness, mood, mental load, and recovery insights.",
  marketplacePersonalization: "Controls personalized marketplace recommendations.",
  exportGeneration: "Controls PDF, PNG, story, SRT, and video export generation.",
  anonymizedPatternLicensing: "Controls anonymized pattern licensing eligibility.",
  pushNotifications: "Controls push notification delivery.",
  emailRecaps: "Controls email digest and recap delivery.",
} as const;

export type ConsentGateName = keyof typeof CONSENT_GATES;

export function hasConsent(consents: Partial<Record<ConsentGateName, boolean>>, gate: ConsentGateName) {
  return consents[gate] === true;
}

export function isFeatureEnabled(flags: Partial<Record<FeatureFlagName, boolean>>, flag: FeatureFlagName) {
  return flags[flag] ?? FEATURE_FLAGS[flag];
}
