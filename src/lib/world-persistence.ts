import type { WorldEntryState } from "@/lib/world-entry";

const STORAGE_KEY = "urai.worldEntry.v1";

function isWorldEntryState(value: unknown): value is WorldEntryState {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<WorldEntryState>;
  if (entry.kind === "quiet" || entry.kind === "default") return true;
  if (entry.kind === "memory") {
    return typeof entry.memory === "string" && typeof entry.vibe === "string";
  }
  return false;
}

export function saveWorldEntry(entry: WorldEntryState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {
    // Local persistence is optional. URAI should still open quietly if storage is unavailable.
  }
}

export function loadWorldEntry(): WorldEntryState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isWorldEntryState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearWorldEntry() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
