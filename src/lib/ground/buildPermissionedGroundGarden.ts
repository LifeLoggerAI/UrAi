import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";
import type { GroundElement, GroundElementType, GroundGardenData, GroundSourceItem } from "./groundTypes";

type GroundPassportProfile = {
  userId?: string;
  permissionVersion?: number;
  groundEnabled?: boolean;
  enabledLayers?: Partial<Record<PassportDataLayerId, boolean>>;
  contextPermissions?: Partial<PassportContextPermissions>;
};

type BuildPermissionedGroundGardenInput = {
  userId?: string;
  passportProfile?: GroundPassportProfile | null;
  moodState?: GenesisMoodState;
  habits?: GroundSourceItem[];
  rituals?: GroundSourceItem[];
  recoverySummaries?: GroundSourceItem[];
  groundingActions?: GroundSourceItem[];
  shadowSummaries?: GroundSourceItem[];
  legacySummaries?: GroundSourceItem[];
};

const now = () => new Date().toISOString();

function allowed(profile: GroundPassportProfile | null | undefined, layer: PassportDataLayerId): boolean {
  if (layer === "system" || layer === "passport") return true;
  if (profile?.groundEnabled === false) return false;
  if (profile?.enabledLayers?.[layer] === true) return true;
  const p = normalizePassportContextPermissions(profile?.contextPermissions);
  if (layer === "mood" || layer === "recovery") return p.allowMoodContext;
  if (layer === "deviceBehavior") return p.allowDeviceBehaviorContext;
  if (layer === "ritual" || layer === "legacy") return p.allowMemoryContext;
  if (layer === "shadow" || layer === "longTermPattern") return p.allowLongTermPatternContext;
  return false;
}

export function createSafeGroundPreview(moodState: GenesisMoodState = "luminous"): GroundElement[] {
  const createdAt = now();
  return [
    { id: "first-root", type: "root", title: "The First Root", subtitle: "A place to steady.", summary: "A safe Ground marker for the beginning of the garden.", state: "steady", createdAt, sourceLayerId: "system", emotionalTone: moodState, position: { x: 24, y: 64, scale: 1.1 }, visualHint: "warm root thread" },
    { id: "orb-light", type: "lantern", title: "Orb Light", subtitle: "A small light stays on.", summary: "A safe system lantern connected to the URAI orb.", state: "protected", createdAt, sourceLayerId: "system", emotionalTone: moodState, position: { x: 48, y: 52, scale: 1.2 }, visualHint: "soft lantern glow" },
    { id: "passport-gate", type: "passportGate", title: "Passport Gate", subtitle: "Control stays with you.", summary: "A safe permission marker. More can grow only when you choose.", state: "protected", createdAt, sourceLayerId: "passport", emotionalTone: moodState, position: { x: 74, y: 62, scale: 1 }, visualHint: "protective halo" },
    { id: "quiet-soil", type: "stone", title: "Quiet Soil", subtitle: "Nothing is forced here.", summary: "A safe app-state element. It does not imply personal analysis.", state: "dormant", createdAt, sourceLayerId: "system", emotionalTone: moodState, position: { x: 36, y: 76, scale: 0.9 }, visualHint: "dark living soil" },
    { id: "place-to-begin", type: "sprout", title: "A Place to Begin", subtitle: "One small green point.", summary: "A symbolic starter element for Ground.", state: "growing", createdAt, sourceLayerId: "system", emotionalTone: moodState, position: { x: 62, y: 72, scale: 0.9 }, visualHint: "small sprout light" },
  ];
}

function toElement(item: GroundSourceItem, index: number, type: GroundElementType, layer: PassportDataLayerId, moodState: GenesisMoodState): GroundElement {
  return {
    id: item.id ?? `${type}-${index}`,
    type,
    title: item.title ?? "Growing symbol",
    subtitle: item.subtitle,
    summary: item.summary ?? "A permissioned symbolic Ground summary.",
    state: type === "recoveryBloom" ? "recovering" : type === "ritualSeed" ? "growing" : type === "shadowMoss" ? "protected" : "steady",
    createdAt: item.createdAt ?? now(),
    updatedAt: item.updatedAt,
    sourceLayerId: layer,
    emotionalTone: item.emotionalTone ?? moodState,
    growthScore: item.growthScore,
    recoveryScore: item.recoveryScore,
    position: { x: 18 + ((index * 17) % 68), y: 48 + ((index * 11) % 34), scale: 0.9 + (index % 3) * 0.12 },
  };
}

export function buildPermissionedGroundGarden(input: BuildPermissionedGroundGardenInput = {}): GroundGardenData {
  const moodState = input.moodState ?? "luminous";
  const profile = input.passportProfile;
  const elements: GroundElement[] = [];
  if (allowed(profile, "deviceBehavior")) elements.push(...(input.habits ?? []).map((item, index) => toElement(item, index, "habitPlant", "deviceBehavior", moodState)));
  if (allowed(profile, "ritual")) elements.push(...(input.rituals ?? []).map((item, index) => toElement(item, index + 4, "ritualSeed", "ritual", moodState)));
  if (allowed(profile, "recovery")) elements.push(...(input.recoverySummaries ?? []).map((item, index) => toElement(item, index + 8, "recoveryBloom", "recovery", moodState)));
  if (allowed(profile, "shadow")) elements.push(...(input.shadowSummaries ?? []).map((item, index) => toElement(item, index + 12, "shadowMoss", "shadow", moodState)));
  if (allowed(profile, "legacy")) elements.push(...(input.legacySummaries ?? []).map((item, index) => toElement(item, index + 16, "legacyTree", "legacy", moodState)));
  const safe = createSafeGroundPreview(moodState);
  const finalElements = elements.length > 0 ? [...safe.slice(0, 2), ...elements] : safe;
  return {
    userId: profile?.userId ?? input.userId,
    elements: finalElements,
    generatedAt: now(),
    permissionVersion: profile?.permissionVersion ?? 1,
    dominantState: finalElements.some((item) => item.state === "recovering") ? "recovering" : "steady",
  };
}
