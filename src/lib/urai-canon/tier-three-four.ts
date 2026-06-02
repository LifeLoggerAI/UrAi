export type UraiConstellationPrivacy = "visible" | "private" | "vaulted" | "hidden" | "deleted";

export type UraiConstellationStar = {
  id: string;
  label: string;
  constellationId: string;
  lifeArea: string;
  state: "locked" | "unlocked" | "selected" | "legendary";
  privacy: UraiConstellationPrivacy;
  pinned: boolean;
  hidden: boolean;
  x: number;
  y: number;
};

export type UraiConstellation = {
  id: string;
  label: string;
  tone: string;
  description: string;
};

export type UraiProgressionPath = {
  id: string;
  label: string;
  starIds: string[];
  status: "available" | "locked" | "complete";
};

export type UraiReplayJourney = {
  id: string;
  replayId: string;
  label: string;
  chapters: string[];
  evidencePolicy: "source-backed";
  exportPolicy: "review-required";
};

export type UraiArtifact = {
  id: string;
  label: string;
  sourceReplayId: string;
  unlockState: "locked" | "reviewable" | "unlocked";
  redactionRequired: boolean;
};

export const URAI_CONSTELLATIONS: UraiConstellation[] = [
  {
    id: "recovery",
    label: "Recovery Arc",
    tone: "cyan",
    description: "Stars tied to repair, stability, and self-trust.",
  },
  {
    id: "purpose",
    label: "Purpose Arc",
    tone: "violet",
    description: "Stars tied to direction, craft, and future identity.",
  },
  {
    id: "legacy",
    label: "Legacy Arc",
    tone: "amber",
    description: "Stars tied to memory, replay, artifact, and story continuity.",
  },
];

export const URAI_DENSE_MAP_FIXTURE: UraiConstellationStar[] = [
  { id: "starter-star", label: "Starter Star", constellationId: "recovery", lifeArea: "grounding", state: "selected", privacy: "visible", pinned: true, hidden: false, x: 42, y: 48 },
  { id: "breath-anchor", label: "Breath Anchor", constellationId: "recovery", lifeArea: "regulation", state: "unlocked", privacy: "visible", pinned: false, hidden: false, x: 28, y: 32 },
  { id: "repair-thread", label: "Repair Thread", constellationId: "recovery", lifeArea: "relationships", state: "locked", privacy: "private", pinned: false, hidden: false, x: 62, y: 34 },
  { id: "craft-signal", label: "Craft Signal", constellationId: "purpose", lifeArea: "work", state: "unlocked", privacy: "visible", pinned: true, hidden: false, x: 58, y: 62 },
  { id: "future-self", label: "Future Self", constellationId: "purpose", lifeArea: "identity", state: "legendary", privacy: "visible", pinned: false, hidden: false, x: 74, y: 46 },
  { id: "vaulted-origin", label: "Vaulted Origin", constellationId: "legacy", lifeArea: "memory", state: "locked", privacy: "vaulted", pinned: false, hidden: false, x: 22, y: 68 },
  { id: "hidden-draft", label: "Hidden Draft", constellationId: "legacy", lifeArea: "memory", state: "locked", privacy: "hidden", pinned: false, hidden: true, x: 48, y: 76 },
  { id: "deleted-shadow", label: "Deleted Shadow", constellationId: "legacy", lifeArea: "memory", state: "locked", privacy: "deleted", pinned: false, hidden: true, x: 80, y: 78 },
];

export const URAI_PROGRESSION_PATHS: UraiProgressionPath[] = [
  { id: "return-to-ground", label: "Return to Ground", starIds: ["starter-star", "breath-anchor", "repair-thread"], status: "available" },
  { id: "make-the-signal", label: "Make the Signal", starIds: ["starter-star", "craft-signal", "future-self"], status: "available" },
  { id: "legacy-review", label: "Legacy Review", starIds: ["vaulted-origin", "starter-star", "future-self"], status: "locked" },
];

export const URAI_REPLAY_JOURNEYS: UraiReplayJourney[] = [
  {
    id: "starter-replay-arc",
    replayId: "starter-replay",
    label: "Starter Replay Arc",
    chapters: ["source review", "correction gate", "meaning extraction", "return home"],
    evidencePolicy: "source-backed",
    exportPolicy: "review-required",
  },
];

export const URAI_ARTIFACTS: UraiArtifact[] = [
  { id: "moon-orb-token", label: "Moon Orb Token", sourceReplayId: "starter-replay", unlockState: "reviewable", redactionRequired: true },
  { id: "sealed-memory-shard", label: "Sealed Memory Shard", sourceReplayId: "starter-replay", unlockState: "locked", redactionRequired: true },
];

export function visibleConstellationStars(stars: UraiConstellationStar[] = URAI_DENSE_MAP_FIXTURE) {
  return stars.filter((star) => !star.hidden && star.privacy !== "hidden" && star.privacy !== "deleted");
}

export function groupStarsByConstellation(stars: UraiConstellationStar[] = visibleConstellationStars()) {
  return URAI_CONSTELLATIONS.map((constellation) => ({
    ...constellation,
    stars: stars.filter((star) => star.constellationId === constellation.id),
  }));
}

export function resolveDenseMapLod(starCount: number, viewport: "mobile" | "desktop" = "desktop") {
  if (viewport === "mobile" && starCount > 24) return "clustered-labels-hidden";
  if (starCount > 80) return "clustered-orbs-only";
  if (starCount > 40) return "labels-on-selection";
  return "full-premium-labels";
}

export const URAI_TIER_3_4_PERFORMANCE_BUDGETS = {
  initialRouteLoadMs: 2500,
  denseMapRenderMs: 120,
  constellationLayerRenderMs: 160,
  replayJourneyTransitionMs: 220,
  artifactUnlockAnimationMs: 300,
  mobileMemoryMb: 256,
  assetPreloadKb: 900,
};
