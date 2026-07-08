#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, "public/assets/urai/manifest.json");
const reportPath = path.join(repoRoot, "public/assets/urai/asset-report.json");
const mode = process.argv.includes("--missing") ? "missing" : process.argv.includes("--report") ? "report" : "audit";

function existsPublicPath(publicPath) {
  if (!publicPath) return false;
  const normalized = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
  return fs.existsSync(path.join(repoRoot, "public", normalized.replace(/^assets\//, "assets/")));
}

function fail(message) {
  console.error(`URAI Asset Factory: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(manifestPath)) {
  fail("manifest missing at public/assets/urai/manifest.json");
  process.exit();
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
} catch (error) {
  fail(`manifest JSON invalid: ${error.message}`);
  process.exit();
}

const requiredFields = [
  "asset_id",
  "name",
  "route",
  "category",
  "purpose",
  "format",
  "status",
  "priority",
  "file_path",
  "fallback",
  "needed_for_launch",
  "license",
  "cost",
  "source",
  "notes",
];

const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
const routes = manifest.routes && typeof manifest.routes === "object" ? manifest.routes : {};
const assetIds = new Set(assets.map((asset) => asset.asset_id));
const errors = [];

for (const asset of assets) {
  for (const field of requiredFields) {
    if (!(field in asset)) errors.push(`${asset.asset_id ?? "unknown"}: missing field ${field}`);
  }

  const isLaunchCritical = asset.needed_for_launch === true || asset.priority === "launch-critical";
  if (isLaunchCritical && !asset.file_path && !asset.fallback) {
    errors.push(`${asset.asset_id}: launch-critical asset has no file_path or fallback`);
  }

  if (asset.fallback && !existsPublicPath(asset.fallback)) {
    errors.push(`${asset.asset_id}: fallback does not exist: ${asset.fallback}`);
  }

  if (asset.status === "ready" && !asset.file_path) {
    errors.push(`${asset.asset_id}: ready asset must have file_path`);
  }

  if (asset.status === "ready" && asset.file_path && !existsPublicPath(asset.file_path)) {
    errors.push(`${asset.asset_id}: ready file_path does not exist: ${asset.file_path}`);
  }
}

for (const [route, ids] of Object.entries(routes)) {
  if (!Array.isArray(ids) || ids.length === 0) {
    errors.push(`${route}: route has no mapped assets`);
    continue;
  }
  for (const id of ids) {
    if (!assetIds.has(id)) errors.push(`${route}: mapped unknown asset_id ${id}`);
  }
}

const readyAssets = assets.filter((asset) => asset.status === "ready");
const placeholderAssets = assets.filter((asset) => asset.status === "placeholder");
const missingAssets = assets.filter((asset) => asset.status === "missing" || (!asset.file_path && !asset.fallback));
const launchCriticalMissingAssets = assets.filter((asset) => (asset.needed_for_launch === true || asset.priority === "launch-critical") && (!asset.file_path && !asset.fallback));
const nextAssetsToGenerate = placeholderAssets.filter((asset) => asset.priority === "launch-critical").map((asset) => ({
  asset_id: asset.asset_id,
  name: asset.name,
  route: asset.route,
  category: asset.category,
  recommended_reason: asset.notes,
}));

const report = {
  generated_at: new Date().toISOString(),
  manifest_version: manifest.version,
  total_assets: assets.length,
  ready_assets: readyAssets.length,
  placeholder_assets: placeholderAssets.length,
  missing_assets: missingAssets.length,
  launch_critical_missing_assets: launchCriticalMissingAssets.length,
  errors,
  next_assets_to_generate: nextAssetsToGenerate,
  recommended_spend_order: [
    "1. Core world kit: Home world, Ground terrain, sky dome, portals.",
    "2. Interaction kit: memory stars, hover/tap FX, focus tunnel, particles.",
    "3. Cinematic kit: replay film object, memory chamber, loading world, passport/status room.",
    "4. Polish variants: upgraded materials, biomes, avatars, room props, texture replacements."
  ]
};

if (mode === "report") {
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`URAI Asset Factory report written to ${path.relative(repoRoot, reportPath)}`);
  console.log(JSON.stringify(report, null, 2));
} else if (mode === "missing") {
  console.log(JSON.stringify({ missing_assets: missingAssets, launch_critical_missing_assets: launchCriticalMissingAssets }, null, 2));
} else {
  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    fail(`${errors.length} audit error(s)`);
  } else {
    console.log(`URAI Asset Factory audit passed: ${assets.length} assets, ${placeholderAssets.length} placeholders, ${readyAssets.length} ready, ${Object.keys(routes).length} routes.`);
  }
}
