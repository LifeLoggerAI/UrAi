#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join } from "path";
const roots = ["src"];
function walk(d, out=[]) {
  for (const e of readdirSync(d)) {
    const p = join(d, e), s = statSync(p);
    if (s.isDirectory()) { if (![".next","node_modules"].includes(e)) walk(p,out); }
    else if (/\.(t|j)sx?$/.test(p)) out.push(p);
  }
  return out;
}
for (const f of walk("src")) {
  const before = readFileSync(f,"utf8");
  const after = before
    .replace(/console\.log\([^;]*\);?\n?/g, "")
    .replace(/console\.info\([^;]*\);?\n?/g, "");
  if (after !== before) { writeFileSync(f, after, "utf8"); console.log("[clean]", f); }
}