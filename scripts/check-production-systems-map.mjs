import fs from "fs";
import path from "path";

const root = process.cwd();

const requiredFiles = [
  "docs/PRODUCTION_SYSTEMS_COMPLETION_MAP.md",
  "docs/PRODUCTION_SYSTEMS_BACKLOG.md",
  "docs/PRODUCTION_SYSTEMS_RELEASE_GATES.md",
];

const systems = [
  "Full Production Life-Movie Generation",
  "Real AR/VR/XR Memory Worlds",
  "Passive Sensing / Data Marketplace",
  "Autonomous Job System",
  "Full AI Model Council Governance",
  "Real Generated Music-Video Engine",
];

const requiredGatePhrases = [
  "Must not publicly claim yet",
  "Safe Genesis Claims Now",
  "Claims That Must Stay Gated",
  "No system in this file should be promoted to `production-proven` without a dated evidence link.",
];

const forbiddenProofClaims = [
  /full production life[- ]movie generation .*LIVE AND PROVEN/i,
  /real AR\/VR\/XR memory worlds .*LIVE AND PROVEN/i,
  /passive sensing\/data marketplace .*LIVE AND PROVEN/i,
  /autonomous job system .*LIVE AND PROVEN/i,
  /full AI model council governance .*LIVE AND PROVEN/i,
  /real generated music[- ]video engine .*LIVE AND PROVEN/i,
  /full production life movies for every user are live/i,
  /passive sensing is live/i,
  /data marketplace payouts are live/i,
  /autonomous agents acting for users are live/i,
  /real generated music videos for every user are live/i,
];

function fail(message) {
  console.error(`production-systems-map: ${message}`);
  process.exitCode = 1;
}

function readRequired(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail(`missing required file ${relativePath}`);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

const contents = new Map(requiredFiles.map((file) => [file, readRequired(file)]));
const allText = [...contents.values()].join("\n\n");

for (const system of systems) {
  if (!allText.includes(system)) {
    fail(`missing required system section: ${system}`);
  }
}

for (const phrase of requiredGatePhrases) {
  if (!allText.includes(phrase)) {
    fail(`missing required gate phrase: ${phrase}`);
  }
}

for (const pattern of forbiddenProofClaims) {
  if (pattern.test(allText)) {
    fail(`found forbidden unproven production claim: ${pattern}`);
  }
}

const completionMap = contents.get("docs/PRODUCTION_SYSTEMS_COMPLETION_MAP.md") ?? "";
for (const required of [
  "LifeLoggerAI/asset-factory",
  "LifeLoggerAI/urai-admin",
  "LifeLoggerAI/urai-privacy",
  "LifeLoggerAI/urai-analytics",
  "LifeLoggerAI/UrAiProd",
  "LifeLoggerAI/UrAi-Dev",
]) {
  if (!completionMap.includes(required)) {
    fail(`completion map must mention related repo evidence: ${required}`);
  }
}

if (!process.exitCode) {
  console.log("production-systems-map: completion map, backlog, and release gates passed.");
}
