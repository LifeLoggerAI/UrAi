import fs from "node:fs";
import path from "node:path";

const registryPath = path.resolve("system/urai-system-registry.json");

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`OK: ${message}`);
}

const raw = fs.readFileSync(registryPath, "utf8");
const registry = JSON.parse(raw);

const repos = registry.repos ?? [];
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
  "unknown"
]);

if (registry.canonicalProductRepo !== "LifeLoggerAI/UrAi") {
  fail(`canonicalProductRepo must be LifeLoggerAI/UrAi, found ${registry.canonicalProductRepo}`);
} else {
  ok("canonical product repo is correctly set to LifeLoggerAI/UrAi");
}

const byName = new Map(repos.map((repo) => [repo.name, repo]));

for (const repo of repos) {
  if (!classifications.has(repo.classification)) {
    fail(`${repo.name} has invalid classification ${repo.classification}`);
  }

  if (repo.classification === "unknown") {
    fail(`${repo.name} is still marked unknown`);
  }

  if (repo.canClaimProduction) {
    const evidenceRequired = repo.evidenceRequired ?? [];
    if (evidenceRequired.length > 0) {
      fail(`${repo.name} cannot claim production while evidenceRequired is non-empty`);
    }
    if (!repo.productionEvidence) {
      fail(`${repo.name} cannot claim production without productionEvidence`);
    }
  }

  const notes = repo.notes ?? [];
  if (notes.includes("contains-passive-data-surface")) {
    const dependsOn = repo.dependsOn ?? [];
    if (!dependsOn.includes(registry.privacyGateRepo)) {
      fail(`${repo.name} contains passive data surface but does not depend on ${registry.privacyGateRepo}`);
    }
  }
}

const uraiDev = byName.get("LifeLoggerAI/UrAi-Dev");
if (!uraiDev) {
  fail("LifeLoggerAI/UrAi-Dev is missing from the registry");
} else if (uraiDev.canClaimProduction) {
  fail("LifeLoggerAI/UrAi-Dev must never be marked production");
} else {
  ok("UrAi-Dev is correctly not production-claimable");
}

const uraiProd = byName.get("LifeLoggerAI/UrAiProd");
if (!uraiProd) {
  fail("LifeLoggerAI/UrAiProd is missing from the registry");
} else if (uraiProd.canClaimProduction) {
  fail("LifeLoggerAI/UrAiProd must never be marked production");
} else {
  ok("UrAiProd is correctly not production-claimable");
}

const summary = repos.map((repo) => ({
  repo: repo.name,
  classification: repo.classification,
  status: repo.status,
  canClaimProduction: repo.canClaimProduction,
  canUseInV1: repo.canUseInV1
}));

console.log("\nSystem Registry Summary");
console.table(summary);

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}
