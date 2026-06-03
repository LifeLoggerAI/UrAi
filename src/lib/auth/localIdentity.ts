import type { UraiAuthMode, UraiUserProfile } from "./authTypes";

const LOCAL_USER_ID_KEY = "urai.local.userId";
const LOCAL_AUTH_MODE_KEY = "urai.local.authMode";
const LOCAL_PROFILE_KEY = "urai.local.profile";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function createUuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function getOrCreateLocalUserId(): string {
  if (!canUseStorage()) return "local-ssr";
  const existing = window.localStorage.getItem(LOCAL_USER_ID_KEY);
  if (existing) return existing;
  const next = createUuid();
  window.localStorage.setItem(LOCAL_USER_ID_KEY, next);
  return next;
}

export function getLocalAuthMode(): UraiAuthMode {
  if (!canUseStorage()) return "local";
  const value = window.localStorage.getItem(LOCAL_AUTH_MODE_KEY);
  return value === "anonymous" || value === "authenticated" ? value : "local";
}

export function setLocalAuthMode(mode: UraiAuthMode): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(LOCAL_AUTH_MODE_KEY, mode);
}

export function clearLocalIdentity(): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(LOCAL_USER_ID_KEY);
  window.localStorage.removeItem(LOCAL_AUTH_MODE_KEY);
  window.localStorage.removeItem(LOCAL_PROFILE_KEY);
}

export function getLocalUserProfile(): UraiUserProfile {
  if (canUseStorage()) {
    const raw = window.localStorage.getItem(LOCAL_PROFILE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as UraiUserProfile;
      } catch {
        window.localStorage.removeItem(LOCAL_PROFILE_KEY);
      }
    }
  }

  const timestamp = nowIso();
  const profile: UraiUserProfile = {
    userId: getOrCreateLocalUserId(),
    authMode: "local",
    accountStatus: "active",
    createdAt: timestamp,
    updatedAt: timestamp,
    onboardingCompleted: false,
    passportInitialized: false,
    cloudSyncEnabled: false,
    schemaVersion: 1,
  };
  saveLocalUserProfile(profile);
  return profile;
}

export function saveLocalUserProfile(profile: UraiUserProfile): void {
  if (!canUseStorage()) return;
  window.localStorage.setItem(
    LOCAL_PROFILE_KEY,
    JSON.stringify({ ...profile, updatedAt: nowIso(), authMode: profile.authMode ?? "local" }),
  );
}
