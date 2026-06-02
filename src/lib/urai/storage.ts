import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase";
import {
  userConsentPath,
  userMemoryStarsCollectionPath,
  userMoodWeatherPath,
  userPassportPath,
  userReflectionsCollectionPath,
  userSignalsCollectionPath,
} from "./firestore-paths";
import type {
  UraiConsentState,
  UraiMemoryStar,
  UraiMoodWeather,
  UraiNarratorReflection,
  UraiPassiveSignal,
  UraiPassportState,
} from "./types";

export type UraiPersistenceStatus = "firebase" | "local";

function memoryKey(path: string): string {
  return `urai:${path}`;
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

async function writeJson(path: string, value: unknown): Promise<UraiPersistenceStatus> {
  if (isFirebaseConfigured()) {
    await setDoc(doc(db(), path), value, { merge: true });
    return "firebase";
  }

  if (canUseLocalStorage()) {
    window.localStorage.setItem(memoryKey(path), JSON.stringify(value));
  }

  return "local";
}

async function readJson<T>(path: string): Promise<T | null> {
  if (isFirebaseConfigured()) {
    const snapshot = await getDoc(doc(db(), path));
    return snapshot.exists() ? (snapshot.data() as T) : null;
  }

  if (!canUseLocalStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(memoryKey(path));
  return raw ? (JSON.parse(raw) as T) : null;
}

export async function saveConsentState(consent: UraiConsentState): Promise<UraiPersistenceStatus> {
  return writeJson(userConsentPath(consent.userId), consent);
}

export async function loadConsentState(userId: string): Promise<UraiConsentState | null> {
  return readJson<UraiConsentState>(userConsentPath(userId));
}

export async function savePassportState(passport: UraiPassportState): Promise<UraiPersistenceStatus> {
  return writeJson(userPassportPath(passport.userId), passport);
}

export async function loadPassportState(userId: string): Promise<UraiPassportState | null> {
  return readJson<UraiPassportState>(userPassportPath(userId));
}

export async function saveMoodWeather(moodWeather: UraiMoodWeather): Promise<UraiPersistenceStatus> {
  return writeJson(userMoodWeatherPath(moodWeather.userId), moodWeather);
}

export async function savePassiveSignal(signal: UraiPassiveSignal): Promise<UraiPersistenceStatus> {
  return writeJson(`${userSignalsCollectionPath(signal.userId)}/${signal.id}`, signal);
}

export async function saveNarratorReflection(
  reflection: UraiNarratorReflection,
): Promise<UraiPersistenceStatus> {
  return writeJson(
    `${userReflectionsCollectionPath(reflection.userId)}/${reflection.id}`,
    reflection,
  );
}

export async function saveMemoryStar(star: UraiMemoryStar): Promise<UraiPersistenceStatus> {
  return writeJson(`${userMemoryStarsCollectionPath(star.userId)}/${star.id}`, star);
}

export async function saveGenesisHomeSnapshot(input: {
  consent: UraiConsentState;
  passport: UraiPassportState;
  moodWeather: UraiMoodWeather;
  signals: UraiPassiveSignal[];
  reflections: UraiNarratorReflection[];
  memoryStars: UraiMemoryStar[];
}): Promise<UraiPersistenceStatus> {
  const statuses = await Promise.all([
    saveConsentState(input.consent),
    savePassportState(input.passport),
    saveMoodWeather(input.moodWeather),
    ...input.signals.map(savePassiveSignal),
    ...input.reflections.map(saveNarratorReflection),
    ...input.memoryStars.map(saveMemoryStar),
  ]);

  return statuses.includes("firebase") ? "firebase" : "local";
}
