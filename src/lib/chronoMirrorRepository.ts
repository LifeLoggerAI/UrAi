import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  ChronoMirrorResult,
  ChronoRawUserData,
  ChronoValidationEvent,
  computeChronoMirror,
  computeChronoValidation,
  mapUserDataToChronoSignals,
} from './chronoMirror';

export const CHRONO_MIRROR_SNAPSHOTS = 'chronoMirrorSnapshots';
export const CHRONO_VALIDATION_EVENTS = 'chrono_validation_events';

export interface ChronoMirrorSnapshotDoc extends ChronoMirrorResult {
  ownerUid: string;
  userId: string;
  source: 'live' | 'demo' | 'imported';
  rawData?: ChronoRawUserData;
  createdAt?: unknown;
}

export async function createChronoMirrorSnapshot(
  ownerUid: string,
  rawData: ChronoRawUserData,
  source: ChronoMirrorSnapshotDoc['source'] = 'live',
) {
  const signals = mapUserDataToChronoSignals(rawData);
  const result = computeChronoMirror(signals);
  return addDoc(collection(db(), CHRONO_MIRROR_SNAPSHOTS), {
    ownerUid,
    userId: ownerUid,
    source,
    rawData,
    ...result,
    temporalOrientation: result.temporalProfile.dominantOrientation,
    recurrenceLoops: result.temporalProfile.recurrenceLoops,
    createdAt: serverTimestamp(),
  });
}

export async function getLatestChronoMirrorSnapshot(ownerUid: string) {
  const snapshotQuery = query(
    collection(db(), CHRONO_MIRROR_SNAPSHOTS),
    where('ownerUid', '==', ownerUid),
    orderBy('createdAt', 'desc'),
    limit(1),
  );
  const snapshot = await getDocs(snapshotQuery);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as ChronoMirrorSnapshotDoc;
}

export async function getRecentChronoMirrorSnapshots(ownerUid: string, count = 7) {
  const snapshotQuery = query(
    collection(db(), CHRONO_MIRROR_SNAPSHOTS),
    where('ownerUid', '==', ownerUid),
    orderBy('createdAt', 'desc'),
    limit(count),
  );
  const snapshot = await getDocs(snapshotQuery);
  return snapshot.docs.map((doc) => doc.data() as ChronoMirrorSnapshotDoc).reverse();
}

export async function recordChronoValidationEvent(
  ownerUid: string,
  event: ChronoValidationEvent,
  snapshotId?: string,
) {
  const computed = computeChronoValidation(event);
  return addDoc(collection(db(), CHRONO_VALIDATION_EVENTS), {
    ownerUid,
    userId: ownerUid,
    snapshotId: snapshotId ?? null,
    ...event,
    computed,
    createdAt: serverTimestamp(),
  });
}
