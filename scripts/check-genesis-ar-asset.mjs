import fs from "node:fs";
import path from "node:path";

const assetPath = path.resolve("public/assets/ar/urai-genesis-orb.gltf");

function fail(message) {
  console.error(`[genesis-ar-asset] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(assetPath)) {
  fail("Missing public/assets/ar/urai-genesis-orb.gltf");
}

let model;
try {
  model = JSON.parse(fs.readFileSync(assetPath, "utf8"));
} catch (error) {
  fail(`Asset is not valid JSON: ${error instanceof Error ? error.message : String(error)}`);
}

if (model.asset?.version !== "2.0") {
  fail("Asset must declare glTF 2.0.");
}

if (!Array.isArray(model.meshes) || model.meshes.length === 0) {
  fail("Asset must contain at least one mesh.");
}

if (!Array.isArray(model.buffers) || model.buffers.length === 0) {
  fail("Asset must contain buffer data.");
}

console.log("[genesis-ar-asset] verified public Genesis AR glTF asset.");
