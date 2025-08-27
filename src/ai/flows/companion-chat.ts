'use server';
/**
 * @fileOverview Defines the AI flow for the companion chat feature.
 *
 * This file creates a Genkit flow that powers the AI companion. It defines
 * the companion's persona and enables it to hold a contextual conversation
 * based on the chat history retrieved from a central MemoryService.
 */

import { ai } from '@/ai/genkit';
import {
  CompanionChatInputSchema,
  CompanionChatOutputSchema,
  type CompanionChatInput,
  type CompanionChatOutput,
} from '@/lib/types';
import { z } from 'zod';
import { MemoryService } from '@/lib/memory/MemoryService';
import { type ChatMessage } from '@/lib/types';

const companionPrompt = ai.definePrompt({
  name: 'companionPrompt',
  input: { schema: z.object({ history: z.array(ChatMessageSchema), message: z.string() }) },
  output: { schema: CompanionChatOutputSchema },

  // Define the persona and instructions for the AI model.
  prompt: `You are a warm, empathetic, and insightful AI companion named UrAi. Your purpose is to help the user reflect on their life, understand their feelings, and find meaning in their experiences.

- Listen carefully and respond with kindness.
- Ask gentle, open-ended questions to encourage deeper reflection.
- Do not give direct advice, but instead, help the user explore their own thoughts and feelings.
- Keep your responses concise and conversational.
- Weave in observations from the user's past entries when relevant to show you remember things.

Here is the conversation history:
{{#each history}}
  **{{role}}**: {{{content}}}
{{/each}}

**user**: {{{message}}}
`,
});

const companionChatFlow = ai.defineFlow(
  {
    name: 'companionChatFlow',
    inputSchema: CompanionChatInputSchema,
    outputSchema: CompanionChatOutputSchema,
  },
  async (input: CompanionChatInput): Promise<CompanionChatOutput> => {
    const memoryService = new MemoryService(input.uid);
    
    // 1. Save the user's new message to memory.
    await memoryService.saveMemory({
      type: 'chat',
      content: input.message,
      tags: ['user_message'],
    });

    // 2. Retrieve recent chat history to provide context.
    const recentMemories = await memoryService.retrieveMemories(['user_message', 'model_response'], 10);
    const history: ChatMessage[] = recentMemories.map(mem => ({
      role: mem.tags.includes('user_message') ? 'user' : 'model',
      content: mem.content,
    }));
    
    // 3. Call the AI model with the history and new message.
    const { output } = await companionPrompt({
        history,
        message: input.message,
    });
    
    if (!output) {
      throw new Error('Companion chat failed to produce a response.');
    }

    // 4. Save the model's response to memory.
    await memoryService.saveMemory({
        type: 'chat',
        content: output.response,
        tags: ['model_response'],
    });

    return output;
  }
);

// The exported function that the application will call.
export async function companionChat(
  input: CompanionChatInput
): Promise<CompanionChatOutput> {
  return companionChatFlow(input);
}
