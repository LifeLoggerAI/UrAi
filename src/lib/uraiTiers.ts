export type UraiTierId = 'tier-1' | 'tier-2' | 'tier-3' | 'tier-4' | 'tier-5';

export type UraiTier = {
  id: UraiTierId;
  label: string;
  name: string;
  promise: string;
  canonicalPath: string;
  status: 'live' | 'gated' | 'admin';
  modules: string[];
  permissions: string[];
  experience: string[];
};

export const uraiTiers: UraiTier[] = [
  {
    id: 'tier-1',
    label: 'Tier 1',
    name: 'Genesis Home',
    promise: 'The polished public spatial shell: orb, sky, ground, memory gateway, and canonical onboarding path.',
    canonicalPath: '/app/home',
    status: 'live',
    modules: ['Spatial Home', 'Orb Companion', 'Sky Shrine', 'Ground Layer', 'Passport Entry'],
    permissions: ['Basic app session', 'Optional profile context', 'Privacy-first defaults'],
    experience: ['3D-feeling magical home', 'Minimal polished UI', 'No debug or placeholder language'],
  },
  {
    id: 'tier-2',
    label: 'Tier 2',
    name: 'Cognitive Mirror',
    promise: 'Personal reflection, mood weather, timeline, focus, and symbolic self-understanding.',
    canonicalPath: '/app/mirror',
    status: 'gated',
    modules: ['Cognitive Mirror', 'Mood Weather', 'Focus Mode', 'Replay', 'Journal'],
    permissions: ['Reflection data', 'Timeline state', 'Mood and rhythm signals'],
    experience: ['Daily mirror view', 'Reflection cards', 'Mood-linked visual states'],
  },
  {
    id: 'tier-3',
    label: 'Tier 3',
    name: 'Life Map',
    promise: 'The galaxy-scale life map: stars, constellations, rituals, scrolls, and symbolic playback.',
    canonicalPath: '/app/life-map',
    status: 'gated',
    modules: ['Life Map', 'Memory Stars', 'Constellations', 'Rituals', 'Scrolls'],
    permissions: ['Memory graph', 'Symbolic timeline', 'Relationship context'],
    experience: ['Zoomable life galaxy', 'Memory star navigation', 'Scroll-style replay'],
  },
  {
    id: 'tier-4',
    label: 'Tier 4',
    name: 'Spatial Universe',
    promise: 'Spatial, AR, VR, XR, cinematic playback, and embodied companion environments.',
    canonicalPath: '/spatial',
    status: 'gated',
    modules: ['Spatial Universe', 'AR Portal', 'VR Dream Planetarium', 'XR Scenes', 'Companion Avatar'],
    permissions: ['Spatial consent', 'Device capability state', 'Immersive environment settings'],
    experience: ['World-orb environment', 'Scene portals', 'Immersive companion transitions'],
  },
  {
    id: 'tier-5',
    label: 'Tier 5',
    name: 'Council / Admin / Enterprise',
    promise: 'Advanced governance, exports, marketplace, admin, privacy ops, and system-of-systems control.',
    canonicalPath: '/admin/system',
    status: 'admin',
    modules: ['Council', 'Admin System', 'Exports', 'Marketplace', 'Privacy Operations'],
    permissions: ['Admin access', 'Export controls', 'System flags', 'Audit trails'],
    experience: ['Command center', 'Tier locks', 'Governance controls', 'Deployment readiness'],
  },
];

export function getUraiTier(id: UraiTierId) {
  return uraiTiers.find((tier) => tier.id === id);
}
