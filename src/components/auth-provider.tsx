'use client';

import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { devMode, seedDemoData, DEMO_USER_ID } from '@/lib/dev-mode';

// Create a mock user object for demo mode
const mockUser = {
  uid: DEMO_USER_ID,
  displayName: 'Demo User',
  email: 'test@lifelogger.app',
  photoURL: `https://placehold.co/128x128.png?text=D`,
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  // Add other necessary User properties as needed, with mock values
} as User;


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
    if (devMode) {
      // In development, bypass Firebase Auth and use a mock user
      console.log("DEV MODE: Bypassing auth with mock user.");
      seedDemoData(DEMO_USER_ID).then(() => {
        setUser(mockUser);
        setLoading(false);
      });
    } else {
      // In production, use real Firebase Auth
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
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
