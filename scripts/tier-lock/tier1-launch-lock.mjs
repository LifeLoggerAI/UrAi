import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { runRouteAudit, writeRouteAuditReport, findAppRoots, TIER1_ROUTES } from './route-audit.mjs';
import { runConsoleWarningAudit, writeConsoleWarningAuditReport } from './console-warning-audit.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const auditDir = path.join(repoRoot, 'audit', 'tier-lock');

const bannedPatterns = [
  'OldOrbScene',
  'LegacyOrb',
  'DebugScene',
  'TestScene',
  'PlaceholderScene',
  'MockLifeMap',
  'TempHomeView',
  'OldHomeView',
  'DebugBadge',
  'DEV ONLY',
  'TODO: launch',
  'FIXME: launch',
  'console.log(',
  'alert(',
  'lorem ipsum',
  'placeholder',
  'test-only',
  'mock-only',
];

const brandedFallbackTerms = [
  'URAI',
  'Urai',
  'narrator',
  'companion',
  'aura',
  'life map',
  'Life Map',
  'early access',
  'Early Access',
];

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function relative(p) {
  return path.relative(repoRoot, p).split(path.sep).join('/');
}

function routeFilesFromAudit(routeAudit) {
  return routeAudit.results
    .filter((row) => row.status === 'PASS')
    .map((row) => path.join(repoRoot, row.file));
}

function lineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

function scanTier1Files(routeAudit) {
  const findings = [];
  for (const file of routeFilesFromAudit(routeAudit)) {
    if (!exists(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of bannedPatterns) {
      const lowerPattern = pattern.toLowerCase();
      const lowerContent = content.toLowerCase();
      let startIndex = 0;
      while (true) {
        const index = lowerContent.indexOf(lowerPattern, startIndex);
        if (index === -1) break;
        findings.push({
          file: relative(file),
          line: lineNumber(content, index),
          check: 'banned-pattern',
          value: pattern,
          notes: 'Tier-1 route contains stale/debug/mock launch blocker text or imports',
        });
        startIndex = index + lowerPattern.length;
      }
    }

    const hasBrandCue = brandedFallbackTerms.some((term) => content.includes(term));
    const importsSharedBoundary = /loading|error|fallback|shell|layout/i.test(content);
    if (!hasBrandCue && !importsSharedBoundary) {
      findings.push({
        file: relative(file),
        line: 1,
        check: 'branded-fallback-signal',
        value: 'missing URAI fallback/shell signal',
        notes: 'Tier-1 route should include URAI branded copy or use a shared loading/error/fallback/shell boundary',
      });
    }
  }
  return findings;
}

function verifyFallbackBoundaries() {
  const appRoots = findAppRoots(repoRoot);
  const rows = [];
  for (const appRoot of appRoots) {
    for (const fileName of ['loading.tsx', 'loading.ts', 'error.tsx', 'error.ts', 'not-found.tsx', 'not-found.ts']) {
      const fullPath = path.join(appRoot, fileName);
      if (exists(fullPath)) rows.push({ file: relative(fullPath), status: 'PASS' });
    }
  }
  return rows;
}

export function runTier1LaunchLock() {
  const routeAudit = runRouteAudit();
  writeRouteAuditReport(routeAudit);
  const consoleAudit = runConsoleWarningAudit();
  writeConsoleWarningAuditReport(consoleAudit);
  const tier1Findings = scanTier1Files(routeAudit);
  const fallbackBoundaries = verifyFallbackBoundaries();
  const hardFailures = [
    ...routeAudit.failures.map((failure) => ({
      file: failure.file,
      line: '-',
      check: 'missing-route',
      value: failure.route,
      notes: failure.notes,
    })),
    ...tier1Findings,
  ];
  return {
    status: hardFailures.length ? 'FAIL' : 'PASS',
    routeAudit,
    consoleAudit,
    tier1Findings,
    fallbackBoundaries,
    hardFailures,
  };
}

export function writeTier1Report(audit = runTier1LaunchLock()) {
  fs.mkdirSync(auditDir, { recursive: true });
  const lines = [];
  lines.push('# URAI Tier 1 Launch Lock');
  lines.push('');
  lines.push(`Status: ${audit.status}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('Tier 1 validates launch-critical routes, stale scene artifacts, debug/mock UI, invite path presence, narrator route detection, and branded fallback signals.');
  lines.push('');
  lines.push('## Route Coverage');
  lines.push('');
  lines.push('| Route | File | Status | Notes |');
  lines.push('| --- | --- | --- | --- |');
  for (const row of audit.routeAudit.results) {
    lines.push(`| ${row.route} | ${row.file} | ${row.status} | ${row.notes} |`);
  }
  lines.push('');
  lines.push('## Launch API Detection');
  lines.push('');
  lines.push('| Area | Status | Files | Notes |');
  lines.push('| --- | --- | --- | --- |');
  for (const row of audit.routeAudit.apiResults) {
    lines.push(`| ${row.area} | ${row.status} | ${row.files.join('<br>') || '-'} | ${row.notes} |`);
  }
  lines.push('');
  lines.push('## Tier 1 File Findings');
  lines.push('');
  lines.push('| File | Line | Check | Value | Notes |');
  lines.push('| --- | ---: | --- | --- | --- |');
  if (audit.tier1Findings.length) {
    for (const finding of audit.tier1Findings) {
      lines.push(`| ${finding.file} | ${finding.line} | ${finding.check} | ${finding.value.replace(/\|/g, '\\|')} | ${finding.notes} |`);
    }
  } else {
    lines.push('| - | - | - | - | No Tier-1 stale/debug/mock route findings. |');
  }
  lines.push('');
  lines.push('## Shared Fallback Boundaries Detected');
  lines.push('');
  if (audit.fallbackBoundaries.length) {
    for (const row of audit.fallbackBoundaries) lines.push(`- ${row.file}`);
  } else {
    lines.push('- None detected at the app root. Tier-1 route files must carry their own branded fallback signal or add shared boundaries later.');
  }
  if (audit.hardFailures.length) {
    lines.push('');
    lines.push('## Next Actions');
    lines.push('');
    for (const failure of audit.hardFailures) {
      lines.push(`- Fix ${failure.check} in ${failure.file}${failure.line !== '-' ? `:${failure.line}` : ''} (${failure.value}).`);
    }
  }
  const reportPath = path.join(auditDir, 'TIER1_LAUNCH_LOCK.md');
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`);
  return reportPath;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const audit = runTier1LaunchLock();
  const reportPath = writeTier1Report(audit);
  console.log(`URAI Tier 1 launch lock: ${audit.status}`);
  if (audit.hardFailures.length) {
    console.error('Tier 1 launch blockers:');
    for (const failure of audit.hardFailures) {
      console.error(`- ${failure.check}: ${failure.file}${failure.line !== '-' ? `:${failure.line}` : ''} ${failure.value}`);
    }
  }
  console.log(`Report: ${relative(reportPath)}`);
  if (audit.status !== 'PASS') process.exit(1);
}
