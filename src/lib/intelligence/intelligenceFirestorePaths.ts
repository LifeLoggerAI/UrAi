export function userIntelligenceSignalsPath(userId: string): string {
  return `users/${userId}/intelligenceSignals`;
}

export function userIntelligenceRunsPath(userId: string): string {
  return `users/${userId}/intelligenceRuns`;
}

export function userLifeMapStarDraftsPath(userId: string): string {
  return `users/${userId}/lifeMapStarDrafts`;
}

export function userGroundBloomDraftsPath(userId: string): string {
  return `users/${userId}/groundBloomDrafts`;
}

export function userMirrorReflectionDraftsPath(userId: string): string {
  return `users/${userId}/mirrorReflectionDrafts`;
}

export function userRitualSuggestionDraftsPath(userId: string): string {
  return `users/${userId}/ritualSuggestionDrafts`;
}
