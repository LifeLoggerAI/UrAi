import type { UraiDemoProfile } from "@/lib/urai-v1-schemas";

const baseDate = new Date("2026-05-06T12:00:00.000Z");

function daysAgo(days: number): string {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

export const adamClampDemoProfile: UraiDemoProfile = {
  user: {
    id: "demo-adam-clamp",
    handle: "adamclamp",
    displayName: "Adam Clamp",
    tagline: "Building URAI as a passive emotional operating system.",
    currentTone: "focused",
    companionName: "URAI Companion",
    createdAt: daysAgo(21)
  },
  symbolicState: {
    id: "symbolic-demo-adam",
    userId: "demo-adam-clamp",
    skyState: "stars",
    groundTier: 4,
    aura: "violet-gold",
    companionState: "guiding"
  },
  moodForecast: {
    id: "forecast-demo-adam",
    userId: "demo-adam-clamp",
    generatedAt: baseDate.toISOString(),
    rhythmState: "recovering",
    summary: "Calm focus is rising after a heavy build cycle. The next 24 hours favor implementation over ideation.",
    confidence: 0.82,
    nextBestAction: "Ship one visible demo loop before adding another advanced feature."
  },
  weeklyReflection: {
    id: "weekly-demo-adam",
    userId: "demo-adam-clamp",
    weekOf: "2026-05-04",
    title: "The week the blueprint became buildable",
    highlights: [
      "Locked the master completion prompt into the repo.",
      "Shifted from vision expansion to implementation spine.",
      "Prioritized demo, schemas, narrator, and public launch route."
    ],
    narratorSummary:
      "This week was not about adding more ideas. It was about turning the constellation into a path someone can walk."
  },
  memoryBlooms: [
    {
      id: "bloom-001",
      userId: "demo-adam-clamp",
      title: "Blueprint Locked",
      summary: "The complete URAI master prompt moved from chat into the repo as a permanent build artifact.",
      emotionalTone: "focused",
      symbolicTags: ["focus", "bloom"],
      narratorLine: "You stopped carrying the whole system in your head and gave it a foundation."
    },
    {
      id: "bloom-002",
      userId: "demo-adam-clamp",
      title: "Demo Spine Chosen",
      summary: "The next implementation path became clear: public route, companion flow, forecast, reflection, seed data.",
      emotionalTone: "recovering",
      symbolicTags: ["recovery", "companion"],
      narratorLine: "A product becomes real when a stranger can feel it in one minute."
    },
    {
      id: "bloom-003",
      userId: "demo-adam-clamp",
      title: "Launch Signal",
      summary: "The build direction narrowed toward waitlist, demo readiness, and deployment gates.",
      emotionalTone: "threshold",
      symbolicTags: ["threshold", "ritual"],
      narratorLine: "This is the edge where vision has to become rhythm."
    }
  ],
  timelineEvents: [
    {
      id: "star-001",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(0),
      title: "Implementation spine started",
      detail: "Moved from architecture into repo-backed demo work.",
      emotionalTone: "focused",
      symbolicTags: ["focus"],
      intensity: 0.92,
      bloomId: "bloom-002"
    },
    {
      id: "star-002",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(1),
      title: "Master prompt committed",
      detail: "URAI completion directive became a versioned repo artifact.",
      emotionalTone: "celebratory",
      symbolicTags: ["bloom", "ritual"],
      intensity: 0.86,
      bloomId: "bloom-001"
    },
    {
      id: "star-003",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(2),
      title: "Build path clarified",
      detail: "Prioritized demo, schemas, seed data, narrator, and waitlist.",
      emotionalTone: "focused",
      symbolicTags: ["focus"],
      intensity: 0.8
    },
    {
      id: "star-004",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(3),
      title: "Ground system stabilized",
      detail: "The symbolic ground layer began representing recovery and vitality tiers.",
      emotionalTone: "recovering",
      symbolicTags: ["recovery"],
      intensity: 0.68
    },
    {
      id: "star-005",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(4),
      title: "Narrator voice refined",
      detail: "The companion tone shifted toward gentle but execution-focused guidance.",
      emotionalTone: "tender",
      symbolicTags: ["companion"],
      intensity: 0.74
    },
    {
      id: "star-006",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(5),
      title: "Forecast became practical",
      detail: "Mood forecasting moved from concept to a visible card users can understand.",
      emotionalTone: "calm",
      symbolicTags: ["focus"],
      intensity: 0.63
    },
    {
      id: "star-007",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(6),
      title: "Weekly reflection framed",
      detail: "The product began translating build progress into narrative memory.",
      emotionalTone: "social",
      symbolicTags: ["ritual"],
      intensity: 0.58
    },
    {
      id: "star-008",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(7),
      title: "Threshold mode surfaced",
      detail: "URAI recognized the transition from ideation into launch pressure.",
      emotionalTone: "threshold",
      symbolicTags: ["threshold"],
      intensity: 0.78,
      bloomId: "bloom-003"
    },
    {
      id: "star-009",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(8),
      title: "Public route imagined",
      detail: "The demo path centered on a shareable public life constellation.",
      emotionalTone: "focused",
      symbolicTags: ["social"],
      intensity: 0.7
    },
    {
      id: "star-010",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(9),
      title: "Memory bloom language sharpened",
      detail: "Recovery, focus, and symbolic milestones became easier to render visually.",
      emotionalTone: "recovering",
      symbolicTags: ["recovery", "bloom"],
      intensity: 0.66
    },
    {
      id: "star-011",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(10),
      title: "Launch gates defined",
      detail: "Typecheck, build, preflight, and tier locks became the standard for done.",
      emotionalTone: "focused",
      symbolicTags: ["focus"],
      intensity: 0.77
    },
    {
      id: "star-012",
      userId: "demo-adam-clamp",
      occurredAt: daysAgo(11),
      title: "Waitlist became essential",
      detail: "The next product milestone became capturing demand before deeper feature expansion.",
      emotionalTone: "social",
      symbolicTags: ["social"],
      intensity: 0.72
    }
  ]
};

export function getDemoProfileByHandle(handle: string): UraiDemoProfile {
  const normalized = handle.replace(/^@/, "").toLowerCase();
  if (normalized === adamClampDemoProfile.user.handle) return adamClampDemoProfile;
  return {
    ...adamClampDemoProfile,
    user: {
      ...adamClampDemoProfile.user,
      id: `demo-${normalized}`,
      handle: normalized || "guest",
      displayName: normalized ? `@${normalized}` : "URAI Guest"
    }
  };
}
