
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

// This global flag prevents re-connecting on every hot-reload in development.
let emulatorsConnected = false;

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
    // This logic should only run in the browser and in development mode.
    if (process.env.NODE_ENV === 'development' && !emulatorsConnected) {
      console.log("Attempting to connect to Firebase Emulators...");

      const connectToEmulators = () => {
        try {
          // Standard localhost connection for emulators
          connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
          connectFirestoreEmulator(db, '127.0.0.1', 8080);
          emulatorsConnected = true;
          console.log("✅ Firebase Emulators connected.");
        } catch (error) {
          console.error("!!! Critical error connecting to emulators:", error);
        }
      };
      
      // A robust delay to ensure the entire environment is ready.
      setTimeout(connectToEmulators, 2000);
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
