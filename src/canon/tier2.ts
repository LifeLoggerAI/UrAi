export const TIER2_CANON = {
  id: 'tier2-system-canon',
  name: 'Tier 2 System Canon',
  status: 'protected',
  review: 'architecture_required',
  dependsOn: ['tier1-foundation'],
  mayRedefineTier1: false,
  mayBypassTier1: false,
  systems: [
    'spatial',
    'privacy',
    'admin',
    'foundation',
    'studio',
    'companion',
    'memory',
    'scrolls',
    'rituals',
    'narrator',
    'emotional_os',
    'symbolic_os',
    'consent_data_licensing',
    'relationship_intelligence',
    'forecast',
    'cognitive_mirror',
  ],
  rule:
    'Tier 2 may depend on Tier 1, but must not redefine, weaken, duplicate, or bypass Tier 1.',
} as const;

export type Tier2Canon = typeof TIER2_CANON;
