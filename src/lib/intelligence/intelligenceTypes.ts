
export type PassportDataLayerId = string;
export type GenesisMoodState = string;

export type IntelligenceSignalType =
  | "mood"
  | "rhythm"
  | "recovery"
  | "overload"
  | "grounding"
  | "reflection"
  | "ritual"
  | "life_event"
  | "threshold"
  | "shadow_candidate"
  | "legacy_candidate"
  | "system";

export type IntelligenceConfidence =
  | "low"
  | "medium"
  | "high";

export type IntelligenceSafetyBand =
  | "safe"
  | "sensitive"
  | "shadow_required"
  | "legacy_required"
  | "danger"
  | "blocked";

export type IntelligenceDestination =
  | "lifemap"
  | "ground"
  | "mirror"
  | "shadow"
  | "legacy"
  | "ritual"
  | "companion"
  | "none";

export type IntelligenceSignal = {
  id: string;
  type: IntelligenceSignalType;
  title: string;
  summary: string;
  createdAt: string;
  sourceRecordIds: string[];
  sourceLayerIds: PassportDataLayerId[];
  confidence: IntelligenceConfidence;
  safetyBand: IntelligenceSafetyBand;
  moodState?: GenesisMoodState;
  score?: number;
  suggestedDestination?: IntelligenceDestination;
  permissionRequired?: PassportDataLayerId;
  userApproved?: boolean;
};

export type SymbolicInferenceResult = {
  generatedAt: string;
  signals: IntelligenceSignal[];
  lifeMapCandidates: IntelligenceSignal[];
  groundCandidates: IntelligenceSignal[];
  mirrorCandidates: IntelligenceSignal[];
  shadowCandidates: IntelligenceSignal[];
  legacyCandidates: IntelligenceSignal[];
  ritualCandidates: IntelligenceSignal[];
};

export type RhythmState =
  | "stable"
  | "off_rhythm"
  | "overstimulated"
  | "recovering"
  | "quiet"
  | "even"
  | "chaotic"
  | "stuck"
  | "unknown";

export type SymbolicInputSummary = {
  id: string;
  createdAt: string;
  layerId: PassportDataLayerId;
  kind:
    | "audio_summary"
    | "app_activity_summary"
    | "movement_summary"
    | "location_summary"
    | "journal_summary"
    | "calendar_summary"
    | "device_state_summary"
    | "system_summary"
    | "test"
    | "private"
    | string;
  title?: string;
  summary: string;
  tags?: string[];
  moodHint?: GenesisMoodState;
  intensity?: number;
  rhythmHint?: RhythmState;
  isUserApproved?: boolean;
  containsSensitiveRawData?: boolean;
};

export type SymbolicInferenceConfig = {
  allowShadowCandidates: boolean;
  allowLegacyCandidates: boolean;
  allowRitualSuggestions: boolean;
  allowCompanionContext: boolean;
  maxSignalsPerRun: number;
  minConfidenceForLifeMap: IntelligenceConfidence;
  minConfidenceForGround: IntelligenceConfidence;
  minConfidenceForMirror: IntelligenceConfidence;
};

export type MoodRhythmScore = {
  moodState: GenesisMoodState;
  rhythmState: RhythmState;
  moodScore: number;
  rhythmScore: number;
  recoveryScore: number;
  overloadScore: number;
  confidence: IntelligenceConfidence;
  generatedAt: string;
};
