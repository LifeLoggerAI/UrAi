#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const summaryPath = "docs/HOME_XR_COMPLETION_SUMMARY.md";
const summary = fs.existsSync(path.join(root, summaryPath))
  ? fs.readFileSync(path.join(root, summaryPath), "utf8")
  : "";

const checks = [];
function check(name, passed, detail) {
  checks.push({ name, passed, detail });
}

check("completion summary exists", Boolean(summary), `${summaryPath} must exist.`);

const requiredSections = [
  "## Current repository status",
  "## Implementation files",
  "## Verification files",
  "## Workflows",
  "## Proof documents",
  "## Promotion path",
  "## Claim boundary",
];

for (const section of requiredSections) {
  check(`section present: ${section}`, summary.includes(section), `Missing section: ${section}`);
}

const requiredReferences = [
  "src/components/urai/home/HomeWorldCanvas.tsx",
  "src/components/urai/home/HomeXRInteractionLayer.tsx",
  "src/components/urai/home/HomeXRTargets.ts",
  "src/components/xr/XRSessionFoundation.tsx",
  "scripts/check-home-xr-lock.mjs",
  "scripts/check-home-xr-proof-manifest.mjs",
  "scripts/check-home-xr-live-deploy-proof.mjs",
  "scripts/check-home-xr-deploy-workflow.mjs",
  "scripts/check-home-xr-evidence-index.mjs",
  "scripts/smoke-home-xr-live-url.mjs",
  "tests/unit/home-xr-interaction-layer.test.ts",
  "tests/e2e/home-xr-interaction.spec.ts",
  ".github/workflows/ci.yml",
  ".github/workflows/audit-home-xr-deploy-workflow.yml",
  ".github/workflows/audit-home-xr-evidence-index.yml",
  ".github/workflows/audit-home-xr-proof-chain.yml",
  ".github/workflows/deploy-home-xr.yml",
  "launch-proof/home-quest-interaction/EVIDENCE_INDEX.md",
  "launch-proof/home-quest-interaction/DEPLOY_WORKFLOW_RUNBOOK.md",
  "launch-proof/home-quest-interaction/HOME_XR_LIVE_DEPLOY_VERIFICATION.md",
  "launch-proof/home-quest-interaction/HOME_XR_VERIFICATION_SIGNOFF_TEMPLATE.md",
  "launch-proof/home-quest-interaction/QUEST_MANUAL_VALIDATION_CHECKLIST.md",
  "launch-proof/home-quest-interaction/VALIDATION_RUNBOOK.md",
  "launch-proof/home-quest-interaction/home-xr-proof-manifest.json",
];

for (const reference of requiredReferences) {
  check(`reference present: ${reference}`, summary.includes(reference), `Missing reference: ${reference}`);
}

check(
  "promotion path includes deploy and device validation",
  summary.includes("manual Firebase Hosting deploy workflow") &&
    summary.includes("live URL smoke") &&
    summary.includes("Quest/browser validation") &&
    summary.includes("signoff template"),
  "Promotion path must include deploy, live smoke, device validation, and signoff."
);

check(
  "claim boundary is explicit",
  summary.includes("Use repository completion language") &&
    summary.includes("Use live verification language only after deploy"),
  "Completion summary must preserve the live verification boundary."
);

const failed = checks.filter((item) => !item.passed);
for (const item of checks) {
  const icon = item.passed ? "PASS" : "FAIL";
  console.log(`[${icon}] ${item.name}`);
  if (!item.passed) console.log(`       ${item.detail}`);
}

if (failed.length) {
  console.error(`\nHome XR completion summary check failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log("\nHome XR completion summary check passed.");
