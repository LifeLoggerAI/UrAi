import registryJson from "../../system/urai-system-registry.json";
import smokeTargetsJson from "../../system/genesis-spine-smoke-targets.json";

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

export type StagingEvidenceState =
  | "not_checked"
  | "local_passed"
  | "staging_ready"
  | "staging_deployed"
  | "staging_smoke_passed"
  | "blocked"
  | "deferred";

export type LaunchMode =
  | "production"
  | "public-demo"
  | "staging-only"
  | "demo-only"
  | "roadmap-only"
  | "blocked"
  | "legacy-archive"
  | "sandbox-only";

export type ProductionEvidence = {
  type: string;
  details: string[];
};

export type ProductionLock = {
  eligibleForLaunch: boolean;
  launchMode: LaunchMode;
  productionUrl: string | null;
  stagingUrl: string | null;
  customDomains: string[];
  firebaseProject: string | null;
  dnsVerified: boolean;
  sslVerified: boolean;
  deployEvidence: string | null;
  smokeEvidence: string | null;
  rollbackEvidence: string | null;
  monitoringEvidence: string | null;
  privacyGateEvidence: string | null;
  blockingReasons: string[];
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
  productionLock: ProductionLock;
  notes: string[];
};

export type SystemRegistry = {
  generatedAt: string;
  canonicalProductRepo: string;
  stagingRepo: string;
  privacyGateRepo: string;
  repos: SystemRepo[];
};

export type GenesisSmokeUrl = {
  label: string;
  url: string;
  expectedStatus: number[];
  required: boolean;
  marker?: string;
};

export type GenesisSmokeTarget = {
  repo: string;
  evidenceState: StagingEvidenceState;
  notes: string[];
  urls: GenesisSmokeUrl[];
};

export type GenesisSmokeTargets = {
  generatedAt: string;
  purpose: string;
  allowedStates: StagingEvidenceState[];
  targets: GenesisSmokeTarget[];
};

const registry = registryJson as SystemRegistry;
const smokeTargets = smokeTargetsJson as GenesisSmokeTargets;

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
      candidate.repos.every(
        (repo) =>
          repo.name &&
          repo.classification &&
          typeof repo.canUseInV1 === "boolean" &&
          repo.productionLock &&
          typeof repo.productionLock.eligibleForLaunch === "boolean" &&
          typeof repo.productionLock.launchMode === "string",
      ),
  );
}

export function getSystemRegistry() {
  return registry;
}

export function getGenesisSmokeTargets() {
  return smokeTargets;
}

export function getGenesisSmokeTarget(repoName: string) {
  return smokeTargets.targets.find((target) => target.repo === repoName);
}

export function getStagingEvidenceState(repoName: string): StagingEvidenceState {
  return getGenesisSmokeTarget(repoName)?.evidenceState ?? "not_checked";
}

export function getStagingEvidenceNotes(repoName: string) {
  return getGenesisSmokeTarget(repoName)?.notes ?? [];
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
  return registry.repos.filter((repo) => repo.classification === "blocked" || repo.status.toLowerCase().includes("blocked") || repo.productionLock.launchMode === "blocked");
}

export function getProductionClaimableRepos() {
  return registry.repos.filter((repo) => repo.productionLock.launchMode === "production" && repo.canClaimProduction && repo.productionLock.eligibleForLaunch);
}

export function getLaunchEligibleRepos() {
  return registry.repos.filter((repo) => repo.productionLock.eligibleForLaunch);
}

export function requiresPrivacyGate(repo: SystemRepo) {
  return repo.name === registry.privacyGateRepo || repo.dependsOn.includes(registry.privacyGateRepo);
}

export function isRoadmapOnly(repo: SystemRepo) {
  return repo.productionLock.launchMode === "roadmap-only" || (!repo.canUseInV1 && !repo.canClaimProduction);
}

export function isProductionEvidenceBacked(repo: SystemRepo) {
  return repo.productionLock.launchMode === "production" && repo.canClaimProduction && repo.productionLock.eligibleForLaunch;
}

export function hasProductionBlockers(repo: SystemRepo) {
  return repo.productionLock.blockingReasons.length > 0;
}
