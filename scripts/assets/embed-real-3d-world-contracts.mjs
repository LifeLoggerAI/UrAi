import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT = join(process.cwd(), 'public/assets/urai/real-3d');
const JSON_CHUNK = 0x4e4f534a;

const contracts = {
  'urai-human-base-v1.glb': {
    contractVersion: 1,
    kind: 'human',
    units: 'meters',
    upAxis: 'Y',
    cameraAspect: '5:4',
    nominalHeightMeters: 1.82,
    semanticNodes: {
      hips: 'urai-human-hips',
      chest: 'urai-human-chest',
      head: 'urai-human-head-rig',
      leftHand: 'urai-human-hand-left',
      rightHand: 'urai-human-hand-right',
    },
    replacementTarget: 'scan-grade-rigged-human-with-facial-blendshapes',
  },
  'urai-home-world-v1.glb': {
    contractVersion: 1,
    kind: 'world',
    realm: 'Home/Ground',
    units: 'meters',
    upAxis: 'Y',
    cameraAspect: '5:4',
    walkable: { surfaceNode: 'home-terrain', radiusMeters: 12.5, maxSlopeDegrees: 34 },
    exclusions: [{ node: 'home-pond', type: 'water' }],
    anchors: {
      cameraSpawn: { position: [0, 1.62, 7.4], target: [0, 1.15, 0] },
      playerSpawn: { position: [0, 0.18, 6.4], yawRadians: 3.141593 },
      orb: { position: [-1.2, 1.15, 4.6] },
      lifeMapPortal: { position: [0, 0.3, -8.0], yawRadians: 0 },
      councilPortal: { position: [4.2, 0.25, -5.4], yawRadians: -0.65 },
      return: { position: [0, 0.2, 6.8] },
    },
  },
  'urai-council-chamber-v1.glb': {
    contractVersion: 1,
    kind: 'world',
    realm: 'Council',
    units: 'meters',
    upAxis: 'Y',
    cameraAspect: '5:4',
    walkable: { surfaceNode: 'council-floor', radiusMeters: 5.8, maxSlopeDegrees: 4 },
    collisionNodes: ['council-table-top', 'council-table-base', 'council-back-wall', 'council-wall-left', 'council-wall-right'],
    anchors: {
      cameraSpawn: { position: [0, 1.66, 7.35], target: [0, 1.2, -1.0] },
      playerSpawn: { position: [0, 0.12, 5.9], yawRadians: 3.141593 },
      table: { position: [0, 0.76, -0.6] },
      exit: { position: [0, 0.15, 6.25], yawRadians: 0 },
    },
  },
  'urai-council-scene-v1.glb': {
    contractVersion: 1,
    kind: 'world-with-humans',
    realm: 'Council',
    units: 'meters',
    upAxis: 'Y',
    cameraAspect: '5:4',
    walkable: { surfaceNode: 'council-floor', radiusMeters: 5.8, maxSlopeDegrees: 4 },
    anchors: {
      cameraSpawn: { position: [0, 1.66, 7.35], target: [0, 1.2, -1.0] },
      playerSpawn: { position: [0, 0.12, 5.9], yawRadians: 3.141593 },
      exit: { position: [0, 0.15, 6.25], yawRadians: 0 },
    },
    councilRoleNodes: ['council-guide-root', 'council-mirror-root', 'council-guardian-root', 'council-archivist-root', 'council-builder-root', 'council-trickster-root'],
  },
  'urai-shadow-world-v1.glb': {
    contractVersion: 1,
    kind: 'world',
    realm: 'Shadow',
    units: 'meters',
    upAxis: 'Y',
    cameraAspect: '5:4',
    walkable: { pathNodePrefix: 'shadow-path-', widthMeters: 1.05 },
    interactionNodePrefix: 'shadow-glass-',
    anchors: {
      cameraSpawn: { position: [0, 1.6, 7.4], target: [0, 1.25, -4.5] },
      playerSpawn: { position: [0, 0.12, 5.7], yawRadians: 3.141593 },
      reflectionBasin: { position: [0, 0.25, -5.2] },
      exit: { position: [0, 0.15, 6.0], yawRadians: 0 },
    },
    governance: 'Passport/consent/reflection logic remains external and authoritative',
  },
  'urai-mirror-world-v1.glb': {
    contractVersion: 1,
    kind: 'world',
    realm: 'Mirror',
    units: 'meters',
    upAxis: 'Y',
    cameraAspect: '5:4',
    walkable: { pathNodePrefix: 'mirror-path-', widthMeters: 1.35 },
    interactionNodes: ['mirror-surface', 'mirror-side-panel--4.65', 'mirror-side-panel-4.65'],
    anchors: {
      cameraSpawn: { position: [0, 1.62, 7.3], target: [0, 1.8, -7.4] },
      playerSpawn: { position: [0, 0.12, 5.8], yawRadians: 3.141593 },
      primaryMirror: { position: [0, 1.75, -8.6] },
      exit: { position: [0, 0.15, 6.1], yawRadians: 0 },
    },
    governance: 'Mirror provider remains authoritative for reflection claims and permissions',
  },
  'urai-legacy-world-v1.glb': {
    contractVersion: 1,
    kind: 'world',
    realm: 'Legacy',
    units: 'meters',
    upAxis: 'Y',
    cameraAspect: '5:4',
    walkable: { boundsMeters: { x: [-5.7, 5.7], z: [-9.5, 5.5] }, maxSlopeDegrees: 2 },
    interactionNodePrefixes: ['legacy-shelf-', 'legacy-memory-surface-'],
    anchors: {
      cameraSpawn: { position: [0, 1.65, 7.8], target: [0, 1.45, -4.8] },
      playerSpawn: { position: [0, 0.12, 5.5], yawRadians: 3.141593 },
      readingTable: { position: [0, 0.8, -1.8] },
      archiveWall: { position: [0, 2.5, -10.4] },
      exit: { position: [0, 0.15, 5.9], yawRadians: 0 },
    },
    governance: 'Legacy consent and user approval remain external and authoritative',
  },
};

