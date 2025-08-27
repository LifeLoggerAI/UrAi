
'use client';

import {
  useState,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
  useRef,
} from 'react';
import type { User } from 'firebase/auth';
<<<<<<< HEAD
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
=======
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '@/lib/firebase';
>>>>>>> 5be23281 (Commit before pulling remote changes)
import { Loader2 } from 'lucide-react';
import { devMode, seedDemoData, DEMO_USER_ID } from '@/lib/dev-mode';

const auth = getAuth(app);

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
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    initialized.current = true;

    if (devMode) {
      const setupDemoMode = async () => {
        console.log('DEV MODE: Bypassing auth with mock user.');
        await seedDemoData(DEMO_USER_ID); // Ensure data is seeded before setting user
        setUser(mockUser);
        setLoading(false);
      };
      setupDemoMode();
    } else {
<<<<<<< HEAD
      // In production, use real Firebase Auth
=======
>>>>>>> 5be23281 (Commit before pulling remote changes)
      const unsubscribe = onAuthStateChanged(auth, user => {
        setUser(user);
        setLoading(false);
      });
<<<<<<< HEAD
      // Cleanup subscription on unmount
=======
>>>>>>> 5be23281 (Commit before pulling remote changes)
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
