import type { UraiPrivacyState, UraiRouteId } from "./system";

export type UraiFocusSessionStatus = "idle" | "active" | "paused" | "completed" | "archived";
export type UraiReplayEvidenceKind = "audio" | "transcript" | "location" | "device" | "calendar" | "relationship" | "derived_insight";
export type UraiReplayEvidenceConfidence = "direct" | "inferred" | "low";
export type UraiReplayRailVisibility = "visible" | "redacted" | "locked";

export type UraiFocusSessionRuntimeContract = {
  collection: "focusSessions";
  route: Extract<UraiRouteId, "/focus/session/[sessionId]">;
  ownerField: "ownerUid";
  persistenceKey: "urai.focus.session.current";
  sessionStateField: "status";
  starLinkField: "starId";
  replayLinkField: "activeReplayId";
  privacyField: "privacyState";
  lastOpenedField: "lastOpenedAt";
  recoverOnRefresh: true;
  mobileFallback: "static-focus-card";
  reducedMotionFallback: "short-dissolve-to-focus-card";
  loadingState: "focus-session-loading";
  emptyState: "focus-session-empty";
  errorState: "focus-session-error";
};

export type UraiReplayEvidenceRailContract = {
  collection: "replayEvidence";
  route: Extract<UraiRouteId, "/replay/[replayId]">;
  ownerField: "ownerUid";
  replayField: "replayId";
  sourceRefField: "sourceRef";
  kindField: "kind";
  confidenceField: "confidence";
  visibilityField: "visibility";
  redactionField: "redactedReason";
  displayOrderField: "displayOrder";
  provenanceDrawerRequired: true;
  exportDeleteLinked: true;
  aiReadableOnlyWhenPermissioned: true;
  mobileFallback: "horizontal-evidence-chips";
  reducedMotionFallback: "static-provenance-rail";
  loadingState: "replay-evidence-loading";
  emptyState: "replay-evidence-empty";
  errorState: "replay-evidence-error";
};

export type UraiReplayEvidenceItem = {
  id: string;
  ownerUid: string;
  replayId: string;
  sourceRef: string;
  kind: UraiReplayEvidenceKind;
  confidence: UraiReplayEvidenceConfidence;
  visibility: UraiReplayRailVisibility;
  displayOrder: number;
  privacyState: UraiPrivacyState;
  redactedReason?: string;
};

export const URAI_FOCUS_SESSION_RUNTIME: UraiFocusSessionRuntimeContract = {
  collection: "focusSessions",
  route: "/focus/session/[sessionId]",
  ownerField: "ownerUid",
  persistenceKey: "urai.focus.session.current",
  sessionStateField: "status",
  starLinkField: "starId",
  replayLinkField: "activeReplayId",
  privacyField: "privacyState",
  lastOpenedField: "lastOpenedAt",
  recoverOnRefresh: true,
  mobileFallback: "static-focus-card",
  reducedMotionFallback: "short-dissolve-to-focus-card",
  loadingState: "focus-session-loading",
  emptyState: "focus-session-empty",
  errorState: "focus-session-error",
};

export const URAI_REPLAY_EVIDENCE_RAIL: UraiReplayEvidenceRailContract = {
  collection: "replayEvidence",
  route: "/replay/[replayId]",
  ownerField: "ownerUid",
  replayField: "replayId",
  sourceRefField: "sourceRef",
  kindField: "kind",
  confidenceField: "confidence",
  visibilityField: "visibility",
  redactionField: "redactedReason",
  displayOrderField: "displayOrder",
  provenanceDrawerRequired: true,
  exportDeleteLinked: true,
  aiReadableOnlyWhenPermissioned: true,
  mobileFallback: "horizontal-evidence-chips",
  reducedMotionFallback: "static-provenance-rail",
  loadingState: "replay-evidence-loading",
  emptyState: "replay-evidence-empty",
  errorState: "replay-evidence-error",
};

export const URAI_REPLAY_EVIDENCE_KIND_ORDER: readonly UraiReplayEvidenceKind[] = [
  "audio",
  "transcript",
  "location",
  "device",
  "calendar",
  "relationship",
  "derived_insight",
] as const;

export function sortReplayEvidenceRail(items: readonly UraiReplayEvidenceItem[]): UraiReplayEvidenceItem[] {
  return [...items].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
    return URAI_REPLAY_EVIDENCE_KIND_ORDER.indexOf(a.kind) - URAI_REPLAY_EVIDENCE_KIND_ORDER.indexOf(b.kind);
  });
}

export function resolveReplayEvidenceVisibility(item: UraiReplayEvidenceItem): UraiReplayRailVisibility {
  if (item.privacyState === "deleted" || item.privacyState === "vaulted") return "locked";
  if (item.privacyState === "sensitive" || item.confidence === "low") return "redacted";
  return item.visibility;
}

export function assertUraiFocusReplayRuntimeIntegrity(): string[] {
  const failures: string[] = [];

  if (URAI_FOCUS_SESSION_RUNTIME.collection !== "focusSessions") failures.push("Focus sessions must persist in focusSessions.");
  if (URAI_FOCUS_SESSION_RUNTIME.ownerField !== "ownerUid") failures.push("Focus sessions must be owner-bound.");
  if (!URAI_FOCUS_SESSION_RUNTIME.recoverOnRefresh) failures.push("Focus sessions must recover after refresh.");
  if (!URAI_FOCUS_SESSION_RUNTIME.mobileFallback) failures.push("Focus session mobile fallback missing.");
  if (!URAI_FOCUS_SESSION_RUNTIME.reducedMotionFallback) failures.push("Focus session reduced-motion fallback missing.");

  if (URAI_REPLAY_EVIDENCE_RAIL.collection !== "replayEvidence") failures.push("Replay evidence rail must persist in replayEvidence.");
  if (URAI_REPLAY_EVIDENCE_RAIL.ownerField !== "ownerUid") failures.push("Replay evidence must be owner-bound.");
  if (!URAI_REPLAY_EVIDENCE_RAIL.provenanceDrawerRequired) failures.push("Replay evidence rail must require provenance drawer.");
  if (!URAI_REPLAY_EVIDENCE_RAIL.exportDeleteLinked) failures.push("Replay evidence must link to export/delete cleanup.");
  if (!URAI_REPLAY_EVIDENCE_RAIL.aiReadableOnlyWhenPermissioned) failures.push("Replay evidence AI access must remain permissioned.");

  for (const kind of ["audio", "transcript", "location", "device", "calendar", "relationship", "derived_insight"] as const) {
    if (!URAI_REPLAY_EVIDENCE_KIND_ORDER.includes(kind)) failures.push(`Missing evidence kind: ${kind}`);
  }

  return failures;
}
