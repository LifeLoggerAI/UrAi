export async function safeAsync<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export function safeJsonParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function safeClientOnly<T>(fn: () => T, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function safeLocalStorageRead<T>(key: string, fallback: T): T {
  return safeClientOnly(() => safeJsonParse<T>(window.localStorage.getItem(key), fallback), fallback);
}

export function safeLocalStorageWrite(key: string, value: unknown): boolean {
  return safeClientOnly(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  }, false);
}

export function safeLocalStorageRemove(key: string): boolean {
  return safeClientOnly(() => {
    window.localStorage.removeItem(key);
    return true;
  }, false);
}
