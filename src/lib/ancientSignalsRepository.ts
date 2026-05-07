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
  AncientRawUserData,
  AncientSignalConsentBasis,
  AncientSignalResult,
  AncientSignalWindow,
  computeAncientSignals,
  mapUserDataToAncientSignals,
} from './ancientSignals';

export const ANCIENT_SIGNAL_SNAPSHOTS = 'ancientSignals';

export type AncientSignalSnapshotSource = 'live' | 'demo' | 'imported' | 'rollup' | 'scheduled_rollup';

export interface AncientSignalSnapshotDoc extends AncientSignalResult {
  ownerUid: string;
  userId: string;
  source: AncientSignalSnapshotSource;
  rollupDate?: string;
  rawData?: AncientRawUserData | Record<string, unknown> | null;
  input?: AncientSignalWindow | Record<string, unknown>;
  consentBasis: AncientSignalConsentBasis;
  sourceWindow?: {
    startAt: string;
    endAt: string;
    durationMinutes: number;
  } | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export async function createAncientSignalSnapshot(
  ownerUid: string,
  rawData: AncientRawUserData,
  options: {
    source?: AncientSignalSnapshotSource;
    consentBasis?: AncientSignalConsentBasis;
    sourceWindow?: AncientSignalSnapshotDoc['sourceWindow'];
  } = {},
) {
  const input = mapUserDataToAncientSignals(rawData);
  const result = computeAncientSignals(input);

  return addDoc(collection(db(), ANCIENT_SIGNAL_SNAPSHOTS), {
    ownerUid,
    userId: ownerUid,
    source: options.source ?? 'live',
    rawData,
    input,
    consentBasis: options.consentBasis ?? {},
    sourceWindow: options.sourceWindow ?? null,
    ...result,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function createAncientSignalSnapshotFromSignals(
  ownerUid: string,
  input: AncientSignalWindow,
  options: {
    source?: AncientSignalSnapshotSource;
    consentBasis?: AncientSignalConsentBasis;
    sourceWindow?: AncientSignalSnapshotDoc['sourceWindow'];
  } = {},
) {
  const result = computeAncientSignals(input);

  return addDoc(collection(db(), ANCIENT_SIGNAL_SNAPSHOTS), {
    ownerUid,
    userId: ownerUid,
    source: options.source ?? 'live',
    input,
    consentBasis: options.consentBasis ?? {},
    sourceWindow: options.sourceWindow ?? null,
    ...result,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getLatestAncientSignalSnapshot(ownerUid: string) {
  const snapshotQuery = query(
    collection(db(), ANCIENT_SIGNAL_SNAPSHOTS),
    where('ownerUid', '==', ownerUid),
    orderBy('createdAt', 'desc'),
    limit(1),
  );
  const snapshot = await getDocs(snapshotQuery);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as AncientSignalSnapshotDoc;
}

export async function getRecentAncientSignalSnapshots(ownerUid: string, count = 7) {
  const snapshotQuery = query(
    collection(db(), ANCIENT_SIGNAL_SNAPSHOTS),
    where('ownerUid', '==', ownerUid),
    orderBy('createdAt', 'desc'),
    limit(count),
  );
  const snapshot = await getDocs(snapshotQuery);
  return snapshot.docs.map((doc) => doc.data() as AncientSignalSnapshotDoc).reverse();
}
