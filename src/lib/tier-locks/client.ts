export { TIER2_FEATURES, TIER_ORDER, getTierRank, hasTierAtLeast } from './config';
export { evaluateTierLock } from './evaluateTierLock';
export { requestTier2AccessLock } from './requestTier2AccessLock';
export { useTier2AccessLock } from './useTier2AccessLock';
export type { RequestTier2AccessLockOptions, Tier2AccessLockResponse } from './requestTier2AccessLock';
export type { UseTier2AccessLockOptions, UseTier2AccessLockResult } from './useTier2AccessLock';
export type {
  ConsentSource,
  TierLockAuditEvent,
  TierLockDecision,
  TierLockEvaluationInput,
  TierLockEvaluationResult,
  TierLockFallback,
  TierLockFeatureConfig,
  TierLockFeatureId,
  TierLockReason,
  TierLockUserContext,
  UraiTier,
} from './types';
