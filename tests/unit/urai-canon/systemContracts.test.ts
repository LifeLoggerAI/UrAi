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
    const requiredRoutes = ['/home', '/life-map', '/life-map/star/:starId', '/focus', '/focus/session/:sessionId', '/replay', '/replay/:replayId'];
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

  test('cinematic transitions define escape and mobile back behavior', () => {
    expect(URAI_TRANSITION_CONTRACTS.map((transition) => transition.id)).toEqual(expect.arrayContaining(['home-to-life-map', 'life-map-to-focus', 'focus-to-replay', 'replay-to-focus', 'focus-to-life-map', 'life-map-to-home']));
    for (const transition of URAI_TRANSITION_CONTRACTS) {
      expect(transition.inputLockedMs).toBeGreaterThan(0);
      expect(transition.escapeBehavior.length).toBeGreaterThan(0);
      expect(transition.mobileBackBehavior.length).toBeGreaterThan(0);
    }
  });
});
