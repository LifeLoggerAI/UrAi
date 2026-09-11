import fs from "node:fs";
import path from "node:path";

// Legacy repository quarantine: this command remains available only to prove the
// CSV export shape with synthetic data. It must not read provider/customer data.
const outputDir = path.join(process.cwd(), "tmp");
const outputPath = path.join(outputDir, "waitlist-export.csv");

function csvEscape(value) {
  if (value === undefined || value === null) return "";
  const text = String(value);
  if (!/[",\n]/.test(text)) return text;
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows) {
  const headers = ["email", "source", "handle", "intent", "status", "createdAt", "updatedAt", "lastSource", "lastHandle", "lastIntent"];
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
}

const now = new Date().toISOString();
const rows = [
  {
    email: "sample@example.com",
    source: "legacy-quarantine-dry-run",
    handle: "sample",
    intent: "shape-validation",
    status: "synthetic",
    createdAt: now,
    updatedAt: now,
  },
];

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, toCsv(rows));
console.log(`Legacy quarantine: wrote ${rows.length} synthetic waitlist row to ${outputPath}. No provider data was read.`);
