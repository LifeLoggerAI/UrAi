
import { z } from "zod";

export const Mood = z.object({
  uid: z.string(),
  ts: z.any(), // timestamp from admin
  val: z.number().min(-100).max(100),
  sources: z.array(z.string()).default([])
});

export const VoiceEvent = z.object({
  uid: z.string(),
  startedAt: z.any(),
  durationMs: z.number().nonnegative(),
  tags: z.array(z.string()).default([])
});

export const Insight = z.object({
  uid: z.string(),
  ts: z.any(),
  type: z.string(),
  text: z.string(),
  confidence: z.number().min(0).max(1)
});
