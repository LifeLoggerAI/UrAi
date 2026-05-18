import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];

function read(relativePath) {
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) return '';
  return fs.readFileSync(absolute, 'utf8');
}

function assertCheck(name, passed, detail) {
  checks.push({ name, passed, detail });
}

const resolvedScene = read('src/components/urai/UraiResolvedHomeScene.tsx');
const lifeMapScene = read('src/components/lifemap/LifeMapScene.tsx');
const homePage = read('src/app/home/page.tsx');
const lifeMapPage = read('src/app/life-map/page.tsx');
const packageJson = read('package.json');

assertCheck('home page uses resolved scene', homePage.includes('UraiResolvedHomeScene'), '/home must mount the resolved scene that owns the ascent state machine.');
assertCheck('life-map page exists', Boolean(lifeMapPage.trim()) || Boolean(lifeMapScene.trim()), 'Life Map target route/component must exist.');
assertCheck('resolved scene has transition mode', resolvedScene.includes('transitioning'), 'Resolved scene must include transition mode.');
assertCheck('resolved scene enters lifemap mode', resolvedScene.includes('setMode("lifemap")'), 'Resolved scene must enter lifemap mode.');
assertCheck('resolved scene renders LifeMapScene', resolvedScene.includes('<LifeMapScene />'), 'Resolved scene must render LifeMapScene after ascent.');
assertCheck('resolved scene has openLifeMap action', resolvedScene.includes('const openLifeMap') && resolvedScene.includes('setMode(reduceMotion ? "lifemap" : "transitioning")'), 'Resolved scene must expose deterministic openLifeMap action.');
assertCheck('resolved scene has returnHome action', resolvedScene.includes('const returnHome') && resolvedScene.includes('setMode("home")'), 'Resolved scene must return from lifemap to home.');
assertCheck('resolved scene supports reduced motion', resolvedScene.includes('prefers-reduced-motion') && resolvedScene.includes('reduceMotion'), 'Reduced-motion users must bypass disorienting ascent.');
assertCheck('resolved scene animates transition CSS', resolvedScene.includes('is-transitioning') && resolvedScene.includes('.is-transitioning .aura-orb-button'), 'Ascent transition CSS must exist.');
assertCheck('package exposes check:ascent', packageJson.includes('"check:ascent"'), 'package.json must expose npm run check:ascent.');

const failed = checks.filter((check) => !check.passed);
for (const check of checks) {
  const icon = check.passed ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${check.name}`);
  if (!check.passed) console.log(`       ${check.detail}`);
}

if (failed.length) {
  console.error(`\nURAI ascent lock check failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log('\nURAI ascent static checks passed. Full visual smoke and reduced-motion browser verification are still required before marking /home LOCKED.');
