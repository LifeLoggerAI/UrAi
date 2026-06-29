#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = {
  releaseEvidence: "docs/release-evidence/2026-06-28-webxr-foundation-status.md",
  liveProof: "launch-proof/home-quest-interaction/HOME_XR_LIVE_DEPLOY_VERIFICATION.md",
  handoff: "launch-proof/home-quest-interaction/FINAL_LIVE_DEPLOY_HANDOFF.md",
  auditWriter: "scripts/write-webxr-audit-summary.mjs",
  deployWriter: "scripts/write-home-xr-deploy-proof-summary.mjs",
  auditWorkflow: ".github/workflows/webxr-foundation-audit.yml",
  deployWorkflow: ".github/workflows/deploy-home-xr.yml",
};

function read(file) {
  const absolute = path.join(root, file);
  return fs.existsSync(absolute) ? fs.readFileSync(absolute, "utf8") : "";
}

const contents = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));
const checks = [];

function check(name, passed, detail) {
  checks.push({ name, passed, detail });
}

for (const [key, file] of Object.entries(files)) {
  check(`${key} exists`, Boolean(contents[key]), `${file} must exist.`);
}

const requiredBoundaries = [
  "WEBXR FOUNDATION READY WITH WARNINGS",
  "HOME QUEST/XR DEPLOY-CONFIGURED",
  "HOME QUEST/XR LIVE-SMOKE-PASSED",
  "HOME QUEST/XR LIVE-QUEST-VERIFIED",
];

for (const boundary of requiredBoundaries) {
  check(
    `handoff includes ${boundary}`,
    contents.handoff.includes(boundary),
    `FINAL_LIVE_DEPLOY_HANDOFF.md must include ${boundary}.`,
  );
}

check(
  "live proof blocks configuration-only claims",
  contents.liveProof.includes("Configuration is not deployment proof") && contents.liveProof.includes("Do not claim"),
  "Live deploy verification doc must explicitly block deploy/live claims without evidence.",
);

check(
  "release evidence preserves warning status",
  contents.releaseEvidence.includes("WEBXR FOUNDATION READY WITH WARNINGS") &&
    contents.releaseEvidence.includes("does not include a completed live deployment artifact") &&
    contents.releaseEvidence.includes("physical Quest hardware validation"),
  "Release evidence must remain warning-only until live deploy and Quest proof exist.",
);

check(
  "issue 348 is linked from proof surfaces",
  contents.handoff.includes("#348") &&
    contents.auditWriter.includes("https://github.com/LifeLoggerAI/UrAi/issues/348") &&
    contents.deployWriter.includes("https://github.com/LifeLoggerAI/UrAi/issues/348"),
  "Final handoff, audit summary, and deploy summary must all point to issue #348.",
);

check(
  "audit workflow verifies launch evidence consistency",
  contents.auditWorkflow.includes("node scripts/check-home-xr-launch-evidence-consistency.mjs"),
  "WebXR audit workflow must run this consistency verifier.",
);

check(
  "audit workflow still avoids deploy",
  contents.auditWorkflow.includes("Verify WebXR foundation without deploy claims") && !contents.auditWorkflow.includes("firebase-tools deploy"),
  "Non-deploying audit workflow must not deploy Firebase Hosting.",
);

check(
  "deploy workflow remains manual and artifact-producing",
  contents.deployWorkflow.includes("workflow_dispatch:") &&
    contents.deployWorkflow.includes("node scripts/write-home-xr-deploy-proof-summary.mjs") &&
    contents.deployWorkflow.includes("home-xr-deploy-proof"),
  "Deploy workflow must remain manual and produce the Home XR deploy proof artifact.",
);

const failed = checks.filter((item) => !item.passed);
for (const item of checks) {
  console.log(`[${item.passed ? "PASS" : "FAIL"}] ${item.name}`);
  if (!item.passed) console.log(`       ${item.detail}`);
}

if (failed.length) {
  console.error(`\nHome XR launch evidence consistency failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log("\nHome XR launch evidence consistency check passed.");
