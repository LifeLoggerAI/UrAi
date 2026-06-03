import type { GenesisMoodState } from "@/lib/companion/companionTypes";
import type { GroundGardenData } from "@/lib/ground/groundTypes";
import type { LifeMapData, PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";
import type { MirrorSession } from "@/lib/mirror/mirrorTypes";
import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { ShadowSession } from "@/lib/shadow/shadowTypes";
import { synthesizeLegacyChapter } from "./synthesizeLegacyChapter";
import type { LegacyArchive, LegacyCandidateSource, LegacyItem, LegacyTone } from "./legacyTypes";

type LegacyPassportProfile = {
  userId?: string;
  permissionVersion?: number;
  legacyEnabled?: boolean;
  legacyExportEnabled?: boolean;
  enabledLayers?: Partial<Record<PassportDataLayerId, boolean>>;
  contextPermissions?: Partial<PassportContextPermissions>;
};

type BuildPermissionedLegacyInput = {
  passportProfile?: LegacyPassportProfile | null;
  lifeMapData?: LifeMapData | null;
  groundData?: GroundGardenData | null;
  mirrorSession?: MirrorSession | null;
  shadowSession?: ShadowSession | null;
  userApprovedItems?: LegacyCandidateSource[];
  moodState?: GenesisMoodState;
};

const now = () => new Date().toISOString();

function legacyEnabled(profile: LegacyPassportProfile | null | undefined): boolean {
  return profile?.legacyEnabled === true;
}

function canUseLayer(profile: LegacyPassportProfile | null | undefined, layer: PassportDataLayerId): boolean {
  if (!legacyEnabled(profile)) return false;
  if (layer === "system" || layer === "passport") return true;
  if (profile?.enabledLayers?.[layer] === true) return true;
  const p = normalizePassportContextPermissions(profile?.contextPermissions);
  if (layer === "memory" || layer === "legacy") return p.allowMemoryContext;
  if (layer === "mood" || layer === "recovery") return p.allowMoodContext;
  if (layer === "relationship") return p.allowRelationshipContext;
  if (layer === "deviceBehavior") return p.allowDeviceBehaviorContext;
  if (layer === "shadow" || layer === "longTermPattern") return p.allowLongTermPatternContext;
  return false;
}

function closedArchive(profile: LegacyPassportProfile | null | undefined): LegacyArchive {
  return { userId: profile?.userId, chapters: [], items: [], generatedAt: now(), permissionVersion: profile?.permissionVersion ?? 1, legacyEnabled: false };
}

function emptyOpenItems(): LegacyItem[] {
  const createdAt = now();
  return [
    { id: "legacy-open-empty", type: "system", title: "Legacy is open, but quiet.", summary: "Approved moments can appear here when you choose to carry them forward.", createdAt, sourceLayerIds: ["system"], visibility: "visible", tone: "warm", userApproved: true, exportAllowed: false },
    { id: "legacy-approved-note", type: "system", title: "Nothing has been preserved yet.", summary: "Legacy saves summaries only when you approve them.", createdAt, sourceLayerIds: ["passport"], visibility: "visible", tone: "reflective", userApproved: true, exportAllowed: false },
  ];
}

function candidateToItem(candidate: LegacyCandidateSource, index: number, profile: LegacyPassportProfile | null | undefined): LegacyItem | null {
  const layers: PassportDataLayerId[] = candidate.sourceLayerIds.length ? candidate.sourceLayerIds : ["system"];
  const shadowLinked = layers.includes("shadow") || Boolean(candidate.linkedShadowReflectionId);
  if (!candidate.userApproved) return null;
  if (!layers.every((layer) => canUseLayer(profile, layer))) return null;
  if (shadowLinked && !candidate.userApproved) return null;
  const createdAt = now();
  return {
    id: candidate.id ?? `legacy-item-${index}`,
    type: candidate.type,
    title: candidate.title,
    subtitle: candidate.subtitle,
    summary: candidate.summary,
    createdAt,
    sourceCreatedAt: candidate.sourceCreatedAt,
    sourceLayerIds: layers,
    visibility: "visible",
    tone: candidate.tone ?? "warm",
    linkedLifeMapStarId: candidate.linkedLifeMapStarId,
    linkedGroundElementId: candidate.linkedGroundElementId,
    linkedMirrorReflectionId: candidate.linkedMirrorReflectionId,
    linkedShadowReflectionId: candidate.linkedShadowReflectionId,
    chapterId: "legacy-chapter-genesis",
    userApproved: true,
    exportAllowed: candidate.exportAllowed === true && profile?.legacyExportEnabled === true,
  };
}

export function buildPermissionedLegacy(input: BuildPermissionedLegacyInput = {}): LegacyArchive {
  const profile = input.passportProfile;
  if (!legacyEnabled(profile)) return closedArchive(profile);
  const approvedItems = (input.userApprovedItems ?? []).map((candidate, index) => candidateToItem(candidate, index, profile)).filter((item): item is LegacyItem => Boolean(item));
  const items = approvedItems.length > 0 ? approvedItems : emptyOpenItems();
  const approvedForChapter = items.filter((item) => item.userApproved && item.visibility !== "sealed");
  const chapters = approvedForChapter.length > 0 ? [synthesizeLegacyChapter(approvedForChapter)] : [];
  return { userId: profile?.userId, chapters, items, generatedAt: now(), permissionVersion: profile?.permissionVersion ?? 1, legacyEnabled: true };
}

export function legacyCandidateFromSummary(input: { id: string; type: LegacyCandidateSource["type"]; title: string; summary: string; sourceLayerIds: PassportDataLayerId[]; tone?: LegacyTone; linkedLifeMapStarId?: string; linkedGroundElementId?: string; linkedMirrorReflectionId?: string; linkedShadowReflectionId?: string }): LegacyCandidateSource {
  return { ...input, userApproved: true, exportAllowed: false };
}
