#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import crypto from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const ROOT = process.cwd();
const PUB = p => path.join(ROOT, "public", p);
const execFileAsync = promisify(execFile);

const LAYERS = [
  { layer: "ground", baseDir: PUB("assets/ground"), manifestPath: PUB("assets/ground/manifests/ground.manifest.json") },
  { layer: "sky",    baseDir: PUB("assets/sky"),    manifestPath: PUB("assets/sky/manifests/sky.manifest.json") }
];

const CATEGORY_LIST = [
  "neutral","growth","fracture","healing","cosmic",
  "bloom","shadow","energy","seasonal"
];

async function md5File(fp) {
  const h = crypto.createHash("md5");
  const data = await fs.readFile(fp);
  h.update(data);
  return h.digest("hex");
}

async function probeVideoMeta(fp) {
  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v","error",
      "-select_streams","v:0",
      "-show_entries","stream=width,height,r_frame_rate",
      "-show_entries","format=duration",
      "-of","json",
      fp
    ]);
    const j = JSON.parse(stdout);
    const s = j?.streams?.[0] || {};
    const dur = parseFloat(j?.format?.duration ?? "0");
    const rate = s.r_frame_rate;
    const fps = rate && rate.includes("/") ? (Number(rate.split("/")[0]) / Number(rate.split("/")[1])) : undefined;
    return {
      width: s.width ?? undefined,
      height: s.height ?? undefined,
      durationSec: Number.isFinite(dur) ? Math.round(dur * 1000) / 1000 : undefined,
      fps: fps
    };
  } catch { return { width: undefined, height: undefined, durationSec: undefined, fps: undefined }; }
}

async function buildCategoryEntries(baseDir, category) {
  const dir = path.join(baseDir, category);
  let names = [];
  try {
    names = (await fs.readdir(dir))
      .filter(n => n.toLowerCase().endsWith(".mp4"))
      .sort();
  } catch { /* folder may not exist */ }

  const entries = [];
  for (const name of names) {
    const full = path.join(dir, name);
    const stat = await fs.stat(full);
    const [md5, meta] = await Promise.all([ md5File(full), probeVideoMeta(full) ]);
    entries.push({
      file: name,
      sizeBytes: stat.size,
      md5,
      ...(meta.durationSec !== undefined ? { durationSec: meta.durationSec } : {}),
      ...(meta.width !== undefined ? { width: meta.width } : {}),
      ...(meta.height !== undefined ? { height: meta.height } : {}),
      ...(meta.fps !== undefined ? { fps: meta.fps } : {})
    });
  }
  return entries;
}

async function buildManifest(layer, baseDir) {
  const categories = {};
  for (const cat of CATEGORY_LIST) {
    categories[cat] = await buildCategoryEntries(baseDir, cat);
  }
  return {
    layer,
    basePath: `/assets/${layer}`,
    defaults: { fps: 30, width: 1440, height: 3240 },
    categories
  };
}

(async () => {
  for (const { layer, baseDir, manifestPath } of LAYERS) {
    const manifest = await buildManifest(layer, baseDir);
    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Wrote ${manifestPath}`);
  }
})();
