#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scannedRoots = ["README.md", "src/app", "src/components", "docs"];
const ignoredFragments = [
  ".next",
  "node_modules",
  "dist",
  "coverage",
  "src/app/api",
  "src/app/admin",
  "scripts/check-production-claims.mjs",
];
const textExtensions = new Set([".md", ".mdx", ".ts", ".tsx", ".js", ".jsx"]);

const negativeOrEvidenceContext = /\b(do not claim|must not claim|not allowed|not a claim|not an?\s+[^.]{0,40}claim|not verified|not live|not production|not marketed|not certified|future proof|future|until|before|requires?|required|remaining|missing|validation|verification|evidence|warning|gated|gate|supported|unsupported|capability|if supported|when supported|fallback|browser proves support|WebXR API|immersive-vr support|legacy|reference|archived|historical)\b/i;

const riskyProductionClaims = [
  {
    pattern: /\b(full|real|production|live|complete|done done)\s+(VR|AR|XR|WebXR|headset|Quest)\b/i,
    allowed: negativeOrEvidenceContext,
    reason: "XR production claims must be support-gated or proof-qualified.",
  },
  {
    pattern: /\b(fake headset|fake VR|DOM-only fake|pretend VR|simulated headset)\b/i,
    allowed: /\b(do not|does not|without|no|not|avoid|blocked|prevent|check)\b/i,
    reason: "Fake XR wording is only allowed in explicit prevention/negative contexts.",
  },
  {
    pattern: /\b(Quest ready|headset ready|VR ready|AR ready|XR ready)\b/i,
    allowed: negativeOrEvidenceContext,
    reason: "Readiness claims must include warnings, support gates, or proof.",
  },
  {
    pattern: /\b(iOS Quick Look|quick-look|USDZ|\.usdz)\b/i,
    allowed: negativeOrEvidenceContext,
    reason: "iOS Quick Look/USDZ claims must stay gated until a verified USDZ asset exists.",
  },
];

function shouldIgnore(relativePath) {
  return ignoredFragments.some((fragment) => relativePath === fragment || relativePath.startsWith(`${fragment}/`) || relativePath.includes(fragment));
}

function listFiles(entry) {
  const absolute = path.join(root, entry);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return [absolute];
  if (!stat.isDirectory()) return [];
  return fs.readdirSync(absolute).flatMap((child) => listFiles(path.join(entry, child)));
}

function publicTextFromLine(line) {
  const fragments = [];
  for (const match of line.matchAll(/>([^<>{}][^<>]*)</g)) fragments.push(match[1]);
  for (const match of line.matchAll(/(?:aria-label|title|description|content|placeholder|alt)=['"]([^'"]+)['"]/g)) fragments.push(match[1]);
  for (const match of line.matchAll(/(?:title|description|summary|body|label|eyebrow|placeholder|alt|ariaLabel)\s*:\s*['"`]([^'"`]+)['"`]/g)) fragments.push(match[1]);
  return fragments.length > 0 ? fragments.join(" ") : line;
}

const files = scannedRoots
  .flatMap(listFiles)
  .filter((filePath) => textExtensions.has(path.extname(filePath)))
  .filter((filePath) => !shouldIgnore(path.relative(root, filePath).replace(/\\/g, "/")));

let failed = false;

for (const filePath of files) {
  const relativePath = path.relative(root, filePath).replace(/\\/g, "/");
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const publicText = publicTextFromLine(line);
    const context = [lines[index - 2] ?? "", lines[index - 1] ?? "", publicText, lines[index + 1] ?? "", lines[index + 2] ?? ""].join(" ");

    for (const claim of riskyProductionClaims) {
      claim.pattern.lastIndex = 0;
      if (!claim.pattern.test(publicText)) continue;
      if (claim.allowed.test(context)) continue;

      console.error(`production-claims: risky unqualified claim in ${relativePath}:${index + 1}`);
      console.error(`  ${claim.reason}`);
      console.error(`  ${line.trim()}`);
      failed = true;
    }
  });
}

if (failed) process.exit(1);
console.log("production-claims: public production claim checks passed");
