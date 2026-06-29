#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = "launch-proof/life-map-quest-interaction/life-map-quest-proof-manifest.json";
const manifestAbsolutePath = path.join(root, manifestPath);

function fail(message) {
  console.error(`life-map-quest-proof-manifest: ${message}`);
  process.exitCode = 1;
}

function readJson(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`missing ${relativePath}`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  } catch (error) {
    fail(`invalid JSON in ${relativePath}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function assertArrayIncludes(manifest, field, requiredValues) {
  const actual = manifest[field];
  if (!Array.isArray(actual)) {
    fail(`${field} must be an array`);
    return;
  }

  for (const value of requiredValues) {
    if (!actual.includes(value)) fail(`${field} missing ${value}`);
  }
}

const manifest = readJson(manifestPath);
if (!manifest) process.exit(1);

if (manifest.id !== "life-map-quest-proof-manifest") fail("unexpected manifest id");
if (manifest.route !== "/life-map") fail("route must be /life-map");
if (manifest.status !== "LIFE MAP QUEST INTERACTION PROOF-WIRED") fail("status must remain proof-wired until CI and Quest proof are complete");
if (!String(manifest.claim_boundary ?? "").includes("Progressive WebXR enhancement only")) {
  fail("claim boundary must preserve progressive enhancement wording");
}

assertArrayIncludes(manifest, "implementation_files", [
  "src/components/spatial-life-map/SpatialLifeMap.tsx",
  "src/components/spatial-life-map/LifeGalaxyScene.tsx",
  "src/components/spatial-life-map/LifeMapQuestInteraction.tsx",
  "src/components/spatial-life-map/LifeStar.tsx",
]);

assertArrayIncludes(manifest, "test_files", [
  "src/components/spatial-life-map/__tests__/LifeMapQuestInteraction.test.ts",
  "tests/e2e/life-map-quest-interaction.spec.ts",
  "scripts/check-life-map-quest-interaction.mjs",
  "scripts/check-life-map-quest-proof-manifest.mjs",
  "scripts/check-life-map-quest-live-deploy-proof.mjs",
  "scripts/smoke-life-map-quest-live-url.mjs",
]);

assertArrayIncludes(manifest, "proof_files", [
  "launch-proof/life-map-quest-interaction/2026-06-28-quest-interaction-lock.md",
  "launch-proof/life-map-quest-interaction/2026-06-28-static-verifier-addendum.md",
  "launch-proof/life-map-quest-interaction/2026-06-28-live-route-reachability-addendum.md",
  "launch-proof/life-map-quest-interaction/LIFE_MAP_QUEST_LIVE_DEPLOY_VERIFICATION.md",
  manifestPath,
]);

const fileFields = ["implementation_files", "test_files", "proof_files"];
for (const field of fileFields) {
  for (const relativePath of manifest[field] ?? []) {
    if (!fs.existsSync(path.join(root, relativePath))) fail(`${field} references missing file ${relativePath}`);
  }
}

assertArrayIncludes(manifest, "required_local_commands", [
  "npm run check:types",
  "npm run lint",
  "npm test",
  "npm run build",
  "npm run verify:routes",
  "npm run verify:assets",
  "npm run check:public-copy",
  "npm run check:production-claims",
  "npm run smoke:life-map-quest",
  "npm run smoke:life-map-quest-proof",
  "npm run smoke:life-map-quest-live-proof",
  "npm run smoke:genesis-spine",
  "npx playwright test tests/e2e/life-map-quest-interaction.spec.ts --project=chromium --project=mobile-chrome",
]);

assertArrayIncludes(manifest, "optional_live_commands", [
  "LIFE_MAP_QUEST_LIVE_URL=<production-url> npm run smoke:life-map-quest-live",
  "URAI_LIVE_URL=<production-url> npm run smoke:life-map-quest-live",
]);

assertArrayIncludes(manifest, "required_ci_jobs", [
  "V1 app unit/build gate",
  "Home and Life Map XR Playwright smoke",
]);

assertArrayIncludes(manifest, "required_artifacts", [
  "xr-playwright-output",
  "life-map-xr-proof/life-map-desktop.png",
  "life-map-xr-proof/life-map-mobile.png",
]);

assertArrayIncludes(manifest, "required_manual_quest_checks", [
  "Open /life-map in Meta Quest Browser",
  "Confirm unsupported browsers do not show a fake VR entry",
  "Enter VR only through real immersive-vr support",
  "Confirm left and right controller rays are visible",
  "Confirm trigger selects a focused Life Map star",
  "Confirm grip/back closes or clears the selected panel",
  "Confirm VR menu trigger navigation works",
  "Confirm desktop and mobile controls still work after exiting VR",
]);

assertArrayIncludes(manifest, "allowed_final_statuses", [
  "LIFE MAP QUEST INTERACTION IMPLEMENTED",
  "LIFE MAP QUEST INTERACTION PROOF-WIRED",
  "LIFE MAP QUEST INTERACTION CI-GREEN",
  "LIFE MAP QUEST ROUTE-REACHABLE",
  "LIFE MAP QUEST LIVE-SMOKE-PASSED",
  "LIFE MAP QUEST LIVE-QUEST-VERIFIED",
]);

assertArrayIncludes(manifest, "blocked_claims_until_verified", [
  "DONE DONE",
  "Quest ready",
  "VR ready",
  "production XR",
  "full Quest support",
]);

if (!fs.existsSync(manifestAbsolutePath)) fail("manifest disappeared during verification");

if (process.exitCode) process.exit(process.exitCode);
console.log("life-map-quest-proof-manifest: manifest references and proof requirements passed");
