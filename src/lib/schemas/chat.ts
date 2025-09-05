// src/lib/schemas/chat.ts
import { z } from "zod";

export const RoleEnum = z.enum(["system", "user", "assistant"]);

export const ChatMessageSchema = z.object({
  id: z.string().uuid().optional(),
  role: RoleEnum,
  content: z.string(),
  createdAt: z.number().int().optional(),
  meta: z.record(z.any()).optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export const ChatHistorySchema = z.array(ChatMessageSchema);
export type ChatHistory = z.infer<typeof ChatHistorySchema>;