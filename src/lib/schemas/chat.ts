// src/lib/schemas/chat.ts
import { z } from "zod";

export const RoleEnum = z.enum(["system", "user", "assistant"]);

export const ChatMessageSchema = z.object({
  role: RoleEnum,
  content: z.string(),
  timestamp: z.number().optional(),
  meta: z.record(z.any()).optional(),
});

export const CompanionChatOutputSchema = z.object({
  reply: z.string(),
  moodTag: z.string().optional(),
  insights: z.array(z.string()).optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type CompanionChatOutput = z.infer<typeof CompanionChatOutputSchema>;
export const ChatHistorySchema = z.array(ChatMessageSchema);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;