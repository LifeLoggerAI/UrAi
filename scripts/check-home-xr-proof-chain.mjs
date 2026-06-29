#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const commands = [
  ["node", ["scripts/check-home-xr-lock.mjs"]],
  ["node", ["scripts/check-home-xr-proof-manifest.mjs"]],
  ["node", ["scripts/check-home-xr-live-deploy-proof.mjs"]],
  ["node", ["scripts/check-home-xr-deploy-workflow.mjs"]],
  ["node", ["scripts/check-home-xr-evidence-index.mjs"]],
  ["node", ["scripts/check-home-xr-completion-summary.mjs"]],
];

let failed = false;

for (const [command, args] of commands) {
  const label = [command, ...args].join(" ");
  console.log(`\n[home-xr-proof-chain] ${label}`);
  const result = spawnSync(command, args, { stdio: "inherit", shell: false });
  if (result.status !== 0) {
    failed = true;
    console.error(`[home-xr-proof-chain] FAILED: ${label}`);
    break;
  }
}

if (failed) {
  console.error("\nHome XR proof chain failed.");
  process.exit(1);
}

console.log("\nHome XR proof chain passed.");
