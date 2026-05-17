import type {
  DreamSymbol,
  LegacyThread,
  LifeConstellation,
  LifeMapCollections,
  MemoryStar,
  NebulaRegion,
  RecoveryPath,
  RelationshipBody,
  ReplaySequence,
  ShadowThread,
  SpatialARVRScaffold,
} from "./types";
import { defaultCameraPathRecords } from "./camera-paths";
import { mapRecoveryToPathState, mapRelationshipStrengthToOrbit } from "./visual-mapping";

const now = () => new Date().toISOString();

export const selectedBlueFogMemory: MemoryStar = {
  id: "blue-fog-memory",
  userId: "demo-user",
  type: "grief",
  title: "Blue Fog Memory",
  subtitle: "quiet grief marker",
  timestamp: new Date().toISOString(),
  emotionalTags: ["grief", "longing", "soft sadness"],
  symbolicTags: ["blue fog", "memory weight", "quiet marker"],
  position3D: { x: -3.2, y: 0.6, z: 0.2 },
  scale: 1.35,
  color: "#bfe9ff",
  glow: 0.92,
  intensity: 0.74,
  relatedIds: ["soft-return", "winter-thread"],
  constellationId: "grief-thread",
  privacyLevel: "private",
  sourceSignals: ["audio", "mood", "timeline"],
  narratorText: "This memory carried weight, so URAI rendered it softly.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const star = (
  id: string,
  type: MemoryStar["type"],
  title: string,
  subtitle: string,
  x: number,
  y: number,
  z: number,
  tags: string[],
  symbols: string[],
  color: string,
  constellationId: string,
  narratorText?: string,
): MemoryStar => ({
  id,
  userId: "demo-user",
  type,
  title,
  subtitle,
  timestamp: now(),
  emotionalTags: tags,
  symbolicTags: symbols,
  position3D: { x, y, z },
  scale: 1,
  color,
  glow: 0.7,
  intensity: 0.7,
  relatedIds: [],
  constellationId,
  privacyLevel: "private",
  sourceSignals: ["audio", "mood", "timeline"],
  narratorText,
  createdAt: now(),
  updatedAt: now(),
});

const fromStarBase = (base: MemoryStar, overrideType: string) => ({
  ...base,
  type: overrideType,
});

export const memoryStars: MemoryStar[] = [
  selectedBlueFogMemory,
  star("soft-return", "recovery", "Soft Return", "first green-gold recovery thread", -1.4, 0.2, -0.4, ["recovery", "relief"], ["green path"], "#86efac", "recovery-thread", "A recovery path is forming near this cluster."),
  star("winter-thread", "memory", "Winter Thread", "seasonal emotional pattern", -4.3, 1.2, -1.1, ["winter", "reflection"], ["season"], "#dbeafe", "grief-thread"),
  star("threshold-door", "threshold", "Threshold Door", "crossing into a new chapter", 0.2, 0.8, -0.8, ["threshold", "change"], ["door", "crossing"], "#fbbf24", "threshold-thread", "This was not just a memory. It became a crossing."),
  star("mirror-self", "mirror", "Mirror Self", "identity insight", 1.7, 0.5, -0.2, ["identity", "clarity"], ["mirror"], "#f8fafc", "mirror-thread"),
  star("joy-spark", "joy", "Joy Spark", "small bright proof", 2.9, 0.9, -0.7, ["joy", "warmth"], ["spark"], "#fde68a", "joy-thread"),
  star("dream-orchid", "dream", "Dream Orchid", "violet dream-symbol", -0.8, 1.7, -1.7, ["dream", "symbol"], ["orchid", "violet cloud"], "#c084fc", "dream-thread"),
  star("orbit-close", "relationship", "Close Orbit", "relationship moved nearer", 3.5, -0.3, 0.4, ["relationship", "trust"], ["orbit"], "#f9a8d4", "relationship-thread", "This relationship has moved closer in your orbit."),
  star("shadow-loop", "shadow", "Shadow Loop", "unresolved repeated pattern", -2.2, -1.0, -1.2, ["stress", "conflict"], ["loop", "shadow cluster"], "#64748b", "shadow-thread", "You returned to this pattern more than once. That matters."),
  star("legacy-gold", "legacy", "Legacy Gold", "ancestral thread marker", 4.3, 1.1, -1.0, ["legacy", "family"], ["gold thread"], "#facc15", "legacy-thread"),
  star("purpose-north", "purpose", "Purpose North", "direction becoming visible", 0.9, 1.9, -2.1, ["purpose", "focus"], ["north star"], "#67e8f9", "becoming-thread"),
  star("companion-watch", "companion", "Companion Watch", "URAI stayed close", -0.1, -0.9, 0.9, ["companion", "care"], ["watcher"], "#93c5fd", "becoming-thread"),
  star("rebirth-bloom", "rebirth", "Rebirth Bloom", "breakthrough supernova", 2.2, -1.2, -0.9, ["breakthrough", "rebirth"], ["supernova bloom"], "#fb7185", "rebirth-thread"),
  star("quiet-ritual", "ritual", "Quiet Ritual", "small ritual anchor", -3.6, -0.6, 0.8, ["ritual", "grounding"], ["anchor"], "#c4b5fd", "recovery-thread"),
  star("work-flare", "memory", "Work Flare", "stress shimmer resolved", 1.0, -1.5, 1.2, ["stress", "focus"], ["red-orange shimmer"], "#fb923c", "shadow-thread"),
];

