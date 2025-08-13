'use server';
/**
 * @fileOverview An AI flow to process the user's voice onboarding transcript.
 *
 * - processOnboardingTranscript - A function that extracts structured data from the onboarding conversation.
 * - ProcessOnboardingTranscriptInput - The input type for the function.
 * - ProcessOnboardingTranscriptOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod'; // Import z for type inference
import {
  ProcessOnboardingTranscriptInputSchema,
  ProcessOnboardingTranscriptOutputSchema,
} from '@/lib/types';

// Infer types locally from schemas
type ProcessOnboardingTranscriptInput = z.infer<typeof ProcessOnboardingTranscriptInputSchema>;
type ProcessOnboardingTranscriptOutput = z.infer<typeof ProcessOnboardingTranscriptOutputSchema>;

export async function processOnboardingTranscript(
  input: ProcessOnboardingTranscriptInput
): Promise<ProcessOnboardingTranscriptOutput | null> {
  return processOnboardingTranscriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processOnboardingTranscriptPrompt',
  input: { schema: ProcessOnboardingTranscriptInputSchema },
  output: { schema: ProcessOnboardingTranscriptOutputSchema },
  prompt: `You are an expert at understanding user goals from a brief conversation. Analyze the following transcript from a new user onboarding.\n\nYour task is to extract four key pieces of information:\n1.  **Goal**: Identify the user's primary goal, dream, or aspiration. This should be a high-level objective.\n2.  **Task**: Pinpoint a single, small, concrete action the user mentioned they could take towards this goal. This should be a specific, actionable first step.\n3.  **Reminder Date**: Extract the date or time the user wants to be reminded. If they are vague (e.g., "next week"), calculate a specific date. Today's date is {{currentDate}}. Return the date in ISO 8601 format (YYYY-MM-DD).\n4.  **Habit to Track**: Identify a recurring behavior or thing to "watch out for" that the user mentioned. This could be a positive habit to build or a negative one to avoid.\n\nTranscript:\n{{{transcript}}}\n`,
});

const processOnboardingTranscriptFlow = ai.defineFlow(
  {
    name: 'processOnboardingTranscriptFlow',
    inputSchema: ProcessOnboardingTranscriptInputSchema,
    outputSchema: ProcessOnboardingTranscriptOutputSchema,
  },
  async (input: ProcessOnboardingTranscriptInput) => {
    const { output } = await prompt({
      ...input,
      currentDate: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
    });
    return output;
  }
);
