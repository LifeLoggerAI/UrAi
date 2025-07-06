
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectFunctionsEmulator } from 'firebase/functions';
import { auth, db, functions } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

// Use a flag to ensure emulators are only connected once.
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
    // This check prevents multiple connection attempts in dev environments with hot reloads.
    if (!emulatorsConnected) {
      const connectEmulators = async () => {
        // Wait to ensure network is up
        await new Promise((res) => setTimeout(res, 1000));
        try {
          console.log("Connecting to Firebase emulators...");
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          connectFirestoreEmulator(db, 'localhost', 8080);
          connectFunctionsEmulator(functions, 'localhost', 5001);
          emulatorsConnected = true;
          console.log("✅ Firebase Emulators connected.");
        } catch (error) {
          console.error("!!! Critical error connecting to emulators:", error);
        }
      };
      connectEmulators();
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
