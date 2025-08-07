import { z } from 'zod';

// Input schema for aura scroll generation
export const GenerateAuraScrollInputSchema = z.object({
  moodData: z.array(z.object({
    date: z.string(),
    emotion: z.string(),
    intensity: z.number(),
    events: z.array(z.string()).optional(),
  })).describe('Daily mood and emotion data'),
  significantEvents: z.array(z.object({
    description: z.string(),
    date: z.string(),
    emotional_impact: z.number(),
  })).optional().describe('Significant life events that affected mood'),
  startDate: z.string().describe('Start date for the scroll (YYYY-MM-DD)'),
  endDate: z.string().describe('End date for the scroll (YYYY-MM-DD)'),
});

export type GenerateAuraScrollInput = z.infer<typeof GenerateAuraScrollInputSchema>;

// Output schema for aura scroll
export const GenerateAuraScrollOutputSchema = z.object({
  weeklyAuraData: z.array(z.object({
    week: z.string().describe('Week identifier (YYYY-WXX)'),
    mood: z.string().describe('Dominant mood for the week'),
    color: z.string().describe('Hex color representing the mood'),
    overlays: z.array(z.string()).describe('Visual overlays like "fog", "storm", "bloom", etc.'),
  })),
  narratorQuotes: z.array(z.string()).describe('Poetic reflections for key emotional shifts'),
  overallArc: z.string().describe('The emotional journey narrative for this time period'),
});

export type GenerateAuraScrollOutput = z.infer<typeof GenerateAuraScrollOutputSchema>;

// Mock implementation for demo
export async function generateAuraScroll(input: GenerateAuraScrollInput): Promise<GenerateAuraScrollOutput> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    weeklyAuraData: [
      {
        week: "2024-W01",
        mood: "anxious",
        color: "#FF4444",
        overlays: ["fog", "crack"],
      },
      {
        week: "2024-W02", 
        mood: "reflective",
        color: "#3377AA",
        overlays: ["mirror", "drift"],
      },
      {
        week: "2024-W03",
        mood: "hopeful",
        color: "#33CC88", 
        overlays: ["bloom", "light"],
      },
      {
        week: "2024-W04",
        mood: "calm",
        color: "#87CEEB",
        overlays: ["wave"],
      }
    ],
    narratorQuotes: [
      "This was your fog season. You moved slowly, but you moved.",
      "The reflection showed not who you were, but who you could become.",
      "Hope arrived quietly, like dawn after the longest night.",
      "Calm was not your destination. It was your new beginning."
    ],
    overallArc: "A journey from anxiety's fog through the mirror of self-reflection into the blooming light of hope, finally settling into the calm waters of acceptance."
  };
}