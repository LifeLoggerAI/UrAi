#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "src/app/xr/page.tsx",
  "src/components/xr/ARModelViewerPreview.tsx",
  "public/assets/ar/urai-genesis-orb.gltf",
  "docs/URAI_GENESIS_AR_AUDIT.md",
];

const missing = requiredFiles.filter((file) => !fs.existsSync(path.resolve(file)));
if (missing.length) {
  console.error("ar-preview: missing required AR preview files:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const xrPage = fs.readFileSync("src/app/xr/page.tsx", "utf8");
const component = fs.readFileSync("src/components/xr/ARModelViewerPreview.tsx", "utf8");
const audit = fs.readFileSync("docs/URAI_GENESIS_AR_AUDIT.md", "utf8");
const model = JSON.parse(fs.readFileSync("public/assets/ar/urai-genesis-orb.gltf", "utf8"));

const checks = [
  [xrPage.includes("ARModelViewerPreview"), "/xr imports ARModelViewerPreview"],
  [component.includes("model-viewer"), "AR component uses model-viewer web component"],
  [component.includes("/assets/ar/urai-genesis-orb.gltf"), "AR component points to public glTF asset"],
  [component.includes('ar-modes=\"webxr scene-viewer\"'), "AR modes are limited to supported WebXR/Scene Viewer paths"],
  [!component.includes("quick-look"), "iOS Quick Look is not claimed without a USDZ asset"],
  [!component.includes(".usdz"), "No USDZ reference exists in runtime component"],
  [xrPage.includes("gated to supported"), "/xr copy keeps AR support-gated"],
  [audit.includes("LIVE DEPLOYMENT STILL EVIDENCE-REQUIRED"), "Audit doc keeps deployment evidence boundary"],
  [model.asset?.version === "2.0", "AR model is valid glTF 2.0 JSON"],
  [Array.isArray(model.meshes) && model.meshes.length > 0, "AR model contains a mesh"],
];

const failed = checks.filter(([ok]) => !ok);
if (failed.length) {
  console.error("ar-preview: verification failed:");
  for (const [, label] of failed) console.error(`- ${label}`);
  process.exit(1);
}

console.log(`ar-preview: verified ${checks.length} AR implementation and claim gates.`);
