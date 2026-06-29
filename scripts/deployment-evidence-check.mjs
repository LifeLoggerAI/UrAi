import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const evidencePath = path.join(repoRoot, "docs", "URAI_POST_MERGE_DEPLOYMENT_EVIDENCE.md");
const lifeMapQuestEvidencePath = path.join(repoRoot, "docs", "URAI_LIFE_MAP_QUEST_DEPLOYMENT_EVIDENCE.md");
const lifeMapQuestWorkflowPath = path.join(repoRoot, ".github", "workflows", "life-map-quest-production-evidence.yml");
const requiredSections = [
  "## Deployment workflow evidence",
  "### UrAi CI/CD",
  "### Firebase Hosting live",
  "## Production smoke checklist",
  "## Genesis XR/AR evidence",
  "## Data and safety checks",
  "## Release decision",
  "## Known blockers",
];
const requiredLifeMapQuestSections = [
  "## Claim boundary",
  "## Repo proof gates",
  "## Production evidence workflow",
  "## Deployment evidence required",
  "## Route smoke checklist",
  "## Playwright evidence required",
  "## Quest hardware evidence required",
  "## Current external route observation",
  "## Closure rule",
];

function fail(message) {
  console.error(`[deployment-evidence] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(evidencePath)) {
  fail(`Missing evidence template: ${path.relative(repoRoot, evidencePath)}`);
}

if (!fs.existsSync(lifeMapQuestEvidencePath)) {
  fail(`Missing Life Map Quest evidence template: ${path.relative(repoRoot, lifeMapQuestEvidencePath)}`);
}

if (!fs.existsSync(lifeMapQuestWorkflowPath)) {
  fail(`Missing Life Map Quest production evidence workflow: ${path.relative(repoRoot, lifeMapQuestWorkflowPath)}`);
}

const evidence = fs.readFileSync(evidencePath, "utf8");
const missing = requiredSections.filter((section) => !evidence.includes(section));

if (missing.length > 0) {
  fail(`Evidence template is missing required sections: ${missing.join(", ")}`);
}

const lifeMapQuestEvidence = fs.readFileSync(lifeMapQuestEvidencePath, "utf8");
const missingLifeMapQuestSections = requiredLifeMapQuestSections.filter(
  (section) => !lifeMapQuestEvidence.includes(section),
);

if (missingLifeMapQuestSections.length > 0) {
  fail(`Life Map Quest evidence template is missing required sections: ${missingLifeMapQuestSections.join(", ")}`);
}

const requiredLifeMapQuestTerms = [
  "LIFE MAP QUEST ROUTE-REACHABLE",
  "LIFE MAP QUEST INTERACTION PROOF-WIRED",
  "LIFE MAP QUEST LIVE-SMOKE-PASSED",
  "LIFE MAP QUEST LIVE-QUEST-VERIFIED",
  "npm run smoke:life-map-quest",
  "npm run smoke:life-map-quest-proof",
  "npm run smoke:life-map-quest-live-proof",
  "npm run smoke:life-map-quest-live",
  ".github/workflows/life-map-quest-production-evidence.yml",
  "Life Map Quest Production Evidence",
  "Deploy Firebase Production",
  "life-map-quest-production-evidence",
  "Life Map Quest production evidence workflow run URL",
  "Meta Quest Browser reaches deployed `/life-map`",
  "Do not mark this feature live-working",
];

const missingLifeMapQuestTerms = requiredLifeMapQuestTerms.filter(
  (term) => !lifeMapQuestEvidence.includes(term),
);

if (missingLifeMapQuestTerms.length > 0) {
  fail(`Life Map Quest evidence template is missing required terms: ${missingLifeMapQuestTerms.join(", ")}`);
}

const lifeMapQuestWorkflow = fs.readFileSync(lifeMapQuestWorkflowPath, "utf8");
const requiredLifeMapQuestWorkflowTerms = [
  "Life Map Quest Production Evidence",
  "workflow_run",
  "Deploy Firebase Production",
  "npm run smoke:life-map-quest",
  "npm run smoke:life-map-quest-proof",
  "npm run smoke:life-map-quest-live-proof",
  "npm run smoke:life-map-quest-live",
  "tests/e2e/life-map-quest-interaction.spec.ts",
  "life-map-quest-production-evidence",
];
const missingLifeMapQuestWorkflowTerms = requiredLifeMapQuestWorkflowTerms.filter(
  (term) => !lifeMapQuestWorkflow.includes(term),
);

if (missingLifeMapQuestWorkflowTerms.length > 0) {
  fail(`Life Map Quest production evidence workflow is missing required terms: ${missingLifeMapQuestWorkflowTerms.join(", ")}`);
}

console.log("[deployment-evidence] Evidence template is present and structurally complete.");
console.log("[deployment-evidence] Life Map Quest deployment evidence template is present and structurally complete.");
console.log("[deployment-evidence] Life Map Quest production evidence workflow is present and structurally complete.");
console.log("[deployment-evidence] Remaining manual/deployment checks:");
console.log("  1. Confirm UrAi CI/CD passes on main.");
console.log("  2. Confirm Firebase Hosting live deploy passes on main.");
console.log("  3. Record deployed URL and commit SHA served by /xr and /life-map.");
console.log("  4. Smoke deployed /, /u/adamclamp, waitlist, companion fallback, /home -> / redirect, /xr, and /life-map.");
console.log("  5. Attach desktop/mobile /xr and /life-map evidence, including AR/XR supported-device or explicit unsupported fallback proof.");
console.log("  6. Attach Life Map Quest Playwright artifacts and physical Meta Quest Browser evidence.");
console.log("  7. Attach desktop/mobile evidence to issue #300.");
console.log("  8. Record rollback SHA before declaring production complete.");
