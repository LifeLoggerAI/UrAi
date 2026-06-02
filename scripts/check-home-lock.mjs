import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];

function read(relativePath) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) return '';
  return fs.readFileSync(absolute, 'utf8');
}

function readMany(relativePaths) {
  return relativePaths.map(read).join('\n');
}

function assertCheck(name, passed, detail) {
  checks.push({ name, passed, detail });
}

const rootLayout = read('src/app/layout.tsx');
const robots = read('src/app/robots.ts');
const sitemap = read('src/app/sitemap.ts');
const provider = read('src/components/urai/SpatialUniverseProvider.tsx');
const notFound = read('src/app/not-found.tsx');
const appHome = read('src/app/app/home/page.tsx');
const appLifeMap = read('src/app/app/life-map/page.tsx');
const appCouncil = read('src/app/app/council/page.tsx');
const appSettings = read('src/app/app/settings/page.tsx');
const appPrivacy = read('src/app/app/settings/privacy/page.tsx');
const publicRoutes = readMany([
  'src/app/early-access/page.tsx',
  'src/app/narrator/page.tsx',
  'src/app/scrolls/page.tsx',
  'src/app/journal/page.tsx',
  'src/app/settings/privacy/page.tsx',
]);
const routeSources = readMany([
  'src/app/layout.tsx',
  'src/app/robots.ts',
  'src/app/sitemap.ts',
  'src/components/urai/SpatialUniverseProvider.tsx',
  'src/components/urai/SpatialUniverseShell.tsx',
  'src/app/not-found.tsx',
  'src/app/early-access/page.tsx',
  'src/app/narrator/page.tsx',
  'src/app/scrolls/page.tsx',
  'src/app/journal/page.tsx',
]);

assertCheck('production metadata does not fall back to localhost', !rootLayout.includes('http://localhost:3014'), 'src/app/layout.tsx must default to https://urai.app.');
assertCheck('robots does not fall back to localhost', !robots.includes('http://localhost:3014'), 'src/app/robots.ts must default to https://urai.app.');
assertCheck('sitemap does not fall back to localhost', !sitemap.includes('http://localhost:3014'), 'src/app/sitemap.ts must default to https://urai.app.');
assertCheck('spatial shell is gated outside production', provider.includes('NEXT_PUBLIC_URAI_DEBUG_SPATIAL') && provider.includes('NODE_ENV'), 'Spatial shell must render only when explicit debug env is enabled outside production.');
assertCheck('branded not-found exists', notFound.includes('This path has gone quiet.') && notFound.includes('/app/home') && !notFound.includes('This page could not be found'), 'src/app/not-found.tsx must be branded and avoid default Next.js 404 copy.');
assertCheck('canonical app home exists', appHome.includes('HomeScene'), 'src/app/app/home/page.tsx must mount the Genesis home scene.');
assertCheck('canonical app life map exists', appLifeMap.includes('SpatialLifeMap'), 'src/app/app/life-map/page.tsx must mount the app Life Map.');
assertCheck('canonical app council exists', appCouncil.length > 0, 'src/app/app/council/page.tsx must exist.');
assertCheck('canonical app settings exists', appSettings.length > 0, 'src/app/app/settings/page.tsx must exist.');
assertCheck('canonical app privacy route exists', appPrivacy.includes('Privacy Settings'), 'src/app/app/settings/privacy/page.tsx must exist.');
assertCheck('public route links prefer app routes', !publicRoutes.includes('primaryHref="/home"') && !publicRoutes.includes('secondaryHref="/home"'), 'Public support routes should link to /app/home instead of legacy /home.');
assertCheck('launch sources avoid public localhost references', !routeSources.includes('localhost:3014'), 'Launch route sources should not contain localhost:3014.');
assertCheck('launch sources avoid default 404 copy', !routeSources.includes('This page could not be found'), 'Launch route sources should not contain default Next.js 404 copy.');

const failed = checks.filter((check) => !check.passed);
for (const check of checks) {
  const icon = check.passed ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${check.name}`);
  if (!check.passed) console.log(`       ${check.detail}`);
}

if (failed.length) {
  console.error(`\nURAI launch static checks failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log('\nURAI launch static checks passed. Run npm run build and inspect generated output before deploy.');
