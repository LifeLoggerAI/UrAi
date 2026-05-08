#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const reportDir = path.join(root, "tmp");
fs.mkdirSync(reportDir, { recursive: true });

const runCommands = process.env.URAI_P1_RUN_COMMANDS === "1";
const strict = process.env.URAI_P1_STRICT === "1";
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

function envPresent(name) {
  return Boolean(process.env[name]?.trim());
}

function envSha(name) {
  const value = process.env[name]?.trim() || "";
  return /^[a-f0-9]{7,40}$/i.test(value);
}

function envOne(name) {
  return process.env[name] === "1";
}

function checkFile(file, why) {
  add(`Required file exists: ${file}`, exists(file), exists(file) ? file : "missing", why);
}

for (const [file, why] of [
  ["docs/P1_RELEASE_HARDENING.md", "Document staging, production, rollback, and promotion discipline."],
  ["scripts/p1-release-gate.mjs", "Provide an executable P1 gate."],
  ["scripts/p0-launch-gate.mjs", "P1 must build on the canonical P0 gate."],
  ["docs/V1_DEPLOY_CHECKLIST.md", "Keep deployment checklist visible."],
  ["docs/V1_QA_CHECKLIST.md", "Keep QA checklist visible."],
  ["firebase.json", "Declare Firebase deploy paths."],
  ["firestore.rules", "Protect data before promotion."],
  ["firestore.indexes.json", "Declare indexes before promotion."],
  [".github/workflows/ci.yml", "Run CI validation before promotion."],
  ["package.json", "Expose P1 command."]
]) {
  checkFile(file, why);
}

if (exists("package.json")) {
  const packageJson = readJson("package.json");
  add("package script exists: launch:p0", Boolean(packageJson.scripts?.["launch:p0"]), packageJson.scripts?.["launch:p0"] || "missing", "Add launch:p0 script from P0 gate.");
  add("package script exists: release:p1", Boolean(packageJson.scripts?.["release:p1"]), packageJson.scripts?.["release:p1"] || "missing", "Add release:p1 script.");
  add("package script exists: test:smoke", Boolean(packageJson.scripts?.["test:smoke"]), packageJson.scripts?.["test:smoke"] || "missing", "Add staging smoke test script.");
}

if (exists("docs/P1_RELEASE_HARDENING.md")) {
  for (const token of [
    "URAI_STAGING_PROJECT_ID",
    "URAI_PRODUCTION_PROJECT_ID",
    "URAI_RELEASE_CANDIDATE_SHA",
    "URAI_ROLLBACK_TARGET_SHA",
    "URAI_STAGING_SMOKE_TESTED",
    "URAI_PRODUCTION_DEPLOY_APPROVED",
    "rollback",
    "release-candidate",
    "ad hoc local branches"
  ]) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    add(`P1 docs mention ${token}`, hasText("docs/P1_RELEASE_HARDENING.md", new RegExp(escaped, "i")), "docs/P1_RELEASE_HARDENING.md", `Document ${token} in P1 release hardening docs.`);
  }
}

if (exists(".github/workflows/ci.yml")) {
  const ci = read(".github/workflows/ci.yml");
  add("CI still runs P0 launch gate", ci.includes("npm run launch:p0"), ".github/workflows/ci.yml", "Run npm run launch:p0 in CI before promotion.");
  add("CI runs P1 release gate", ci.includes("npm run release:p1"), ".github/workflows/ci.yml", "Run npm run release:p1 in CI before promotion.");
}

const commandChecks = [
  "npm run launch:p0",
  "npm run test:smoke"
];

for (const command of commandChecks) {
  if (!runCommands) {
    add(`Command declared, not executed: ${command}`, "unverified", command, `Run URAI_P1_RUN_COMMANDS=1 npm run release:p1 to execute ${command}.`);
    continue;
  }

  const [bin, ...args] = command.split(" ");
  const result = spawnSync(bin, args, { cwd: root, encoding: "utf8", stdio: "pipe" });
  const output = `${result.stdout || ""}\n${result.stderr || ""}`.trim().slice(-3000);
  add(`Command passes: ${command}`, result.status === 0, output || `exit ${result.status}`, `Fix failing command: ${command}`);
}

