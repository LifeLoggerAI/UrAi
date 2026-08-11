import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'public/assets/urai/real-3d');
const EXPECTED = [
  'urai-human-base-v1.glb',
  'urai-home-world-v1.glb',
  'urai-council-chamber-v1.glb',
  'urai-council-scene-v1.glb',
  'urai-shadow-world-v1.glb',
  'urai-mirror-world-v1.glb',
  'urai-legacy-world-v1.glb',
];

const manifest = JSON.parse(await readFile(join(ROOT, 'asset-manifest.json'), 'utf8'));
const manifestByFile = new Map(manifest.assets.map((asset) => [asset.file, asset]));
const failures = [];

if (manifest.cameraAspect !== '5:4') failures.push(`manifest cameraAspect must be 5:4, got ${manifest.cameraAspect}`);

for (const filename of EXPECTED) {
  const path = join(ROOT, filename);
  let bytes;
  try {
    const info = await stat(path);
    if (!info.isFile()) throw new Error('not a file');
    if (info.size < 1024) failures.push(`${filename}: suspiciously small (${info.size} bytes)`);
    bytes = await readFile(path);
  } catch (error) {
    failures.push(`${filename}: missing/unreadable (${error instanceof Error ? error.message : String(error)})`);
    continue;
  }

  const magic = bytes.subarray(0, 4).toString('ascii');
  if (magic !== 'glTF') failures.push(`${filename}: invalid GLB magic ${JSON.stringify(magic)}`);
  if (bytes.includes(Buffer.from('PLACEHOLDER', 'utf8'))) failures.push(`${filename}: contains forbidden PLACEHOLDER marker`);

  const version = bytes.readUInt32LE(4);
  if (version !== 2) failures.push(`${filename}: expected glTF 2 binary, got version ${version}`);

  const declaredLength = bytes.readUInt32LE(8);
  if (declaredLength !== bytes.length) failures.push(`${filename}: GLB header length ${declaredLength} != actual ${bytes.length}`);

  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const record = manifestByFile.get(filename);
  if (!record) failures.push(`${filename}: missing manifest entry`);
  else {
    if (record.sha256 !== sha256) failures.push(`${filename}: manifest SHA256 mismatch`);
    if (record.bytes !== bytes.length) failures.push(`${filename}: manifest byte-size mismatch`);
    if (record.cameraAspect !== '5:4') failures.push(`${filename}: manifest entry cameraAspect is not 5:4`);
    if (record.units !== 'meters') failures.push(`${filename}: manifest entry units are not meters`);
  }
}

const unexpected = [...manifestByFile.keys()].filter((name) => !EXPECTED.includes(name));
if (unexpected.length) failures.push(`manifest contains unexpected runtime GLBs: ${unexpected.join(', ')}`);

if (failures.length) {
  console.error('URAI real-3D asset gate FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`URAI real-3D asset gate PASS: ${EXPECTED.length} valid glTF 2.0 GLBs, no placeholders, meter scale, 5:4 metadata.`);
}
