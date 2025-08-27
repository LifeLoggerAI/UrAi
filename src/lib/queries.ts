// lib/queries.ts
// UrAi Firestore queries aligned to secure rules + indexes.
// Requires: lib/firebase.ts exporting { auth, db, storage }

import {
  collection, doc, getDoc, getDocs, addDoc, setDoc,
  query, where, orderBy, limit, startAfter, onSnapshot,
  serverTimestamp, Timestamp
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "./firebase";

// ---------------------------
// Helpers
// ---------------------------
export function requireUid(): string {
  const u = auth.currentUser;
  if (!u) throw new Error("Not authenticated");
  return u.uid;
}

export async function addWithUid(path: string, data: Record<string, any>, docId?: string) {
  const uid = requireUid();
  const payload = {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (docId) {
    await setDoc(doc(db, path, docId), payload, { merge: true });
    return docId;
  }
  const refDoc = await addDoc(collection(db, path), payload);
  return refDoc.id;
}

// Types for pagination cursors
export type CursorTS = Timestamp | null | undefined;
export type CursorStr = string | null | undefined;
export type CursorNum = number | null | undefined;

// ---------------------------
// Timeline (uid + timestamp desc)
// ---------------------------
export async function listTimelinePage(pageSize = 25, cursor?: CursorTS) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("timestamp", "desc"),
    limit(pageSize),
  ] as const;

  const qy = cursor
    ? query(collection(db, "timelineEvents"), ...base, startAfter(cursor))
    : query(collection(db, "timelineEvents"), ...base);

  const snap = await getDocs(qy);
  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const nextCursor = snap.docs.at(-1)?.get("timestamp") as Timestamp | undefined;
  return { items, nextCursor };
}

// ---------------------------
// Rituals (uid + createdAt desc)
// ---------------------------
export async function listRituals(pageSize = 20, cursor?: CursorTS) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(pageSize),
  ] as const;

  const qy = cursor
    ? query(collection(db, "rituals"), ...base, startAfter(cursor))
    : query(collection(db, "rituals"), ...base);

  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("createdAt") as Timestamp | undefined,
  };
}
export async function createRitual(input: { title: string; notes?: string }) {
  return addWithUid("rituals", input);
}

// ---------------------------
// Insights (uid + createdAt desc)
// ---------------------------
export async function listInsights(pageSize = 20, cursor?: CursorTS) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(pageSize),
  ] as const;
  const qy = cursor
    ? query(collection(db, "insights"), ...base, startAfter(cursor))
    : query(collection(db, "insights"), ...base);
  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("createdAt") as Timestamp | undefined,
  };
}

// ---------------------------
// Weekly Exports (uid + weekKey desc) + Storage URLs
// ---------------------------
export async function listExports(pageSize = 12, cursor?: CursorStr) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("weekKey", "desc"),
    limit(pageSize),
  ] as const;
  const qy = cursor
    ? query(collection(db, "exports"), ...base, startAfter(cursor))
    : query(collection(db, "exports"), ...base);
  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("weekKey") as string | undefined,
  };
}
export async function getExportUrl(weekKey: string, fileName: string) {
  const uid = requireUid();
  const r = ref(storage, `exports/${uid}/week_${weekKey}/${fileName}`);
  return getDownloadURL(r);
}

// ---------------------------
// Forecasts (uid + dateKey desc) & Digests (uid + weekKey desc)
// ---------------------------
export async function listForecasts(limitCount = 14, cursor?: CursorStr) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("dateKey", "desc"),
    limit(limitCount),
  ] as const;
  const qy = cursor
    ? query(collection(db, "forecasts"), ...base, startAfter(cursor))
    : query(collection(db, "forecasts"), ...base);
  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("dateKey") as string | undefined,
  };
}
export async function listDigests(limitCount = 12, cursor?: CursorStr) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("weekKey", "desc"),
    limit(limitCount),
  ] as const;
  const qy = cursor
    ? query(collection(db, "digests"), ...base, startAfter(cursor))
    : query(collection(db, "digests"), ...base);
  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("weekKey") as string | undefined,
  };
}

// ---------------------------
// Shadow / Obscura (uid + weekKey desc)
// ---------------------------
export async function listShadowMetrics(limitCount = 12, cursor?: CursorStr) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("weekKey", "desc"),
    limit(limitCount),
  ] as const;
  const qy = cursor
    ? query(collection(db, "shadowMetrics"), ...base, startAfter(cursor))
    : query(collection(db, "shadowMetrics"), ...base);
  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("weekKey") as string | undefined,
  };
}
export async function listObscuraMetrics(limitCount = 12, cursor?: CursorStr) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("weekKey", "desc"),
    limit(limitCount),
  ] as const;
  const qy = cursor
    ? query(collection(db, "obscuraMetrics"), ...base, startAfter(cursor))
    : query(collection(db, "obscuraMetrics"), ...base);
  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("weekKey") as string | undefined,
  };
}

// ---------------------------
// Health (uid + dateKey desc) & Social Map (uid + weight desc)
// ---------------------------
export async function listHealthData(limitCount = 30, cursor?: CursorStr) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("dateKey", "desc"),
    limit(limitCount),
  ] as const;
  const qy = cursor
    ? query(collection(db, "healthData"), ...base, startAfter(cursor))
    : query(collection(db, "healthData"), ...base);
  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("dateKey") as string | undefined,
  };
}
export async function listRelationshipEdges(limitCount = 100, cursor?: CursorNum) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("weight", "desc"),
    limit(limitCount),
  ] as const;
  const qy = cursor
    ? query(collection(db, "relationshipEdges"), ...base, startAfter(cursor))
    : query(collection(db, "relationshipEdges"), ...base);
  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("weight") as number | undefined,
  };
}

// ---------------------------
// Legacy Scrolls & What-If (uid + createdAt desc)
// ---------------------------
export async function listLegacyScrolls(limitCount = 12, cursor?: CursorTS) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  ] as const;
  const qy = cursor
    ? query(collection(db, "legacyScrolls"), ...base, startAfter(cursor))
    : query(collection(db, "legacyScrolls"), ...base);
  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("createdAt") as Timestamp | undefined,
  };
}
export async function listWhatIf(limitCount = 12, cursor?: CursorTS) {
  const uid = requireUid();
  const base = [
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
    limit(limitCount),
  ] as const;
  const qy = cursor
    ? query(collection(db, "whatIfSimulations"), ...base, startAfter(cursor))
    : query(collection(db, "whatIfSimulations"), ...base);
  const snap = await getDocs(qy);
  return {
    items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
    nextCursor: snap.docs.at(-1)?.get("createdAt") as Timestamp | undefined,
  };
}

// ---------------------------
// Companion state (one doc per user by uid)
// ---------------------------
export async function updateCompanionState(partial: Record<string, any>) {
  const uid = requireUid();
  return addWithUid("companion", { ...partial }, uid);
}
