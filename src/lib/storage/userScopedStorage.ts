export function getUserScopedKey(baseKey: string, userId?: string | null): string {
  const scopedUserId = userId || "local";
  return `${baseKey}.${scopedUserId}`;
}

export function readUserScopedValue<T>(baseKey: string, userId?: string | null, fallback?: T): T | null {
  if (typeof window === "undefined") return fallback ?? null;
  const scopedKey = getUserScopedKey(baseKey, userId);
  const scoped = window.localStorage.getItem(scopedKey);
  const legacy = scoped ?? window.localStorage.getItem(baseKey);
  if (legacy == null) return fallback ?? null;
  try {
    return JSON.parse(legacy) as T;
  } catch {
    return legacy as T;
  }
}

export function writeUserScopedValue<T>(baseKey: string, userId: string | undefined | null, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getUserScopedKey(baseKey, userId), JSON.stringify(value));
}

export function removeUserScopedValue(baseKey: string, userId?: string | null): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(getUserScopedKey(baseKey, userId));
}

export function migrateLegacyUserScopedValue(baseKey: string, userId?: string | null): void {
  if (typeof window === "undefined") return;
  const scopedKey = getUserScopedKey(baseKey, userId);
  if (window.localStorage.getItem(scopedKey) != null) return;
  const legacy = window.localStorage.getItem(baseKey);
  if (legacy != null) window.localStorage.setItem(scopedKey, legacy);
}
