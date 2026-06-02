export type UraiAssetKey =
  | "skyBackground"
  | "skyCloudFar"
  | "skyCloudMid"
  | "skyCloudNear"
  | "moodAtmosphereOverlay"
  | "starfieldOverlay"
  | "auroraOverlay"
  | "bodySilhouetteBase"
  | "bodySilhouetteGlow"
  | "auraField"
  | "orbCore"
  | "orbGlow"
  | "orbParticles"
  | "groundBase"
  | "groundBloom"
  | "groundMist"
  | "foregroundVignette"
  | "transitionBloom"
  | "galaxyPortal"
  | "mirrorPortal"
  | "shadowPortal"
  | "legacyPortal"
  | "passportPortal";

export const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export const URAI_ASSETS: Record<UraiAssetKey, string> = {
  skyBackground: "/assets/genesis/sky/sky-background.png",
  skyCloudFar: "/assets/genesis/sky/cloud-far.png",
  skyCloudMid: "/assets/genesis/sky/cloud-mid.png",
  skyCloudNear: "/assets/genesis/sky/cloud-near.png",
  moodAtmosphereOverlay: "/assets/genesis/overlays/mood-atmosphere.png",
  starfieldOverlay: "/assets/genesis/overlays/starfield.png",
  auroraOverlay: "/assets/genesis/overlays/aurora.png",
  bodySilhouetteBase: "/assets/genesis/body/body-silhouette-base.png",
  bodySilhouetteGlow: "/assets/genesis/body/body-silhouette-glow.png",
  auraField: "/assets/genesis/body/aura-field.png",
  orbCore: "/assets/genesis/orb/orb-core.png",
  orbGlow: "/assets/genesis/orb/orb-glow.png",
  orbParticles: "/assets/genesis/orb/orb-particles.png",
  groundBase: "/assets/genesis/ground/ground-base.png",
  groundBloom: "/assets/genesis/ground/ground-bloom.png",
  groundMist: "/assets/genesis/ground/ground-mist.png",
  foregroundVignette: "/assets/genesis/overlays/foreground-vignette.png",
  transitionBloom: "/assets/genesis/transitions/transition-bloom.png",
  galaxyPortal: "/assets/genesis/portals/galaxy-portal.png",
  mirrorPortal: "/assets/genesis/portals/mirror-portal.png",
  shadowPortal: "/assets/genesis/portals/shadow-portal.png",
  legacyPortal: "/assets/genesis/portals/legacy-portal.png",
  passportPortal: "/assets/genesis/portals/passport-portal.png",
};

export function getAssetPath(key: UraiAssetKey): string {
  return URAI_ASSETS[key] || TRANSPARENT_PIXEL;
}
