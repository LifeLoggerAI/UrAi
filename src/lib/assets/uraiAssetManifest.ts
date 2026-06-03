export type UraiAssetLayerType =
  | "sky"
  | "overlay"
  | "body"
  | "orb"
  | "ground"
  | "transition"
  | "portal"
  | "vignette"
  | "ui";

export type UraiAssetFallback = "transparent" | "hidden" | "dark_sky";
export type UraiAssetRatio = "vertical" | "square" | "wide" | "free";
export type UraiAssetFormat = "png" | "webp" | "svg";

export type UraiAssetKey =
  | "skyBackground"
  | "skyDepthHaze"
  | "skyCloudFar"
  | "skyCloudMid"
  | "skyCloudNear"
  | "moodAtmosphereOverlay"
  | "starfieldOverlay"
  | "auroraOverlay"
  | "weatherSoftOverlay"
  | "emotionalFieldOverlay"
  | "bodySilhouetteBase"
  | "bodySilhouetteGlow"
  | "bodyShadowSoft"
  | "auraField"
  | "auraRing"
  | "orbCore"
  | "orbGlow"
  | "orbParticles"
  | "orbWakeFlare"
  | "orbShadow"
  | "groundBase"
  | "groundBloom"
  | "groundMist"
  | "rootGlow"
  | "groundForeground"
  | "transitionBloom"
  | "portalFlare"
  | "skyToGalaxyBloom"
  | "groundOpenBloom"
  | "galaxyPortal"
  | "mirrorPortal"
  | "shadowPortal"
  | "legacyPortal"
  | "passportPortal"
  | "settingsGlyph"
  | "foregroundVignette"
  | "edgeDarken"
  | "cinematicSoftFrame";

export type UraiAssetManifestEntry = {
  key: UraiAssetKey;
  path: string;
  layerType: UraiAssetLayerType;
  fallback: UraiAssetFallback;
  preferredFormat: UraiAssetFormat;
  expectedRatio: UraiAssetRatio;
  expectedDimensions: string;
  critical: boolean;
  lazy: boolean;
};

