import type { UraiAIProvider } from "./aiTypes";

export const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
export const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

export function getServerAIConfig(): {
  provider: UraiAIProvider;
  apiKey?: string;
  model: string;
  summaryModel: string;
} {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL;
  const summaryModel = process.env.OPENAI_SUMMARY_MODEL ?? model;
  if (!apiKey) return { provider: "local_fallback", model, summaryModel };
  return { provider: "openai", apiKey, model, summaryModel };
}

export function isAIProviderConfigured(): boolean {
  return getServerAIConfig().provider === "openai";
}
