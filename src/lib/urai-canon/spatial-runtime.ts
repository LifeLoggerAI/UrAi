import { URAI_REQUIRED_ROUTES, type UraiRouteId } from "./system";

export type UraiSpatialMode =
  | "home"
  | "home-entering"
  | "life-map-entering"
  | "life-map"
  | "star-selected"
  | "focus-entering"
  | "focus"
  | "focus-session"
  | "replay-entering"
  | "replay"
  | "returning-home"
  | "fallback-notice";

export type UraiCameraPreset = {
  position: readonly [number, number, number];
  target: readonly [number, number, number];
  fov: number;
  lensFeeling: string;
  reducedMotionBehavior: "snap-fade" | "short-dissolve" | "static-settle";
};

export type UraiSpatialRouteRuntimeContract = {
  route: UraiRouteId;
  stableMode: UraiSpatialMode;
  enteringMode: UraiSpatialMode;
  cameraPreset: keyof typeof URAI_CAMERA_PRESETS;
  canonicalScreen: "home" | "life-map" | "focus" | "replay";
  primaryObject: "world-orb" | "life-map-galaxy" | "focus-orb" | "replay-theater";
  mustDirectLoad: true;
  mobileSafeComposition: true;
  reducedMotionEquivalent: true;
  loadingEmptyErrorHandled: true;
  evidenceSafe: true;
};

export const URAI_CAMERA_PRESETS = {
  home: {
    position: [0, 5.2, 13.5],
    target: [0, 1.6, 0],
    fov: 42,
    lensFeeling: "calm sanctuary, avatar/orb grounded",
    reducedMotionBehavior: "static-settle",
  },
  lifeMapEntering: {
    position: [0, 18, 42],
    target: [0, 2, 0],
    fov: 46,
    lensFeeling: "continuous ascension into personal universe",
    reducedMotionBehavior: "short-dissolve",
  },
  lifeMap: {
    position: [0, 24, 72],
    target: [0, 0, 0],
    fov: 48,
    lensFeeling: "wide galaxy-scale life map overview",
    reducedMotionBehavior: "static-settle",
  },
  focus: {
    position: [0, 4.2, 10.5],
    target: [0, 1.8, 0],
    fov: 40,
    lensFeeling: "one selected star sealed into a calm chamber",
    reducedMotionBehavior: "short-dissolve",
  },
  replay: {
    position: [0, 2.9, 7.2],
    target: [0, 2.0, 0],
    fov: 38,
    lensFeeling: "inside-the-orb source-backed memory theater",
    reducedMotionBehavior: "snap-fade",
  },
} as const satisfies Record<string, UraiCameraPreset>;

export const URAI_SPATIAL_ROUTE_RUNTIME: Record<UraiRouteId, UraiSpatialRouteRuntimeContract> = {
  "/home": {
    route: "/home",
    stableMode: "home",
    enteringMode: "home-entering",
    cameraPreset: "home",
    canonicalScreen: "home",
    primaryObject: "world-orb",
    mustDirectLoad: true,
    mobileSafeComposition: true,
    reducedMotionEquivalent: true,
    loadingEmptyErrorHandled: true,
    evidenceSafe: true,
  },
  "/life-map": {
    route: "/life-map",
    stableMode: "life-map",
    enteringMode: "life-map-entering",
    cameraPreset: "lifeMap",
    canonicalScreen: "life-map",
    primaryObject: "life-map-galaxy",
    mustDirectLoad: true,
    mobileSafeComposition: true,
    reducedMotionEquivalent: true,
    loadingEmptyErrorHandled: true,
    evidenceSafe: true,
  },
  "/life-map/star/[starId]": {
    route: "/life-map/star/[starId]",
    stableMode: "star-selected",
    enteringMode: "life-map-entering",
    cameraPreset: "lifeMap",
    canonicalScreen: "life-map",
    primaryObject: "life-map-galaxy",
    mustDirectLoad: true,
    mobileSafeComposition: true,
    reducedMotionEquivalent: true,
    loadingEmptyErrorHandled: true,
    evidenceSafe: true,
  },
  "/focus": {
    route: "/focus",
    stableMode: "focus",
    enteringMode: "focus-entering",
    cameraPreset: "focus",
    canonicalScreen: "focus",
    primaryObject: "focus-orb",
    mustDirectLoad: true,
    mobileSafeComposition: true,
    reducedMotionEquivalent: true,
    loadingEmptyErrorHandled: true,
    evidenceSafe: true,
  },
  "/focus/session/[sessionId]": {
    route: "/focus/session/[sessionId]",
    stableMode: "focus-session",
    enteringMode: "focus-entering",
    cameraPreset: "focus",
    canonicalScreen: "focus",
    primaryObject: "focus-orb",
    mustDirectLoad: true,
    mobileSafeComposition: true,
    reducedMotionEquivalent: true,
    loadingEmptyErrorHandled: true,
    evidenceSafe: true,
  },
  "/replay": {
    route: "/replay",
    stableMode: "replay",
    enteringMode: "replay-entering",
    cameraPreset: "replay",
    canonicalScreen: "replay",
    primaryObject: "replay-theater",
    mustDirectLoad: true,
    mobileSafeComposition: true,
    reducedMotionEquivalent: true,
    loadingEmptyErrorHandled: true,
    evidenceSafe: true,
  },
  "/replay/[replayId]": {
    route: "/replay/[replayId]",
    stableMode: "replay",
    enteringMode: "replay-entering",
    cameraPreset: "replay",
    canonicalScreen: "replay",
    primaryObject: "replay-theater",
    mustDirectLoad: true,
    mobileSafeComposition: true,
    reducedMotionEquivalent: true,
    loadingEmptyErrorHandled: true,
    evidenceSafe: true,
  },
};

