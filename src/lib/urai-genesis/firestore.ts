import type {
  AdminAuditEvent,
  AudioLog,
  CompanionState,
  EmotionalWeatherField,
  ExportArtifact,
  LifeChapter,
  MemoryBloom,
  MemoryConstellation,
  MemoryStar,
  MentalLoadSnapshot,
  MoodForecast,
  MoodState,
  NarratorInsight,
  ObscuraPattern,
  PassiveSignal,
  PermissionGrant,
  RecoveryEvent,
  RelationshipSignal,
  Ritual,
  ShadowCognitionMetric,
  SocialProfile,
  TranscriptSegment,
  UraiPassport,
  UserProfile,
  VoiceIdentity,
} from "@/lib/types";

export const GENESIS_COLLECTIONS = {
  users: "users",
  passports: "passports",
  permissionGrants: "permissionGrants",
  passiveSignals: "passiveSignals",
  audioLogs: "audioLogs",
  transcriptSegments: "transcriptSegments",
  voiceIdentities: "voiceIdentities",
  socialProfiles: "socialProfiles",
  relationshipSignals: "relationshipSignals",
  moodStates: "moodStates",
  moodForecasts: "moodForecasts",
  mentalLoadSnapshots: "mentalLoadSnapshots",
  shadowCognitionMetrics: "shadowCognitionMetrics",
  obscuraPatterns: "obscuraPatterns",
  recoveryEvents: "recoveryEvents",
  rituals: "rituals",
  narratorInsights: "narratorInsights",
  councilStates: "councilStates",
  companionStates: "companionStates",
  memoryStars: "memoryStars",
  memoryConstellations: "memoryConstellations",
  memoryBlooms: "memoryBlooms",
  lifeChapters: "lifeChapters",
  mirrorReplays: "mirrorReplays",
  emotionalWeatherFields: "emotionalWeatherFields",
  exportArtifacts: "exportArtifacts",
  adminAuditEvents: "adminAuditEvents",
} as const;

export type GenesisCollectionName = keyof typeof GENESIS_COLLECTIONS;

export type GenesisCollectionMap = {
  users: UserProfile;
  passports: UraiPassport;
  permissionGrants: PermissionGrant;
  passiveSignals: PassiveSignal;
  audioLogs: AudioLog;
  transcriptSegments: TranscriptSegment;
  voiceIdentities: VoiceIdentity;
  socialProfiles: SocialProfile;
  relationshipSignals: RelationshipSignal;
  moodStates: MoodState;
  moodForecasts: MoodForecast;
  mentalLoadSnapshots: MentalLoadSnapshot;
  shadowCognitionMetrics: ShadowCognitionMetric;
  obscuraPatterns: ObscuraPattern;
  recoveryEvents: RecoveryEvent;
  rituals: Ritual;
  narratorInsights: NarratorInsight;
  councilStates: CompanionState;
  companionStates: CompanionState;
  memoryStars: MemoryStar;
  memoryConstellations: MemoryConstellation;
  memoryBlooms: MemoryBloom;
  lifeChapters: LifeChapter;
  mirrorReplays: unknown;
  emotionalWeatherFields: EmotionalWeatherField;
  exportArtifacts: ExportArtifact;
  adminAuditEvents: AdminAuditEvent;
};

export interface GenesisDocumentRef<TCollection extends GenesisCollectionName> {
  collection: (typeof GENESIS_COLLECTIONS)[TCollection];
  id: string;
  path: string;
}

export interface GenesisQuerySpec<TCollection extends GenesisCollectionName> {
  collection: (typeof GENESIS_COLLECTIONS)[TCollection];
  userId?: string;
  orderBy?: "createdAt" | "updatedAt" | "capturedAt" | "generatedAt" | "timestamp";
  limit?: number;
}

export function genesisDoc<TCollection extends GenesisCollectionName>(
  collectionName: TCollection,
  id: string,
): GenesisDocumentRef<TCollection> {
  const collection = GENESIS_COLLECTIONS[collectionName];
  return { collection, id, path: `${collection}/${id}` };
}

export function genesisUserQuery<TCollection extends GenesisCollectionName>(
  collectionName: TCollection,
  userId: string,
  orderBy?: GenesisQuerySpec<TCollection>["orderBy"],
  limit = 50,
): GenesisQuerySpec<TCollection> {
  return {
    collection: GENESIS_COLLECTIONS[collectionName],
    userId,
    orderBy,
    limit,
  };
}

export function serializeGenesisDocument<TCollection extends GenesisCollectionName>(
  value: GenesisCollectionMap[TCollection],
): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

export function withUpdatedAt<T extends { updatedAt?: string }>(value: T, now = new Date().toISOString()): T & { updatedAt: string } {
  return { ...value, updatedAt: now };
}

export const GENESIS_INDEX_NOTES = [
  "Most user-scoped collections should support equality on userId plus descending createdAt, capturedAt, generatedAt, or timestamp where present.",
  "Sensitive collections require rules that restrict reads and writes to the authenticated owner or privileged server/admin contexts.",
  "Admin audit events should be append-only and hidden from normal client UI.",
  "Social, facial/environment, audio/transcription, and mental-load collections must be permission-gated before feature use.",
];

export const GENESIS_SECURITY_RULE_NOTES = [
  "Client writes should be narrow and schema-validated where possible.",
  "Server-generated intelligence records should be written through trusted server contexts.",
  "Passport export and deletion requests should create auditable records rather than bypassing retention workflows.",
  "External personalization/data marketplace permissions must remain opt-in and separate from URAI's ad-free in-app experience.",
];
