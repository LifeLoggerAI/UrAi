#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const rulesPath = path.join(root, "firestore.rules");
const indexesPath = path.join(root, "firestore.indexes.json");

const requiredCollections = [
  "timelineEvents",
  "memoryBlooms",
  "moodForecasts",
  "weeklyReflections",
  "companionMessages",
  "narratorInsights",
  "rituals",
  "relationshipSignals",
  "passiveSignals",
  "symbolicStates",
  "waitlistSignups"
];

const ownerUidCollections = [
  "timelineEvents",
  "memoryBlooms",
  "moodForecasts",
  "weeklyReflections",
  "companionMessages",
  "narratorInsights",
  "rituals",
  "relationshipSignals",
  "passiveSignals",
  "symbolicStates"
];

function fail(message) {
  console.error(`firestore-contract: ${message}`);
  process.exitCode = 1;
}

function readRequired(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`missing ${path.relative(root, filePath)}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

const rules = readRequired(rulesPath);
const indexesRaw = readRequired(indexesPath);
let indexes = { indexes: [] };

try {
  indexes = JSON.parse(indexesRaw);
} catch (error) {
  fail(`invalid firestore.indexes.json: ${error.message}`);
}

for (const collection of requiredCollections) {
  if (!rules.includes(`match /${collection}/`)) {
    fail(`missing rules match for ${collection}`);
  }
}

if (!rules.includes("match /waitlistSignups/{id}") || !rules.includes("allow read, write: if false")) {
  fail("waitlistSignups must remain server-only in Firestore rules");
}

for (const collection of ownerUidCollections) {
  const matchStart = rules.indexOf(`match /${collection}/`);
  if (matchStart === -1) continue;
  const matchSnippet = rules.slice(matchStart, matchStart + 240);
  if (!matchSnippet.includes("canReadOwnerDoc") || !matchSnippet.includes("canCreateOwnerDoc")) {
    fail(`${collection} is missing owner-gated read/create rules`);
  }
}

const driftIndexes = indexes.indexes.filter((index) => {
  if (!ownerUidCollections.includes(index.collectionGroup)) return false;
  const fields = Array.isArray(index.fields) ? index.fields : [];
  return fields.some((field) => field.fieldPath === "userId");
});

if (driftIndexes.length > 0) {
  console.warn("firestore-contract: warning - production private indexes still reference userId instead of ownerUid:");
  for (const index of driftIndexes) {
    console.warn(`  - ${index.collectionGroup}`);
  }
  console.warn("firestore-contract: keep userId only for demo/display/public-safe records; migrate production queries to ownerUid.");
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("firestore-contract: required V1 rules and server-only waitlist checks passed");
