// src/ai/genkit.ts
import 'server-only';

import { configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export function ensureServer() {
  if (typeof window !== 'undefined') {
    throw new Error('Genkit can only be used on the server');
  }
}

// Minimal server-only setup (avoids OpenTelemetry bundling issues)
export const ai = configureGenkit({
  plugins: [googleAI()],
  enableTracingAndMetrics: false,
});


// Example server function wrapper (dynamic import keeps client bundle clean)
export async function callGeminiServer(prompt: string) {
  ensureServer();
  const { googleAI } = await import('@genkit-ai/googleai');
  // ... implement your actual call here using GEMINI_API_KEY
  return { text: `TODO: model response for: ${prompt}` };
}
