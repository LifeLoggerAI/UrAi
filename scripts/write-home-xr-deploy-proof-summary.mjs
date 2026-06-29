#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const outputDir = process.env.HOME_XR_DEPLOY_PROOF_DIR || "/tmp/urai-playwright-results/home-xr-deploy-proof";
const summaryPath = path.join(outputDir, "deploy-summary.md");
const jsonPath = path.join(outputDir, "deploy-summary.json");
const textPath = path.join(outputDir, "deploy-summary.txt");

const repo = process.env.GITHUB_REPOSITORY || "LifeLoggerAI/UrAi";
const commitSha = process.env.GITHUB_SHA || "local";
const runId = process.env.GITHUB_RUN_ID || "local";
const serverUrl = process.env.GITHUB_SERVER_URL || "https://github.com";
const runUrl = runId === "local" ? "local" : `${serverUrl}/${repo}/actions/runs/${runId}`;
const liveUrl = process.env.HOME_XR_LIVE_URL || "unrecorded";
const firebaseProject = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "unrecorded";
const generatedAt = new Date().toISOString();

const status = {
  repo,
  commitSha,
  runId,
  runUrl,
  liveUrl,
  firebaseProject,
  generatedAt,
  status: "HOME QUEST/XR LIVE-SMOKE-PASSED CANDIDATE",
  proofIssue: "https://github.com/LifeLoggerAI/UrAi/issues/348",
  artifactName: "home-xr-deploy-proof",
  stillRequiresQuestHardwareProofFor: "HOME QUEST/XR LIVE-QUEST-VERIFIED",
  blockedClaimsUntilQuestProof: ["Quest ready", "full VR ready", "full XR live"],
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(jsonPath, `${JSON.stringify(status, null, 2)}\n`);
fs.writeFileSync(
  textPath,
  [
    `commit=${commitSha}`,
    `live_url=${liveUrl}`,
    `firebase_project=${firebaseProject}`,
    `workflow_run=${runUrl}`,
    "status=deployed-and-live-smoked-candidate",
    "tracking_issue=https://github.com/LifeLoggerAI/UrAi/issues/348",
    "quest_status=not-verified-by-this-artifact",
  ].join("\n") + "\n",
);
fs.writeFileSync(
  summaryPath,
  `# Home XR Deploy Proof Summary\n\n` +
    `Generated: ${generatedAt}\n\n` +
    `Repository: ${repo}\n\n` +
    `Commit: ${commitSha}\n\n` +
    `Workflow run: ${runUrl}\n\n` +
    `Live URL: ${liveUrl}\n\n` +
    `Firebase project: ${firebaseProject}\n\n` +
    `Tracking issue: https://github.com/LifeLoggerAI/UrAi/issues/348\n\n` +
    `## Deploy status\n\n` +
    `If this artifact was uploaded after the deploy and live smoke steps passed, it is evidence for HOME QUEST/XR LIVE-SMOKE-PASSED.\n\n` +
    `## Still not proven by this artifact\n\n` +
    `This artifact does not prove physical Quest hardware validation. Do not claim HOME QUEST/XR LIVE-QUEST-VERIFIED, Quest ready, full VR ready, or full XR live until Quest proof is attached to issue #348 and HOME_XR_LIVE_DEPLOY_VERIFICATION.md.\n`,
);

console.log(`Home XR deploy proof summary written to ${summaryPath}`);
console.log(`Home XR deploy proof JSON written to ${jsonPath}`);
console.log(`Home XR deploy proof text written to ${textPath}`);
