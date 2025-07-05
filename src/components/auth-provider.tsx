
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

const connectToEmulators = () => {
    // This global flag prevents re-connecting on every hot-reload, which is a major source of instability.
    if ((globalThis as any).emulatorsConnected) {
        return;
    }

    console.log("Attempting to connect to Firebase Emulators...");

    // A robust delay to ensure the cloud environment's network proxies are ready.
    setTimeout(() => {
        try {
            // In the cloud dev environment, we connect to the proxied URLs, not localhost.
            const host = window.location.hostname;
            const authHost = `9099-${host}`;
            const firestoreHost = `8080-${host}`;
            
            console.log(`Auth host: https://${authHost}`);
            console.log(`Firestore host: ${firestoreHost}:443`);

            connectAuthEmulator(auth, `https://${authHost}`, { disableWarnings: true });
            connectFirestoreEmulator(db, firestoreHost, 443, { ssl: true });
            
            (globalThis as any).emulatorsConnected = true;
            console.log("✅ Firebase Emulators connected successfully.");

        } catch (error) {
            console.error("!!! Failed to connect to emulators:", error);
        }
    }, 1000); // 1-second delay for stability.
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
        connectToEmulators();
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!isClient) {
    return null;
  }
  
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading: false }}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
