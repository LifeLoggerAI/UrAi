#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import crypto from "node:crypto";

const ROOT = process.cwd();
const PUB = p => path.join(ROOT, "public", p);

const LAYERS = [
  {
    layer: "ground",
    manifestPath: PUB("assets/ground/manifests/ground.manifest.json"),
    baseDir: PUB("assets/ground"),
  },
  {
    layer: "sky",
    manifestPath: PUB("assets/sky/manifests/sky.manifest.json"),
    baseDir: PUB("assets/sky"),
  },
];

const CATEGORY_LIST = [
  "neutral", "growth", "fracture", "healing", "cosmic",
  "bloom", "shadow", "energy", "seasonal"
];

const NAME_RE = (layer, category) =>
  new RegExp(`^${layer}-${category}-(\\d{2})([abc])?\\.mp4$`); // e.g., sky-seasonal-20a.mp4

function uniq(arr){ return [...new Set(arr)]; }

async function readJSON(p) {
  try {
    const buf = await fs.readFile(p, "utf8");
    return JSON.parse(buf);
  } catch (e) {
    throw new Error(`Failed to read JSON: ${p}\n${e.message}`);
  }
}

async function listDirFiles(dir) {
  try {
    const names = await fs.readdir(dir);
    return names.filter(n => n.toLowerCase().endsWith(".mp4")).sort();
  } catch (e) {
    return [];
  }
}

async function md5File(fp) {
    const hash = crypto.createHash("md5");
    const data = await fs.readFile(fp);
    hash.update(data);
    return hash.digest("hex");
}

function indexesFromFilenames(layer, category, files) {
  const re = NAME_RE(layer, category);
  const idx = [];
  for (const f of files) {
    const m = f.match(re);
    if (m) idx.push(m[1]);
  }
  return uniq(idx).sort();
}

function findGaps(sortedTwoDigitIdx) {
  const nums = sortedTwoDigitIdx.map(s => Number(s));
  const gaps = [];
  for (let i = 1; i < nums.length; i++) {
    const prev = nums[i - 1];
    const cur = nums[i];
    for (let g = prev + 1; g < cur; g++) gaps.push(String(g).padStart(2, "0"));
  }
  return gaps;
}

async function validateLayer({ layer, manifestPath, baseDir }) {
  const problems = [];
  const manifest = await readJSON(manifestPath);

  if (!manifest.basePath || !manifest.basePath.startsWith(`/assets/${layer}`)) {
    problems.push(`✗ ${layer}: manifest.basePath should start with /assets/${layer} (got "${manifest.basePath}")`);
  }

  for (const category of CATEGORY_LIST) {
    const catDir = path.join(baseDir, category);
    const onDisk = await listDirFiles(catDir);
    const listedObjs = (manifest.categories?.[category] ?? []);
    const listed = listedObjs.map(o => o.file).sort();

    const re = NAME_RE(layer, category);
    const badNames = onDisk.filter(f => !re.test(f));
    if (badNames.length) {
      problems.push(`✗ ${layer}/${category}: ${badNames.length} file(s) have invalid names:\n  - ${badNames.join("\n  - ")}`);
    }

    const missing = listed.filter(f => !onDisk.includes(f));
    if (missing.length) {
      problems.push(`✗ ${layer}/${category}: listed in manifest but not found on disk:\n  - ${missing.join("\n  - ")}`);
    }

    const unlisted = onDisk.filter(f => !listed.includes(f));
    if (unlisted.length) {
      problems.push(`✗ ${layer}/${category}: exist on disk but are not in manifest:\n  - ${unlisted.join("\n  - ")}`);
    }

    for (const obj of listedObjs) {
      const f = obj.file;
      if (!onDisk.includes(f)) continue;
      const full = path.join(baseDir, category, f);
      const onDiskMd5 = await md5File(full);
      if (obj.md5 && obj.md5 !== onDiskMd5) {
        problems.push(`✗ ${layer}/${category}: md5 mismatch for ${f} (manifest=${obj.md5}, disk=${onDiskMd5})`);
      }
      if (typeof obj.width === "number" && typeof obj.height === "number") {
        if (obj.width !== 1440 || obj.height !== 3240) {
          problems.push(`✗ ${layer}/${category}: ${obj.file} is ${obj.width}x${obj.height} (expected 1440x3240)`);
        }
      } else {
        problems.push(`∙ ${layer}/${category}: ${obj.file} has no width/height in manifest (re-run generator?)`);
      }
      if (typeof obj.durationSec === "number") {
        if (obj.durationSec < 6 || obj.durationSec > 16) {
          problems.push(`∙ ${layer}/${category}: duration out of expected loop range for ${obj.file} (${obj.durationSec}s)`);
        }
      }
      if (typeof obj.fps === "number" && Math.round(obj.fps) !== 30) {
        problems.push(`✗ ${layer}/${category}: ${obj.file} is ~${obj.fps.toFixed(2)}fps (expected 30fps)`);
      }
    }

    const idxs = indexesFromFilenames(layer, category, onDisk);
    const gaps = findGaps(idxs);
    if (gaps.length) {
      problems.push(`∙ ${layer}/${category}: index gaps on disk between ${idxs[0] || "—"}..${idxs[idxs.length-1] || "—"} → missing: ${gaps.join(", ")}`);
    }
  }

  return problems;
}

(async () => {
  let allProblems = [];
  for (const l of LAYERS) {
    const p = await validateLayer(l);
    allProblems = allProblems.concat(p);
  }

  if (allProblems.length === 0) {
    console.log("✅ Manifests match file system. Names + layout look good.");
    process.exit(0);
  } else {
    console.log("❗ Validation report:");
    console.log(allProblems.map(s => "- " + s).join("\n"));
    process.exit(1);
  }
})();
