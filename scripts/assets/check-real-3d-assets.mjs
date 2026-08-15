import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'public/assets/urai/real-3d');
const JSON_CHUNK = 0x4e4f534a;
const EXPECTED = [
  'urai-human-base-v1.glb',
  'urai-home-world-v1.glb',
  'urai-council-chamber-v1.glb',
  'urai-council-scene-v1.glb',
  'urai-shadow-world-v1.glb',
  'urai-mirror-world-v1.glb',
  'urai-legacy-world-v1.glb',
];

function readContract(bytes) {
  const jsonLength = bytes.readUInt32LE(12);
  const jsonType = bytes.readUInt32LE(16);
  if (jsonType !== JSON_CHUNK) throw new Error('first GLB chunk is not JSON');
  const json = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString('utf8').replace(/[\u0000 ]+$/g, ''));
  const sceneIndex = json.scene ?? 0;
  return json.scenes?.[sceneIndex]?.extras?.uraiWorldContract ?? null;
}

const manifest = JSON.parse(await readFile(join(ROOT, 'asset-manifest.json'), 'utf8'));
const manifestByFile = new Map(manifest.assets.map((asset) => [asset.file, asset]));
const failures = [];

if (manifest.cameraAspect !== '5:4') failures.push(`manifest cameraAspect must be 5:4, got ${manifest.cameraAspect}`);
if (manifest.worldContractsEmbedded !== true) failures.push('manifest must declare worldContractsEmbedded=true');
if (manifest.worldContractVersion !== 1) failures.push(`manifest worldContractVersion must be 1, got ${manifest.worldContractVersion}`);

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

  try {
    const contract = readContract(bytes);
    if (!contract) failures.push(`${filename}: missing embedded uraiWorldContract`);
    else {
      if (contract.contractVersion !== 1) failures.push(`${filename}: contractVersion must be 1`);
      if (contract.units !== 'meters') failures.push(`${filename}: embedded contract units must be meters`);
      if (contract.upAxis !== 'Y') failures.push(`${filename}: embedded contract upAxis must be Y`);
      if (contract.cameraAspect !== '5:4') failures.push(`${filename}: embedded contract cameraAspect must be 5:4`);
      if (contract.kind !== 'human' && !contract.anchors?.cameraSpawn) failures.push(`${filename}: world contract missing cameraSpawn anchor`);
      if (contract.kind !== 'human' && !contract.anchors?.playerSpawn) failures.push(`${filename}: world contract missing playerSpawn anchor`);
    }
  } catch (error) {
    failures.push(`${filename}: unable to parse embedded contract (${error instanceof Error ? error.message : String(error)})`);
  }

  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const record = manifestByFile.get(filename);
  if (!record) failures.push(`${filename}: missing manifest entry`);
  else {
    if (record.sha256 !== sha256) failures.push(`${filename}: manifest SHA256 mismatch`);
    if (record.bytes !== bytes.length) failures.push(`${filename}: manifest byte-size mismatch`);
    if (record.cameraAspect !== '5:4') failures.push(`${filename}: manifest entry cameraAspect is not 5:4`);
    if (record.units !== 'meters') failures.push(`${filename}: manifest entry units are not meters`);
    if (record.worldContractEmbedded !== true) failures.push(`${filename}: manifest entry missing worldContractEmbedded=true`);
    if (record.contractVersion !== 1) failures.push(`${filename}: manifest entry contractVersion must be 1`);
  }
}

const unexpected = [...manifestByFile.keys()].filter((name) => !EXPECTED.includes(name));
if (unexpected.length) failures.push(`manifest contains unexpected runtime GLBs: ${unexpected.join(', ')}`);

if (failures.length) {
  console.error('URAI real-3D asset gate FAILED');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`URAI real-3D asset gate PASS: ${EXPECTED.length} valid glTF 2.0 GLBs, embedded spatial contracts, no placeholders, meter scale, 5:4 metadata.`);
}
