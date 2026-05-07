import fs from "node:fs";

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

console.log("package-lock.json matches package.json root dependencies.");
