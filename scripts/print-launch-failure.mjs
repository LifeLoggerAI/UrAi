#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "artifacts", "launch", "product-bootstrap-report.json");

if (!fs.existsSync(reportPath)) {
  console.error("No product launch evidence report found.");
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const failed = (report.commands ?? []).find((command) => command.status === "failed" || command.exitCode !== 0);

console.log("URAI product launch evidence snapshot");
console.log(`Status: ${report.status}`);
console.log(`Score: ${report.launchScore}/100`);
console.log(`Passed: ${report.passedCount}`);
console.log(`Failed: ${report.failedCount}`);

if (failed) {
  console.log("");
  console.log("First failing command:");
  console.log(`- ${failed.command}`);
  console.log(`- Exit code: ${failed.exitCode}`);
  console.log(`- Started: ${failed.startedAt}`);
  console.log(`- Finished: ${failed.finishedAt}`);
  process.exit(1);
}

if (report.status !== "passed") {
  console.log("");
  console.log(report.error ?? "Evidence status is not passed, but no failing command was recorded.");
  process.exit(1);
}

console.log("No failing command recorded.");
