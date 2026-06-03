import { spawnSync } from "node:child_process";

const commands = [
  ["node", ["scripts/verify-routes.mjs"]],
  ["node", ["scripts/verify-assets.mjs"]],
  ["node", ["scripts/verify-privacy-defaults.mjs"]],
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
