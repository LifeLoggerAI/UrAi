// functions/src/companion-chat.ts
'use server';

import { genkit as ai } from 'genkit';
import { z } from 'zod';
import {
  CompanionChatInputSchema,
  CompanionChatOutputSchema,
} from '@/lib/types';

type CompanionChatInput = z.infer<typeof CompanionChatInputSchema>;
type CompanionChatOutput = z.infer<typeof CompanionChatOutputSchema>;

export async function companionChat(
  input: CompanionChatInput
): Promise<CompanionChatOutput> {
  const llmResponse = await ai.run(
    'gemini-1.5-flash-latest',
    ai.messages.chat.fromHistoryAndText(
      input.history.map(msg => ({ role: msg.role, text: msg.content })),
      input.message
    )
  );
  const response = llmResponse.text();
  return { response };
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
