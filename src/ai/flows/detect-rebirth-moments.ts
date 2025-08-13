import { z } from 'zod';

// Input schema for rebirth moment detection
export const DetectRebirthMomentsInputSchema = z.object({
  voiceEvents: z.array(z.object({
    text: z.string(),
    emotion: z.string(),
    sentimentScore: z.number(),
    timestamp: z.number(),
  })).describe('Voice events showing emotional evolution'),
  moodData: z.array(z.object({
    emotion: z.string(),
    intensity: z.number(),
    timestamp: z.number(),
  })).describe('Mood tracking data over time'),
  significantEvents: z.array(z.object({
    description: z.string(),
    timestamp: z.number(),
    type: z.string(),
  })).describe('Major life events, crises, or changes'),
  timespan: z.number().describe('Number of days to analyze'),
});

export type DetectRebirthMomentsInput = z.infer<typeof DetectRebirthMomentsInputSchema>;

// Output schema for rebirth moments
export const DetectRebirthMomentsOutputSchema = z.object({
  rebirthMoments: z.array(z.object({
    eventTrigger: z.string().describe('The crisis or trigger that initiated this transformation'),
    symbolicForm: z.string().describe('The type of rebirth (Phoenix Burn, Quiet Bloom, Emotional Wave, etc.)'),
    traitsBefore: z.record(z.string(), z.number()).describe('Emotional/mental traits before the transformation (0-1 scale)'), // Fixed here
    traitsAfter: z.record(z.string(), z.number()).describe('Emotional/mental traits after the transformation (0-1 scale)'),  // Fixed here
    narratorInsight: z.string().describe('A compassionate reflection on this transformation'),
    linkedLoopsBroken: z.array(z.string()).optional().describe('Names of narrative loops that were broken by this rebirth'),
    bloomUnlocked: z.boolean().describe('Whether this transformation unlocked new potential'),
    transformationScore: z.number().min(0).max(1).describe('How significant this transformation was'),
  })),
});

export type DetectRebirthMomentsOutput = z.infer<typeof DetectRebirthMomentsOutputSchema>;

// Mock implementation for demo
export async function detectRebirthMoments(input: DetectRebirthMomentsInput): Promise<DetectRebirthMomentsOutput> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    rebirthMoments: [
      {
        eventTrigger: "End of long-term relationship + job loss",
        symbolicForm: "Phoenix Burn",
        traitsBefore: {
          confidence: 0.22,
          self_respect: 0.15,
          emotional_range: 0.30,
          authenticity: 0.25,
        },
        traitsAfter: {
          confidence: 0.72,
          self_respect: 0.80,
          emotional_range: 0.85,
          authenticity: 0.90,
        },
        narratorInsight: "You thought the breaking was the end. It was the cracking open that let the light in.",
        linkedLoopsBroken: ["people_pleasing_loop", "perfectionism_trap"],
        bloomUnlocked: true,
        transformationScore: 0.89,
      }
    ]
  };
}