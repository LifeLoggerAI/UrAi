#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const strict = process.argv.includes('--strict');
const outDir = path.join(root, 'tmp');
const outPath = path.join(outDir, 'tier-freeze-ledger.md');

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  return exists(file) ? fs.readFileSync(path.join(root, file), 'utf8') : '';
}

function pkgScripts() {
  try {
    return JSON.parse(read('package.json')).scripts || {};
  } catch {
    return {};
  }
}

const scripts = pkgScripts();

const checks = [
  {
    tier: 'Tier-1',
    item: 'Public home route',
    status: exists('src/app/page.tsx') ? 'Completed but not verified' : 'Blocked',
    evidence: 'src/app/page.tsx',
    blocksTier1: !exists('src/app/page.tsx'),
    blocksTier2: true,
    next: exists('src/app/page.tsx') ? 'Run route smoke tests and capture desktop/mobile proof.' : 'Restore the public home route.',
  },
  {
    tier: 'Tier-1',
    item: 'Public constellation route',
    status: exists('src/app/u/[handle]/page.tsx') || exists('src/app/u/adamclamp/page.tsx') ? 'Completed but not verified' : 'Blocked',
    evidence: 'src/app/u/[handle]/page.tsx or src/app/u/adamclamp/page.tsx',
    blocksTier1: !(exists('src/app/u/[handle]/page.tsx') || exists('src/app/u/adamclamp/page.tsx')),
    blocksTier2: true,
    next: 'Run Playwright smoke coverage for /u/adamclamp.',
  },
  {
    tier: 'Tier-1',
    item: 'Companion API route',
    status: exists('src/app/api/companion/route.ts') ? 'Completed but not verified' : 'Blocked',
    evidence: 'src/app/api/companion/route.ts',
    blocksTier1: !exists('src/app/api/companion/route.ts'),
    blocksTier2: true,
    next: 'Verify valid prompt and empty prompt guard with smoke/API tests.',
  },
  {
    tier: 'Tier-1',
    item: 'Waitlist API route',
    status: exists('src/app/api/waitlist/route.ts') ? 'Completed but not verified' : 'Blocked',
    evidence: 'src/app/api/waitlist/route.ts',
    blocksTier1: !exists('src/app/api/waitlist/route.ts'),
    blocksTier2: true,
    next: 'Verify dry-run and configured Firestore persistence paths.',
  },
  {
    tier: 'Tier-1',
    item: 'Firestore rules and indexes',
    status: exists('firestore.rules') && exists('firestore.indexes.json') ? 'Completed but not verified' : 'Blocked',
    evidence: 'firestore.rules, firestore.indexes.json, tests/rules/firestore.rules.test.js',
    blocksTier1: !(exists('firestore.rules') && exists('firestore.indexes.json')),
    blocksTier2: true,
    next: 'Run npm run test:rules and deploy rules/indexes to staging before public freeze.',
  },
  {
    tier: 'Tier-1',
    item: 'Firebase client configuration boundary',
    status: exists('src/lib/firebase.ts') ? 'Completed but not verified' : 'Blocked',
    evidence: 'src/lib/firebase.ts',
    blocksTier1: !exists('src/lib/firebase.ts'),
    blocksTier2: true,
    next: 'Run build/smoke with real NEXT_PUBLIC_FIREBASE_* values before claiming live Firebase readiness.',
  },
  {
    tier: 'Tier-1',
    item: 'V1 launch gates',
    status: scripts['check:v1'] && scripts['launch:p0'] && scripts['release:p1'] ? 'Completed but not verified' : 'Blocked',
    evidence: 'package.json scripts check:v1, launch:p0, release:p1',
    blocksTier1: !(scripts['check:v1'] && scripts['launch:p0'] && scripts['release:p1']),
    blocksTier2: true,
    next: 'Run npm run check:v1, npm run launch:p0, and npm run release:p1 with evidence.',
  },
  {
    tier: 'Tier-1',
    item: 'Release/deploy runbooks',
    status: exists('docs/LAUNCH_CLOSEOUT_RUNBOOK.md') && exists('docs/P1_RELEASE_HARDENING.md') ? 'Completed but not verified' : 'Blocked',
    evidence: 'docs/LAUNCH_CLOSEOUT_RUNBOOK.md, docs/P1_RELEASE_HARDENING.md',
    blocksTier1: !(exists('docs/LAUNCH_CLOSEOUT_RUNBOOK.md') && exists('docs/P1_RELEASE_HARDENING.md')),
    blocksTier2: true,
    next: 'Capture release candidate SHA, rollback SHA, staging URL, production URL, and gate outputs.',
  },
  {
    tier: 'Tier-2',
    item: 'Tier-2 canon standards',
    status: exists('docs/canon/TIER_2_CANON_STANDARDS.md') && exists('src/canon/tier2.ts') ? 'Completed but not verified' : 'Blocked',
    evidence: 'docs/canon/TIER_2_CANON_STANDARDS.md, src/canon/tier2.ts',
    blocksTier1: false,
    blocksTier2: !(exists('docs/canon/TIER_2_CANON_STANDARDS.md') && exists('src/canon/tier2.ts')),
    next: 'Confirm canon constants match access matrix and public-copy rules.',
  },
  {
    tier: 'Tier-2',
    item: 'Tier-2 access evaluator and API',
    status: exists('src/lib/tier-locks/evaluateTierLock.ts') && exists('src/app/api/tier-lock/tier2/route.ts') ? 'Completed but not verified' : 'Blocked',
    evidence: 'src/lib/tier-locks/evaluateTierLock.ts, src/app/api/tier-lock/tier2/route.ts',
    blocksTier1: false,
    blocksTier2: !(exists('src/lib/tier-locks/evaluateTierLock.ts') && exists('src/app/api/tier-lock/tier2/route.ts')),
    next: 'Run unit tests for allowed/denied states and API invalid feature handling.',
  },
  {
    tier: 'Tier-2',
    item: 'Tier-2 seed and audit tooling',
    status: scripts['seed:tier2'] && scripts['seed:tier2:firestore'] && scripts['check:tier2-access'] ? 'Completed but not verified' : 'Blocked',
    evidence: 'package.json scripts seed:tier2, seed:tier2:firestore, check:tier2-access',
    blocksTier1: false,
    blocksTier2: !(scripts['seed:tier2'] && scripts['seed:tier2:firestore'] && scripts['check:tier2-access']),
    next: 'Run npm run check:tier2-access and seed dry-run; only seed Firestore in staging with Admin env.',
  },
  {
    tier: 'Tier-2',
    item: 'Tier-2 public route isolation',
    status: scripts['check:tier2-access'] && scripts['check:public-copy'] ? 'Completed but not verified' : 'Blocked',
    evidence: 'scripts/tier-lock/tier2-access-check.mjs, scripts/check-public-copy.mjs',
    blocksTier1: false,
    blocksTier2: !(scripts['check:tier2-access'] && scripts['check:public-copy']),
    next: 'Run npm run check:tier2-access and npm run check:public-copy to confirm public Tier-1 routes do not expose internal/future claims.',
  },
  {
    tier: 'Tier-3+',
    item: 'Cinematic/animation production claims',
    status: 'Deferred',
    evidence: 'src/components/HomeScene.tsx, src/components/HomeWebGLSky.tsx, src/components/lifemap/LifeMapScene.tsx, tests/e2e/v1-smoke.spec.ts',
    blocksTier1: false,
    blocksTier2: false,
    next: 'Do not claim Tier-3/Tier-4/Tier-5 visual lock until mobile, reduced-motion, fixture, loading, empty, error, bundle, and visual evidence are captured.',
  },
  {
    tier: 'Both',
    item: 'Fresh post-merge CI/deployment evidence',
    status: 'Blocked',
    evidence: 'CI logs, local command output, staging URL, production URL, screenshots/recording, tmp/p1-release-gate-report.md',
    blocksTier1: true,
    blocksTier2: true,
    next: 'Attach current CI, install, typecheck, lint, build, smoke, launch gate, release gate, deploy URL, route smoke, and visual proof evidence.',
  },
];

