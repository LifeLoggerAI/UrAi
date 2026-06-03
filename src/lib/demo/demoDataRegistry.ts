import type { DemoProfile, DemoRouteConfig, UraiDemoData } from "./demoTypes";

const DEMO_CREATED_AT = "2026-06-03T00:00:00.000Z";

export const DEMO_PROFILES: Record<string, DemoProfile> = {
  public: {
    id: "public",
    mode: "public_demo",
    title: "URAI Genesis",
    subtitle: "Sample Demo",
    description: "A privacy-safe sample view of URAI Genesis.",
    sensitivity: "synthetic",
    createdAt: DEMO_CREATED_AT,
    allowCompanion: true,
    allowLifeMap: true,
    allowGround: true,
    allowMirror: true,
    allowShadow: false,
    allowLegacy: true,
    allowExports: false,
    allowWaitlist: true,
  },
  founder: {
    id: "founder",
    mode: "founder_demo",
    title: "URAI Genesis Demo",
    subtitle: "Founder Demo",
    description: "A sample public view of URAI’s symbolic interface, built around permission, reflection, and user-owned memory.",
    sensitivity: "synthetic",
    createdAt: DEMO_CREATED_AT,
    allowCompanion: true,
    allowLifeMap: true,
    allowGround: true,
    allowMirror: true,
    allowShadow: false,
    allowLegacy: true,
    allowExports: false,
    allowWaitlist: true,
  },
};

export const DEMO_ROUTE_CONFIGS: Record<string, DemoRouteConfig> = {
  demo: { slug: "demo", profileId: "public", publicAccess: true, requiresAuth: false, showFounderBadge: false },
  adamclamp: { slug: "adamclamp", profileId: "founder", publicAccess: true, requiresAuth: false, showFounderBadge: true },
};

export const URAI_DEMO_DATA: UraiDemoData = {
  lifeMapStars: [
    { id: "genesis-opened", title: "Genesis Opened", note: "Sample star — shown to demonstrate the Life Map.", type: "milestone", sample: true },
    { id: "first-root", title: "First Root", note: "Sample star — a first grounded moment in the demo world.", type: "ritual", sample: true },
    { id: "quiet-pattern", title: "A Quiet Pattern", note: "Sample star — a gentle pattern reflection, not a personal claim.", type: "reflection", sample: true },
    { id: "reflection-star", title: "Reflection Star", note: "Sample star — showing how opened layers can become symbolic points.", type: "reflection", sample: true },
    { id: "legacy-seed", title: "Legacy Seed", note: "Sample star — a preview of how chosen moments can be carried forward.", type: "legacy", sample: true },
  ],
  groundElements: [
    { id: "the-first-root", title: "The First Root", note: "Sample Ground element." , sample: true },
    { id: "quiet-soil", title: "Quiet Soil", note: "Sample Ground element showing a calm base layer.", sample: true },
    { id: "small-return", title: "Small Return", note: "Sample Ground element for a gentle ritual return.", sample: true },
    { id: "orb-light", title: "Orb Light", note: "Sample Ground element showing how the orb can respond.", sample: true },
    { id: "recovery-bloom-preview", title: "Recovery Bloom Preview", note: "Sample Ground element, not real recovery data.", sample: true },
  ],
  mirrorReflections: [
    { id: "mirror-sample-1", text: "The mirror is showing how URAI reflects patterns only from opened layers.", source: "sample layers", sample: true },
    { id: "mirror-sample-2", text: "This is a sample reflection, not a personal claim.", source: "sample layers", sample: true },
  ],
  legacyChapters: [
    { id: "a-beginning", title: "A Beginning", summary: "Sample chapter — shown to demonstrate Legacy.", sample: true },
    { id: "what-was-chosen", title: "What Was Chosen", summary: "Sample chapter — only chosen moments are carried forward in a real account.", sample: true },
    { id: "a-saved-moment", title: "A Saved Moment", summary: "Sample chapter — not a private memory.", sample: true },
  ],
  rituals: [
    { id: "demo-breath", title: "One Quiet Breath", prompt: "Take one slow breath and choose one small doorway to open.", sample: true },
    { id: "demo-root", title: "Touch Ground", prompt: "Notice one thing that feels steady, even if it is small.", sample: true },
  ],
  exportExamples: [
    { id: "demo-legacy-scroll", title: "Sample Legacy Scroll", filename: "urai-demo-legacy-scroll-2026-06-03.html", sampleOnly: true, enabled: false },
  ],
  companionStarterMessages: [
    "This demo uses sample stars so you can see how URAI works.",
    "In a real account, Passport controls what I can use.",
    "I can show the Life Map, Ground, Mirror, or Passport.",
  ],
};

export function getDemoProfile(profileId = "public"): DemoProfile {
  return DEMO_PROFILES[profileId] ?? DEMO_PROFILES.public;
}

export function getDemoRouteConfig(slug = "demo"): DemoRouteConfig {
  return DEMO_ROUTE_CONFIGS[slug] ?? DEMO_ROUTE_CONFIGS.demo;
}
