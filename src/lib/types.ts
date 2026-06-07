export type Category = "winter" | "spring" | "summer" | "autumn";

export type OrbMessageRole = "user" | "assistant" | "system";
export type OrbMessageMode = "text" | "voice";

export interface OrbMessage {
  id: string;
  role: OrbMessageRole;
  content: string;
  mode: OrbMessageMode;
  emotionTags: string[];
  createdAt: string;
}

export interface OrbChatContext {
  todayMoodState?: string;
  mentalLoadScore?: number;
  rhythmState?: string;
  lastNarratorInsight?: string;
  userTonePreference?: string;
  recentTimelineEvents?: string[];
  relationshipSignals?: string[];
}

export interface OrbChat {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessagePreview?: string;
}

export interface ConversationInsight {
  id: string;
  userId: string;
  chatId?: string;
  insight: string;
  emotionTags: string[];
  memoryImportanceScore: number;
  createdAt: string;
}

export type ISODateString = string;
export type EntityId = string;

export type UraiSensitivity = "low" | "moderate" | "sensitive" | "restricted";
export type UraiEvidenceStrength = "observed" | "inferred" | "user_confirmed" | "system_scaffold";
export type UraiSafetyTone = "gentle" | "neutral" | "celebratory" | "grounding";

export type PermissionCategory =
  | "audio_transcription"
  | "location_movement"
  | "device_app_activity"
  | "calendar_email_context"
  | "social_relationship_intelligence"
  | "mood_mental_load_inference"
  | "facial_environment_inference"
  | "notifications_narrator"
  | "exports_data_ownership"
  | "external_personalization_marketplace";

export type PermissionGrantStatus = "granted" | "denied" | "paused" | "revoked";

export interface PermissionGrant {
  id: EntityId;
  userId: EntityId;
  category: PermissionCategory;
  status: PermissionGrantStatus;
  grantedAt?: ISODateString;
  revokedAt?: ISODateString;
  updatedAt: ISODateString;
  scopeNotes?: string;
}

