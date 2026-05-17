import type { LifeMapChapter, LifeMapConstellation, LifeMapDataset, LifeMapLayer, LifeMapLayerId, LifeMapStar, MemoryBloom, RelationshipThread, RitualThread, SpatialSettings } from "./lifeMap.types";

const layer = (id: LifeMapLayerId, name: string, icon: string, color: string, depth: number, description: string): LifeMapLayer => ({ id, name, icon, color, enabled: true, opacity: 1, depth, description });

export const defaultLifeMapLayers: LifeMapLayer[] = [
  layer("memories", "Memories", "*", "#bfe9ff", 0, "Personal memory stars and quiet life moments."),
  layer("emotionalPeaks", "Peaks", "◆", "#f9a8d4", 1, "High-intensity emotional events."),
  layer("relationships", "Relationships", "o", "#f0abfc", 2, "People, attachment, and social orbit patterns."),
  layer("rituals", "Rituals", "☾", "#c4b5fd", 2, "Grounding rituals and symbolic repair anchors."),
  layer("seasons", "Seasons", "◐", "#93c5fd", 3, "Seasonal emotional weather and chapter climates."),
  layer("shadowPatterns", "Shadow", "◇", "#94a3b8", 4, "Unresolved loops and shadow signals."),
  layer("recoveryBlooms", "Recovery", "✺", "#86efac", 1, "Healing arcs and recovery blooms."),
  layer("dreams", "Dreams", "✧", "#c084fc", 5, "Dream-symbols and subconscious weather."),
  layer("bodyHealth", "Body", "◍", "#5eead4", 3, "Somatic, sleep, motion, and body signals."),
  layer("socialConstellations", "Social", "◎", "#fda4af", 3, "Social clusters and familiar voice orbits."),
  layer("lifeChapters", "Chapters", "⬡", "#fde68a", 6, "Major eras and mythic life chapters."),
  layer("futureForecasts", "Forecasts", "+", "#67e8f9", 7, "Predicted rhythms and future weather."),
  layer("legacyThreads", "Legacy", "∞", "#facc15", 6, "Family, ancestry, and long arc meaning."),
];

const star = (partial: Partial<LifeMapStar> & Pick<LifeMapStar, "id" | "title" | "type" | "layer" | "position3D" | "auraColor" | "constellationId" | "chapterId">): LifeMapStar => ({
  date: "2026-01-01",
  emotionalTone: "quiet wonder",
  intensity: 0.72,
  twinkleSpeed: 1.4,
  size: 1,
  glyph: "*",
  relatedStarIds: [],
  sourceSignals: ["audio", "mood", "timeline"],
  narratorReflection: "This memory carried weight, so URAI rendered it softly.",
  archetype: "Witness",
  relationshipIds: [],
  ritualIds: [],
  isShadowMoment: false,
  isRecoveryBloom: false,
  isMilestone: false,
  isForecast: false,
  privacyLevel: "private",
  ...partial,
});

