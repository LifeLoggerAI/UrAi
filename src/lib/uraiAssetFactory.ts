import manifest from "../../public/assets/urai/manifest.json";

export type UraiAssetStatus = "needed" | "placeholder" | "ready" | "missing";
export type UraiAssetPriority = "launch-critical" | "high" | "medium" | "future";

export type UraiAssetManifestEntry = {
  asset_id: string;
  name: string;
  route: string;
  category: string;
  purpose: string;
  format: string[];
  status: UraiAssetStatus | string;
  priority: UraiAssetPriority | string;
  file_path: string | null;
  fallback: string | null;
  needed_for_launch: boolean;
  license: string;
  cost: number;
  source: string;
  notes: string;
};

export type UraiAssetManifest = {
  version: string;
  updated: string;
  product: string;
  rules: string[];
  routes: Record<string, string[]>;
  assets: UraiAssetManifestEntry[];
};

export const uraiAssetManifest = manifest as UraiAssetManifest;

export function getUraiAsset(assetId: string): UraiAssetManifestEntry | undefined {
  return uraiAssetManifest.assets.find((asset) => asset.asset_id === assetId);
}

export function getUraiRouteAssets(route: string): UraiAssetManifestEntry[] {
  const ids = uraiAssetManifest.routes[route] ?? [];
  return ids.map(getUraiAsset).filter((asset): asset is UraiAssetManifestEntry => Boolean(asset));
}

export function getUraiAssetRuntimePath(asset: UraiAssetManifestEntry): string | null {
  return asset.file_path ?? asset.fallback ?? null;
}

export function getUraiLaunchCriticalAssets(): UraiAssetManifestEntry[] {
  return uraiAssetManifest.assets.filter((asset) => asset.needed_for_launch || asset.priority === "launch-critical");
}

export function getUraiAssetFactorySummary() {
  const total = uraiAssetManifest.assets.length;
  const ready = uraiAssetManifest.assets.filter((asset) => asset.status === "ready").length;
  const placeholder = uraiAssetManifest.assets.filter((asset) => asset.status === "placeholder").length;
  const missing = uraiAssetManifest.assets.filter((asset) => asset.status === "missing" || (!asset.file_path && !asset.fallback)).length;
  const launchCriticalMissing = getUraiLaunchCriticalAssets().filter((asset) => !asset.file_path && !asset.fallback).length;

  return {
    version: uraiAssetManifest.version,
    updated: uraiAssetManifest.updated,
    total,
    ready,
    placeholder,
    missing,
    launchCriticalMissing,
  };
}
