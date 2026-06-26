import fs from "node:fs";
import path from "node:path";

const configPath = path.resolve("system/genesis-spine-smoke-targets.json");
const knownBlocked = new Set(["LifeLoggerAI/urai-admin", "LifeLoggerAI/urai-content"]);

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function warn(message) {
  console.warn(`WARN: ${message}`);
}

if (!fs.existsSync(configPath)) {
  fail(`Missing smoke target config at ${configPath}`);
  process.exit(process.exitCode);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const rows = [];

for (const target of config.targets ?? []) {
  if (!Array.isArray(target.urls) || target.urls.length === 0) {
    rows.push({ repo: target.repo, label: "no-url", status: "evidence_gap", url: "not configured" });
    if (target.evidenceState === "staging_smoke_passed") {
      fail(`${target.repo} cannot be staging_smoke_passed without smoke URLs.`);
    }
    continue;
  }

  if (knownBlocked.has(target.repo) && target.evidenceState === "staging_smoke_passed") {
    fail(`${target.repo} is known blocked but marked staging_smoke_passed.`);
  }

  for (const urlConfig of target.urls) {
    try {
      const response = await fetch(urlConfig.url, { redirect: "follow" });
      const body = await response.text();
      const expected = urlConfig.expectedStatus ?? [200];
      const statusOk = expected.includes(response.status) || (response.status >= 200 && response.status < 300 && expected.includes(200));
      const markerOk = urlConfig.marker ? body.toLowerCase().includes(String(urlConfig.marker).toLowerCase()) : true;
      const passed = statusOk && markerOk;

      rows.push({
        repo: target.repo,
        label: urlConfig.label,
        status: response.status,
        result: passed ? "pass" : "fail",
        url: urlConfig.url,
      });

      if (!passed && urlConfig.required) {
        fail(`${target.repo} ${urlConfig.label} failed required smoke check at ${urlConfig.url}. status=${response.status} marker=${markerOk}`);
      } else if (!passed) {
        warn(`${target.repo} ${urlConfig.label} is an evidence gap. status=${response.status} marker=${markerOk}`);
      }
    } catch (error) {
      rows.push({ repo: target.repo, label: urlConfig.label, status: "error", result: "fail", url: urlConfig.url });
      if (urlConfig.required) {
        fail(`${target.repo} ${urlConfig.label} request failed: ${error.message}`);
      } else {
        warn(`${target.repo} ${urlConfig.label} request failed: ${error.message}`);
      }
    }
  }
}

console.log("\nGenesis Spine Smoke Summary");
console.table(rows);

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("Genesis spine smoke completed with no required URL failures. Evidence gaps may remain.");
