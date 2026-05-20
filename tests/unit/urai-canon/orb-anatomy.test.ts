import {
  URAI_ORB_ANATOMY_LAYERS,
  assertUraiOrbAnatomyIntegrity,
  visibleOrbLayersForState,
} from "@/lib/urai-canon/orb-anatomy";

describe("URAI orb anatomy runtime canon", () => {
  it("locks required orb anatomy roles", () => {
    expect(assertUraiOrbAnatomyIntegrity()).toEqual([]);
    expect(URAI_ORB_ANATOMY_LAYERS.some((layer) => layer.role === "outer-shell")).toBe(true);
    expect(URAI_ORB_ANATOMY_LAYERS.some((layer) => layer.role === "orbital-ring")).toBe(true);
    expect(URAI_ORB_ANATOMY_LAYERS.some((layer) => layer.role === "core")).toBe(true);
    expect(URAI_ORB_ANATOMY_LAYERS.some((layer) => layer.role === "reflection")).toBe(true);
  });

  it("surfaces richer orb layers for focus and replay than reduced motion", () => {
    expect(visibleOrbLayersForState("focus").length).toBeGreaterThan(visibleOrbLayersForState("reduced-motion").length);
    expect(visibleOrbLayersForState("replay").some((layer) => layer.role === "energy-filament")).toBe(true);
    expect(visibleOrbLayersForState("reduced-motion").every((layer) => layer.reducedMotionBehavior !== "single-pulse")).toBe(true);
  });

  it("keeps all layer opacity and motion values safe", () => {
    for (const layer of URAI_ORB_ANATOMY_LAYERS) {
      expect(layer.opacity).toBeGreaterThanOrEqual(0);
      expect(layer.opacity).toBeLessThanOrEqual(1);
      expect(layer.motionSeconds).toBeGreaterThanOrEqual(0);
    }
  });
});
