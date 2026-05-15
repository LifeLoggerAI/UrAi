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

const lifeMapNodes = {
  "lifemap-blueprint-locked": {
    ...owned(),
    type: "becoming",
    title: "Blueprint Locked",
    subtitle: "foundation",
    timestamp: daysAgo(10),
    chapterId: "season-of-becoming",
    emotionalTone: "focus",
    auraColor: "205deg",
    intensity: 0.86,
    confidence: 0.92,
    x: 38,
    y: 39,
    z: 150,
    size: 17,
    glow: 0.92,
    isBrightMemory: true,
    isClickable: true,
    connectedTo: ["lifemap-demo-spine", "lifemap-mirror-pattern"],
    linkedThreadIds: ["thread-buildable-system"],
    sourceEventIds: ["bloom-001"],
    sourceSignalIds: ["bloom-001"],
    narratorLine: "You stopped carrying the whole system in your head and gave it a foundation."
  },
  "lifemap-threshold-edge": {
    ...owned(),
    type: "threshold",
    title: "Launch Edge",
    subtitle: "threshold",
    timestamp: daysAgo(5),
    chapterId: "threshold",
    emotionalTone: "threshold",
    auraColor: "285deg",
    intensity: 0.9,
    confidence: 0.84,
    unresolvedWeight: 0.78,
    x: 50,
    y: 31,
    z: 175,
    size: 18,
    glow: 0.95,
    isBrightMemory: true,
    isClickable: true,
    connectedTo: ["lifemap-recovery-return", "lifemap-blueprint-locked"],
    linkedThreadIds: ["thread-threshold-to-recovery"],
    sourceEventIds: ["bloom-003"],
    sourceSignalIds: ["bloom-003"],
    narratorLine: "This is the edge where vision has to become rhythm."
  },
  "lifemap-recovery-return": {
    ...owned(),
    type: "recovery",
    title: "Quiet Return",
    subtitle: "softening",
    timestamp: daysAgo(3),
    chapterId: "recovery-arc",
    emotionalTone: "recovery",
    auraColor: "158deg",
    intensity: 0.82,
    confidence: 0.88,
    unresolvedWeight: 0.22,
    x: 62,
    y: 43,
    z: 140,
    size: 16,
    glow: 0.86,
    isBrightMemory: true,
    isClickable: true,
    connectedTo: ["lifemap-threshold-edge", "lifemap-demo-spine"],
    linkedThreadIds: ["thread-threshold-to-recovery"],
    sourceEventIds: ["bloom-002"],
    sourceSignalIds: ["bloom-002"],
    narratorLine: "A quieter rhythm returned after the pressure softened."
  },
  "lifemap-dream-symbols": {
    ...owned(),
    type: "dream",
    title: "Dream Field Opens",
    subtitle: "symbols",
    timestamp: daysAgo(8),
    chapterId: "purple-dream-field",
    emotionalTone: "dream",
    auraColor: "248deg",
    intensity: 0.74,
    confidence: 0.76,
    unresolvedWeight: 0.42,
    x: 41,
    y: 61,
    z: 90,
    size: 14,
    glow: 0.72,
    isBrightMemory: true,
    isClickable: true,
    connectedTo: ["lifemap-mirror-pattern"],
    linkedThreadIds: ["thread-symbolic-identity"],
    sourceEventIds: ["symbolic-demo-adam"],
    sourceSignalIds: ["symbolic-demo-adam"],
    narratorLine: "Symbolic echoes are gathering into a visual language."
  },
  "lifemap-mirror-pattern": {
    ...owned(),
    type: "mirror",
    title: "Mirror Pattern",
    subtitle: "identity",
    timestamp: daysAgo(1),
    chapterId: "mirror-of-becoming",
    emotionalTone: "mirror",
    auraColor: "42deg",
    intensity: 0.88,
    confidence: 0.9,
    unresolvedWeight: 0.3,
    x: 64,
    y: 61,
    z: 165,
    size: 18,
    glow: 0.9,
    isBrightMemory: true,
    isClickable: true,
    connectedTo: ["lifemap-blueprint-locked", "lifemap-dream-symbols"],
    linkedThreadIds: ["thread-symbolic-identity"],
    sourceEventIds: ["weekly-demo-adam"],
    sourceSignalIds: ["weekly-demo-adam"],
    narratorLine: "This pattern has appeared before. Not as failure, as rehearsal."
  },
  "lifemap-demo-spine": {
    ...owned(),
    type: "breakthrough",
    title: "Demo Spine Chosen",
    subtitle: "clarity",
    timestamp: daysAgo(6),
    chapterId: "season-of-becoming",
    emotionalTone: "joy",
    auraColor: "42deg",
    intensity: 0.76,
    confidence: 0.86,
    unresolvedWeight: 0.18,
    x: 55,
    y: 50,
    z: 110,
    size: 14,
    glow: 0.78,
    isBrightMemory: true,
    isClickable: true,
    connectedTo: ["lifemap-blueprint-locked", "lifemap-recovery-return"],
    linkedThreadIds: ["thread-buildable-system"],
    sourceEventIds: ["bloom-002"],
    sourceSignalIds: ["bloom-002"],
    narratorLine: "A product becomes real when a stranger can feel it in one minute."
  }
};

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
  waitlistSignups: {},
  userSubcollections: {
    [ownerUid]: {
      lifeMapNodes
    }
  }
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
    if (collectionName === "userSubcollections") continue;
    for (const [docId, value] of Object.entries(docs)) {
      await db.collection(collectionName).doc(docId).set(value, { merge: true });
      console.log(`Seeded ${collectionName}/${docId}`);
    }
  }

  for (const [uid, subcollections] of Object.entries(seed.userSubcollections)) {
    for (const [subcollectionName, docs] of Object.entries(subcollections)) {
      for (const [docId, value] of Object.entries(docs)) {
        await db.collection("users").doc(uid).collection(subcollectionName).doc(docId).set(value, { merge: true });
        console.log(`Seeded users/${uid}/${subcollectionName}/${docId}`);
      }
    }
  }
}