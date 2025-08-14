// functions/src/process-onboarding-transcript.ts
'use server';

import { genkit as ai } from 'genkit';
import { z } from 'zod';
import {
  ProcessOnboardingTranscriptInputSchema,
  ProcessOnboardingTranscriptOutputSchema,
} from '@/lib/types';

type ProcessOnboardingTranscriptInput = z.infer<typeof ProcessOnboardingTranscriptInputSchema>;
type ProcessOnboardingTranscriptOutput = z.infer<typeof ProcessOnboardingTranscriptOutputSchema>;

export async function processOnboardingTranscript(
  input: ProcessOnboardingTranscriptInput
): Promise<ProcessOnboardingTranscriptOutput> {
  return processOnboardingTranscriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processOnboardingTranscriptPrompt',
  input: { schema: ProcessOnboardingTranscriptInputSchema },
  output: { schema: ProcessOnboardingTranscriptOutputSchema },
  prompt: `Analyze the following onboarding transcript and extract key information:\n\nTranscript: {{transcript}}\nCurrent Date: {{currentDate}}\n\nExtract:\n- A clear, concise goal (e.g., "Improve daily mood").\n- A specific, actionable task related to the goal (e.g., "Meditate for 10 minutes daily").\n- A reminder date for the task (YYYY-MM-DD format, e.g., "2024-07-20").\n- A habit to track (e.g., "meditation").`,
});

const processOnboardingTranscriptFlow = ai.defineFlow(
  {
    name: 'processOnboardingTranscriptFlow',
    inputSchema: ProcessOnboardingTranscriptInputSchema,
    outputSchema: ProcessOnboardingTranscriptOutputSchema,
  },
  async (input: ProcessOnboardingTranscriptInput) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Onboarding transcript processing output is null or undefined.');
    }
    return output;
  }
);
