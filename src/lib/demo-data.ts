import type { UraiDemoProfile } from "@/lib/urai-v1-schemas";

const DEMO_OWNER_UID = "demo-adam-clamp";
const baseDate = new Date("2026-05-06T12:00:00.000Z");

function daysAgo(days: number): string {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

function owned() {
  return { ownerUid: DEMO_OWNER_UID, userId: DEMO_OWNER_UID };
}

export const adamClampDemoProfile: UraiDemoProfile = {
  user: {
    id: DEMO_OWNER_UID,
    handle: "adamclamp",
    displayName: "Adam Clamp",
    tagline: "Exploring URAI as a private emotional constellation.",
    currentTone: "focused",
    companionName: "URAI Companion",
    createdAt: daysAgo(21)
  },
  symbolicState: {
    id: "symbolic-demo-adam",
    ...owned(),
    skyState: "stars",
    groundTier: 4,
    aura: "violet-gold",
    companionState: "guiding"
  },
  moodForecast: {
    id: "forecast-demo-adam",
    ...owned(),
    generatedAt: baseDate.toISOString(),
    rhythmState: "recovering",
    summary:
      "Your recent rhythm suggests calm focus is returning after a heavier emotional stretch. This demo forecast is based on sample signals, not private user data.",
    confidence: 0.82,
    nextBestAction: "Protect one quiet work block today before adding another demand to the system."
  },
  weeklyReflection: {
    id: "weekly-demo-adam",
    ...owned(),
    weekOf: "2026-05-04",
    title: "The week you became more readable to yourself",
    highlights: [
      "Recovery signals rose after several high-pressure days.",
      "Focus became steadier when the day had fewer competing inputs.",
      "The clearest pattern was simple: protect rhythm before chasing expansion."
    ],
    narratorSummary:
      "This sample reflection shows how URAI turns a week of mood, memory, and behavior signals into a story you can understand without reading raw data."
  },
  memoryBlooms: [
    {
      id: "bloom-001",
      ...owned(),
      title: "Recovery Pattern Appeared",
      summary: "A calmer rhythm returned after several overloaded days, creating a visible recovery bloom in the Life Map.",
      emotionalTone: "recovering",
      symbolicTags: ["recovery", "bloom"],
      narratorLine: "You began returning to yourself when the noise became quieter."
    },
    {
      id: "bloom-002",
      ...owned(),
      title: "Focus Became Steadier",
      summary: "The constellation shows fewer scattered signals and a stronger center of attention across the week.",
      emotionalTone: "focused",
      symbolicTags: ["focus", "companion"],
      narratorLine: "A pattern becomes useful when it helps you protect what is working."
    },
    {
      id: "bloom-003",
      ...owned(),
      title: "Threshold Moment",
      summary: "A transition point appeared where pressure shifted from invisible stress into a pattern that could be named.",
      emotionalTone: "threshold",
      symbolicTags: ["threshold", "ritual"],
      narratorLine: "This is the edge where awareness becomes a door."
    }
  ],
  timelineEvents: [
    {
      id: "star-001",
      ...owned(),
      occurredAt: daysAgo(0),
      title: "Calm focus returned",
      detail: "Sample signals show a steadier rhythm after several heavier days.",
      emotionalTone: "recovering",
      symbolicTags: ["recovery"],
      intensity: 0.92,
      bloomId: "bloom-001"
    },
    {
      id: "star-002",
      ...owned(),
      occurredAt: daysAgo(1),
      title: "Attention became less scattered",
      detail: "The demo constellation clusters around fewer competing signals.",
      emotionalTone: "focused",
      symbolicTags: ["focus"],
      intensity: 0.86,
      bloomId: "bloom-002"
    },
    {
      id: "star-003",
      ...owned(),
      occurredAt: daysAgo(2),
      title: "Overload markers softened",
      detail: "Friction and pressure indicators decreased in the sample weekly pattern.",
      emotionalTone: "focused",
      symbolicTags: ["focus"],
      intensity: 0.8
    },
    {
      id: "star-004",
      ...owned(),
      occurredAt: daysAgo(3),
      title: "Recovery ground strengthened",
      detail: "The symbolic ground layer brightened as the demo profile moved toward steadier rhythm.",
      emotionalTone: "recovering",
      symbolicTags: ["recovery"],
      intensity: 0.68
    },
    {
      id: "star-005",
      ...owned(),
      occurredAt: daysAgo(4),
      title: "Companion tone softened",
      detail: "The narrator shifted toward gentle, practical interpretation instead of raw analysis.",
      emotionalTone: "tender",
      symbolicTags: ["companion"],
      intensity: 0.74
    },
    {
      id: "star-006",
      ...owned(),
      occurredAt: daysAgo(5),
      title: "Forecast became actionable",
      detail: "The mood forecast translated the pattern into one clear next action.",
      emotionalTone: "calm",
      symbolicTags: ["focus"],
      intensity: 0.63
    },
    {
      id: "star-007",
      ...owned(),
      occurredAt: daysAgo(6),
      title: "Weekly story formed",
      detail: "The product began turning sample signals into a reflection someone can feel and verify.",
      emotionalTone: "social",
      symbolicTags: ["ritual"],
      intensity: 0.58
    },
    {
      id: "star-008",
      ...owned(),
      occurredAt: daysAgo(7),
      title: "Threshold became visible",
      detail: "A pressure point became easier to understand once it appeared as a named pattern.",
      emotionalTone: "threshold",
      symbolicTags: ["threshold"],
      intensity: 0.78,
      bloomId: "bloom-003"
    },
    {
      id: "star-009",
      ...owned(),
      occurredAt: daysAgo(8),
      title: "Social signal quieted",
      detail: "The demo map shows how fewer social inputs can change the shape of the week.",
      emotionalTone: "focused",
      symbolicTags: ["social"],
      intensity: 0.7
    },
    {
      id: "star-010",
      ...owned(),
      occurredAt: daysAgo(9),
      title: "Memory bloom language sharpened",
      detail: "Recovery, focus, and pressure became easier to see as symbolic milestones.",
      emotionalTone: "recovering",
      symbolicTags: ["recovery", "bloom"],
      intensity: 0.66
    },
    {
      id: "star-011",
      ...owned(),
      occurredAt: daysAgo(10),
      title: "Rhythm protected attention",
      detail: "The pattern suggests that steadier routines supported better emotional clarity.",
      emotionalTone: "focused",
      symbolicTags: ["focus"],
      intensity: 0.77
    },
    {
      id: "star-012",
      ...owned(),
      occurredAt: daysAgo(11),
      title: "Meaning became navigable",
      detail: "The Life Map turned scattered sample events into an emotional path someone can explore.",
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
