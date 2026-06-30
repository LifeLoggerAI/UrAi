import fs from "node:fs";
import path from "node:path";

const registryPath = path.resolve("system/urai-system-registry.json");
const integrationSpinePath = path.resolve("system/urai-integration-spine.json");

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`OK: ${message}`);
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(process.cwd(), filePath)}`);
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Invalid JSON in ${path.relative(process.cwd(), filePath)}: ${error.message}`);
    return null;
  }
}

const registry = readJson(registryPath);
const integrationSpine = readJson(integrationSpinePath);

if (!registry || !integrationSpine) {
  process.exit(process.exitCode || 1);
}

const repos = registry.repos ?? [];
const reposByName = new Map(repos.map((repo) => [repo.name, repo]));
const spineRepos = integrationSpine.spineRepos ?? [];
const launchGates = integrationSpine.launchGates ?? [];

if (integrationSpine.canonicalProductRepo !== registry.canonicalProductRepo) {
  fail(`Integration spine canonical repo ${integrationSpine.canonicalProductRepo} does not match registry ${registry.canonicalProductRepo}`);
} else {
  ok(`Canonical product repo locked to ${registry.canonicalProductRepo}`);
}

for (const spineRepo of spineRepos) {
  const repo = reposByName.get(spineRepo.name);
  if (!repo) {
    fail(`Integration spine repo is missing from registry: ${spineRepo.name}`);
    continue;
  }

  if (repo.canUseInV1 !== spineRepo.canUseInV1) {
    fail(`${spineRepo.name} V1 usage mismatch: registry=${repo.canUseInV1}, spine=${spineRepo.canUseInV1}`);
  }

  if (repo.productionLock?.launchMode !== spineRepo.launchMode) {
    fail(`${spineRepo.name} launch mode mismatch: registry=${repo.productionLock?.launchMode}, spine=${spineRepo.launchMode}`);
  }

  if (spineRepo.requiresPrivacyGate && repo.name !== registry.privacyGateRepo && !(repo.dependsOn ?? []).includes(registry.privacyGateRepo)) {
    fail(`${spineRepo.name} requires the privacy gate but does not depend on ${registry.privacyGateRepo}`);
  }
}

for (const gate of launchGates) {
  if (!gate.id || !gate.ownerRepo || !gate.requiredFor) {
    fail(`Launch gate is missing id, ownerRepo, or requiredFor: ${JSON.stringify(gate)}`);
    continue;
  }

  if (!reposByName.has(gate.ownerRepo)) {
    fail(`Launch gate ${gate.id} references unknown ownerRepo ${gate.ownerRepo}`);
  }

  if (!Array.isArray(gate.acceptanceCriteria) || gate.acceptanceCriteria.length === 0) {
    fail(`Launch gate ${gate.id} has no acceptance criteria`);
  }

  if (gate.status === "passed" && (!gate.evidence || gate.evidence.length === 0)) {
    fail(`Launch gate ${gate.id} is marked passed without evidence`);
  }
}

const summary = spineRepos.map((spineRepo) => {
  const repo = reposByName.get(spineRepo.name);
  return {
    repo: spineRepo.name,
    tier: spineRepo.tier,
    launchMode: spineRepo.launchMode,
    v1: spineRepo.canUseInV1 ? "yes" : "no",
    productionClaim: repo?.canClaimProduction ? "yes" : "no",
    blockers: repo?.productionLock?.blockingReasons?.length ?? 0,
    gates: launchGates.filter((gate) => gate.ownerRepo === spineRepo.name).length,
  };
});

console.log("\nURAI system-of-systems readiness summary");
console.table(summary);

const blockingGates = launchGates.filter((gate) => gate.status !== "passed");
console.log(`\nLaunch gates passed: ${launchGates.length - blockingGates.length}/${launchGates.length}`);

for (const gate of blockingGates) {
  console.log(`BLOCKED ${gate.id}: ${gate.ownerRepo} -> ${gate.status}`);
}

const productionClaimingRepos = repos.filter((repo) => repo.canClaimProduction);
if (productionClaimingRepos.length > 0) {
  fail(`No repo may claim production in this strict pass. Claiming repos: ${productionClaimingRepos.map((repo) => repo.name).join(", ")}`);
}

if (blockingGates.length > 0 && process.env.URAI_ALLOW_BLOCKED_SYSTEMS !== "1") {
  fail(`${blockingGates.length} launch gates are still blocked. Set URAI_ALLOW_BLOCKED_SYSTEMS=1 only for non-release reporting.`);
}

if (process.exitCode && process.exitCode !== 0) {
  process.exit(process.exitCode);
}

ok("System-of-systems production readiness gate passed");
