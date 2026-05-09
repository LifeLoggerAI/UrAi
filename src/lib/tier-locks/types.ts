export type UraiTier = 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5';

export type TierLockDecision = 'allow' | 'fallback';

export type TierLockReason =
  | 'anonymous_tier1_only'
  | 'missing_feature_flag'
  | 'missing_consent'
  | 'missing_entitlement'
  | 'admin_override'
  | 'allowed';

export type TierLockFallback = 'tier1_baseline';

export type TierLockFeatureId =
  | 'personal_life_map'
  | 'memory_stars'
  | 'mood_weather'
  | 'companion_presence'
  | 'ritual_ar_preview'
  | 'offline_spatial_cache';

export type ConsentSource =
  | 'profile'
  | 'timeline_events'
  | 'memory_blooms'
  | 'mood_inference'
  | 'relationship_signals'
  | 'rituals'
  | 'offline_cache';

export interface TierLockFeatureConfig {
  id: TierLockFeatureId;
  publicName: string;
  requiredTier: UraiTier;
  requiredConsents: ConsentSource[];
  flagId: string;
  fallback: TierLockFallback;
  publicCopy: string;
}

export interface TierLockUserContext {
  uid?: string | null;
  entitlementTier?: UraiTier | null;
  acceptedConsents?: ConsentSource[];
  enabledFeatureFlags?: string[];
  isAdminOverride?: boolean;
}

export interface TierLockEvaluationInput {
  featureId: TierLockFeatureId;
  user: TierLockUserContext;
  nowIso?: string;
}

export interface TierLockEvaluationResult {
  featureId: TierLockFeatureId;
  decision: TierLockDecision;
  reason: TierLockReason;
  fallback: TierLockFallback;
  requiredTier: UraiTier;
  effectiveTier: UraiTier;
  missingConsents: ConsentSource[];
  missingFeatureFlags: string[];
  shouldAudit: boolean;
  publicMessage: string;
}

export interface TierLockAuditEvent {
  ownerUid?: string | null;
  featureId: TierLockFeatureId;
  decision: TierLockDecision;
  reason: TierLockReason;
  effectiveTier: UraiTier;
  createdAtIso: string;
}
