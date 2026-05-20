import {
  URAI_CAMERA_PRESETS,
  URAI_RUNTIME_PRODUCTION_GAPS,
  URAI_SPATIAL_ROUTE_RUNTIME,
  URAI_VISUAL_RUNTIME_LAYERS,
  assertUraiSpatialRuntimeIntegrity,
  getSpatialRuntimeContract,
} from "@/lib/urai-canon/spatial-runtime";
import { URAI_REQUIRED_ROUTES } from "@/lib/urai-canon/system";

describe("URAI spatial runtime contracts", () => {
  it("maps every canonical route to a direct-load spatial runtime contract", () => {
    expect(Object.keys(URAI_SPATIAL_ROUTE_RUNTIME)).toEqual([...URAI_REQUIRED_ROUTES]);

    for (const route of URAI_REQUIRED_ROUTES) {
      const contract = getSpatialRuntimeContract(route);
      expect(contract.route).toBe(route);
      expect(contract.mustDirectLoad).toBe(true);
      expect(contract.mobileSafeComposition).toBe(true);
      expect(contract.reducedMotionEquivalent).toBe(true);
      expect(contract.loadingEmptyErrorHandled).toBe(true);
      expect(contract.evidenceSafe).toBe(true);
      expect(URAI_CAMERA_PRESETS[contract.cameraPreset]).toBeDefined();
    }
  });

  it("locks canonical screen identities for home, life-map, focus, and replay", () => {
    expect(getSpatialRuntimeContract("/home").canonicalScreen).toBe("home");
    expect(getSpatialRuntimeContract("/life-map").canonicalScreen).toBe("life-map");
    expect(getSpatialRuntimeContract("/life-map/star/[starId]").stableMode).toBe("star-selected");
    expect(getSpatialRuntimeContract("/focus").canonicalScreen).toBe("focus");
    expect(getSpatialRuntimeContract("/focus/session/[sessionId]").stableMode).toBe("focus-session");
    expect(getSpatialRuntimeContract("/replay").canonicalScreen).toBe("replay");
    expect(getSpatialRuntimeContract("/replay/[replayId]").primaryObject).toBe("replay-theater");
  });

  it("locks sacred-tech visual runtime layers and camera presets", () => {
    expect(URAI_VISUAL_RUNTIME_LAYERS).toContain("deep-navy-violet-cosmic-atmosphere");
    expect(URAI_VISUAL_RUNTIME_LAYERS).toContain("dark-glass-stone-or-reflective-water-floor");
    expect(URAI_VISUAL_RUNTIME_LAYERS).toContain("central-orb-or-tree-life-anchor");
    expect(URAI_VISUAL_RUNTIME_LAYERS).toContain("memory-star-particles");
    expect(URAI_VISUAL_RUNTIME_LAYERS).toContain("constellation-chapter-lines");
    expect(URAI_VISUAL_RUNTIME_LAYERS).toContain("nebula-emotional-season-bands");
    expect(URAI_CAMERA_PRESETS.home.fov).toBeGreaterThanOrEqual(35);
    expect(URAI_CAMERA_PRESETS.lifeMap.fov).toBeGreaterThanOrEqual(46);
    expect(URAI_CAMERA_PRESETS.replay.lensFeeling).toContain("memory theater");
  });

  it("keeps production gaps explicit instead of pretending final completion", () => {
    expect(URAI_RUNTIME_PRODUCTION_GAPS.verification).toContain("fresh CI run review");
    expect(URAI_RUNTIME_PRODUCTION_GAPS.cinematicDepth).toContain("full R3F camera controller beyond static premium shell");
    expect(URAI_RUNTIME_PRODUCTION_GAPS.evidenceSystems).toContain("persistent replay evidence rail");
    expect(assertUraiSpatialRuntimeIntegrity()).toEqual([]);
  });
});
