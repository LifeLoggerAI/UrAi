#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = {
  historicalStatus: "launch-proof/home-quest-interaction/home-xr-launch-status.json",
  historicalProof: "launch-proof/home-quest-interaction/HOME_XR_LIVE_DEPLOY_VERIFICATION.md",
  historicalHandoff: "launch-proof/home-quest-interaction/FINAL_LIVE_DEPLOY_HANDOFF.md",
  auditWorkflow: ".github/workflows/webxr-foundation-audit.yml",
  deployWorkflow: ".github/workflows/deploy-home-xr.yml",
  authority: "docs/LEGACY_QUARANTINE_AUTHORITY.md",
  consistencyWorkflow: ".github/workflows/home-xr-evidence-consistency.yml"
};

const read = (file) => {
  const absolute = path.join(root, file);
  return fs.existsSync(absolute) ? fs.readFileSync(absolute, "utf8") : "";
};

const contents = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));
const checks = [];
const check = (name, passed, detail) => checks.push({ name, passed, detail });

for (const [key, file] of Object.entries(files)) {
  check(`${key} exists`, Boolean(contents[key]), `${file} must remain available.`);
}

check(
  "historical proof remains warning-bound",
  contents.historicalProof.includes("Configuration is not deployment proof") && contents.historicalProof.includes("Do not claim"),
  "Historical proof must retain its warning boundary."
);
check(
  "historical handoff is preserved",
  contents.historicalHandoff.includes("HOME QUEST/XR"),
  "Historical handoff must remain available for provenance."
);
check(
  "current deploy workflow is quarantined",
  /quarantined|disabled|deny/i.test(contents.deployWorkflow) && contents.deployWorkflow.includes("exit 1"),
  "Current deployment workflow must deny and exit nonzero."
);
check(
  "current deploy workflow is credential and mutation free",
  !/secrets\.|FIREBASE_TOKEN|firebase(?:-tools)?\s+deploy|gcloud\s+(?:run|app)\s+deploy|vercel\s+(?:deploy|--prod)/i.test(contents.deployWorkflow),
  "Current workflow must not consume deployment credentials or mutate cloud resources."
);
check(
  "source audit has no canonical production target",
  contents.auditWorkflow.includes("legacy WebXR source without deploy claims") &&
    !contents.auditWorkflow.includes("urai-4dc1d") &&
    !contents.auditWorkflow.includes("live-deploy-proof"),
  "Source audit must not target or certify canonical production."
);
check(
  "canonical authority is recorded",
  contents.authority.includes("LifeLoggerAI/urai-spatial") &&
    contents.authority.includes("urai-tier1") &&
    contents.authority.includes("urai.app"),
  "Authority document must name the canonical path."
);
check(
  "consistency workflow runs this checker",
  contents.consistencyWorkflow.includes("check-home-xr-launch-evidence-consistency.mjs"),
  "Consistency workflow must execute this verifier."
);

const failed = checks.filter((item) => !item.passed);
for (const item of checks) {
  console.log(`[${item.passed ? "PASS" : "FAIL"}] ${item.name}`);
  if (!item.passed) console.log(`       ${item.detail}`);
}

if (failed.length) {
  console.error(`Home XR evidence quarantine consistency failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log("Historical Home XR evidence is preserved and current deployment authority is quarantined.");
