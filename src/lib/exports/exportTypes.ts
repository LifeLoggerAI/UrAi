import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";

export type ExportArtifactType =
  | "legacy_scroll"
  | "life_map_card"
  | "ground_bloom_card"
  | "mirror_reflection_card"
  | "shadow_soft_summary"
  | "ritual_card"
  | "chapter_scroll"
  | "passport_record"
  | "full_story_bundle";

export type ExportFormat = "png" | "pdf" | "webp" | "json" | "zip";
export type ExportPrivacyLevel = "private" | "summary_only" | "shareable" | "sealed" | "requires_review";
export type ExportSourceType = "life_map" | "ground" | "mirror" | "shadow" | "legacy" | "passport" | "system";

export type ExportArtifact = {
  id: string;
  type: ExportArtifactType;
  title: string;
  subtitle?: string;
  summary: string;
  format: ExportFormat;
  privacyLevel: ExportPrivacyLevel;
  sourceType: ExportSourceType;
  sourceIds: string[];
  sourceLayerIds: PassportDataLayerId[];
  createdAt: string;
  userApproved: boolean;
  includesShadow: boolean;
  includesSensitiveLayer: boolean;
  exportAllowed: boolean;
};

export type ExportReviewIssue = {
  id: string;
  severity: "info" | "warning" | "blocked";
  title: string;
  message: string;
  sourceLayerId?: PassportDataLayerId;
};

export type ExportReviewResult = {
  canExport: boolean;
  issues: ExportReviewIssue[];
  artifact: ExportArtifact;
};

export type ExportTemplateId = "celestial_scroll" | "ground_bloom" | "mirror_glass" | "legacy_archive" | "shadow_soft" | "passport_clean";

export type ExportCandidate = {
  id?: string;
  type: ExportArtifactType;
  title: string;
  subtitle?: string;
  summary: string;
  format?: ExportFormat;
  privacyLevel?: ExportPrivacyLevel;
  sourceType: ExportSourceType;
  sourceIds: string[];
  sourceLayerIds: PassportDataLayerId[];
  userApproved?: boolean;
  templateId?: ExportTemplateId;
};
