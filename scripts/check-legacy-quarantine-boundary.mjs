#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const result = spawnSync(
  process.execPath,
  ["scripts/block-legacy-production-deploy.mjs", "quarantine-boundary-check"],
  { encoding: "utf8" },
);

const output = `${result.stdout || ""}${result.stderr || ""}`;
const required = [
  "[legacy-deploy-blocked] Refusing: quarantine-boundary-check",
  "LifeLoggerAI/urai-spatial/urai-tier1 is the sole authority for urai.app production hosting.",
];

if (result.error || result.status === 0 || required.some((line) => !output.includes(line))) {
  console.error("[legacy-quarantine-check] Expected fail-closed production block was not proven.");
  if (result.error) console.error(result.error.message);
  process.exit(1);
}

console.log("[legacy-quarantine-check] PASS: legacy production authority remains fail-closed.");
