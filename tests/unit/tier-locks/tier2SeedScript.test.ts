import fs from 'fs';
import path from 'path';

describe('seed-tier2-access.mjs', () => {
  const scriptPath = path.resolve(process.cwd(), 'scripts/seed-tier2-access.mjs');

  it('seeds Tier-2 access data outside the public UI path', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');

    expect(script).toContain('urai-tier2-access-seed.json');
    expect(script).toContain('URAI_TIER2_SEED_UID');
    expect(script).toContain('features');
    expect(script).toContain('userConsents');
    expect(script).toContain('main-urai-app');
    expect(script).not.toContain('src/app/page');
    expect(script).not.toContain('urai-spatial');
  });

  it('includes all Tier-2 feature flag ids used by the evaluator config', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');

    for (const flagId of [
      'tier2.personal_life_map',
      'tier2.memory_stars',
      'tier2.mood_weather',
      'tier2.companion_presence',
      'tier2.ritual_ar_preview',
      'tier2.offline_spatial_cache',
    ]) {
      expect(script).toContain(flagId);
    }
  });

  it('includes all consent sources required by Tier-2 feature gates', () => {
    const script = fs.readFileSync(scriptPath, 'utf8');

    for (const source of [
      'profile',
      'timeline_events',
      'memory_blooms',
      'mood_inference',
      'relationship_signals',
      'rituals',
      'offline_cache',
    ]) {
      expect(script).toContain(source);
    }
  });
});
