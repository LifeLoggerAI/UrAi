import { CRITICAL_GENESIS_ASSET_KEYS, URAI_ASSET_MANIFEST, type UraiAssetKey } from "./uraiAssetManifest";

export type AssetDebugReport = {
  total: number;
  critical: number;
  manifestKeys: UraiAssetKey[];
  criticalKeys: UraiAssetKey[];
  missingAssetKeys: UraiAssetKey[];
  criticalMissingKeys: UraiAssetKey[];
};

export function validateAssetManifest(): boolean {
  return Object.values(URAI_ASSET_MANIFEST).every((entry) => Boolean(entry.key && entry.path && entry.layerType && entry.fallback && entry.preferredFormat && entry.expectedDimensions));
}

export function getMissingAssetKeys(): UraiAssetKey[] {
  // Browser-side code cannot reliably check static file existence without fetching every asset.
  // SafeLayerImage hides failed layers at render time. This function is a manifest-level hook
  // for dev tooling and server/build checks.
  return [];
}

export function getCriticalAssetStatus(): { configured: UraiAssetKey[]; missing: UraiAssetKey[] } {
  return {
    configured: CRITICAL_GENESIS_ASSET_KEYS,
    missing: getMissingAssetKeys().filter((key) => CRITICAL_GENESIS_ASSET_KEYS.includes(key)),
  };
}

export function getAssetDebugReport(): AssetDebugReport {
  const manifestKeys = Object.keys(URAI_ASSET_MANIFEST) as UraiAssetKey[];
  const missingAssetKeys = getMissingAssetKeys();
  return {
    total: manifestKeys.length,
    critical: CRITICAL_GENESIS_ASSET_KEYS.length,
    manifestKeys,
    criticalKeys: CRITICAL_GENESIS_ASSET_KEYS,
    missingAssetKeys,
    criticalMissingKeys: missingAssetKeys.filter((key) => CRITICAL_GENESIS_ASSET_KEYS.includes(key)),
  };
}

export function logAssetDebugReportInDevelopment(): void {
  if (process.env.NODE_ENV !== "development") return;
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem("urai.dev.assetReport") !== "true") return;
  // Do not show this in UI. Developer console only.
  console.info("URAI_ASSET_DEBUG_REPORT", getAssetDebugReport());
}
