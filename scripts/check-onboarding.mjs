#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const filmPath = path.join(root, "src/data/genesisOnboardingFilm.ts");
const assetPath = path.join(root, "src/data/genesisOnboardingAssets.ts");
const finalAssetPath = path.join(root, "src/data/genesisOnboardingFinalAssets.ts");
const manifestPath = path.join(root, "public/genesis/onboarding/manifest.json");
const finalManifestPath = path.join(root, "public/genesis/onboarding/final-manifest.json");
const masterVttPath = path.join(root, "public/genesis/onboarding/captions/genesis-onboarding.vtt");
const masterCaptionJsonPath = path.join(root, "public/genesis/onboarding/captions/genesis-onboarding-captions.json");
const lifeMapMockPath = path.join(root, "src/lib/spatial-life-map/lifeMap.mockData.ts");

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
const finalAssetSource = readRequired(finalAssetPath);
const manifestSource = readRequired(manifestPath);
const finalManifestSource = readRequired(finalManifestPath);
const masterVttSource = readRequired(masterVttPath);
const masterCaptionJsonSource = readRequired(masterCaptionJsonPath);
const lifeMapMockSource = readRequired(lifeMapMockPath);

let manifest = { assets: [] };
let finalManifest = { assets: [] };
try {
  manifest = JSON.parse(manifestSource);
} catch (error) {
  fail(`Manifest is not valid JSON: ${error.message}`);
}

try {
  finalManifest = JSON.parse(finalManifestSource);
} catch (error) {
  fail(`Final media manifest is not valid JSON: ${error.message}`);
}

for (const sceneId of requiredSceneIds) {
  if (!filmSource.includes(`id: "${sceneId}"`)) {
    fail(`Missing scene in film model: ${sceneId}`);
  }

  if (!assetSource.includes(`sceneId: "${sceneId}"`)) {
    fail(`Missing scene in TypeScript asset manifest: ${sceneId}`);
  }

  if (!finalAssetSource.includes(`sceneId: "${sceneId}"`) && !finalAssetSource.includes(`"sceneId": "${sceneId}"`)) {
    fail(`Missing scene in TypeScript final asset manifest: ${sceneId}`);
  }

  if (!manifest.assets?.some((asset) => asset.sceneId === sceneId)) {
    fail(`Missing scene in public asset manifest: ${sceneId}`);
  }

  if (!finalManifest.assets?.some((asset) => asset.sceneId === sceneId)) {
    fail(`Missing scene in public final media manifest: ${sceneId}`);
  }

  if (!masterVttSource.includes(sceneId) && !masterCaptionJsonSource.includes(sceneId)) {
    fail(`Missing scene caption coverage: ${sceneId}`);
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

for (const phrase of ["genesisOnboardingSeedMemory.id", "Memory Replay Created", "no private data used"]) {
  if (!lifeMapMockSource.includes(phrase)) {
    fail(`Life Map mock data is missing onboarding seed wiring phrase: ${phrase}`);
  }
}

for (const phrase of disallowedPhrases) {
  const pattern = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  if (pattern.test(filmSource) || pattern.test(assetSource) || pattern.test(manifestSource)) {
    fail(`Disallowed unsupported claim appears: ${phrase}`);
  }
}

const allowedAssetStatuses = ["placeholder", "generated", "final", "fallback", "needs_external_render"];

for (const asset of manifest.assets ?? []) {
  if (!asset.altText || !asset.fallbackImagePath || !asset.safeClaimTag || !asset.productLayerTag) {
    fail(`Manifest asset is missing required fields: ${asset.sceneId}`);
    continue;
  }

  if (!allowedAssetStatuses.includes(asset.assetStatus)) {
    fail(`Manifest asset has invalid status: ${asset.sceneId}`);
  }

  const relativeFallback = asset.fallbackImagePath.replace(/^\//, "");
  const absoluteFallback = path.join(root, "public", relativeFallback);
  if (!fs.existsSync(absoluteFallback)) {
    fail(`Fallback asset missing for ${asset.sceneId}: ${asset.fallbackImagePath}`);
  }
}

for (const asset of finalManifest.assets ?? []) {
  const status = asset.asset_status ?? asset.assetStatus;
  if (!allowedAssetStatuses.includes(status)) {
    fail(`Final media asset has invalid status: ${asset.sceneId}`);
  }

  if (!asset.posterFramePath || !asset.finalAssetPath || !asset.videoPromptPath || !asset.audioSpecPath || !asset.captionPath || !asset.fallbackAsset) {
    fail(`Final media asset is missing required production paths: ${asset.sceneId}`);
    continue;
  }

  for (const field of ["posterFramePath", "finalAssetPath", "videoPromptPath", "audioSpecPath", "captionPath", "fallbackAsset"]) {
    const relativePath = asset[field].replace(/^\//, "");
    const absolutePath = path.join(root, "public", relativePath);
    if (!fs.existsSync(absolutePath)) {
      fail(`Final media path missing for ${asset.sceneId}: ${asset[field]}`);
    }
  }

  if (!asset.captionText || !asset.captionText.trim()) {
    fail(`Final media asset is missing caption text: ${asset.sceneId}`);
  }

  if (!Array.isArray(asset.uiOverlayText) || asset.uiOverlayText.length === 0) {
    fail(`Final media asset is missing UI overlay text: ${asset.sceneId}`);
  }

  if (status === "final" && (!asset.videoPath || !asset.audioPath)) {
    fail(`Final media asset is marked final without video/audio proof: ${asset.sceneId}`);
  }

  if (!asset.safe_claim_tag && !asset.safeClaimTag) {
    fail(`Final media asset is missing safe claim tag: ${asset.sceneId}`);
  }
}

if (finalManifest.actualVideoFilesGenerated !== false || finalManifest.actualAudioFilesGenerated !== false) {
  fail("Final media manifest must not claim generated video/audio unless proof files are wired.");
}

if (!finalManifestSource.includes("needs_external_render")) {
  fail("Final media manifest must mark unrendered video/audio as needs_external_render.");
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
