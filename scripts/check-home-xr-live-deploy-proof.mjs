#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checks = [];

function readJson(relativePath) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) return null;
  try {
    return JSON.parse(fs.readFileSync(absolute, "utf8"));
  } catch {
    return null;
  }
}

function read(relativePath) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) return "";
  return fs.readFileSync(absolute, "utf8");
}

function assertCheck(name, passed, detail) {
  checks.push({ name, passed, detail });
}

const firebaseConfig = readJson("firebase.json");
const firebaseRc = readJson(".firebaserc");
const liveDoc = read("launch-proof/home-quest-interaction/HOME_XR_LIVE_DEPLOY_VERIFICATION.md");
const manifest = readJson("launch-proof/home-quest-interaction/home-xr-proof-manifest.json");

assertCheck(
  "firebase hosting site configured",
  firebaseConfig?.hosting?.site === "urai-4dc1d",
  "firebase.json must keep hosting.site set to urai-4dc1d until a new production site is intentionally documented.",
);

assertCheck(
  "firebase production project configured",
  firebaseRc?.projects?.production === "urai-4dc1d" && firebaseRc?.projects?.default === "urai-4dc1d",
  ".firebaserc must map default and production to urai-4dc1d until migration proof exists.",
);

assertCheck(
  "live deploy proof doc exists",
  liveDoc.includes("HOME QUEST/XR DEPLOY-CONFIGURED") &&
    liveDoc.includes("HOME QUEST/XR LIVE-SMOKE-PASSED") &&
    liveDoc.includes("HOME QUEST/XR LIVE-QUEST-VERIFIED"),
  "HOME_XR_LIVE_DEPLOY_VERIFICATION.md must preserve the deploy-configured/live-smoke/live-Quest status ladder.",
);

assertCheck(
  "live proof requires deployed URLs",
  liveDoc.includes("Primary production URL") &&
    liveDoc.includes("Firebase hosting URL") &&
    liveDoc.includes("Commit SHA deployed") &&
    liveDoc.includes("Deployment command or CI deploy run URL"),
  "Live deploy proof must require URL, commit, and deploy-run evidence.",
);

assertCheck(
  "live proof requires route checks",
  liveDoc.includes("/home") && liveDoc.includes("/xr") && liveDoc.includes("/life-map") && liveDoc.includes("HTTP 200"),
  "Live deploy proof must require deployed route HTTP checks.",
);

assertCheck(
  "live proof requires screenshots and Quest validation",
  liveDoc.includes("deployed desktop `/home`") &&
    liveDoc.includes("Quest Browser can reach deployed `/home`") &&
    liveDoc.includes("VR session starts from deployed page"),
  "Live deploy proof must require deployed screenshots and Quest hardware validation.",
);

assertCheck(
  "manifest still blocks live verified claims",
  Array.isArray(manifest?.blocked_claims_until_verified) && manifest.blocked_claims_until_verified.includes("Quest ready"),
  "Home XR manifest must keep unverified Quest/VR/XR claims blocked.",
);

const failed = checks.filter((check) => !check.passed);
for (const check of checks) {
  const icon = check.passed ? "PASS" : "FAIL";
  console.log(`[${icon}] ${check.name}`);
  if (!check.passed) console.log(`       ${check.detail}`);
}

if (failed.length) {
  console.error(`\nHome XR live deploy proof check failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log("\nHome XR live deploy proof check passed.");
