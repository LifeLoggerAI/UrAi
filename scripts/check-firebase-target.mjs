#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const configFlagIndex = args.indexOf("--config");
const firebaseConfigPath = configFlagIndex >= 0 ? args[configFlagIndex + 1] : "firebase.json";

const expectedProject = process.env.URAI_EXPECTED_FIREBASE_PROJECT || "urai-4dc1d";
const expectedHostingSite = process.env.URAI_EXPECTED_FIREBASE_SITE || "urai-4dc1d";

function fail(message) {
  console.error(`[urai-firebase-target] ${message}`);
  process.exit(1);
}

function readJson(file) {
  const fullPath = path.isAbsolute(file) ? file : path.join(root, file);
  if (!fs.existsSync(fullPath)) fail(`${file} is missing.`);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    fail(`${file} is not valid JSON: ${error.message}`);
  }
}

const firebaserc = readJson(".firebaserc");
const firebaseJson = readJson(firebaseConfigPath);

const projectAliases = Object.values(firebaserc.projects || {});
const hostingSite = firebaseJson.hosting?.site;

if (!projectAliases.includes(expectedProject)) {
  fail(`.firebaserc must include project alias for ${expectedProject}. Found: ${projectAliases.join(", ") || "none"}.`);
}

if (hostingSite !== expectedHostingSite) {
  fail(`${firebaseConfigPath} hosting.site must be ${expectedHostingSite}, found ${hostingSite || "missing"}.`);
}

console.log(`[urai-firebase-target] OK: Firebase project/site validated for ${expectedProject}/${expectedHostingSite}.`);
