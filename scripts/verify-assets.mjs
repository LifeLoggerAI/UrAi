import fs from "node:fs";
import path from "node:path";

const criticalAssets = [
  "public/assets/sky/bloom/fallback-sky-bloom-12.webp",
  "public/assets/images/genesis-orb-placeholder.svg",
  "public/assets/ground/bloom/fallback-ground-bloom-12.png",
];

const optionalAssets = [
  "public/assets/genesis/portals/galaxy-portal.png",
  "public/assets/genesis/portals/mirror-portal.png",
  "public/assets/genesis/portals/shadow-portal.png",
  "public/assets/genesis/portals/legacy-portal.png",
  "public/assets/genesis/portals/passport-portal.png",
  "public/assets/audio/voice/genesis/orb/tap.wav",
  "public/assets/audio/genesis/orb/orb-wake.wav",
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
