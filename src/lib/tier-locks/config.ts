import type { TierLockFeatureConfig, TierLockFeatureId, UraiTier } from './types';

export const TIER_ORDER: UraiTier[] = ['tier1', 'tier2', 'tier3', 'tier4', 'tier5'];

export const TIER2_FEATURES: Record<TierLockFeatureId, TierLockFeatureConfig> = {
  personal_life_map: {
    id: 'personal_life_map',
    publicName: 'Life Map',
    requiredTier: 'tier2',
    requiredConsents: ['profile', 'timeline_events', 'memory_blooms'],
    flagId: 'tier2.personal_life_map',
    fallback: 'tier1_baseline',
    publicCopy: 'Your private Life Map is waiting behind your personal access gate.',
  },
  memory_stars: {
    id: 'memory_stars',
    publicName: 'Memory Stars',
    requiredTier: 'tier2',
    requiredConsents: ['timeline_events', 'memory_blooms'],
    flagId: 'tier2.memory_stars',
    fallback: 'tier1_baseline',
    publicCopy: 'Memory Stars appear only after personal access and consent are active.',
  },
  mood_weather: {
    id: 'mood_weather',
    publicName: 'Mood Weather',
    requiredTier: 'tier2',
    requiredConsents: ['mood_inference'],
    flagId: 'tier2.mood_weather',
    fallback: 'tier1_baseline',
    publicCopy: 'Mood Weather uses permitted personal signals only after consent.',
  },
  companion_presence: {
    id: 'companion_presence',
    publicName: 'Narrator Presence',
    requiredTier: 'tier2',
    requiredConsents: ['profile'],
    flagId: 'tier2.companion_presence',
    fallback: 'tier1_baseline',
    publicCopy: 'Narrator Presence unlocks only after personal access is verified.',
  },
  ritual_ar_preview: {
    id: 'ritual_ar_preview',
    publicName: 'Preview Mode',
    requiredTier: 'tier2',
    requiredConsents: ['rituals'],
    flagId: 'tier2.ritual_ar_preview',
    fallback: 'tier1_baseline',
    publicCopy: 'Preview Mode stays private until access and consent are confirmed.',
  },
  offline_spatial_cache: {
    id: 'offline_spatial_cache',
    publicName: 'Private Offline Cache',
    requiredTier: 'tier2',
    requiredConsents: ['offline_cache'],
    flagId: 'tier2.offline_spatial_cache',
    fallback: 'tier1_baseline',
    publicCopy: 'Offline Cache is disabled until personal access and consent are confirmed.',
  },
};

export function getTierRank(tier: UraiTier): number {
  return TIER_ORDER.indexOf(tier);
}

export function hasTierAtLeast(current: UraiTier | null | undefined, required: UraiTier): boolean {
  if (!current) return false;
  return getTierRank(current) >= getTierRank(required);
}
