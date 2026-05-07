#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const reportsDir = join(root, 'release-verification');
mkdirSync(reportsDir, { recursive: true });

const requiredReports = [
  'SYSTEM_AUDIT.md',
  'SYSTEM_OF_SYSTEMS.md',
  'REPO_MAP.md',
  'SYSTEM_GRAPH.md',
  'TODO_SYSTEMS.md',
  'RISK_REGISTER.md',
  'LOCK.md',
  'FINAL_SYSTEM_REPORT.md',
  'E2E_TEST_REPORT.md',
  'DEPLOYMENT_REPORT.md',
  'RELEASE_NOTES.md',
  'KNOWN_LIMITATIONS.md',
  'NEXT_ACTIONS.md',
];

const canonicalRoutes = [
  '/',
  '/app',
  '/app/home',
  '/app/mirror',
  '/app/life-map',
  '/app/star/[id]',
  '/app/forecast',
  '/app/council',
  '/app/rituals',
  '/app/scrolls',
  '/app/story',
  '/app/exports',
  '/app/relationships',
  '/app/dashboard',
  '/app/marketplace',
  '/app/settings',
  '/admin',
  '/admin/system',
  '/admin/users',
  '/admin/flags',
  '/admin/audits',
  '/admin/marketplace',
  '/admin/exports',
];

const firebaseFunctions = [
  'health',
  'ingestEvent',
  'enrichEvent',
  'generateDailyInsights',
  'generateWeeklyRecap',
  'generateMoodForecast',
  'generateLifeMapStar',
  'generateConstellation',
  'generateRitualSuggestion',
  'completeRitual',
  'requestExport',
  'processExportJob',
  'storyAssemble',
  'ttsRender',
  'purchaseWebhook',
  'syncEntitlements',
  'deleteUserData',
  'exportUserData',
  'rollupDailyMetrics',
  'cleanupExpiredExports',
  'systemStatusCheck',
];

const firestoreDomains = [
  'users', 'events', 'eventEnrichments', 'memoryShards', 'insights', 'forecasts', 'moodWeather',
  'lifeMapEvents', 'constellations', 'rituals', 'scrolls', 'storyScripts', 'exports', 'relationships',
  'socialGraph', 'shadowMetrics', 'obscuraSignals', 'mentalLoadScores', 'councilSessions',
  'narratorMessages', 'marketplaceItems', 'entitlements', 'transactions', 'auditLogs', 'systemStatus',
  'incidents', 'consents', 'dataRequests', 'featureFlags', 'adminUsers',
];

const requiredScripts = ['lint', 'check:types', 'test', 'test:unit', 'test:integration', 'test:e2e', 'test:rules', 'test:smoke', 'build'];
const checks = [];

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (['node_modules', '.git', '.next', 'dist', 'build', 'coverage', 'release-verification'].includes(entry)) continue;
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const ignoredEvidencePaths = new Set([
  'scripts/independent-release-verifier.mjs',
  'docs/INDEPENDENT_RELEASE_VERIFIER.md',
  '.github/workflows/independent-release-verifier.yml',
]);

function rel(path) { return relative(root, path); }
function isVerifierEvidence(file) { return ignoredEvidencePaths.has(rel(file)); }

const files = walk(root);
const textFiles = files.filter((file) => /\.(ts|tsx|js|jsx|mjs|cjs|json|md|rules|yml|yaml)$/.test(file));
const corpus = textFiles
  .filter((file) => !isVerifierEvidence(file))
  .map((file) => {
    try { return { file, text: readFileSync(file, 'utf8') }; } catch { return { file, text: '' }; }
  });

function add(name, status, evidence = '', remediation = '') {
  checks.push({ name, status, evidence, remediation });
}

function hasFile(path) { return existsSync(join(root, path)); }
function findText(pattern) { return corpus.filter(({ text }) => pattern.test(text)).map(({ file }) => relative(root, file)); }

for (const report of requiredReports) {
  add(`Required report exists: ${report}`, hasFile(report) || hasFile(`docs/${report}`) ? 'pass' : 'fail', hasFile(report) ? report : hasFile(`docs/${report}`) ? `docs/${report}` : '', `Create or update ${report}.`);
}

