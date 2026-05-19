import {
  URAI_INITIAL_ROUTE_MACHINE,
  reduceUraiFocusSessionState,
  reduceUraiReplayState,
  reduceUraiRouteMachine,
} from "@/lib/urai-canon/state-machines";

describe("URAI Tier 1 and Tier 2 state machines", () => {
  it("models the Tier 1 core route loop", () => {
    const lifeMap = reduceUraiRouteMachine(URAI_INITIAL_ROUTE_MACHINE, { type: "OPEN_LIFE_MAP" });
    expect(lifeMap).toMatchObject({ state: "life-map", route: "/life-map" });

    const selectedStar = reduceUraiRouteMachine(lifeMap, { type: "SELECT_STAR", starId: "star-1" });
    expect(selectedStar).toMatchObject({ state: "star-selected", route: "/life-map/star/[starId]", starId: "star-1" });

    const focus = reduceUraiRouteMachine(selectedStar, { type: "OPEN_FOCUS", starId: "star-1" });
    expect(focus).toMatchObject({ state: "focus-setup", route: "/focus", starId: "star-1" });

    const session = reduceUraiRouteMachine(focus, { type: "OPEN_FOCUS_SESSION", sessionId: "session-1" });
    expect(session).toMatchObject({ state: "focus-session", route: "/focus/session/[sessionId]", sessionId: "session-1" });

    const replay = reduceUraiRouteMachine({ ...session, replayId: "replay-1" }, { type: "OPEN_REPLAY_DETAIL", replayId: "replay-1" });
    expect(replay).toMatchObject({ state: "replay-detail", route: "/replay/[replayId]", replayId: "replay-1" });
  });

  it("models ESC/back unwind without route dead ends", () => {
    const replay = { state: "replay-detail" as const, route: "/replay/[replayId]" as const, sessionId: "session-1", replayId: "replay-1" };
    const focus = reduceUraiRouteMachine(replay, { type: "ESC" });
    expect(focus).toMatchObject({ state: "focus-session", route: "/focus/session/[sessionId]", sessionId: "session-1" });

    const map = reduceUraiRouteMachine(focus, { type: "ESC" });
    expect(map).toMatchObject({ state: "life-map", route: "/life-map" });

    const home = reduceUraiRouteMachine(map, { type: "ESC" });
    expect(home).toMatchObject({ state: "home", route: "/home" });
  });

  it("routes invalid and locked IDs to visible parent fallback notices", () => {
    const invalidStar = reduceUraiRouteMachine(URAI_INITIAL_ROUTE_MACHINE, { type: "INVALID_ID", parent: "star-selected" });
    expect(invalidStar).toMatchObject({ state: "fallback-notice", route: "/life-map" });
    expect(invalidStar.notice).toContain("unavailable");

    const lockedReplay = reduceUraiRouteMachine(URAI_INITIAL_ROUTE_MACHINE, { type: "LOCKED_OR_PRIVATE", parent: "replay-detail" });
    expect(lockedReplay).toMatchObject({ state: "fallback-notice", route: "/focus" });
    expect(lockedReplay.notice).toContain("private");
  });

  it("models focus session start, pause, recovery, completion, and archive", () => {
    let state = reduceUraiFocusSessionState("idle", "CHOOSE_INTENT");
    expect(state).toBe("planning");
    state = reduceUraiFocusSessionState(state, "CLARIFY_NEXT_ACTION");
    expect(state).toBe("ready");
    state = reduceUraiFocusSessionState(state, "START");
    expect(state).toBe("active");
    state = reduceUraiFocusSessionState(state, "DISTRACTION_DETECTED");
    expect(state).toBe("recovery");
    state = reduceUraiFocusSessionState(state, "RECOVER");
    expect(state).toBe("active");
    state = reduceUraiFocusSessionState(state, "COMPLETE");
    expect(state).toBe("completed");
    state = reduceUraiFocusSessionState(state, "ARCHIVE");
    expect(state).toBe("archived");
  });

  it("models replay truth-safe review, playback, correction, redaction, and archive", () => {
    let state = reduceUraiReplayState("library", "SELECT_REPLAY");
    expect(state).toBe("source-selection");
    state = reduceUraiReplayState(state, "CHOOSE_SOURCES");
    expect(state).toBe("sensitive-preview");
    state = reduceUraiReplayState(state, "PREVIEW_SENSITIVE_CONTENT");
    expect(state).toBe("draft-review");
    state = reduceUraiReplayState(state, "APPROVE_DRAFT");
    expect(state).toBe("playing");
    state = reduceUraiReplayState(state, "CORRECT");
    expect(state).toBe("correction");
    state = reduceUraiReplayState(state, "RETURN_TO_PLAYBACK");
    expect(state).toBe("playing");
    state = reduceUraiReplayState(state, "REDACT");
    expect(state).toBe("redaction");
    state = reduceUraiReplayState(state, "EXPORT");
    expect(state).toBe("export-review");
    state = reduceUraiReplayState(state, "ARCHIVE");
    expect(state).toBe("archived");
  });
});
