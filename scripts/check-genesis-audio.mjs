#!/usr/bin/env node

import { existsSync } from "node:fs";
import { join } from "node:path";

const requiredAudio = [
  "public/assets/audio/genesis/ambient/sky-calm-loop.mp3",
  "public/assets/audio/genesis/ambient/sky-night-loop.mp3",
  "public/assets/audio/genesis/ambient/ground-soft-loop.mp3",
  "public/assets/audio/genesis/orb/orb-hum-loop.mp3",
  "public/assets/audio/genesis/orb/orb-wake.mp3",
  "public/assets/audio/genesis/orb/orb-tap.mp3",
  "public/assets/audio/genesis/portals/galaxy-open.mp3",
  "public/assets/audio/genesis/portals/mirror-open.mp3",
  "public/assets/audio/genesis/portals/shadow-open.mp3",
  "public/assets/audio/genesis/portals/legacy-open.mp3",
  "public/assets/audio/genesis/portals/passport-open.mp3",
  "public/assets/audio/genesis/transitions/soft-bloom.mp3",
  "public/assets/audio/genesis/transitions/life-map-swell.mp3",
  "public/assets/audio/genesis/ui/soft-tap.mp3",
  "public/assets/audio/genesis/ui/panel-open.mp3",
  "public/assets/audio/genesis/ui/panel-close.mp3",
  "public/assets/audio/genesis/ui/permission-toggle.mp3",
  "public/assets/audio/genesis/notifications/gentle-chime.mp3",
  "public/assets/audio/genesis/notifications/passport-pulse.mp3",
  "public/assets/audio/genesis/mood/calm-bed.mp3",
  "public/assets/audio/genesis/mood/heavy-bed.mp3",
  "public/assets/audio/genesis/mood/focused-bed.mp3",
  "public/assets/audio/genesis/mood/anxious-bed.mp3",
  "public/assets/audio/genesis/mood/hopeful-bed.mp3",
  "public/assets/audio/genesis/mood/recovering-bed.mp3",
  "public/assets/audio/genesis/mood/shadow-bed.mp3",
  "public/assets/audio/genesis/mood/threshold-bed.mp3",
  "public/assets/audio/genesis/mood/luminous-bed.mp3",
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
