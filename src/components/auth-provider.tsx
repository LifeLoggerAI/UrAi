
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const connectToEmulators = () => {
    // This function should only run in a browser environment.
    if (typeof window === 'undefined') {
        return;
    }

    console.log("Attempting to connect to Firebase Emulators...");
    try {
        const host = window.location.hostname;
        const protocol = window.location.protocol;

        if (protocol === 'https:' && host.includes('cloudworkstations.dev')) {
            const baseHost = host.substring(host.indexOf('-') + 1);
            
            const authHost = `9099-${baseHost}`;
            const firestoreHost = `8080-${baseHost}`;
            
            connectAuthEmulator(auth, `https://${authHost}`, { disableWarnings: true });
            connectFirestoreEmulator(db, firestoreHost, 443, { ssl: true });

        } else {
            connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
            connectFirestoreEmulator(db, 'localhost', 8080);
        }
        
        console.log("Successfully configured Firebase Emulator connections.");
    } catch (error) {
        console.error("Error connecting to Firebase Emulators during initial attempt:", error);
    }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    // Don't run Firebase logic until the component has mounted on the client
    if (!isMounted) return;

    if (process.env.NODE_ENV === 'development') {
        connectToEmulators();
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isMounted]);

  const value = { user, loading };

  if (!isMounted) {
    // On the server, and the first render on the client, return null.
    // This guarantees the server and client HTML match, preventing a hydration error.
    return null;
  }
  
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
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
