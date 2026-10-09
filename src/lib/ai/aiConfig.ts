import type { UraiAIProvider } from "./aiTypes";

export const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
export const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

export function getServerAIConfig(): {
  provider: UraiAIProvider;
  apiKey?: string;
  model: string;
  summaryModel: string;
} {
  const model = process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL;
  const summaryModel = process.env.OPENAI_SUMMARY_MODEL ?? model;
  // Legacy credentials cannot establish canonical atomic spending authority.
  return { provider: "local_fallback", model, summaryModel };
}

export function isAIProviderConfigured(): boolean {
  return getServerAIConfig().provider === "openai";
}
