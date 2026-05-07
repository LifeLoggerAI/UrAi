import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const auditDir = path.join(repoRoot, 'audit', 'tier-lock');

const ENV_KEYS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_PRIVATE_KEY',
  'OPENAI_API_KEY',
  'ELEVENLABS_API_KEY',
  'ELEVENLABS_VOICE_ID',
];

const ignoredDirs = new Set(['node_modules', '.next', '.git', 'audit', 'coverage', 'dist', 'build']);
const scanFileRegex = /\.(ts|tsx|js|jsx|mjs|cjs|json)$/;

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
    } else if (scanFileRegex.test(entry.name)) {
      out.push(fullPath);
    }
  }
  return out;
}

function parseDotEnvFile(filePath) {
  const values = new Map();
  if (!exists(filePath)) return values;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) values.set(key, value.length > 0);
  }
  return values;
}

function collectEnvPresence() {
  const envFiles = ['.env.local', '.env', '.env.production', '.env.development'];
  const filePresence = new Map();
  for (const file of envFiles) {
    const values = parseDotEnvFile(path.join(repoRoot, file));
    for (const [key, present] of values.entries()) {
      if (present) filePresence.set(key, true);
    }
  }
  const processPresence = new Map();
  for (const key of ENV_KEYS) {
    processPresence.set(key, Boolean(process.env[key]));
  }
  return { envFiles, filePresence, processPresence };
}

function collectReferencedKeys() {
  const files = walk(repoRoot);
  const rows = new Map();
  for (const key of ENV_KEYS) rows.set(key, []);
  for (const file of files) {
    const rel = relative(file);
    if (rel.startsWith('scripts/tier-lock/')) continue;
    const content = fs.readFileSync(file, 'utf8');
    for (const key of ENV_KEYS) {
      if (content.includes(key)) rows.get(key).push(rel);
    }
  }
  return rows;
}

export function runEnvReadinessAudit() {
  const references = collectReferencedKeys();
  const presence = collectEnvPresence();
  const rows = ENV_KEYS.map((key) => {
    const referencedIn = references.get(key) || [];
    const referenced = referencedIn.length > 0;
    const present = Boolean(presence.filePresence.get(key) || presence.processPresence.get(key));
    const status = referenced ? (present ? 'PASS' : 'FAIL') : (present ? 'PRESENT_OPTIONAL' : 'OPTIONAL_NOT_DETECTED');
    return {
      key,
      referenced,
      present,
      status,
      referencedIn,
    };
  });
  const failures = rows.filter((row) => row.status === 'FAIL');
  return {
    status: failures.length ? 'FAIL' : 'PASS',
    rows,
    failures,
    envFilesChecked: presence.envFiles,
  };
}

export function writeEnvReadinessAuditReport(audit = runEnvReadinessAudit()) {
  fs.mkdirSync(auditDir, { recursive: true });
  const lines = [];
  lines.push('# URAI Environment Readiness Audit');
  lines.push('');
  lines.push(`Status: ${audit.status}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Env files checked: ${audit.envFilesChecked.join(', ')}`);
  lines.push('');
  lines.push('Secret values are never printed. This report only shows present/missing status.');
  lines.push('');
  lines.push('| Key | Referenced | Present | Status | Referenced In |');
  lines.push('| --- | --- | --- | --- | --- |');
  for (const row of audit.rows) {
    lines.push(`| ${row.key} | ${row.referenced ? 'yes' : 'no'} | ${row.present ? 'yes' : 'no'} | ${row.status} | ${row.referencedIn.slice(0, 5).join('<br>') || '-'} |`);
  }
  if (audit.failures.length) {
    lines.push('');
    lines.push('## Next Actions');
    lines.push('');
    for (const fail of audit.failures) {
      lines.push(`- Add \`${fail.key}\` to .env.local or the deployment provider because it is referenced by the codebase.`);
    }
  }
  const reportPath = path.join(auditDir, 'ENV_READINESS_AUDIT.md');
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`);
  return reportPath;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const audit = runEnvReadinessAudit();
  const reportPath = writeEnvReadinessAuditReport(audit);
  console.log(`URAI env readiness audit: ${audit.status}`);
  if (audit.failures.length) {
    console.error('Missing referenced environment keys:');
    for (const fail of audit.failures) console.error(`- ${fail.key}`);
  }
  console.log(`Report: ${relative(reportPath)}`);
  if (audit.status !== 'PASS') process.exit(1);
}
