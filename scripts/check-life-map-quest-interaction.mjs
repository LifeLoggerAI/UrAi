import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const read = (filePath) => fs.readFileSync(path.join(root, filePath), 'utf8');

const checks = [];

function addCheck(name, filePath, patterns) {
  const source = read(filePath);
  for (const pattern of patterns) {
    checks.push({
      name,
      filePath,
      pattern,
      passed: source.includes(pattern),
    });
  }
}

addCheck('Life Map scene preserves visuals and wires Quest layer', 'src/components/spatial-life-map/LifeGalaxyScene.tsx', [
  '<NebulaBackdrop',
  '<StarField',
  '<ConstellationLines',
  '<LifeStar',
  '<LifeMapQuestInteractionLayer',
]);

addCheck('Life Map VR entry is gated by real immersive-vr support', 'src/components/spatial-life-map/LifeGalaxyScene.tsx', [
  'xr.isSessionSupported("immersive-vr")',
  'if (cancelled || !immersiveVrSupported) return',
  'VRButton.createButton(gl)',
  'Enter spatial Life Map',
]);

addCheck('Life Map stars expose raycastable XR hit targets while preserving pointer handlers', 'src/components/spatial-life-map/LifeStar.tsx', [
  'lifeMapStarId: star.id',
  'onPointerOver',
  'onPointerOut',
  'onClick',
  'onDoubleClick',
]);

addCheck('Quest controller raycasting and inputs are implemented', 'src/components/spatial-life-map/LifeMapQuestInteraction.tsx', [
  'getController(0)',
  'getController(1)',
  'life-map-quest-controller-ray',
  'selectstart',
  'squeezestart',
  'raycaster.intersectObjects',
  'targetsRef.current[index]',
]);

addCheck('VR-safe panel, fallback copy, and floating menu exist', 'src/components/spatial-life-map/LifeMapQuestInteraction.tsx', [
  'Point + trigger to select. Grip/back to close.',
  'Choose a Life Map star',
  'Quest controllers not detected yet',
  'Life Map VR menu',
  'XR Preview',
  'Close panel',
]);

addCheck('SpatialLifeMap bridges VR selection into existing state and navigation', 'src/components/spatial-life-map/SpatialLifeMap.tsx', [
  'xrPanelStar={selection.selectedStar}',
  'onCloseStarPanel={handleCloseStarPanel}',
  'onNavigate={handleNavigate}',
  'selection.selectStar(star)',
  'setMode("focus")',
]);

addCheck('Life Map unit smoke covers Quest wiring', 'src/components/spatial-life-map/__tests__/LifeMapQuestInteraction.test.ts', [
  'Life Map Quest interaction wiring',
  'does not append the Life Map VR entry until immersive-vr support is proven',
  'provides Quest controller rays, trigger selection, and grip close handling',
]);

addCheck('Life Map Playwright smoke covers route, canvas, mobile, and DOM nav', 'tests/e2e/life-map-quest-interaction.spec.ts', [
  '/life-map desktop loads the existing scene canvas',
  '/life-map mobile loads without blank canvas',
  'canvas.spatial-canvas',
  'life-map-desktop.png',
  'life-map-mobile.png',
]);

const failures = checks.filter((check) => !check.passed);

if (failures.length > 0) {
  console.error('Life Map Quest interaction verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}: missing ${JSON.stringify(failure.pattern)} in ${failure.filePath}`);
  }
  process.exit(1);
}

console.log(`Life Map Quest interaction static verification passed (${checks.length} checks).`);
