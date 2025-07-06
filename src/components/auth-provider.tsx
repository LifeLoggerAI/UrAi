
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
let devModeInitialized = false;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      if (devMode) {
        // --- Development Mode ---
        if (!devModeInitialized) {
          console.log("🚀 Dev mode enabled. Loading mock user and data...");
          await loadMockData();
          devModeInitialized = true;
        }
        setUser(mockUser as User);
        setLoading(false);
      } else {
        // --- Production/Emulator Mode ---
        if (!emulatorsConnected) {
          try {
            connectAuthEmulator(auth, 'http://localhost:9199', { disableWarnings: true });
            connectFirestoreEmulator(db, 'localhost', 8280);
            connectFunctionsEmulator(functions, 'localhost', 5150);
          } catch (error) {
            console.error("Error connecting to emulators:", error);
          }
          emulatorsConnected = true;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          setLoading(false);
        });
        return () => unsubscribe();
      }
    };
    
    initialize();
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
