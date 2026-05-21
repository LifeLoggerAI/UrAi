#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pkgPath = path.join(root, "package.json");
const env = { ...process.env };
delete env.NPM_CONFIG_PREFIX;
delete env.npm_config_prefix;

defaultRun();

function defaultRun() {
  const problems = [];
  if (!fs.existsSync(pkgPath)) problems.push("No package.json found. This must run from the LifeLoggerAI/UrAi repo root.");
  const pkg = fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, "utf8")) : null;
  if (pkg && pkg.name !== "urai") problems.push(`Wrong repo: found package '${pkg.name}'. This bootstrap is for LifeLoggerAI/UrAi.`);

  if (problems.length) {
    console.error("URAI launch bootstrap cannot continue:");
    for (const problem of problems) console.error(`- ${problem}`);
    process.exit(1);
  }

  const commands = [
    ["npm", ["install"]],
    ["npm", ["run", "doctor"]],
    ["npm", ["run", "check:v1"]],
    ["npm", ["run", "check:lockfile"]],
    ["npm", ["run", "check:firebase"]],
    ["npm", ["run", "validate:completion"]],
    ["npm", ["run", "check:types"]],
    ["npm", ["run", "lint"]],
    ["npm", ["run", "test:unit"]],
    ["npm", ["run", "test:rules"]],
    ["npm", ["run", "build"]],
    ["npm", ["run", "launch:p0"]]
  ];

  if (process.env.URAI_SKIP_E2E !== "1") {
    commands.splice(commands.length - 1, 0, ["npm", ["run", "test:smoke"]]);
  }

  for (const [cmd, args] of commands) {
    console.log(`\n$ ${cmd} ${args.join(" ")}`);
    const result = spawnSync(cmd, args, { cwd: root, stdio: "inherit", env, shell: process.platform === "win32" });
    if (result.status !== 0) {
      console.error(`\nURAI launch bootstrap failed at: ${cmd} ${args.join(" ")}`);
      process.exit(result.status ?? 1);
    }
  }

  console.log("\nURAI launch bootstrap completed successfully.");
}