export const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export const URAI_ASSET_MANIFEST: Record<UraiAssetKey, UraiAssetManifestEntry> = {
  skyBackground: { key: "skyBackground", path: "/assets/genesis/sky/sky-background.png", layerType: "sky", fallback: "dark_sky", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: true, lazy: false },
  skyDepthHaze: { key: "skyDepthHaze", path: "/assets/genesis/sky/sky-depth-haze.png", layerType: "sky", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  skyCloudFar: { key: "skyCloudFar", path: "/assets/genesis/sky/cloud-far.png", layerType: "sky", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  skyCloudMid: { key: "skyCloudMid", path: "/assets/genesis/sky/cloud-mid.png", layerType: "sky", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  skyCloudNear: { key: "skyCloudNear", path: "/assets/genesis/sky/cloud-near.png", layerType: "sky", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  moodAtmosphereOverlay: { key: "moodAtmosphereOverlay", path: "/assets/genesis/overlays/mood-atmosphere.png", layerType: "overlay", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  starfieldOverlay: { key: "starfieldOverlay", path: "/assets/genesis/overlays/starfield.png", layerType: "overlay", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  auroraOverlay: { key: "auroraOverlay", path: "/assets/genesis/overlays/aurora.png", layerType: "overlay", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  weatherSoftOverlay: { key: "weatherSoftOverlay", path: "/assets/genesis/overlays/weather-soft.png", layerType: "overlay", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  emotionalFieldOverlay: { key: "emotionalFieldOverlay", path: "/assets/genesis/overlays/emotional-field.png", layerType: "overlay", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  bodySilhouetteBase: { key: "bodySilhouetteBase", path: "/assets/genesis/body/body-silhouette-base.png", layerType: "body", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: true, lazy: false },
  bodySilhouetteGlow: { key: "bodySilhouetteGlow", path: "/assets/genesis/body/body-silhouette-glow.png", layerType: "body", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: true, lazy: false },
  bodyShadowSoft: { key: "bodyShadowSoft", path: "/assets/genesis/body/body-shadow-soft.png", layerType: "body", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  auraField: { key: "auraField", path: "/assets/genesis/body/aura-field.png", layerType: "body", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: true, lazy: false },
  auraRing: { key: "auraRing", path: "/assets/genesis/body/aura-ring.png", layerType: "body", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  orbCore: { key: "orbCore", path: "/assets/genesis/orb/orb-core.png", layerType: "orb", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: true, lazy: false },
  orbGlow: { key: "orbGlow", path: "/assets/genesis/orb/orb-glow.png", layerType: "orb", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: true, lazy: false },
  orbParticles: { key: "orbParticles", path: "/assets/genesis/orb/orb-particles.png", layerType: "orb", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: false, lazy: true },
  orbWakeFlare: { key: "orbWakeFlare", path: "/assets/genesis/orb/orb-wake-flare.png", layerType: "orb", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: false, lazy: true },
  orbShadow: { key: "orbShadow", path: "/assets/genesis/orb/orb-shadow.png", layerType: "orb", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: false, lazy: true },
  groundBase: { key: "groundBase", path: "/assets/genesis/ground/ground-base.png", layerType: "ground", fallback: "transparent", preferredFormat: "png", expectedRatio: "wide", expectedDimensions: "1440x900", critical: true, lazy: false },
  groundBloom: { key: "groundBloom", path: "/assets/genesis/ground/ground-bloom.png", layerType: "ground", fallback: "transparent", preferredFormat: "png", expectedRatio: "wide", expectedDimensions: "1440x900", critical: false, lazy: true },
  groundMist: { key: "groundMist", path: "/assets/genesis/ground/ground-mist.png", layerType: "ground", fallback: "transparent", preferredFormat: "png", expectedRatio: "wide", expectedDimensions: "1440x900", critical: false, lazy: true },
  rootGlow: { key: "rootGlow", path: "/assets/genesis/ground/root-glow.png", layerType: "ground", fallback: "transparent", preferredFormat: "png", expectedRatio: "wide", expectedDimensions: "1440x900", critical: false, lazy: true },
  groundForeground: { key: "groundForeground", path: "/assets/genesis/ground/ground-foreground.png", layerType: "ground", fallback: "transparent", preferredFormat: "png", expectedRatio: "wide", expectedDimensions: "1440x900", critical: false, lazy: true },
  transitionBloom: { key: "transitionBloom", path: "/assets/genesis/transitions/transition-bloom.png", layerType: "transition", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  portalFlare: { key: "portalFlare", path: "/assets/genesis/transitions/portal-flare.png", layerType: "transition", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: false, lazy: true },
  skyToGalaxyBloom: { key: "skyToGalaxyBloom", path: "/assets/genesis/transitions/sky-to-galaxy-bloom.png", layerType: "transition", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  groundOpenBloom: { key: "groundOpenBloom", path: "/assets/genesis/transitions/ground-open-bloom.png", layerType: "transition", fallback: "transparent", preferredFormat: "png", expectedRatio: "wide", expectedDimensions: "1440x900", critical: false, lazy: true },
  galaxyPortal: { key: "galaxyPortal", path: "/assets/genesis/portals/galaxy-portal.png", layerType: "portal", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: false, lazy: true },
  mirrorPortal: { key: "mirrorPortal", path: "/assets/genesis/portals/mirror-portal.png", layerType: "portal", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: false, lazy: true },
  shadowPortal: { key: "shadowPortal", path: "/assets/genesis/portals/shadow-portal.png", layerType: "portal", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: false, lazy: true },
  legacyPortal: { key: "legacyPortal", path: "/assets/genesis/portals/legacy-portal.png", layerType: "portal", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: false, lazy: true },
  passportPortal: { key: "passportPortal", path: "/assets/genesis/portals/passport-portal.png", layerType: "portal", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "1024x1024", critical: false, lazy: true },
  settingsGlyph: { key: "settingsGlyph", path: "/assets/genesis/portals/settings-glyph.png", layerType: "ui", fallback: "transparent", preferredFormat: "png", expectedRatio: "square", expectedDimensions: "512x512", critical: false, lazy: true },
  foregroundVignette: { key: "foregroundVignette", path: "/assets/genesis/vignette/foreground-vignette.png", layerType: "vignette", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: true, lazy: false },
  edgeDarken: { key: "edgeDarken", path: "/assets/genesis/vignette/edge-darken.png", layerType: "vignette", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
  cinematicSoftFrame: { key: "cinematicSoftFrame", path: "/assets/genesis/vignette/cinematic-soft-frame.png", layerType: "vignette", fallback: "transparent", preferredFormat: "png", expectedRatio: "vertical", expectedDimensions: "1440x3120", critical: false, lazy: true },
};

export const URAI_ASSETS: Record<UraiAssetKey, string> = Object.fromEntries(
  Object.entries(URAI_ASSET_MANIFEST).map(([key, entry]) => [key, entry.path]),
) as Record<UraiAssetKey, string>;

export const CRITICAL_GENESIS_ASSET_KEYS = Object.values(URAI_ASSET_MANIFEST)
  .filter((entry) => entry.critical)
  .map((entry) => entry.key);

export function getAssetPath(key: UraiAssetKey): string {
  return URAI_ASSET_MANIFEST[key]?.path || TRANSPARENT_PIXEL;
}

export function getAssetManifestEntry(key: UraiAssetKey): UraiAssetManifestEntry {
  return URAI_ASSET_MANIFEST[key];
}
