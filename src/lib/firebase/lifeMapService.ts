import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import type { ExportedScroll, LifeMapCollections, MemoryStar, PrivacyLevel, UserLifeMapSettings } from "@/lib/life-map/types";
import { lifeMapMockData } from "@/lib/life-map/mock-data";

const collectionNames = {
  memoryStars: "memoryStars",
  lifeConstellations: "lifeConstellations",
  nebulaRegions: "nebulaRegions",
  emotionalGalaxies: "emotionalGalaxies",
  relationshipBodies: "relationshipBodies",
  dreamSymbols: "dreamSymbols",
  shadowThreads: "shadowThreads",
  recoveryPaths: "recoveryPaths",
  legacyThreads: "legacyThreads",
  narratorInsights: "narratorInsights",
  replaySequences: "replaySequences",
  spatialCameraPaths: "spatialCameraPaths",
  userLifeMapSettings: "userLifeMapSettings",
  exportedScrolls: "exportedScrolls",
} as const;

function firestoreUnavailable() {
  return !isFirebaseConfigured();
}

export async function getLifeMapForUser(userId: string): Promise<LifeMapCollections> {
  if (firestoreUnavailable()) return lifeMapMockData;

  const database = db();
  const readCollection = async <T>(name: string): Promise<T[]> => {
    const snapshot = await getDocs(query(collection(database, name), where("userId", "==", userId)));
    return snapshot.docs.map((item) => item.data() as T);
  };

  const [memoryStars, lifeConstellations, nebulaRegions, emotionalGalaxies, relationshipBodies, dreamSymbols, shadowThreads, recoveryPaths, legacyThreads, narratorInsights, replaySequences, spatialCameraPaths, exportedScrolls, settingsRows] = await Promise.all([
    readCollection<any>(collectionNames.memoryStars),
    readCollection<any>(collectionNames.lifeConstellations),
    readCollection<any>(collectionNames.nebulaRegions),
    readCollection<any>(collectionNames.emotionalGalaxies),
    readCollection<any>(collectionNames.relationshipBodies),
    readCollection<any>(collectionNames.dreamSymbols),
    readCollection<any>(collectionNames.shadowThreads),
    readCollection<any>(collectionNames.recoveryPaths),
    readCollection<any>(collectionNames.legacyThreads),
    readCollection<any>(collectionNames.narratorInsights),
    readCollection<any>(collectionNames.replaySequences),
    readCollection<any>(collectionNames.spatialCameraPaths),
    readCollection<any>(collectionNames.exportedScrolls),
    readCollection<UserLifeMapSettings>(collectionNames.userLifeMapSettings),
  ]);

  return {
    ...lifeMapMockData,
    memoryStars: memoryStars.length ? memoryStars : lifeMapMockData.memoryStars,
    lifeConstellations: lifeConstellations.length ? lifeConstellations : lifeMapMockData.lifeConstellations,
    nebulaRegions: nebulaRegions.length ? nebulaRegions : lifeMapMockData.nebulaRegions,
    emotionalGalaxies,
    relationshipBodies: relationshipBodies.length ? relationshipBodies : lifeMapMockData.relationshipBodies,
    dreamSymbols: dreamSymbols.length ? dreamSymbols : lifeMapMockData.dreamSymbols,
    shadowThreads: shadowThreads.length ? shadowThreads : lifeMapMockData.shadowThreads,
    recoveryPaths: recoveryPaths.length ? recoveryPaths : lifeMapMockData.recoveryPaths,
    legacyThreads: legacyThreads.length ? legacyThreads : lifeMapMockData.legacyThreads,
    narratorInsights,
    replaySequences: replaySequences.length ? replaySequences : lifeMapMockData.replaySequences,
    spatialCameraPaths: spatialCameraPaths.length ? spatialCameraPaths : lifeMapMockData.spatialCameraPaths,
    userLifeMapSettings: settingsRows[0] ?? lifeMapMockData.userLifeMapSettings,
    exportedScrolls,
  };
}

export async function upsertMemoryStar(star: MemoryStar) {
  if (firestoreUnavailable()) return star;
  await setDoc(doc(db(), collectionNames.memoryStars, star.id), { ...star, updatedAt: new Date().toISOString() }, { merge: true });
  return star;
}

export async function updateMemoryPrivacy(starId: string, privacyLevel: PrivacyLevel) {
  if (firestoreUnavailable()) return;
  await updateDoc(doc(db(), collectionNames.memoryStars, starId), { privacyLevel, updatedAt: new Date().toISOString() });
}

export async function hideMemoryStar(userId: string, starId: string) {
  if (firestoreUnavailable()) return;
  await updateDoc(doc(db(), collectionNames.memoryStars, starId), { hidden: true, userId, updatedAt: new Date().toISOString() });
}

export async function blurSensitiveMemory(starId: string) {
  return updateMemoryPrivacy(starId, "blurred");
}

export async function setLocalOnlyMemory(starId: string) {
  return updateMemoryPrivacy(starId, "localOnly");
}

export async function deleteMemoryStar(starId: string) {
  if (firestoreUnavailable()) return;
  await deleteDoc(doc(db(), collectionNames.memoryStars, starId));
}

export async function removeRelationshipAssociation(bodyId: string) {
  if (firestoreUnavailable()) return;
  await updateDoc(doc(db(), collectionNames.relationshipBodies, bodyId), { associationVisible: false, updatedAt: new Date().toISOString() });
}

export async function saveUserLifeMapSettings(settings: UserLifeMapSettings) {
  if (firestoreUnavailable()) return settings;
  await setDoc(doc(db(), collectionNames.userLifeMapSettings, settings.id), { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
  return settings;
}

export async function createScrollExportDraft(userId: string, sourceStarIds: string[], anonymized = true): Promise<Partial<ExportedScroll>> {
  const draft: Partial<ExportedScroll> = {
    id: `scroll-${Date.now()}`,
    userId,
    type: "exportedScroll",
    title: "Life Map Scroll Export",
    subtitle: "draft emotional planetarium export",
    timestamp: new Date().toISOString(),
    emotionalTags: [],
    symbolicTags: ["scroll", "life map", "planetarium"],
    position3D: { x: 0, y: 0, z: 0 },
    scale: 1,
    color: "#facc15",
    glow: 0.7,
    intensity: 0.7,
    relatedIds: sourceStarIds,
    privacyLevel: anonymized ? "shareable" : "private",
    sourceSignals: ["life-map"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sourceStarIds,
    anonymized,
    exportStatus: "draft",
  };
  if (firestoreUnavailable()) return draft;
  await addDoc(collection(db(), collectionNames.exportedScrolls), draft);
  return draft;
}

export const lifeMapCollectionNames = collectionNames;
