import { TIER2_FEATURES, hasTierAtLeast } from './config';
import type {
  ConsentSource,
  TierLockEvaluationInput,
  TierLockEvaluationResult,
  UraiTier,
} from './types';

const TIER1: UraiTier = 'tier1';

function unique<T>(items: T[] | undefined): T[] {
  return Array.from(new Set(items ?? []));
}

function missingConsents(required: ConsentSource[], accepted: ConsentSource[] | undefined): ConsentSource[] {
  const acceptedSet = new Set(accepted ?? []);
  return required.filter((source) => !acceptedSet.has(source));
}

export function evaluateTierLock(input: TierLockEvaluationInput): TierLockEvaluationResult {
  const feature = TIER2_FEATURES[input.featureId];
  const user = input.user;
  const effectiveTier = user.entitlementTier ?? TIER1;
  const missingFeatureFlags = unique(user.enabledFeatureFlags).includes(feature.flagId) ? [] : [feature.flagId];
  const consentGaps = missingConsents(feature.requiredConsents, user.acceptedConsents);

  if (user.isAdminOverride) {
    return {
      featureId: feature.id,
      decision: 'allow',
      reason: 'admin_override',
      fallback: feature.fallback,
      requiredTier: feature.requiredTier,
      effectiveTier,
      missingConsents: consentGaps,
      missingFeatureFlags,
      shouldAudit: true,
      publicMessage: feature.publicCopy,
    };
  }

  if (!user.uid) {
    return {
      featureId: feature.id,
      decision: 'fallback',
      reason: 'anonymous_tier1_only',
      fallback: feature.fallback,
      requiredTier: feature.requiredTier,
      effectiveTier: TIER1,
      missingConsents: consentGaps,
      missingFeatureFlags,
      shouldAudit: true,
      publicMessage: feature.publicCopy,
    };
  }

  if (missingFeatureFlags.length > 0) {
    return {
      featureId: feature.id,
      decision: 'fallback',
      reason: 'missing_feature_flag',
      fallback: feature.fallback,
      requiredTier: feature.requiredTier,
      effectiveTier,
      missingConsents: consentGaps,
      missingFeatureFlags,
      shouldAudit: true,
      publicMessage: feature.publicCopy,
    };
  }

  if (consentGaps.length > 0) {
    return {
      featureId: feature.id,
      decision: 'fallback',
      reason: 'missing_consent',
      fallback: feature.fallback,
      requiredTier: feature.requiredTier,
      effectiveTier,
      missingConsents: consentGaps,
      missingFeatureFlags,
      shouldAudit: true,
      publicMessage: feature.publicCopy,
    };
  }

  if (!hasTierAtLeast(effectiveTier, feature.requiredTier)) {
    return {
      featureId: feature.id,
      decision: 'fallback',
      reason: 'missing_entitlement',
      fallback: feature.fallback,
      requiredTier: feature.requiredTier,
      effectiveTier,
      missingConsents: [],
      missingFeatureFlags: [],
      shouldAudit: true,
      publicMessage: feature.publicCopy,
    };
  }

  return {
    featureId: feature.id,
    decision: 'allow',
    reason: 'allowed',
    fallback: feature.fallback,
    requiredTier: feature.requiredTier,
    effectiveTier,
    missingConsents: [],
    missingFeatureFlags: [],
    shouldAudit: false,
    publicMessage: feature.publicCopy,
  };
}
