
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, type Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "dummy-key",
  authDomain: "dummy-project.firebaseapp.com",
  projectId: "lifelogger-demo",
  storageBucket: "dummy-project.appspot.com",
  messagingSenderId: "dummy-sender-id",
  appId: "dummy-app-id"
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

if (process.env.NODE_ENV === 'development') {
  // Check if we're on the client side before trying to connect to emulators
  if (typeof window !== 'undefined') {
    // Use a global flag to prevent reconnecting on hot reloads
    if (!(globalThis as any)._firebaseEmulatorsConnected) {
      console.log("Connecting to Firebase Emulators for the first time...");
      try {
          connectAuthEmulator(auth, `http://localhost:9099`, { disableWarnings: true });
          connectFirestoreEmulator(db, 'localhost', 8080);
          (globalThis as any)._firebaseEmulatorsConnected = true;
          console.log("Connection to emulators established.");
      } catch (error) {
          console.error("Error connecting to emulators:", error);
      }
    }
  }
}

export { db, auth };
