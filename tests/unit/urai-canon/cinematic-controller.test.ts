import {
  URAI_CINEMATIC_TRANSITIONS,
  assertUraiCinematicTransitionIntegrity,
  resolveUraiCameraFrame,
} from "@/lib/urai-canon/cinematic-controller";

describe("URAI cinematic transition controller", () => {
  it("locks all canonical spatial transitions with sane timing", () => {
    expect(Object.keys(URAI_CINEMATIC_TRANSITIONS)).toEqual([
      "homeToLifeMap",
      "lifeMapStarToFocus",
      "focusToReplay",
      "replayToFocusEsc",
      "focusToLifeMapEsc",
      "lifeMapToHome",
    ]);
    expect(assertUraiCinematicTransitionIntegrity()).toEqual([]);
  });

  it("interpolates camera frames and keeps input locked during travel", () => {
    const start = resolveUraiCameraFrame("homeToLifeMap", 0);
    const mid = resolveUraiCameraFrame("homeToLifeMap", 900);
    const end = resolveUraiCameraFrame("homeToLifeMap", 2200);

    expect(start.inputLocked).toBe(true);
    expect(mid.inputLocked).toBe(true);
    expect(end.inputLocked).toBe(false);
    expect(start.position[2]).not.toBe(end.position[2]);
    expect(mid.fog).toBeGreaterThan(0);
  });

  it("uses short reduced-motion equivalents instead of long camera travel", () => {
    const reducedStart = resolveUraiCameraFrame("focusToReplay", 0, true);
    const reducedEnd = resolveUraiCameraFrame("focusToReplay", 240, true);

    expect(reducedStart.inputLocked).toBe(true);
    expect(reducedEnd.inputLocked).toBe(false);
    expect(reducedEnd.uiOpacity).toBe(1);
  });
});