export const relationshipBodies: RelationshipBody[] = ["Friend Orbit", "Family Moon", "Creative Partner", "Past Echo"].map((title, index) => {
  const strength = [0.88, 0.72, 0.65, 0.34][index] ?? 0.5;
  return {
    id: `relationship-body-${index + 1}`,
    userId: "demo-user",
    type: "relationshipBody",
    title,
    subtitle: "orbiting relationship signal",
    timestamp: now(),
    emotionalTags: ["relationship"],
    symbolicTags: ["orbit"],
    position3D: { x: 0, y: index * 0.15 - 0.25, z: 0 },
    scale: 1,
    color: ["#f9a8d4", "#fde68a", "#93c5fd", "#94a3b8"][index] ?? "#f9a8d4",
    glow: strength,
    intensity: strength,
    relatedIds: [],
    privacyLevel: "private",
    sourceSignals: ["calls", "messages", "audio"],
    createdAt: now(),
    updatedAt: now(),
    relationshipId: `rel-${index + 1}`,
    orbitRadius: mapRelationshipStrengthToOrbit(strength),
    orbitSpeed: 0.08 + index * 0.025,
    strength,
    associationVisible: true,
  };
});

export const recoveryPaths: RecoveryPath[] = [0.28, 0.64, 0.91].map((score, index) => ({
  id: `recovery-path-${index + 1}`,
  userId: "demo-user",
  type: "recoveryPath",
  title: ["Recovery Forming", "Recovery Active", "Recovery Stabilized"][index] ?? "Recovery Path",
  subtitle: "green-gold healing pathway",
  timestamp: now(),
  emotionalTags: ["recovery"],
  symbolicTags: ["green", "gold", "path"],
  position3D: { x: -2 + index * 1.5, y: -0.45, z: 0.3 },
  scale: 1,
  color: "#86efac",
  glow: score,
  intensity: score,
  relatedIds: ["soft-return", "quiet-ritual"],
  privacyLevel: "private",
  sourceSignals: ["mood", "timeline"],
  createdAt: now(),
  updatedAt: now(),
  recoveryScore: score,
  pathState: mapRecoveryToPathState(score),
  starIds: ["soft-return", "quiet-ritual", "blue-fog-memory"],
}));

export const spatialARVRScaffold: SpatialARVRScaffold = {
  webXR: "Future WebXR scene entry point for immersive browser memory galaxies.",
  unityExportPath: "Future Unity export bridge for URAI Spatial planetarium scenes.",
  visionPro: "Future Vision Pro volume where users can stand inside nebula fields.",
  metaQuest: "Future Meta Quest build target with reach interaction around stars.",
  mobileAR: "Future mobile AR layer for placing memory constellations in a room.",
  spatialPortals: "Future spatial portals between grief, dream, mirror, and legacy universes.",
  reachInteraction: "Future hand/reach gestures for opening memory cards.",
  walkingAroundStars: "Future locomotion scaffold for walking around memory stars.",
  standingInsideNebulaFields: "Future mode for standing inside emotional season fog.",
};

