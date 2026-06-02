import { resolveSpatialUniverseState, URAI_SPATIAL_ROUTE_PATTERNS } from '@/components/urai/SpatialUniverseProvider';

describe('SpatialUniverseProvider state resolver', () => {
  test('normalizes direct routes into canonical spatial runtime state', () => {
    expect(resolveSpatialUniverseState('/').route).toBe('/home');
    expect(resolveSpatialUniverseState('/home').mode).toBe('home');
    expect(resolveSpatialUniverseState('/life-map').mode).toBe('life-map');
    expect(resolveSpatialUniverseState('/life-map/star/star-1').route).toBe('/life-map/star/[starId]');
    expect(resolveSpatialUniverseState('/focus/session/session-1').route).toBe('/focus/session/[sessionId]');
    expect(resolveSpatialUniverseState('/replay/replay-1').route).toBe('/replay/[replayId]');
    expect(resolveSpatialUniverseState('/ochat').mode).toBe('ochat');
  });

  test('every spatial route exposes required recovery guarantees', () => {
    for (const path of URAI_SPATIAL_ROUTE_PATTERNS) {
      const state = resolveSpatialUniverseState(path);
      expect(state.directLoadSafe).toBe(true);
      expect(state.loadingState).toBe(true);
      expect(state.emptyState).toBe(true);
      expect(state.errorState).toBe(true);
    }
  });

  test('uses mobile and reduced-motion quality profiles without changing route identity', () => {
    const mobile = resolveSpatialUniverseState('/life-map/star/star-1', 'mobile-safe');
    const reduced = resolveSpatialUniverseState('/replay/replay-1', 'reduced-motion');

    expect(mobile.route).toBe('/life-map/star/[starId]');
    expect(mobile.qualityProfile).toBe('mobile-safe');
    expect(reduced.route).toBe('/replay/[replayId]');
    expect(reduced.qualityProfile).toBe('reduced-motion');
  });
});
