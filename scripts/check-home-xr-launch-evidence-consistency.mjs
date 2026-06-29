#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const files = {
  releaseEvidence: "docs/release-evidence/2026-06-28-webxr-foundation-status.md",
  liveProof: "launch-proof/home-quest-interaction/HOME_XR_LIVE_DEPLOY_VERIFICATION.md",
  handoff: "launch-proof/home-quest-interaction/FINAL_LIVE_DEPLOY_HANDOFF.md",
  statusManifest: "launch-proof/home-quest-interaction/home-xr-launch-status.json",
  auditWriter: "scripts/write-webxr-audit-summary.mjs",
  deployWriter: "scripts/write-home-xr-deploy-proof-summary.mjs",
  auditWorkflow: ".github/workflows/webxr-foundation-audit.yml",
  deployWorkflow: ".github/workflows/deploy-home-xr.yml",
  consistencyWorkflow: ".github/workflows/home-xr-evidence-consistency.yml",
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

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

for (const [key, file] of Object.entries(files)) {
  check(`${key} exists`, Boolean(contents[key]), `${file} must exist.`);
}

const statusManifest = parseJson(contents.statusManifest);
check("status manifest is valid JSON", Boolean(statusManifest), "home-xr-launch-status.json must parse as JSON.");

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
  check(
    `status manifest includes ${boundary}`,
    contents.statusManifest.includes(boundary),
    `home-xr-launch-status.json must include ${boundary}.`,
  );
}

check(
  "status manifest pins current warning status",
  statusManifest?.current_status === "WEBXR FOUNDATION READY WITH WARNINGS" &&
    statusManifest?.allowed_current_label === "HOME QUEST/XR DEPLOY-CONFIGURED" &&
    statusManifest?.repo_side_complete === true,
  "Status manifest must keep current status warning-only while recording repo-side completion.",
);

check(
  "status manifest records target live URL and Firebase project",
  statusManifest?.live_url === "https://urai-4dc1d.web.app" && statusManifest?.firebase_project === "urai-4dc1d",
  "Status manifest must pin the expected Firebase live URL and project.",
);

check(
  "status manifest records required artifacts",
  statusManifest?.audit_artifact_name === "webxr-foundation-audit-summary" &&
    statusManifest?.deploy_artifact_name === "home-xr-deploy-proof",
  "Status manifest must record audit and deploy artifact names.",
);

check(
  "status manifest blocks live and Quest claims",
  Array.isArray(statusManifest?.blocked_claims_until_live_smoke) &&
    statusManifest.blocked_claims_until_live_smoke.includes("live deployed working") &&
    Array.isArray(statusManifest?.blocked_claims_until_quest_proof) &&
    statusManifest.blocked_claims_until_quest_proof.includes("Quest ready") &&
    statusManifest.blocked_claims_until_quest_proof.includes("full XR live"),
  "Status manifest must explicitly block live and Quest claims until evidence exists.",
);

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
    contents.deployWriter.includes("https://github.com/LifeLoggerAI/UrAi/issues/348") &&
    statusManifest?.tracking_issue === "https://github.com/LifeLoggerAI/UrAi/issues/348",
  "Final handoff, audit summary, deploy summary, and status manifest must all point to issue #348.",
);

check(
  "consistency workflow verifies launch evidence consistency",
  contents.consistencyWorkflow.includes("node scripts/check-home-xr-launch-evidence-consistency.mjs") &&
    contents.consistencyWorkflow.includes("Home XR Evidence Consistency") &&
    contents.consistencyWorkflow.includes("workflow_dispatch:"),
  "Home XR evidence consistency workflow must run this verifier and support manual dispatch.",
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