export const spatialLifeMapStars: LifeMapStar[] = [
  star({ id: "blue-fog-memory", title: "Blue Fog Memory", type: "memory", layer: "memories", position3D: { x: -3.8, y: 0.4, z: 0.2 }, auraColor: "#bfe9ff", constellationId: "grief-thread", chapterId: "winter-becoming", emotionalTone: "quiet grief", intensity: 0.82, size: 1.6, glyph: "*", relatedStarIds: ["soft-return", "winter-thread"], archetype: "The Witness" }),
  star({ id: "winter-thread", title: "Winter Thread", type: "season", layer: "seasons", position3D: { x: -5.9, y: 1.6, z: -2.8 }, auraColor: "#93c5fd", constellationId: "grief-thread", chapterId: "winter-becoming", emotionalTone: "seasonal memory", intensity: 0.6, size: 1.1, glyph: "◐" }),
  star({ id: "soft-return", title: "Soft Return", type: "recovery", layer: "recoveryBlooms", position3D: { x: -1.8, y: -1.1, z: -0.7 }, auraColor: "#86efac", constellationId: "recovery-thread", chapterId: "winter-becoming", emotionalTone: "relief", intensity: 0.74, size: 1.35, glyph: "✺", isRecoveryBloom: true }),
  star({ id: "quiet-ritual", title: "Quiet Ritual", type: "ritual", layer: "rituals", position3D: { x: -4.7, y: -1.7, z: 1.2 }, auraColor: "#c4b5fd", constellationId: "recovery-thread", chapterId: "winter-becoming", emotionalTone: "grounding", intensity: 0.64, size: 1, glyph: "☾", ritualIds: ["breath-anchor"] }),
  star({ id: "threshold-door", title: "Threshold Door", type: "milestone", layer: "emotionalPeaks", position3D: { x: 0.2, y: 1.8, z: -1.1 }, auraColor: "#fbbf24", constellationId: "threshold-thread", chapterId: "crossing", emotionalTone: "crossing", intensity: 0.9, size: 1.5, glyph: "◆", isMilestone: true, narratorReflection: "This was a crossing point, not a diagnosis." }),
  star({ id: "mirror-self", title: "Mirror Self", type: "chapter", layer: "lifeChapters", position3D: { x: 2.0, y: 1.2, z: -1.8 }, auraColor: "#f8fafc", constellationId: "mirror-thread", chapterId: "crossing", emotionalTone: "identity clarity", intensity: 0.78, size: 1.25, glyph: "⬡" }),
  star({ id: "close-orbit", title: "Close Orbit", type: "relationship", layer: "relationships", position3D: { x: 4.6, y: -0.2, z: 0.7 }, auraColor: "#f9a8d4", constellationId: "relationship-thread", chapterId: "social-weather", emotionalTone: "trust", intensity: 0.72, size: 1.15, glyph: "o", relationshipIds: ["close-friend"] }),
  star({ id: "shadow-loop", title: "Shadow Loop", type: "shadow", layer: "shadowPatterns", position3D: { x: -2.4, y: -2.5, z: -2.1 }, auraColor: "#94a3b8", constellationId: "shadow-thread", chapterId: "crossing", emotionalTone: "unresolved friction", intensity: 0.69, size: 1.2, glyph: "◇", isShadowMoment: true }),
  star({ id: "dream-orchid", title: "Dream Orchid", type: "dream", layer: "dreams", position3D: { x: -0.8, y: 3.2, z: -3.2 }, auraColor: "#c084fc", constellationId: "dream-thread", chapterId: "dream-field", emotionalTone: "violet symbol", intensity: 0.66, size: 1.1, glyph: "✧" }),
  star({ id: "legacy-gold", title: "Legacy Gold", type: "legacy", layer: "legacyThreads", position3D: { x: 6.0, y: 2.1, z: -3.8 }, auraColor: "#facc15", constellationId: "legacy-thread", chapterId: "legacy-arc", emotionalTone: "ancestral warmth", intensity: 0.82, size: 1.3, glyph: "∞" }),
  star({ id: "body-rhythm", title: "Body Rhythm", type: "body", layer: "bodyHealth", position3D: { x: 1.2, y: -2.9, z: 1.6 }, auraColor: "#5eead4", constellationId: "body-thread", chapterId: "social-weather", emotionalTone: "somatic calm", intensity: 0.58, size: 1, glyph: "◍" }),
  star({ id: "future-weather", title: "Future Weather", type: "forecast", layer: "futureForecasts", position3D: { x: 3.9, y: 2.9, z: -5.2 }, auraColor: "#67e8f9", constellationId: "forecast-thread", chapterId: "future-arc", emotionalTone: "emerging forecast", intensity: 0.62, size: 1.05, glyph: "+", isForecast: true }),
];

export const spatialLifeMapConstellations: LifeMapConstellation[] = [
  { id: "grief-thread", title: "Grief Thread", theme: "Quiet grief to meaning", era: "Winter", stars: ["blue-fog-memory", "winter-thread", "soft-return"], emotionalArc: "grief to recognition to return", color: "#bfe9ff", glyph: "*", centerPosition: { x: -3.7, y: 0.3, z: -1 }, narratorSummary: "A quiet grief thread became visible before recovery began." },
  { id: "recovery-thread", title: "Recovery Bloom", theme: "Grounding and repair", era: "Spring", stars: ["soft-return", "quiet-ritual", "blue-fog-memory"], emotionalArc: "tension to breath to softening", color: "#86efac", glyph: "✺", centerPosition: { x: -2.9, y: -1.8, z: 0.2 }, narratorSummary: "A recovery path is forming around ritual and return." },
  { id: "threshold-thread", title: "Threshold Before Clarity", theme: "Crossing", era: "Now", stars: ["threshold-door", "mirror-self", "shadow-loop"], emotionalArc: "pressure to threshold to clarity", color: "#fbbf24", glyph: "◆", centerPosition: { x: 0, y: 0.8, z: -1.4 }, narratorSummary: "This threshold had weight, but it was not a diagnosis." },
  { id: "relationship-thread", title: "Close Orbit", theme: "Trust and distance", era: "Social", stars: ["close-orbit", "body-rhythm"], emotionalArc: "distance to closeness to integration", color: "#f9a8d4", glyph: "o", centerPosition: { x: 3.5, y: -0.9, z: 1.1 }, narratorSummary: "This relationship moved nearer in your symbolic orbit." },
  { id: "dream-thread", title: "Dream Field", theme: "Subconscious symbols", era: "Night", stars: ["dream-orchid", "mirror-self"], emotionalArc: "symbol to mirror to insight", color: "#c084fc", glyph: "✧", centerPosition: { x: 0.2, y: 2.6, z: -2.8 }, narratorSummary: "Dream symbols are gathering near identity signals." },
  { id: "legacy-thread", title: "Legacy Thread", theme: "Long arc memory", era: "Legacy", stars: ["legacy-gold", "future-weather"], emotionalArc: "past to inheritance to future", color: "#facc15", glyph: "∞", centerPosition: { x: 4.9, y: 2.5, z: -4.4 }, narratorSummary: "A gold thread connects ancestry with future direction." },
];

