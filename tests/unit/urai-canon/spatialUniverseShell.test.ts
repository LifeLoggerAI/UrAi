import { resolveSpatialUniverseShellModel } from '@/components/urai/SpatialUniverseShell';
import { resolveSpatialUniverseState } from '@/components/urai/SpatialUniverseProvider';

describe('SpatialUniverseShell model', () => {
  test('describes home as a persistent spatial shell without return link', () => {
    const model = resolveSpatialUniverseShellModel(resolveSpatialUniverseState('/home'));
    expect(model.label).toContain('home');
    expect(model.primaryObject).toBe('world-orb');
    expect(model.returnHomeHref).toBeNull();
    expect(model.mobileSafe).toBe(false);
    expect(model.reducedMotion).toBe(false);
  });

  test('exposes return-home and quality guarantees for child routes', () => {
    const model = resolveSpatialUniverseShellModel(resolveSpatialUniverseState('/ochat', 'mobile-safe'));
    expect(model.route).toBe('/ochat');
    expect(model.mode).toBe('ochat');
    expect(model.primaryObject).toBe('companion-orb');
    expect(model.returnHomeHref).toBe('/home');
    expect(model.mobileSafe).toBe(true);
  });

  test('marks reduced-motion as mobile-safe equivalent', () => {
    const model = resolveSpatialUniverseShellModel(resolveSpatialUniverseState('/replay/replay-1', 'reduced-motion'));
    expect(model.reducedMotion).toBe(true);
    expect(model.mobileSafe).toBe(true);
    expect(model.ariaLabel).toContain('reduced-motion');
  });
});