export const URAI_VISUAL_RUNTIME_LAYERS = [
  "deep-navy-violet-cosmic-atmosphere",
  "moonlit-silver-and-pale-cyan-lighting",
  "soft-white-gold-living-core-accents",
  "dark-glass-stone-or-reflective-water-floor",
  "central-orb-or-tree-life-anchor",
  "memory-star-particles",
  "constellation-chapter-lines",
  "nebula-emotional-season-bands",
  "minimal-hidden-ui-safe-zones",
] as const;

export const URAI_RUNTIME_PRODUCTION_GAPS = {
  verification: [
    "fresh CI run review",
    "npm install from real checkout",
    "typecheck/lint/unit/rules/build/smoke evidence",
    "production deploy and post-deploy smoke evidence",
  ],
  cinematicDepth: [
    "full R3F camera controller beyond static premium shell",
    "shader-grade reflective floor and water treatment",
    "runtime orb anatomy with inner rings, filaments, and stateful lighting",
    "dense constellation renderer with LOD and mobile budget enforcement",
    "volumetric nebula and emotional-season bands",
  ],
  evidenceSystems: [
    "persistent replay evidence rail",
    "provenance drawer backed by real source refs",
    "redaction/export/delete derivative cleanup backend",
    "artifact unlock validation against persistent permissions",
  ],
  productMaturity: [
    "Storybook or component state catalog",
    "analytics observability dashboard",
    "full keyboard and screen-reader QA evidence",
    "visual regression screenshots for mobile and desktop",
  ],
} as const;

export function getSpatialRuntimeContract(route: UraiRouteId): UraiSpatialRouteRuntimeContract {
  return URAI_SPATIAL_ROUTE_RUNTIME[route];
}

export function assertUraiSpatialRuntimeIntegrity(): string[] {
  const failures: string[] = [];

  for (const route of URAI_REQUIRED_ROUTES) {
    const contract = URAI_SPATIAL_ROUTE_RUNTIME[route];
    if (!contract) failures.push(`Missing spatial runtime contract for route: ${route}`);
    if (contract && contract.route !== route) failures.push(`Spatial runtime route mismatch: ${route}`);
    if (contract && !contract.mustDirectLoad) failures.push(`Spatial runtime must direct-load: ${route}`);
    if (contract && !contract.mobileSafeComposition) failures.push(`Spatial runtime must be mobile-safe: ${route}`);
    if (contract && !contract.reducedMotionEquivalent) failures.push(`Spatial runtime must have reduced-motion equivalent: ${route}`);
    if (contract && !contract.loadingEmptyErrorHandled) failures.push(`Spatial runtime must handle loading/empty/error: ${route}`);
    if (contract && !contract.evidenceSafe) failures.push(`Spatial runtime must be evidence-safe: ${route}`);
    if (contract && !URAI_CAMERA_PRESETS[contract.cameraPreset]) failures.push(`Missing camera preset for route: ${route}`);
  }

  if (!URAI_VISUAL_RUNTIME_LAYERS.includes("memory-star-particles")) {
    failures.push("Spatial runtime must include memory star particles.");
  }
  if (!URAI_VISUAL_RUNTIME_LAYERS.includes("constellation-chapter-lines")) {
    failures.push("Spatial runtime must include constellation chapter lines.");
  }
  if (!URAI_VISUAL_RUNTIME_LAYERS.includes("minimal-hidden-ui-safe-zones")) {
    failures.push("Spatial runtime must include minimal hidden UI safe zones.");
  }

  return failures;
}
