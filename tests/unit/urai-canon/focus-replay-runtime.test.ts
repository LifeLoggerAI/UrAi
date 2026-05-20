import {
  URAI_FOCUS_SESSION_RUNTIME,
  URAI_REPLAY_EVIDENCE_RAIL,
  assertUraiFocusReplayRuntimeIntegrity,
  resolveReplayEvidenceVisibility,
  sortReplayEvidenceRail,
  type UraiReplayEvidenceItem,
} from "@/lib/urai-canon/focus-replay-runtime";

describe("URAI focus and replay evidence runtime", () => {
  it("locks persistent focus session and replay evidence rail contracts", () => {
    expect(URAI_FOCUS_SESSION_RUNTIME).toMatchObject({
      collection: "focusSessions",
      route: "/focus/session/[sessionId]",
      ownerField: "ownerUid",
      recoverOnRefresh: true,
      mobileFallback: "static-focus-card",
      reducedMotionFallback: "short-dissolve-to-focus-card",
    });
    expect(URAI_REPLAY_EVIDENCE_RAIL).toMatchObject({
      collection: "replayEvidence",
      route: "/replay/[replayId]",
      ownerField: "ownerUid",
      provenanceDrawerRequired: true,
      exportDeleteLinked: true,
      aiReadableOnlyWhenPermissioned: true,
    });
    expect(assertUraiFocusReplayRuntimeIntegrity()).toEqual([]);
  });

  it("sorts replay evidence deterministically for rail rendering", () => {
    const items: UraiReplayEvidenceItem[] = [
      evidence("derived", "derived_insight", 4),
      evidence("audio", "audio", 1),
      evidence("transcript", "transcript", 1),
      evidence("location", "location", 2),
    ];

    expect(sortReplayEvidenceRail(items).map((item) => item.id)).toEqual(["audio", "transcript", "location", "derived"]);
  });

  it("protects sensitive, vaulted, and deleted evidence visibility", () => {
    expect(resolveReplayEvidenceVisibility(evidence("safe", "audio", 1))).toBe("visible");
    expect(resolveReplayEvidenceVisibility({ ...evidence("sensitive", "transcript", 1), privacyState: "sensitive" })).toBe("redacted");
    expect(resolveReplayEvidenceVisibility({ ...evidence("low", "device", 1), confidence: "low" })).toBe("redacted");
    expect(resolveReplayEvidenceVisibility({ ...evidence("vaulted", "audio", 1), privacyState: "vaulted" })).toBe("locked");
    expect(resolveReplayEvidenceVisibility({ ...evidence("deleted", "audio", 1), privacyState: "deleted" })).toBe("locked");
  });
});

function evidence(id: string, kind: UraiReplayEvidenceItem["kind"], displayOrder: number): UraiReplayEvidenceItem {
  return {
    id,
    ownerUid: "owner-1",
    replayId: "replay-1",
    sourceRef: `source:${id}`,
    kind,
    confidence: "direct",
    visibility: "visible",
    displayOrder,
    privacyState: "private",
  };
}
