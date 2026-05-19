import {
  createTierTwoAnalyticsEvent,
  sanitizeTierTwoAnalyticsMetadata,
  validateTierTwoAnalyticsEvent,
  validateTierTwoFocusMetadata,
  validateTierTwoReplayMetadata,
} from "@/lib/urai-canon/tier-two-contracts";

describe("URAI Tier 2 metadata and analytics contracts", () => {
  it("sanitizes private content keys from analytics metadata", () => {
    expect(
      sanitizeTierTwoAnalyticsMetadata({
        starId: "starter-star",
        content: "private text",
        evidenceRefs: "source-1",
        filter: "all",
      }),
    ).toEqual({ starId: "starter-star", filter: "all" });
  });

  it("creates privacy-safe analytics events", () => {
    const event = createTierTwoAnalyticsEvent({
      name: "life_map_star_previewed",
      route: "/life-map",
      generatedAt: "2026-05-19T00:00:00.000Z",
      privacyState: "private",
      metadata: {
        starId: "starter-star",
        rawText: "remove me",
        isSelected: true,
      },
    });

    expect(event.metadata).toEqual({ starId: "starter-star", isSelected: true });
    expect(validateTierTwoAnalyticsEvent(event)).toEqual([]);
  });

  it("blocks analytics events for restricted privacy states", () => {
    expect(
      validateTierTwoAnalyticsEvent({
        name: "replay_opened",
        route: "/replay/replay-1",
        generatedAt: "2026-05-19T00:00:00.000Z",
        privacyState: "vaulted",
        metadata: { replayId: "replay-1" },
      }),
    ).toContain("Tier 2 analytics cannot emit sensitive, vaulted, or deleted content events.");
  });

  it("validates Tier 2 focus completion metadata", () => {
    expect(
      validateTierTwoFocusMetadata({
        sessionId: "session-1",
        sourceStarId: "starter-star",
        intent: "deep-work",
        state: "completed",
        completedAt: "2026-05-19T00:30:00.000Z",
        privacyState: "private",
      }),
    ).toEqual([]);

    expect(
      validateTierTwoFocusMetadata({
        sessionId: "session-1",
        intent: "deep-work",
        state: "completed",
        privacyState: "private",
      }),
    ).toContain("Completed focus sessions require completedAt.");
  });

  it("validates Tier 2 replay source and chapter metadata", () => {
    expect(
      validateTierTwoReplayMetadata({
        replayId: "replay-1",
        sourceRefs: ["memory-1"],
        chapterIds: ["chapter-1"],
        state: "playing",
        privacyState: "private",
        correctionAllowed: true,
        redactionAllowed: true,
      }),
    ).toEqual([]);

    expect(
      validateTierTwoReplayMetadata({
        replayId: "replay-1",
        sourceRefs: [],
        chapterIds: [],
        state: "playing",
        privacyState: "private",
        correctionAllowed: true,
        redactionAllowed: true,
      }),
    ).toEqual(["Replay metadata requires at least one source reference.", "Playing replay requires at least one chapter."]);
  });
});
