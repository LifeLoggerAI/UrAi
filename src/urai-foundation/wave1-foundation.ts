export type UraiWave1Route = {
  path: string;
  label: string;
  purpose: string;
  primary?: boolean;
};

export const URAI_APP_DOMAIN = 'urai.app';
export const URAI_APP_SYSTEM = 'UrAi App';
export const URAI_APP_ACCESS_CLASS = 'public';

export const URAI_APP_BOUNDARY_RULE =
  'urai.app is the UrAi app only: product, Genesis, life-map galaxy, Passport, Mirror, emotional weather, orb companion, early access, and app privacy.';

export const URAI_APP_PUBLIC_ROUTES: UraiWave1Route[] = [
  { path: '/', label: 'Home', purpose: 'Product homepage and emotional life-map entry', primary: true },
  { path: '/genesis', label: 'Genesis', purpose: 'First magical demo and origin experience', primary: true },
  { path: '/life-map', label: 'Life Map', purpose: 'Galaxy, memory stars, and life-map preview', primary: true },
  { path: '/passport', label: 'Passport', purpose: 'Consent, identity, permissions, and data-rights preview', primary: true },
  { path: '/mirror', label: 'Mirror', purpose: 'Cognitive Mirror and Mirror of Becoming preview' },
  { path: '/early-access', label: 'Early Access', purpose: 'App waitlist and launch interest capture', primary: true },
  { path: '/privacy', label: 'Privacy', purpose: 'App-specific privacy explanation' },
  { path: '/terms', label: 'Terms', purpose: 'App-specific terms' },
];

export const URAI_APP_HERO = {
  eyebrow: 'UrAi App',
  headline: 'Your life, mapped as a living galaxy.',
  subheadline:
    'UrAi is a private emotional intelligence companion for memory, mood, relationships, reflection, and becoming.',
  primaryCta: 'Join Early Access',
  secondaryCta: 'Explore Genesis',
};

export const URAI_APP_REQUIRED_SECTIONS = [
  'Orb companion preview',
  'Life-map galaxy preview',
  'Memory stars',
  'Emotional weather',
  'Mirror of Becoming preview',
  'Passport permissions preview',
  'Early access form',
  'Privacy and consent link',
  'Built by URAI Labs footer',
];

export const URAI_APP_ANALYTICS_EVENTS = [
  'urai_app_hero_cta_click',
  'urai_app_genesis_click',
  'urai_app_life_map_click',
  'urai_app_passport_click',
  'urai_app_waitlist_submit',
  'urai_app_privacy_click',
];

export const URAI_APP_WAITLIST_FORM = {
  formType: 'waitlist',
  destinationCollection: 'waitlist',
  sourceDomain: URAI_APP_DOMAIN,
  interestType: 'urai_app_early_access',
  requiredFields: ['name', 'email', 'interestCategory', 'consent'],
};

export const URAI_APP_PRIVACY_LINKS = {
  ecosystemPrivacyCenter: 'https://uraiprivacy.com',
  appPrivacy: '/privacy',
};

export function getUraiAppLaunchChecklist() {
  return [
    'App-only boundary preserved',
    'No studio/client/investor funnel above the fold',
    'Life-map/orb/galaxy visual language present',
    'Early access form captures attribution',
    'Passport copy is launch-safe and implementation-safe',
    'Privacy links visible on every public route',
    'Metadata and OpenGraph complete',
    'Mobile and reduced-motion states reviewed',
    'No placeholder/debug/demo labels visible in production',
  ];
}