const lifeConstellations: LifeConstellation[] = [
  { id: "grief-thread", theme: "Grief", starIds: ["blue-fog-memory", "winter-thread", "soft-return"], lineColor: "#bfe9ff" },
  { id: "recovery-thread", theme: "Recovery", starIds: ["quiet-ritual", "soft-return", "blue-fog-memory"], lineColor: "#86efac" },
  { id: "relationship-thread", theme: "Relationships", starIds: ["orbit-close", "companion-watch"], lineColor: "#f9a8d4" },
  { id: "dream-thread", theme: "Dream Field", starIds: ["dream-orchid", "mirror-self"], lineColor: "#c084fc" },
  { id: "mirror-thread", theme: "Mirror", starIds: ["mirror-self", "purpose-north"], lineColor: "#f8fafc" },
  { id: "shadow-thread", theme: "Shadow", starIds: ["shadow-loop", "work-flare", "threshold-door"], lineColor: "#64748b" },
  { id: "legacy-thread", theme: "Legacy", starIds: ["legacy-gold", "purpose-north"], lineColor: "#facc15" },
  { id: "rebirth-thread", theme: "Rebirth", starIds: ["threshold-door", "rebirth-bloom", "joy-spark"], lineColor: "#fb7185" },
].map((thread) => ({
  ...thread,
  userId: "demo-user",
  title: thread.theme,
  lineOpacity: 0.36,
  narratorText: "This thread appears often before recovery begins.",
  patternFrequency: 0.7,
  privacyLevel: "private",
  createdAt: now(),
  updatedAt: now(),
}));

const nebulaRegions: NebulaRegion[] = ["Grief Fog", "Stress Shimmer", "Dream Cloud", "Mirror Field", "Legacy Gold", "Recovery Glow"].map((title, i) => ({
  id: `nebula-${i + 1}`,
  userId: "demo-user",
  type: "emotionalSeason",
  title,
  timestamp: now(),
  emotionalTags: [title.toLowerCase()],
  symbolicTags: ["nebula"],
  position3D: { x: -3 + i * 1.2, y: i % 2 ? 0.7 : -0.3, z: -2.3 },
  scale: 1,
  color: ["#3b82f6", "#fb923c", "#a855f7", "#f8fafc", "#facc15", "#22c55e"][i] ?? "#3b82f6",
  glow: 0.5,
  intensity: 0.5,
  relatedIds: [],
  privacyLevel: "private",
  sourceSignals: ["mood"],
  createdAt: now(),
  updatedAt: now(),
  radius: 1.1 + i * 0.15,
  seasonLabel: title,
}));

const dreamSymbols: DreamSymbol[] = ["Orchid", "Violet Door", "Moon Water"].map((title, i) => ({
  ...fromStarBase(star(`dream-symbol-${i + 1}`, "dream", title, "dream symbolic cloud", -1 + i, 2, -1.8, ["dream"], [title], "#c084fc", "dream-thread"), "dreamSymbol"),
  symbolKind: title,
}));

const shadowThreads: ShadowThread[] = ["Shame Loop", "Conflict Echo"].map((title, i) => ({
  ...fromStarBase(star(`shadow-thread-${i + 1}`, "shadow", title, "dim unresolved cluster", -2 + i, -1.5, -1.4, ["stress"], ["shadow"], "#64748b", "shadow-thread"), "shadowThread"),
  unresolvedLoopScore: 0.6 + i * 0.2,
}));

const legacyThreads: LegacyThread[] = ["Ancestor Gold", "Future Letter"].map((title, i) => ({
  ...fromStarBase(star(`legacy-thread-${i + 1}`, "legacy", title, "gold ancestral thread", 3 + i, 1.4, -1, ["legacy"], ["gold thread"], "#facc15", "legacy-thread"), "legacyThread"),
  ancestralTone: "gold",
}));

const replaySequences: ReplaySequence[] = [
  {
    ...fromStarBase(star("replay-blue-thread", "memory", "Blue Thread Replay", "camera path through grief and recovery", 0, 0, 0, ["replay"], ["camera path"], "#bfe9ff", "grief-thread"), "replaySequence"),
    starIds: ["blue-fog-memory", "soft-return", "quiet-ritual"],
    cameraPathId: "replay",
    durationMs: 3600,
  },
];

export const lifeMapMockData: LifeMapCollections = {
  memoryStars,
  lifeConstellations,
  nebulaRegions,
  emotionalGalaxies: [],
  relationshipBodies,
  dreamSymbols,
  shadowThreads,
  recoveryPaths,
  legacyThreads,
  narratorInsights: [],
  replaySequences,
  spatialCameraPaths: defaultCameraPathRecords,
  userLifeMapSettings: {
    id: "settings-demo-user",
    userId: "demo-user",
    defaultMode: "memoryGalaxy",
    qualityMode: "high",
    reducedMotion: false,
    textOnlyFallback: false,
    emotionalSafetyMode: false,
    highContrast: false,
    localOnlyMode: false,
    hiddenStarIds: [],
    blurredStarIds: [],
    removedRelationshipIds: [],
    createdAt: now(),
    updatedAt: now(),
  },
  exportedScrolls: [],
};
