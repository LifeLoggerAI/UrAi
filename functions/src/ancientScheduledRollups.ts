import * as admin from "firebase-admin";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {computeAncientSignalPayload} from "./ancientSignalCompute";
import {buildAncientSignalsFromPassiveRollups} from "./ancientPassiveRollups";

if (!admin.apps.length) {
  admin.initializeApp();
}

const firestore = admin.firestore();
const USER_PAGE_SIZE = 250;
const MAX_USERS_PER_RUN = 5000;

function previousUtcDate() {
  const date = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return date.toISOString().slice(0, 10);
}

function dayWindow(date: string) {
  return {
    startAt: `${date}T00:00:00.000Z`,
    endAt: `${date}T23:59:59.999Z`,
  };
}

function userAllowsAncientSignals(userData: FirebaseFirestore.DocumentData) {
  if (userData?.featureFlags?.ancientSignals?.enabled === false) return false;
  if (userData?.featureFlags?.["ancientSignals.enabled"] === false) return false;
  if (userData?.consents?.healthWellnessInsights === false) return false;
  return true;
}

async function hasExistingDailyRollup(ownerUid: string, date: string) {
  const existing = await firestore.collection("ancientSignals")
    .where("ownerUid", "==", ownerUid)
    .where("source", "==", "scheduled_rollup")
    .where("rollupDate", "==", date)
    .limit(1)
    .get();
  return !existing.empty;
}

async function writeScheduledAncientSignalRollup(ownerUid: string, date: string) {
  const window = dayWindow(date);
  const rollup = await buildAncientSignalsFromPassiveRollups(firestore, {
    ownerUid,
    startAt: window.startAt,
    endAt: window.endAt,
    limitPerCollection: 25,
  });

  if (!Object.keys(rollup.input).length) {
    return {ownerUid, status: "skipped_empty" as const};
  }

  const computed = computeAncientSignalPayload(rollup.input);
  const now = admin.firestore.FieldValue.serverTimestamp();
  const doc = await firestore.collection("ancientSignals").add({
    ownerUid,
    userId: ownerUid,
    source: "scheduled_rollup",
    rollupDate: date,
    rawData: rollup.rawData,
    input: rollup.input,
    consentBasis: {
      healthWellnessInsights: true,
    },
    sourceWindow: rollup.sourceWindow,
    ...computed,
    createdAt: now,
    updatedAt: now,
  });

  return {
    ownerUid,
    status: "created" as const,
    id: doc.id,
    sourceCollections: rollup.sourceCollections,
  };
}

async function processUserPage(
  users: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  date: string,
) {
  const results: Array<Record<string, unknown>> = [];

  for (const user of users.docs) {
    if (!userAllowsAncientSignals(user.data())) {
      results.push({ownerUid: user.id, status: "skipped_consent_or_feature_flag"});
      continue;
    }

    if (await hasExistingDailyRollup(user.id, date)) {
      results.push({ownerUid: user.id, status: "skipped_existing"});
      continue;
    }

    try {
      results.push(await writeScheduledAncientSignalRollup(user.id, date));
    } catch (error) {
      console.error("Scheduled Ancient Signals rollup failed", user.id, error);
      results.push({ownerUid: user.id, status: "failed"});
    }
  }

  return results;
}

export const scheduledAncientSignalsDailyRollup = onSchedule(
  {
    schedule: "every day 03:30",
    timeZone: "Etc/UTC",
    maxInstances: 1,
  },
  async () => {
    const date = previousUtcDate();
    const results: Array<Record<string, unknown>> = [];
    let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | null = null;
    let processedUsers = 0;
    let hasMore = true;

    while (hasMore && processedUsers < MAX_USERS_PER_RUN) {
      let usersQuery = firestore.collection("users")
        .orderBy(admin.firestore.FieldPath.documentId())
        .limit(USER_PAGE_SIZE);

      if (lastDoc) {
        usersQuery = usersQuery.startAfter(lastDoc);
      }

      const users = await usersQuery.get();
      if (users.empty) break;

      results.push(...await processUserPage(users, date));
      processedUsers += users.size;
      lastDoc = users.docs[users.docs.length - 1] ?? null;
      hasMore = users.size === USER_PAGE_SIZE;
    }

    console.log("scheduledAncientSignalsDailyRollup", {
      date,
      processedUsers,
      capped: processedUsers >= MAX_USERS_PER_RUN,
      created: results.filter((result) => result.status === "created").length,
      skipped: results.filter((result) => String(result.status).startsWith("skipped")).length,
      failed: results.filter((result) => result.status === "failed").length,
    });
  }
);
