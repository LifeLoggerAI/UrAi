// functions/src/summarize-text.ts
'use server';
/**
 * @fileOverview A text summarization flow.
 *
 * - summarizeText - A function that summarizes text.
 */

import { genkit as ai } from 'genkit'; // Import genkit as ai
import { z } from 'zod'; // Import z for type inference
import {
  SummarizeTextInputSchema,
  SummarizeTextOutputSchema,
} from '@/lib/types';

// Infer types locally from schemas
type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;
type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

export async function summarizeText(
  input: SummarizeTextInput
): Promise<SummarizeTextOutput | null> {
  return summarizeTextFlow(input);
}

const summarizeTextFlow = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: SummarizeTextInputSchema,
    outputSchema: SummarizeTextOutputSchema,
  },
  async (input: SummarizeTextInput) => {
    const llmResponse = await ai.run('text-bison', input.text);
    const summary = llmResponse.text();

    if (!summary) {
      return null; // Or throw an error, depending on desired behavior
    }

    return { summary };
  }
);
