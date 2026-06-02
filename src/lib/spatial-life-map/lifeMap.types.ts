export type LifeMapStarType =
  | "memory"
  | "ritual"
  | "emotionalPeak"
  | "relationship"
  | "milestone"
  | "recovery"
  | "shadow"
  | "dream"
  | "season"
  | "body"
  | "social"
  | "chapter"
  | "forecast"
  | "legacy";

export type LifeMapLayerId =
  | "memories"
  | "emotionalPeaks"
  | "relationships"
  | "rituals"
  | "seasons"
  | "shadowPatterns"
  | "recoveryBlooms"
  | "dreams"
  | "bodyHealth"
  | "socialConstellations"
  | "lifeChapters"
  | "futureForecasts"
  | "legacyThreads";

export type LifeMapZoomLevel = 0 | 1 | 2 | 3 | 4;
export type LifeMapPrivacyLevel = "private" | "localOnly" | "anonymized" | "shareable";

export interface Vector3Tuple {
  x: number;
  y: number;
  z: number;
}

export interface LifeMapStar {
  id: string;
  title: string;
  date: string;
  type: LifeMapStarType;
  layer: LifeMapLayerId;
  position3D: Vector3Tuple;
  emotionalTone: string;
  intensity: number;
  auraColor: string;
  twinkleSpeed: number;
  size: number;
  glyph: string;
  chapterId: string;
  constellationId: string;
  relatedStarIds: string[];
  sourceSignals: string[];
  narratorReflection: string;
  archetype: string;
  relationshipIds: string[];
  ritualIds: string[];
  isShadowMoment: boolean;
  isRecoveryBloom: boolean;
  isMilestone: boolean;
  isForecast: boolean;
  privacyLevel: LifeMapPrivacyLevel;
}

export interface LifeMapConstellation {
  id: string;
  title: string;
  theme: string;
  era: string;
  stars: string[];
  emotionalArc: string;
  color: string;
  glyph: string;
  centerPosition: Vector3Tuple;
  narratorSummary: string;
}

export interface LifeMapLayer {
  id: LifeMapLayerId;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  opacity: number;
  depth: number;
  description: string;
}

export interface LifeMapChapter {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  dominantEmotion: string;
  archetype: string;
  constellationIds: string[];
  summary: string;
  visualTheme: string;
}

export interface MemoryBloom {
  id: string;
  starId: string;
  auraAnimation: string;
  narratorScript: string;
  timelineFragments: string[];
  symbolicTags: string[];
  relationshipContext: string[];
  ritualPrompts: string[];
  whyThisMatters: string;
}

export interface RelationshipThread {
  id: string;
  title: string;
  starIds: string[];
  tone: string;
  orbitStrength: number;
}

export interface RitualThread {
  id: string;
  title: string;
  starIds: string[];
  ritualType: string;
  completedAt?: string;
}

export interface SpatialSettings {
  userId: string;
  cameraTarget: Vector3Tuple;
  zoom: number;
  activeLayerIds: LifeMapLayerId[];
  reducedMotion: boolean;
  lastOpenedStarId?: string;
}

export interface LifeMapDataset {
  stars: LifeMapStar[];
  constellations: LifeMapConstellation[];
  layers: LifeMapLayer[];
  chapters: LifeMapChapter[];
  memoryBlooms: MemoryBloom[];
  relationshipThreads: RelationshipThread[];
  ritualThreads: RitualThread[];
  spatialSettings: SpatialSettings;
}

export interface GalaxyCameraState {
  target: Vector3Tuple;
  rotation: Vector3Tuple;
  zoom: number;
  zoomLevel: LifeMapZoomLevel;
}

export interface StarSelectionState {
  hoveredStarId: string | null;
  selectedStarId: string | null;
  bloomStarId: string | null;
}
