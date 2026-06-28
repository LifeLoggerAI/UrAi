#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const defaultScanRoots = [
  "README.md",
  "src/app",
  "src/components",
  "src/data",
  "docs/LAUNCH_CHECKLIST.md",
  "docs/V1_DEMO_SCRIPT.md",
  "docs/V1_PRODUCT_SPEC.md",
  "docs/GENESIS_LAUNCH_PROOF.md",
  "docs/PUBLIC_COPY_CLAIMS_AUDIT.md",
  "docs/SEO_SOCIAL_SHARE_AUDIT.md",
  "docs/URAI_CANONICAL_PUBLIC_SURFACE.md",
  "docs/VIDEO_ASSET_PRODUCTION_MANIFEST.md",
];
const defaultFlagRoots = [
  "src/lib/system-of-systems-contract.ts",
  "src/lib/jobs/jobFeatureGates.ts",
  "src/lib/music-videos",
  "src/lib/passive-sensing",
  "src/lib/data-marketplace",
  "src/lib/council",
  "src/lib/xr-memory-worlds",
];
const scanRoots = envList("URAI_PRODUCTION_CLAIMS_SCAN_ROOTS", defaultScanRoots);
const flagRoots = envList("URAI_PRODUCTION_CLAIMS_FLAG_ROOTS", defaultFlagRoots);
const evidenceDir = path.resolve(
  root,
  process.env.URAI_PRODUCTION_CLAIMS_EVIDENCE_DIR ?? "docs/PRODUCTION_EVIDENCE",
);

const textExtensions = new Set([".md", ".mdx", ".ts", ".tsx", ".js", ".jsx", ".json"]);
const ignoredFragments = [
  ".next",
  ".git",
  "node_modules",
  "coverage",
  "dist",
  "build",
  "src/app/api",
  "src/app/admin",
  "scripts/check-production-claims.mjs",
  "docs/PRODUCTION_EVIDENCE",
  "docs/PRODUCTION_CLAIMS_RELEASE_GATE.md",
  "docs/PRODUCTION_SYSTEMS_COMPLETION_MAP.md",
  "docs/PRODUCTION_SYSTEMS_BACKLOG.md",
  "docs/PRODUCTION_SYSTEMS_RELEASE_GATES.md",
  "docs/URAI_V1_V5_End_to_End_Playbook.md",
  "docs/system",
];

const allowedQualifiers = [
  "preview",
  "beta",
  "private beta",
  "gated",
  "not live",
  "coming soon",
  "demo",
  "waitlist",
  "prototype",
  "roadmap",
  "disabled",
  "off by default",
  "fallback",
  "sample",
  "not production",
  "blocked",
  "production spine",
  "owner-scoped",
  "requires provider configuration",
  "disabled until consent",
  "disabled until configuration",
  "must not claim",
  "do not claim",
  "until",
  "requires",
  "without claiming",
];
const qualifierPattern = new RegExp(
  `\\b(${allowedQualifiers.map(escapeRegExp).join("|")})\\b`,
  "i",
);

const claims = [
  {
    id: "life-movie",
    label: "full generated life movies for every user",
    evidenceFile: "life-movie.md",
    patterns: [
      /(?:full\s+)?generated\s+(?:private\s+|personal\s+)?life\s*(?:movies?|films?)\s+(?:for|to)\s+(?:everyone|every\s+user|all\s+users?)/i,
      /life\s*(?:movies?|films?)\s+(?:are\s+)?(?:live|available)\s+for\s+(?:everyone|all\s+users?)/i,
      /full\s+(?:personalized\s+)?life\s*(?:movie|film)\s+generation\s+(?:is\s+)?live/i,
    ],
  },
  {
    id: "xr",
    label: "live AR/VR/XR memory worlds",
    evidenceFile: "xr.md",
    patterns: [
      /live\s+(?:AR\/VR(?:\/XR)?|AR|VR|XR|WebXR)\b/i,
      /live\s+(?:AR\/VR\/XR|AR|VR|XR|WebXR)\b[^\n]*(?:memory\s+worlds?|worlds?|readiness|runtime)/i,
      /(?:AR\/VR\/XR|XR|WebXR)\s+(?:memory\s+)?worlds?\s+(?:are\s+)?live/i,
      /production[-\s]ready\s+(?:AR|VR|XR|WebXR)/i,
    ],
  },
  {
    id: "passive-sensing",
    label: "passive sensing",
    evidenceFile: "passive-sensing.md",
    patterns: [
      /passive\s+sensing\s+(?:is\s+)?live/i,
      /live\s+passive\s+sensing/i,
      /silent\s+tracking\s+(?:is\s+)?live/i,
      /real[-\s]time\s+sensing\s+(?:is\s+)?always\s+on/i,
    ],
  },
  {
    id: "data-marketplace",
    label: "data marketplace",
    evidenceFile: "data-marketplace.md",
    patterns: [
      /data\s+marketplace\s+(?:is\s+)?live/i,
      /marketplace\s+payouts?\s+(?:are\s+)?live/i,
      /sell(?:ing)?\s+user\s+data\s+(?:is\s+)?live/i,
      /sell\s+your\s+data\s+automatically/i,
    ],
  },
  {
    id: "jobs",
    label: "autonomous jobs",
    evidenceFile: "jobs.md",
    patterns: [
      /autonomous\s+jobs?\s+(?:are\s+)?live/i,
      /live\s+autonomous\s+(?:jobs|agents)/i,
      /agents?\s+act(?:ing)?\s+autonomously\s+(?:is\s+|are\s+)?live/i,
      /AI\s+agents?\s+act\s+for\s+you\s+automatically/i,
    ],
  },
  {
    id: "council",
    label: "full AI model council governance",
    evidenceFile: "council.md",
    patterns: [
      /full\s+(?:AI\s+)?(?:model\s+)?council\s+governance\s+(?:is\s+)?live/i,
      /AI\s+model\s+council\s+(?:is\s+)?live/i,
      /multi[-\s]model\s+council\s+(?:is\s+)?live/i,
    ],
  },
  {
    id: "music-video",
    label: "generated music videos for everyone",
    evidenceFile: "music-video.md",
    patterns: [
      /music\s+videos?\s+for\s+(?:everyone|all\s+users?)/i,
      /generated\s+music\s+videos?\s+(?:are\s+)?live\s+for\s+(?:everyone|all\s+users?)/i,
      /full\s+music[-\s]video\s+generation\s+(?:is\s+)?live/i,
    ],
  },
  {
    id: "asset-factory",
    label: "production media generation",
    evidenceFile: "asset-factory.md",
    patterns: [
      /production\s+media\s+generation\s+(?:is\s+)?live/i,
      /provider[-\s]backed\s+media\s+generation\s+(?:is\s+)?live/i,
      /real\s+generated\s+media\s+(?:is\s+)?live\s+for\s+(?:everyone|all\s+users?)/i,
    ],
  },
];

