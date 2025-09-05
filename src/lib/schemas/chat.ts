import { z } from 'zod';

export const ChatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['system', 'user', 'assistant', 'tool']).default('user'),
  content: z.string(),
  name: z.string().optional(),
  timestamp: z.number().optional(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;