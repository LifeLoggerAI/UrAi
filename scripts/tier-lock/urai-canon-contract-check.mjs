import fs from 'node:fs';

const system = fs.readFileSync('src/lib/urai-canon/system.ts', 'utf8');
const sourceOfTruth = fs.readFileSync('src/lib/urai-canon/source-of-truth.ts', 'utf8');
const featureFlags = fs.readFileSync('src/lib/urai-canon/feature-flags.ts', 'utf8');

const requiredSystemTokens = [
  'URAI_REQUIRED_ROUTES',
  '/home',
  '/life-map',
  '/life-map/star/[starId]',
  '/focus',
  '/focus/session/[sessionId]',
  '/replay',
  '/replay/[replayId]',
  'URAI_PERMISSION_MATRIX',
  'URAI_CANONICAL_OBJECT_FIELDS',
  'URAI_CANONICAL_SCHEMAS',
  'URAI_AI_OUTPUT_REQUIRED_FIELDS',
  'URAI_ASSET_MANIFEST_FIELDS',
  'URAI_EMPTY_STATE_CANON',
  'URAI_ROUTE_TRANSITIONS',
  'validateCanonicalObject',
  'validateAiOutput',
  'validateAssetManifestEntry',
];

const requiredOwnershipTokens = [
  'route-state-machine',
  'life-map-state-machine',
  'camera-controller',
  'lighting-controller',
  'animation-controller',
  'transition-controller',
  'data-adapter',
  'permission-layer',
  'ai-evidence-layer',
  'analytics-privacy-layer',
  'asset-manifest',
  'feature-flags',
  'assertUraiSourceOfTruthIntegrity',
];

const requiredFlagTokens = [
  'lifeMapTier1: true',
  'lifeMapTier2: true',
  'lifeMapTier3: true',
  'lifeMapTier4: true',
  'lifeMapTier5: false',
  'constellationGrouping: true',
  'replayJourneys: true',
  'artifacts: true',
  'assertUraiFeatureFlagIntegrity',
];

const failures = [];

for (const token of requiredSystemTokens) {
  if (!system.includes(token)) failures.push(`system.ts missing ${token}`);
}

for (const token of requiredOwnershipTokens) {
  if (!sourceOfTruth.includes(token)) failures.push(`source-of-truth.ts missing ${token}`);
}

for (const token of requiredFlagTokens) {
  if (!featureFlags.includes(token)) failures.push(`feature-flags.ts missing ${token}`);
}

if (!system.includes('"no-fake-memories"') || !system.includes('"no-fake-ai-claims"')) {
  failures.push('empty-state canon must prohibit fake memory and fake AI claims');
}

if (!system.includes('"sensitive"') || !system.includes('"vaulted"') || !system.includes('"deleted"')) {
  failures.push('permission matrix must include protected lifecycle states');
}

if (failures.length) {
  console.error('URAI canon contract check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('URAI canon contract check passed.');
