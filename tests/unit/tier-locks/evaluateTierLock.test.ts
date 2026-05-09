import { evaluateTierLock } from '@/lib/tier-locks/evaluateTierLock';
import type { TierLockUserContext } from '@/lib/tier-locks/types';

const baseTier2User: TierLockUserContext = {
  uid: 'user_123',
  entitlementTier: 'tier2',
  acceptedConsents: ['profile', 'timeline_events', 'memory_blooms'],
  enabledFeatureFlags: ['tier2.personal_life_map'],
};

describe('evaluateTierLock', () => {
  it('keeps anonymous users on Tier 1 fallback', () => {
    const result = evaluateTierLock({
      featureId: 'personal_life_map',
      user: {
        acceptedConsents: ['profile', 'timeline_events', 'memory_blooms'],
        enabledFeatureFlags: ['tier2.personal_life_map'],
      },
    });

    expect(result.decision).toBe('fallback');
    expect(result.reason).toBe('anonymous_tier1_only');
    expect(result.fallback).toBe('tier1_baseline');
    expect(result.shouldAudit).toBe(true);
  });

  it('falls back when the feature flag is not enabled', () => {
    const result = evaluateTierLock({
      featureId: 'personal_life_map',
      user: { ...baseTier2User, enabledFeatureFlags: [] },
    });

    expect(result.decision).toBe('fallback');
    expect(result.reason).toBe('missing_feature_flag');
    expect(result.missingFeatureFlags).toEqual(['tier2.personal_life_map']);
  });

  it('falls back when consent is missing', () => {
    const result = evaluateTierLock({
      featureId: 'personal_life_map',
      user: { ...baseTier2User, acceptedConsents: ['profile'] },
    });

    expect(result.decision).toBe('fallback');
    expect(result.reason).toBe('missing_consent');
    expect(result.missingConsents).toEqual(['timeline_events', 'memory_blooms']);
  });

  it('falls back when entitlement is below the required tier', () => {
    const result = evaluateTierLock({
      featureId: 'personal_life_map',
      user: { ...baseTier2User, entitlementTier: 'tier1' },
    });

    expect(result.decision).toBe('fallback');
    expect(result.reason).toBe('missing_entitlement');
  });

  it('allows access only when auth, flag, consent, and entitlement are present', () => {
    const result = evaluateTierLock({
      featureId: 'personal_life_map',
      user: baseTier2User,
    });

    expect(result.decision).toBe('allow');
    expect(result.reason).toBe('allowed');
    expect(result.shouldAudit).toBe(false);
  });

  it('allows admin override but still marks the decision for audit', () => {
    const result = evaluateTierLock({
      featureId: 'mood_weather',
      user: {
        uid: 'admin_123',
        entitlementTier: 'tier1',
        acceptedConsents: [],
        enabledFeatureFlags: [],
        isAdminOverride: true,
      },
    });

    expect(result.decision).toBe('allow');
    expect(result.reason).toBe('admin_override');
    expect(result.shouldAudit).toBe(true);
  });
});
