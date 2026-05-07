import fs from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "tmp");
const outputPath = path.join(outputDir, "urai-demo-seed.json");

const baseDate = new Date("2026-05-06T12:00:00.000Z");
const daysAgo = (days) => {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
};

const seed = {
  users: {
    "demo-adam-clamp": {
      handle: "adamclamp",
      displayName: "Adam Clamp",
      tagline: "Building URAI as a passive emotional operating system.",
      currentTone: "focused",
      companionName: "URAI Companion",
      createdAt: daysAgo(21)
    }
  },
  moodForecasts: {
    "forecast-demo-adam": {
      userId: "demo-adam-clamp",
      generatedAt: baseDate.toISOString(),
      rhythmState: "recovering",
      summary: "Calm focus is rising after a heavy build cycle. The next 24 hours favor implementation over ideation.",
      confidence: 0.82,
      nextBestAction: "Ship one visible demo loop before adding another advanced feature."
    }
  },
  weeklyReflections: {
    "weekly-demo-adam": {
      userId: "demo-adam-clamp",
      weekOf: "2026-05-04",
      title: "The week the blueprint became buildable",
      highlights: [
        "Locked the master completion prompt into the repo.",
        "Shifted from vision expansion to implementation spine.",
        "Prioritized demo, schemas, narrator, and public launch route."
      ],
      narratorSummary: "This week was not about adding more ideas. It was about turning the constellation into a path someone can walk."
    }
  },
  symbolicStates: {
    "symbolic-demo-adam": {
      userId: "demo-adam-clamp",
      skyState: "stars",
      groundTier: 4,
      aura: "violet-gold",
      companionState: "guiding"
    }
  },
  waitlistSignups: {}
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(seed, null, 2));
console.log(`Wrote ${outputPath}`);
