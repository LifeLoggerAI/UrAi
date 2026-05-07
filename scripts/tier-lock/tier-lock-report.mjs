import fs from 'fs';
import path from 'path';
import process from 'process';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { runRouteAudit, writeRouteAuditReport } from './route-audit.mjs';
import { runConsoleWarningAudit, writeConsoleWarningAuditReport } from './console-warning-audit.mjs';
import { runEnvReadinessAudit, writeEnvReadinessAuditReport } from './env-readiness-audit.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const auditDir = path.join(repoRoot, 'audit', 'tier-lock');

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function relative(p) {
  return path.relative(repoRoot, p).split(path.sep).join('/');
}

function safeExec(command) {
  try {
    return execSync(command, { cwd: repoRoot, stdio: ['ignore', 'pipe', 'ignore'], encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function detectPackageManager() {
  if (exists(path.join(repoRoot, 'pnpm-lock.yaml'))) return 'pnpm';
  if (exists(path.join(repoRoot, 'yarn.lock'))) return 'yarn';
  if (exists(path.join(repoRoot, 'package-lock.json'))) return 'npm';
  return 'unknown';
}

function readPackageScripts() {
  const pkgPath = path.join(repoRoot, 'package.json');
  if (!exists(pkgPath)) return {};
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.scripts || {};
  } catch {
    return {};
  }
}

function commandRecommendations(packageManager, scripts) {
  const run = packageManager === 'npm' ? 'npm run' : packageManager === 'yarn' ? 'yarn' : 'pnpm';
  const commands = [];
  if (scripts['check:types']) commands.push(`${run} check:types`);
  if (scripts.typecheck) commands.push(`${run} typecheck`);
  if (scripts.build) commands.push(`${run} build`);
  if (scripts.test) commands.push(`${run} test`);
  if (scripts['urai:tier5:launch-lock']) commands.push(`${run} urai:tier5:launch-lock`);
  return commands;
}

export function generateTierLockReport() {
  fs.mkdirSync(auditDir, { recursive: true });
  const routeAudit = runRouteAudit();
  const consoleAudit = runConsoleWarningAudit();
  const envAudit = runEnvReadinessAudit();
  writeRouteAuditReport(routeAudit);
  writeConsoleWarningAuditReport(consoleAudit);
  writeEnvReadinessAuditReport(envAudit);

  const packageManager = detectPackageManager();
  const scripts = readPackageScripts();
  const branch = safeExec('git rev-parse --abbrev-ref HEAD') || 'unavailable';
  const commit = safeExec('git rev-parse HEAD') || 'unavailable';
  const finalStatus = [routeAudit.status, consoleAudit.status, envAudit.status].every((status) => status === 'PASS') ? 'PASS' : 'FAIL';

  const lines = [];
  lines.push('# URAI Tier Lock Report');
  lines.push('');
  lines.push(`Final Status: ${finalStatus}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Git branch: ${branch}`);
  lines.push(`Commit: ${commit}`);
  lines.push(`Package manager detected: ${packageManager}`);
  lines.push('');
  lines.push('## Tier 1 Route Coverage Summary');
  lines.push('');
  lines.push(`Status: ${routeAudit.status}`);
  lines.push(`Routes passing: ${routeAudit.results.filter((row) => row.status === 'PASS').length}/${routeAudit.results.length}`);
  lines.push('');
  lines.push('| Route | Status | File |');
  lines.push('| --- | --- | --- |');
  for (const row of routeAudit.results) {
    lines.push(`| ${row.route} | ${row.status} | ${row.file} |`);
  }
  lines.push('');
  lines.push('## Console Audit Summary');
  lines.push('');
  lines.push(`Status: ${consoleAudit.status}`);
  lines.push(`Scanned files: ${consoleAudit.scannedFiles}`);
  lines.push(`Findings: ${consoleAudit.findings.length}`);
  lines.push('');
  lines.push('## Env Readiness Summary');
  lines.push('');
  lines.push(`Status: ${envAudit.status}`);
  lines.push(`Missing referenced keys: ${envAudit.failures.length}`);
  if (envAudit.failures.length) {
    for (const failure of envAudit.failures) lines.push(`- ${failure.key}`);
  }
  lines.push('');
  lines.push('## Build / Typecheck / Test Recommendations');
  lines.push('');
  const commands = commandRecommendations(packageManager, scripts);
  if (commands.length) {
    for (const command of commands) lines.push(`- \`${command}\``);
  } else {
    lines.push('- No package scripts detected. Add build/typecheck/test scripts before production deploy.');
  }
  lines.push('');
  lines.push('## Report Files');
  lines.push('');
  lines.push('- `audit/tier-lock/ROUTE_AUDIT.md`');
  lines.push('- `audit/tier-lock/CONSOLE_WARNING_AUDIT.md`');
  lines.push('- `audit/tier-lock/ENV_READINESS_AUDIT.md`');
  lines.push('- `audit/tier-lock/TIER1_LAUNCH_LOCK.md`');
  lines.push('');
  if (finalStatus === 'FAIL') {
    lines.push('## Next Actions');
    lines.push('');
    if (routeAudit.status !== 'PASS') lines.push('- Fix missing Tier-1 routes listed in `ROUTE_AUDIT.md`.');
    if (consoleAudit.status !== 'PASS') lines.push('- Remove production-risk console/debug artifacts listed in `CONSOLE_WARNING_AUDIT.md`.');
    if (envAudit.status !== 'PASS') lines.push('- Add missing referenced secrets to local/deployment env without committing secret values.');
  } else {
    lines.push('## Launch Gate');
    lines.push('');
    lines.push('Tier route, console hygiene, and referenced environment readiness checks are green. Continue with screenshot QA and deployment smoke checks.');
  }

  const reportPath = path.join(auditDir, 'TIER_LOCK_REPORT.md');
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`);
  return { status: finalStatus, reportPath };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const report = generateTierLockReport();
  console.log(`URAI tier lock report: ${report.status}`);
  console.log(`Report: ${relative(report.reportPath)}`);
  if (report.status !== 'PASS') process.exit(1);
}
