import { URAI_CINEMATIC_TRANSITIONS } from '@/lib/urai-canon/cinematic-controller';
import { URAI_PERMISSION_MATRIX, URAI_SOURCE_OF_TRUTH_RULES } from '@/lib/urai/contracts/systemContracts';
import { URAI_DIRECT_ROUTE_CONTRACTS, URAI_TRANSITION_CONTRACTS } from '@/lib/urai/contracts/routeContracts';

describe('URAI system contracts', () => {
  test('protects private safety states', () => {
    expect(URAI_PERMISSION_MATRIX.sensitive.aiReadable).toBe(false);
    expect(URAI_PERMISSION_MATRIX.vaulted.aiReadable).toBe(false);
    expect(URAI_PERMISSION_MATRIX.deleted.visibleInMap).toBe(false);
    expect(URAI_PERMISSION_MATRIX.deleted.analyticsAllowed).toBe(false);
  });

  test('keeps state ownership centralized', () => {
    expect(URAI_SOURCE_OF_TRUTH_RULES.routeStateOwner).toBe('route-state-machine');
    expect(URAI_SOURCE_OF_TRUTH_RULES.cameraStateOwner).toBe('camera-controller');
    expect(URAI_SOURCE_OF_TRUTH_RULES.visibilityOwner).toBe('permission-layer');
    expect(URAI_SOURCE_OF_TRUTH_RULES.aiOwnsSuggestionsOnly).toBe(true);
  });

  test('required direct routes are recoverable', () => {
    const requiredRoutes = ['/home', '/life-map', '/life-map/star/[starId]', '/focus', '/focus/session/[sessionId]', '/replay', '/replay/[replayId]', '/ochat'];
    for (const pathPattern of requiredRoutes) {
      const contract = URAI_DIRECT_ROUTE_CONTRACTS.find((route) => route.pathPattern === pathPattern);
      expect(contract).toBeDefined();
      expect(contract?.directLoad).toBe(true);
      expect(contract?.refreshSafe).toBe(true);
      expect(contract?.loadingState).toBe(true);
      expect(contract?.errorState).toBe(true);
      expect(contract?.emptyState).toBe(true);
    }
  });

  test('cinematic transitions use canonical ids and input unlock timing', () => {
    const transitionsById = Object.fromEntries(URAI_TRANSITION_CONTRACTS.map((transition) => [transition.id, transition]));
    expect(Object.keys(transitionsById)).toEqual(expect.arrayContaining(['homeToLifeMap', 'lifeMapStarToFocus', 'focusToReplay', 'replayToFocusEsc', 'focusToLifeMapEsc', 'lifeMapToHome', 'homeToOchat', 'ochatToHome']));
    expect(transitionsById.homeToLifeMap.inputLockedMs).toBe(URAI_CINEMATIC_TRANSITIONS.homeToLifeMap.inputUnlockAtMs);
    expect(transitionsById.lifeMapStarToFocus.inputLockedMs).toBe(URAI_CINEMATIC_TRANSITIONS.lifeMapStarToFocus.inputUnlockAtMs);
    expect(transitionsById.focusToReplay.inputLockedMs).toBe(URAI_CINEMATIC_TRANSITIONS.focusToReplay.inputUnlockAtMs);
    expect(transitionsById.replayToFocusEsc.inputLockedMs).toBe(URAI_CINEMATIC_TRANSITIONS.replayToFocusEsc.inputUnlockAtMs);
    expect(transitionsById.focusToLifeMapEsc.inputLockedMs).toBe(URAI_CINEMATIC_TRANSITIONS.focusToLifeMapEsc.inputUnlockAtMs);
    expect(transitionsById.lifeMapToHome.inputLockedMs).toBe(URAI_CINEMATIC_TRANSITIONS.lifeMapToHome.inputUnlockAtMs);
    for (const transition of URAI_TRANSITION_CONTRACTS) {
      expect(transition.inputLockedMs).toBeGreaterThan(0);
      expect(transition.escapeBehavior.length).toBeGreaterThan(0);
      expect(transition.mobileBackBehavior.length).toBeGreaterThan(0);
    }
  });
});
