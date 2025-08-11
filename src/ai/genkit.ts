// src/ai/genkit.ts
import 'server-only';

import { configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Minimal server-only setup (avoids OpenTelemetry bundling issues)
export const ai = configureGenkit({
  plugins: [googleAI()],
  enableTracingAndMetrics: false,
});

// Optional helper used by some flows
export async function runGemini(options: { model?: string; prompt?: string; input?: unknown }) {
  const { model = 'models/gemini-1.5-flash', prompt = '', input } = options;
  return ai.generate(input ? { model, input } : { model, prompt });
}
