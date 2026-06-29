#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const indexPath = "launch-proof/home-quest-interaction/EVIDENCE_INDEX.md";
const index = fs.existsSync(path.join(root, indexPath))
  ? fs.readFileSync(path.join(root, indexPath), "utf8")
  : "";

const checks = [];
function check(name, passed, detail) {
  checks.push({ name, passed, detail });
}

check("evidence index exists", Boolean(index), `${indexPath} must exist.`);

const requiredSections = [
  "## Current status",
  "## Implementation evidence",
  "## Automated verification evidence",
  "## CI and workflow evidence",
  "## Deployment evidence",
  "## Artifact evidence",
  "## Manual Quest evidence",
  "## Promotion rules",
  "## Current unresolved evidence gaps",
];

for (const section of requiredSections) {
  check(`section present: ${section}`, index.includes(section), `Missing ${section}.`);
}

const requiredFiles = [
  "src/components/urai/home/HomeWorldCanvas.tsx",
  "src/components/urai/home/HomeXRInteractionLayer.tsx",
  "src/components/urai/home/HomeXRTargets.ts",
  "src/components/xr/XRSessionFoundation.tsx",
  "scripts/check-home-xr-lock.mjs",
  "scripts/check-home-xr-proof-manifest.mjs",
  "scripts/check-home-xr-live-deploy-proof.mjs",
  "scripts/check-home-xr-deploy-workflow.mjs",
  "scripts/check-home-xr-evidence-index.mjs",
  "scripts/check-home-xr-completion-summary.mjs",
  "scripts/check-home-xr-proof-chain.mjs",
  "scripts/smoke-home-xr-live-url.mjs",
  ".github/workflows/ci.yml",
  ".github/workflows/audit-home-xr-deploy-workflow.yml",
  ".github/workflows/audit-home-xr-evidence-index.yml",
  ".github/workflows/audit-home-xr-proof-chain.yml",
  ".github/workflows/deploy-home-xr.yml",
  "launch-proof/home-quest-interaction/QUEST_MANUAL_VALIDATION_CHECKLIST.md",
  "launch-proof/home-quest-interaction/HOME_XR_VERIFICATION_SIGNOFF_TEMPLATE.md",
  "launch-proof/home-quest-interaction/RUNTIME_EXECUTION_RECORD_TEMPLATE.md",
];

for (const file of requiredFiles) {
  check(`required file referenced: ${file}`, index.includes(file), `Evidence index must reference ${file}.`);
}

const requiredStatuses = [
  "HOME QUEST/XR IMPLEMENTED",
  "HOME QUEST/XR PROOF-WIRED",
  "HOME QUEST/XR CI-GREEN",
  "HOME QUEST/XR LIVE-SMOKE-PASSED",
  "HOME QUEST/XR LIVE-QUEST-VERIFIED",
];

for (const status of requiredStatuses) {
  check(`status ladder includes ${status}`, index.includes(status), `Missing status ${status}.`);
}

const blockedClaims = [
  "DONE DONE",
  "Quest ready",
  "VR ready",
  "production XR",
  "full Quest support",
  "live verified working deployed",
];

for (const claim of blockedClaims) {
  check(`blocked claim listed: ${claim}`, index.includes(claim), `Evidence index must block ${claim} until proof exists.`);
}

const runtimeGaps = [
  "CI run result",
  "deploy workflow run result",
  "live deployed URL smoke result",
  "screenshot artifacts",
  "real Quest hardware validation",
  "completed signoff template",
  "completed runtime execution record",
];

for (const gap of runtimeGaps) {
  check(`runtime gap listed: ${gap}`, index.includes(gap), `Evidence index must list unresolved gap: ${gap}.`);
}

check(
  "runtime execution record is required",
  index.includes("runtime execution record is completed") &&
    index.includes("runtime execution record captures final device validation decision"),
  "Evidence index must require the runtime execution record for deployment and device validation proof."
);

check(
  "live verified boundary is explicit",
  index.includes("not live verified") || index.includes("Not live verified"),
  "Evidence index must explicitly state that repo proof is not live verification."
);

const failed = checks.filter((item) => !item.passed);
for (const item of checks) {
  const icon = item.passed ? "PASS" : "FAIL";
  console.log(`[${icon}] ${item.name}`);
  if (!item.passed) console.log(`       ${item.detail}`);
}

if (failed.length) {
  console.error(`\nHome XR evidence index check failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log("\nHome XR evidence index check passed.");
