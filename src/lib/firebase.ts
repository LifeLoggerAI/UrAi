// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
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

const firebaseConfig = (() => {
  const missing = REQUIRED_FIREBASE_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length) {
    const message =
      "Firebase configuration is incomplete. Missing environment variables: " +
      missing.join(", ") +
      ". Check the README for setup instructions.";
    console.error(message);
    throw new Error(message);
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY as string,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID as string,
  };
})();

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = () => getAuth(app);
export const storage = () => getStorage(app);
export const db = () => getFirestore(app);
