#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, extname } from "path";

const DRY = process.argv.includes("--dry");
const roots = ["src", "functions"].filter(p => {
  try { return statSync(p).isDirectory(); } catch { return false; }
});

const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"]);
const replacements = [
  { find: /\bdemo[_-\s]?user\b/gi, replace: "currentUser" },
  { find: /DEMO_USER_ID/g,       replace: "CURRENT_USER_ID" },
  { find: /"demo-user"/g,        replace: "\"CURRENT_USER\"" }
];

function walk(dir, files=[]) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) {
      if ([".next","node_modules",".git",".firebase"].includes(entry)) continue;
      walk(p, files);
    } else if (exts.has(extname(p))) {
      files.push(p);
    }
  }
  return files;
}

let changed = 0;
for (const root of roots) {
  for (const file of walk(root)) {
    let text = readFileSync(file, "utf8");
    let out = text;
    replacements.forEach(r => { out = out.replace(r.find, r.replace); });
    if (out !== text) {
      changed++;
      if (!DRY) writeFileSync(file, out, "utf8");
      console.log(`${DRY ? "[dry]" : "[write]"} ${file}`);
    }
  }
}
console.log(`${DRY ? "Dry-run" : "Applied"}; files changed: ${changed}`);