import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const auditDir = path.join(repoRoot, 'audit', 'tier-lock');

const requiredFiles = [
  'src/lib/tier-locks/types.ts',
  'src/lib/tier-locks/config.ts',
  'src/lib/tier-locks/evaluateTierLock.ts',
  'src/lib/tier-locks/requestTier2AccessLock.ts',
  'src/lib/tier-locks/useTier2AccessLock.ts',
  'src/lib/tier-locks/client.ts',
  'src/app/api/tier-lock/tier2/route.ts',
  'scripts/seed-tier2-access.mjs',
  'tests/unit/tier-locks/evaluateTierLock.test.ts',
  'tests/unit/tier-locks/requestTier2AccessLock.test.ts',
  'tests/unit/tier-locks/tier2SeedScript.test.ts',
  'tests/rules/tier2-policy.test.js',
  'tests/e2e/tier2-access-api.spec.ts',
  'docs/TIER_2_ACCESS_LOCKS.md',
  'docs/TIER_2_ACCESS_LOCK_MATRIX.md',
  'docs/TIER_2_ACCESS_QA_CHECKLIST.md',
  'docs/TIER_2_ACCESS_API_CONTRACT.md',
  'docs/canon/TIER_2_CANON_STANDARDS.md',
  'src/canon/tier2.ts',
  'src/canon/index.ts',
];

const forbiddenFiles = [
  'src/app/api/tier-lock/spatial/route.ts',
  'docs/SPATIAL_TIER_LOCKS.md',
  'docs/SPATIAL_LOCK_MATRIX.md',
  'docs/SPATIAL_LOCK_QA_CHECKLIST.md',
];

const publicUiRoots = [
  'src/app/page.tsx',
  'src/app/page.ts',
  'src/app/home/page.tsx',
  'src/app/home/page.ts',
  'src/app/demo/page.tsx',
  'src/app/demo/page.ts',
  'src/app/life-map/page.tsx',
  'src/app/life-map/page.ts',
];

const publicUiForbiddenTerms = [
  'useTier2AccessLock',
  'requestTier2AccessLock',
  '/api/tier-lock/tier2',
  'tier2_access_lock',
];

function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function lineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

function findTerm(content, term) {
  const matches = [];
  let start = 0;
  while (true) {
    const index = content.indexOf(term, start);
    if (index === -1) break;
    matches.push({ term, line: lineNumber(content, index) });
    start = index + term.length;
  }
  return matches;
}

export function runTier2AccessCheck() {
  const findings = [];

  for (const file of requiredFiles) {
    if (!exists(file)) {
      findings.push({ file, status: 'FAIL', check: 'required-file', notes: 'Required Tier-2 access file is missing.' });
    }
  }

  for (const file of forbiddenFiles) {
    if (exists(file)) {
      findings.push({ file, status: 'FAIL', check: 'old-spatial-name', notes: 'Old spatial-specific Tier-2 file path should not exist in the main URAI app repo.' });
    }
  }

  for (const file of publicUiRoots) {
    if (!exists(file)) continue;
    const content = read(file);
    for (const term of publicUiForbiddenTerms) {
      for (const match of findTerm(content, term)) {
        findings.push({
          file,
          line: match.line,
          status: 'FAIL',
          check: 'public-ui-tier2-wiring',
          notes: `Public Tier-1 route references ${term}. Tier-2 must remain unwired until Tier-1 is sealed.`,
        });
      }
    }
  }

  const packageJson = exists('package.json') ? JSON.parse(read('package.json')) : { scripts: {} };
  for (const scriptName of ['seed:tier2', 'seed:tier2:firestore', 'check:tier2-access']) {
    if (!packageJson.scripts?.[scriptName]) {
      findings.push({ file: 'package.json', status: 'FAIL', check: 'missing-script', notes: `Missing npm script ${scriptName}.` });
    }
  }

  return {
    status: findings.length ? 'FAIL' : 'PASS',
    findings,
  };
}

export function writeTier2AccessCheckReport(audit = runTier2AccessCheck()) {
  fs.mkdirSync(auditDir, { recursive: true });
  const lines = [];
  lines.push('# URAI Tier-2 Access Check');
  lines.push('');
  lines.push(`Status: ${audit.status}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('This check verifies that the main URAI app Tier-2 access layer is cohesive, not confused with the separate urai-spatial repo, and not wired into public Tier-1 routes.');
  lines.push('');
  lines.push('## Findings');
  lines.push('');
  lines.push('| File | Line | Check | Status | Notes |');
  lines.push('| --- | ---: | --- | --- | --- |');
  if (audit.findings.length) {
    for (const finding of audit.findings) {
      lines.push(`| ${finding.file} | ${finding.line ?? '-'} | ${finding.check} | ${finding.status} | ${finding.notes} |`);
    }
  } else {
    lines.push('| - | - | - | PASS | Tier-2 access invariants passed. |');
  }

  const reportPath = path.join(auditDir, 'TIER2_ACCESS_CHECK.md');
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`);
  return reportPath;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const audit = runTier2AccessCheck();
  const reportPath = writeTier2AccessCheckReport(audit);
  console.log(`URAI Tier-2 access check: ${audit.status}`);
  console.log(`Report: ${path.relative(repoRoot, reportPath).split(path.sep).join('/')}`);
  if (audit.status !== 'PASS') {
    for (const finding of audit.findings) {
      console.error(`- ${finding.check}: ${finding.file}${finding.line ? `:${finding.line}` : ''} ${finding.notes}`);
    }
    process.exit(1);
  }
}
