
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "dummy-key",
  authDomain: "dummy-project.firebaseapp.com",
  projectId: "lifelogger-demo",
  storageBucket: "dummy-project.appspot.com",
  messagingSenderId: "dummy-sender-id",
  appId: "dummy-app-id"
};

// Initialize Firebase App
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

// In a development environment, connect to the emulators.
// We use a global flag to ensure this only runs once per full page load,
// which is the most robust way to handle Next.js's hot-reloading.
if (process.env.NODE_ENV === 'development') {
    const globalWithEmulators = globalThis as typeof globalThis & {
        _firebaseEmulatorsConnected: boolean
    }

    if (!globalWithEmulators._firebaseEmulatorsConnected) {
        console.log("Connecting to Firebase Emulators for the first time...");
        connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
        globalWithEmulators._firebaseEmulatorsConnected = true;
        console.log("Connection to emulators established.");
    }
}

export { db, auth };
