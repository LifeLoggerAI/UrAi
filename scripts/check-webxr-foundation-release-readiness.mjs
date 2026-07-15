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

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function check(name, passed, detail) {
  checks.push({ name, passed, detail });
}

const packageJson = read("package.json");
const xrFoundation = read("src/components/xr/XRSessionFoundation.tsx");
const xrRoute = read("src/app/xr/page.tsx");
const homeRoute = read("src/components/urai/home/NewHomeScene.tsx");
const rootRoute = read("src/app/page.tsx");
const e2e = read("tests/e2e/home-xr-interaction.spec.ts");
const unit = read("src/components/xr/__tests__/XRSessionFoundation.test.tsx");
const deployWorkflow = read(".github/workflows/deploy-home-xr.yml");
const liveProof = read("launch-proof/home-quest-interaction/HOME_XR_LIVE_DEPLOY_VERIFICATION.md");
const releaseEvidence = read("docs/release-evidence/2026-06-28-webxr-foundation-status.md");

check(
  "existing R3F and Three dependencies are present",
  packageJson.includes('"@react-three/fiber"') && packageJson.includes('"three"') && !packageJson.includes('"@react-three/xr"'),
  "Use native Three/WebXR foundation unless @react-three/xr compatibility is intentionally audited and locked.",
);

check(
  "XR foundation module exists",
  exists("src/components/xr/XRSessionFoundation.tsx"),
  "src/components/xr/XRSessionFoundation.tsx must exist.",
);

check(
  "XR foundation detects WebGL and browser WebXR API",
  xrFoundation.includes("hasWebGLSupport") && xrFoundation.includes("navigator as NavigatorWithXR") && xrFoundation.includes("xrApiAvailable"),
  "XR foundation must check WebGL and navigator.xr before exposing headset entry.",
);

check(
  "immersive-vr and immersive-ar support checks exist",
  xrFoundation.includes('isSessionSupported(nav.xr, "immersive-vr")') && xrFoundation.includes('isSessionSupported(nav.xr, "immersive-ar")'),
  "XR foundation must check immersive-vr and immersive-ar capabilities.",
);

check(
  "real WebXR session request is gated",
  xrFoundation.includes('xr.requestSession("immersive-vr"') && xrFoundation.includes("renderer.xr.setSession") && xrFoundation.includes('capabilities.immersiveVr !== "supported"'),
  "Enter VR must request a real browser WebXR session only after capability support is detected.",
);

check(
  "fake VR button is blocked when unsupported",
  xrFoundation.includes("Enter VR is hidden because this browser/device does not currently report immersive-vr support") && xrFoundation.includes('data-testid="xr-vr-fallback"'),
  "Unsupported browsers must see truthful fallback copy instead of a fake headset button.",
);

check(
  "/xr route is wired to real preview and capability panel",
  xrRoute.includes("XRReadyCanvas") && xrRoute.includes("XRSessionButton") && xrRoute.includes("XRStatusPanel") && xrRoute.includes("HomeWorldCanvas"),
  "/xr must show the Home 3D preview, capability panel, and support-gated VR entry.",
);

check(
  "/home route keeps Home scene and adds safe XR affordance",
  homeRoute.includes("HomeXREntryCard") && homeRoute.includes("HomeWorldCanvas") && homeRoute.includes('href="/xr"'),
  "/home must preserve Home 3D and add only a safe XR route/affordance.",
);

check(
  "/ route does not claim full XR",
  rootRoute.includes("Check XR gate") && rootRoute.includes("headset entry") && rootRoute.includes("remain gated"),
  "/ must link to the XR gate while keeping headset claims gated.",
);

check(
  "unit tests cover no fake Enter VR behavior",
  unit.includes("does not render a fake Enter VR button") && unit.includes("immersive-vr is unsupported") && unit.includes("renders Enter VR only when immersive-vr"),
  "Unit tests must cover unsupported and supported WebXR affordance behavior.",
);

check(
  "Playwright smoke covers desktop, mobile, and mocked support",
  e2e.includes("/home desktop loads") && e2e.includes("/home mobile loads") && e2e.includes("mocked supported") && e2e.includes("toHaveCount(0)"),
  "E2E smoke must cover desktop, mobile, no fake button, and mocked supported affordance.",
);

check(
  "legacy Home XR deploy workflow is quarantined",
  deployWorkflow.includes("workflow_dispatch:") &&
    /quarantined|disabled|deny/i.test(deployWorkflow) &&
    deployWorkflow.includes("exit 1") &&
    deployWorkflow.includes("LifeLoggerAI/urai-spatial") &&
    deployWorkflow.includes("urai-tier1") &&
    deployWorkflow.includes("urai.app"),
  "Legacy Home XR workflow must remain manual, fail closed, and name the canonical Spatial authority.",
);

check(
  "legacy Home XR workflow cannot authenticate or deploy",
  !/secrets\.|FIREBASE_TOKEN|SERVICE_ACCOUNT|google-github-actions\/auth|firebase(?:-tools)?\s+deploy|gcloud\s+(?:run|app)\s+deploy/i.test(deployWorkflow),
  "Legacy Home XR workflow must be credential-free and contain no cloud deployment command.",
);

check(
  "live proof doc blocks live claims until evidence exists",
  liveProof.includes("Configuration is not deployment proof") && liveProof.includes("HOME QUEST/XR LIVE-SMOKE-PASSED") && liveProof.includes("HOME QUEST/XR LIVE-QUEST-VERIFIED") && liveProof.includes("Do not claim"),
  "Historical live proof must remain warning-bound and must not establish current authority.",
);

check(
  "release evidence records honest warning status",
  releaseEvidence.includes("WEBXR FOUNDATION READY WITH WARNINGS") && releaseEvidence.includes("does not include a completed live deployment artifact") && releaseEvidence.includes("physical Quest hardware validation"),
  "Release evidence must keep current status honest until live deployment and Quest proof are attached by the canonical authority.",
);

const failed = checks.filter((item) => !item.passed);
for (const item of checks) {
  console.log(`[${item.passed ? "PASS" : "FAIL"}] ${item.name}`);
  if (!item.passed) console.log(`       ${item.detail}`);
}

if (failed.length > 0) {
  console.error(`\nWebXR foundation source readiness failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log("\nWebXR foundation source checks passed. This verifies legacy source and quarantine only, not deployment or Quest hardware proof.");
