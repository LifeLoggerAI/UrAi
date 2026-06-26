import registryJson from "../../system/urai-system-registry.json";

export type SystemClassification =
  | "canonical-product"
  | "staging"
  | "sandbox"
  | "legacy-archive"
  | "service"
  | "public-surface"
  | "governance"
  | "internal-runtime"
  | "blocked"
  | "unknown";

export type ProductionEvidence = {
  type: string;
  details: string[];
};

export type SystemRepo = {
  name: string;
  role: string;
  classification: SystemClassification;
  status: string;
  canClaimProduction: boolean;
  canUseInV1: boolean;
  requiresPortIntoCanonical: boolean;
  dependsOn: string[];
  blocks: string[];
  evidenceRequired: string[];
  productionEvidence?: ProductionEvidence;
  notes: string[];
};

export type SystemRegistry = {
  generatedAt: string;
  canonicalProductRepo: string;
  stagingRepo: string;
  privacyGateRepo: string;
  repos: SystemRepo[];
};

const registry = registryJson as SystemRegistry;

export const GENESIS_SPINE_REPOS = [
  "LifeLoggerAI/UrAi",
  "LifeLoggerAI/urai-staging",
  "LifeLoggerAI/urai-privacy",
  "LifeLoggerAI/urai-admin",
  "LifeLoggerAI/urai-jobs",
  "LifeLoggerAI/urai-content",
] as const;

const DEFERRED_SYSTEM_REPOS = [
  "LifeLoggerAI/urai-spatial",
  "LifeLoggerAI/asset-factory",
  "LifeLoggerAI/urai-analytics",
  "LifeLoggerAI/urai-storytime",
  "LifeLoggerAI/urai-communications",
  "LifeLoggerAI/B2Bportal",
] as const;

const EXTERNAL_SURFACE_REPOS = [
  "LifeLoggerAI/urai-marketing",
  "LifeLoggerAI/urai-investors",
  "LifeLoggerAI/urai-labs-llc",
  "LifeLoggerAI/urai-foundation",
] as const;

const LEGACY_AND_SANDBOX_REPOS = ["LifeLoggerAI/UrAi-Dev", "LifeLoggerAI/UrAiProd"] as const;

export function validateSystemRegistryShape(candidate: SystemRegistry = registry) {
  return Boolean(
    candidate.canonicalProductRepo === "LifeLoggerAI/UrAi" &&
      candidate.stagingRepo === "LifeLoggerAI/urai-staging" &&
      candidate.privacyGateRepo === "LifeLoggerAI/urai-privacy" &&
      Array.isArray(candidate.repos) &&
      candidate.repos.every((repo) => repo.name && repo.classification && typeof repo.canUseInV1 === "boolean"),
  );
}

export function getSystemRegistry() {
  return registry;
}

export function getCanonicalProductRepo() {
  return registry.repos.find((repo) => repo.name === registry.canonicalProductRepo);
}

export function getGenesisSpineRepos() {
  return registry.repos.filter((repo) => GENESIS_SPINE_REPOS.includes(repo.name as (typeof GENESIS_SPINE_REPOS)[number]));
}

export function getDeferredSystemRepos() {
  return registry.repos.filter((repo) => DEFERRED_SYSTEM_REPOS.includes(repo.name as (typeof DEFERRED_SYSTEM_REPOS)[number]));
}

export function getExternalSurfaceRepos() {
  return registry.repos.filter((repo) => EXTERNAL_SURFACE_REPOS.includes(repo.name as (typeof EXTERNAL_SURFACE_REPOS)[number]));
}

export function getLegacyAndSandboxRepos() {
  return registry.repos.filter((repo) => LEGACY_AND_SANDBOX_REPOS.includes(repo.name as (typeof LEGACY_AND_SANDBOX_REPOS)[number]));
}

export function getRoadmapOnlyRepos() {
  return registry.repos.filter((repo) => !repo.canUseInV1 && !repo.canClaimProduction);
}

export function getBlockedRepos() {
  return registry.repos.filter((repo) => repo.classification === "blocked" || repo.status.toLowerCase().includes("blocked"));
}

export function getProductionClaimableRepos() {
  return registry.repos.filter((repo) => repo.canClaimProduction && repo.productionEvidence);
}

export function requiresPrivacyGate(repo: SystemRepo) {
  return repo.name === registry.privacyGateRepo || repo.dependsOn.includes(registry.privacyGateRepo);
}

export function isRoadmapOnly(repo: SystemRepo) {
  return !repo.canUseInV1 && !repo.canClaimProduction;
}

export function isProductionEvidenceBacked(repo: SystemRepo) {
  return repo.canClaimProduction && Boolean(repo.productionEvidence);
}
