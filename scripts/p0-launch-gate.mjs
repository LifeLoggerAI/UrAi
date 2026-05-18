#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const reportDir = path.join(root, "tmp");
fs.mkdirSync(reportDir, { recursive: true });

const runCommands = process.env.URAI_P0_RUN_COMMANDS === "1";
const checks = [];

function normalizeStatus(status) {
  if (["pass", "fail", "unverified"].includes(status)) return status;
  return status ? "pass" : "fail";
}

function add(name, status, evidence = "", remediation = "") {
  checks.push({ name, status: normalizeStatus(status), evidence, remediation });
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function readJson(file) {
  return JSON.parse(read(file));
}

function hasText(file, pattern) {
  return exists(file) && pattern.test(read(file));
}

function checkFile(file, why) {
  add(`Required file exists: ${file}`, exists(file), exists(file) ? file : "missing", why);
}

function checkPackageScript(packageJson, script) {
  const command = packageJson.scripts?.[script];
  add(`package script exists: ${script}`, Boolean(command), command || "missing", `Add npm script '${script}'.`);
}

const requiredFiles = [
  ["README.md", "Keep the canonical V1 route and validation instructions visible."],
  ["package.json", "Define the launch validation commands."],
  ["package-lock.json", "Lock dependency versions for repeatable installs."],
  ["env.local.template", "Document all required Firebase environment values."],
  ["firebase.json", "Bind Firestore rules and indexes."],
  ["firestore.rules", "Protect private and server-only data."],
  ["firestore.indexes.json", "Deploy required Firestore indexes."],
  ["src/app/page.tsx", "Serve the public home demo spine at /."],
  ["src/app/u/[handle]/page.tsx", "Serve the public Adam Clamp constellation route."],
  ["src/app/api/companion/route.ts", "Serve the companion narrator API."],
  ["src/app/api/waitlist/route.ts", "Serve the waitlist capture API."],
  ["src/components/HomeScene.tsx", "Render the home demo scene."],
  ["src/components/CompanionChat.tsx", "Render and exercise the companion flow."],
  ["src/components/WaitlistForm.tsx", "Render and exercise waitlist capture."],
  ["src/lib/firebase-admin.ts", "Support configured Firestore writes for waitlist persistence."],
  ["scripts/check-v1.mjs", "Verify required V1 wiring."],
  ["scripts/check-lockfile.mjs", "Fail stale lockfiles before launch."],
  ["scripts/seed-demo.mjs", "Generate deterministic demo seed data."],
  ["docs/V1_DEPLOY_CHECKLIST.md", "Keep deploy readiness checklist in repo."],
  ["docs/V1_QA_CHECKLIST.md", "Keep QA checklist in repo."],
  ["docs/V1_MANUAL_TESTS.md", "Keep manual API/browser recipes in repo."],
  [".github/workflows/ci.yml", "Run app and Functions validation in GitHub Actions."],
  ["functions/package.json", "Validate Firebase Functions separately."]
];

for (const [file, why] of requiredFiles) checkFile(file, why);

let packageJson = null;
if (exists("package.json")) {
  packageJson = readJson("package.json");
  for (const script of [
    "check:v1",
    "check:lockfile",
    "seed:demo",
    "test:unit",
    "test:rules",
    "check:types",
    "lint",
    "build",
    "preflight",
    "test:smoke",
    "test:e2e"
  ]) {
    checkPackageScript(packageJson, script);
  }

  add("Node engine pinned to 20 for app", packageJson.engines?.node === "20", packageJson.engines?.node || "missing", "Set package.json engines.node to 20.");
}

if (exists("functions/package.json")) {
  const functionsPackageJson = readJson("functions/package.json");
  add("Firebase Functions build script exists", Boolean(functionsPackageJson.scripts?.build), functionsPackageJson.scripts?.build || "missing", "Add functions/package.json build script.");
  add("Firebase Functions Node engine pinned to 22", functionsPackageJson.engines?.node === "22", functionsPackageJson.engines?.node || "missing", "Set functions/package.json engines.node to 22.");
}

if (exists("firebase.json")) {
  const firebaseJson = readJson("firebase.json");
  add("firebase.json points to firestore.rules", firebaseJson.firestore?.rules === "firestore.rules", firebaseJson.firestore?.rules || "missing", "Set firestore.rules to firestore.rules.");
  add("firebase.json points to firestore.indexes.json", firebaseJson.firestore?.indexes === "firestore.indexes.json", firebaseJson.firestore?.indexes || "missing", "Set firestore.indexes to firestore.indexes.json.");
}

if (exists("firestore.rules")) {
  const rules = read("firestore.rules");
  add("waitlistSignups is server-only in rules", /waitlistSignups/.test(rules) && /allow\s+read,\s*write:\s*if\s*false/.test(rules), "firestore.rules", "Ensure waitlistSignups cannot be read or written from client rules.");
  add("Firestore rules include deny-by-default fallback", /match\s+\/\{document=\*\*\}/.test(rules) && /allow\s+read,\s*write:\s*if\s*false/.test(rules), "firestore.rules", "Add final match /{document=**} deny rule.");
}

const routeChecks = [
  ["README documents home route", "README.md", /`\/` cinematic home scene/],
  ["README documents Adam Clamp route", "README.md", /\/u\/adamclamp/],
  ["README documents companion API", "README.md", /\/api\/companion/],
  ["README documents waitlist API", "README.md", /\/api\/waitlist/],
  ["manual tests include companion curl", "docs/V1_MANUAL_TESTS.md", /curl -X POST http:\/\/localhost:3014\/api\/companion/],
  ["manual tests include waitlist curl", "docs/V1_MANUAL_TESTS.md", /curl -X POST http:\/\/localhost:3014\/api\/waitlist/],
  ["QA checklist includes mobile and desktop coverage", "docs/V1_QA_CHECKLIST.md", /mobile and desktop/]
];

for (const [name, file, pattern] of routeChecks) {
  add(name, hasText(file, pattern), file, `Update ${file} so this route or test is explicitly covered.`);
}

if (exists(".github/workflows/ci.yml")) {
  const ci = read(".github/workflows/ci.yml");
  for (const token of [
    "npm run check:lockfile",
    "npm run check:v1",
    "npm run launch:p0",
    "npm run seed:demo",
    "npm run test:unit",
    "npm run test:rules",
    "npm run typecheck",
    "npm run lint",
    "npm run build",
    "working-directory: functions"
  ]) {
    add(`CI includes ${token}`, ci.includes(token), ".github/workflows/ci.yml", `Add '${token}' to CI.`);
  }
}

const commands = [
  "npm run check:lockfile",
  "npm run check:v1",
  "npm run seed:demo",
  "npm run test:unit",
  "npm run test:rules",
  "npm run check:types",
  "npm run lint",
  "npm run build",
  "npm run preflight"
];

for (const command of commands) {
  if (!runCommands) {
    add(`Command declared, not executed: ${command}`, "unverified", command, `Run URAI_P0_RUN_COMMANDS=1 npm run launch:p0 to execute ${command}.`);
    continue;
  }

  const [bin, ...args] = command.split(" ");
  const result = spawnSync(bin, args, { cwd: root, encoding: "utf8", stdio: "pipe" });
  const output = `${result.stdout || ""}\n${result.stderr || ""}`.trim().slice(-3000);
  add(`Command passes: ${command}`, result.status === 0, output || `exit ${result.status}`, `Fix failing command: ${command}`);
}

const manualEvidence = [
  ["Desktop demo manually verified", process.env.URAI_P0_DESKTOP_VERIFIED],
  ["Mobile demo manually verified", process.env.URAI_P0_MOBILE_VERIFIED],
  ["Configured waitlist Firestore persistence verified", process.env.URAI_P0_WAITLIST_PERSISTENCE_VERIFIED],
  ["Firestore rules and indexes deployed", process.env.URAI_P0_FIREBASE_RULES_INDEXES_DEPLOYED],
  ["Private data read safety verified", process.env.URAI_P0_PRIVATE_DATA_SAFETY_VERIFIED],
  ["30-60 second demo recording captured", process.env.URAI_P0_DEMO_RECORDING_URL]
];

for (const [name, value] of manualEvidence) {
  add(name, value ? "pass" : "unverified", value || "missing", "Set evidence env var or paste proof into the P0 issue before marking done.");
}

const passed = checks.filter((check) => check.status === "pass");
const failed = checks.filter((check) => check.status === "fail");
const unverified = checks.filter((check) => check.status === "unverified");
const verdict = failed.length === 0 && unverified.length === 0
  ? "P0 READY"
  : failed.length === 0
    ? "P0 STRUCTURALLY READY - EVIDENCE STILL REQUIRED"
    : "P0 NOT READY";

function nextActionFor(check) {
  if (check.status === "pass") return "No action required; this item is already covered by the listed evidence.";
  return check.remediation || "Review and resolve this check.";
}

function section(title, rows) {
  if (!rows.length) return `## ${title}\n\nNone.\n`;
  return `## ${title}\n\n${rows.map((check) => `- **${check.name}**\n  - Status: ${check.status}\n  - Evidence: ${check.evidence || "none"}\n  - Next action: ${nextActionFor(check)}`).join("\n")}\n`;
}

const report = `# URAI P0 Launch Gate Report\n\nGenerated: ${new Date().toISOString()}\n\nVerdict: **${verdict}**\n\nSummary:\n\n- Passed: ${passed.length}\n- Failed: ${failed.length}\n- Unverified: ${unverified.length}\n\n${section("Failed checks", failed)}\n${section("Unverified evidence", unverified)}\n${section("Passed checks", passed)}\n## Commands\n\nStatic gate:\n\n\`\`\`bash\nnpm run launch:p0\n\`\`\`\n\nFull local gate:\n\n\`\`\`bash\nURAI_P0_RUN_COMMANDS=1 npm run launch:p0\n\`\`\`\n\nFull evidence gate example:\n\n\`\`\`bash\nURAI_P0_RUN_COMMANDS=1 \\\nURAI_P0_DESKTOP_VERIFIED=1 \\\nURAI_P0_MOBILE_VERIFIED=1 \\\nURAI_P0_WAITLIST_PERSISTENCE_VERIFIED=1 \\\nURAI_P0_FIREBASE_RULES_INDEXES_DEPLOYED=1 \\\nURAI_P0_PRIVATE_DATA_SAFETY_VERIFIED=1 \\\nURAI_P0_DEMO_RECORDING_URL=\"https://example.com/demo.mp4\" \\\nnpm run launch:p0\n\`\`\`\n`;

fs.writeFileSync(path.join(reportDir, "p0-launch-gate-report.md"), report);
console.log(report);

if (failed.length > 0) process.exitCode = 1;
if (failed.length === 0 && unverified.length > 0 && process.env.URAI_P0_STRICT === "1") process.exitCode = 1;
