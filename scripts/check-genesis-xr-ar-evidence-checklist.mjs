import fs from "node:fs";
import path from "node:path";

const checklistPath = path.resolve("docs/GENESIS_XR_AR_EVIDENCE_CHECKLIST.md");

function fail(message) {
  console.error(`[genesis-xr-ar-evidence] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(checklistPath)) {
  fail("Missing docs/GENESIS_XR_AR_EVIDENCE_CHECKLIST.md");
}

const checklist = fs.readFileSync(checklistPath, "utf8");

const requiredPhrases = [
  "Status: evidence required before live closure.",
  "`/xr`",
  "`/assets/ar/urai-genesis-orb.gltf`",
  "scripts/check-ar-preview.mjs",
  "scripts/check-genesis-xr-ar-live-url.mjs",
  "scripts/launch-genesis-xr-ar-gate.mjs",
  "tests/e2e/genesis-xr-ar-production-smoke.spec.ts",
  "docs/URAI_GENESIS_AR_AUDIT.md",
  "docs/GENESIS_XR_AR_LAUNCH_RUNBOOK.md",
  "docs/URAI_POST_MERGE_DEPLOYMENT_EVIDENCE.md",
  "Passing production deploy workflow run URL is attached to issue 300.",
  "Passing production evidence workflow run URL is attached to issue 300.",
  "Deployed `/xr` route returns HTTP 200.",
  "Deployed AR model asset returns HTTP 200.",
  "AR model asset parses as glTF 2.0 and contains a mesh.",
  "Production smoke includes the Genesis XR AR test.",
  "Screenshot evidence includes `desktop-xr-ar-preview.png`.",
  "Desktop fallback evidence is attached.",
  "Supported mobile AR evidence or unsupported mobile fallback evidence is attached.",
  "iOS proof stays gated until a verified USDZ asset is added.",
  "Do not mark Genesis XR AR production complete until every required evidence item above is attached or linked from issue 300."
];

const missing = requiredPhrases.filter((phrase) => !checklist.includes(phrase));
if (missing.length) {
  fail(`Checklist is missing required evidence lines:\n- ${missing.join("\n- ")}`);
}

console.log(`[genesis-xr-ar-evidence] verified ${requiredPhrases.length} checklist requirements.`);
