import fs from "node:fs";
import path from "node:path";

const outputDir = path.join(process.cwd(), "tmp");
const outputPath = path.join(outputDir, "urai-tier2-access-seed.json");
const ownerUid = process.env.URAI_TIER2_SEED_UID || "demo-adam-clamp";
const shouldWriteFirestore = process.argv.includes("--firestore");

const now = new Date().toISOString();

const featureFlags = {
  "tier2.personal_life_map": {
    enabled: true,
    tier: "tier2",
    publicName: "Life Map",
    scope: "main-urai-app",
    createdAt: now,
    updatedAt: now,
  },
  "tier2.memory_stars": {
    enabled: true,
    tier: "tier2",
    publicName: "Memory Stars",
    scope: "main-urai-app",
    createdAt: now,
    updatedAt: now,
  },
  "tier2.mood_weather": {
    enabled: true,
    tier: "tier2",
    publicName: "Mood Weather",
    scope: "main-urai-app",
    createdAt: now,
    updatedAt: now,
  },
  "tier2.companion_presence": {
    enabled: true,
    tier: "tier2",
    publicName: "Narrator Presence",
    scope: "main-urai-app",
    createdAt: now,
    updatedAt: now,
  },
  "tier2.ritual_ar_preview": {
    enabled: false,
    tier: "tier2",
    publicName: "Preview Mode",
    scope: "main-urai-app",
    createdAt: now,
    updatedAt: now,
  },
  "tier2.offline_spatial_cache": {
    enabled: false,
    tier: "tier2",
    publicName: "Private Offline Cache",
    scope: "main-urai-app",
    createdAt: now,
    updatedAt: now,
  },
};

const consents = {
  profile: { ownerUid, source: "profile", status: "accepted", version: "tier2-v1", acceptedAt: now, updatedAt: now },
  timeline_events: { ownerUid, source: "timeline_events", status: "accepted", version: "tier2-v1", acceptedAt: now, updatedAt: now },
  memory_blooms: { ownerUid, source: "memory_blooms", status: "accepted", version: "tier2-v1", acceptedAt: now, updatedAt: now },
  mood_inference: { ownerUid, source: "mood_inference", status: "accepted", version: "tier2-v1", acceptedAt: now, updatedAt: now },
  relationship_signals: { ownerUid, source: "relationship_signals", status: "declined", version: "tier2-v1", updatedAt: now },
  rituals: { ownerUid, source: "rituals", status: "declined", version: "tier2-v1", updatedAt: now },
  offline_cache: { ownerUid, source: "offline_cache", status: "declined", version: "tier2-v1", updatedAt: now },
};

const seed = {
  users: {
    [ownerUid]: {
      entitlementTier: "tier2",
      roles: ["internal"],
      tier2SeededAt: now,
    },
  },
  features: featureFlags,
  userConsents: {
    [ownerUid]: consents,
  },
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
        privateKey: String(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, "\n"),
      }),
    });
  }

  const db = getFirestore();
  for (const [docId, value] of Object.entries(featureFlags)) {
    await db.collection("features").doc(docId).set(value, { merge: true });
    console.log(`Seeded features/${docId}`);
  }

  await db.collection("users").doc(ownerUid).set(seed.users[ownerUid], { merge: true });
  console.log(`Seeded users/${ownerUid}`);

  for (const [source, value] of Object.entries(consents)) {
    await db.collection("users").doc(ownerUid).collection("consents").doc(source).set(value, { merge: true });
    console.log(`Seeded users/${ownerUid}/consents/${source}`);
  }
}
