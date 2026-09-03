#!/usr/bin/env node
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const firebaseCheck = path.join(root, "scripts/check-firebase-target.mjs");
const v1Check = path.join(root, "scripts/check-v1.mjs");
const authorityCheck = path.join(root, "scripts/check-legacy-production-authority-boundary.mjs");

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function run(script, cwd) {
  return spawnSync(process.execPath, [script], {
    cwd,
    encoding: "utf8",
    env: { ...process.env, URAI_EXPECTED_FIREBASE_PROJECT: "urai-4dc1d", URAI_EXPECTED_FIREBASE_SITE: "urai-4dc1d" },
  });
}

function output(result) {
  return (result.stdout || "") + (result.stderr || "");
}

function expectPass(result, label) {
  assert.equal(result.status, 0, label + " should pass:\n" + output(result));
}

function expectFail(result, expected, label) {
  assert.notEqual(result.status, 0, label + " should fail");
  assert.match(output(result), expected, label + " should explain the rejected mutation");
}

function createFixture() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "urai-legacy-quarantine-contract-"));
  const skipped = new Set([".git", ".next", "node_modules", ".firebaserc", "firebase.json", "system"]);

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (skipped.has(entry.name) || /^firebase(?:\.[A-Za-z0-9_-]+)*\.json$/.test(entry.name)) continue;
    fs.symlinkSync(
      path.join(root, entry.name),
      path.join(fixture, entry.name),
      entry.isDirectory() ? "dir" : "file",
    );
  }

  const authority = JSON.parse(fs.readFileSync(path.join(root, "system/canonical-authority.json"), "utf8"));
  writeJson(path.join(fixture, "system/canonical-authority.json"), authority);
  writeJson(path.join(fixture, ".firebaserc"), { projects: {}, targets: {}, etags: {} });
  writeJson(path.join(fixture, "firebase.json"), { emulators: { firestore: { port: 8080 } } });
  return { fixture, authority };
}

function eventPaths(source) {
  const onStart = source.indexOf("on:\n");
  const permissionsStart = source.indexOf("\npermissions:", onStart);
  assert.notEqual(onStart, -1, "WebXR workflow must define triggers");
  assert.notEqual(permissionsStart, -1, "WebXR workflow trigger block must end before permissions");

  const paths = new Map();
  let currentEvent = null;
  let inPaths = false;
  for (const line of source.slice(onStart, permissionsStart).split("\n")) {
    const event = line.match(/^  ([A-Za-z_][A-Za-z0-9_-]*):\s*$/);
    if (event) {
      currentEvent = event[1];
      inPaths = false;
      if (!paths.has(currentEvent)) paths.set(currentEvent, []);
      continue;
    }
    if (/^    paths:\s*$/.test(line)) {
      inPaths = true;
      continue;
    }
    const item = inPaths ? line.match(/^      - ["']?([^"']+)["']?\s*$/) : null;
    if (item && currentEvent) paths.get(currentEvent).push(item[1]);
  }
  return paths;
}

function assertWebXRRootCoverage(workflow, readiness, rootRoute) {
  const paths = eventPaths(workflow);
  for (const event of ["push", "pull_request"]) {
    assert.ok(paths.get(event)?.includes("src/app/page.tsx"), event + " must audit src/app/page.tsx");
  }
  assert.ok(readiness.includes('const rootRoute = read("src/app/page.tsx")'), "readiness audit must read the root route");
  assert.ok(readiness.includes('rootRoute.includes(\'import { LaunchPage } from "@/components/launch/LaunchShell"\')'), "readiness audit must enforce LaunchShell import");
  assert.ok(readiness.includes("rootRoute.includes('<LaunchPage kind=\"home\" />')"), "readiness audit must enforce the quarantined home launch shell");
  assert.ok(rootRoute.includes('import { LaunchPage } from "@/components/launch/LaunchShell"'), "root route must import LaunchShell");
  assert.ok(rootRoute.includes('<LaunchPage kind="home" />'), "root route must remain on the quarantined home launch shell");
}

const baselineFirebase = { emulators: { firestore: { port: 8080 } } };
const deployableValues = {
  hosting: { site: "forbidden" },
  functions: { source: "functions" },
  firestore: { rules: "firestore.rules", indexes: "firestore.indexes.json" },
  database: { rules: "database.rules.json" },
  storage: { rules: "storage.rules" },
  apphosting: { backendId: "forbidden" },
  remoteconfig: { template: "remoteconfig.template.json" },
  extensions: { "forbidden-instance": "publisher/extension@1.0.0" },
  dataconnect: { source: "dataconnect" },
};

