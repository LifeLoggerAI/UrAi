#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const conflictPattern = /^(<<<<<<<|=======|>>>>>>>)(?:\s|$)/m;
const ignoredDirectories = new Set([
  ".git",
  ".next",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "tmp"
]);
const ignoredFiles = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock"
]);
const textExtensions = new Set([
  ".cjs",
  ".css",
  ".env",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".rules",
  ".scss",
  ".sh",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".yaml",
  ".yml"
]);

const failures = [];

function shouldInspect(filePath) {
  const basename = path.basename(filePath);
  if (ignoredFiles.has(basename)) return false;
  const extension = path.extname(filePath);
  if (textExtensions.has(extension)) return true;
  return basename.startsWith(".") && !basename.includes(".");
}

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.relative(root, absolutePath);

    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) continue;
      walk(absolutePath);
      continue;
    }

    if (!entry.isFile() || !shouldInspect(absolutePath)) continue;

    const content = fs.readFileSync(absolutePath, "utf8");
    if (!conflictPattern.test(content)) continue;

    const lines = content.split(/\r?\n/);
    const markers = [];
    lines.forEach((line, index) => {
      if (/^(<<<<<<<|=======|>>>>>>>)(?:\s|$)/.test(line)) {
        markers.push(`${relativePath}:${index + 1}: ${line}`);
      }
    });
    failures.push(...markers);
  }
}

walk(root);

if (failures.length > 0) {
  console.error("Merge conflict markers were found. Resolve these before running typecheck/build:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("No merge conflict markers found.");