function injectSceneExtras(buffer, contract) {
  if (buffer.subarray(0, 4).toString('ascii') !== 'glTF') throw new Error('not a GLB');
  if (buffer.readUInt32LE(4) !== 2) throw new Error('not glTF 2.0');
  const jsonLength = buffer.readUInt32LE(12);
  const jsonType = buffer.readUInt32LE(16);
  if (jsonType !== JSON_CHUNK) throw new Error('first GLB chunk is not JSON');
  const jsonStart = 20;
  const jsonEnd = jsonStart + jsonLength;
  const document = JSON.parse(buffer.subarray(jsonStart, jsonEnd).toString('utf8').replace(/[\u0000 ]+$/g, ''));
  const sceneIndex = document.scene ?? 0;
  if (!document.scenes?.[sceneIndex]) throw new Error('GLB has no default scene');
  document.scenes[sceneIndex].extras = {
    ...(document.scenes[sceneIndex].extras ?? {}),
    uraiWorldContract: contract,
  };
  document.asset = document.asset ?? { version: '2.0' };
  document.asset.generator = `${document.asset.generator ?? 'Three.js GLTFExporter'} + URAI world-contract embedder`;

  const jsonBytes = Buffer.from(JSON.stringify(document), 'utf8');
  const paddedLength = Math.ceil(jsonBytes.length / 4) * 4;
  const paddedJson = Buffer.alloc(paddedLength, 0x20);
  jsonBytes.copy(paddedJson);
  const tail = buffer.subarray(jsonEnd);
  const output = Buffer.alloc(20 + paddedLength + tail.length);
  output.write('glTF', 0, 4, 'ascii');
  output.writeUInt32LE(2, 4);
  output.writeUInt32LE(output.length, 8);
  output.writeUInt32LE(paddedLength, 12);
  output.writeUInt32LE(JSON_CHUNK, 16);
  paddedJson.copy(output, 20);
  tail.copy(output, 20 + paddedLength);
  return output;
}

for (const [filename, contract] of Object.entries(contracts)) {
  const path = join(ROOT, filename);
  const before = await readFile(path);
  const after = injectSceneExtras(before, contract);
  await writeFile(path, after);
  console.log(`Embedded URAI world contract: ${filename} (${after.length} bytes)`);
}
