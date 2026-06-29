import { spawnSync } from "node:child_process";

const commands = [
  ["node", ["scripts/verify-routes.mjs"]],
  ["node", ["scripts/verify-assets.mjs"]],
  ["node", ["scripts/verify-privacy-defaults.mjs"]],
  ["node", ["scripts/deployment-evidence-check.mjs"]],
  ["npm", ["run", "smoke:life-map-quest"]],
  ["npm", ["run", "smoke:life-map-quest-proof"]],
  ["npm", ["run", "smoke:life-map-quest-live-proof"]],
  ["npm", ["run", "lint"]],
  ["npm", ["run", "typecheck"]],
  ["npm", ["run", "test"]],
  ["npm", ["run", "build"]],
];

for (const [cmd, args] of commands) {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("\nURAI launch checks completed.");
