import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const auditDir = path.join(repoRoot, 'audit', 'tier-lock');

const RISKY_PATTERNS = [
  { label: 'console.log', regex: /console\.log\s*\(/g },
  { label: 'console.debug', regex: /console\.debug\s*\(/g },
  { label: 'console.trace', regex: /console\.trace\s*\(/g },
  { label: 'debugger', regex: /\bdebugger\b/g },
];

const runtimeRoots = ['src/app', 'app', 'src/components', 'components', 'src/lib', 'lib'];
const ignoredDirs = new Set(['node_modules', '.next', '.git', 'audit', 'coverage', 'dist', 'build']);
const fileRegex = /\.(ts|tsx|js|jsx)$/;

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function relative(p) {
  return path.relative(repoRoot, p).split(path.sep).join('/');
}

function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) continue;
      walk(fullPath, out);
    } else if (fileRegex.test(entry.name)) {
      out.push(fullPath);
    }
  }
  return out;
}

function lineNumber(content, index) {
  return content.slice(0, index).split('\n').length;
}

export function runConsoleWarningAudit() {
  const files = [];
  for (const root of runtimeRoots) {
    const fullRoot = path.join(repoRoot, root);
    if (exists(fullRoot)) walk(fullRoot, files);
  }

  const findings = [];
  for (const file of [...new Set(files)]) {
    const rel = relative(file);
    const content = fs.readFileSync(file, 'utf8');
    for (const pattern of RISKY_PATTERNS) {
      pattern.regex.lastIndex = 0;
      let match;
      while ((match = pattern.regex.exec(content)) !== null) {
        findings.push({
          file: rel,
          line: lineNumber(content, match.index),
          pattern: pattern.label,
          notes: 'Production-risk console/debug artifact in UI/runtime code',
        });
      }
    }
  }

  return {
    status: findings.length ? 'FAIL' : 'PASS',
    scannedFiles: [...new Set(files)].length,
    findings,
  };
}

export function writeConsoleWarningAuditReport(audit = runConsoleWarningAudit()) {
  fs.mkdirSync(auditDir, { recursive: true });
  const lines = [];
  lines.push('# URAI Console Warning Audit');
  lines.push('');
  lines.push(`Status: ${audit.status}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Scanned files: ${audit.scannedFiles}`);
  lines.push('');
  lines.push('Allowed console usage: scripts may use console.warn, console.error, and console.info. UI/runtime code must not ship console.log, console.debug, console.trace, or debugger statements.');
  lines.push('');
  lines.push('| File | Line | Pattern | Notes |');
  lines.push('| --- | ---: | --- | --- |');
  if (audit.findings.length) {
    for (const finding of audit.findings) {
      lines.push(`| ${finding.file} | ${finding.line} | ${finding.pattern} | ${finding.notes} |`);
    }
  } else {
    lines.push('| - | - | - | No production-risk console/debug artifacts found. |');
  }
  if (audit.findings.length) {
    lines.push('');
    lines.push('## Next Actions');
    lines.push('');
    lines.push('- Remove console.log, console.debug, console.trace, and debugger statements from UI/runtime code.');
    lines.push('- Replace user-visible diagnostics with branded URAI fallback UI or typed error states.');
    lines.push('- Keep operational logging inside scripts, server-only diagnostics, or explicit observability layers.');
  }
  const reportPath = path.join(auditDir, 'CONSOLE_WARNING_AUDIT.md');
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`);
  return reportPath;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const audit = runConsoleWarningAudit();
  const reportPath = writeConsoleWarningAuditReport(audit);
  console.log(`URAI console warning audit: ${audit.status}`);
  console.log(`Scanned files: ${audit.scannedFiles}`);
  if (audit.findings.length) {
    console.error('Production-risk console/debug artifacts found:');
    for (const finding of audit.findings) {
      console.error(`- ${finding.file}:${finding.line} ${finding.pattern}`);
    }
  }
  console.log(`Report: ${relative(reportPath)}`);
  if (audit.status !== 'PASS') process.exit(1);
}
