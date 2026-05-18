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

const homePage = read('src/app/home/page.tsx');
const rootPage = read('src/app/page.tsx');
const resolvedScene = read('src/components/urai/UraiResolvedHomeScene.tsx');
const stateHook = read('src/lib/use-urai-home-state.ts');
const packageJson = read('package.json');
const lockReport = read('HOME_LOCK_REPORT.md');
const e2eAudit = read('HOME_E2E_AUDIT.md');
const dataContract = read('HOME_DATA_CONTRACT.md');
const companionContract = read('HOME_COMPANION_CONTRACT.md');

assertCheck('home route mounts UraiResolvedHomeScene', homePage.includes('UraiResolvedHomeScene') && homePage.includes('return <UraiResolvedHomeScene />'), 'src/app/home/page.tsx should route /home to the resolved home scene.');
assertCheck('root page remains a home scene entrypoint', rootPage.includes('HomeScene') || rootPage.includes('UraiResolvedHomeScene'), 'src/app/page.tsx should remain a valid home entrypoint.');
assertCheck('resolved scene imports live home state hook', resolvedScene.includes('useUraiHomeState'), 'Resolved scene must consume the live home view model hook.');
assertCheck('resolved scene exposes life-map mode', resolvedScene.includes('Mode = "home" | "transitioning" | "lifemap"') || resolvedScene.includes('lifemap'), 'Resolved scene must include home/transition/lifemap flow.');
assertCheck('resolved scene has reduced-motion path', resolvedScene.includes('prefers-reduced-motion') && resolvedScene.includes('reduceMotion'), 'Resolved scene must support reduced-motion ascent.');
assertCheck('resolved scene has return-home behavior', resolvedScene.includes('returnHome') && resolvedScene.includes('Return home'), 'Resolved scene must provide return-home behavior.');
assertCheck('resolved scene has memory stars', resolvedScene.includes('memory-star') && resolvedScene.includes('Constellation'), 'Resolved scene must surface memory stars/constellation nodes.');
assertCheck('resolved scene has orb physical states', resolvedScene.includes('aura-orb-button') && resolvedScene.includes('data-orb-charge') && resolvedScene.includes('orb-core'), 'Resolved scene must include physical orb interaction state.');
assertCheck('resolved scene has ground hotspots', resolvedScene.includes('GROUND_ZONES') && resolvedScene.includes('ground-hotspot'), 'Resolved scene must include ground/body interaction zones.');
assertCheck('home state hook uses Firebase auth', stateHook.includes('onAuthStateChanged') && stateHook.includes('auth()'), 'Home state must bind to authenticated Firebase user.');
assertCheck('home state hook uses Firestore snapshots', stateHook.includes('onSnapshot') && stateHook.includes('db()'), 'Home state must use Firestore reads/snapshots.');
assertCheck('home state hook normalizes life-map nodes', stateHook.includes('normalizeNode') && stateHook.includes('lifeMapNodes'), 'Home state must normalize memory/life-map nodes.');
assertCheck('home state hook has explicit fallback source states', stateHook.includes('source: "firestore"') && stateHook.includes('source: "demo"') && stateHook.includes('source: "unconfigured"'), 'Home state must distinguish live, demo, and unconfigured data.');
assertCheck('package exposes check:home', packageJson.includes('"check:home"'), 'package.json must expose npm run check:home.');
assertCheck('home lock report exists', lockReport.includes('HOME LOCK REPORT'), 'HOME_LOCK_REPORT.md must exist.');
assertCheck('home e2e audit exists', e2eAudit.includes('HOME E2E AUDIT'), 'HOME_E2E_AUDIT.md must exist.');
assertCheck('home data contract exists', dataContract.includes('HOME DATA CONTRACT'), 'HOME_DATA_CONTRACT.md must exist.');
assertCheck('home companion contract exists', companionContract.includes('HOME COMPANION CONTRACT'), 'HOME_COMPANION_CONTRACT.md must exist.');

const failed = checks.filter((check) => !check.passed);
for (const check of checks) {
  const icon = check.passed ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${check.name}`);
  if (!check.passed) console.log(`       ${check.detail}`);
}

if (failed.length) {
  console.error(`\nURAI home lock check failed: ${failed.length} failing check(s).`);
  process.exit(1);
}

console.log('\nURAI home lock static checks passed. Runtime, emulator, and deploy evidence are still required before marking /home LOCKED.');
