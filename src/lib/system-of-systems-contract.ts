export const FIRESTORE_DOMAINS = [
  "users",
  "adminUsers",
  "profiles",
  "consents",
  "narratorMemory",
  "memoryShards",
  "insights",
  "rituals",
  "journeys",
  "journeyChapters",
  "stars",
  "moodWeather",
  "emotionalForecasts",
  "weeklyRecaps",
  "storyProjects",
  "storyAssets",
  "exports",
  "marketplaceItems",
  "marketplacePurchases",
  "creatorSubmissions",
  "referrals",
  "jobs",
  "jobApplications",
  "adminAuditLogs",
  "telemetryEvents",
  "safetyEvents",
  "notifications",
  "featureFlags",
  "waitlistEntries",
  "contactMessages",
  "dataExportRequests",
  "accountDeletionRequests",
  "events",
  "eventEnrichments",
  "lifeMapEvents",
  "constellations",
  "scrolls",
  "storyScripts",
  "relationships",
  "socialGraph",
  "shadowMetrics",
  "obscuraSignals",
  "obscuraPatterns",
  "mentalLoadScores",
  "cognitiveStress",
  "councilSessions",
  "narratorMessages",
  "entitlements",
  "transactions",
  "auditLogs",
  "systemStatus",
  "incidents",
  "dataRequests",
  "dreams",
  "timelineEvents",
  "personaEvolutions",
  "soulThreads",
  "socialArchetypes",
  "weeklyScrolls",
  "weeklyReflections",
  "moods",
  "moodForecasts",
  "recoveryBlooms",
  "memoryBlooms",
  "relationshipConstellations",
  "relationshipSignals",
  "voiceEvents",
  "dreamConstellations",
  "badges",
  "journalEntries",
  "insightMarket",
  "chronoMirrorSnapshots",
  "chrono_validation_events",
  "ancientSignals",
  "companionMessages",
  "narratorInsights",
  "passiveSignals",
  "symbolicStates",
] as const;

export type FirestoreDomain = (typeof FIRESTORE_DOMAINS)[number];

export const OWNER_SCOPED_COLLECTIONS = [
  "profiles",
  "consents",
  "narratorMemory",
  "memoryShards",
  "insights",
  "rituals",
  "journeys",
  "journeyChapters",
  "stars",
  "moodWeather",
  "emotionalForecasts",
  "weeklyRecaps",
  "storyProjects",
  "storyAssets",
  "exports",
  "marketplacePurchases",
  "referrals",
  "jobApplications",
  "telemetryEvents",
  "safetyEvents",
  "notifications",
  "dataExportRequests",
  "accountDeletionRequests",
  "events",
  "eventEnrichments",
  "lifeMapEvents",
  "constellations",
  "scrolls",
  "storyScripts",
  "relationships",
  "socialGraph",
  "shadowMetrics",
  "obscuraSignals",
  "obscuraPatterns",
  "mentalLoadScores",
  "cognitiveStress",
  "councilSessions",
  "narratorMessages",
  "entitlements",
  "transactions",
  "dataRequests",
  "dreams",
  "timelineEvents",
  "personaEvolutions",
  "soulThreads",
  "socialArchetypes",
  "weeklyScrolls",
  "weeklyReflections",
  "moods",
  "moodForecasts",
  "recoveryBlooms",
  "memoryBlooms",
  "relationshipConstellations",
  "relationshipSignals",
  "voiceEvents",
  "dreamConstellations",
  "badges",
  "journalEntries",
  "insightMarket",
  "chronoMirrorSnapshots",
  "chrono_validation_events",
  "ancientSignals",
  "companionMessages",
  "narratorInsights",
  "passiveSignals",
  "symbolicStates",
] as const satisfies readonly FirestoreDomain[];

export const PUBLIC_READ_COLLECTIONS = ["marketplaceItems", "jobs", "featureFlags", "systemStatus"] as const satisfies readonly FirestoreDomain[];
export const SERVER_ONLY_COLLECTIONS = ["adminUsers", "waitlistEntries", "contactMessages", "creatorSubmissions", "adminAuditLogs", "auditLogs", "incidents"] as const satisfies readonly FirestoreDomain[];

export type OwnerScopedCollection = (typeof OWNER_SCOPED_COLLECTIONS)[number];
export type PublicReadCollection = (typeof PUBLIC_READ_COLLECTIONS)[number];
export type ServerOnlyCollection = (typeof SERVER_ONLY_COLLECTIONS)[number];

export type UraiTier = "free" | "pro" | "creator" | "enterprise" | "admin";
export type UraiRole = "user" | "creator" | "enterprise_admin" | "support" | "admin";
export type RetentionClass = "user_lifetime" | "user_controlled" | "export_temporary" | "safety_audit" | "aggregate_only";
export type SafetyLevel = "normal" | "sensitive" | "crisis" | "admin_only";

export type OwnerScopedDocument = {
  id: string;
  ownerUid: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserDocument = {
  id: string;
  uid: string;
  email: string;
  roles: UraiRole[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  disabled?: boolean;
  lastReviewedAt?: string;
};

export type UraiSystemDocument = OwnerScopedDocument & {
  domain: FirestoreDomain;
  status: "seeded" | "active" | "archived";
  title: string;
  summary: string;
  source: "demo" | "user" | "service" | "admin";
  schemaVersion: number;
  retentionClass: RetentionClass;
  safetyLevel: SafetyLevel;
};

export const UraiSystemDocumentSchema = {
  name: "UraiSystemDocumentSchema",
  required: ["id", "ownerUid", "createdAt", "updatedAt", "domain", "status", "title", "summary", "source", "schemaVersion", "retentionClass", "safetyLevel"],
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
        value.source &&
        typeof value.schemaVersion === "number" &&
        value.retentionClass &&
        value.safetyLevel,
    );
  },
};

