import fs from "node:fs";
import path from "node:path";

const registryPath = path.resolve("system/urai-system-registry.json");
const authorityPath = path.resolve("system/canonical-authority.json");
const canonicalProductRepo = "LifeLoggerAI/urai-spatial";
const privacyGateRepo = "LifeLoggerAI/urai-privacy";
const genesisSpineRepos = [
  canonicalProductRepo,
  "LifeLoggerAI/urai-staging",
  "LifeLoggerAI/urai-privacy",
  "LifeLoggerAI/urai-admin",
  "LifeLoggerAI/urai-jobs",
  "LifeLoggerAI/urai-content",
];
const legacyRepos = ["LifeLoggerAI/UrAi", "LifeLoggerAI/UrAi-Dev", "LifeLoggerAI/UrAiProd"];
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

for (const requiredPath of [registryPath, authorityPath]) {
  if (!fs.existsSync(requiredPath)) {
    fail(`required authority file missing at ${requiredPath}`);
  }
}

if (process.exitCode && process.exitCode !== 0) process.exit(process.exitCode);

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
const authority = JSON.parse(fs.readFileSync(authorityPath, "utf8"));
const repos = registry.repos ?? [];
const byName = new Map(repos.map((repo) => [repo.name, repo]));
const authorityLegacyRepos = new Set(authority.legacyRepos ?? []);

for (const [field, expected] of [
  ["canonicalProductRepo", canonicalProductRepo],
  ["applicationRoot", "urai-tier1"],
  ["branch", "main"],
  ["domain", "urai.app"],
]) {
  if (authority[field] !== expected) {
    fail(`canonical authority ${field} must be ${expected}, found ${authority[field]}`);
  } else {
    ok(`canonical authority ${field} is ${expected}`);
  }
}

for (const legacyRepo of legacyRepos) {
  if (!authorityLegacyRepos.has(legacyRepo)) {
    fail(`canonical authority must classify ${legacyRepo} as legacy`);
  }
}

if (registry.canonicalProductRepo === canonicalProductRepo) {
  ok(`historical registry canonicalProductRepo is aligned to ${canonicalProductRepo}`);
} else if (
  registry.canonicalProductRepo === "LifeLoggerAI/UrAi"
  && (authority.supersedes ?? []).includes("system/urai-system-registry.json#canonicalProductRepo")
) {
  ok("historical registry canonicalProductRepo is explicitly superseded by system/canonical-authority.json");
} else {
  fail(`historical registry has an unrecognized canonicalProductRepo value: ${registry.canonicalProductRepo}`);
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
  const isAuthoritySupersededLegacy = authorityLegacyRepos.has(repo.name);

  if (!classifications.has(repo.classification)) {
    fail(`${repo.name} has invalid or unknown classification ${repo.classification}`);
  }

  if (repo.classification === "unknown") {
    fail(`${repo.name} is still marked unknown`);
  }

  if (!isAuthoritySupersededLegacy && repo.canClaimProduction) {
    if (evidenceRequired.length > 0) {
      fail(`${repo.name} cannot claim production while evidenceRequired is non-empty`);
    }
    if (!repo.productionEvidence) {
      fail(`${repo.name} cannot claim production without productionEvidence`);
    }
  }

  if (isAuthoritySupersededLegacy) {
    ok(`${repo.name} is superseded by canonical authority and treated as legacy regardless of historical registry fields`);
    continue;
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

  if (legacyRepos.includes(repo.name) && (statusText.includes("production") || roleText.includes("production"))) {
    fail(`${repo.name} must not be described as production in effective authority`);
  }
}

for (const legacyRepo of legacyRepos) {
  if (!byName.has(legacyRepo)) {
    fail(`${legacyRepo} is missing from the historical registry`);
  } else {
    ok(`${legacyRepo} is present and overridden as legacy by canonical authority`);
  }
}

const summary = repos.map((repo) => {
  const overriddenLegacy = authorityLegacyRepos.has(repo.name);
  return {
    repo: repo.name,
    classification: overriddenLegacy ? "legacy-archive" : repo.classification,
    status: overriddenLegacy ? "legacy/reference; authority superseded" : repo.status,
    v1: overriddenLegacy ? "no" : (repo.canUseInV1 ? "yes" : "no"),
    production: overriddenLegacy ? "no" : (repo.canClaimProduction ? "yes" : "no"),
    evidence: overriddenLegacy ? "quarantine required" : repo.productionEvidence ? "present" : (repo.evidenceRequired ?? []).length ? "required" : "none",
    privacyGate: repo.name === privacyGateRepo || (repo.dependsOn ?? []).includes(privacyGateRepo) ? "yes" : "no",
  };
});

console.log("\nCanonical Authority");
console.table({
  repository: authority.canonicalProductRepo,
  application: authority.applicationRoot,
  branch: authority.branch,
  domain: authority.domain,
  certifiedProductionSha: authority.certifiedProductionSha,
});

console.log("\nSystem Registry Summary");
console.table(summary);

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}

ok("system registry and canonical authority checks passed");
