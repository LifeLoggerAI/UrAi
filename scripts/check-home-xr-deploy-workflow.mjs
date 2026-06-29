#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const workflowPath = ".github/workflows/deploy-home-xr.yml";
const workflow = fs.existsSync(path.join(root, workflowPath))
  ? fs.readFileSync(path.join(root, workflowPath), "utf8")
  : "";

const checks = [];

function check(name, passed, detail) {
  checks.push({ name, passed, detail });
}

check(
  "workflow exists",
  Boolean(workflow),
  `${workflowPath} must exist.`
);

check(
  "workflow is manual only",
  workflow.includes("workflow_dispatch:") && !workflow.includes("\n  push:") && !workflow.includes("\n  pull_request:"),
  "Deploy workflow must remain manual-only to avoid accidental production deploys."
);

check(
  "required inputs are present",
  workflow.includes("live_url:") && workflow.includes("firebase_project:"),
  "Deploy workflow must require live_url and firebase_project inputs."
);

check(
  "Firebase token is required",
  workflow.includes("secrets.FIREBASE_TOKEN") && workflow.includes("Missing FIREBASE_TOKEN"),
  "Deploy workflow must explicitly require FIREBASE_TOKEN before deploying."
);

check(
  "pre-deploy verification gates are present",
  workflow.includes("npm run check:types") &&
    workflow.includes("npm run lint") &&
    workflow.includes("npm test") &&
    workflow.includes("npm run build") &&
    workflow.includes("npm run verify:routes") &&
    workflow.includes("npm run verify:assets") &&
    workflow.includes("npm run check:public-copy") &&
    workflow.includes("npm run check:production-claims") &&
    workflow.includes("node scripts/check-home-xr-lock.mjs") &&
    workflow.includes("node scripts/check-home-xr-proof-manifest.mjs") &&
    workflow.includes("node scripts/check-home-xr-live-deploy-proof.mjs") &&
    workflow.includes("npm run smoke:genesis-spine"),
  "Deploy workflow must run the full pre-deploy verification gate."
);

check(
  "Home XR smoke runs before deploy",
  workflow.includes("npx playwright install --with-deps chromium") &&
    workflow.includes("npx playwright test tests/e2e/home-xr-interaction.spec.ts"),
  "Deploy workflow must run Home XR Playwright smoke before deploy."
);

check(
  "Firebase Hosting deploy is present",
  workflow.includes("npx firebase-tools deploy --only hosting") && workflow.includes("--project"),
  "Deploy workflow must deploy Firebase Hosting with an explicit project."
);

check(
  "live URL smoke runs after deploy",
  workflow.includes("node scripts/smoke-home-xr-live-url.mjs"),
  "Deploy workflow must smoke the deployed live URL after Firebase deploy."
);

check(
  "deploy proof artifact uploads",
  workflow.includes("home-xr-deploy-proof") && workflow.includes("actions/upload-artifact@v4"),
  "Deploy workflow must upload deploy proof artifacts."
);

const failed = checks.filter((item) => !item.passed);
for (const item of checks) {
  const icon = item.passed ? "PASS" : "FAIL";
  console.log(`[${icon}] ${item.name}`);
  if (!item.passed) console.log(`       ${item.detail}`);
}

if (failed.length) {
  console.error(`\nHome XR deploy workflow check failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log("\nHome XR deploy workflow check passed.");
