"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile as updateFirebaseProfile,
  type User,
} from "firebase/auth";
import { getUraiFirebaseClient } from "@/lib/firebase/firebaseClient";
import type { UraiAuthMode, UraiAuthState, UraiUserProfile } from "@/lib/auth/authTypes";
import {
  clearLocalIdentity,
  getLocalUserProfile,
  getOrCreateLocalUserId,
  saveLocalUserProfile,
  setLocalAuthMode,
} from "@/lib/auth/localIdentity";
import {
  createOrUpdateUserProfile,
  getUserProfile,
  markAccountDeleted,
  markAccountPendingDeletion,
  markUserLogin,
} from "@/lib/auth/userProfileService";

type DeleteAccountOptions = { clearLocal?: boolean };
type UpdateProfileInput = Partial<Pick<UraiUserProfile, "displayName" | "photoURL" | "onboardingCompleted" | "passportInitialized" | "cloudSyncEnabled">>;

type UraiAuthContextValue = {
  authState: UraiAuthState;
  user: User | null;
  userId: string | null;
  profile: UraiUserProfile | null;
  authMode: UraiAuthMode;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isLocalOnly: boolean;
  authLoading: boolean;
  authError: string | null;
  continueLocalOnly: () => void;
  signInAnonymouslyIfNeeded: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  createAccountWithEmail: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: (options?: { clearLocal?: boolean }) => Promise<void>;
  deleteAccount: (options?: DeleteAccountOptions) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (partial: UpdateProfileInput) => Promise<void>;
};

const UraiAuthContext = createContext<UraiAuthContextValue | null>(null);
const SAFE_AUTH_ERROR = "Sign-in did not open cleanly. You can still continue on this device.";

function nowIso(): string {
  return new Date().toISOString();
}

function profileFromUser(user: User, existing?: UraiUserProfile | null): UraiUserProfile {
  const timestamp = nowIso();
  return {
    userId: user.uid,
    displayName: user.displayName ?? existing?.displayName ?? undefined,
    email: user.email ?? existing?.email ?? undefined,
    photoURL: user.photoURL ?? existing?.photoURL ?? undefined,
    authMode: user.isAnonymous ? "anonymous" : "authenticated",
    accountStatus: "active",
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
    lastLoginAt: timestamp,
    onboardingCompleted: existing?.onboardingCompleted ?? false,
    passportInitialized: existing?.passportInitialized ?? false,
    cloudSyncEnabled: existing?.cloudSyncEnabled ?? false,
    schemaVersion: existing?.schemaVersion ?? 1,
  };
}

