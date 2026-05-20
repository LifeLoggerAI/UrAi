import { validateAssetManifestEntry, type UraiRouteId, type UraiValidationResult } from "./system";

export type UraiAssetType = "spatial-scene" | "orb-layer" | "floor-layer" | "sky-layer" | "star-layer" | "constellation-layer" | "focus-layer" | "replay-layer" | "audio-cue" | "fallback-static";
export type UraiAssetPerformanceClass = "low" | "medium" | "high" | "cinematic";
export type UraiAssetPreloadPolicy = "critical" | "route-hover" | "route-entry" | "lazy" | "manual-only";
export type UraiAssetLicense = "owned" | "generated-owned" | "licensed";

export type UraiGovernedAssetManifestEntry = {
  assetId: string;
  type: UraiAssetType;
  routeUsed: UraiRouteId | "shared";
  tierIntroduced: 1 | 2 | 3 | 4 | 5;
  desktopVariant: string;
  mobileVariant: string;
  reducedMotionVariant: string;
  fallbackVariant: string;
  fileSizeBudget: number;
  license: UraiAssetLicense;
  source: string;
  owner: "URAI" | "URAI Labs";
  version: string;
  preloadPolicy: UraiAssetPreloadPolicy;
  performanceClass: UraiAssetPerformanceClass;
};

export const URAI_ASSET_SIZE_BUDGETS = {
  criticalStatic: 180000,
  routeShell: 320000,
  cinematicLayer: 900000,
  audioCue: 160000,
  fallback: 120000,
} as const;

export const URAI_GOVERNED_ASSET_MANIFEST: UraiGovernedAssetManifestEntry[] = [
  {
    assetId: "urai-shared-cosmic-atmosphere-shell",
    type: "spatial-scene",
    routeUsed: "shared",
    tierIntroduced: 1,
    desktopVariant: "css-gradient-nebula-desktop",
    mobileVariant: "css-gradient-nebula-mobile",
    reducedMotionVariant: "static-nebula-gradient",
    fallbackVariant: "deep-navy-static-background",
    fileSizeBudget: URAI_ASSET_SIZE_BUDGETS.criticalStatic,
    license: "generated-owned",
    source: "repo-css-token-renderer",
    owner: "URAI Labs",
    version: "1.0.0",
    preloadPolicy: "critical",
    performanceClass: "low",
  },
  {
    assetId: "urai-world-orb-shell",
    type: "orb-layer",
    routeUsed: "/home",
    tierIntroduced: 1,
    desktopVariant: "css-radial-orb-desktop",
    mobileVariant: "css-radial-orb-mobile",
    reducedMotionVariant: "static-orb-core",
    fallbackVariant: "static-cyan-orb",
    fileSizeBudget: URAI_ASSET_SIZE_BUDGETS.routeShell,
    license: "generated-owned",
    source: "repo-css-token-renderer",
    owner: "URAI Labs",
    version: "1.0.0",
    preloadPolicy: "critical",
    performanceClass: "low",
  },
  {
    assetId: "urai-life-map-memory-stars",
    type: "star-layer",
    routeUsed: "/life-map",
    tierIntroduced: 1,
    desktopVariant: "deterministic-starfield-desktop",
    mobileVariant: "deterministic-starfield-mobile-sparse",
    reducedMotionVariant: "static-starfield",
    fallbackVariant: "sparse-static-stars",
    fileSizeBudget: URAI_ASSET_SIZE_BUDGETS.routeShell,
    license: "generated-owned",
    source: "deterministic-layout-code",
    owner: "URAI Labs",
    version: "1.0.0",
    preloadPolicy: "route-entry",
    performanceClass: "medium",
  },
  {
    assetId: "urai-focus-orb-chamber",
    type: "focus-layer",
    routeUsed: "/focus",
    tierIntroduced: 2,
    desktopVariant: "focus-chamber-orb-desktop",
    mobileVariant: "focus-chamber-orb-mobile",
    reducedMotionVariant: "static-focus-chamber",
    fallbackVariant: "focus-card-shell",
    fileSizeBudget: URAI_ASSET_SIZE_BUDGETS.routeShell,
    license: "generated-owned",
    source: "repo-css-token-renderer",
    owner: "URAI Labs",
    version: "1.0.0",
    preloadPolicy: "route-entry",
    performanceClass: "low",
  },
  {
    assetId: "urai-replay-evidence-theater-shell",
    type: "replay-layer",
    routeUsed: "/replay",
    tierIntroduced: 4,
    desktopVariant: "replay-evidence-theater-desktop",
    mobileVariant: "replay-evidence-theater-mobile",
    reducedMotionVariant: "static-replay-evidence-shell",
    fallbackVariant: "source-backed-replay-card",
    fileSizeBudget: URAI_ASSET_SIZE_BUDGETS.cinematicLayer,
    license: "generated-owned",
    source: "repo-css-token-renderer",
    owner: "URAI Labs",
    version: "1.0.0",
    preloadPolicy: "route-entry",
    performanceClass: "medium",
  },
];

export function validateGovernedAssetManifestEntry(entry: unknown): UraiValidationResult {
  const base = validateAssetManifestEntry(entry);
  const unsafe = [...base.unsafe];

  if (entry && typeof entry === "object") {
    const record = entry as Record<string, unknown>;
    if (record.type === "replay-layer" && record.preloadPolicy === "critical") {
      unsafe.push("replay cinematic layers must not be critical-preloaded");
    }
    if (record.performanceClass === "cinematic" && record.reducedMotionVariant === record.desktopVariant) {
      unsafe.push("cinematic assets require a distinct reduced-motion variant");
    }
    if (typeof record.fileSizeBudget === "number" && record.fileSizeBudget > URAI_ASSET_SIZE_BUDGETS.cinematicLayer) {
      unsafe.push("asset exceeds route cinematic file-size budget");
    }
  }

  return { ok: base.missing.length === 0 && unsafe.length === 0, missing: base.missing, unsafe };
}

export function assertUraiAssetGovernanceIntegrity(entries: readonly UraiGovernedAssetManifestEntry[] = URAI_GOVERNED_ASSET_MANIFEST): string[] {
  const failures: string[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    if (seen.has(entry.assetId)) failures.push(`Duplicate assetId: ${entry.assetId}`);
    seen.add(entry.assetId);

    const result = validateGovernedAssetManifestEntry(entry);
    failures.push(...result.missing.map((field) => `${entry.assetId} missing ${field}`));
    failures.push(...result.unsafe.map((issue) => `${entry.assetId}: ${issue}`));
  }

  for (const requiredRoute of ["/home", "/life-map", "/focus", "/replay"] as const) {
    if (!entries.some((entry) => entry.routeUsed === requiredRoute)) {
      failures.push(`Missing governed asset coverage for ${requiredRoute}`);
    }
  }

  return failures;
}
