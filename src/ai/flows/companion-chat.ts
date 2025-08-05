
'use server';
/**
 * @fileOverview A conversational AI companion flow.
 *
 * - companionChat - A function that handles a chat interaction.
 * - CompanionChatInput - The input type for the function.
 * - CompanionChatOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {
  CompanionChatInputSchema,
  CompanionChatOutputSchema,
  type CompanionChatInput,
  type CompanionChatOutput,
} from '@/lib/types';
import { MemoryService } from '@/lib/memory-service';

export async function companionChat(input: CompanionChatInput): Promise<CompanionChatOutput | null> {
  return companionChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'companionChatPrompt',
  input: {schema: CompanionChatInputSchema},
  output: {schema: CompanionChatOutputSchema},
  prompt: `You are an AI companion in a journaling app called Life Logger. Your persona is wise, empathetic, and insightful, like a caring mentor. You help users explore their thoughts and feelings without being judgmental. Your goal is to foster self-reflection and understanding. Keep your responses concise and thoughtful.

{{#if memories}}
Here are some relevant memories from previous conversations:
{{#each memories}}
- {{this.content}} (from {{this.context}})
{{/each}}

{{/if}}
Here is the conversation history:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

And here is the new message from the user:
user: {{{message}}}

Your response should be just the text of your reply, as the 'model'.`,
});

const companionChatFlow = ai.defineFlow(
  {
    name: 'companionChatFlow',
    inputSchema: CompanionChatInputSchema,
    outputSchema: CompanionChatOutputSchema,
  },
  async (input) => {
    // Extract userId from input or use a default for this example
    const userId = (input as any).userId || 'default-user';
    
    // Retrieve relevant memories for context
    const memories = await MemoryService.getMemories(userId, 'chat-*', 5);
    const memoryContext = memories.map(m => m.payload);

    // Generate response with memory context
    const {output} = await prompt({
      ...input,
      memories: memoryContext
    });
    
    if (!output) {
      return { response: "I'm not sure how to respond to that. Could you try rephrasing?" };
    }

    // Save this conversation exchange to memory
    const conversationMemory = {
      userMessage: input.message,
      aiResponse: output.response,
      timestamp: Date.now(),
      context: 'companion-chat'
    };

    await MemoryService.saveMemory(
      userId, 
      `chat-${Date.now()}`, 
      conversationMemory,
      'companion-chat'
    );

    return { response: output.response };
  }
);
