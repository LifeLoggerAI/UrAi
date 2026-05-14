#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const expectedProject = "urai-4dc1d";
const expectedHostingSite = "urai-4dc1d";

function fail(message) {
  console.error(`[urai-firebase-target] ${message}`);
  process.exit(1);
}

function readJson(file) {
  const fullPath = path.join(root, file);
  if (!fs.existsSync(fullPath)) fail(`${file} is missing.`);
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    fail(`${file} is not valid JSON: ${error.message}`);
  }
}

const firebaserc = readJson(".firebaserc");
const firebaseJson = readJson("firebase.json");

const defaultProject = firebaserc.projects?.default;
const prodProject = firebaserc.projects?.prod;
const hostingSite = firebaseJson.hosting?.site;

if (defaultProject !== expectedProject) {
  fail(`.firebaserc projects.default must be ${expectedProject}, found ${defaultProject || "missing"}.`);
}

if (prodProject !== expectedProject) {
  fail(`.firebaserc projects.prod must be ${expectedProject}, found ${prodProject || "missing"}.`);
}

if (hostingSite !== expectedHostingSite) {
  fail(`firebase.json hosting.site must be ${expectedHostingSite}, found ${hostingSite || "missing"}.`);
}

console.log(`[urai-firebase-target] OK: Firebase project and hosting site are locked to ${expectedProject}.`);
