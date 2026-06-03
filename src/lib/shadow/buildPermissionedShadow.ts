import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";
import type { ShadowReflection, ShadowSession, ShadowSourceSummary } from "./shadowTypes";

type ShadowPassportProfile = {
  userId?: string;
  permissionVersion?: number;
  shadowEnabled?: boolean;
  shadowConsentConfirmed?: boolean;
  enabledLayers?: Partial<Record<PassportDataLayerId, boolean>>;
  contextPermissions?: Partial<PassportContextPermissions>;
};

type BuildPermissionedShadowInput = {
  passportProfile?: ShadowPassportProfile | null;
  sourceSummaries?: ShadowSourceSummary[];
};

const now = () => new Date().toISOString();

function shadowOpen(profile: ShadowPassportProfile | null | undefined): boolean {
  return profile?.shadowEnabled === true && profile?.shadowConsentConfirmed === true;
}

function allowed(profile: ShadowPassportProfile | null | undefined, layer: PassportDataLayerId): boolean {
  if (layer === "system" || layer === "passport") return true;
  if (!shadowOpen(profile)) return false;
  if (profile?.enabledLayers?.[layer] === true) return true;
  const p = normalizePassportContextPermissions(profile?.contextPermissions);
  if (layer === "shadow" || layer === "longTermPattern") return p.allowLongTermPatternContext;
  if (layer === "mood" || layer === "recovery") return p.allowMoodContext;
  if (layer === "relationship") return p.allowRelationshipContext;
  if (layer === "deviceBehavior") return p.allowDeviceBehaviorContext;
  if (layer === "legacy" || layer === "memory") return p.allowMemoryContext;
  return false;
}

export function createSealedShadowReflections(): ShadowReflection[] {
  const createdAt = now();
  return [
    {
      id: "shadow-sealed",
      title: "Shadow is sealed in Passport.",
      softenedTitle: "Shadow is closed for now.",
      summary: "Nothing difficult is being reflected here unless you explicitly open Shadow.",
      softenedSummary: "This space stays closed until you choose otherwise.",
      patternType: "system",
      intensity: "soft",
      safetyLevel: "protective",
      visibility: "locked",
      confidence: "low",
      createdAt,
      sourceLayerIds: ["passport"],
      permissionRequired: "shadow",
      suggestedAction: "open_passport",
      userCanHide: true,
      userCanSoften: true,
    },
    {
      id: "shadow-boundary",
      title: "You control what appears here.",
      softenedTitle: "You stay in control.",
      summary: "URAI will not surface heavy reflections without your permission.",
      softenedSummary: "This is a protected space, not a judgment.",
      patternType: "system",
      intensity: "soft",
      safetyLevel: "protective",
      visibility: "softened",
      confidence: "low",
      createdAt,
      sourceLayerIds: ["system"],
      suggestedAction: "none",
      userCanHide: true,
      userCanSoften: true,
    },
  ];
}

function toReflection(summary: ShadowSourceSummary, index: number): ShadowReflection {
  const sourceLayerIds = summary.sourceLayerIds?.length ? summary.sourceLayerIds : ["shadow"];
  return {
    id: summary.id ?? `shadow-reflection-${index}`,
    title: summary.title ?? "A difficult pattern may be present.",
    softenedTitle: summary.softenedTitle ?? "Something may need gentleness.",
    summary: summary.summary ?? "From what is visible, this is only a protected reflection, not certainty.",
    softenedSummary: summary.softenedSummary ?? "This may be worth holding gently, or hiding for now.",
    patternType: summary.patternType ?? "system",
    intensity: summary.intensity ?? "soft",
    safetyLevel: summary.safetyLevel ?? "gentle",
    visibility: "softened",
    confidence: summary.confidence ?? "low",
    createdAt: now(),
    sourceLayerIds,
    suggestedAction: "talk_to_guardian",
    userCanHide: true,
    userCanSoften: true,
  };
}

export function buildPermissionedShadow(input: BuildPermissionedShadowInput = {}): ShadowSession {
  const profile = input.passportProfile;
  const consent = shadowOpen(profile);
  const reflections: ShadowReflection[] = [];

  if (consent) {
    for (const [index, summary] of (input.sourceSummaries ?? []).entries()) {
      const layers = summary.sourceLayerIds?.length ? summary.sourceLayerIds : ["shadow"];
      if (layers.every((layer) => allowed(profile, layer))) reflections.push(toReflection(summary, index));
    }
  }

  const finalReflections = consent && reflections.length > 0 ? reflections : createSealedShadowReflections();
  return {
    id: `shadow-${Date.now()}`,
    reflections: finalReflections,
    generatedAt: now(),
    permissionVersion: profile?.permissionVersion ?? 1,
    shadowConsentConfirmed: consent,
  };
}
