import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "package.json",
  "tsconfig.json",
  "firebase.json",
  "firestore.rules",
  "firestore.indexes.json",
  "storage.rules",
  "env.local.template",
  "src/lib/system-of-systems-contract.ts",
  "functions/src/index.ts",
  "functions/src/uraiCompletionFunctions.ts",
  "docs/audits/URAI_FULL_COMPLETION_AUDIT.md",
  "docs/audits/URAI_FINAL_COMPLETION_AND_DEPLOYMENT_RECORD.md",
  "docs/deployment/PRODUCTION_DEPLOYMENT.md",
  "docs/deployment/ENVIRONMENT_VARIABLES.md",
  "docs/deployment/ROLLBACK.md",
  "docs/deployment/POST_DEPLOY_VERIFICATION.md",
];

const requiredPackageScripts = [
  "dev",
  "build",
  "lint",
  "typecheck",
  "test",
  "test:unit",
  "test:integration",
  "test:e2e",
  "seed:demo",
  "preflight",
  "verify:release",
  "validate:completion",
];

const requiredContractTokens = [
  "profiles",
  "consents",
  "narratorMemory",
  "memoryShards",
  "insights",
  "rituals",
  "journeys",
  "journeyChapters",
  "stars",
  "moodWeather",
  "emotionalForecasts",
  "weeklyRecaps",
  "storyProjects",
  "storyAssets",
  "exports",
  "marketplaceItems",
  "marketplacePurchases",
  "creatorSubmissions",
  "referrals",
  "jobs",
  "jobApplications",
  "adminAuditLogs",
  "telemetryEvents",
  "safetyEvents",
  "notifications",
  "featureFlags",
  "waitlistEntries",
  "contactMessages",
  "dataExportRequests",
  "accountDeletionRequests",
  "free",
  "pro",
  "creator",
  "enterprise",
  "admin",
  "Why am I seeing this",
];

const requiredFunctionExports = [
  "dailyGenerateInsights",
  "weeklyRecap",
  "rollupDaily",
  "requestExport",
  "exportWorker",
  "exportGC",
  "storyOutline",
  "storyAssemble",
  "ttsRender",
  "purchaseWebhook",
  "marketplaceUnlock",
  "referralTrack",
  "notificationDispatch",
  "jobApplicationSubmit",
  "contactSubmit",
  "waitlistSubmit",
  "dataExportRequest",
  "accountDeletionRequest",
  "adminAuditLog",
  "safetyEventCreate",
  "healthCheck",
];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function readJson(file) {
  return JSON.parse(read(file));
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

const problems = [];

for (const file of requiredFiles) {
  if (!exists(file)) problems.push(`Missing required file: ${file}`);
}

const pkg = readJson("package.json");
for (const script of requiredPackageScripts) {
  if (!pkg.scripts?.[script]) problems.push(`Missing package script: ${script}`);
}

const firebaseJson = readJson("firebase.json");
if (firebaseJson.firestore?.rules !== "firestore.rules") problems.push("firebase.json must point firestore.rules to firestore.rules");
if (firebaseJson.firestore?.indexes !== "firestore.indexes.json") problems.push("firebase.json must point firestore.indexes to firestore.indexes.json");
if (firebaseJson.functions?.source !== "functions") problems.push("firebase.json functions source must be functions");

const contract = read("src/lib/system-of-systems-contract.ts");
for (const token of requiredContractTokens) {
  if (!contract.includes(token)) problems.push(`Contract missing token: ${token}`);
}

const functionIndex = read("functions/src/index.ts");
const functionFacade = read("functions/src/uraiCompletionFunctions.ts");
for (const fn of requiredFunctionExports) {
  if (!functionIndex.includes(fn)) problems.push(`functions/src/index.ts does not export ${fn}`);
  if (!functionFacade.includes(`const ${fn}`) && !functionFacade.includes(`function ${fn}`)) {
    problems.push(`functions/src/uraiCompletionFunctions.ts missing ${fn}`);
  }
}

if (problems.length > 0) {
  console.error("URAI completion audit failed:\n");
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log("URAI completion audit passed.");
console.log(`Checked ${requiredFiles.length} files, ${requiredPackageScripts.length} scripts, ${requiredContractTokens.length} contract tokens, and ${requiredFunctionExports.length} function exports.`);
