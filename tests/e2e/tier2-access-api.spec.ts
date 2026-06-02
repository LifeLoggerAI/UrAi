import { expect, test } from '@playwright/test';

test.describe('Tier-2 access API', () => {
  test('rejects unknown feature ids without exposing Tier-2', async ({ request }) => {
    const response = await request.post('/api/tier-lock/tier2', {
      data: { featureId: 'unknown_feature' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('valid Tier-2 featureId');
  });

  test('returns Tier-1 fallback for anonymous requests', async ({ request }) => {
    const response = await request.post('/api/tier-lock/tier2', {
      data: { featureId: 'personal_life_map' },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.result.featureId).toBe('personal_life_map');
    expect(body.result.decision).toBe('fallback');
    expect(body.result.reason).toBe('anonymous_tier1_only');
    expect(body.result.fallback).toBe('tier1_baseline');
  });
});
