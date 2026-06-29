#!/usr/bin/env node

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || process.env.URAI_LIVE_BASE_URL || "https://urai-4dc1d.web.app";
const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

const routes = [
  "/xr",
  "/assets/ar/urai-genesis-orb.gltf",
];

function fail(message) {
  console.error(`[genesis-xr-ar-live] ${message}`);
  process.exit(1);
}

async function fetchText(pathname) {
  const url = `${normalizedBaseUrl}${pathname}`;
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) fail(`${url} returned HTTP ${response.status}`);
  return response.text();
}

for (const route of routes) {
  const url = `${normalizedBaseUrl}${route}`;
  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) fail(`${url} returned HTTP ${response.status}`);
  console.log(`[genesis-xr-ar-live] ${response.status} ${url}`);
}

const xrHtml = await fetchText("/xr");
const requiredCopy = [
  "Real WebXR gate",
  "AR gated to supported mobile paths",
  "Real model-based AR entry, no fake canvas button",
  "/assets/ar/urai-genesis-orb.gltf",
  "webxr scene-viewer",
];

for (const copy of requiredCopy) {
  if (!xrHtml.includes(copy)) fail(`/xr is missing expected copy or markup: ${copy}`);
}

const forbiddenCopy = [
  "Universal AR",
  "AR ready",
  "Quest ready",
  "quick-look",
];

for (const copy of forbiddenCopy) {
  if (xrHtml.toLowerCase().includes(copy.toLowerCase())) fail(`/xr contains forbidden unsupported claim: ${copy}`);
}

const model = JSON.parse(await fetchText("/assets/ar/urai-genesis-orb.gltf"));
if (model.asset?.version !== "2.0") fail("AR asset is not glTF 2.0.");
if (!Array.isArray(model.meshes) || model.meshes.length === 0) fail("AR asset does not contain a mesh.");

console.log(`[genesis-xr-ar-live] verified ${normalizedBaseUrl}/xr and AR asset.`);
