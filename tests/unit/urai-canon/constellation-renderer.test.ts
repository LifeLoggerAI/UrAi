import {
  URAI_CONSTELLATION_RENDER_BUDGETS,
  assertUraiConstellationRendererIntegrity,
  resolveConstellationLod,
} from "@/lib/urai-canon/constellation-renderer";

describe("URAI constellation renderer canon", () => {
  it("keeps renderer budgets inside mobile and desktop limits", () => {
    expect(assertUraiConstellationRendererIntegrity()).toEqual([]);
    expect(URAI_CONSTELLATION_RENDER_BUDGETS.mobile.maxBackgroundStars).toBeLessThan(URAI_CONSTELLATION_RENDER_BUDGETS.desktop.maxBackgroundStars);
    expect(URAI_CONSTELLATION_RENDER_BUDGETS.mobile.maxMemoryMb).toBeLessThanOrEqual(256);
    expect(URAI_CONSTELLATION_RENDER_BUDGETS.desktop.targetRenderMs).toBeLessThanOrEqual(160);
  });

  it("resolves LOD from star count and viewport", () => {
    expect(resolveConstellationLod(2, "mobile")).toBe("minimal");
    expect(resolveConstellationLod(30, "desktop")).toBe("balanced");
    expect(resolveConstellationLod(200, "desktop")).toBe("dense");
  });
});