export function UraiAuthProvider({ children }: { children: ReactNode }) {
  const client = getUraiFirebaseClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UraiUserProfile | null>(null);
  const [authMode, setAuthMode] = useState<UraiAuthMode>("local");
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadLocalProfile = useCallback(() => {
    const localProfile = getLocalUserProfile();
    setProfile(localProfile);
    setAuthMode("local");
    setLocalAuthMode("local");
  }, []);

  const hydrateCloudProfile = useCallback(async (nextUser: User) => {
    const mode: UraiAuthMode = nextUser.isAnonymous ? "anonymous" : "authenticated";
    setLocalAuthMode(mode);
    const existing = await getUserProfile(nextUser.uid);
    const nextProfile = await createOrUpdateUserProfile(nextUser.uid, profileFromUser(nextUser, existing));
    await markUserLogin(nextUser.uid);
    setProfile(nextProfile ?? profileFromUser(nextUser, existing));
    setAuthMode(mode);
  }, []);

  useEffect(() => {
    getOrCreateLocalUserId();
    if (!client.auth) {
      loadLocalProfile();
      setAuthLoading(false);
      return;
    }
    return onAuthStateChanged(
      client.auth,
      (nextUser) => {
        void (async () => {
          setAuthLoading(true);
          setAuthError(null);
          try {
            setUser(nextUser);
            if (nextUser) await hydrateCloudProfile(nextUser);
            else loadLocalProfile();
          } catch {
            setAuthError("URAI could not refresh the account calmly. Local mode is still available.");
            loadLocalProfile();
          } finally {
            setAuthLoading(false);
          }
        })();
      },
      () => {
        setAuthError("Auth is unavailable right now. URAI will stay on this device.");
        loadLocalProfile();
        setAuthLoading(false);
      },
    );
  }, [client.auth, hydrateCloudProfile, loadLocalProfile]);

  const continueLocalOnly = useCallback(() => {
    setUser(null);
    loadLocalProfile();
    setAuthError(null);
  }, [loadLocalProfile]);

  const signInAnonymouslyIfNeeded = useCallback(async () => {
    if (!client.auth) {
      continueLocalOnly();
      return;
    }
    if (client.auth.currentUser) return;
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInAnonymously(client.auth);
    } catch {
      setAuthError("Could not start cloud session. URAI will stay local.");
      continueLocalOnly();
    } finally {
      setAuthLoading(false);
    }
  }, [client.auth, continueLocalOnly]);

  const signInWithGoogle = useCallback(async () => {
    if (!client.auth) {
      setAuthError(SAFE_AUTH_ERROR);
      continueLocalOnly();
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(client.auth, new GoogleAuthProvider());
    } catch {
      setAuthError(SAFE_AUTH_ERROR);
    } finally {
      setAuthLoading(false);
    }
  }, [client.auth, continueLocalOnly]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    if (!client.auth || !email || !password) {
      setAuthError(SAFE_AUTH_ERROR);
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(client.auth, email, password);
    } catch {
      setAuthError(SAFE_AUTH_ERROR);
    } finally {
      setAuthLoading(false);
    }
  }, [client.auth]);

  const createAccountWithEmail = useCallback(async (email: string, password: string) => {
    if (!client.auth || !email || !password) {
      setAuthError(SAFE_AUTH_ERROR);
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      await createUserWithEmailAndPassword(client.auth, email, password);
    } catch {
      setAuthError(SAFE_AUTH_ERROR);
    } finally {
      setAuthLoading(false);
    }
  }, [client.auth]);

  const sendPasswordReset = useCallback(async (email: string) => {
    if (!client.auth || !email) {
      setAuthError("Password reset did not open cleanly. You can still continue on this device.");
      return;
    }
    setAuthError(null);
    try {
      await sendPasswordResetEmail(client.auth, email);
    } catch {
      setAuthError("Password reset did not open cleanly. You can still continue on this device.");
    }
  }, [client.auth]);

  const refreshProfile = useCallback(async () => {
    if (user) await hydrateCloudProfile(user);
    else loadLocalProfile();
  }, [hydrateCloudProfile, loadLocalProfile, user]);

  const updateProfile = useCallback(async (partial: UpdateProfileInput) => {
    const targetUserId = user?.uid ?? profile?.userId ?? getOrCreateLocalUserId();
    const nextProfile: UraiUserProfile = {
      ...(profile ?? getLocalUserProfile()),
      ...partial,
      userId: targetUserId,
      authMode,
      updatedAt: nowIso(),
    };
    setProfile(nextProfile);
    if (user && client.auth?.currentUser) {
      if (partial.displayName || partial.photoURL) {
        await updateFirebaseProfile(client.auth.currentUser, {
          displayName: partial.displayName,
          photoURL: partial.photoURL,
        });
      }
      await createOrUpdateUserProfile(user.uid, nextProfile);
    } else {
      saveLocalUserProfile(nextProfile);
    }
  }, [authMode, client.auth, profile, user]);

  const signOut = useCallback(async (options?: { clearLocal?: boolean }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (profile?.userId && user) await createOrUpdateUserProfile(profile.userId, { accountStatus: "signed_out", cloudSyncEnabled: false });
      if (client.auth?.currentUser) await firebaseSignOut(client.auth);
      setUser(null);
      if (options?.clearLocal) clearLocalIdentity();
      loadLocalProfile();
    } catch {
      setAuthError("Could not sign out right now. URAI is still safe on this device.");
    } finally {
      setAuthLoading(false);
    }
  }, [client.auth, loadLocalProfile, profile?.userId, user]);

  const deleteAccount = useCallback(async (options?: DeleteAccountOptions) => {
    const currentUser = client.auth?.currentUser;
    if (!currentUser) {
      if (options?.clearLocal) clearLocalIdentity();
      loadLocalProfile();
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      await markAccountPendingDeletion(currentUser.uid);
      await markAccountDeleted(currentUser.uid);
      await deleteUser(currentUser);
      setUser(null);
      if (options?.clearLocal) clearLocalIdentity();
      loadLocalProfile();
    } catch {
      setAuthError("Account deletion needs to be tried again after signing in.");
    } finally {
      setAuthLoading(false);
    }
  }, [client.auth, loadLocalProfile]);

  const isAuthenticated = Boolean(user);
  const isAnonymous = Boolean(user?.isAnonymous);
  const isLocalOnly = authMode === "local" || !isAuthenticated;
  const userId = user?.uid ?? profile?.userId ?? null;
  const authState: UraiAuthState = {
    userId: userId ?? undefined,
    profile: profile ?? undefined,
    authMode,
    isAuthenticated,
    isAnonymous,
    isLocalOnly,
    loading: authLoading,
    error: authError ?? undefined,
  };

  const value = useMemo<UraiAuthContextValue>(() => ({
    authState,
    user,
    userId,
    profile,
    authMode,
    isAuthenticated,
    isAnonymous,
    isLocalOnly,
    authLoading,
    authError,
    continueLocalOnly,
    signInAnonymouslyIfNeeded,
    signInWithGoogle,
    signInWithEmail,
    createAccountWithEmail,
    sendPasswordReset,
    signOut,
    deleteAccount,
    refreshProfile,
    updateProfile,
  }), [authError, authLoading, authMode, authState, continueLocalOnly, createAccountWithEmail, deleteAccount, isAnonymous, isAuthenticated, isLocalOnly, profile, refreshProfile, sendPasswordReset, signInAnonymouslyIfNeeded, signInWithEmail, signInWithGoogle, signOut, updateProfile, user, userId]);

  return <UraiAuthContext.Provider value={value}>{children}</UraiAuthContext.Provider>;
}

export function useUraiAuth(): UraiAuthContextValue {
  const context = useContext(UraiAuthContext);
  if (!context) throw new Error("useUraiAuth must be used inside UraiAuthProvider");
  return context;
}
