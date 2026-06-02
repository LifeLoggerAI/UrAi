import fs from 'fs';
import path from 'path';

describe('Tier-2 access CI guardrail', () => {
  const packagePath = path.resolve(process.cwd(), 'package.json');

  it('runs the Tier-2 access invariant check before build in ci', () => {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const ci = packageJson.scripts.ci as string;

    expect(ci).toContain('npm run check:tier2-access');
    expect(ci.indexOf('npm run check:tier2-access')).toBeLessThan(ci.indexOf('npm run build'));
  });

  it('keeps the Tier-2 access check as a dedicated script', () => {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    expect(packageJson.scripts['check:tier2-access']).toBe('node scripts/tier-lock/tier2-access-check.mjs');
  });
});
