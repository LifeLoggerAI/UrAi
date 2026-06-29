import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const evidencePath = path.join(repoRoot, "docs", "URAI_POST_MERGE_DEPLOYMENT_EVIDENCE.md");
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

function fail(message) {
  console.error(`[deployment-evidence] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(evidencePath)) {
  fail(`Missing evidence template: ${path.relative(repoRoot, evidencePath)}`);
}

const evidence = fs.readFileSync(evidencePath, "utf8");
const missing = requiredSections.filter((section) => !evidence.includes(section));

if (missing.length > 0) {
  fail(`Evidence template is missing required sections: ${missing.join(", ")}`);
}

console.log("[deployment-evidence] Evidence template is present and structurally complete.");
console.log("[deployment-evidence] Remaining manual/deployment checks:");
console.log("  1. Confirm UrAi CI/CD passes on main.");
console.log("  2. Confirm Firebase Hosting live deploy passes on main.");
console.log("  3. Record deployed URL and commit SHA served by /xr.");
console.log("  4. Smoke deployed /, /u/adamclamp, waitlist, companion fallback, /home -> / redirect, and /xr.");
console.log("  5. Attach desktop/mobile /xr evidence, including AR supported-device or explicit unsupported fallback proof.");
console.log("  6. Attach desktop/mobile evidence to issue #300.");
console.log("  7. Record rollback SHA before declaring production complete.");
