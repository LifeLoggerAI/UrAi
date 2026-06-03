export type UraiDemoMode = "off" | "public_demo" | "founder_demo" | "investor_demo" | "local_preview";
export type DemoDataSensitivity = "safe" | "synthetic" | "redacted" | "private_blocked";

export type DemoProfile = {
  id: string;
  mode: UraiDemoMode;
  title: string;
  subtitle?: string;
  description: string;
  sensitivity: DemoDataSensitivity;
  createdAt: string;
  allowCompanion: boolean;
  allowLifeMap: boolean;
  allowGround: boolean;
  allowMirror: boolean;
  allowShadow: boolean;
  allowLegacy: boolean;
  allowExports: boolean;
  allowWaitlist: boolean;
};

export type DemoRouteConfig = {
  slug: string;
  profileId: string;
  publicAccess: boolean;
  requiresAuth: boolean;
  showFounderBadge: boolean;
};

export type DemoLifeMapStar = { id: string; title: string; note: string; type: "milestone" | "ritual" | "reflection" | "legacy" | "recovery"; sample: true };
export type DemoGroundElement = { id: string; title: string; note: string; sample: true };
export type DemoMirrorReflection = { id: string; text: string; source: "sample layers"; sample: true };
export type DemoLegacyChapter = { id: string; title: string; summary: string; sample: true };
export type DemoRitual = { id: string; title: string; prompt: string; sample: true };
export type DemoExportExample = { id: string; title: string; filename: string; sampleOnly: true; enabled: boolean };

export type UraiDemoData = {
  lifeMapStars: DemoLifeMapStar[];
  groundElements: DemoGroundElement[];
  mirrorReflections: DemoMirrorReflection[];
  legacyChapters: DemoLegacyChapter[];
  rituals: DemoRitual[];
  exportExamples: DemoExportExample[];
  companionStarterMessages: string[];
};
