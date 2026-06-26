#!/usr/bin/env node

import { existsSync } from "node:fs";
import { join } from "node:path";

const requiredAudio = [
  "public/assets/audio/genesis/ambient/sky-calm-loop.wav",
  "public/assets/audio/genesis/ambient/sky-night-loop.wav",
  "public/assets/audio/genesis/ambient/ground-soft-loop.wav",
  "public/assets/audio/genesis/orb/orb-hum-loop.wav",
  "public/assets/audio/genesis/orb/orb-wake.wav",
  "public/assets/audio/genesis/orb/orb-tap.wav",
  "public/assets/audio/genesis/portals/galaxy-open.wav",
  "public/assets/audio/genesis/portals/mirror-open.wav",
  "public/assets/audio/genesis/portals/shadow-open.wav",
  "public/assets/audio/genesis/portals/legacy-open.wav",
  "public/assets/audio/genesis/portals/passport-open.wav",
  "public/assets/audio/genesis/transitions/soft-bloom.wav",
  "public/assets/audio/genesis/transitions/life-map-swell.wav",
  "public/assets/audio/genesis/ui/soft-tap.wav",
  "public/assets/audio/genesis/ui/panel-open.wav",
  "public/assets/audio/genesis/ui/panel-close.wav",
  "public/assets/audio/genesis/ui/permission-toggle.wav",
  "public/assets/audio/genesis/notifications/gentle-chime.wav",
  "public/assets/audio/genesis/notifications/passport-pulse.wav",
  "public/assets/audio/genesis/mood/calm-bed.wav",
  "public/assets/audio/genesis/mood/heavy-bed.wav",
  "public/assets/audio/genesis/mood/focused-bed.wav",
  "public/assets/audio/genesis/mood/anxious-bed.wav",
  "public/assets/audio/genesis/mood/hopeful-bed.wav",
  "public/assets/audio/genesis/mood/recovering-bed.wav",
  "public/assets/audio/genesis/mood/shadow-bed.wav",
  "public/assets/audio/genesis/mood/threshold-bed.wav",
  "public/assets/audio/genesis/mood/luminous-bed.wav",
];

const root = process.cwd();
const missing = requiredAudio.filter((asset) => !existsSync(join(root, asset)));

if (missing.length) {
  console.warn("Genesis audio drop-in is incomplete. Missing files:");
  for (const asset of missing) console.warn(`- ${asset}`);
  console.warn("The audio engine will no-op safely when files are missing. Final sonic QA cannot pass until these files are present.");
  process.exitCode = 0;
} else {
  console.log("Genesis audio drop-in complete. All expected audio files are present.");
}
