import { spawnSync } from "node:child_process";

const commands = [
  ["npm", ["run", "check:ar-preview"]],
  ["npm", ["run", "verify:assets"]],
  ["npm", ["run", "check:public-copy"]],
  ["npm", ["run", "check:production-claims"]],
  ["npm", ["run", "deploy:evidence"]],
];

for (const [cmd, args] of commands) {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("\nGenesis XR/AR launch gate completed.");
