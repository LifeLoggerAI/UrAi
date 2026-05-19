import { type UraiPrivacyState } from "./system";

export type UraiStarState = "locked" | "unlocked" | "selected" | "legendary" | "archived";
export type UraiLifeArea = "self" | "work" | "health" | "relationships" | "creativity" | "learning" | "home" | "unknown";

export type UraiConstellationStar = {
  id: string;
  title: string;
  lifeArea: UraiLifeArea;
  weight: number;
  privacyState: UraiPrivacyState;
  starState: UraiStarState;
  createdAt: string;
  sourceRefs: string[];
  replayIds?: string[];
  focusSessionIds?: string[];
  hidden?: boolean;
  pinned?: boolean;
};

export type UraiConstellation = {
  id: string;
  label: string;
  lifeArea: UraiLifeArea;
  starIds: string[];
  centroid: { x: number; y: number };
  density: number;
  lockedCount: number;
  visibleCount: number;
};

export type UraiConstellationLayoutNode = {
  id: string;
  constellationId: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  state: UraiStarState;
  labelVisible: boolean;
  interactive: boolean;
};

export type UraiConstellationEdge = {
  id: string;
  from: string;
  to: string;
  constellationId: string;
  opacity: number;
  visible: boolean;
};

export type UraiConstellationLayout = {
  nodes: UraiConstellationLayoutNode[];
  edges: UraiConstellationEdge[];
  constellations: UraiConstellation[];
  lod: "overview" | "regional" | "detail";
  hiddenExcluded: number;
  deletedExcluded: number;
  privateShielded: number;
};

export type UraiConstellationPreferences = {
  pinnedStarIds: string[];
  hiddenStarIds: string[];
  reducedMotion: boolean;
  selectedLifeAreas?: UraiLifeArea[];
};

const LIFE_AREA_LABELS: Record<UraiLifeArea, string> = {
  self: "Self",
  work: "Work",
  health: "Health",
  relationships: "Relationships",
  creativity: "Creativity",
  learning: "Learning",
  home: "Home",
  unknown: "Unsorted",
};

const LIFE_AREA_ORDER: UraiLifeArea[] = ["self", "work", "health", "relationships", "creativity", "learning", "home", "unknown"];

export function filterVisibleConstellationStars(
  stars: UraiConstellationStar[],
  preferences: UraiConstellationPreferences,
): UraiConstellationStar[] {
  const allowedAreas = preferences.selectedLifeAreas?.length ? new Set(preferences.selectedLifeAreas) : null;
  const hidden = new Set(preferences.hiddenStarIds);
  return stars.filter((star) => {
    if (star.privacyState === "deleted") return false;
    if (star.hidden || hidden.has(star.id)) return false;
    if (allowedAreas && !allowedAreas.has(star.lifeArea)) return false;
    return true;
  });
}

export function groupStarsIntoConstellations(
  stars: UraiConstellationStar[],
  preferences: UraiConstellationPreferences,
): UraiConstellation[] {
  const visible = filterVisibleConstellationStars(stars, preferences);
  const pinned = new Set(preferences.pinnedStarIds);
  const groups = new Map<UraiLifeArea, UraiConstellationStar[]>();

  for (const star of visible) {
    const area = star.pinned || pinned.has(star.id) ? star.lifeArea : star.lifeArea;
    groups.set(area, [...(groups.get(area) ?? []), star]);
  }

  return LIFE_AREA_ORDER.filter((area) => groups.has(area)).map((area, index) => {
    const group = [...(groups.get(area) ?? [])].sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id));
    const angle = (Math.PI * 2 * index) / Math.max(1, groups.size) - Math.PI / 2;
    const radius = 0.34 + Math.min(0.18, group.length / 180);
    return {
      id: `constellation-${area}`,
      label: LIFE_AREA_LABELS[area],
      lifeArea: area,
      starIds: group.map((star) => star.id),
      centroid: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius },
      density: group.length,
      lockedCount: group.filter((star) => star.starState === "locked").length,
      visibleCount: group.length,
    };
  });
}

