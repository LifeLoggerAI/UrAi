import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { LifeMapData, LifeMapSourceItem, LifeMapStar, LifeMapStarType, PassportDataLayerId } from "./lifeMapTypes";

type LifeMapPassportProfile = {
  userId?: string;
  permissionVersion?: number;
  lifeMapEnabled?: boolean;
  enabledLayers?: Partial<Record<PassportDataLayerId, boolean>>;
  contextPermissions?: Partial<PassportContextPermissions>;
};

type BuildPermissionedLifeMapInput = {
  userId?: string;
  moodState?: GenesisMoodState;
  permissionVersion?: number;
  passportProfile?: LifeMapPassportProfile | null;
  memories?: LifeMapSourceItem[];
  reflections?: LifeMapSourceItem[];
  rituals?: LifeMapSourceItem[];
  milestones?: LifeMapSourceItem[];
  relationshipSummaries?: LifeMapSourceItem[];
  shadowSummaries?: LifeMapSourceItem[];
  legacySummaries?: LifeMapSourceItem[];
};

const CHAPTER_ID = "genesis";
const now = () => new Date().toISOString();

function isLayerAllowed(profile: LifeMapPassportProfile | null | undefined, layer: PassportDataLayerId): boolean {
  if (layer === "system" || layer === "passport") return true;
  if (profile?.lifeMapEnabled === false) return false;
  if (profile?.enabledLayers?.[layer] === true) return true;
  const p = normalizePassportContextPermissions(profile?.contextPermissions);
  if (layer === "mood") return p.allowMoodContext;
  if (layer === "memory" || layer === "ritual" || layer === "milestone" || layer === "recovery" || layer === "legacy") return p.allowMemoryContext;
  if (layer === "relationships") return p.allowRelationshipContext;
  if (layer === "shadow" || layer === "longTermPattern") return p.allowLongTermPatternContext;
  return false;
}

export function createSafeStarterStars(moodState: GenesisMoodState = "luminous"): LifeMapStar[] {
  const createdAt = now();
  return [
    { id: "system-genesis-opened", type: "system", title: "Genesis Opened", subtitle: "The sky became a doorway.", summary: "A safe app-state star for the opening scene.", createdAt, emotionalTone: moodState, intensity: "soft", visibility: "visible", x: 18, y: 46, z: 0, chapterId: CHAPTER_ID, sourceLayerId: "system", glyph: "✦" },
    { id: "passport-created", type: "passport", title: "Passport Created", subtitle: "Control stays with you.", summary: "A permission star for user-owned visibility.", createdAt, emotionalTone: moodState, intensity: "soft", visibility: "visible", x: 34, y: 30, z: 1, chapterId: CHAPTER_ID, sourceLayerId: "passport", glyph: "◉" },
    { id: "orb-woke", type: "system", title: "The Orb Woke", subtitle: "URAI is ready when you are.", summary: "A safe app-state star for the Companion layer.", createdAt, emotionalTone: moodState, intensity: "bright", visibility: "visible", x: 52, y: 54, z: 2, chapterId: CHAPTER_ID, sourceLayerId: "system", glyph: "●" },
    { id: "first-reflection", type: "system", title: "First Reflection", subtitle: "A quiet place to begin.", summary: "A symbolic starter moment for the first map view.", createdAt, emotionalTone: moodState, intensity: "quiet", visibility: "visible", x: 66, y: 36, z: 1, chapterId: CHAPTER_ID, sourceLayerId: "system", glyph: "◇" },
    { id: "life-map-waiting", type: "passport", title: "Life Map Waiting", subtitle: "Open layers only when you choose.", summary: "The map can stay quiet or grow through Passport controls.", createdAt, emotionalTone: moodState, intensity: "soft", visibility: "visible", x: 80, y: 58, z: 0, chapterId: CHAPTER_ID, sourceLayerId: "passport", glyph: "✧" },
  ];
}

function sourceToStar(item: LifeMapSourceItem, index: number, type: LifeMapStarType, layer: PassportDataLayerId, moodState: GenesisMoodState): LifeMapStar {
  const angle = index * 0.72;
  const radius = 18 + (index % 5) * 6;
  return {
    id: item.id ?? `${type}-${index}`,
    type,
    title: item.title ?? "Symbolic moment",
    subtitle: item.subtitle,
    summary: item.summary ?? "A permissioned symbolic summary.",
    createdAt: item.createdAt ?? now(),
    emotionalTone: item.emotionalTone ?? moodState,
    intensity: item.intensity ?? "soft",
    visibility: "visible",
    x: Math.max(8, Math.min(92, 50 + Math.cos(angle) * radius)),
    y: Math.max(14, Math.min(82, 46 + Math.sin(angle) * radius)),
    z: index % 3,
    chapterId: CHAPTER_ID,
    sourceLayerId: layer,
    glyph: type === "ritual" ? "✺" : type === "milestone" ? "✦" : type === "relationship" ? "∞" : type === "shadow" ? "◐" : type === "legacy" ? "◆" : "•",
  };
}

export function buildPermissionedLifeMap(input: BuildPermissionedLifeMapInput = {}): LifeMapData {
  const moodState = input.moodState ?? "luminous";
  const profile = input.passportProfile;
  const generated: LifeMapStar[] = [];
  if (isLayerAllowed(profile, "mood")) generated.push(sourceToStar({ id: "visible-mood-weather", title: "Mood Weather", subtitle: "A visible state, not a diagnosis.", summary: `The current visible Genesis tone is ${moodState}.` }, 1, "mood", "mood", moodState));
  if (isLayerAllowed(profile, "memory")) generated.push(...(input.memories ?? input.reflections ?? []).map((item, index) => sourceToStar(item, index + 2, "memory", "memory", moodState)));
  if (isLayerAllowed(profile, "ritual")) generated.push(...(input.rituals ?? []).map((item, index) => sourceToStar(item, index + 7, "ritual", "ritual", moodState)));
  if (isLayerAllowed(profile, "milestone")) generated.push(...(input.milestones ?? []).map((item, index) => sourceToStar(item, index + 12, "milestone", "milestone", moodState)));
  if (isLayerAllowed(profile, "relationships")) generated.push(...(input.relationshipSummaries ?? []).map((item, index) => sourceToStar(item, index + 17, "relationship", "relationships", moodState)));
  if (isLayerAllowed(profile, "shadow")) generated.push(...(input.shadowSummaries ?? []).map((item, index) => sourceToStar(item, index + 22, "shadow", "shadow", moodState)));
  if (isLayerAllowed(profile, "legacy")) generated.push(...(input.legacySummaries ?? []).map((item, index) => sourceToStar(item, index + 27, "legacy", "legacy", moodState)));
  const stars = generated.length > 0 ? [...createSafeStarterStars(moodState).slice(0, 2), ...generated] : createSafeStarterStars(moodState);
  return {
    userId: profile?.userId ?? input.userId,
    stars,
    chapters: [{ id: CHAPTER_ID, title: "Genesis", subtitle: generated.length > 0 ? "Permissioned stars are beginning to appear." : "The map is quiet and safe.", startDate: stars[0]?.createdAt ?? now(), dominantMood: moodState, starIds: stars.map((star) => star.id), constellationStyle: "thread" }],
    generatedAt: now(),
    permissionVersion: profile?.permissionVersion ?? input.permissionVersion ?? 1,
  };
}
