#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const workflowPath = ".github/workflows/deploy-home-xr.yml";
const writerPath = "scripts/write-home-xr-deploy-proof-summary.mjs";
const workflow = fs.existsSync(path.join(root, workflowPath)) ? fs.readFileSync(path.join(root, workflowPath), "utf8") : "";
const writer = fs.existsSync(path.join(root, writerPath)) ? fs.readFileSync(path.join(root, writerPath), "utf8") : "";
const checks = [];

function check(name, passed, detail) {
  checks.push({ name, passed, detail });
}

check("deploy workflow exists", Boolean(workflow), `${workflowPath} must exist.`);
check("proof writer exists", Boolean(writer), `${writerPath} must exist.`);
check(
  "proof writer emits markdown json and text",
  writer.includes("deploy-summary.md") && writer.includes("deploy-summary.json") && writer.includes("deploy-summary.txt"),
  "Structured deploy proof must include markdown, JSON, and legacy text outputs.",
);
check(
  "proof writer is issue-linked",
  writer.includes("https://github.com/LifeLoggerAI/UrAi/issues/348"),
  "Structured deploy proof must reference issue #348.",
);
check(
  "proof writer preserves Quest boundary",
  writer.includes("physical Quest hardware validation") && writer.includes("HOME QUEST/XR LIVE-QUEST-VERIFIED") && writer.includes("Quest ready"),
  "Deploy proof must not imply Quest verification from browser/Firebase deploy alone.",
);
check(
  "deploy workflow runs live smoke before proof summary",
  workflow.includes("node scripts/smoke-home-xr-live-url.mjs") &&
    workflow.includes("node scripts/write-home-xr-deploy-proof-summary.mjs") &&
    workflow.indexOf("node scripts/smoke-home-xr-live-url.mjs") < workflow.indexOf("node scripts/write-home-xr-deploy-proof-summary.mjs"),
  "Deploy workflow must write structured proof only after the live URL smoke step is defined earlier.",
);
check(
  "deploy workflow uploads proof artifact",
  workflow.includes("home-xr-deploy-proof") && workflow.includes("actions/upload-artifact@v4") && workflow.includes("if-no-files-found: error"),
  "Deploy workflow must upload the proof artifact and fail if proof files are missing.",
);

const failed = checks.filter((item) => !item.passed);
for (const item of checks) {
  console.log(`[${item.passed ? "PASS" : "FAIL"}] ${item.name}`);
  if (!item.passed) console.log(`       ${item.detail}`);
}

if (failed.length > 0) {
  console.error(`\nStructured Home XR deploy proof check failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log("\nStructured Home XR deploy proof check passed.");
