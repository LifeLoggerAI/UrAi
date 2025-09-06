'use server';

import { ai } from '@/ai/genkit';
import {
  CompanionChatInput,
  CompanionChatInputSchema,
  CompanionChatOutput,
  CompanionChatOutputSchema,
} from '@/lib/types';

export async function companionChat(
  input: CompanionChatInput
): Promise<CompanionChatOutput> {
  const history = input.history
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');
  const { text } = await ai.generate({
    model: 'gemini-1.5-flash',
    prompt: [
      {
        text: `${history}\nuser: ${input.message}`,
      },
    ],
  });
  return { response: text };
}

const companionChatFlow = ai.defineFlow(
  {
    name: 'companionChatFlow',
    inputSchema: CompanionChatInputSchema,
    outputSchema: CompanionChatOutputSchema,
  },
  async (input: CompanionChatInput) => {
    const response = await companionChat(input);
    return response;
  }
);

export default companionChat;

