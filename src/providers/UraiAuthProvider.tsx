"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { deleteUser, onAuthStateChanged, signInAnonymously, signOut as firebaseSignOut, type User } from "firebase/auth";
import { getUraiFirebaseClient } from "@/lib/firebase/firebaseClient";

type UraiAuthContextValue = {
  user: User | null;
  userId: string | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  authLoading: boolean;
  signInAnonymouslyIfNeeded: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  authError: string | null;
};

const UraiAuthContext = createContext<UraiAuthContextValue | null>(null);

export function UraiAuthProvider({ children }: { children: ReactNode }) {
  const client = getUraiFirebaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(client.auth));
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!client.auth) {
      setAuthLoading(false);
      return;
    }
    return onAuthStateChanged(client.auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    }, () => {
      setAuthError("Auth is unavailable right now.");
      setAuthLoading(false);
    });
  }, [client.auth]);

  const signInAnonymouslyIfNeeded = useCallback(async () => {
    if (!client.auth || client.auth.currentUser) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInAnonymously(client.auth);
    } catch {
      setAuthError("Could not start cloud session. URAI will stay local.");
    } finally {
      setAuthLoading(false);
    }
  }, [client.auth]);

  const signOut = useCallback(async () => {
    if (!client.auth) return;
    try {
      await firebaseSignOut(client.auth);
      setUser(null);
    } catch {
      setAuthError("Could not sign out right now.");
    }
  }, [client.auth]);

  const deleteAccount = useCallback(async () => {
    if (!client.auth?.currentUser) return;
    try {
      await deleteUser(client.auth.currentUser);
      setUser(null);
    } catch {
      setAuthError("Account deletion needs to be tried again after signing in.");
    }
  }, [client.auth]);

  const value = useMemo<UraiAuthContextValue>(() => ({
    user,
    userId: user?.uid ?? null,
    isAuthenticated: Boolean(user),
    isAnonymous: Boolean(user?.isAnonymous),
    authLoading,
    signInAnonymouslyIfNeeded,
    signOut,
    deleteAccount,
    authError,
  }), [authError, authLoading, deleteAccount, signInAnonymouslyIfNeeded, signOut, user]);

  return <UraiAuthContext.Provider value={value}>{children}</UraiAuthContext.Provider>;
}

export function useUraiAuth(): UraiAuthContextValue {
  const context = useContext(UraiAuthContext);
  if (!context) throw new Error("useUraiAuth must be used inside UraiAuthProvider");
  return context;
}
