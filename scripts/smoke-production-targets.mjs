#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targetsPath = path.join(root, "system", "production-smoke-targets.json");
const config = JSON.parse(fs.readFileSync(targetsPath, "utf8"));

const rows = [];
const failures = [];
const warnings = [];

async function smokeTarget(target) {
  const startedAt = Date.now();
  try {
    const response = await fetch(target.url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "urai-production-smoke/1.0",
      },
    });
    const body = await response.text();
    const expectedStatuses = Array.isArray(target.expectedStatus) ? target.expectedStatus : [target.expectedStatus];
    const statusOk = expectedStatuses.includes(response.status);
    const missingMarkers = (target.markers || []).filter((marker) => !body.toLowerCase().includes(String(marker).toLowerCase()));
    const markerOk = missingMarkers.length === 0;
    const ok = statusOk && markerOk;
    const result = {
      repo: target.repo,
      name: target.name,
      required: target.required ? "yes" : "no",
      status: response.status,
      expected: expectedStatuses.join("/"),
      markers: markerOk ? "ok" : `missing: ${missingMarkers.join(", ")}`,
      ms: Date.now() - startedAt,
      ok: ok ? "yes" : "no",
    };
    rows.push(result);
    if (!ok) {
      const message = `${target.repo} ${target.name}: expected HTTP ${expectedStatuses.join("/")} and markers [${(target.markers || []).join(", ") || "none"}], got ${response.status}; ${result.markers}`;
      if (target.required) failures.push(message);
      else warnings.push(message);
    }
  } catch (error) {
    const result = {
      repo: target.repo,
      name: target.name,
      required: target.required ? "yes" : "no",
      status: "ERROR",
      expected: Array.isArray(target.expectedStatus) ? target.expectedStatus.join("/") : target.expectedStatus,
      markers: "not checked",
      ms: Date.now() - startedAt,
      ok: "no",
    };
    rows.push(result);
    const message = `${target.repo} ${target.name}: ${error.message}`;
    if (target.required) failures.push(message);
    else warnings.push(message);
  }
}

for (const target of config.targets || []) {
  if (!target.url || !target.url.startsWith("https://")) {
    const message = `${target.repo} ${target.name}: target URL must be explicit https:// public URL`;
    if (target.required) failures.push(message);
    else warnings.push(message);
    continue;
  }
  await smokeTarget(target);
}

console.table(rows);

if (warnings.length > 0) {
  console.log("\nOptional smoke warnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (failures.length > 0) {
  console.error("\nRequired smoke failures:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("\nRequired production smoke targets passed. This is URL reachability evidence only, not production readiness.");
