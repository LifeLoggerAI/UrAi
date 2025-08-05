'use server';
/**
 * @fileOverview A flow to summarize a collection of text entries.
 *
 * - summarizeText - A function that takes a block of text and returns a summary.
 * - SummarizeTextInput - The input type for the function.
 * - SummarizeTextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import { 
    SummarizeTextInputSchema,
    SummarizeTextOutputSchema,
    type SummarizeTextInput,
    type SummarizeTextOutput
} from '@/lib/types';
import { MemoryService } from '@/lib/memory-service';

export async function summarizeText(input: SummarizeTextInput): Promise<SummarizeTextOutput | null> {
  return summarizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTextPrompt',
  input: {schema: SummarizeTextInputSchema},
  output: {schema: SummarizeTextOutputSchema},
  prompt: `You are an expert at synthesizing information and finding patterns in journal entries.
Analyze the following collection of thoughts and experiences.

{{#if previousSummaries}}
Here are some relevant previous summaries for context:
{{#each previousSummaries}}
- {{this.summary}} (from {{this.period}})
{{/each}}

{{/if}}
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
  async (input) => {
    // Extract userId from input or use a default
    const userId = (input as any).userId || 'default-user';
    
    // Retrieve previous summaries for context
    const previousSummaries = await MemoryService.getMemories(userId, 'summary-*', 3);
    const summaryContext = previousSummaries.map(m => m.payload);

    const {output} = await prompt({
      ...input,
      previousSummaries: summaryContext
    });

    if (!output) {
      return null;
    }

    // Save the summary to memory
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const summaryMemory = {
      summary: output.summary,
      originalTextLength: input.text.length,
      timestamp: Date.now(),
      period: today,
      source: 'summarize-text'
    };

    await MemoryService.saveMemory(
      userId,
      `summary-${today}`,
      summaryMemory,
      'summarize-text'
    );

    return output;
  }
);
