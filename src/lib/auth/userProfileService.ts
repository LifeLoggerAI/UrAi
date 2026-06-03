import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getUraiFirebaseClient } from "@/lib/firebase/firebaseClient";
import type { UraiAuthMode, UraiUserProfile } from "./authTypes";

const USERS_COLLECTION = "users";
const PROFILE_SCHEMA_VERSION = 1;

function nowIso(): string {
  return new Date().toISOString();
}

function safeProfileDefaults(userId: string, authMode: UraiAuthMode): UraiUserProfile {
  const now = nowIso();
  return {
    userId,
    authMode,
    accountStatus: "active",
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
    onboardingCompleted: false,
    passportInitialized: false,
    cloudSyncEnabled: false,
    schemaVersion: PROFILE_SCHEMA_VERSION,
  };
}

function removeUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}

export async function createOrUpdateUserProfile(
  userId: string,
  partialProfile: Partial<UraiUserProfile>,
): Promise<UraiUserProfile | null> {
  const client = getUraiFirebaseClient();
  if (!client.db) return null;
  const authMode = partialProfile.authMode ?? "authenticated";
  const existing = await getUserProfile(userId);
  const base = existing ?? safeProfileDefaults(userId, authMode);
  const next: UraiUserProfile = {
    ...base,
    ...partialProfile,
    userId,
    authMode,
    accountStatus: partialProfile.accountStatus ?? base.accountStatus ?? "active",
    cloudSyncEnabled: partialProfile.cloudSyncEnabled ?? base.cloudSyncEnabled ?? false,
    passportInitialized: partialProfile.passportInitialized ?? base.passportInitialized ?? false,
    onboardingCompleted: partialProfile.onboardingCompleted ?? base.onboardingCompleted ?? false,
    createdAt: base.createdAt ?? nowIso(),
    updatedAt: nowIso(),
    schemaVersion: PROFILE_SCHEMA_VERSION,
  };
  await setDoc(
    doc(client.db, USERS_COLLECTION, userId),
    removeUndefined({ ...next, serverUpdatedAt: serverTimestamp() }),
    { merge: true },
  );
  return next;
}

export async function getUserProfile(userId: string): Promise<UraiUserProfile | null> {
  const client = getUraiFirebaseClient();
  if (!client.db) return null;
  const snap = await getDoc(doc(client.db, USERS_COLLECTION, userId));
  if (!snap.exists()) return null;
  return snap.data() as UraiUserProfile;
}

export async function markUserLogin(userId: string): Promise<UraiUserProfile | null> {
  return createOrUpdateUserProfile(userId, { accountStatus: "active", lastLoginAt: nowIso() });
}

export async function markAccountPendingDeletion(userId: string): Promise<UraiUserProfile | null> {
  return createOrUpdateUserProfile(userId, { accountStatus: "pending_deletion", cloudSyncEnabled: false });
}

export async function markAccountDeleted(userId: string): Promise<UraiUserProfile | null> {
  return createOrUpdateUserProfile(userId, { accountStatus: "deleted", cloudSyncEnabled: false });
}

export async function mergeLocalProfileIntoCloud(
  userId: string,
  localProfile: Partial<UraiUserProfile>,
): Promise<UraiUserProfile | null> {
  const cloud = await getUserProfile(userId);
  return createOrUpdateUserProfile(userId, {
    displayName: cloud?.displayName ?? localProfile.displayName,
    email: cloud?.email ?? localProfile.email,
    photoURL: cloud?.photoURL ?? localProfile.photoURL,
    onboardingCompleted: cloud?.onboardingCompleted ?? localProfile.onboardingCompleted ?? false,
    passportInitialized: Boolean(cloud?.passportInitialized && localProfile.passportInitialized),
    cloudSyncEnabled: Boolean(cloud?.cloudSyncEnabled && localProfile.cloudSyncEnabled),
    authMode: "authenticated",
    accountStatus: "active",
  });
}
