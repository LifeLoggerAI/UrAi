#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const workflowPath = ".github/workflows/deploy-home-xr.yml";
const workflow = fs.existsSync(path.join(root, workflowPath))
  ? fs.readFileSync(path.join(root, workflowPath), "utf8")
  : "";

const checks = [];
const check = (name, passed, detail) => checks.push({ name, passed, detail });

check("workflow exists", Boolean(workflow), `${workflowPath} must exist.`);
check(
  "workflow is manual only",
  workflow.includes("workflow_dispatch:") && !workflow.includes("\n  push:") && !workflow.includes("\n  pull_request:"),
  "Quarantined workflow must be manual-only."
);
check(
  "workflow fails closed",
  /quarantined|disabled|deny/i.test(workflow) && workflow.includes("exit 1"),
  "Quarantined workflow must explicitly deny and exit nonzero."
);
check(
  "workflow has no credential access",
  !/secrets\.|FIREBASE_TOKEN|SERVICE_ACCOUNT|google-github-actions\/auth/i.test(workflow),
  "Quarantined workflow must not reference deployment credentials."
);
check(
  "workflow has no deploy command",
  !/firebase(?:-tools)?\s+deploy|gcloud\s+(?:run|app)\s+deploy|vercel\s+(?:deploy|--prod)/i.test(workflow),
  "Quarantined workflow must not contain a cloud deployment command."
);
check(
  "workflow is read only",
  workflow.includes("contents: read") && !workflow.includes("contents: write"),
  "Quarantined workflow must have read-only repository permission."
);
check(
  "canonical authority is named",
  workflow.includes("urai-spatial") && workflow.includes("urai-tier1"),
  "Quarantined workflow must direct operators to the canonical release authority."
);

const failed = checks.filter((item) => !item.passed);
for (const item of checks) {
  console.log(`[${item.passed ? "PASS" : "FAIL"}] ${item.name}`);
  if (!item.passed) console.log(`       ${item.detail}`);
}

if (failed.length) {
  console.error(`Home XR quarantine check failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log("Home XR deployment authority is quarantined.");
