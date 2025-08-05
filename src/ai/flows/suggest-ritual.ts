
'use server';
/**
 * @fileOverview Suggests a personalized ritual or journaling prompt.
 *
 * - suggestRitual - A function that suggests a ritual based on user interaction.
 * - SuggestRitualInput - The input type for the function.
 * - SuggestRitualOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {
  SuggestRitualInputSchema,
  SuggestRitualOutputSchema,
  type SuggestRitualInput,
  type SuggestRitualOutput,
} from '@/lib/types';
import { MemoryService } from '@/lib/memory-service';

export async function suggestRitual(input: SuggestRitualInput): Promise<SuggestRitualOutput | null> {
  return suggestRitualFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRitualPrompt',
  input: {schema: SuggestRitualInputSchema},
  output: {schema: SuggestRitualOutputSchema},
  prompt: `You are a wise and empathetic AI companion in a journaling app. A user has interacted with a symbolic representation of themselves. Based on the area they touched and their current context, suggest a small, actionable ritual or a journaling prompt.

{{#if previousRituals}}
Here are some rituals the user has done before:
{{#each previousRituals}}
- {{this.title}}: {{this.description}} (zone: {{this.zone}})
{{/each}}

{{/if}}
{{#if recentActivities}}
Recent context from user's activities:
{{#each recentActivities}}
- {{this.summary}} ({{this.source}})
{{/each}}

{{/if}}
Keep the tone gentle, inviting, and encouraging. The goal is to foster mindfulness and self-reflection, not to give commands.

Interaction Zone: {{{zone}}}
User Context: {{{context}}}

Based on this, generate a title, a short description, and a specific suggestion.

For the 'head' zone (thoughts, dreams), suggest something related to clarifying thoughts or exploring symbols.
For the 'torso' zone (emotions, memories), suggest something related to processing a feeling or revisiting a memory kindly.
For the 'limbs' zone (actions, social), suggest a small action related to the body or social connection.
For the 'aura' zone (overall mood), suggest a general mindfulness or gratitude exercise.`,
});

const suggestRitualFlow = ai.defineFlow(
  {
    name: 'suggestRitualFlow',
    inputSchema: SuggestRitualInputSchema,
    outputSchema: SuggestRitualOutputSchema,
  },
  async (input) => {
    // Extract userId from input or use a default
    const userId = (input as any).userId || 'default-user';
    
    // Retrieve previous rituals for this user to avoid repetition
    const previousRituals = await MemoryService.getMemories(userId, 'ritual-*', 5);
    const ritualContext = previousRituals.map(m => m.payload);

    // Get recent activities for context
    const recentActivities = await MemoryService.getMemories(userId, undefined, 10); // Get recent memories
    const activityContext = recentActivities.slice(0, 5).map(m => ({
      summary: typeof m.payload === 'string' ? m.payload : JSON.stringify(m.payload).substring(0, 100),
      source: m.source || 'unknown'
    }));

    const {output} = await prompt({
      ...input,
      previousRituals: ritualContext,
      recentActivities: activityContext
    });

    if (!output) {
      return null;
    }

    // Save this ritual suggestion for future reference
    const ritualMemory = {
      zone: input.zone,
      title: output.title,
      description: output.description,
      suggestion: output.suggestion,
      context: input.context,
      timestamp: Date.now(),
      suggested: true,
      completed: false
    };

    await MemoryService.saveMemory(
      userId,
      `ritual-${input.zone}-${Date.now()}`,
      ritualMemory,
      'suggest-ritual'
    );

    return output;
  }
);
