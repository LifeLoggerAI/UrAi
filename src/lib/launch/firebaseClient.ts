import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";
import { getAnalytics, isSupported, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export function hasFirebaseConfig() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseConfig()) return null;
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
}

export function getLaunchDb() {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}

export function getLaunchAuth() {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

export async function trackLaunchEvent(eventName: string, metadata: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const app = getFirebaseApp();
  if (!app) return;
  try {
    if (await isSupported()) {
      const analytics = getAnalytics(app);
      logEvent(analytics, eventName, metadata);
    }
  } catch {
    // Analytics should never break launch capture.
  }
  const db = getLaunchDb();
  if (!db) return;
  try {
    await addDoc(collection(db, "analyticsEvents"), {
      eventName,
      route: window.location.pathname,
      metadata,
      createdAt: serverTimestamp(),
    });
  } catch {
    // Firestore analytics mirror is best-effort.
  }
}

export async function addLaunchDocument<T extends Record<string, unknown>>(collectionName: string, payload: T) {
  const db = getLaunchDb();
  const enriched = { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  if (!db) {
    console.warn(`Firebase config missing; skipped ${collectionName} write`, enriched);
    return { id: "local-preview", offline: true };
  }
  return addDoc(collection(db, collectionName), enriched);
}
