#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportPath = path.join(root, "artifacts", "launch", "product-bootstrap-report.json");
const summaryPath = path.join(root, "artifacts", "launch", "product-bootstrap-summary.md");
const problems = [];

if (!fs.existsSync(reportPath)) problems.push(`Missing report: ${path.relative(root, reportPath)}`);
if (!fs.existsSync(summaryPath)) problems.push(`Missing summary: ${path.relative(root, summaryPath)}`);

if (!problems.length) {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  if (report.repo !== "LifeLoggerAI/UrAi") problems.push(`Unexpected repo: ${report.repo}`);
  if (report.kind !== "product-bootstrap") problems.push(`Unexpected evidence kind: ${report.kind}`);
  if (report.status !== "passed") problems.push(`Evidence status is not passed: ${report.status}`);
  if (report.launchScore !== 100) problems.push(`Evidence score is ${report.launchScore}, expected 100.`);
  if (report.failedCount !== 0) problems.push(`Failed command count is ${report.failedCount}, expected 0.`);
  if (!Array.isArray(report.commands) || report.commands.length === 0) problems.push("No command evidence recorded.");
  for (const command of report.commands ?? []) {
    if (command.status !== "passed" || command.exitCode !== 0) {
      problems.push(`Command did not pass: ${command.command}`);
    }
  }
}

if (problems.length) {
  console.error("URAI product launch evidence validation failed:");
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log("URAI product launch evidence is valid.");
