import fs from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "tmp");
const outputPath = path.join(outputDir, "urai-demo-seed.json");
const ownerUid = "demo-adam-clamp";
const shouldWriteFirestore = process.argv.includes("--firestore");

const baseDate = new Date("2026-05-06T12:00:00.000Z");
const daysAgo = (days) => {
  const date = new Date(baseDate);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
};

const owned = () => ({ ownerUid, userId: ownerUid });

const seed = {
  users: {
    [ownerUid]: {
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
      ...owned(),
      generatedAt: baseDate.toISOString(),
      rhythmState: "recovering",
      summary: "Calm focus is rising after a heavy build cycle. The next 24 hours favor implementation over ideation.",
      confidence: 0.82,
      nextBestAction: "Ship one visible demo loop before adding another advanced feature."
    }
  },
  weeklyReflections: {
    "weekly-demo-adam": {
      ...owned(),
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
      ...owned(),
      skyState: "stars",
      groundTier: 4,
      aura: "violet-gold",
      companionState: "guiding"
    }
  },
  memoryBlooms: {
    "bloom-001": {
      ...owned(),
      title: "Blueprint Locked",
      summary: "The complete URAI master prompt moved from chat into the repo as a permanent build artifact.",
      emotionalTone: "focused",
      symbolicTags: ["focus", "bloom"],
      narratorLine: "You stopped carrying the whole system in your head and gave it a foundation."
    },
    "bloom-002": {
      ...owned(),
      title: "Demo Spine Chosen",
      summary: "The next implementation path became clear: public route, companion flow, forecast, reflection, seed data.",
      emotionalTone: "recovering",
      symbolicTags: ["recovery", "companion"],
      narratorLine: "A product becomes real when a stranger can feel it in one minute."
    },
    "bloom-003": {
      ...owned(),
      title: "Launch Signal",
      summary: "The build direction narrowed toward waitlist, demo readiness, and deployment gates.",
      emotionalTone: "threshold",
      symbolicTags: ["threshold", "ritual"],
      narratorLine: "This is the edge where vision has to become rhythm."
    }
  },
  waitlistSignups: {}
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(seed, null, 2));
console.log(`Wrote ${outputPath}`);

if (shouldWriteFirestore) {
  const hasAdminEnv = Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);
  if (!hasAdminEnv) {
    console.error("Missing Firebase Admin env vars. JSON seed was written, but Firestore was not updated.");
    process.exit(1);
  }

  const { cert, getApps, initializeApp } = await import("firebase-admin/app");
  const { getFirestore } = await import("firebase-admin/firestore");

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: String(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n")
      })
    });
  }

  const db = getFirestore();
  for (const [collectionName, docs] of Object.entries(seed)) {
    for (const [docId, value] of Object.entries(docs)) {
      await db.collection(collectionName).doc(docId).set(value, { merge: true });
      console.log(`Seeded ${collectionName}/${docId}`);
    }
  }
}
