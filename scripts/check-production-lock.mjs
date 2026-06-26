#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "system", "urai-system-registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

const allowedLaunchModes = new Set([
  "production",
  "public-demo",
  "staging-only",
  "demo-only",
  "roadmap-only",
  "blocked",
  "legacy-archive",
  "sandbox-only",
]);

const deferredOrGatedRepos = new Set([
  "LifeLoggerAI/urai-spatial",
  "LifeLoggerAI/asset-factory",
  "LifeLoggerAI/urai-analytics",
  "LifeLoggerAI/urai-storytime",
  "LifeLoggerAI/urai-communications",
  "LifeLoggerAI/B2Bportal",
  "LifeLoggerAI/urai-studio",
]);

const sensitiveKeywords = [
  "passive",
  "analytics",
  "communications",
  "storytime",
  "spatial",
  "asset",
  "admin",
  "derived intelligence",
  "user-derived",
  "memory",
  "outbound",
];

const hardFailures = [];
const warnings = [];

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasEvidence(value) {
  return hasText(value) || (Array.isArray(value) && value.length > 0) || (value && typeof value === "object");
}

function repoNeedsPrivacyGate(repo) {
  const haystack = [repo.name, repo.role, repo.status, ...(repo.notes || []), ...(repo.evidenceRequired || [])]
    .join(" ")
    .toLowerCase();
  return repo.name === registry.privacyGateRepo || repo.dependsOn?.includes(registry.privacyGateRepo) || sensitiveKeywords.some((keyword) => haystack.includes(keyword));
}

function fail(repo, message) {
  hardFailures.push(`${repo.name}: ${message}`);
}

function warn(repo, message) {
  warnings.push(`${repo.name}: ${message}`);
}

if (registry.canonicalProductRepo !== "LifeLoggerAI/UrAi") {
  hardFailures.push(`registry: canonicalProductRepo must be LifeLoggerAI/UrAi, got ${registry.canonicalProductRepo}`);
}

if (registry.privacyGateRepo !== "LifeLoggerAI/urai-privacy") {
  hardFailures.push(`registry: privacyGateRepo must be LifeLoggerAI/urai-privacy, got ${registry.privacyGateRepo}`);
}

for (const repo of registry.repos || []) {
  const lock = repo.productionLock;
  if (!lock) {
    fail(repo, "missing productionLock object");
    continue;
  }

  if (!allowedLaunchModes.has(lock.launchMode)) {
    fail(repo, `invalid launchMode ${JSON.stringify(lock.launchMode)}`);
  }

  if (repo.name === "LifeLoggerAI/UrAi-Dev" && lock.launchMode !== "sandbox-only") {
    fail(repo, "UrAi-Dev must remain sandbox-only");
  }

  if (repo.name === "LifeLoggerAI/UrAiProd" && lock.launchMode !== "legacy-archive") {
    fail(repo, "UrAiProd must remain legacy-archive");
  }

  if (repo.canClaimProduction === true && lock.launchMode !== "production") {
    fail(repo, "canClaimProduction=true is only allowed when productionLock.launchMode is production");
  }

  if (lock.eligibleForLaunch === true && Array.isArray(lock.blockingReasons) && lock.blockingReasons.length > 0) {
    fail(repo, "eligibleForLaunch=true while blockingReasons is non-empty");
  }

  if ((lock.customDomains || []).length > 0 && (!lock.dnsVerified || !lock.sslVerified)) {
    fail(repo, "customDomains are listed without both DNS and SSL verification");
  }

  if (lock.launchMode === "production") {
    const requiredFields = [
      ["productionUrl", lock.productionUrl],
      ["firebaseProject or equivalent host", lock.firebaseProject],
      ["deployEvidence", lock.deployEvidence],
      ["smokeEvidence", lock.smokeEvidence],
      ["rollbackEvidence", lock.rollbackEvidence],
      ["monitoringEvidence", lock.monitoringEvidence],
    ];

    for (const [label, value] of requiredFields) {
      if (!hasEvidence(value)) fail(repo, `production launch missing ${label}`);
    }

    if ((lock.customDomains || []).length > 0 && (!lock.dnsVerified || !lock.sslVerified)) {
      fail(repo, "production custom domain missing DNS/SSL proof");
    }

    if (repoNeedsPrivacyGate(repo) && !hasEvidence(lock.privacyGateEvidence)) {
      fail(repo, "production launch for gated/sensitive repo missing privacyGateEvidence");
    }
  }

  if (deferredOrGatedRepos.has(repo.name) && lock.launchMode === "production" && !hasEvidence(lock.privacyGateEvidence)) {
    fail(repo, "deferred/gated repo cannot be production without privacy gate evidence");
  }

  if (repoNeedsPrivacyGate(repo) && ["production", "public-demo"].includes(lock.launchMode) && !hasEvidence(lock.privacyGateEvidence)) {
    fail(repo, "sensitive or privacy-gated public launch missing privacyGateEvidence");
  }

  if (repoNeedsPrivacyGate(repo) && !hasEvidence(lock.privacyGateEvidence)) {
    warn(repo, "privacy gate evidence missing; launch mode must remain blocked/demo/staging/roadmap until resolved");
  }
}

const rows = (registry.repos || []).map((repo) => {
  const lock = repo.productionLock || {};
  return {
    repo: repo.name,
    mode: lock.launchMode || "missing",
    eligible: String(lock.eligibleForLaunch === true),
    productionUrl: lock.productionUrl || "-",
    dns: lock.dnsVerified ? "yes" : "no",
    ssl: lock.sslVerified ? "yes" : "no",
    smoke: hasEvidence(lock.smokeEvidence) ? "yes" : "no",
    rollback: hasEvidence(lock.rollbackEvidence) ? "yes" : "no",
    blockers: (lock.blockingReasons || []).length,
  };
});

console.table(rows);

if (warnings.length > 0) {
  console.log("\nProduction lock warnings:");
  for (const message of warnings) console.log(`- ${message}`);
}

if (hardFailures.length > 0) {
  console.error("\nProduction lock failures:");
  for (const message of hardFailures) console.error(`- ${message}`);
  process.exit(1);
}

console.log("\nProduction lock registry is internally consistent. No production readiness is implied unless launchMode=production and all evidence gates are present.");
