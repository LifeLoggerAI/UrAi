#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function requireAbsent(relativePath) {
  if (fs.existsSync(path.join(root, relativePath))) {
    throw new Error(`Forbidden legacy deployment entrypoint still exists: ${relativePath}`);
  }
}

function requireFile(relativePath) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) throw new Error(`Required authority file is missing: ${relativePath}`);
  return fs.readFileSync(absolute, "utf8");
}

function requireText(source, expected, label) {
  if (!source.includes(expected)) throw new Error(`${label} is missing required text: ${expected}`);
}

requireAbsent(".github/workflows/deploy.yml");
requireAbsent(".github/workflows/firebase-hosting-live.yml");

const authorityDoc = requireFile("docs/LEGACY_QUARANTINE_AUTHORITY.md");
requireText(authorityDoc, "QUARANTINED LEGACY / REFERENCE REPOSITORY", "Quarantine authority document");
requireText(authorityDoc, "LifeLoggerAI/urai-spatial", "Quarantine authority document");
requireText(authorityDoc, "urai-tier1", "Quarantine authority document");
requireText(authorityDoc, "`main`", "Quarantine authority document");
requireText(authorityDoc, "`urai.app`", "Quarantine authority document");
requireText(authorityDoc, "must not deploy Hosting, Firestore, Functions, App Hosting, DNS, or any public URAI surface", "Quarantine authority document");
requireText(authorityDoc, "Do not re-enable production deployment here", "Quarantine authority document");

const authority = JSON.parse(requireFile("system/canonical-authority.json"));
const expected = {
  schemaVersion: "urai-canonical-authority-1",
  canonicalProductRepo: "LifeLoggerAI/urai-spatial",
  applicationRoot: "urai-tier1",
  branch: "main",
  domain: "urai.app",
};

for (const [key, value] of Object.entries(expected)) {
  if (authority[key] !== value) {
    throw new Error(`Canonical authority ${key} mismatch: expected ${value}, received ${authority[key]}`);
  }
}

for (const legacyRepo of ["LifeLoggerAI/UrAi", "LifeLoggerAI/UrAi-Dev", "LifeLoggerAI/UrAiProd"]) {
  if (!Array.isArray(authority.legacyRepos) || !authority.legacyRepos.includes(legacyRepo)) {
    throw new Error(`Canonical authority does not classify ${legacyRepo} as legacy`);
  }
}

if (!Array.isArray(authority.rules) || !authority.rules.some((rule) => rule.includes("Production deployment authority exists only in LifeLoggerAI/urai-spatial on main"))) {
  throw new Error("Canonical authority is missing the exclusive production deployment rule");
}

const firebaseRc = JSON.parse(requireFile(".firebaserc"));
if (Object.keys(firebaseRc.projects ?? {}).length !== 0) {
  throw new Error("Legacy .firebaserc must not map any project alias");
}

const firebaseConfig = JSON.parse(requireFile("firebase.json"));
for (const deployable of ["hosting", "firestore", "functions", "storage", "apphosting"]) {
  if (Object.prototype.hasOwnProperty.call(firebaseConfig, deployable)) {
    throw new Error(`Legacy firebase.json must not expose deployable ${deployable} configuration`);
  }
}

const launchVerify = requireFile(".github/workflows/urai-launch-verify.yml");
for (const forbidden of ["firebase deploy", "firebase-tools deploy", "urai-4dc1d", "secrets.", "SERVICE_ACCOUNT"]) {
  if (launchVerify.includes(forbidden)) throw new Error(`Verification-only workflow contains forbidden production token: ${forbidden}`);
}

console.log("legacy-authority: canonical Spatial authority and fail-closed legacy boundary verified");
