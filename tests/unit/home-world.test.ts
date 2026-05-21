import {
  DEFAULT_HOME_WORLD_STATE,
  normalizeHomeWorldState,
  orbStateForHomeWorld,
  type HomeWorldState,
} from "@/lib/home-world";

describe("HomeWorld contract", () => {
  test("normalizes a complete canonical HomeWorld state", () => {
    const state = normalizeHomeWorldState({
      userId: "user-1",
      groundTier: 5,
      orbTier: 4,
      skyTier: 3,
      moodState: "focused",
      recoveryState: "stable",
      energyScore: 88,
      narratorSpeaking: true,
      orbPulseIntensity: 0.75,
      skyWeatherIntensity: 0.45,
      groundGrowthIntensity: 0.91,
      updatedAt: "2026-05-21T00:00:00.000Z",
    }, "user-1");

    expect(state).toMatchObject({
      userId: "user-1",
      groundTier: 5,
      orbTier: 4,
      skyTier: 3,
      moodState: "focused",
      recoveryState: "stable",
      energyScore: 88,
      narratorSpeaking: true,
    });
  });

  test("clamps unsafe numeric inputs and falls back for invalid enums", () => {
    const state = normalizeHomeWorldState({
      userId: "",
      groundTier: 99,
      orbTier: -2,
      skyTier: 2.2,
      moodState: "invalid",
      recoveryState: "invalid",
      energyScore: 999,
      narratorSpeaking: "yes",
      orbPulseIntensity: -1,
      skyWeatherIntensity: 4,
      groundGrowthIntensity: Number.NaN,
      updatedAt: "",
    }, "owner-1");

    expect(state.userId).toBe("owner-1");
    expect(state.groundTier).toBe(5);
    expect(state.orbTier).toBe(1);
    expect(state.skyTier).toBe(2);
    expect(state.moodState).toBe(DEFAULT_HOME_WORLD_STATE.moodState);
    expect(state.recoveryState).toBe(DEFAULT_HOME_WORLD_STATE.recoveryState);
    expect(state.energyScore).toBe(100);
    expect(state.narratorSpeaking).toBe(false);
    expect(state.orbPulseIntensity).toBe(0);
    expect(state.skyWeatherIntensity).toBe(1);
    expect(state.groundGrowthIntensity).toBe(DEFAULT_HOME_WORLD_STATE.groundGrowthIntensity);
    expect(state.updatedAt).toBe(DEFAULT_HOME_WORLD_STATE.updatedAt);
  });

  test.each<[Partial<HomeWorldState>, string]>([
    [{ narratorSpeaking: true }, "speaking"],
    [{ moodState: "shadow" }, "shadowTension"],
    [{ moodState: "dream" }, "dreamMode"],
    [{ moodState: "focused" }, "focusMode"],
    [{ recoveryState: "awakened" }, "recoveryBloom"],
    [{ energyScore: 10, recoveryState: "stable", moodState: "calm" }, "offline"],
  ])("derives orb state from HomeWorld state %#", (patch, expected) => {
    expect(orbStateForHomeWorld({ ...DEFAULT_HOME_WORLD_STATE, ...patch })).toBe(expected);
  });

  test("reduced motion always wins orb state", () => {
    expect(orbStateForHomeWorld({ ...DEFAULT_HOME_WORLD_STATE, narratorSpeaking: true }, true)).toBe("reducedMotion");
  });
});
