#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const packagePath = path.join(root, "package.json");
const errors = [];
const warnings = [];

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

if (!fs.existsSync(packagePath)) {
  errors.push("No package.json found. Run this from the root of LifeLoggerAI/UrAi.");
} else {
  const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  if (pkg.name !== "urai") {
    errors.push(`This appears to be '${pkg.name}', not the URAI product app. For full V1 launch checks, cd into LifeLoggerAI/UrAi.`);
  }
  for (const script of ["launch:p0", "launch:p0:commands", "check:v1", "test:smoke", "build"]) {
    if (!pkg.scripts?.[script]) errors.push(`Missing package script: ${script}`);
  }
}

if (process.env.NPM_CONFIG_PREFIX) {
  warnings.push(`NPM_CONFIG_PREFIX is set to '${process.env.NPM_CONFIG_PREFIX}'. Run: unset NPM_CONFIG_PREFIX`);
}

if (!exists("src/app/home/page.tsx")) errors.push("Missing src/app/home/page.tsx.");
if (!exists("src/components/urai/UraiHomeLaunchSurface.tsx")) errors.push("Missing HomeWorld launch surface.");
if (!exists("src/lib/home-world.ts")) errors.push("Missing canonical HomeWorld contract.");
if (!exists("package-lock.json")) warnings.push("package-lock.json is missing; run npm install and commit the lockfile before release.");

if (warnings.length) {
  console.warn("URAI repo doctor warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error("URAI repo doctor failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("URAI repo doctor passed. You are in the product app repo and the launch command surface is present.");
console.log("Next commands:");
console.log("  unset NPM_CONFIG_PREFIX");
console.log("  npm install");
console.log("  URAI_P0_RUN_COMMANDS=1 npm run launch:p0:commands");
console.log("  npm run launch:p0");
