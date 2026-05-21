#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const runCommands = process.env.URAI_P0_RUN_COMMANDS === "1";
const commands = [
  ["npm", ["run", "check:firebase"]],
  ["npm", ["run", "check:lockfile"]],
  ["npm", ["run", "check:v1"]],
  ["npm", ["run", "validate:completion"]],
  ["npm", ["run", "check:types"]],
  ["npm", ["run", "lint"]],
  ["npm", ["run", "test:unit"]],
  ["npm", ["run", "test:rules"]],
  ["npm", ["run", "test:smoke"]],
  ["npm", ["run", "test:e2e"]],
  ["npm", ["run", "build"]],
  ["npm", ["run", "preflight"]]
];

if (!runCommands) {
  console.log("URAI P0 command matrix dry run. Set URAI_P0_RUN_COMMANDS=1 to execute the full launch command matrix.");
  for (const [cmd, args] of commands) console.log(`- ${cmd} ${args.join(" ")}`);
  process.exit(0);
}

for (const [cmd, args] of commands) {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) {
    console.error(`\nURAI P0 command matrix failed at: ${cmd} ${args.join(" ")}`);
    process.exit(result.status ?? 1);
  }
}

console.log("\nURAI P0 command matrix passed.");
