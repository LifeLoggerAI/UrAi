import { z } from 'zod';

// Input schema for narrative loop detection
export const DetectNarrativeLoopsInputSchema = z.object({
  voiceEvents: z.array(z.object({
    text: z.string(),
    emotion: z.string(),
    timestamp: z.number(),
  })).describe('Recent voice events and emotional patterns'),
  dreams: z.array(z.object({
    text: z.string(),
    themes: z.array(z.string()),
    timestamp: z.number(),
  })).describe('Recent dreams and their themes'),
  timespan: z.number().describe('Number of days to analyze for patterns'),
});

export type DetectNarrativeLoopsInput = z.infer<typeof DetectNarrativeLoopsInputSchema>;

// Output schema for detected loops
export const DetectNarrativeLoopsOutputSchema = z.object({
  loops: z.array(z.object({
    patternLabel: z.string().describe('The type of loop detected (e.g. "Abandonment Loop", "Mirror Loop")'),
    loopEvents: z.array(z.string()).describe('References to events that are part of this loop'),
    emotionalCore: z.string().describe('The core emotional pattern being repeated'),
    narratorOverlay: z.string().describe('A poetic, empathetic insight about this pattern'),
    loopIntensity: z.number().min(0).max(1).describe('How strong/frequent this pattern is'),
    suggestedAction: z.string().optional().describe('A gentle suggestion for breaking this loop'),
  })),
});

export type DetectNarrativeLoopsOutput = z.infer<typeof DetectNarrativeLoopsOutputSchema>;

// Mock implementation for demo
export async function detectNarrativeLoops(input: DetectNarrativeLoopsInput): Promise<DetectNarrativeLoopsOutput> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data based on input
  return {
    loops: [
      {
        patternLabel: "Abandonment Loop",
        loopEvents: ["relationship_end_aug23", "ghosting_dec23", "avoidance_jan24"],
        emotionalCore: "Fear of being truly seen → run before exposed",
        narratorOverlay: "You became the ghost to avoid being haunted.",
        loopIntensity: 0.75,
        suggestedAction: "Practice staying present when vulnerability arises",
      },
      {
        patternLabel: "Over-Fixer Loop", 
        loopEvents: ["helping_friend_crisis", "neglecting_self_care", "burnout_pattern"],
        emotionalCore: "Self-worth through others' healing while avoiding own wounds",
        narratorOverlay: "You gave until empty, thinking love meant erasure of self.",
        loopIntensity: 0.68,
        suggestedAction: "Set a boundary ritual: heal yourself first each day",
      }
    ]
  };
}