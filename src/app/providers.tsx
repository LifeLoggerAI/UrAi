
// src/app/providers.tsx
'use client';
import { ReactNode, useEffect } from 'react';
import { AuthProvider } from '@/components/auth-provider';
import { getFirebaseApp } from "@/lib/firebaseClient";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { saveFcmToken } from '@/lib/fcm';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';


export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const app = getFirebaseApp();
    if (app) {

      // Initialize App Check
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
          isTokenAutoRefreshEnabled: true,
        });
        console.log("Firebase App Check initialized.");
      } else {
        console.warn("App Check not initialized: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set.");
      }

      // Handle Auth State and FCM Token
      const auth = getAuth(app);
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, save their FCM token.
          // This will request permission if not already granted.
          saveFcmToken(user.uid);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // initialize any client-side providers here
  return <AuthProvider>{children}</AuthProvider>;
}
