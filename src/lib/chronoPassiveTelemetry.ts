import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { ChronoRawUserData } from './chronoMirror';

function numberValue(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function average(values: number[]) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

async function recentOwnerDocs(collectionName: string, ownerUid: string, count = 20) {
  const q = query(
    collection(db(), collectionName),
    where('ownerUid', '==', ownerUid),
    orderBy('createdAt', 'desc'),
    limit(count),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function loadChronoPassiveTelemetry(ownerUid: string): Promise<ChronoRawUserData> {
  const [moods, journals, shadowMetrics, obscuraPatterns, recoveryBlooms, events] = await Promise.allSettled([
    recentOwnerDocs('moods', ownerUid, 14),
    recentOwnerDocs('journalEntries', ownerUid, 14),
    recentOwnerDocs('shadowMetrics', ownerUid, 14),
    recentOwnerDocs('obscuraPatterns', ownerUid, 14),
    recentOwnerDocs('recoveryBlooms', ownerUid, 8),
    recentOwnerDocs('events', ownerUid, 20),
  ]);

  const moodDocs = moods.status === 'fulfilled' ? moods.value : [];
  const journalDocs = journals.status === 'fulfilled' ? journals.value : [];
  const shadowDocs = shadowMetrics.status === 'fulfilled' ? shadowMetrics.value : [];
  const obscuraDocs = obscuraPatterns.status === 'fulfilled' ? obscuraPatterns.value : [];
  const recoveryDocs = recoveryBlooms.status === 'fulfilled' ? recoveryBlooms.value : [];
  const eventDocs = events.status === 'fulfilled' ? events.value : [];

  const moodScore = average(moodDocs.map((doc) => numberValue(doc.score ?? doc.moodScore ?? doc.valence, 0.5)));
  const stressScore = average([
    ...shadowDocs.map((doc) => numberValue(doc.stressScore ?? doc.shadowStress ?? doc.tension, 0)),
    ...obscuraDocs.map((doc) => numberValue(doc.fatigueScore ?? doc.frictionScore ?? doc.load, 0)),
  ]);
  const journalEmotionScore = average(journalDocs.map((doc) => numberValue(doc.emotionalIntensity ?? doc.intensity ?? doc.sentimentMagnitude, 0)));
  const uniqueLocationCount = new Set(eventDocs.map((doc) => doc.locationId ?? doc.placeId ?? doc.location).filter(Boolean)).size;
  const memoryAnchorCount = eventDocs.filter((doc) => Boolean(doc.isMemoryAnchor ?? doc.memoryAnchor ?? doc.symbolicTag)).length + journalDocs.length;

  return {
    moodScore,
    stressScore,
    sleepDebtHours: average(obscuraDocs.map((doc) => numberValue(doc.sleepDebtHours ?? doc.sleepDebt, 0))),
    uniqueLocationCount,
    routineRepeatScore: average(obscuraDocs.map((doc) => numberValue(doc.routineRepeatScore ?? doc.routineDensity, 0))),
    notificationFrictionScore: average(obscuraDocs.map((doc) => numberValue(doc.notificationFrictionScore ?? doc.deviceFriction, 0))),
    journalEmotionScore,
    socialGapScore: average(shadowDocs.map((doc) => numberValue(doc.socialGapScore ?? doc.socialSilenceLoad, 0))),
    flowSessionMinutes: average(events.map((doc) => numberValue(doc.flowSessionMinutes ?? doc.focusMinutes, 0))),
    openLoopCount: shadowDocs.filter((doc) => Boolean(doc.openLoop ?? doc.unresolvedPattern)).length,
    recoveryActionCount: recoveryDocs.length,
    memoryAnchorCount,
  };
}
