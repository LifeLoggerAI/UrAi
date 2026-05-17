import type { TierLockEvaluationResult, TierLockFeatureId } from './types';

export type Tier2AccessLockResponse = {
  ok: boolean;
  mode?: 'firebase-admin' | 'dry-run';
  result?: TierLockEvaluationResult;
  error?: string;
};

export type RequestTier2AccessLockOptions = {
  featureId: TierLockFeatureId;
  idToken?: string | null;
  fetchImpl?: typeof fetch;
};

export async function requestTier2AccessLock({
  featureId,
  idToken,
  fetchImpl = fetch,
}: RequestTier2AccessLockOptions): Promise<Tier2AccessLockResponse> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };

  if (idToken) headers.authorization = `Bearer ${idToken}`;

  const response = await fetchImpl('/api/tier-lock/tier2', {
    method: 'POST',
    headers,
    body: JSON.stringify({ featureId }),
  });

  const payload = (await response.json()) as Tier2AccessLockResponse;
  if (!response.ok) {
    return {
      ok: false,
      error: payload.error ?? 'Unable to evaluate Tier-2 access lock.',
    };
  }

  return payload;
}
