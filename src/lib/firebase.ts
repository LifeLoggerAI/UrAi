
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
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

const db: Firestore = initializeFirestore(app, {
    cache: memoryLocalCache({})
});

const auth: Auth = getAuth(app);

// In a development environment, connect to the emulators
if (typeof window !== 'undefined' && window.location.hostname === "localhost") {
    console.log("Connecting to Firebase emulators");
    try {
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
    } catch (e) {
        console.error("Error connecting to emulators. This is expected in production.", e);
    }
}


// Initialize Analytics
const analytics: Promise<Analytics | null> = isSupported().then(yes => (yes ? getAnalytics(app) : null));

export { db, auth, analytics };
