import fs from "node:fs";
import path from "node:path";

// Legacy repository quarantine: deterministic local demo fixture only.
// This repository is not current UrAi production authority and must never write
// provider data. Keep `npm run seed:demo` useful for source/CI shape checks while
// rejecting every Firestore mutation attempt.

const outputDir = path.join(process.cwd(), "tmp");
const outputPath = path.join(outputDir, "urai-demo-seed.json");
const ownerUid = "demo-adam-clamp";
const shouldWriteFirestore = process.argv.includes("--firestore");
const baseDate = "2026-05-06T12:00:00.000Z";

const owned = { ownerUid, userId: ownerUid };
const node = (id, type, title, x, y) => ({
  ...owned,
  id,
  type,
  title,
  chapterId: "legacy-demo",
  emotionalTone: type,
  x,
  y,
  z: 100,
  size: 14,
  glow: 0.8,
  confidence: 0.8,
  isBrightMemory: true,
  isClickable: true,
});

const seed = {
  schemaVersion: "urai-legacy-local-demo-1",
  authority: "local-synthetic-only",
  providerMutationAuthorized: false,
  generatedAt: baseDate,
  users: {
    [ownerUid]: {
      handle: "adamclamp",
      displayName: "Adam Clamp",
      currentTone: "focused",
      companionName: "URAI Companion",
    },
  },
  moodForecasts: {
    "forecast-demo-adam": {
      ...owned,
      generatedAt: baseDate,
      rhythmState: "recovering",
      summary: "Synthetic legacy fixture for local source verification only.",
      confidence: 0.82,
    },
  },
  weeklyReflections: {
    "weekly-demo-adam": {
      ...owned,
      weekOf: "2026-05-04",
      title: "Legacy local fixture",
      narratorSummary: "Synthetic source-verification data; not provider or production evidence.",
    },
  },
  symbolicStates: {
    "symbolic-demo-adam": {
      ...owned,
      skyState: "stars",
      groundTier: 4,
      aura: "violet-gold",
      companionState: "guiding",
    },
  },
  memoryBlooms: {
    "bloom-001": { ...owned, title: "Blueprint Locked", emotionalTone: "focused" },
    "bloom-002": { ...owned, title: "Demo Spine Chosen", emotionalTone: "recovering" },
    "bloom-003": { ...owned, title: "Launch Signal", emotionalTone: "threshold" },
  },
  waitlistSignups: {},
  userSubcollections: {
    [ownerUid]: {
      homeState: {
        current: {
          mood: { label: "Mirror Clarity", confidence: 0.9 },
          rhythm: { state: "focused" },
          companion: { state: "reflecting", message: "Synthetic legacy fixture." },
          visual: { state: "recovery", auraColor: "#7ee7ff", auraSecondaryColor: "#fbbf24" },
        },
      },
      moodForecasts: {
        current: {
          summary: "Synthetic legacy memory field",
          message: "Local source-verification fixture only.",
          rhythmState: "focused",
          confidence: 0.9,
        },
      },
      companionState: {
        current: { mode: "reflecting", narratorWhisper: "Synthetic fixture.", trustLevel: 0.74 },
      },
      visualState: {
        current: { visualState: "recovery", auraColor: "#7ee7ff", auraSecondaryColor: "#fbbf24" },
      },
      lifeMapNodes: {
        "lifemap-blueprint-locked": node("lifemap-blueprint-locked", "becoming", "Blueprint Locked", 38, 39),
        "lifemap-threshold-edge": node("lifemap-threshold-edge", "threshold", "Launch Edge", 50, 31),
        "lifemap-recovery-return": node("lifemap-recovery-return", "recovery", "Quiet Return", 62, 43),
        "lifemap-dream-symbols": node("lifemap-dream-symbols", "dream", "Dream Field Opens", 41, 61),
        "lifemap-mirror-pattern": node("lifemap-mirror-pattern", "mirror", "Mirror Pattern", 64, 61),
        "lifemap-demo-spine": node("lifemap-demo-spine", "breakthrough", "Demo Spine Chosen", 55, 50),
      },
    },
  },
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(seed, null, 2)}\n`);
console.log(`Legacy quarantine: wrote deterministic synthetic demo fixture to ${outputPath}`);

if (shouldWriteFirestore) {
  console.error(
    "Legacy repository quarantine: Firestore mutation is disabled. Use the current canonical system and its governed provider authority instead.",
  );
  process.exit(1);
}
