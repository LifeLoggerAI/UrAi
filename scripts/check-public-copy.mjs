#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const scannedRoots = [
  "README.md",
  "src",
  "docs/V1_DEPLOY_CHECKLIST.md",
  "docs/V1_QA_CHECKLIST.md",
  "docs/V1_MANUAL_TESTS.md",
  "docs/V1_DEMO_SCRIPT.md",
  "docs/V1_LAUNCH_STATUS.md",
  "docs/V1_PRODUCT_SPEC.md"
];
const ignoredPathFragments = [
  ".next",
  "node_modules",
  "scripts/check-public-copy.mjs"
];

const requiredBoundaryPhrases = [
  "not live in V1",
  "public demo",
  "demo spine"
];

const riskyClaims = [
  {
    pattern: /\b(passive sensing|passive capture|audio capture|location tracking|gps tracking|device sensing)\b/i,
    allowedNearby: /not live|future|roadmap|consent|demo|scaffold|before enabling|not required/i,
    reason: "passive sensing must be framed as not-live/future/consent-gated in V1"
  },
  {
    pattern: /\b(therapist|therapy|diagnos(?:e|is|tic)|doctor|medical advice|prescri(?:be|ption))\b/i,
    allowedNearby: /not a|not live|cannot|no diagnosis|non-diagnostic|not diagnose|should not diagnose|safety|boundary|future|not required|not replace professional care/i,
    reason: "therapy/diagnosis language must be boundary-only in V1"
  },
  {
    pattern: /\b(marketplace|sell data|data sale|data monetization)\b/i,
    allowedNearby: /not live|future|roadmap|consent|before|not required|defer|not part of V1|not included in V1/i,
    reason: "marketplace claims must be future/consent-gated in V1"
  },
  {
    pattern: /\b(AR\/VR|AR|VR|spatial)\b/i,
    allowedNearby: /not live|future|roadmap|not part of V1|defer|not required|outside V1|protected Tier-2/i,
    reason: "AR/VR/spatial claims must be future-only in V1"
  },
  {
    pattern: /\b(B2B|admin dashboard|enterprise portal)\b/i,
    allowedNearby: /not live|future|roadmap|not part of V1|defer|not required|off by default/i,
    reason: "B2B/admin claims must be future-only in V1"
  },
  {
    pattern: /\b(studio export|studio\/export|media pipeline|asset factory)\b/i,
    allowedNearby: /not live|future|roadmap|not part of V1|defer|not required/i,
    reason: "studio/export claims must be future-only in V1"
  }
];

const textExtensions = new Set([".md", ".mdx", ".ts", ".tsx", ".js", ".jsx", ".json"]);

function shouldIgnore(relativePath) {
  return ignoredPathFragments.some((fragment) => relativePath === fragment || relativePath.startsWith(`${fragment}/`) || relativePath.includes(fragment));
}

function listFiles(entry) {
  const absolute = path.join(root, entry);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);

  if (stat.isFile()) return [absolute];
  if (!stat.isDirectory()) return [];

  return fs.readdirSync(absolute).flatMap((child) => listFiles(path.join(entry, child)));
}

const files = scannedRoots
  .flatMap(listFiles)
  .filter((filePath) => textExtensions.has(path.extname(filePath)))
  .filter((filePath) => !shouldIgnore(path.relative(root, filePath).replace(/\\/g, "/")));

let failed = false;

const readme = fs.existsSync(path.join(root, "README.md")) ? fs.readFileSync(path.join(root, "README.md"), "utf8") : "";
for (const phrase of requiredBoundaryPhrases) {
  if (!readme.includes(phrase)) {
    console.error(`public-copy: README is missing required boundary phrase: ${phrase}`);
    failed = true;
  }
}

for (const filePath of files) {
  const relativePath = path.relative(root, filePath).replace(/\\/g, "/");
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const claim of riskyClaims) {
      if (!claim.pattern.test(line)) continue;
      if (claim.allowedNearby.test(line)) continue;

      const context = [lines[index - 1] ?? "", line, lines[index + 1] ?? ""].join(" ");
      if (claim.allowedNearby.test(context)) continue;

      console.error(`public-copy: risky V1 claim in ${relativePath}:${index + 1}`);
      console.error(`  ${claim.reason}`);
      console.error(`  ${line.trim()}`);
      failed = true;
    }
  });
}

if (failed) process.exit(1);
console.log("public-copy: V1 copy boundary checks passed");
