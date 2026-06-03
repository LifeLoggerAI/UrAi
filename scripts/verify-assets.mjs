import fs from "node:fs";
import path from "node:path";

const criticalAssets = [
  "public/assets/genesis/sky/sky-background.png",
  "public/assets/genesis/body/body-silhouette-base.png",
  "public/assets/genesis/body/aura-field.png",
  "public/assets/genesis/orb/orb-core.png",
  "public/assets/genesis/orb/orb-glow.png",
  "public/assets/genesis/ground/ground-base.png",
  "public/assets/genesis/vignette/foreground-vignette.png",
];

const optionalAssets = [
  "public/assets/genesis/portals/galaxy-portal.png",
  "public/assets/genesis/portals/mirror-portal.png",
  "public/assets/genesis/portals/shadow-portal.png",
  "public/assets/genesis/portals/legacy-portal.png",
  "public/assets/genesis/portals/passport-portal.png",
  "public/assets/audio/voice/genesis/orb/tap.mp3",
  "public/assets/audio/genesis/orb/orb-wake.mp3",
];

const missingCritical = criticalAssets.filter((asset) => !fs.existsSync(path.resolve(asset)));
const missingOptional = optionalAssets.filter((asset) => !fs.existsSync(path.resolve(asset)));

if (missingCritical.length) {
  console.error("Missing critical production assets:");
  for (const asset of missingCritical) console.error(`- ${asset}`);
  process.exit(1);
}

if (missingOptional.length) {
  console.warn("Optional assets missing, scene should fail gracefully:");
  for (const asset of missingOptional) console.warn(`- ${asset}`);
}

console.log(`Verified ${criticalAssets.length} critical asset paths.`);
