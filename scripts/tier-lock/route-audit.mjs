import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const auditDir = path.join(repoRoot, 'audit', 'tier-lock');

export const TIER1_ROUTES = [
  { route: '/', files: ['page.tsx', 'page.ts', 'route.ts'] },
  { route: '/home', files: ['home/page.tsx', 'home/page.ts', 'home/route.ts'] },
  { route: '/life-map', files: ['life-map/page.tsx', 'life-map/page.ts', 'life-map/route.ts'] },
  { route: '/demo', files: ['demo/page.tsx', 'demo/page.ts', 'demo/route.ts'] },
  { route: '/demo/life-map', files: ['demo/life-map/page.tsx', 'demo/life-map/page.ts', 'demo/life-map/route.ts'] },
  { route: '/replay', files: ['replay/page.tsx', 'replay/page.ts', 'replay/route.ts'] },
  { route: '/mirror', files: ['mirror/page.tsx', 'mirror/page.ts', 'mirror/route.ts'] },
  { route: '/focus', files: ['focus/page.tsx', 'focus/page.ts', 'focus/route.ts'] },
  { route: '/early-access', files: ['early-access/page.tsx', 'early-access/page.ts', 'early-access/route.ts'] },
  { route: '/invite/[code]', files: ['invite/[code]/page.tsx', 'invite/[code]/page.ts', 'invite/[code]/route.ts'] },
  { route: '/admin/invites', files: ['admin/invites/page.tsx', 'admin/invites/page.ts', 'admin/invites/route.ts'] },
];

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

export function findAppRoots(root = repoRoot) {
  const candidates = [path.join(root, 'src', 'app'), path.join(root, 'app')];
  return candidates.filter(exists);
}

export function ensureAuditDir() {
  fs.mkdirSync(auditDir, { recursive: true });
}

export function relative(p) {
  return path.relative(repoRoot, p).split(path.sep).join('/');
}

export function findRouteFile(routeDef, root = repoRoot) {
  const appRoots = findAppRoots(root);
  for (const appRoot of appRoots) {
    for (const file of routeDef.files) {
      const fullPath = path.join(appRoot, file);
      if (exists(fullPath)) {
        return { status: 'PASS', file: relative(fullPath), appRoot: relative(appRoot), notes: 'Found' };
      }
    }
  }
  const expected = appRoots.length > 0
    ? routeDef.files.map((file) => relative(path.join(appRoots[0], file))).join(' or ')
    : routeDef.files.map((file) => `src/app/${file}`).join(' or ');
  return { status: 'FAIL', file: expected, appRoot: appRoots.map(relative).join(', ') || 'src/app or app', notes: 'Missing route file' };
}

export function runRouteAudit(root = repoRoot) {
  const appRoots = findAppRoots(root);
  const results = TIER1_ROUTES.map((routeDef) => ({
    route: routeDef.route,
    ...findRouteFile(routeDef, root),
  }));

  const apiResults = discoverLaunchApiRoutes(root, appRoots);
  const failures = results.filter((row) => row.status === 'FAIL');
  return {
    status: failures.length === 0 ? 'PASS' : 'FAIL',
    appRoots: appRoots.map(relative),
    results,
    apiResults,
    failures,
  };
}

function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'audit'].includes(entry.name)) continue;
      walk(fullPath, out);
    } else {
      out.push(fullPath);
    }
  }
  return out;
}

function discoverLaunchApiRoutes(root, appRoots) {
  const keywords = ['narrator', 'invite', 'firebase'];
  const rows = [];
  for (const appRoot of appRoots) {
    const apiRoot = path.join(appRoot, 'api');
    const routeFiles = walk(apiRoot).filter((file) => /route\.(ts|tsx|js|jsx)$/.test(file));
    for (const keyword of keywords) {
      const matches = routeFiles.filter((file) => relative(file).toLowerCase().includes(keyword));
      rows.push({
        area: keyword,
        status: matches.length ? 'PASS' : 'WARN',
        files: matches.map(relative),
        notes: matches.length ? 'API route detected' : 'No matching API route detected; ignored unless this feature is expected in this repo',
      });
    }
  }
  return rows;
}

export function writeRouteAuditReport(audit = runRouteAudit()) {
  ensureAuditDir();
  const lines = [];
  lines.push('# URAI Route Audit');
  lines.push('');
  lines.push(`Status: ${audit.status}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`App roots: ${audit.appRoots.length ? audit.appRoots.join(', ') : 'not found'}`);
  lines.push('');
  lines.push('## Tier 1 Route Coverage');
  lines.push('');
  lines.push('| Route | Expected / Found File | Status | Notes |');
  lines.push('| --- | --- | --- | --- |');
  for (const row of audit.results) {
    lines.push(`| ${row.route} | ${row.file} | ${row.status} | ${row.notes} |`);
  }
  lines.push('');
  lines.push('## Launch API Detection');
  lines.push('');
  lines.push('| Area | Status | Files | Notes |');
  lines.push('| --- | --- | --- | --- |');
  for (const row of audit.apiResults) {
    lines.push(`| ${row.area} | ${row.status} | ${row.files.join('<br>') || '-'} | ${row.notes} |`);
  }
  if (audit.failures.length) {
    lines.push('');
    lines.push('## Next Actions');
    lines.push('');
    for (const fail of audit.failures) {
      lines.push(`- Add or restore the Tier-1 route for \`${fail.route}\` at one of: ${fail.file}.`);
    }
  }
  const reportPath = path.join(auditDir, 'ROUTE_AUDIT.md');
  fs.writeFileSync(reportPath, `${lines.join('\n')}\n`);
  return reportPath;
}

function printAudit(audit) {
  console.log(`URAI route audit: ${audit.status}`);
  for (const row of audit.results) {
    const marker = row.status === 'PASS' ? 'OK' : 'FAIL';
    console.log(`${marker} ${row.route} -> ${row.file}`);
  }
  if (audit.failures.length) {
    console.error('\nRoute audit failed. Next actions:');
    for (const fail of audit.failures) {
      console.error(`- Create ${fail.route} using one of: ${fail.file}`);
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  const audit = runRouteAudit();
  const reportPath = writeRouteAuditReport(audit);
  printAudit(audit);
  console.log(`Report: ${relative(reportPath)}`);
  if (audit.status !== 'PASS') process.exit(1);
}
