#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifestPath = "launch-proof/home-quest-interaction/home-xr-proof-manifest.json";
const manifestAbsolutePath = path.join(root, manifestPath);

function fail(message) {
  console.error(`home-xr-proof-manifest: ${message}`);
  process.exitCode = 1;
}

function readJson(relativePath) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    fail(`missing ${relativePath}`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
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

if (manifest.id !== "home-quest-xr-proof-manifest") fail("unexpected manifest id");
if (manifest.route !== "/home") fail("route must be /home");
if (manifest.status !== "HOME QUEST/XR PROOF-WIRED") fail("status must remain HOME QUEST/XR PROOF-WIRED until CI and Quest proof are complete");
if (!String(manifest.claim_boundary ?? "").includes("Progressive WebXR enhancement only")) {
  fail("claim boundary must preserve progressive enhancement wording");
}

assertArrayIncludes(manifest, "implementation_files", [
  "src/components/urai/home/HomeWorldCanvas.tsx",
  "src/components/urai/home/HomeXRInteractionLayer.tsx",
  "src/components/urai/home/HomeXRTargets.ts",
  "src/components/xr/XRSessionFoundation.tsx",
]);

assertArrayIncludes(manifest, "test_files", [
  "tests/unit/home-xr-interaction-layer.test.ts",
  "tests/e2e/home-xr-interaction.spec.ts",
  "scripts/check-home-xr-lock.mjs",
  "scripts/check-production-claims.mjs",
]);

assertArrayIncludes(manifest, "proof_files", [
  "launch-proof/home-quest-interaction/2026-06-28-home-xr-interaction-pass.md",
  "launch-proof/home-quest-interaction/QUEST_MANUAL_VALIDATION_CHECKLIST.md",
  "launch-proof/home-quest-interaction/VALIDATION_RUNBOOK.md",
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
  "node scripts/check-home-xr-lock.mjs",
  "npm run smoke:genesis-spine",
  "npx playwright test tests/e2e/home-xr-interaction.spec.ts --project=chromium --project=mobile-chrome",
]);

assertArrayIncludes(manifest, "required_ci_jobs", [
  "V1 app unit/build gate",
  "Home and Life Map XR Playwright smoke",
]);

assertArrayIncludes(manifest, "required_artifacts", [
  "xr-playwright-output",
  "home-xr-proof/home-desktop.png",
  "home-xr-proof/home-mobile.png",
  "home-xr-proof/home-xr-affordance-mocked.png",
]);

assertArrayIncludes(manifest, "allowed_final_statuses", [
  "HOME QUEST/XR IMPLEMENTED",
  "HOME QUEST/XR PROOF-WIRED",
  "HOME QUEST/XR CI-GREEN",
  "HOME QUEST/XR VERIFIED",
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
console.log("home-xr-proof-manifest: manifest references and proof requirements passed");
