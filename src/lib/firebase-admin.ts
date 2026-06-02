import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function hasAdminEnv(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

function getPrivateKey(): string {
  return String(process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
}

function ensureAdminApp() {
  if (!hasAdminEnv()) return null;

  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: getPrivateKey()
      })
    });
  }

  return getApps()[0];
}

export function isFirebaseAdminConfigured(): boolean {
  return hasAdminEnv();
}

export function getAdminDb() {
  const app = ensureAdminApp();
  if (!app) return null;
  return getFirestore(app);
}

export function getAdminAuth() {
  const app = ensureAdminApp();
  if (!app) return null;
  return getAuth(app);
}
