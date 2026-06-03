import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import type { UraiFirebaseClientState } from "./firebaseTypes";

type FirebaseClientBundle = {
  app: FirebaseApp | null;
  auth: Auth | null;
  db: Firestore | null;
  storage: FirebaseStorage | null;
  state: UraiFirebaseClientState;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function hasFirebaseConfig(): boolean {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
}

let cachedClient: FirebaseClientBundle | null = null;

export function getUraiFirebaseClient(): FirebaseClientBundle {
  if (cachedClient) return cachedClient;
  if (!hasFirebaseConfig()) {
    cachedClient = { app: null, auth: null, db: null, storage: null, state: { configured: false, reason: "missing_config" } };
    return cachedClient;
  }
  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    cachedClient = { app, auth: getAuth(app), db: getFirestore(app), storage: getStorage(app), state: { configured: true, reason: "ready" } };
    return cachedClient;
  } catch {
    cachedClient = { app: null, auth: null, db: null, storage: null, state: { configured: false, reason: "init_error" } };
    return cachedClient;
  }
}

export function isFirebaseConfigured(): boolean {
  return getUraiFirebaseClient().state.configured;
}
