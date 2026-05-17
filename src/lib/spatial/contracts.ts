export type SpatialSceneStatus =
  | "draft"
  | "queued"
  | "materialized"
  | "published"
  | "failed"
  | "rolled_back";

export type SpatialRendererMode = "spatial-scene-v1";

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

export const SPATIAL_DEFINITION_OF_DONE: SpatialReadinessCheck[] = [
  {
    id: "canonical-repo",
    label: "Canonical production repo",
    ok: true,
    requiredForLive: true,
    message: "URAI Spatial is being integrated through LifeLoggerAI/UrAi, not UrAi-Dev.",
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

export function resolveSpatialReadiness() {
  const blocking = SPATIAL_DEFINITION_OF_DONE.filter((check) => check.requiredForLive && !check.ok);

  return {
    status: blocking.length ? "staging-scaffolded" : "production-ready-candidate",
    blocking,
    checks: SPATIAL_DEFINITION_OF_DONE,
  } as const;
}
