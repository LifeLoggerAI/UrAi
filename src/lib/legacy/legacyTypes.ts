import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";

export type LegacyItemType =
  | "chapter"
  | "memory"
  | "milestone"
  | "ritual"
  | "recovery"
  | "reflection"
  | "life_map_star"
  | "ground_bloom"
  | "mirror_pattern"
  | "shadow_reflection"
  | "letter"
  | "voice_note"
  | "system";

export type LegacyVisibility = "private" | "visible" | "sealed" | "exportable" | "requires_permission";
export type LegacyTone = "warm" | "reflective" | "hopeful" | "solemn" | "luminous" | "grounded";

export type LegacyItem = {
  id: string;
  type: LegacyItemType;
  title: string;
  subtitle?: string;
  summary: string;
  createdAt: string;
  sourceCreatedAt?: string;
  sourceLayerIds: PassportDataLayerId[];
  visibility: LegacyVisibility;
  tone: LegacyTone;
  permissionRequired?: PassportDataLayerId;
  linkedLifeMapStarId?: string;
  linkedGroundElementId?: string;
  linkedMirrorReflectionId?: string;
  linkedShadowReflectionId?: string;
  chapterId?: string;
  userApproved: boolean;
  exportAllowed: boolean;
};

export type LegacyChapter = {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  startDate: string;
  endDate?: string;
  tone: LegacyTone;
  itemIds: string[];
  sourceLayerIds: PassportDataLayerId[];
  userApproved: boolean;
  exportAllowed: boolean;
};

export type LegacyArchive = {
  userId?: string;
  chapters: LegacyChapter[];
  items: LegacyItem[];
  generatedAt: string;
  permissionVersion: number;
  legacyEnabled: boolean;
};

export type LegacyCandidateSource = {
  id?: string;
  type: LegacyItemType;
  title: string;
  subtitle?: string;
  summary: string;
  sourceCreatedAt?: string;
  sourceLayerIds: PassportDataLayerId[];
  tone?: LegacyTone;
  linkedLifeMapStarId?: string;
  linkedGroundElementId?: string;
  linkedMirrorReflectionId?: string;
  linkedShadowReflectionId?: string;
  userApproved?: boolean;
  exportAllowed?: boolean;
};
