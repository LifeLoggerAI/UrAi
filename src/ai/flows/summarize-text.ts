'use server';
/**
 * @fileOverview A flow to summarize a collection of text entries.
 *
 * - summarizeText - A function that takes a block of text and returns a summary.
 * - SummarizeTextInput - The input type for the function.
 * - SummarizeTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import {
  SummarizeTextInputSchema,
  SummarizeTextOutputSchema,
} from '@/lib/types';
import type { z } from 'zod';

type SummarizeTextInput = z.infer<typeof SummarizeTextInputSchema>;
type SummarizeTextOutput = z.infer<typeof SummarizeTextOutputSchema>;

export async function summarizeText(
  input: SummarizeTextInput
): Promise<SummarizeTextOutput | null> {
  return summarizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTextPrompt',
  input: { schema: SummarizeTextInputSchema },
  output: { schema: SummarizeTextOutputSchema },
  prompt: `You are an expert at synthesizing information and finding patterns in journal entries.

Based on the text provided, generate a concise summary that includes:
1.  The primary themes or recurring topics.
2.  Any significant events or key moments mentioned.
3.  The overall mood or emotional tone of the period.

Present the output as a coherent narrative summary.

Entries:
{{{text}}}
`,
});

const summarizeTextFlow = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: SummarizeTextInputSchema,
    outputSchema: SummarizeTextOutputSchema,
  },
  async (input: SummarizeTextInput) => {
    const { output } = await prompt(input);
    return output;
  }
);
