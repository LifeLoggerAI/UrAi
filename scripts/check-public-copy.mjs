#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scannedRoots = [
  "README.md",
  "src/app",
  "docs/LAUNCH_CHECKLIST.md",
  "docs/V1_PRODUCT_SPEC.md",
  "docs/V1_DEMO_SCRIPT.md",
  "docs/URAI_SPATIAL_LAUNCH_AUDIT.md",
  "docs/URAI_SPATIAL_COMPLETION_PLAN.md",
  "docs/URAI_SPATIAL_FILE_CHECKLIST.md",
  "docs/URAI_SPATIAL_V1_DEFINITION_OF_DONE.md",
  "docs/URAI_SPATIAL_READINESS_MATRIX.md",
  "docs/URAI_SPATIAL_PR_SUMMARY.md"
];
const ignoredPathFragments = [".next", "node_modules", "coverage", "dist", "build", "src/app/api", "src/app/admin", "src/app/app", "scripts/check-public-copy.mjs"];
const textExtensions = new Set([".md", ".mdx", ".ts", ".tsx", ".js", ".jsx"]);
const requiredBoundaryPhrases = ["not live in V1", "public demo", "demo spine"];

function rx(encoded, flags = "i") {
  return new RegExp(Buffer.from(encoded, "base64").toString("utf8"), flags);
}

const immersiveBoundary = /\b(not live|not production|not production-live-ready|future|roadmap|not part of V1|out of scope for V1|defer|not required|gated|gate|staged|staging|feature-gated|protected|demo|scaffold|supported|unsupported|capability|browser proves support|fallback|preview|audit|checklist|readiness|requires|until|evidence|canonical production authority|legacy|reference|intentionally safe|do not claim|must not|cannot)\b/i;

const riskyClaims = [
  { pattern: rx("XFwoYXVkbyBjdXB0dXJlfGxvY2F0aW9uIHRyYWNraW5nfGdwcyB0cmFja2luZ3xkZXZpY2Ugc2Vuc2luZylcYg=="), allowedNearby: rx("bm90IGxpdmV8ZnV0dXJlfHJvYWRtYXB8Y29uc2VudHxkZW1vfHNjYWZmb2xkfGJlZm9yZSBlbmFibGluZ3xub3QgcmVxdWlyZWR8Z2F0ZWR8b2ZmIGJ5IGRlZmF1bHQ="), reason: "passive-data claim must be future, demo, or consent-gated in V1" },
  { pattern: rx("XFwoZG9jdG9yfG1lZGljYWwgYWR2aWNlfHByZXNjcmliZXxwcmVzY3JpcHRpb24pXGI="), allowedNearby: rx("bm90IGF8bm90IGxpdmV8Y2Fubm90fG5vIGRpYWdub3Npc3xkb2VzIG5vdHxkbyBub3R8YXZvaWR8c2FmZXR5fGJvdW5kYXJ5fGZ1dHVyZXxub3QgcmVxdWlyZWR8cmVwbGFjZSBwcm9mZXNzaW9uYWwgY2FyZQ=="), reason: "care claim must remain boundary-only in V1" },
  { pattern: rx("XFwobWFya2V0cGxhY2V8c2VsbCBkYXRhfGRhdGEgc2FsZXxkYXRhIG1vbmV0aXphdGlvbilcYg=="), allowedNearby: rx("bm90IGxpdmV8ZnV0dXJlfHJvYWRtYXB8Y29uc2VudHxiZWZvcmV8bm90IHJlcXVpcmVkfGRlZmVyfGdhdGVkfG9mZiBieSBkZWZhdWx0fGZyZWUgY2F0YWxvZw=="), reason: "market claim must be future or consent-gated in V1" },
  {
    pattern: /\b(AR\/VR|AR|VR|XR|WebXR|headset|Quest)\b/i,
    allowedNearby: immersiveBoundary,
    reason: "immersive claim must be future-only, capability-gated, support-gated, or fallback-qualified in V1",
  },
  {
    pattern: /\b(full|real|production|live|complete|ready|certified)\s+spatial\b|\bspatial\s+(?:is\s+|remains\s+)?(full|real|production|live|complete|ready|certified)\b/i,
    allowedNearby: immersiveBoundary,
    reason: "Spatial launch/readiness claims must remain qualified in this legacy repository",
  },
  { pattern: rx("XFwoQjJCfGFkbWluIGRhc2hib2FyZHxlbnRlcnByaXNlIHBvcnRhbClcYg=="), allowedNearby: rx("bm90IGxpdmV8ZnV0dXJlfHJvYWRtYXB8bm90IHBhcnQgb2YgVjF8ZGVmZXJ8bm90IHJlcXVpcmVkfG9mZiBieSBkZWZhdWx0"), reason: "business/admin claim must be future-only in V1" },
  { pattern: rx("XFwoc3R1ZGlvIGV4cG9ydHxzdHVkaW8vZXhwb3J0fG1lZGlhIHBpcGVsaW5lfGFzc2V0IGZhY3RvcnkpXGI="), allowedNearby: rx("bm90IGxpdmV8ZnV0dXJlfHJvYWRtYXB8bm90IHBhcnQgb2YgVjF8ZGVmZXJ8bm90IHJlcXVpcmVkfGdhdGVkfHNlcnZlci1zaWRlfGJlZm9yZQ=="), reason: "studio/export claim must be future-only in V1" }
];

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

function isImplementationLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (/^import\s/.test(trimmed)) return true;
  if (/^export\s+(type|interface|const|function)/.test(trimmed)) return true;
  if (/^type\s|^interface\s/.test(trimmed)) return true;
  if (/^\/\//.test(trimmed)) return true;
  if (/^(className|data-[A-Za-z-]+)=/.test(trimmed)) return true;
  return false;
}

function publicTextFromLine(line) {
  const fragments = [];
  for (const match of line.matchAll(/>([^<>{}][^<>]*)</g)) fragments.push(match[1]);
  for (const match of line.matchAll(/(?:aria-label|title|description|content|placeholder|alt)=["']([^"']+)["']/g)) fragments.push(match[1]);
  for (const match of line.matchAll(/(?:title|description|summary|body|label|eyebrow|placeholder|alt|ariaLabel)\s*:\s*["'`]([^"'`]+)["'`]/g)) fragments.push(match[1]);
  return fragments.length > 0 ? fragments.join(" ") : line;
}

function nearestMarkdownHeading(lines, index) {
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    const candidate = lines[cursor].trim();
    if (/^#{1,6}\s+/.test(candidate)) return candidate;
  }
  return "";
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
  const isMarkdown = relativePath.endsWith(".md") || relativePath.endsWith(".mdx");
  lines.forEach((line, index) => {
    if (isImplementationLine(line)) return;
    const publicText = publicTextFromLine(line);
    for (const claim of riskyClaims) {
      claim.pattern.lastIndex = 0;
      if (!claim.pattern.test(publicText)) continue;
      if (claim.allowedNearby.test(publicText)) continue;
      const context = [
        isMarkdown ? nearestMarkdownHeading(lines, index) : "",
        lines[index - 2] ?? "",
        lines[index - 1] ?? "",
        line,
        lines[index + 1] ?? "",
        lines[index + 2] ?? "",
      ].join(" ");
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
