export type LifeMapTone =
  | 'calm'
  | 'clarity'
  | 'joy'
  | 'grief'
  | 'stress'
  | 'recovery'
  | 'dream'
  | 'shadow'
  | 'threshold'
  | 'rebirth'
  | 'connection'
  | 'focus';

export type LifeMapStarType =
  | 'emotional_moment'
  | 'relationship_moment'
  | 'recovery_moment'
  | 'ritual_completion'
  | 'stress_spike'
  | 'grief_marker'
  | 'joy_marker'
  | 'clarity_marker'
  | 'life_chapter_marker'
  | 'important_place'
  | 'recurring_pattern'
  | 'urai_insight'
  | 'council_message'
  | 'threshold_moment'
  | 'sleep_shift'
  | 'social_silence'
  | 'repair_moment'
  | 'growth_marker';

export type LifeMapChapterId =
  | 'becoming'
  | 'threshold'
  | 'recovery'
  | 'relationships'
  | 'dream-field'
  | 'shadow'
  | 'mirror';

export type LifeMapPrivacyLevel = 'private' | 'sensitive' | 'safeSummary' | 'shareable';

export type LifeMapSignalType =
  | 'audioTranscript'
  | 'emotionTag'
  | 'voiceRecognition'
  | 'gps'
  | 'motion'
  | 'appUsage'
  | 'sleep'
  | 'calendarPattern'
  | 'habitSignal'
  | 'socialInteraction'
  | 'relationshipSignal'
  | 'physicalHealth'
  | 'shadowMetric'
  | 'obscuraPattern'
  | 'thresholdIndicator'
  | 'recoveryPattern';

export type Timestampish = string | number | Date | null;

export type LifeMapPosition = {
  x: number;
  y: number;
  z: number;
};

export type LifeMapVisualState = {
  size: number;
  brightness: number;
  pulseSpeed: number;
  auraRadius: number;
  particleDensity: number;
  lineWeight: number;
};

export type PassiveSignal = {
  id: string;
  signalType: LifeMapSignalType;
  capturedAt: Timestampish;
  source: string;
  normalizedSummary: string;
  payload?: Record<string, unknown>;
  privacyLevel: LifeMapPrivacyLevel;
  consentScope: string[];
  processed: boolean;
};

export type LifeMapEvent = {
  id: string;
  eventType: string;
  title: string;
  summary: string;
  timestamp: Timestampish;
  sourceSignalIds: string[];
  relatedPeopleIds: string[];
  emotions: LifeMapTone[];
  dominantEmotion: LifeMapTone;
  emotionalIntensity: number;
  confidence: number;
  importanceScore: number;
  symbolicTheme: string;
  suggestedStarType: LifeMapStarType;
  shouldCreateStar: boolean;
  privacyLevel: LifeMapPrivacyLevel;
};

export type MemoryStar = {
  id: string;
  lifeEventId?: string;
  title: string;
  subtitle: string;
  description: string;
  starType: LifeMapStarType;
  timestamp: Timestampish;
  chapterId: LifeMapChapterId;
  constellationIds: string[];
  emotionalTone: LifeMapTone;
  emotionalIntensity: number;
  auraColor: string;
  glyphType: string;
  importanceScore: number;
  confidence: number;
  position: LifeMapPosition;
  visual: LifeMapVisualState;
  relatedPeopleIds: string[];
  relatedTags: string[];
  sourceSignalIds: string[];
  narratorLine: string;
  privacyLevel: LifeMapPrivacyLevel;
  isVisible: boolean;
  isUnread: boolean;
};

export type LifeMapConstellation = {
  id: string;
  title: string;
  constellationType:
    | 'life_chapter'
    | 'seasonal_arc'
    | 'relationship_arc'
    | 'recovery_arc'
    | 'ritual_chain'
    | 'stress_pattern'
    | 'grief_thread'
    | 'growth_path'
    | 'identity_shift'
    | 'recurring_loop'
    | 'threshold_to_rebirth';
  starIds: string[];
  chapterId: LifeMapChapterId;
  summary: string;
  dominantEmotions: LifeMapTone[];
  symbolicTheme: string;
  confidence: number;
  lineColor: string;
  glow: number;
  narratorLine: string;
};

