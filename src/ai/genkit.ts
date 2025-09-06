import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('Missing GOOGLE_AI_API_KEY or GEMINI_API_KEY environment variable');
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey,
    }),
  ],
});
