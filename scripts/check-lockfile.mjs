import fs from "node:fs";
import { spawnSync } from "node:child_process";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const lockJson = JSON.parse(fs.readFileSync("package-lock.json", "utf8"));

const rootPackage = lockJson.packages?.[""] ?? {};
const lockDeps = rootPackage.dependencies ?? {};
const lockDevDeps = rootPackage.devDependencies ?? {};

const missing = [];
for (const dep of Object.keys(packageJson.dependencies ?? {})) {
  if (!lockDeps[dep]) missing.push(`dependency ${dep}`);
}
for (const dep of Object.keys(packageJson.devDependencies ?? {})) {
  if (!lockDevDeps[dep]) missing.push(`devDependency ${dep}`);
}

if (missing.length) {
  console.error("package-lock.json is stale. Missing from lockfile root:");
  for (const item of missing) console.error(`- ${item}`);
  console.error("\nRun `npm install` and commit the refreshed package-lock.json.");
  process.exit(1);
}

const npmCi = spawnSync("npm", ["ci", "--dry-run", "--ignore-scripts", "--no-audit", "--no-fund"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});

if (npmCi.error) {
  console.error("Unable to run `npm ci --dry-run` for lockfile validation.");
  console.error(npmCi.error.message);
  process.exit(1);
}

if (npmCi.status !== 0) {
  console.error("package-lock.json is stale or incompatible with package.json.");
  console.error("`npm ci --dry-run --ignore-scripts --no-audit --no-fund` failed.");
  const details = [npmCi.stdout, npmCi.stderr]
    .filter(Boolean)
    .join("\n")
    .trim();
  if (details) {
    console.error("\n--- npm ci dry-run output ---");
    console.error(details);
  }
  console.error("\nRun `npm install` and commit the refreshed package-lock.json.");
  process.exit(npmCi.status || 1);
}

console.log("package-lock.json matches package.json root dependencies and passes npm ci dry-run.");
