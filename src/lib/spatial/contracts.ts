export type SpatialSceneStatus =
  | "draft"
  | "queued"
  | "materialized"
  | "published"
  | "failed"
  | "rolled_back";

export type SpatialRendererMode = "spatial-scene-v1";
export type SpatialLaunchMode = "public-demo" | "private-beta" | "production-live";

export type SpatialConsentProfile = {
  id: string;
  uid: string;
  tenantId: string;
  spatialCaptureAllowed: boolean;
  roomSemanticsAllowed: boolean;
  xrAnchorsAllowed: boolean;
  assetGenerationAllowed: boolean;
  updatedAt: string;
};

export type SpatialScene = {
  id: string;
  uid: string;
  tenantId: string;
  title: string;
  status: SpatialSceneStatus;
  rendererMode: SpatialRendererMode;
  assetFactoryJobId?: string;
  sceneUrl?: string;
  spatialManifestUrl?: string;
  worldUrl?: string;
  arUrl?: string;
  gltfUrl?: string;
  glbUrl?: string;
  usdzUrl?: string;
  consentProfileId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

export type SpatialReadinessCheck = {
  id: string;
  label: string;
  ok: boolean;
  requiredForLive: boolean;
  message: string;
};

export const SPATIAL_COLLECTIONS = [
  "users/{uid}/spatialScenes/{sceneId}",
  "users/{uid}/xrAnchors/{anchorId}",
  "users/{uid}/roomSemantics/{roomId}",
  "users/{uid}/dreamPlanetariumScenes/{sceneId}",
  "users/{uid}/spatialConsentZones/{zoneId}",
  "users/{uid}/spatialAssetLinks/{assetId}",
  "timelineEvents/{id}",
  "memoryBlooms/{id}",
  "moodForecasts/{id}",
  "companionMessages/{id}",
  "narratorInsights/{id}",
  "rituals/{id}",
  "relationshipSignals/{id}",
  "passiveSignals/{id}",
  "symbolicStates/{id}",
  "auditLogs/{eventId}",
  "assetLifecycleEvents/{eventId}",
] as const;

export const SPATIAL_STORAGE_PATHS = [
  "users/{uid}/spatial/scenes/{sceneId}/scene.json",
  "users/{uid}/spatial/scenes/{sceneId}/spatial.json",
  "users/{uid}/spatial/scenes/{sceneId}/world.json",
  "users/{uid}/spatial/scenes/{sceneId}/ar.json",
  "users/{uid}/spatial/scenes/{sceneId}/scene.gltf",
  "users/{uid}/spatial/scenes/{sceneId}/scene.glb",
  "users/{uid}/spatial/scenes/{sceneId}/scene.usdz",
  "users/{uid}/spatial/scenes/{sceneId}/preview.webp",
  "users/{uid}/spatial/scenes/{sceneId}/manifest.json",
] as const;

export const SPATIAL_V1_REQUIRED_SURFACES = [
  "ground-layer",
  "orb",
  "sky",
  "portal",
  "companion-chat",
  "memory-spatial-preview",
  "reduced-motion-fallback",
  "mobile-safe-layout",
  "privacy-first-boundaries",
] as const;

export const SPATIAL_DEFERRED_CAPABILITIES = [
  "live-xr-runtime",
  "room-capture",
  "live-sensitive-sensing",
  "wearable-provider",
  "asset-generation-export",
  "data-marketplace",
  "enterprise-admin",
  "clinical-care-claims",
] as const;

function firebaseAdminConfigured() {
  return Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
}

export const SPATIAL_DEFINITION_OF_DONE: SpatialReadinessCheck[] = [
  {
    id: "canonical-repo",
    label: "Canonical production repo",
    ok: true,
    requiredForLive: true,
    message: "URAI Spatial is integrated through LifeLoggerAI/UrAi for the main app launch surface.",
  },
  {
    id: "public-demo-boundary",
    label: "Public demo boundary",
    ok: process.env.NEXT_PUBLIC_SPATIAL_DEMO_DISABLED !== "true",
    requiredForLive: false,
    message: "The public demo shell can remain available with fallback copy and staged capabilities.",
  },
  {
    id: "firebase-admin-auth",
    label: "Firebase Admin auth",
    ok: firebaseAdminConfigured(),
    requiredForLive: true,
    message: "Firebase Admin credentials are required before private Spatial APIs can verify ID tokens in production.",
  },
  {
    id: "private-beta-flag",
    label: "Private Spatial flag",
    ok: process.env.NEXT_PUBLIC_SPATIAL_PRIVATE_BETA === "true",
    requiredForLive: true,
    message: "NEXT_PUBLIC_SPATIAL_PRIVATE_BETA must be true before authenticated Spatial surfaces open.",
  },
  {
    id: "xr-flag",
    label: "XR runtime flag",
    ok: process.env.NEXT_PUBLIC_SPATIAL_XR_ENABLED === "true",
    requiredForLive: false,
    message: "XR stays disabled until runtime, device QA, consent, and asset pipeline smoke are green.",
  },
  {
    id: "asset-factory-base",
    label: "Asset Factory API base",
    ok: Boolean(process.env.ASSET_FACTORY_BASE_URL),
    requiredForLive: true,
    message: "ASSET_FACTORY_BASE_URL must point to the verified API base for scene jobs.",
  },
  {
    id: "asset-factory-auth",
    label: "Asset Factory server auth",
    ok: Boolean(process.env.ASSET_FACTORY_API_KEY || process.env.ASSET_FACTORY_BEARER_TOKEN),
    requiredForLive: true,
    message: "Server-side Asset Factory credentials are required; browsers must not call protected mutation routes directly.",
  },
];

export function resolveSpatialLaunchMode(): SpatialLaunchMode {
  if (process.env.NEXT_PUBLIC_SPATIAL_PRODUCTION_LIVE === "true") return "production-live";
  if (process.env.NEXT_PUBLIC_SPATIAL_PRIVATE_BETA === "true") return "private-beta";
  return "public-demo";
}

export function resolveSpatialReadiness() {
  const mode = resolveSpatialLaunchMode();
  const blocking = SPATIAL_DEFINITION_OF_DONE.filter((check) => check.requiredForLive && !check.ok);
  const liveReady = blocking.length === 0 && mode === "production-live";

  return {
    mode,
    status: liveReady ? "production-live-ready" : mode === "private-beta" ? "private-beta-staged" : "public-demo-staged",
    liveReady,
    publicDemoReady: mode === "public-demo" || mode === "private-beta" || liveReady,
    privateBetaReady: mode === "private-beta" && firebaseAdminConfigured(),
    blocking,
    checks: SPATIAL_DEFINITION_OF_DONE,
    requiredV1Surfaces: SPATIAL_V1_REQUIRED_SURFACES,
    deferredCapabilities: SPATIAL_DEFERRED_CAPABILITIES,
  } as const;
}
