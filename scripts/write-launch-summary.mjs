#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "artifacts", "launch", "product-bootstrap-report.json");
const summaryPath = path.join(root, "artifacts", "launch", "product-bootstrap-summary.md");

if (!fs.existsSync(reportPath)) {
  console.error(`Missing launch report: ${path.relative(root, reportPath)}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const lines = [
  "# URAI Product Launch Evidence Summary",
  "",
  `- Repository: ${report.repo}`,
  `- Kind: ${report.kind}`,
  `- Status: ${report.status}`,
  `- Launch score: ${report.launchScore}/100`,
  `- Started: ${report.startedAt}`,
  `- Finished: ${report.finishedAt ?? "not finished"}`,
  `- Passed commands: ${report.passedCount}`,
  `- Failed commands: ${report.failedCount}`,
  `- Total commands: ${report.commandCount}`,
  "",
];

if (report.error) {
  lines.push("## Failure", "", report.error, "");
}

if (Array.isArray(report.skipped) && report.skipped.length) {
  lines.push("## Skipped / Adjusted", "");
  for (const skipped of report.skipped) lines.push(`- ${skipped}`);
  lines.push("");
}

lines.push("## Command Results", "", "| Status | Exit | Command |", "| --- | ---: | --- |");
for (const command of report.commands ?? []) {
  lines.push(`| ${command.status} | ${command.exitCode} | \`${command.command}\` |`);
}
lines.push("");

fs.writeFileSync(summaryPath, `${lines.join("\n")}\n`);
console.log(`Launch summary written to ${path.relative(root, summaryPath)}`);
