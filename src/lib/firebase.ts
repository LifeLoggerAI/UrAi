// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const REQUIRED_FIREBASE_ENV_VARS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

function getMissingFirebaseEnvVars() {
  return REQUIRED_FIREBASE_ENV_VARS.filter((key) => !process.env[key]);
}

function createMissingConfigError(missing: readonly string[]) {
  return new Error(
    "Firebase configuration is incomplete. Missing environment variables: " +
      missing.join(", ") +
      ". Check the README for setup instructions.",
  );
}

function getFirebaseConfig() {
  const missing = getMissingFirebaseEnvVars();

  if (missing.length) {
    throw createMissingConfigError(missing);
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  };
}

let cachedApp: FirebaseApp | null = null;

export function isFirebaseConfigured() {
  return getMissingFirebaseEnvVars().length === 0;
}

export function getFirebaseApp() {
  if (cachedApp) return cachedApp;
  cachedApp = getApps().length ? getApp() : initializeApp(getFirebaseConfig());
  return cachedApp;
}

export const app = new Proxy({} as FirebaseApp, {
  get(_target, prop, receiver) {
    return Reflect.get(getFirebaseApp(), prop, receiver);
  },
});

export const auth = () => getAuth(getFirebaseApp());
export const storage = () => getStorage(getFirebaseApp());
export const db = () => getFirestore(getFirebaseApp());
