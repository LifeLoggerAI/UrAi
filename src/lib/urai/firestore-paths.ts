export const URAI_FIRESTORE_ROOT = "uraiGenesis";

export function userGenesisPath(userId: string): string {
  return `${URAI_FIRESTORE_ROOT}/${userId}`;
}

export function userConsentPath(userId: string): string {
  return `${userGenesisPath(userId)}/state/consent`;
}

export function userPassportPath(userId: string): string {
  return `${userGenesisPath(userId)}/state/passport`;
}

export function userMoodWeatherPath(userId: string): string {
  return `${userGenesisPath(userId)}/state/moodWeather`;
}

export function userSignalsCollectionPath(userId: string): string {
  return `${userGenesisPath(userId)}/signals`;
}

export function userReflectionsCollectionPath(userId: string): string {
  return `${userGenesisPath(userId)}/reflections`;
}

export function userMemoryStarsCollectionPath(userId: string): string {
  return `${userGenesisPath(userId)}/memoryStars`;
}