const { fixture, authority } = createFixture();
try {
  expectPass(run(firebaseCheck, fixture), "quarantined emulator-only check:firebase");
  expectPass(run(v1Check, fixture), "quarantined emulator-only check:v1");

  writeJson(path.join(fixture, ".firebaserc"), { projects: { default: "forbidden-project" } });
  expectFail(run(firebaseCheck, fixture), /must not define Firebase project aliases/i, "legacy Firebase project alias mutation");
  writeJson(path.join(fixture, ".firebaserc"), { projects: {}, targets: {}, etags: {} });

  for (const [key, value] of Object.entries(deployableValues)) {
    writeJson(path.join(fixture, "firebase.json"), { ...baselineFirebase, [key]: value });
    expectFail(run(firebaseCheck, fixture), new RegExp("deployable config:.*" + key, "i"), "check:firebase " + key + " mutation");
    expectFail(run(v1Check, fixture), new RegExp("emulator-only; found:.*" + key, "i"), "check:v1 " + key + " mutation");
  }

  writeJson(path.join(fixture, "firebase.production.json"), {
    remoteconfig: { template: "remoteconfig.template.json" },
  });
  expectFail(run(firebaseCheck, fixture), /firebase\.production\.json:remoteconfig/i, "alternate Firebase config check:firebase mutation");
  expectFail(run(v1Check, fixture), /firebase\.production\.json:remoteconfig/i, "alternate Firebase config check:v1 mutation");
  fs.rmSync(path.join(fixture, "firebase.production.json"));

  writeJson(path.join(fixture, "deploy.json"), { hosting: { site: "forbidden" } });
  expectFail(run(firebaseCheck, fixture), /deploy\.json:hosting/i, "arbitrarily named Firebase config check:firebase mutation");
  expectFail(run(v1Check, fixture), /deploy\\.json:hosting/i, "arbitrarily named Firebase config check:v1 mutation");
  const arbitraryConfig = spawnSync(process.execPath, [firebaseCheck, "--config", "deploy.json"], { cwd: fixture, encoding: "utf8" });
  expectFail(arbitraryConfig, /deploy\.json:hosting/i, "arbitrary --config Firebase mutation");
  fs.rmSync(path.join(fixture, "deploy.json"));

  writeJson(path.join(fixture, "configs/firebase.json"), { storage: { rules: "storage.rules" } });
  expectFail(run(firebaseCheck, fixture), /configs\/firebase\.json:storage/i, "nested Firebase config check:firebase mutation");
  expectFail(run(v1Check, fixture), /configs\/firebase\.json:storage/i, "nested Firebase config check:v1 mutation");
  fs.rmSync(path.join(fixture, "configs"), { recursive: true, force: true });

  const nonLegacy = { ...authority, legacyRepos: authority.legacyRepos.filter((repo) => repo !== "LifeLoggerAI/UrAi") };
  writeJson(path.join(fixture, "system/canonical-authority.json"), nonLegacy);
  writeJson(path.join(fixture, ".firebaserc"), { projects: { default: "urai-4dc1d" } });
  writeJson(path.join(fixture, "firebase.json"), {
    hosting: { site: "urai-4dc1d" },
    firestore: { rules: "firestore.rules", indexes: "firestore.indexes.json" },
  });
  expectPass(run(firebaseCheck, fixture), "non-legacy canonical Firebase validation");
  expectPass(run(v1Check, fixture), "non-legacy V1 Firebase validation");

  writeJson(path.join(fixture, "firebase.json"), {
    hosting: { site: "urai-4dc1d" },
    firestore: { rules: "firestore.rules" },
  });
  expectFail(run(v1Check, fixture), /firestore\.indexes must point to firestore\.indexes\.json/i, "non-legacy V1 index mutation");

  writeJson(path.join(fixture, ".firebaserc"), { projects: {}, targets: {}, etags: {} });
  writeJson(path.join(fixture, "firebase.json"), baselineFirebase);
  expectFail(run(authorityCheck, fixture), /does not classify LifeLoggerAI\/UrAi as legacy/i, "canonical legacy classification removal");

  const workflow = fs.readFileSync(path.join(root, ".github/workflows/webxr-foundation-audit.yml"), "utf8");
  const readiness = fs.readFileSync(path.join(root, "scripts/check-webxr-foundation-release-readiness.mjs"), "utf8");
  const rootRoute = fs.readFileSync(path.join(root, "src/app/page.tsx"), "utf8");
  assertWebXRRootCoverage(workflow, readiness, rootRoute);

  const pathEntry = '      - "src/app/page.tsx"';
  const first = workflow.indexOf(pathEntry);
  const second = workflow.indexOf(pathEntry, first + pathEntry.length);
  assert.notEqual(first, -1, "push root-route path entry must exist");
  assert.notEqual(second, -1, "pull-request root-route path entry must exist");
  assert.throws(
    () => assertWebXRRootCoverage(workflow.slice(0, first) + workflow.slice(first + pathEntry.length), readiness, rootRoute),
    /push must audit src\/app\/page\.tsx/,
  );
  assert.throws(
    () => assertWebXRRootCoverage(workflow.slice(0, second) + workflow.slice(second + pathEntry.length), readiness, rootRoute),
    /pull_request must audit src\/app\/page\.tsx/,
  );
  assert.throws(
    () => assertWebXRRootCoverage(workflow, readiness.replace('const rootRoute = read("src/app/page.tsx")', 'const rootRoute = read("src/app/not-page.tsx")'), rootRoute),
    /readiness audit must read the root route/,
  );
  assert.throws(
    () => assertWebXRRootCoverage(workflow, readiness, rootRoute.replace("LaunchPage", "OtherPage")),
    /root route must import LaunchShell/,
  );

  console.log("legacy-quarantine-contract-tests: all fail-closed mutations were rejected");
} finally {
  fs.rmSync(fixture, { recursive: true, force: true });
}
