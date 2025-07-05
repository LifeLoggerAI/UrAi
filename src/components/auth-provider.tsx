
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

const connectToEmulators = () => {
    // This global flag prevents re-connecting on every hot-reload in development.
    if ((globalThis as any).emulatorsConnected) {
        return;
    }

    // A 1-second delay is a pragmatic solution to a race condition in some
    // cloud development environments where network proxies need time to initialize.
    setTimeout(() => {
        try {
            const host = window.location.hostname;
            // In proxied cloud environments, service ports are mapped to subdomains.
            const authHost = host.replace('6000-', '9099-');
            const firestoreHost = host.replace('6000-', '8080-');
            const authUrl = `https://` + authHost;
    
            console.log(`Connecting to proxied emulators...`);
            console.log(`Auth URL: ${authUrl}`);
            console.log(`Firestore Host: ${firestoreHost}`);
    
            // Connect to the emulators using their secure proxy URLs.
            connectAuthEmulator(auth, authUrl, { disableWarnings: true });
            connectFirestoreEmulator(db, firestoreHost, 443, { ssl: true });
    
            (globalThis as any).emulatorsConnected = true;
            console.log("✅ Firebase Emulators connected.");
        } catch (error) {
            console.error("!!! Failed to connect to emulators:", error);
        }
    }, 1000); 
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
    // This ensures that environment-dependent logic runs only on the client.
    setIsClient(true);
  }, []);
  
  useEffect(() => {
    // Connect to emulators only in the development environment.
    if (process.env.NODE_ENV === 'development') {
        connectToEmulators();
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Avoid rendering children until the client-side check and auth state are resolved.
  if (!isClient || loading) {
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
