import type { CompanionMessage, GenesisMoodState } from "@/lib/companion/companionTypes";
import type { GroundGardenData } from "@/lib/ground/groundTypes";
import type { LifeMapData, PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";
import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { MirrorReflection, MirrorSession, MirrorSourceSummary } from "./mirrorTypes";

type MirrorPassportProfile = {
  userId?: string;
  permissionVersion?: number;
  mirrorEnabled?: boolean;
  enabledLayers?: Partial<Record<PassportDataLayerId, boolean>>;
  contextPermissions?: Partial<PassportContextPermissions>;
};

type BuildPermissionedMirrorInput = {
  passportProfile?: MirrorPassportProfile | null;
  moodState?: GenesisMoodState;
  lifeMapData?: LifeMapData | null;
  groundData?: GroundGardenData | null;
  companionMessages?: CompanionMessage[];
  availableSummaries?: MirrorSourceSummary[];
};

const now = () => new Date().toISOString();

function allowed(profile: MirrorPassportProfile | null | undefined, layer: PassportDataLayerId): boolean {
  if (layer === "system" || layer === "passport") return true;
  if (profile?.mirrorEnabled === false) return false;
  if (profile?.enabledLayers?.[layer] === true) return true;
  const p = normalizePassportContextPermissions(profile?.contextPermissions);
  if (layer === "mood" || layer === "recovery") return p.allowMoodContext;
  if (layer === "relationships") return p.allowRelationshipContext;
  if (layer === "deviceBehavior") return p.allowDeviceBehaviorContext;
  if (layer === "legacy" || layer === "memory") return p.allowMemoryContext;
  if (layer === "shadow" || layer === "longTermPattern") return p.allowLongTermPatternContext;
  return false;
}

export function createSafeMirrorReflections(): MirrorReflection[] {
  const createdAt = now();
  return [
    { id: "mirror-quiet", title: "The mirror is quiet.", summary: "No private pattern is being reflected yet.", patternType: "system", tone: "gentle", confidence: "low", createdAt, sourceLayerIds: ["system"], suggestedAction: "none", visible: true },
    { id: "mirror-passport", title: "Passport controls what appears here.", summary: "You choose which layers can become reflections.", patternType: "system", tone: "protective", confidence: "low", createdAt, sourceLayerIds: ["passport"], suggestedAction: "open_passport", visible: true },
    { id: "mirror-start", title: "Start with mood, Ground, or Life Map.", summary: "Mirror can stay still until you allow more context.", patternType: "system", tone: "grounding", confidence: "low", createdAt, sourceLayerIds: ["system"], suggestedAction: "open_ground", visible: true },
    { id: "mirror-private", title: "Nothing private is being reflected yet.", summary: "This safe preview does not include hidden data.", patternType: "system", tone: "clear", confidence: "low", createdAt, sourceLayerIds: ["system"], suggestedAction: "none", visible: true },
  ];
}

function summaryToReflection(summary: MirrorSourceSummary, index: number): MirrorReflection {
  const sourceLayerIds: PassportDataLayerId[] = summary.sourceLayerIds?.length ? summary.sourceLayerIds : ["system"];
  return {
    id: summary.id ?? `mirror-summary-${index}`,
    title: summary.title ?? "A pattern may be forming.",
    summary: summary.summary ?? "From what is visible, this is only an early signal.",
    patternType: summary.patternType ?? "system",
    tone: summary.tone ?? "gentle",
    confidence: summary.confidence ?? "low",
    createdAt: now(),
    sourceLayerIds,
    suggestedAction: "talk_to_companion",
    visible: true,
  };
}

export function buildPermissionedMirror(input: BuildPermissionedMirrorInput = {}): MirrorSession {
  const profile = input.passportProfile;
  const reflections: MirrorReflection[] = [];
  if (allowed(profile, "mood") && input.moodState) reflections.push({ id: "visible-mood-reflection", title: "A visible mood tone is present.", summary: `From what is visible, the current tone looks ${input.moodState}. This is not a diagnosis.`, patternType: "mood_shift", tone: "gentle", confidence: "low", createdAt: now(), sourceLayerIds: ["mood"], suggestedAction: "open_ground", visible: true });
  if (allowed(profile, "memory") && input.lifeMapData?.stars?.length) reflections.push({ id: "lifemap-reflection", title: "The sky has visible points.", summary: "Life Map stars you allowed can become gentle reflection points.", patternType: "rhythm", tone: "hopeful", confidence: "low", createdAt: now(), sourceLayerIds: ["memory"], suggestedAction: "open_life_map", visible: true });
  if (allowed(profile, "recovery") && input.groundData?.elements?.length) reflections.push({ id: "ground-reflection", title: "The Ground has visible symbols.", summary: "From the visible Ground, a rooted reflection may be available.", patternType: "recovery", tone: "grounding", confidence: "low", createdAt: now(), sourceLayerIds: ["recovery"], suggestedAction: "open_ground", visible: true });
  for (const [index, summary] of (input.availableSummaries ?? []).entries()) {
    const layers: PassportDataLayerId[] = summary.sourceLayerIds?.length ? summary.sourceLayerIds : ["system"];
    if (layers.every((layer) => allowed(profile, layer))) reflections.push(summaryToReflection(summary, index));
  }
  const finalReflections = reflections.length > 0 ? reflections : createSafeMirrorReflections();
  return { id: `mirror-${Date.now()}`, reflections: finalReflections, generatedAt: now(), permissionVersion: profile?.permissionVersion ?? 1 };
}
