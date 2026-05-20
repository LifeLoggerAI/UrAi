import {
  URAI_ASSET_SIZE_BUDGETS,
  URAI_GOVERNED_ASSET_MANIFEST,
  assertUraiAssetGovernanceIntegrity,
  validateGovernedAssetManifestEntry,
} from "@/lib/urai-canon/asset-governance";

describe("URAI asset governance canon", () => {
  it("keeps governed route asset coverage for canonical spatial surfaces", () => {
    expect(assertUraiAssetGovernanceIntegrity()).toEqual([]);
    expect(URAI_GOVERNED_ASSET_MANIFEST.some((entry) => entry.routeUsed === "/home")).toBe(true);
    expect(URAI_GOVERNED_ASSET_MANIFEST.some((entry) => entry.routeUsed === "/life-map")).toBe(true);
    expect(URAI_GOVERNED_ASSET_MANIFEST.some((entry) => entry.routeUsed === "/focus")).toBe(true);
    expect(URAI_GOVERNED_ASSET_MANIFEST.some((entry) => entry.routeUsed === "/replay")).toBe(true);
  });

  it("requires mobile, reduced motion, and fallback variants for every governed asset", () => {
    for (const entry of URAI_GOVERNED_ASSET_MANIFEST) {
      expect(entry.desktopVariant).toBeTruthy();
      expect(entry.mobileVariant).toBeTruthy();
      expect(entry.reducedMotionVariant).toBeTruthy();
      expect(entry.fallbackVariant).toBeTruthy();
      expect(entry.license).not.toBe("unknown");
      expect(entry.fileSizeBudget).toBeGreaterThan(0);
      expect(entry.fileSizeBudget).toBeLessThanOrEqual(URAI_ASSET_SIZE_BUDGETS.cinematicLayer);
    }
  });

  it("blocks unsafe replay asset preload and oversize states", () => {
    const replayAsset = URAI_GOVERNED_ASSET_MANIFEST.find((entry) => entry.type === "replay-layer");
    expect(replayAsset).toBeDefined();
    expect(validateGovernedAssetManifestEntry({ ...replayAsset, preloadPolicy: "critical" }).unsafe.length).toBeGreaterThan(0);
    expect(validateGovernedAssetManifestEntry({ ...replayAsset, fileSizeBudget: URAI_ASSET_SIZE_BUDGETS.cinematicLayer + 1 }).unsafe.length).toBeGreaterThan(0);
  });
});
