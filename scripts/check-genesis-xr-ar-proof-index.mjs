import fs from "node:fs";
import path from "node:path";

const proofIndexPath = path.resolve("docs/GENESIS_XR_AR_PROOF_INDEX.md");

function fail(message) {
  console.error(`[genesis-xr-ar-proof-index] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(proofIndexPath)) {
  fail("Missing docs/GENESIS_XR_AR_PROOF_INDEX.md");
}

const proofIndex = fs.readFileSync(proofIndexPath, "utf8");

const requiredPhrases = [
  "# Genesis XR AR Proof Index",
  "Status: repo implementation and verification gates added; live deployment proof still required.",
  "src/app/xr/page.tsx",
  "src/components/xr/XRSessionFoundation.tsx",
  "src/components/xr/ARModelViewerPreview.tsx",
  "public/assets/ar/urai-genesis-orb.gltf",
  "scripts/check-ar-preview.mjs",
  "scripts/check-genesis-ar-asset.mjs",
  "scripts/check-genesis-xr-ar-live-url.mjs",
  "scripts/check-genesis-xr-ar-evidence-checklist.mjs",
  "scripts/launch-genesis-xr-ar-complete-gate.mjs",
  "tests/e2e/genesis-xr-ar-production-smoke.spec.ts",
  ".github/workflows/deploy.yml",
  ".github/workflows/production-evidence.yml",
  "docs/URAI_GENESIS_AR_AUDIT.md",
  "docs/GENESIS_XR_AR_LAUNCH_RUNBOOK.md",
  "docs/GENESIS_XR_AR_EVIDENCE_CHECKLIST.md",
  "docs/URAI_POST_MERGE_DEPLOYMENT_EVIDENCE.md",
  "Issue `#300`: production evidence tracker.",
  "Do not claim Genesis XR AR is fully live-production complete until those proof items are attached to issue `#300`."
];

const missing = requiredPhrases.filter((phrase) => !proofIndex.includes(phrase));
if (missing.length) {
  fail(`Proof index is missing required entries:\n- ${missing.join("\n- ")}`);
}

console.log(`[genesis-xr-ar-proof-index] verified ${requiredPhrases.length} proof index entries.`);
