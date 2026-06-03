import type { UraiAIProvider, UraiAISafetyLevel, UraiAISuggestedActionType } from "./aiTypes";

export type UraiAILogMetadata = {
  timestamp: string;
  provider: UraiAIProvider;
  mode: string;
  safetyLevel: UraiAISafetyLevel;
  suggestedActionType: UraiAISuggestedActionType;
  success: boolean;
};

export function createAILogMetadata(input: Omit<UraiAILogMetadata, "timestamp">): UraiAILogMetadata {
  return { ...input, timestamp: new Date().toISOString() };
}

export function shouldLogRawAIPrompt(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.URAI_LOG_RAW_AI_PROMPTS === "true";
}

export function logAIMetadata(metadata: UraiAILogMetadata): void {
  if (process.env.NODE_ENV === "test") return;
  if (process.env.URAI_AI_METADATA_LOGS !== "true") return;
  console.info("URAI_AI_METADATA", metadata);
}