const environmentEvidence = [
  ["Staging project ID provided", envPresent("URAI_STAGING_PROJECT_ID"), "URAI_STAGING_PROJECT_ID", "Set URAI_STAGING_PROJECT_ID."],
  ["Production project ID provided", envPresent("URAI_PRODUCTION_PROJECT_ID"), "URAI_PRODUCTION_PROJECT_ID", "Set URAI_PRODUCTION_PROJECT_ID."],
  ["Release candidate SHA provided", envSha("URAI_RELEASE_CANDIDATE_SHA"), process.env.URAI_RELEASE_CANDIDATE_SHA || "missing", "Set URAI_RELEASE_CANDIDATE_SHA to the verified commit."],
  ["Rollback target SHA provided", envSha("URAI_ROLLBACK_TARGET_SHA"), process.env.URAI_ROLLBACK_TARGET_SHA || "missing", "Set URAI_ROLLBACK_TARGET_SHA to a known-good commit."],
  ["Staging smoke test evidence provided", envOne("URAI_STAGING_SMOKE_TESTED"), "URAI_STAGING_SMOKE_TESTED", "Set URAI_STAGING_SMOKE_TESTED=1 after staging smoke passes."],
  ["Production deployment explicitly approved", envOne("URAI_PRODUCTION_DEPLOY_APPROVED"), "URAI_PRODUCTION_DEPLOY_APPROVED", "Set URAI_PRODUCTION_DEPLOY_APPROVED=1 only after staging signoff."]
];

for (const [name, ok, evidence, remediation] of environmentEvidence) {
  add(name, ok ? "pass" : "unverified", evidence, remediation);
}

if (envPresent("URAI_STAGING_PROJECT_ID") && envPresent("URAI_PRODUCTION_PROJECT_ID")) {
  add("Staging and production project IDs are different", process.env.URAI_STAGING_PROJECT_ID !== process.env.URAI_PRODUCTION_PROJECT_ID, "URAI_STAGING_PROJECT_ID / URAI_PRODUCTION_PROJECT_ID", "Use separate staging and production project IDs.");
}

if (envSha("URAI_RELEASE_CANDIDATE_SHA") && envSha("URAI_ROLLBACK_TARGET_SHA")) {
  add("Release candidate and rollback SHAs are different", process.env.URAI_RELEASE_CANDIDATE_SHA !== process.env.URAI_ROLLBACK_TARGET_SHA, "URAI_RELEASE_CANDIDATE_SHA / URAI_ROLLBACK_TARGET_SHA", "Rollback target should be a separate known-good commit.");
}

const passed = checks.filter((check) => check.status === "pass");
const failed = checks.filter((check) => check.status === "fail");
const unverified = checks.filter((check) => check.status === "unverified");
const verdict = failed.length === 0 && unverified.length === 0
  ? "P1 READY"
  : failed.length === 0
    ? "P1 STRUCTURALLY READY - EVIDENCE STILL REQUIRED"
    : "P1 NOT READY";

function section(title, rows) {
  if (!rows.length) return `## ${title}\n\nNone.\n`;
  return `## ${title}\n\n${rows.map((check) => `- **${check.name}**\n  - Status: ${check.status}\n  - Evidence: ${check.evidence || "none"}\n  - Next action: ${check.remediation || "none"}`).join("\n")}\n`;
}

const report = `# URAI P1 Release Gate Report\n\nGenerated: ${new Date().toISOString()}\n\nVerdict: **${verdict}**\n\nSummary:\n\n- Passed: ${passed.length}\n- Failed: ${failed.length}\n- Unverified: ${unverified.length}\n\n${section("Failed checks", failed)}\n${section("Unverified evidence", unverified)}\n${section("Passed checks", passed)}\n## Commands\n\nStatic P1 gate:\n\n\`\`\`bash\nnpm run release:p1\n\`\`\`\n\nFull local command gate:\n\n\`\`\`bash\nURAI_P1_RUN_COMMANDS=1 npm run release:p1\n\`\`\`\n\nStrict promotion gate:\n\n\`\`\`bash\nURAI_P1_STRICT=1 \\\nURAI_P1_RUN_COMMANDS=1 \\\nURAI_STAGING_PROJECT_ID=\"...\" \\\nURAI_PRODUCTION_PROJECT_ID=\"...\" \\\nURAI_RELEASE_CANDIDATE_SHA=\"...\" \\\nURAI_ROLLBACK_TARGET_SHA=\"...\" \\\nURAI_STAGING_SMOKE_TESTED=1 \\\nURAI_PRODUCTION_DEPLOY_APPROVED=1 \\\nnpm run release:p1\n\`\`\`\n`;

fs.writeFileSync(path.join(reportDir, "p1-release-gate-report.md"), report);
console.log(report);

if (failed.length > 0) process.exitCode = 1;
if (strict && unverified.length > 0) process.exitCode = 1;
