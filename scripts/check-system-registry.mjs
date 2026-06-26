import fs from "node:fs";
import path from "node:path";

const registryPath = path.resolve("system/urai-system-registry.json");
const privacyGateRepo = "LifeLoggerAI/urai-privacy";
const genesisSpineRepos = [
  "LifeLoggerAI/UrAi",
  "LifeLoggerAI/urai-staging",
  "LifeLoggerAI/urai-privacy",
  "LifeLoggerAI/urai-admin",
  "LifeLoggerAI/urai-jobs",
  "LifeLoggerAI/urai-content",
];
const legacySandboxRepos = ["LifeLoggerAI/UrAi-Dev", "LifeLoggerAI/UrAiProd"];
const privacySensitiveNames = [
  "LifeLoggerAI/urai-spatial",
  "LifeLoggerAI/urai-analytics",
  "LifeLoggerAI/asset-factory",
  "LifeLoggerAI/urai-storytime",
  "LifeLoggerAI/urai-communications",
];
const classifications = new Set([
  "canonical-product",
  "staging",
  "sandbox",
  "legacy-archive",
  "service",
  "public-surface",
  "governance",
  "internal-runtime",
  "blocked",
]);

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`OK: ${message}`);
}

function hasTextMatch(values, pattern) {
  return values.some((value) => String(value).toLowerCase().includes(pattern));
}

function isRoadmapOnly(repo) {
  const text = [repo.status, repo.role, ...(repo.notes ?? [])].join(" ").toLowerCase();
  return text.includes("roadmap") || text.includes("not production") || text.includes("blocked") || repo.canUseInV1 === false;
}

function isExplicitDemoOnly(repo) {
  const notes = repo.notes ?? [];
  const text = [repo.status, repo.role, ...notes].join(" ").toLowerCase();
  return text.includes("demo") || text.includes("safe to consume");
}

if (!fs.existsSync(registryPath)) {
  fail(`registry file missing at ${registryPath}`);
  process.exit(process.exitCode);
}

const raw = fs.readFileSync(registryPath, "utf8");
const registry = JSON.parse(raw);
const repos = registry.repos ?? [];
const byName = new Map(repos.map((repo) => [repo.name, repo]));

if (registry.canonicalProductRepo !== "LifeLoggerAI/UrAi") {
  fail(`canonicalProductRepo must be LifeLoggerAI/UrAi, found ${registry.canonicalProductRepo}`);
} else {
  ok("canonical product repo is correctly set to LifeLoggerAI/UrAi");
}

if (registry.privacyGateRepo !== privacyGateRepo) {
  fail(`privacyGateRepo must be ${privacyGateRepo}, found ${registry.privacyGateRepo}`);
}

for (const requiredRepo of genesisSpineRepos) {
  if (!byName.has(requiredRepo)) {
    fail(`Genesis spine repo is missing from registry: ${requiredRepo}`);
  }
}

for (const repo of repos) {
  const dependsOn = repo.dependsOn ?? [];
  const notes = repo.notes ?? [];
  const evidenceRequired = repo.evidenceRequired ?? [];
  const statusText = String(repo.status ?? "").toLowerCase();
  const roleText = String(repo.role ?? "").toLowerCase();

  if (!classifications.has(repo.classification)) {
    fail(`${repo.name} has invalid or unknown classification ${repo.classification}`);
  }

  if (repo.classification === "unknown") {
    fail(`${repo.name} is still marked unknown`);
  }

  if (repo.canClaimProduction) {
    if (evidenceRequired.length > 0) {
      fail(`${repo.name} cannot claim production while evidenceRequired is non-empty`);
    }
    if (!repo.productionEvidence) {
      fail(`${repo.name} cannot claim production without productionEvidence`);
    }
  }

  if (legacySandboxRepos.includes(repo.name)) {
    if (repo.canUseInV1) {
      fail(`${repo.name} must not be V1-usable because it is ${repo.classification}`);
    }
    if (repo.canClaimProduction) {
      fail(`${repo.name} must never be production-claimable`);
    }
    if (statusText.includes("production") || roleText.includes("production")) {
      fail(`${repo.name} must not be described as production in status or role`);
    }
  }

  const passiveOrSensitive =
    privacySensitiveNames.includes(repo.name) ||
    notes.includes("contains-passive-data-surface") ||
    hasTextMatch([repo.name, repo.role, repo.status, ...notes], "communications") ||
    hasTextMatch([repo.name, repo.role, repo.status, ...notes], "analytics") ||
    hasTextMatch([repo.name, repo.role, repo.status, ...notes], "spatial") ||
    hasTextMatch([repo.name, repo.role, repo.status, ...notes], "storytime") ||
    hasTextMatch([repo.name, repo.role, repo.status, ...notes], "artifact generation");

  if (passiveOrSensitive && repo.canUseInV1 && repo.name !== privacyGateRepo && !dependsOn.includes(privacyGateRepo)) {
    fail(`${repo.name} is V1-usable and sensitive but does not depend on ${privacyGateRepo}`);
  }

  if (isRoadmapOnly(repo) && repo.canUseInV1 && !isExplicitDemoOnly(repo) && !genesisSpineRepos.includes(repo.name)) {
    fail(`${repo.name} looks roadmap-only but is marked canUseInV1 without explicit demo-only documentation`);
  }
}

const uraiDev = byName.get("LifeLoggerAI/UrAi-Dev");
if (!uraiDev) {
  fail("LifeLoggerAI/UrAi-Dev is missing from the registry");
} else {
  ok("UrAi-Dev is present and checked as sandbox-only");
}

const uraiProd = byName.get("LifeLoggerAI/UrAiProd");
if (!uraiProd) {
  fail("LifeLoggerAI/UrAiProd is missing from the registry");
} else {
  ok("UrAiProd is present and checked as legacy/archive-only");
}

const summary = repos.map((repo) => ({
  repo: repo.name,
  classification: repo.classification,
  status: repo.status,
  v1: repo.canUseInV1 ? "yes" : "no",
  production: repo.canClaimProduction ? "yes" : "no",
  evidence: repo.productionEvidence ? "present" : (repo.evidenceRequired ?? []).length ? "required" : "none",
  privacyGate: repo.name === privacyGateRepo || (repo.dependsOn ?? []).includes(privacyGateRepo) ? "yes" : "no",
}));

console.log("\nSystem Registry Summary");
console.table(summary);

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}

ok("system registry checks passed");
