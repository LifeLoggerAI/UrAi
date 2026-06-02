import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, type Firestore } from "firebase/firestore";
import type { MemoryStar, NarratorCue, ReplayBeat, ReplayEra, UraiCinematicData } from "./types";
import { seedNarratorCues, seedReplayBeats, seedReplayEra, seedStars } from "./seed-data";

export const uraiCinematicPaths = {
  memoryStars: (userId: string) => `users/${userId}/memoryStars`,
  replayEras: (userId: string) => `users/${userId}/replayEras`,
  replayBeats: (userId: string) => `users/${userId}/replayBeats`,
  narratorCues: (userId: string) => `users/${userId}/narratorCues`,
  replayEra: (userId: string, eraId: string) => `users/${userId}/replayEras/${eraId}`,
};

export async function loadUraiCinematicData(db: Firestore | null, userId: string): Promise<UraiCinematicData> {
  if (!db) return fallbackCinematicData();

  try {
    const [starsSnap, erasSnap, beatsSnap, cuesSnap] = await Promise.all([
      getDocs(query(collection(db, uraiCinematicPaths.memoryStars(userId)), orderBy("timestamp", "asc"))),
      getDocs(query(collection(db, uraiCinematicPaths.replayEras(userId)), orderBy("startTimestamp", "desc"))),
      getDocs(query(collection(db, uraiCinematicPaths.replayBeats(userId)), orderBy("timestamp", "asc"))),
      getDocs(collection(db, uraiCinematicPaths.narratorCues(userId))),
    ]);

    const stars = starsSnap.docs.map((item) => item.data() as MemoryStar);
    const replayEras = erasSnap.docs.map((item) => item.data() as ReplayEra);
    const replayBeats = beatsSnap.docs.map((item) => item.data() as ReplayBeat);
    const narratorCues = cuesSnap.docs.map((item) => item.data() as NarratorCue);

    return {
      stars: stars.length ? stars : seedStars,
      replayEra: replayEras[0] ?? seedReplayEra,
      replayBeats: replayBeats.length ? replayBeats : seedReplayBeats,
      narratorCues: narratorCues.length ? narratorCues : seedNarratorCues,
    };
  } catch {
    return fallbackCinematicData();
  }
}

export async function saveReplayProgress(db: Firestore | null, userId: string, eraId: string, progressMs: number) {
  if (!db) return;
  await setDoc(doc(db, uraiCinematicPaths.replayEra(userId, eraId)), {
    progressMs,
    lastPlayedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function loadReplayEra(db: Firestore | null, userId: string, eraId: string) {
  if (!db) return seedReplayEra;
  const snap = await getDoc(doc(db, uraiCinematicPaths.replayEra(userId, eraId)));
  return snap.exists() ? snap.data() as ReplayEra : seedReplayEra;
}

export function fallbackCinematicData(): UraiCinematicData {
  return {
    stars: seedStars,
    replayEra: seedReplayEra,
    replayBeats: seedReplayBeats,
    narratorCues: seedNarratorCues,
  };
}
