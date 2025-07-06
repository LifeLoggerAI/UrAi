
'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectFunctionsEmulator } from 'firebase/functions';
import { auth, db, functions } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { devMode, mockUser, loadMockData } from '@/lib/dev-mode';

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

let emulatorsConnected = false;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Connect to emulators on every startup in this environment.
      if (!emulatorsConnected) {
        try {
          console.log("Connecting to Firebase emulators...");
          connectAuthEmulator(auth, 'http://localhost:9199', { disableWarnings: true });
          connectFirestoreEmulator(db, 'localhost', 8280);
          connectFunctionsEmulator(functions, 'localhost', 5150);
          console.log("✅ Emulators connected.");
        } catch (error) {
          console.error("Error connecting to emulators:", error);
        }
        emulatorsConnected = true;
      }

      if (devMode) {
        // --- Development Mode ---
        console.log("🚀 Dev mode enabled. Loading mock user and data...");
        await loadMockData();
        console.log("✅ Dev mode user loaded");
        setUser(mockUser as User);
        setLoading(false);
      } else {
        // --- Production Mode ---
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
      }
    };
    
    initializeApp();
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