export const spatialLifeMapChapters: LifeMapChapter[] = [
  { id: "winter-becoming", title: "Winter Becoming", startDate: "2025-12-01", endDate: "2026-02-28", dominantEmotion: "quiet grief", archetype: "Witness", constellationIds: ["grief-thread", "recovery-thread"], summary: "A season of quiet memory and gentle recovery.", visualTheme: "blue fog and green-gold recovery light" },
  { id: "crossing", title: "Threshold Before Clarity", startDate: "2026-03-01", dominantEmotion: "crossing", archetype: "Threshold Keeper", constellationIds: ["threshold-thread"], summary: "The pressure point that became a crossing.", visualTheme: "amber doorway and mirror glass" },
  { id: "social-weather", title: "Social Weather", startDate: "2026-04-01", dominantEmotion: "trust", archetype: "Orbit Builder", constellationIds: ["relationship-thread"], summary: "A social constellation that moved closer to the body.", visualTheme: "rose orbit and teal body rhythm" },
  { id: "dream-field", title: "Dream Field", startDate: "2026-04-20", dominantEmotion: "symbolic wonder", archetype: "Dream Listener", constellationIds: ["dream-thread"], summary: "Dream symbols begin to organize into a mirror.", visualTheme: "violet clouds and lunar water" },
  { id: "legacy-arc", title: "Legacy Arc", startDate: "2026-05-01", dominantEmotion: "gold continuity", archetype: "Ancestor Thread", constellationIds: ["legacy-thread"], summary: "Long-arc memories begin to form a golden inheritance thread.", visualTheme: "gold thread and distant horizon" },
  { id: "future-arc", title: "Future Forecast", startDate: "2026-06-01", dominantEmotion: "emerging clarity", archetype: "Weather Seer", constellationIds: ["legacy-thread"], summary: "Future rhythms begin to shimmer as forecast stars.", visualTheme: "cyan forecast haze" },
];

export const spatialMemoryBlooms: MemoryBloom[] = spatialLifeMapStars.map((item) => ({
  id: `${item.id}-bloom`,
  starId: item.id,
  auraAnimation: "breathing bloom, halo expansion, thread trace",
  narratorScript: item.narratorReflection,
  timelineFragments: ["signal gathered", "pattern softened", "memory placed in the sky"],
  symbolicTags: [item.glyph, item.archetype, item.emotionalTone],
  relationshipContext: item.relationshipIds,
  ritualPrompts: item.ritualIds.length ? ["Breathe once and let this ritual anchor settle."] : ["Name what this star is asking you to notice."],
  whyThisMatters: "URAI surfaced this because its intensity, recurrence, and relationship to nearby stars made it meaningful.",
}));

export const spatialRelationshipThreads: RelationshipThread[] = [{ id: "close-friend", title: "Close Friend Orbit", starIds: ["close-orbit", "body-rhythm"], tone: "warm trust", orbitStrength: 0.82 }];
export const spatialRitualThreads: RitualThread[] = [{ id: "breath-anchor", title: "Breath Anchor", starIds: ["quiet-ritual", "soft-return"], ritualType: "grounding" }];

export const defaultSpatialSettings: SpatialSettings = {
  userId: "demo-user",
  cameraTarget: { x: 0, y: 0, z: 0 },
  zoom: 7.5,
  activeLayerIds: defaultLifeMapLayers.map((item) => item.id),
  reducedMotion: false,
};

export const spatialLifeMapMockData: LifeMapDataset = {
  stars: spatialLifeMapStars,
  constellations: spatialLifeMapConstellations,
  layers: defaultLifeMapLayers,
  chapters: spatialLifeMapChapters,
  memoryBlooms: spatialMemoryBlooms,
  relationshipThreads: spatialRelationshipThreads,
  ritualThreads: spatialRitualThreads,
  spatialSettings: defaultSpatialSettings,
};
