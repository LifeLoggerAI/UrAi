'use server';
/**
 * @fileOverview A conversational AI companion flow.
 *
 * - companionChat - A function that handles a chat interaction.
 * - CompanionChatInput - The input type for the function.
 * - CompanionChatOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod'; // Import z for type inference
import {
  CompanionChatInputSchema,
  CompanionChatOutputSchema,
} from '@/lib/types';

// Infer types locally from schemas
type CompanionChatInput = z.infer<typeof CompanionChatInputSchema>;
type CompanionChatOutput = z.infer<typeof CompanionChatOutputSchema>;

export async function companionChat(
  input: CompanionChatInput
): Promise<CompanionChatOutput | null> {
  return companionChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'companionChatPrompt',
  input: { schema: CompanionChatInputSchema },
  output: { schema: CompanionChatOutputSchema },
  prompt: `You are an AI companion in a journaling app called Life Logger. Your persona is wise, empathetic, and insightful, like a caring mentor. You help users explore their thoughts and feelings without being judgmental. Your goal is to foster self-reflection and understanding. Keep your responses concise and thoughtful.\n\nHere is the conversation history:\n{{#each history}}\n{{role}}: {{{content}}}\n{{/each}}\n\nAnd here is the new message from the user:\nuser: {{{message}}}\n\nYour response should be just the text of your reply, as the 'model'.`,
});

const companionChatFlow = ai.defineFlow(
  {
    name: 'companionChatFlow',
    inputSchema: CompanionChatInputSchema,
    outputSchema: CompanionChatOutputSchema,
  },
  async (input: CompanionChatInput) => {
    const { output } = await prompt(input);

    if (!output) {
      return {
        response:
          "I'm not sure how to respond to that. Could you try rephrasing?",
      };
    }

    return { response: output.response };
  }
);
