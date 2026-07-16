#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checks = [];

function read(relativePath) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) return "";
  return fs.readFileSync(absolute, "utf8");
}

function assertCheck(name, passed, detail) {
  checks.push({ name, passed, detail });
}

const canvas = read("src/components/urai/home/HomeWorldCanvas.tsx");
const layer = read("src/components/urai/home/HomeXRInteractionLayer.tsx");
const targets = read("src/components/urai/home/HomeXRTargets.ts");
const xrFoundation = read("src/components/xr/XRSessionFoundation.tsx");
const e2e = read("tests/e2e/home-xr-interaction.spec.ts");
const authoritySource = read("system/canonical-authority.json");
let authority = null;

try {
  authority = authoritySource ? JSON.parse(authoritySource) : null;
} catch {
  authority = null;
}

assertCheck(
  "Home keeps existing cinematic world",
  canvas.includes("<CinematicWorld />") && canvas.includes("<HomeXRInteractionLayer />"),
  "HomeWorldCanvas must preserve CinematicWorld and mount HomeXRInteractionLayer.",
);

assertCheck(
  "native WebXR controllers are registered",
  layer.includes("renderer.xr.getController(0)") && layer.includes("renderer.xr.getController(1)"),
  "HomeXRInteractionLayer must register left and right native WebXR controllers.",
);

assertCheck(
  "controller rays are visible",
  layer.includes("home-xr-controller-ray") && layer.includes("LineBasicMaterial"),
  "HomeXRInteractionLayer must add visible controller laser or ray geometry.",
);

assertCheck(
  "trigger and grip events are wired",
  layer.includes("selectstart") && layer.includes("squeezestart"),
  "HomeXRInteractionLayer must wire selectstart and squeezestart controller events.",
);

assertCheck(
  "controller raycasting exists",
  layer.includes("Raycaster") && layer.includes("intersectObjects") && layer.includes("matrixWorld"),
  "HomeXRInteractionLayer must raycast controller rays against in-world targets.",
);

assertCheck(
  "controller unavailable fallback exists",
  layer.includes("no XR controllers are connected") && layer.includes("Desktop and touch interaction remain available"),
  "HomeXRInteractionLayer must show a visible fallback when a VR session has no connected controllers.",
);

assertCheck(
  "in-world instructions exist",
  layer.includes("Point + trigger to select. Grip/back to close."),
  "HomeXRInteractionLayer must include the required in-world instruction panel.",
);

for (const requiredTarget of ["Life Map", "Ground", "Sky", "Horizon", "Replay", "Orb Chat", "Mirror", "XR Preview"]) {
  assertCheck(
    `target registry contains ${requiredTarget}`,
    targets.includes(`label: "${requiredTarget}"`),
    `HomeXRTargets must include ${requiredTarget}.`,
  );
}

assertCheck(
  "truthful WebXR gate remains",
  xrFoundation.includes("Headset entry appears only when the browser proves support") &&
    xrFoundation.includes("immersive-vr support") &&
    xrFoundation.includes("Enter VR is hidden"),
  "XRSessionFoundation must keep truthful WebXR capability gating and unsupported fallback copy.",
);

assertCheck(
  "legacy Home XR browser assertions are archived",
  e2e.includes('test.describe.skip("archived home XR assertions"') &&
    e2e.includes("outside current release smoke"),
  "The legacy Home XR Playwright file must remain explicitly skipped and non-certifying.",
);

assertCheck(
  "canonical browser-proof authority belongs to Spatial",
  authority?.canonicalProductRepo === "LifeLoggerAI/urai-spatial" &&
    authority?.applicationRoot === "urai-tier1" &&
    authority?.branch === "main" &&
    authority?.domain === "urai.app" &&
    Array.isArray(authority?.legacyRepos) &&
    authority.legacyRepos.includes("LifeLoggerAI/UrAi"),
  "system/canonical-authority.json must assign production and browser-proof authority to urai-spatial and classify UrAi as legacy.",
);

const failed = checks.filter((check) => !check.passed);
for (const check of checks) {
  const icon = check.passed ? "PASS" : "FAIL";
  console.log(`[${icon}] ${check.name}`);
  if (!check.passed) console.log(`       ${check.detail}`);
}

if (failed.length) {
  console.error(`\nHome XR static lock failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log("\nHome XR legacy source lock passed; browser certification remains canonical-only.");
