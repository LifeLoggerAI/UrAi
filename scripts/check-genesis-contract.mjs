#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "src/lib/urai/types.ts",
  "src/lib/urai/consent.ts",
  "src/lib/urai/narrator.ts",
  "src/lib/urai/memory-stars.ts",
  "src/lib/urai/genesis.ts",
  "src/lib/urai/firestore-paths.ts",
  "src/lib/urai/storage.ts",
  "src/lib/urai/signal-pipeline.ts",
  "src/lib/urai/sound.ts",
  "src/app/home-view.tsx",
  "docs/URAI_GENESIS_GAP_MAP.md",
];

const requiredSnippets = {
  "src/lib/urai/types.ts": [
    "export type UraiConsentCategory",
    "export type UraiPassportState",
    "export type UraiPassiveSignal",
    "export type UraiNarratorReflection",
    "export type UraiMemoryStar",
    "export type UraiGenesisHomeState",
  ],
  "src/lib/urai/consent.ts": [
    "URAI_CONSENT_CATEGORIES",
    "createDefaultConsentState",
    "createDefaultPassportState",
    "setAllConsentCategories",
    "hasGenesisRequiredConsent",
  ],
  "src/lib/urai/firestore-paths.ts": [
    "uraiGenesis",
    "userConsentPath",
    "userPassportPath",
    "userSignalsCollectionPath",
    "userMemoryStarsCollectionPath",
  ],
  "src/lib/urai/storage.ts": [
    "isFirebaseConfigured",
    "localStorage",
    "saveGenesisHomeSnapshot",
    "savePassiveSignal",
    "saveMemoryStar",
  ],
  "src/lib/urai/signal-pipeline.ts": [
    "createPassiveSignal",
    "runGenesisSignalPipeline",
    "createGenesisReflectionFromSignal",
    "createMemoryStarFromReflection",
  ],
  "src/lib/urai/sound.ts": [
    "UraiSoundCue",
    "playUraiSound",
    "preloadUraiSounds",
    "home-ambient.mp3",
  ],
  "src/app/home-view.tsx": [
    "createDefaultGenesisHomeState",
    "runGenesisSignalPipeline",
    "saveGenesisHomeSnapshot",
    "playUraiSound",
    "Bloom Moment",
    "Passport",
    "Permissions",
  ],
  "docs/URAI_GENESIS_GAP_MAP.md": [
    "Working Genesis loop",
    "Launch blockers",
    "uraiGenesis/{userId}",
  ],
};

let failed = false;

function fail(message) {
  failed = true;
  console.error(`Genesis contract check failed: ${message}`);
}

for (const file of requiredFiles) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    fail(`Missing required file: ${file}`);
    continue;
  }

  const contents = fs.readFileSync(absolute, "utf8");
  const snippets = requiredSnippets[file] ?? [];
  for (const snippet of snippets) {
    if (!contents.includes(snippet)) {
      fail(`Missing required snippet in ${file}: ${snippet}`);
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log("URAI Genesis contract check passed.");
