'use client';

import { useEffect, useMemo, useState } from 'react';
import { requestTier2AccessLock } from './requestTier2AccessLock';
import type { TierLockEvaluationResult, TierLockFeatureId } from './types';

export type UseTier2AccessLockOptions = {
  featureId: TierLockFeatureId;
  idToken?: string | null;
  enabled?: boolean;
};

export type UseTier2AccessLockResult = {
  loading: boolean;
  error: string | null;
  result: TierLockEvaluationResult | null;
  allowed: boolean;
  fallback: boolean;
  refresh: () => void;
};

export function useTier2AccessLock({
  featureId,
  idToken,
  enabled = true,
}: UseTier2AccessLockOptions): UseTier2AccessLockResult {
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TierLockEvaluationResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setLoading(false);
      setError(null);
      setResult(null);
      return () => {
        cancelled = true;
      };
    }

    setLoading(true);
    setError(null);

    requestTier2AccessLock({ featureId, idToken })
      .then((response) => {
        if (cancelled) return;
        if (!response.ok || !response.result) {
          setError(response.error ?? 'Unable to evaluate Tier-2 access lock.');
          setResult(null);
          return;
        }
        setResult(response.result);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to evaluate Tier-2 access lock.');
          setResult(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, featureId, idToken, refreshNonce]);

  return useMemo(
    () => ({
      loading,
      error,
      result,
      allowed: result?.decision === 'allow',
      fallback: !result || result.decision === 'fallback',
      refresh: () => setRefreshNonce((current) => current + 1),
    }),
    [error, loading, result]
  );
}
