'use server';

/**
 * @fileOverview Generates scene breakdown from structured event data.
 *
 * - generateSceneBreakdown - A function that creates scenes and shot lists from event data.
 * - GenerateSceneBreakdownInput - The input type for the function.
 * - GenerateSceneBreakdownOutput - The return type for the function.
 */

import {ai} from '../genkit';
import {
  GenerateSceneBreakdownInputSchema,
  GenerateSceneBreakdownOutputSchema,
  type GenerateSceneBreakdownInput,
  type GenerateSceneBreakdownOutput,
} from '../../lib/types';

export async function generateSceneBreakdown(input: GenerateSceneBreakdownInput): Promise<GenerateSceneBreakdownOutput | null> {
  return generateSceneBreakdownFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSceneBreakdownPrompt',
  input: {schema: GenerateSceneBreakdownInputSchema},
  output: {schema: GenerateSceneBreakdownOutputSchema},
  prompt: `You are a professional cinematographer and storyboard artist. Create a detailed scene breakdown for filming this event.

Event Data:
{{{eventData}}}

For each scene, generate:

**Scene Header:** "Scene [X] – [Event Name]: [Location], [Time of day]"

**Shot List:** For each shot, include:
- Shot type (e.g. close-up, wide shot, tracking shot, over-the-shoulder, establishing shot, medium shot)
- Subject (who or what is the focus)
- Action described in one sentence
- Camera movement & lens choice (e.g., "handheld 35mm", "steady 50mm", "tracking shot with 24mm wide angle")
- Lighting notes (e.g., "golden hour backlight", "soft window light", "dramatic side lighting")

**Dialogue/Voice-over:** If any dialogue or narration would enhance the scene

Guidelines:
- Create multiple scenes if the event has distinct phases or location changes
- Use cinematic shot variety (wide establishing shots, medium shots for interaction, close-ups for emotion)
- Consider the mood and emotional arc of the event
- Include transition shots between key moments
- Think about visual storytelling - show don't tell`,
});

const generateSceneBreakdownFlow = ai.defineFlow(
  {
    name: 'generateSceneBreakdownFlow',
    inputSchema: GenerateSceneBreakdownInputSchema,
    outputSchema: GenerateSceneBreakdownOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output;
  }
);