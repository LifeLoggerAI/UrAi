import {
  buildDigitalMoodWeather,
  calculateMentalLoadScore,
  classifyRhythmState,
  isUnsafeCertaintyClaim,
  safeNarratorInsightFromSignals,
  softenSensitiveInsight,
} from "@/lib/urai-genesis/intelligence";
import { hasPermissionGrant, type PermissionGrant } from "@/lib/types";

describe("URAI Genesis intelligence utilities", () => {
  it("scores mental load deterministically", () => {
    expect(
      calculateMentalLoadScore({
        shadowMetrics: [{ value: 1 }, { value: 0.5 }],
        obscuraPatterns: [{ intensity: 0 }],
        stressSignals: [{ intensity: 0.5 }],
      }),
    ).toBe(50);
  });

  it("classifies rhythm states safely", () => {
    expect(classifyRhythmState(10)).toBe("stable");
    expect(classifyRhythmState(35)).toBe("recovering");
    expect(classifyRhythmState(60)).toBe("off_rhythm");
    expect(classifyRhythmState(90)).toBe("overstimulated");
  });

  it("maps mental load into digital mood weather", () => {
    const weather = buildDigitalMoodWeather({
      userId: "user_1",
      score: 84,
      mood: { valence: "low", arousal: "high", tags: ["tired"] },
      generatedAt: "2026-06-07T00:00:00.000Z",
    });

    expect(weather.weatherState).toBe("storm");
    expect(weather.orbBehavior).toBe("grounding");
    expect(weather.groundBehavior).toBe("threshold");
    expect(weather.narratorTone).toBe("grounding");
  });

  it("keeps narrator wording inferential", () => {
    expect(safeNarratorInsightFromSignals(["sleep shifted later", "more context switching"])).toContain("may be worth noticing");
  });

  it("detects and softens unsafe certainty claims", () => {
    expect(isUnsafeCertaintyClaim("They are lying to you.")).toBe(true);
    expect(softenSensitiveInsight("They are lying to you.")).toContain("possible signal shift");
  });

  it("checks permission grants by category", () => {
    const grants: PermissionGrant[] = [
      {
        id: "grant_1",
        userId: "user_1",
        category: "audio_transcription",
        status: "granted",
        updatedAt: "2026-06-07T00:00:00.000Z",
      },
    ];

    expect(hasPermissionGrant(grants, "audio_transcription")).toBe(true);
    expect(hasPermissionGrant(grants, "facial_environment_inference")).toBe(false);
  });
});
