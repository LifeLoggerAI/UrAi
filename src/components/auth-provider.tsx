
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

const connectToEmulators = () => {
    // This global flag prevents re-connecting on every hot-reload.
    if ((globalThis as any).emulatorsConnected) {
        return;
    }

    const host = window.location.hostname;

    // In a cloud IDE, we connect to the proxied HTTPS endpoints.
    const baseHost = host.substring(host.indexOf('-') + 1);
    const authUrl = `https://9099-${baseHost}`;
    const firestoreHost = `8080-${baseHost}`;
    
    console.log(`Cloud Dev environment detected. Connecting to proxied emulators at ${authUrl} and ${firestoreHost}`);
    connectAuthEmulator(auth, authUrl, { disableWarnings: true });
    connectFirestoreEmulator(db, firestoreHost, 443, { ssl: true });
    
    (globalThis as any).emulatorsConnected = true;
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

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
        try {
            // A sufficient delay to ensure network proxies are ready in the cloud IDE.
            setTimeout(connectToEmulators, 1000);
        } catch (error) {
            console.error("Failed to connect to emulators during initial setup:", error);
        }
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
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
