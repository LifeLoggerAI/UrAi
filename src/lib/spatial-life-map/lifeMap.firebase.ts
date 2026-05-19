import {
  collection,
  doc,
  getDocs,
  setDoc,
  type CollectionReference,
  type DocumentData,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
  type SnapshotOptions,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type {
  LifeMapChapter,
  LifeMapConstellation,
  LifeMapDataset,
  LifeMapLayer,
  LifeMapStar,
  MemoryBloom,
  RelationshipThread,
  RitualThread,
  SpatialSettings,
} from "./lifeMap.types";
import { spatialLifeMapMockData } from "./lifeMap.mockData";

const passThroughConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  toFirestore(value: T) {
    return value;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    return { id: snapshot.id, ...snapshot.data(options) } as unknown as T;
  },
});

const paths = {
  stars: (userId: string) => collection(db(), "users", userId, "lifeMapStars").withConverter(passThroughConverter<LifeMapStar>()),
  constellations: (userId: string) => collection(db(), "users", userId, "lifeMapConstellations").withConverter(passThroughConverter<LifeMapConstellation>()),
  layers: (userId: string) => collection(db(), "users", userId, "lifeMapLayers").withConverter(passThroughConverter<LifeMapLayer>()),
  chapters: (userId: string) => collection(db(), "users", userId, "lifeMapChapters").withConverter(passThroughConverter<LifeMapChapter>()),
  memoryBlooms: (userId: string) => collection(db(), "users", userId, "memoryBlooms").withConverter(passThroughConverter<MemoryBloom>()),
  relationshipThreads: (userId: string) => collection(db(), "users", userId, "relationshipThreads").withConverter(passThroughConverter<RelationshipThread>()),
  ritualThreads: (userId: string) => collection(db(), "users", userId, "ritualThreads").withConverter(passThroughConverter<RitualThread>()),
  settings: (userId: string) => doc(db(), "users", userId, "spatialSettings", "default").withConverter(passThroughConverter<SpatialSettings>()),
};

async function readCollection<T extends DocumentData>(ref: CollectionReference<T>): Promise<T[]> {
  const snapshot = await getDocs(ref);
  return snapshot.docs.map((item) => item.data());
}

export async function loadSpatialLifeMap(userId: string): Promise<LifeMapDataset> {
  if (!isFirebaseConfigured()) return spatialLifeMapMockData;
  try {
    const [stars, constellations, layers, chapters, memoryBlooms, relationshipThreads, ritualThreads] = await Promise.all([
      readCollection(paths.stars(userId)),
      readCollection(paths.constellations(userId)),
      readCollection(paths.layers(userId)),
      readCollection(paths.chapters(userId)),
      readCollection(paths.memoryBlooms(userId)),
      readCollection(paths.relationshipThreads(userId)),
      readCollection(paths.ritualThreads(userId)),
    ]);

    if (!stars.length || !layers.length) return spatialLifeMapMockData;

    return {
      stars,
      constellations,
      layers,
      chapters,
      memoryBlooms,
      relationshipThreads,
      ritualThreads,
      spatialSettings: { ...spatialLifeMapMockData.spatialSettings, userId },
    };
  } catch {
    return spatialLifeMapMockData;
  }
}

export async function saveSpatialSettings(userId: string, settings: SpatialSettings) {
  if (!isFirebaseConfigured()) return;
  await setDoc(paths.settings(userId), settings, { merge: true });
}

export async function seedSpatialLifeMap(userId: string) {
  if (!isFirebaseConfigured()) return spatialLifeMapMockData;
  const writes = [
    ...spatialLifeMapMockData.stars.map((item) => setDoc(doc(paths.stars(userId), item.id), item)),
    ...spatialLifeMapMockData.constellations.map((item) => setDoc(doc(paths.constellations(userId), item.id), item)),
    ...spatialLifeMapMockData.layers.map((item) => setDoc(doc(paths.layers(userId), item.id), item)),
    ...spatialLifeMapMockData.chapters.map((item) => setDoc(doc(paths.chapters(userId), item.id), item)),
    ...spatialLifeMapMockData.memoryBlooms.map((item) => setDoc(doc(paths.memoryBlooms(userId), item.id), item)),
    ...spatialLifeMapMockData.relationshipThreads.map((item) => setDoc(doc(paths.relationshipThreads(userId), item.id), item)),
    ...spatialLifeMapMockData.ritualThreads.map((item) => setDoc(doc(paths.ritualThreads(userId), item.id), item)),
    setDoc(paths.settings(userId), { ...spatialLifeMapMockData.spatialSettings, userId }),
  ];
  await Promise.all(writes);
  return spatialLifeMapMockData;
}
