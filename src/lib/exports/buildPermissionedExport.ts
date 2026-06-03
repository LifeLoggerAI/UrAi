import { normalizePassportContextPermissions, type PassportContextPermissions } from "@/lib/passport/passportContextTypes";
import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";
import type { ExportArtifact, ExportCandidate, ExportReviewIssue, ExportReviewResult } from "./exportTypes";

type ExportPassportProfile = {
  userId?: string;
  permissionVersion?: number;
  exportEnabled?: boolean;
  legacyExportEnabled?: boolean;
  shadowExportConfirmed?: boolean;
  enabledLayers?: Partial<Record<PassportDataLayerId, boolean>>;
  contextPermissions?: Partial<PassportContextPermissions>;
};

const now = () => new Date().toISOString();
const SENSITIVE_LAYERS: PassportDataLayerId[] = ["shadow", "relationship", "location", "audioTranscript", "gmail", "deviceBehavior", "longTermPattern"];

function canUseLayer(profile: ExportPassportProfile | null | undefined, layer: PassportDataLayerId): boolean {
  if (layer === "system" || layer === "passport") return true;
  if (profile?.enabledLayers?.[layer] === true) return true;
  const p = normalizePassportContextPermissions(profile?.contextPermissions);
  if (layer === "memory" || layer === "legacy" || layer === "ritual" || layer === "milestone") return p.allowMemoryContext;
  if (layer === "mood" || layer === "recovery") return p.allowMoodContext;
  if (layer === "relationship") return p.allowRelationshipContext;
  if (layer === "location") return p.allowLocationContext;
  if (layer === "audioTranscript") return p.allowAudioTranscriptContext;
  if (layer === "gmail") return p.allowGmailContext;
  if (layer === "calendar") return p.allowCalendarContext;
  if (layer === "deviceBehavior") return p.allowDeviceBehaviorContext;
  if (layer === "shadow" || layer === "longTermPattern") return p.allowLongTermPatternContext;
  return false;
}

function createArtifact(candidate: ExportCandidate, profile: ExportPassportProfile | null | undefined): ExportArtifact {
  const includesShadow = candidate.sourceLayerIds.includes("shadow") || candidate.sourceType === "shadow" || candidate.type === "shadow_soft_summary";
  const includesSensitiveLayer = candidate.sourceLayerIds.some((layer) => SENSITIVE_LAYERS.includes(layer));
  return {
    id: candidate.id ?? `export-${Date.now()}`,
    type: candidate.type,
    title: candidate.title,
    subtitle: candidate.subtitle,
    summary: candidate.summary,
    format: candidate.format ?? "png",
    privacyLevel: candidate.privacyLevel ?? "requires_review",
    sourceType: candidate.sourceType,
    sourceIds: candidate.sourceIds,
    sourceLayerIds: candidate.sourceLayerIds,
    createdAt: now(),
    userApproved: candidate.userApproved === true,
    includesShadow,
    includesSensitiveLayer,
    exportAllowed: Boolean(profile?.exportEnabled && candidate.userApproved),
  };
}

export function reviewExportCandidate(candidate: ExportCandidate, profile: ExportPassportProfile | null | undefined = null): ExportReviewResult {
  const artifact = createArtifact(candidate, profile);
  const issues: ExportReviewIssue[] = [];

  if (!profile?.exportEnabled) {
    issues.push({ id: "export-off", severity: "blocked", title: "Export is closed", message: "Export must be opened in Passport before anything can be created." });
  }
  if (!artifact.userApproved) {
    issues.push({ id: "approval-required", severity: "blocked", title: "Approval required", message: "Exports are never created automatically. Approve this artifact first." });
  }
  for (const layer of artifact.sourceLayerIds) {
    if (!canUseLayer(profile, layer)) issues.push({ id: `layer-${layer}`, severity: "blocked", title: "Layer is closed", message: "This source layer is not open for export.", sourceLayerId: layer });
  }
  if (artifact.includesShadow && !profile?.shadowExportConfirmed) {
    issues.push({ id: "shadow-confirmation", severity: "blocked", title: "Shadow needs extra confirmation", message: "Shadow-linked exports require a separate confirmation and softened summary only.", sourceLayerId: "shadow" });
  }
  if (artifact.privacyLevel === "sealed") {
    issues.push({ id: "sealed", severity: "blocked", title: "Sealed item", message: "Sealed items stay out of exports until unsealed." });
  }
  if (artifact.includesSensitiveLayer) {
    issues.push({ id: "sensitive-summary", severity: "warning", title: "Sensitive source layer", message: "Only summary text should be exported from this source." });
  } else {
    issues.push({ id: "summary-only", severity: "info", title: "Summary only", message: "This artifact uses a summary, not raw source data." });
  }

  return {
    artifact: { ...artifact, exportAllowed: artifact.exportAllowed && !issues.some((issue) => issue.severity === "blocked") },
    issues,
    canExport: !issues.some((issue) => issue.severity === "blocked") && artifact.exportAllowed,
  };
}

export function buildShareableArtifact(candidate: ExportCandidate, profile: ExportPassportProfile | null | undefined = null): ExportReviewResult {
  return reviewExportCandidate({ ...candidate, privacyLevel: candidate.privacyLevel ?? "summary_only", userApproved: candidate.userApproved === true }, profile);
}
