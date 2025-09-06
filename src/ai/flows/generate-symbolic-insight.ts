'use server';

import { ai } from '@/ai/genkit';
import {
  GenerateSymbolicInsightInput,
  GenerateSymbolicInsightInputSchema,
  GenerateSymbolicInsightOutput,
  GenerateSymbolicInsightOutputSchema,
} from '@/lib/types';

const generateSymbolicInsightFlow = ai.defineFlow(
  {
    name: 'generateSymbolicInsight',
    inputSchema: GenerateSymbolicInsightInputSchema,
    outputSchema: GenerateSymbolicInsightOutputSchema,
  },
  async (
    _input: GenerateSymbolicInsightInput
  ): Promise<GenerateSymbolicInsightOutput> => {
    return {
      narratorReflection: 'Insight not implemented',
      symbolAnimationTrigger: 'none',
    };
  }
);

export async function generateSymbolicInsight(
  input: GenerateSymbolicInsightInput
): Promise<GenerateSymbolicInsightOutput> {
  return generateSymbolicInsightFlow(input);
}

export default generateSymbolicInsight;

