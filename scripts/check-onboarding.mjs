#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const filmPath = path.join(root, "src/data/genesisOnboardingFilm.ts");
const assetPath = path.join(root, "src/data/genesisOnboardingAssets.ts");
const manifestPath = path.join(root, "public/genesis/onboarding/manifest.json");

const requiredSceneIds = [
  "scattered-life",
  "urai-appears",
  "you-live",
  "life-map-sky",
  "orb-speaks",
  "focus-image",
  "replay-begins",
  "ground-council",
  "private-nudges",
  "life-films",
  "memory-music-videos",
  "symbolic-people",
  "ar-vr-xr",
  "passport-ownership",
  "global-emotional-map",
  "accessibility-legacy",
  "final-home-return",
];

const requiredTrustPhrases = [
  "You live. URAI remembers. You choose what becomes real.",
  "Symbolic. Consent-based. Not a replacement for real people.",
  "Private by default",
  "User-owned data",
  "Consent receipts",
  "Export anytime",
  "Delete anytime",
  "Share by permission",
  "License by consent",
  "no private data used",
  "onboarding_seed",
  "genesis_symbolic_replay",
];

const disallowedPhrases = [
  "fully reconstructs reality",
  "recreates real people",
  "knows everything automatically",
  "autonomous agents act without permission",
  "passive sensing creates exact life movies for everyone",
  "guaranteed diagnosis",
  "medical treatment",
  "legal advice",
];

let failed = false;

function fail(message) {
  failed = true;
  console.error(`onboarding-check: ${message}`);
}

function readRequired(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(root, filePath)}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

const filmSource = readRequired(filmPath);
const assetSource = readRequired(assetPath);
const manifestSource = readRequired(manifestPath);

let manifest = { assets: [] };
try {
  manifest = JSON.parse(manifestSource);
} catch (error) {
  fail(`Manifest is not valid JSON: ${error.message}`);
}

for (const sceneId of requiredSceneIds) {
  if (!filmSource.includes(`id: "${sceneId}"`)) {
    fail(`Missing scene in film model: ${sceneId}`);
  }

  if (!assetSource.includes(`sceneId: "${sceneId}"`)) {
    fail(`Missing scene in TypeScript asset manifest: ${sceneId}`);
  }

  if (!manifest.assets?.some((asset) => asset.sceneId === sceneId)) {
    fail(`Missing scene in public asset manifest: ${sceneId}`);
  }
}

const voiceoverCount = (filmSource.match(/\bvoiceover:/g) ?? []).length;
if (voiceoverCount < requiredSceneIds.length) {
  fail(`Expected at least ${requiredSceneIds.length} voiceover entries, found ${voiceoverCount}`);
}

for (const phrase of requiredTrustPhrases) {
  if (!filmSource.includes(phrase) && !assetSource.includes(phrase) && !manifestSource.includes(phrase)) {
    fail(`Missing required trust phrase: ${phrase}`);
  }
}

for (const phrase of disallowedPhrases) {
  const pattern = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  if (pattern.test(filmSource) || pattern.test(assetSource) || pattern.test(manifestSource)) {
    fail(`Disallowed unsupported claim appears: ${phrase}`);
  }
}

for (const asset of manifest.assets ?? []) {
  if (!asset.altText || !asset.fallbackImagePath || !asset.safeClaimTag || !asset.productLayerTag) {
    fail(`Manifest asset is missing required fields: ${asset.sceneId}`);
    continue;
  }

  if (!["placeholder", "generated", "final"].includes(asset.assetStatus)) {
    fail(`Manifest asset has invalid status: ${asset.sceneId}`);
  }

  const relativeFallback = asset.fallbackImagePath.replace(/^\//, "");
  const absoluteFallback = path.join(root, "public", relativeFallback);
  if (!fs.existsSync(absoluteFallback)) {
    fail(`Fallback asset missing for ${asset.sceneId}: ${asset.fallbackImagePath}`);
  }
}

if (!filmSource.includes("Home experience stalled") && !filmSource.includes("Life map is out of orbit")) {
  // Good: the onboarding film must not depend on fallback failure copy.
} else {
  fail("Onboarding film contains runtime fallback failure copy.");
}

if (failed) {
  process.exit(1);
}

console.log("onboarding-check: Genesis onboarding film manifest passed.");
