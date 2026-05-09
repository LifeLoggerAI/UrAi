export const COLLECTIONS = {
  users: "users",
  timelineEvents: "timelineEvents",
  memoryBlooms: "memoryBlooms",
  moodForecasts: "moodForecasts",
  weeklyReflections: "weeklyReflections",
  companionMessages: "companionMessages",
  narratorInsights: "narratorInsights",
  rituals: "rituals",
  relationshipSignals: "relationshipSignals",
  passiveSignals: "passiveSignals",
  symbolicStates: "symbolicStates",
  waitlistSignups: "waitlistSignups",
  consents: "consents"
} as const;

export const ROUTES = {
  home: "/",
  publicAdamConstellation: "/u/adamclamp",
  companionApi: "/api/companion",
  waitlistApi: "/api/waitlist"
} as const;

export const FEATURE_FLAGS = {
  v1PublicDemo: true,
  livePassiveSensing: false,
  liveTherapyOrDiagnosis: false,
  liveInsightMarketplace: false,
  liveSpatialArVr: false,
  liveB2BPortal: false,
  liveStudioExports: false
} as const;

export const OWNER_FIELD = "ownerUid" as const;
export const DEMO_DISPLAY_USER_FIELD = "userId" as const;

export type DataSensitivity = "public-demo" | "private-user" | "server-only" | "future-consent-gated";

export const COLLECTION_SENSITIVITY: Record<string, DataSensitivity> = {
  [COLLECTIONS.users]: "private-user",
  [COLLECTIONS.timelineEvents]: "private-user",
  [COLLECTIONS.memoryBlooms]: "private-user",
  [COLLECTIONS.moodForecasts]: "private-user",
  [COLLECTIONS.weeklyReflections]: "private-user",
  [COLLECTIONS.companionMessages]: "private-user",
  [COLLECTIONS.narratorInsights]: "private-user",
  [COLLECTIONS.rituals]: "private-user",
  [COLLECTIONS.relationshipSignals]: "future-consent-gated",
  [COLLECTIONS.passiveSignals]: "future-consent-gated",
  [COLLECTIONS.symbolicStates]: "private-user",
  [COLLECTIONS.waitlistSignups]: "server-only",
  [COLLECTIONS.consents]: "private-user"
};

export const V1_LAUNCH_COPY_BOUNDARY =
  "URAI V1 is a public demo spine. Full passive sensing, therapy/diagnosis, marketplace, AR/VR, B2B, and studio export systems are not live unless explicitly enabled behind consent and production checks.";
