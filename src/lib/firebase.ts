
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAMovq3zvqgmsBBPhsjDQudb8kltxUbYV4",
  authDomain: "lifelogger-clean.firebaseapp.com",
  projectId: "lifelogger-clean",
  storageBucket: "lifelogger-clean.appspot.com",
  messagingSenderId: "360527756764",
  appId: "1:360527756764:web:a8b052be78d57340c8a319"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Updated Firestore initialization with offline persistence
const db: Firestore = initializeFirestore(app, {
    cache: memoryLocalCache({})
});

const auth: Auth = getAuth(app);

// Initialize Analytics
const analytics: Promise<Analytics | null> = isSupported().then(yes => (yes ? getAnalytics(app) : null));

export { db, auth, analytics };
