// src/ai/genkit.server.ts
import 'server-only';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Lazily initialize so it's only created when used on the server
let _ai: ReturnType<typeof genkit> | null = null;

export function getAI() {
  if (_ai) return _ai;

  _ai = genkit({
    plugins: [
      googleAI({
        apiKey: process.env.GEMINI_API_KEY, // keep server-only
      }),
    ],
    // Change model if 2.0 isn't available in your quota
    model: 'googleai/gemini-2.0-flash',
  });

  return _ai;
}