let packageJson = null;
if (hasFile('package.json')) {
  packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  for (const script of requiredScripts) {
    add(`package.json script exists: ${script}`, packageJson.scripts?.[script] ? 'pass' : 'fail', packageJson.scripts?.[script] || '', `Add npm script '${script}'.`);
  }
} else {
  add('package.json exists', 'fail', '', 'Create package.json or run verifier from app root.');
}

for (const route of canonicalRoutes) {
  const candidates = route === '/'
    ? ['src/app/page.tsx', 'app/page.tsx', 'pages/index.tsx']
    : [
        `src/app${route.replace(/:id/g, '[id]')}/page.tsx`,
        `app${route.replace(/:id/g, '[id]')}/page.tsx`,
        `pages${route.replace(/:id/g, '[id]')}.tsx`,
      ];
  add(`Canonical route implemented: ${route}`, candidates.some(hasFile) ? 'pass' : 'fail', candidates.find(hasFile) || '', `Add a real route for ${route} or document blocker.`);
}

for (const fn of firebaseFunctions) {
  const refs = findText(new RegExp(`\\b${fn}\\b`));
  add(`Firebase function present/referenceable: ${fn}`, refs.length ? 'pass' : 'fail', refs.slice(0, 5).join(', '), `Implement/export Cloud Function '${fn}' or document why it is blocked.`);
}

add('Firestore rules file exists', hasFile('firestore.rules') ? 'pass' : 'fail', hasFile('firestore.rules') ? 'firestore.rules' : '', 'Add firestore.rules.');
add('Storage rules file exists', hasFile('storage.rules') ? 'pass' : 'fail', hasFile('storage.rules') ? 'storage.rules' : '', 'Add storage.rules.');

if (hasFile('firestore.rules')) {
  const rules = readFileSync(join(root, 'firestore.rules'), 'utf8');
  add('Firestore rules include deny-by-default fallback', /match\s+\/\{document=\*\*\}|allow\s+read,\s*write:\s*if\s*false|allow\s+read,\s*write:\s*if\s+false/.test(rules) ? 'pass' : 'fail', 'firestore.rules', 'Add final match /{document=**} deny rule.');
}
if (hasFile('storage.rules')) {
  const rules = readFileSync(join(root, 'storage.rules'), 'utf8');
  add('Storage rules include deny-by-default fallback', /match\s+\/\{allPaths=\*\*\}|allow\s+read,\s*write:\s*if\s*false|allow\s+read,\s*write:\s*if\s+false/.test(rules) ? 'pass' : 'fail', 'storage.rules', 'Add final match /{allPaths=**} deny rule.');
}

for (const domain of firestoreDomains) {
  const typeRefs = findText(new RegExp(`\\b${domain}\\b|${domain.slice(0, -1)}Schema|${domain}Schema`, 'i'));
  add(`Firestore domain has code coverage: ${domain}`, typeRefs.length ? 'pass' : 'fail', typeRefs.slice(0, 6).join(', '), `Add type, schema, path helper, rules coverage, and seed data for ${domain}.`);
}

const flags = ['lifeMap.enabled','council.enabled','storyMode.enabled','marketplace.enabled','exports.enabled','relationshipInsights.enabled','mentalLoad.enabled','obscura.enabled','shadowMetrics.enabled','xr.enabled','proDashboard.enabled','demoMode.enabled'];
for (const flag of flags) {
  const refs = findText(new RegExp(flag.replace('.', '\\.'), 'i'));
  add(`Feature flag configured: ${flag}`, refs.length ? 'pass' : 'fail', refs.slice(0, 5).join(', '), `Add and enforce feature flag ${flag}.`);
}

const consents = ['audioProcessing','locationContext','relationshipInsights','healthWellnessInsights','marketplacePersonalization','exportGeneration','anonymizedPatternLicensing','pushNotifications','emailRecaps'];
for (const consent of consents) {
  const refs = findText(new RegExp(consent, 'i'));
  add(`Consent gate configured: ${consent}`, refs.length ? 'pass' : 'fail', refs.slice(0, 5).join(', '), `Add consent field and processing guard for ${consent}.`);
}

