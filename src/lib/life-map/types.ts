export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type PrivacyLevel = "private" | "blurred" | "shareable" | "legacy" | "localOnly";

export type LifeMapMode =
  | "memoryGalaxy"
  | "fullLifeUniverse"
  | "emotionalCosmos"
  | "relationshipGalaxy"
  | "dreamPlanetarium"
  | "shadowRealm"
  | "mirrorOfBecoming"
  | "legacyUniverse"
  | "spatialARVR";

export type MemoryStarType =
  | "memory"
  | "ritual"
  | "relationship"
  | "threshold"
  | "recovery"
  | "dream"
  | "mirror"
  | "shadow"
  | "legacy"
  | "joy"
  | "grief"
  | "purpose"
  | "companion"
  | "rebirth";

export type NarratorState =
  | "calm"
  | "reflective"
  | "protective"
  | "celebratory"
  | "grief-softened"
  | "dreamlike"
  | "threshold"
  | "recovery"
  | "mirror";

export type QualityMode = "low" | "medium" | "high" | "cinematic";

export type LifeMapFilter =
  | "All"
  | "Becoming"
  | "Threshold"
  | "Recovery"
  | "Relationships"
  | "Dream Field"
  | "Mirror"
  | "Grief"
  | "Joy"
  | "Purpose"
  | "Conflict"
  | "Legacy"
  | "Shadow"
  | "Rebirth";

export interface LifeMapBaseRecord {
  id: string;
  userId: string;
  type: string;
  title: string;
  subtitle?: string;
  timestamp: string;
  emotionalTags: string[];
  symbolicTags: string[];
  position3D: Vector3D;
  scale: number;
  color: string;
  glow: number;
  intensity: number;
  relatedIds: string[];
  constellationId?: string;
  privacyLevel: PrivacyLevel;
  sourceSignals: string[];
  narratorText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryStar extends LifeMapBaseRecord {
  type: MemoryStarType;
  hidden?: boolean;
  blurred?: boolean;
  clickCount?: number;
}

export interface LifeConstellation {
  id: string;
  userId: string;
  title: string;
  theme: LifeMapFilter;
  starIds: string[];
  lineColor: string;
  lineOpacity: number;
  narratorText: string;
  patternFrequency: number;
  privacyLevel: PrivacyLevel;
  createdAt: string;
  updatedAt: string;
}

export interface NebulaRegion extends LifeMapBaseRecord {
  type: "emotionalSeason";
  radius: number;
  seasonLabel: string;
}

export interface EmotionalGalaxy extends LifeMapBaseRecord {
  type: "emotionalGalaxy";
  dominantEmotion: string;
  starIds: string[];
}

export interface RelationshipBody extends LifeMapBaseRecord {
  type: "relationshipBody";
  relationshipId: string;
  orbitRadius: number;
  orbitSpeed: number;
  strength: number;
  associationVisible: boolean;
}

export interface DreamSymbol extends LifeMapBaseRecord {
  type: "dreamSymbol";
  symbolKind: string;
}

export interface ShadowThread extends LifeMapBaseRecord {
  type: "shadowThread";
  unresolvedLoopScore: number;
}

export interface RecoveryPath extends LifeMapBaseRecord {
  type: "recoveryPath";
  recoveryScore: number;
  pathState: "forming" | "active" | "stabilizing" | "complete";
  starIds: string[];
}

export interface LegacyThread extends LifeMapBaseRecord {
  type: "legacyThread";
  ancestralTone: string;
}

export interface NarratorInsight extends LifeMapBaseRecord {
  type: "narratorInsight";
  state: NarratorState;
  insightKind: string;
}

export interface CameraKeyframe {
  position: Vector3D;
  target: Vector3D;
  durationMs: number;
  easing: "linear" | "easeInOutCubic" | "easeOutQuart";
}

export interface ReplaySequence extends LifeMapBaseRecord {
  type: "replaySequence";
  starIds: string[];
  cameraPathId: string;
  durationMs: number;
}

export interface SpatialCameraPath {
  id: string;
  userId: string;
  mode: LifeMapMode;
  name: string;
  keyframes: CameraKeyframe[];
  createdAt: string;
  updatedAt: string;
}

export interface UserLifeMapSettings {
  id: string;
  userId: string;
  defaultMode: LifeMapMode;
  qualityMode: QualityMode;
  reducedMotion: boolean;
  textOnlyFallback: boolean;
  emotionalSafetyMode: boolean;
  highContrast: boolean;
  localOnlyMode: boolean;
  hiddenStarIds: string[];
  blurredStarIds: string[];
  removedRelationshipIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExportedScroll extends LifeMapBaseRecord {
  type: "exportedScroll";
  sourceStarIds: string[];
  anonymized: boolean;
  exportStatus: "draft" | "ready" | "exported";
}

export interface MemoryStarVisual {
  color: string;
  glowIntensity: number;
  particleTrail: string;
  haloShape: "soft" | "ring" | "crescent" | "mirror" | "flame" | "ancestral";
  pulseSpeed: number;
  clickAnimation: string;
  hoverState: string;
  narratorLine: string;
  constellationBehavior: string;
}

export interface PrivacyRenderBehavior {
  visible: boolean;
  blur: boolean;
  exportable: boolean;
  localOnly: boolean;
  label: string;
}

export interface LifeMapCollections {
  memoryStars: MemoryStar[];
  lifeConstellations: LifeConstellation[];
  nebulaRegions: NebulaRegion[];
  emotionalGalaxies: EmotionalGalaxy[];
  relationshipBodies: RelationshipBody[];
  dreamSymbols: DreamSymbol[];
  shadowThreads: ShadowThread[];
  recoveryPaths: RecoveryPath[];
  legacyThreads: LegacyThread[];
  narratorInsights: NarratorInsight[];
  replaySequences: ReplaySequence[];
  spatialCameraPaths: SpatialCameraPath[];
  userLifeMapSettings: UserLifeMapSettings;
  exportedScrolls: ExportedScroll[];
}

export interface SpatialARVRScaffold {
  webXR: string;
  unityExportPath: string;
  visionPro: string;
  metaQuest: string;
  mobileAR: string;
  spatialPortals: string;
  reachInteraction: string;
  walkingAroundStars: string;
  standingInsideNebulaFields: string;
}
