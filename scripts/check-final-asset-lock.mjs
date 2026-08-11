#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "src/lib/assets/uraiAssetManifest.ts");
const registryPath = join(root, "src/lib/assets/assetRegistry.ts");

const requiredCriticalAssets = {
  skyBackground: "/assets/genesis/sky/sky-background.png",
  bodySilhouetteBase: "/assets/genesis/body/body-silhouette-base.png",
  bodySilhouetteGlow: "/assets/genesis/body/body-silhouette-glow.png",
  auraField: "/assets/genesis/body/aura-field.png",
  orbCore: "/assets/genesis/orb/orb-core.png",
  orbGlow: "/assets/genesis/orb/orb-glow.png",
  groundBase: "/assets/genesis/ground/ground-base.png",
  foregroundVignette: "/assets/genesis/overlays/foreground-vignette.png",
};

const failures = [];

if (!existsSync(manifestPath)) {
  failures.push(`Missing manifest: ${manifestPath}`);
}

if (!existsSync(registryPath)) {
  failures.push(`Missing asset registry: ${registryPath}`);
}

if (failures.length === 0) {
  const manifest = readFileSync(manifestPath, "utf8");
  const registry = readFileSync(registryPath, "utf8");

  for (const [key, expectedPath] of Object.entries(requiredCriticalAssets)) {
    const entryPattern = new RegExp(`${key}:\\s*\\{[^\\n}]*\\}`);
    const entryMatch = manifest.match(entryPattern);

    if (!entryMatch) {
      failures.push(`${key}: manifest entry not found`);
      continue;
    }

    const entry = entryMatch[0];
    const lowerEntry = entry.toLowerCase();

    if (
      entry.includes("TRANSPARENT_PIXEL") ||
      lowerEntry.includes("placeholder") ||
      lowerEntry.includes("fallback-")
    ) {
      failures.push(`${key}: still uses a non-final placeholder/fallback reference`);
    }

    if (!entry.includes(expectedPath)) {
      failures.push(`${key}: expected final runtime path ${expectedPath}`);
    }

    const diskPath = join(root, expectedPath.replace(/^\\//, ""));
    if (!existsSync(diskPath)) {
      failures.push(`${key}: final runtime file missing at ${expectedPath}`);
    }
  }

  if (registry.includes("genesis-orb-placeholder")) {
    failures.push(
      "assetRegistry.ts: images.genesisOrb still references genesis-orb-placeholder.svg",
    );
  }
}

if (failures.length > 0) {
  console.error("URAI FINAL ASSET LOCK: FAIL");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  console.error(
    "Final lock is intentionally blocked until every critical Genesis asset is physically present and wired to its final runtime path.",
  );
  process.exit(1);
}

console.log("URAI FINAL ASSET LOCK: PASS");
console.log("All critical Genesis asset slots use final runtime paths and files exist.");