const seedRefs = files.filter((file) => !isVerifierEvidence(file) && /seed|demo|staging/i.test(file)).map(rel);
add('Deterministic demo/staging seed scripts exist', seedRefs.length ? 'pass' : 'fail', seedRefs.slice(0, 12).join(', '), 'Add scripts/seed.ts, scripts/seed_staging.ts, and scripts/reset_demo.ts.');

const e2eRefs = files.filter((file) => !isVerifierEvidence(file) && /e2e|playwright|smoke/i.test(file)).map(rel);
add('E2E/smoke tests exist', e2eRefs.length ? 'pass' : 'fail', e2eRefs.slice(0, 12).join(', '), 'Add Playwright E2E tests for the core user journey.');

const lockText = hasFile('LOCK.md') ? readFileSync(join(root, 'LOCK.md'), 'utf8') : '';
if (lockText) {
  for (const token of ['commit', 'Firebase', 'Node', 'test', 'build', 'deploy', 'staging', 'production']) {
    add(`LOCK.md includes ${token}`, new RegExp(token, 'i').test(lockText) ? 'pass' : 'fail', 'LOCK.md', `Update LOCK.md with ${token} status.`);
  }
}

const commands = [];
if (packageJson?.scripts) {
  for (const script of requiredScripts) {
    if (packageJson.scripts[script]) commands.push(`npm run ${script}`);
  }
}
for (const command of commands) {
  if (process.env.URAI_VERIFIER_RUN_COMMANDS === '1') {
    const [bin, ...args] = command.split(' ');
    const result = spawnSync(bin, args, { cwd: root, encoding: 'utf8', stdio: 'pipe' });
    add(`Command passes: ${command}`, result.status === 0 ? 'pass' : 'fail', `${result.stdout}\n${result.stderr}`.slice(-2000), `Fix failing command: ${command}`);
  } else {
    add(`Command declared, not executed in static mode: ${command}`, 'unverified', command, `Run URAI_VERIFIER_RUN_COMMANDS=1 npm run verify:release to execute ${command}.`);
  }
}

const failed = checks.filter((c) => c.status === 'fail');
const unverified = checks.filter((c) => c.status === 'unverified');
const passed = checks.filter((c) => c.status === 'pass');
const productionReady = failed.length === 0 && unverified.length === 0;
const stagingReady = failed.length === 0 && unverified.length <= commands.length;
const verdict = productionReady ? 'PRODUCTION READY' : stagingReady ? 'STAGING READY ONLY' : 'NOT READY — BLOCKERS REMAIN';

function section(title, rows) {
  if (!rows.length) return `## ${title}\n\nNone.\n`;
  return `## ${title}\n\n` + rows.map((c) => `- **${c.name}**\n  - Evidence: ${c.evidence || 'None'}\n  - Remediation: ${c.remediation || 'None'}`).join('\n') + '\n';
}

const md = `# URAI Independent Release Verification Report\n\nGenerated: ${new Date().toISOString()}\n\nFinal verdict: **${verdict}**\n\nSummary:\n\n- Passed: ${passed.length}\n- Failed: ${failed.length}\n- Unverified: ${unverified.length}\n\n${section('VERIFIED PASS ITEMS', passed)}\n${section('FAILED OR UNVERIFIED CLAIMS', [...failed, ...unverified])}\n${section('BLOCKERS TO STAGING', failed)}\n${section('BLOCKERS TO PRODUCTION', [...failed, ...unverified])}\n## SECURITY / PRIVACY RISKS\n\nReview all failed Firestore, Storage, feature flag, consent, admin, data export, and deletion checks above.\n\n## BROKEN USER JOURNEYS\n\nAny failed canonical route or E2E check means the core journey is not verified.\n\n## BROKEN DEVELOPER WORKFLOWS\n\nAny missing or failed package script blocks the release workflow.\n\n${section('EXACT PATCH LIST REQUIRED', failed)}\n## EXACT COMMANDS TO RE-RUN\n\n\`\`\`bash\nnpm run verify:release\nURAI_VERIFIER_RUN_COMMANDS=1 npm run verify:release\n\`\`\`\n\n## FINAL VERDICT\n\n${verdict}\n`;

writeFileSync(join(reportsDir, 'INDEPENDENT_RELEASE_VERIFICATION.md'), md);
console.log(md);

if (verdict === 'NOT READY — BLOCKERS REMAIN') {
  process.exitCode = 1;
}
