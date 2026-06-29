import { spawnSync } from "node:child_process";

const commands = [
  ["node", ["scripts/check-genesis-ar-asset.mjs"]],
  ["node", ["scripts/launch-genesis-xr-ar-full-gate.mjs"]],
];

for (const [cmd, args] of commands) {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("\nComplete Genesis XR/AR gate completed.");