export type MemoryBloom = {
  id: string;
  starId: string;
  title: string;
  shortCopy: string;
  longCopy: string;
  narratorReflection: string;
  whyThis: {
    explanation: string;
    sourceCategories: LifeMapSignalType[];
    confidence: number;
    privacyNote: string;
  };
  emotionalTone: LifeMapTone;
  symbolicTheme: string;
  relatedStarIds: string[];
  ritualSuggestionIds: string[];
  replayScript: string[];
};

export type Ritual = {
  id: string;
  title: string;
  ritualType: 'recovery' | 'closure' | 'reflection' | 'relationshipRepair' | 'threshold' | 'seasonalReset' | 'rebirth';
  description: string;
  linkedStarIds: string[];
  linkedConstellationId?: string;
  status: 'suggested' | 'accepted' | 'completed' | 'dismissed';
  visualGlyph: string;
  auraColor: string;
  narratorLine: string;
};

export type NarratorInsight = {
  id: string;
  insightType: 'star' | 'constellation' | 'chapter' | 'recovery' | 'relationship' | 'threshold' | 'weeklyScroll' | 'mirror';
  targetId: string;
  text: string;
  voiceStyle: 'soft' | 'grounded' | 'warm' | 'minimal' | 'protective';
  emotionalTone: LifeMapTone;
  safetyLevel: 'normal' | 'sensitive' | 'crisisSafe';
  sourceIds: string[];
  confidence: number;
};

export type SocialGraphNode = {
  id: string;
  personId: string;
  alias: string;
  relationshipType: string;
  interactionCount30d: number;
  warmthScore: number;
  tensionScore: number;
  trustSignal: number;
  repairSignal: number;
  silenceDeltaDays: number;
  orbitStrength: number;
};

export type RecoveryArc = {
  id: string;
  recoveryType: 'emotional' | 'social' | 'sleep' | 'physical' | 'cognitive';
  status: 'forming' | 'active' | 'bloomed' | 'archived';
  starIds: string[];
  score: number;
  narratorSummary: string;
};

export type SeasonalChapter = {
  id: LifeMapChapterId;
  title: string;
  subtitle: string;
  dominantEmotions: LifeMapTone[];
  symbolicTheme: string;
  summary: string;
  starIds: string[];
  constellationIds: string[];
  chapterColor: string;
  coverGlyph: string;
  narratorSummary: string;
  confidence: number;
  isActive: boolean;
};

export type MoodWeather = {
  id: string;
  period: 'day' | 'week' | 'month' | 'season';
  moodState: LifeMapTone;
  weatherType: 'clear' | 'fog' | 'rain' | 'aurora' | 'storm' | 'eclipse' | 'sunrise' | 'wind';
  intensity: number;
  palette: string[];
  summary: string;
  linkedStarIds: string[];
};

export type SymbolicOverlay = {
  id: string;
  overlayType: 'season' | 'shadow' | 'recovery' | 'relationship' | 'threshold' | 'ritual' | 'dream';
  title: string;
  intensity: number;
  color: string;
  starIds: string[];
};

export type ScrollExport = {
  id: string;
  exportType: 'weekly' | 'seasonal' | 'chapter' | 'star' | 'recovery' | 'relationship' | 'mirror';
  title: string;
  targetIds: string[];
  status: 'draft' | 'generating' | 'ready' | 'failed';
  format: 'json' | 'html' | 'image' | 'pdf' | 'video';
  redactionLevel: 'private' | 'safeShare' | 'publicDemo';
  generatedText: string;
};

export type CompanionState = {
  id: string;
  currentMood: LifeMapTone;
  voiceStyle: 'soft' | 'warm' | 'grounded' | 'protective' | 'minimal';
  orbColor: string;
  auraIntensity: number;
  trustLevel: number;
  currentPrompt: string;
  suggestedFocusStarId?: string;
  activeMode: 'home' | 'lifeMap' | 'focus' | 'replay' | 'threshold' | 'mirror';
};

export type LifeMapData = {
  stars: MemoryStar[];
  constellations: LifeMapConstellation[];
  blooms: MemoryBloom[];
  rituals: Ritual[];
  insights: NarratorInsight[];
  socialGraph: SocialGraphNode[];
  recoveryArcs: RecoveryArc[];
  chapters: SeasonalChapter[];
  moodWeather: MoodWeather[];
  overlays: SymbolicOverlay[];
  scrollExports: ScrollExport[];
  companion: CompanionState;
  source: 'firestore' | 'demo';
  loading: boolean;
  error?: string;
};
