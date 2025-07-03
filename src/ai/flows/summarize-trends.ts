'use server';

/**
 * @fileOverview Summarizes trends and themes from multiple notes.
 *
 * - summarizeTrends - A function that handles the summarization of trends from notes.
 * - SummarizeTrendsInput - The input type for the summarizeTrends function.
 * - SummarizeTrendsOutput - The return type for the summarizeTrends function.
 */

import {ai} from '@/ai/genkit';
import {
  SummarizeTrendsInputSchema,
  SummarizeTrendsOutputSchema,
  type SummarizeTrendsInput,
  type SummarizeTrendsOutput,
} from '@/lib/types';

export async function summarizeTrends(input: SummarizeTrendsInput): Promise<SummarizeTrendsOutput> {
  return summarizeTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTrendsPrompt',
  input: {schema: SummarizeTrendsInputSchema},
  output: {schema: SummarizeTrendsOutputSchema},
  prompt: `You are an AI assistant that analyzes a collection of text notes and identifies recurring trends and themes.

  Notes:
  {{#each notes}}
  - {{{this}}}
  {{/each}}

  Please provide a concise summary of the main trends and themes that emerge from these notes.
  Focus on identifying patterns, common topics, and significant changes over time.
  The summary should be no more than 3 sentences.`, // Shortened prompt for brevity
});

const summarizeTrendsFlow = ai.defineFlow(
  {
    name: 'summarizeTrendsFlow',
    inputSchema: SummarizeTrendsInputSchema,
    outputSchema: SummarizeTrendsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
