#!/usr/bin/env node

import { existsSync } from "node:fs";
import { join } from "node:path";

const requiredAssets = [
  "public/assets/genesis/sky/sky-background.png",
  "public/assets/genesis/sky/cloud-far.png",
  "public/assets/genesis/sky/cloud-mid.png",
  "public/assets/genesis/sky/cloud-near.png",
  "public/assets/genesis/overlays/mood-atmosphere.png",
  "public/assets/genesis/overlays/starfield.png",
  "public/assets/genesis/overlays/aurora.png",
  "public/assets/genesis/body/body-silhouette-base.png",
  "public/assets/genesis/body/body-silhouette-glow.png",
  "public/assets/genesis/body/aura-field.png",
  "public/assets/genesis/orb/orb-core.png",
  "public/assets/genesis/orb/orb-glow.png",
  "public/assets/genesis/orb/orb-particles.png",
  "public/assets/genesis/ground/ground-base.png",
  "public/assets/genesis/ground/ground-bloom.png",
  "public/assets/genesis/ground/ground-mist.png",
  "public/assets/genesis/overlays/foreground-vignette.png",
  "public/assets/genesis/transitions/transition-bloom.png",
  "public/assets/genesis/portals/galaxy-portal.png",
  "public/assets/genesis/portals/mirror-portal.png",
  "public/assets/genesis/portals/shadow-portal.png",
  "public/assets/genesis/portals/legacy-portal.png",
  "public/assets/genesis/portals/passport-portal.png",
];

const root = process.cwd();
const missing = requiredAssets.filter((asset) => !existsSync(join(root, asset)));

if (missing.length) {
  console.warn("Genesis asset drop-in is incomplete. Missing files:");
  for (const asset of missing) console.warn(`- ${asset}`);
  console.warn("The app will hide missing layers safely, but final visual QA cannot pass until these assets are present.");
  process.exitCode = 0;
} else {
  console.log("Genesis asset drop-in complete. All expected assets are present.");
}
