import { requestTier2AccessLock } from '@/lib/tier-locks/requestTier2AccessLock';

function mockFetch(body: unknown, ok = true) {
  return jest.fn().mockResolvedValue({
    ok,
    json: jest.fn().mockResolvedValue(body),
  });
}

describe('requestTier2AccessLock', () => {
  it('posts the featureId to the Tier-2 access endpoint', async () => {
    const fetchImpl = mockFetch({ ok: true, result: { decision: 'allow' } });

    await requestTier2AccessLock({
      featureId: 'personal_life_map',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(fetchImpl).toHaveBeenCalledWith('/api/tier-lock/tier2', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ featureId: 'personal_life_map' }),
    });
  });

  it('adds a bearer token when provided', async () => {
    const fetchImpl = mockFetch({ ok: true, result: { decision: 'allow' } });

    await requestTier2AccessLock({
      featureId: 'memory_stars',
      idToken: 'test-token',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(fetchImpl).toHaveBeenCalledWith('/api/tier-lock/tier2', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer test-token',
      },
      body: JSON.stringify({ featureId: 'memory_stars' }),
    });
  });

  it('normalizes error responses', async () => {
    const fetchImpl = mockFetch({ error: 'bad request' }, false);

    const response = await requestTier2AccessLock({
      featureId: 'mood_weather',
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(response).toEqual({ ok: false, error: 'bad request' });
  });
});
