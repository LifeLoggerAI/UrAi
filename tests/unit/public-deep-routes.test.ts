import {
  isPublicDemoFocusSessionId,
  isPublicDemoMemoryId,
  isPublicDemoReplayId,
  isPublicDemoStarId,
  isSafeDeepRouteId,
  publicProfileHandle,
} from "@/lib/publicDeepRoutes";

describe("public deep-route guards", () => {
  it("allows only known Genesis sample memory and star IDs", () => {
    expect(isPublicDemoMemoryId("memory-001")).toBe(true);
    expect(isPublicDemoMemoryId("bloom-001")).toBe(true);
    expect(isPublicDemoMemoryId("not-real-private-id-123")).toBe(false);

    expect(isPublicDemoStarId("star-001")).toBe(true);
    expect(isPublicDemoStarId("star-threshold-before-clarity")).toBe(true);
    expect(isPublicDemoStarId("not-real-star-123")).toBe(false);
  });

  it("keeps focus and replay deep links constrained to public samples", () => {
    expect(isPublicDemoReplayId("sample-replay")).toBe(true);
    expect(isPublicDemoReplayId("not-real-replay-123")).toBe(false);

    expect(isPublicDemoFocusSessionId("sample-session")).toBe(true);
    expect(isPublicDemoFocusSessionId("not-real-session-123")).toBe(false);
  });

  it("rejects unsafe route identifiers and normalizes public handles", () => {
    expect(isSafeDeepRouteId("sample-safe-id")).toBe(true);
    expect(isSafeDeepRouteId("../private")).toBe(false);
    expect(isSafeDeepRouteId("")).toBe(false);

    expect(publicProfileHandle("AdamClamp")).toBe("adamclamp");
    expect(publicProfileHandle("../secret")).toBeNull();
  });
});