const featureFlagClaims = [
  { claimId: "xr", pattern: /["']xr\.enabled["']\s*:\s*true|\bxr\s*:\s*\{[^}]*\benabled\s*:\s*true/is, label: "xr.enabled" },
  { claimId: "passive-sensing", pattern: /\blivePassiveSensing\s*:\s*true|["']passiveSensing\.enabled["']\s*:\s*true/i, label: "passive sensing enabled" },
  { claimId: "data-marketplace", pattern: /["']dataMarketplace\.enabled["']\s*:\s*true|\bdataMarketplace\s*:\s*\{[^}]*\benabled\s*:\s*true/is, label: "data marketplace enabled" },
  { claimId: "jobs", pattern: /["']autonomousJobs\.enabled["']\s*:\s*true|\bautonomousJobs\s*:\s*\{[^}]*\benabled\s*:\s*true/is, label: "autonomous jobs enabled" },
  { claimId: "council", pattern: /["']aiCouncil\.fullGovernance["']\s*:\s*true|\bfullCouncilGovernance\s*:\s*true/i, label: "AI council full governance enabled" },
  { claimId: "music-video", pattern: /["']musicVideos\.enabled["']\s*:\s*true|\bmusicVideos\s*:\s*\{[^}]*\benabled\s*:\s*true/is, label: "music videos enabled" },
  { claimId: "life-movie", pattern: /["']lifeMovies\.publicGeneration["']\s*:\s*true|\blifeMovies\s*:\s*\{[^}]*\bpublicGeneration\s*:\s*true/is, label: "life movies public generation enabled" },
  { claimId: "asset-factory", pattern: /["']productionMediaGeneration\.enabled["']\s*:\s*true|\bproductionMediaGeneration\s*:\s*\{[^}]*\benabled\s*:\s*true/is, label: "production media generation enabled" },
];

const evidenceByClaim = new Map(claims.map((claim) => [claim.id, readEvidence(claim)]));
const failures = [];
const warnings = [];
let scannedFileCount = 0;
let allowedQualifiedClaimCount = 0;
let evidenceBackedClaimCount = 0;

for (const filePath of scanRoots.flatMap(listFiles)) {
  const relativePath = relative(filePath);
  if (!shouldScan(filePath)) continue;
  scannedFileCount += 1;
  scanPublicFile(filePath, relativePath);
}

for (const filePath of flagRoots.flatMap(listFiles)) {
  const relativePath = relative(filePath);
  if (!shouldScan(filePath)) continue;
  scanFeatureFlags(filePath, relativePath);
}

for (const evidence of evidenceByClaim.values()) {
  if (!evidence.exists) {
    failures.push(`missing evidence file: ${relative(evidence.path)}`);
  }
}

if (warnings.length > 0) {
  console.log("production-claims warnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (failures.length > 0) {
  console.error("production-claims failures:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `production-claims: passed (${scannedFileCount} public files scanned, ${allowedQualifiedClaimCount} qualified/gated claim(s), ${evidenceBackedClaimCount} evidence-backed live claim(s))`,
);

function scanPublicFile(filePath, relativePath) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    if (isImplementationLine(line, filePath)) return;
    const publicText = publicTextFromLine(line, filePath);
    if (!publicText.trim()) return;
    const context = [lines[index - 2] ?? "", lines[index - 1] ?? "", line, lines[index + 1] ?? "", lines[index + 2] ?? ""].join(" ");

    for (const claim of claims) {
      if (!claim.patterns.some((pattern) => pattern.test(publicText))) continue;
      if (qualifierPattern.test(publicText) || qualifierPattern.test(context)) {
        allowedQualifiedClaimCount += 1;
        continue;
      }

      const evidence = evidenceByClaim.get(claim.id);
      if (evidence?.allowsProductionClaim) {
        evidenceBackedClaimCount += 1;
        continue;
      }

      failures.push(
        `${relativePath}:${index + 1}: unsupported public live claim for ${claim.label}. Add preview/beta/gated/waitlist language or complete ${relative(evidence?.path ?? path.join(evidenceDir, claim.evidenceFile))}. Text: ${publicText.trim()}`,
      );
    }
  });
}

function scanFeatureFlags(filePath, relativePath) {
  const content = fs.readFileSync(filePath, "utf8");

  for (const flag of featureFlagClaims) {
    if (!flag.pattern.test(content)) continue;
    const evidence = evidenceByClaim.get(flag.claimId);
    if (evidence?.allowsProductionClaim) {
      evidenceBackedClaimCount += 1;
      continue;
    }

    failures.push(
      `${relativePath}: ${flag.label} is true without production evidence in ${relative(evidence?.path ?? evidenceDir)}`,
    );
  }
}

function readEvidence(claim) {
  const evidencePath = path.join(evidenceDir, claim.evidenceFile);
  if (!fs.existsSync(evidencePath)) {
    return {
      claimId: claim.id,
      path: evidencePath,
      exists: false,
      allowsProductionClaim: false,
      missing: ["file"],
    };
  }

  const content = fs.readFileSync(evidencePath, "utf8");
  const requiredFields = [
    "productionClaimAllowed",
    "liveDeployEvidence",
    "liveSmokeEvidence",
    "privacyReviewEvidence",
    "rollbackEvidence",
  ];
  const missing = requiredFields.filter((field) => !hasUsableEvidenceField(content, field));
  const allowsProductionClaim =
    /productionClaimAllowed\s*:\s*true/i.test(content) && missing.length === 0;

  return {
    claimId: claim.id,
    path: evidencePath,
    exists: true,
    allowsProductionClaim,
    missing,
  };
}

function hasUsableEvidenceField(content, field) {
  const match = content.match(new RegExp(`^${escapeRegExp(field)}\\s*:\\s*(.+)$`, "im"));
  if (!match) return false;
  const value = match[1].trim().replace(/^['"]|['"]$/g, "").toLowerCase();
  return Boolean(value && !["false", "no", "none", "missing", "tbd", "todo", "n/a"].includes(value));
}

function envList(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw.split(",").map((item) => item.trim()).filter(Boolean);
}

function listFiles(entry) {
  const absolute = path.resolve(root, entry);
  if (!fs.existsSync(absolute)) return [];
  const stat = fs.statSync(absolute);
  if (stat.isFile()) return [absolute];
  if (!stat.isDirectory()) return [];
  return fs.readdirSync(absolute).flatMap((child) => listFiles(path.join(entry, child)));
}

function shouldScan(filePath) {
  const relativePath = relative(filePath);
  if (!textExtensions.has(path.extname(filePath))) return false;
  return !ignoredFragments.some(
    (fragment) =>
      relativePath === fragment ||
      relativePath.startsWith(`${fragment}/`) ||
      relativePath.includes(`/${fragment}/`) ||
      relativePath.includes(fragment),
  );
}

function isImplementationLine(line, filePath) {
  if (path.extname(filePath).startsWith(".md")) return false;
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (/^import\s/.test(trimmed)) return true;
  if (/^export\s+(type|interface|const|function|class)\b/.test(trimmed)) return false;
  if (/^type\s|^interface\s/.test(trimmed)) return true;
  if (/^\/\//.test(trimmed)) return true;
  if (/^(className|data-[A-Za-z-]+)=/.test(trimmed)) return true;
  return false;
}

function publicTextFromLine(line, filePath) {
  if (path.extname(filePath).startsWith(".md")) return line;

  const fragments = [];
  for (const match of line.matchAll(/>([^<>{}][^<>]*)</g)) fragments.push(match[1]);
  for (const match of line.matchAll(/(?:aria-label|title|description|content|placeholder|alt)=['"]([^'"]+)['"]/g)) fragments.push(match[1]);
  for (const match of line.matchAll(/(?:title|description|summary|body|label|eyebrow|placeholder|alt|ariaLabel)\s*:\s*['"`]([^'"`]+)['"`]/g)) fragments.push(match[1]);
  for (const match of line.matchAll(/['"`]([^'"`]*(?:live|everyone|AR\/VR|XR|passive|marketplace|autonomous|council|music video|life movie)[^'"`]*)['"`]/gi)) fragments.push(match[1]);
  return fragments.length > 0 ? fragments.join(" ") : "";
}

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, "/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}