import fs from 'fs';
import path from 'path';

describe('tier2-access-check.mjs', () => {
  const scriptPath = path.resolve(process.cwd(), 'scripts/tier-lock/tier2-access-check.mjs');
  const packagePath = path.resolve(process.cwd(), 'package.json');

  it('is exposed through package scripts', () => {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    expect(packageJson.scripts['check:tier2-access']).toBe('node scripts/tier-lock/tier2-access-check.mjs');
  });

  it('requires the Tier-2 access files that keep the layer cohesive', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');

    for (const requiredFile of [
      'src/lib/tier-locks/types.ts',
      'src/lib/tier-locks/config.ts',
      'src/lib/tier-locks/evaluateTierLock.ts',
      'src/lib/tier-locks/requestTier2AccessLock.ts',
      'src/lib/tier-locks/useTier2AccessLock.ts',
      'src/app/api/tier-lock/tier2/route.ts',
      'docs/TIER_2_ACCESS_LOCKS.md',
      'docs/TIER_2_ACCESS_API_CONTRACT.md',
    ]) {
      expect(script).toContain(requiredFile);
    }
  });

  it('blocks old spatial-specific filenames in the main URAI app repo', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');

    for (const forbiddenFile of [
      'src/app/api/tier-lock/spatial/route.ts',
      'docs/SPATIAL_TIER_LOCKS.md',
      'docs/SPATIAL_LOCK_MATRIX.md',
      'docs/SPATIAL_LOCK_QA_CHECKLIST.md',
    ]) {
      expect(script).toContain(forbiddenFile);
    }
  });

  it('blocks public Tier-1 UI wiring before Tier-1 is sealed', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');

    for (const forbiddenTerm of [
      'useTier2AccessLock',
      'requestTier2AccessLock',
      '/api/tier-lock/tier2',
      'tier2_access_lock',
    ]) {
      expect(script).toContain(forbiddenTerm);
    }
  });
});