export interface UraiPassport {
  id: EntityId;
  userId: EntityId;
  displayName?: string;
  dataOwnershipAcknowledged: boolean;
  adFreeExperience: true;
  exportEnabled: boolean;
  deleteRequestedAt?: ISODateString;
  permissionCategories: PermissionCategory[];
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface UserProfile {
  id: EntityId;
  displayName?: string;
  email?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  timezone?: string;
  tonePreference?: UraiSafetyTone;
  passportId?: EntityId;
}

export type PassiveSignalType =
  | "audio"
  | "transcript"
  | "location"
  | "motion"
  | "device_activity"
  | "app_activity"
  | "calendar_context"
  | "email_context"
  | "facial_environment"
  | "notification"
  | "manual_seed";

export interface PassiveSignal {
  id: EntityId;
  userId: EntityId;
  type: PassiveSignalType;
  source: string;
  capturedAt: ISODateString;
  sensitivity: UraiSensitivity;
  evidenceStrength: UraiEvidenceStrength;
  tags: string[];
  summary?: string;
  rawRef?: string;
}

export interface AudioLog {
  id: EntityId;
  userId: EntityId;
  capturedAt: ISODateString;
  durationMs: number;
  transcriptId?: EntityId;
  ambientTags: string[];
  permissionGrantId: EntityId;
}

export interface TranscriptSegment {
  id: EntityId;
  audioLogId: EntityId;
  userId: EntityId;
  startMs: number;
  endMs: number;
  text: string;
  speakerId?: EntityId;
  emotionTags: string[];
  sensitivity: UraiSensitivity;
}

export interface VoiceIdentity {
  id: EntityId;
  userId: EntityId;
  label: string;
  consentStatus: PermissionGrantStatus;
  familiarityScore: number;
  lastHeardAt?: ISODateString;
  notes?: string;
}

export interface SocialProfile {
  id: EntityId;
  userId: EntityId;
  displayName: string;
  voiceIdentityIds: EntityId[];
  relationshipFieldState?: string;
  interactionFrequencyScore: number;
  lastInteractionAt?: ISODateString;
}

export interface RelationshipSignal {
  id: EntityId;
  userId: EntityId;
  socialProfileId: EntityId;
  capturedAt: ISODateString;
  signalType: "frequency_shift" | "tone_shift" | "silence_absence" | "anniversary" | "supportive_moment" | "tension_indicator";
  safeSummary: string;
  evidenceStrength: UraiEvidenceStrength;
  sensitivity: UraiSensitivity;
}

export type RhythmState = "stable" | "off_rhythm" | "overstimulated" | "recovering" | "unknown";
export type MoodValence = "low" | "mixed" | "neutral" | "bright";

export interface MoodState {
  id: EntityId;
  userId: EntityId;
  capturedAt: ISODateString;
  valence: MoodValence;
  arousal: "low" | "medium" | "high";
  tags: string[];
  confidence: number;
}

export interface MoodForecast {
  id: EntityId;
  userId: EntityId;
  generatedAt: ISODateString;
  forecastFor: ISODateString;
  likelyValence: MoodValence;
  rhythmState: RhythmState;
  confidence: number;
  safeSummary: string;
}

export interface DigitalMoodWeather {
  id: EntityId;
  userId: EntityId;
  generatedAt: ISODateString;
  weatherState: "clear" | "mist" | "storm" | "aurora" | "ember" | "rain";
  aura: string;
  particleIntensity: number;
  orbBehavior: OrbState["behavior"];
  groundBehavior: GroundState["growthState"];
  narratorTone: UraiSafetyTone;
}

export interface MentalLoadSnapshot {
  id: EntityId;
  userId: EntityId;
  capturedAt: ISODateString;
  score: number;
  rhythmState: RhythmState;
  contributingSignals: EntityId[];
  safeSummary: string;
}

export interface ShadowCognitionMetric {
  id: EntityId;
  userId: EntityId;
  capturedAt: ISODateString;
  metricType: "friction_taps" | "bedtime_scrolling" | "device_motion_anxiety" | "overchecking" | "silent_mode_shift";
  value: number;
  safeInterpretation: string;
}

export interface ObscuraPattern {
  id: EntityId;
  userId: EntityId;
  capturedAt: ISODateString;
  patternType: "micro_cancel" | "stillness" | "face_angle_tilt" | "scroll_velocity" | "hesitation_loop";
  intensity: number;
  safeInterpretation: string;
}

export interface CognitiveStressSignal {
  id: EntityId;
  userId: EntityId;
  capturedAt: ISODateString;
  signalType: "load_spike" | "rebound" | "sleep_disruption" | "context_switching" | "overstimulation";
  intensity: number;
  safeSummary: string;
}

export interface RecoveryEvent {
  id: EntityId;
  userId: EntityId;
  startedAt: ISODateString;
  completedAt?: ISODateString;
  recoveryType: "rebound" | "restoration" | "threshold_exit" | "ritual_completion";
  linkedSignalIds: EntityId[];
  memoryBloomId?: EntityId;
}

export interface Ritual {
  id: EntityId;
  userId: EntityId;
  title: string;
  ritualType: "grounding" | "reflection" | "recovery" | "threshold" | "seasonal" | "night";
  prompt: string;
  safetyTone: UraiSafetyTone;
  linkedInsightIds: EntityId[];
  createdAt: ISODateString;
}

export interface RitualChain {
  id: EntityId;
  userId: EntityId;
  title: string;
  ritualIds: EntityId[];
  season?: Category;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface NarratorInsight {
  id: EntityId;
  userId: EntityId;
  generatedAt: ISODateString;
  title: string;
  message: string;
  tone: UraiSafetyTone;
  linkedSignalIds: EntityId[];
  ttsReadyText?: string;
}

export interface CouncilMember {
  id: EntityId;
  userId: EntityId;
  name: string;
  archetype: "guardian" | "mirror" | "witness" | "strategist" | "healer" | "scribe";
  voiceTone: UraiSafetyTone;
  visible: boolean;
}

export interface CompanionState {
  id: EntityId;
  userId: EntityId;
  orbStateId?: EntityId;
  councilMemberIds: EntityId[];
  evolutionStage: "seed" | "glow" | "constellation" | "legacy";
  lastInteractionAt?: ISODateString;
}

export interface MemoryStar {
  id: EntityId;
  userId: EntityId;
  timestamp: ISODateString;
  type: "memory" | "ritual" | "recovery" | "social" | "threshold" | "forecast";
  title: string;
  emotionalTags: string[];
  auraColor: string;
  intensity: number;
  sourceSignalIds: EntityId[];
  chapterId?: EntityId;
  ritualId?: EntityId;
  recoveryEventId?: EntityId;
  socialProfileId?: EntityId;
}

export interface MemoryConstellation {
  id: EntityId;
  userId: EntityId;
  title: string;
  starIds: EntityId[];
  chapterId?: EntityId;
  createdAt: ISODateString;
}

export interface MemoryBloom {
  id: EntityId;
  userId: EntityId;
  memoryStarId: EntityId;
  title: string;
  narrative: string;
  auraColor: string;
  soundscapeId?: EntityId;
  createdAt: ISODateString;
}

export interface LifeChapter {
  id: EntityId;
  userId: EntityId;
  title: string;
  season?: Category;
  startAt: ISODateString;
  endAt?: ISODateString;
  summary: string;
  starIds: EntityId[];
}

export interface MirrorOfBecomingReplay {
  id: EntityId;
  userId: EntityId;
  title: string;
  chapterIds: EntityId[];
  replayMode: "mirror" | "threshold" | "rebirth" | "legacy";
  generatedAt: ISODateString;
}

export interface TimelineCompareState {
  id: EntityId;
  userId: EntityId;
  leftRange: { startAt: ISODateString; endAt: ISODateString };
  rightRange: { startAt: ISODateString; endAt: ISODateString };
  summary: string;
}

export interface EmotionalWeatherField {
  id: EntityId;
  userId: EntityId;
  generatedAt: ISODateString;
  weatherState: DigitalMoodWeather["weatherState"];
  auraColor: string;
  particleIntensity: number;
  windVector: [number, number, number];
}

export interface GroundState {
  id: EntityId;
  userId: EntityId;
  growthState: "quiet" | "sprouting" | "blooming" | "recovering" | "threshold";
  glowIntensity: number;
  updatedAt: ISODateString;
}

export interface OrbState {
  id: EntityId;
  userId: EntityId;
  behavior: "idle" | "listening" | "reflecting" | "guiding" | "celebrating" | "grounding";
  auraColor: string;
  pulseIntensity: number;
  updatedAt: ISODateString;
}

export interface PortalState {
  id: EntityId;
  userId: EntityId;
  portalType: "passport" | "mirror" | "timeline" | "settings" | "galaxy" | "council";
  enabled: boolean;
  lastOpenedAt?: ISODateString;
}

export interface SpatialSceneState {
  id: EntityId;
  userId: EntityId;
  groundStateId?: EntityId;
  orbStateId?: EntityId;
  emotionalWeatherFieldId?: EntityId;
  activePortalIds: EntityId[];
  activeMemoryStarIds: EntityId[];
  cameraMode: "home" | "galaxy" | "bloom" | "portal";
  soundscapeId?: EntityId;
}

export interface SoundscapeState {
  id: EntityId;
  userId: EntityId;
  ambientKey: string;
  muted: boolean;
  volume: number;
  updatedAt: ISODateString;
}

export interface ExportArtifact {
  id: EntityId;
  userId: EntityId;
  exportType: "scroll" | "memory" | "ritual" | "passport" | "mirror";
  status: "queued" | "ready" | "failed";
  storagePath?: string;
  createdAt: ISODateString;
}

export interface AdminAuditEvent {
  id: EntityId;
  actorId: EntityId;
  action: string;
  targetPath: string;
  createdAt: ISODateString;
  sensitivity: UraiSensitivity;
}

export const URAI_PERMISSION_CATEGORIES: PermissionCategory[] = [
  "audio_transcription",
  "location_movement",
  "device_app_activity",
  "calendar_email_context",
  "social_relationship_intelligence",
  "mood_mental_load_inference",
  "facial_environment_inference",
  "notifications_narrator",
  "exports_data_ownership",
  "external_personalization_marketplace",
];

export const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export function hasPermissionGrant(grants: PermissionGrant[], category: PermissionCategory): boolean {
  return grants.some((grant) => grant.category === category && grant.status === "granted");
}

export function scoreMentalLoad(input: {
  shadowMetrics?: Pick<ShadowCognitionMetric, "value">[];
  obscuraPatterns?: Pick<ObscuraPattern, "intensity">[];
  stressSignals?: Pick<CognitiveStressSignal, "intensity">[];
}): number {
  const values = [
    ...(input.shadowMetrics ?? []).map((metric) => metric.value),
    ...(input.obscuraPatterns ?? []).map((pattern) => pattern.intensity),
    ...(input.stressSignals ?? []).map((signal) => signal.intensity),
  ];

  if (!values.length) return 0;
  const average = values.reduce((sum, value) => sum + clamp01(value), 0) / values.length;
  return Math.round(average * 100);
}

export function rhythmStateFromScore(score: number): RhythmState {
  if (score >= 72) return "overstimulated";
  if (score >= 48) return "off_rhythm";
  if (score >= 28) return "recovering";
  return "stable";
}

export function moodWeatherFromMentalLoad(score: number): DigitalMoodWeather["weatherState"] {
  if (score >= 78) return "storm";
  if (score >= 58) return "rain";
  if (score >= 38) return "mist";
  return "clear";
}

export function buildSafeNarratorMessage(signalSummary: string): string {
  const trimmed = signalSummary.trim();
  if (!trimmed) return "A quiet pattern may be worth noticing.";
  return `A pattern may be worth noticing: ${trimmed}`;
}

export function createMemoryStarFromSignal(signal: PassiveSignal, now: ISODateString): MemoryStar {
  return {
    id: `star_${signal.id}`,
    userId: signal.userId,
    timestamp: signal.capturedAt || now,
    type: signal.type === "manual_seed" ? "memory" : "forecast",
    title: signal.summary || "A quiet signal became visible",
    emotionalTags: signal.tags,
    auraColor: "#9fd7ff",
    intensity: signal.evidenceStrength === "user_confirmed" ? 0.9 : 0.5,
    sourceSignalIds: [signal.id],
  };
}