export function createConstellationLayout(
  stars: UraiConstellationStar[],
  preferences: UraiConstellationPreferences,
  viewportWidth = 1280,
): UraiConstellationLayout {
  const constellations = groupStarsIntoConstellations(stars, preferences);
  const visible = filterVisibleConstellationStars(stars, preferences);
  const byId = new Map(visible.map((star) => [star.id, star]));
  const lod = resolveConstellationLod(visible.length, viewportWidth);
  const nodes: UraiConstellationLayoutNode[] = [];
  const edges: UraiConstellationEdge[] = [];

  for (const constellation of constellations) {
    constellation.starIds.forEach((starId, index) => {
      const star = byId.get(starId);
      if (!star) return;
      const localAngle = index * 2.399963229728653;
      const localRadius = Math.min(0.22, 0.045 + Math.sqrt(index + 1) * 0.018);
      const pinnedBoost = preferences.pinnedStarIds.includes(star.id) ? 1.2 : 1;
      const shielded = star.privacyState === "sensitive" || star.privacyState === "vaulted" || star.privacyState === "private";
      const size = resolveStarSize(star, lod) * pinnedBoost;

      nodes.push({
        id: star.id,
        constellationId: constellation.id,
        x: roundLayout(constellation.centroid.x + Math.cos(localAngle) * localRadius),
        y: roundLayout(constellation.centroid.y + Math.sin(localAngle) * localRadius),
        size,
        opacity: shielded ? 0.48 : 0.82,
        state: star.starState,
        labelVisible: lod === "detail" || preferences.pinnedStarIds.includes(star.id),
        interactive: star.privacyState !== "vaulted" && star.privacyState !== "deleted",
      });

      if (index > 0 && lod !== "overview") {
        const previous = constellation.starIds[index - 1];
        edges.push({
          id: `${previous}-${star.id}`,
          from: previous,
          to: star.id,
          constellationId: constellation.id,
          opacity: preferences.reducedMotion ? 0.16 : 0.24,
          visible: star.starState !== "locked",
        });
      }
    });
  }

  return {
    nodes,
    edges,
    constellations,
    lod,
    hiddenExcluded: stars.filter((star) => star.hidden || preferences.hiddenStarIds.includes(star.id)).length,
    deletedExcluded: stars.filter((star) => star.privacyState === "deleted").length,
    privateShielded: visible.filter((star) => ["private", "sensitive", "vaulted"].includes(star.privacyState)).length,
  };
}

export function resolveConstellationLod(starCount: number, viewportWidth: number): UraiConstellationLayout["lod"] {
  if (viewportWidth < 640 || starCount > 240) return "overview";
  if (starCount > 72) return "regional";
  return "detail";
}

export function createReplayArcs(stars: UraiConstellationStar[]): UraiConstellationEdge[] {
  const replayStars = stars.filter((star) => star.privacyState !== "deleted" && !star.hidden && star.replayIds?.length);
  return replayStars.slice(1).map((star, index) => ({
    id: `replay-arc-${replayStars[index].id}-${star.id}`,
    from: replayStars[index].id,
    to: star.id,
    constellationId: `constellation-${star.lifeArea}`,
    opacity: 0.18,
    visible: star.privacyState !== "vaulted",
  }));
}

export function createFocusLifeAreaLinks(stars: UraiConstellationStar[]): Record<UraiLifeArea, string[]> {
  return stars.reduce<Record<UraiLifeArea, string[]>>((links, star) => {
    if (star.privacyState === "deleted" || star.hidden || !star.focusSessionIds?.length) return links;
    links[star.lifeArea] = [...(links[star.lifeArea] ?? []), ...star.focusSessionIds];
    return links;
  }, {} as Record<UraiLifeArea, string[]>);
}

function resolveStarSize(star: UraiConstellationStar, lod: UraiConstellationLayout["lod"]): number {
  const base = lod === "overview" ? 2 : lod === "regional" ? 3 : 4;
  const stateBoost = star.starState === "legendary" ? 2 : star.starState === "selected" ? 1.5 : star.starState === "locked" ? 0.75 : 1;
  return roundLayout(Math.max(1.6, base + Math.min(4, star.weight / 25)) * stateBoost);
}

function roundLayout(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function assertConstellationLayoutIntegrity(layout: UraiConstellationLayout): string[] {
  const failures: string[] = [];
  const nodeIds = new Set(layout.nodes.map((node) => node.id));
  for (const node of layout.nodes) {
    if (Math.abs(node.x) > 0.9 || Math.abs(node.y) > 0.9) failures.push(`Node outside safe orbital bounds: ${node.id}`);
    if (node.state === "locked" && node.opacity > 0.5) failures.push(`Locked node too visually loud: ${node.id}`);
  }
  for (const edge of layout.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) failures.push(`Edge references missing node: ${edge.id}`);
  }
  return failures;
}
