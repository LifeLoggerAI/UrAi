'use server';

import { z } from 'zod';
import { ChatMessageSchema, CompanionChatOutputSchema } from '@/lib/types';
import { ai } from '@/ai/genkit';

const companionPrompt = ai.definePrompt({
  name: 'companionPrompt',
  input: { schema: z.object({ history: z.array(ChatMessageSchema), message: z.string() }) },
  output: { schema: CompanionChatOutputSchema },
  prompt: ({ history, message }) => {
    const historyText = history.map(m => `${m.role}: ${m.content}`).join('\n');
    return `${historyText}\nuser: ${message}`;
  },
});

export default companionPrompt;