export const AdminUserDocumentSchema = {
  name: "AdminUserDocumentSchema",
  required: ["id", "uid", "email", "roles", "createdAt", "updatedAt", "createdBy"],
  validate(value: Partial<AdminUserDocument>): value is AdminUserDocument {
    return Boolean(
      value.id &&
        value.uid &&
        value.email &&
        Array.isArray(value.roles) &&
        value.roles.every((role) => ["user", "creator", "enterprise_admin", "support", "admin"].includes(role)) &&
        value.createdAt &&
        value.updatedAt &&
        value.createdBy,
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
  adminUser(uid: string) {
    return `adminUsers/${uid}`;
  },
};

export const FIREBASE_FUNCTIONS = [
  "dailyGenerateInsights",
  "weeklyRecap",
  "rollupDaily",
  "requestExport",
  "exportWorker",
  "exportGC",
  "storyOutline",
  "storyAssemble",
  "ttsRender",
  "purchaseWebhook",
  "marketplaceUnlock",
  "referralTrack",
  "notificationDispatch",
  "jobApplicationSubmit",
  "contactSubmit",
  "waitlistSubmit",
  "dataExportRequest",
  "accountDeletionRequest",
  "adminAuditLog",
  "safetyEventCreate",
  "healthCheck",
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
  "processExportJob",
  "syncEntitlements",
  "deleteUserData",
  "exportUserData",
  "rollupDailyMetrics",
  "cleanupExpiredExports",
  "systemStatusCheck",
] as const;

export type FirebaseFunctionName = (typeof FIREBASE_FUNCTIONS)[number];

export const REQUIRED_PRODUCT_ROUTES = [
  "/",
  "/signin",
  "/signup",
  "/app",
  "/demo",
  "/u/[handle]",
  "/journey",
  "/stars/[id]",
  "/mirror",
  "/mood-weather",
  "/timeline",
  "/narrator",
  "/weekly-recap",
  "/story-mode",
  "/exports",
  "/marketplace",
  "/rituals",
  "/pro",
  "/settings",
  "/privacy-center",
  "/data-export",
  "/delete-account",
  "/admin",
  "/careers",
  "/careers/[id]",
  "/pricing",
  "/contact",
  "/terms",
  "/privacy",
  "/status",
  "/support",
  "/404",
] as const;

export type RequiredProductRoute = (typeof REQUIRED_PRODUCT_ROUTES)[number];

export const ENTITLEMENT_LIMITS: Record<UraiTier, {
  label: string;
  narratorMessagesPerDay: number;
  exportsPerMonth: number;
  marketplacePurchases: boolean;
  creatorPublishing: boolean;
  adminSurfaces: boolean;
}> = {
  free: { label: "Free", narratorMessagesPerDay: 5, exportsPerMonth: 1, marketplacePurchases: false, creatorPublishing: false, adminSurfaces: false },
  pro: { label: "Pro", narratorMessagesPerDay: 50, exportsPerMonth: 20, marketplacePurchases: true, creatorPublishing: false, adminSurfaces: false },
  creator: { label: "Creator / Marketplace", narratorMessagesPerDay: 100, exportsPerMonth: 100, marketplacePurchases: true, creatorPublishing: true, adminSurfaces: false },
  enterprise: { label: "Enterprise / B2B", narratorMessagesPerDay: 250, exportsPerMonth: 500, marketplacePurchases: true, creatorPublishing: true, adminSurfaces: false },
  admin: { label: "Admin / Internal", narratorMessagesPerDay: 1000, exportsPerMonth: 1000, marketplacePurchases: true, creatorPublishing: true, adminSurfaces: true },
};

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
  "jobs.enabled": true,
  "admin.enabled": true,
  "privacyCenter.enabled": true,
  "dataExport.enabled": true,
  "accountDeletion.enabled": true,
  "explainability.enabled": true,
  "accessibilityAdaptation.enabled": true,
  "marketplacePurchases.enabled": false,
  "creatorCms.enabled": false,
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
  jobsRecruitingConsent: "Controls storage and review of job application data.",
  telemetry: "Controls product telemetry used for reliability and product quality.",
  crisisSupportResources: "Controls whether safety events can surface crisis-support resources.",
} as const;

export type ConsentGateName = keyof typeof CONSENT_GATES;

export function hasConsent(consents: Partial<Record<ConsentGateName, boolean>>, gate: ConsentGateName) {
  return consents[gate] === true;
}

export function isFeatureEnabled(flags: Partial<Record<FeatureFlagName, boolean>>, flag: FeatureFlagName) {
  return flags[flag] ?? FEATURE_FLAGS[flag];
}

export function canAccessTier(userTier: UraiTier, requiredTier: UraiTier) {
  const order: UraiTier[] = ["free", "pro", "creator", "enterprise", "admin"];
  return order.indexOf(userTier) >= order.indexOf(requiredTier);
}

export function routeNeedsAuth(route: RequiredProductRoute) {
  return !["/", "/demo", "/u/[handle]", "/careers", "/careers/[id]", "/pricing", "/contact", "/terms", "/privacy", "/status", "/support", "/404", "/signin", "/signup"].includes(route);
}