const blockers = checks.filter((check) => check.status === 'Blocked' || check.blocksTier1 || check.blocksTier2);
const tier1Blocked = checks.some((check) => check.blocksTier1);
const tier2Blocked = checks.some((check) => check.blocksTier2);

fs.mkdirSync(outDir, { recursive: true });
const now = new Date().toISOString();
const lines = [];
lines.push('# URAI Tier-1 / Tier-2 Freeze Ledger');
lines.push('');
lines.push(`Generated: ${now}`);
lines.push('');
lines.push('## Decision');
lines.push('');
lines.push(`- Tier-1 freeze: ${tier1Blocked ? 'BLOCKED' : 'READY FOR HUMAN SIGNOFF AFTER EVIDENCE REVIEW'}`);
lines.push(`- Tier-2 freeze: ${tier2Blocked ? 'BLOCKED' : 'READY FOR HUMAN SIGNOFF AFTER EVIDENCE REVIEW'}`);
lines.push(`- Strict mode: ${strict ? 'enabled' : 'disabled'}`);
lines.push('');
lines.push('A tier can only be called locked/frozen when every required item is Completed and verified, with no unresolved blockers, no partial required systems, no unverified critical paths, and no undocumented deployment assumptions.');
lines.push('');
lines.push('## Ledger');
lines.push('');
lines.push('| Tier | Item | Status | Evidence | Blocks Tier-1 | Blocks Tier-2 | Next action |');
lines.push('| --- | --- | --- | --- | --- | --- | --- |');
for (const check of checks) {
  lines.push(`| ${check.tier} | ${check.item} | ${check.status} | ${check.evidence} | ${check.blocksTier1 ? 'Yes' : 'No'} | ${check.blocksTier2 ? 'Yes' : 'No'} | ${check.next} |`);
}
lines.push('');
lines.push('## Required verification commands before freeze');
lines.push('');
lines.push('```bash');
lines.push('npm install');
lines.push('npm run validate:completion');
lines.push('npm run test:rules');
lines.push('npm run typecheck');
lines.push('npm run lint');
lines.push('npm run test:unit');
lines.push('npm run build');
lines.push('npx playwright install chromium');
lines.push('npm run test:smoke');
lines.push('npm run check:tier-freeze');
lines.push('URAI_P1_RUN_COMMANDS=1 npm run release:p1');
lines.push('');
lines.push('# If P0 is relevant:');
lines.push('npm run launch:p0');
lines.push('URAI_P0_RUN_COMMANDS=1 npm run launch:p0');
lines.push('```');
lines.push('');
lines.push('## Blockers');
lines.push('');
if (blockers.length === 0) {
  lines.push('- None detected by static ledger. Human release evidence review still required.');
} else {
  for (const blocker of blockers) {
    lines.push(`- ${blocker.tier}: ${blocker.item} — ${blocker.next}`);
  }
}
lines.push('');

fs.writeFileSync(outPath, `${lines.join('\n')}\n`);
console.log(`URAI tier freeze ledger written to ${path.relative(root, outPath)}`);
console.log(`Tier-1 freeze: ${tier1Blocked ? 'BLOCKED' : 'READY FOR HUMAN SIGNOFF AFTER EVIDENCE REVIEW'}`);
console.log(`Tier-2 freeze: ${tier2Blocked ? 'BLOCKED' : 'READY FOR HUMAN SIGNOFF AFTER EVIDENCE REVIEW'}`);

if (strict && (tier1Blocked || tier2Blocked)) {
  console.error('Strict freeze ledger failed: unresolved blockers remain.');
  process.exit(1);
}