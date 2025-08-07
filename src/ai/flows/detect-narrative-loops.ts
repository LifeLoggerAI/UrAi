'use server';

import { ai } from '@/ai/genkit';
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

export async function detectNarrativeLoops(input: DetectNarrativeLoopsInput): Promise<DetectNarrativeLoopsOutput | null> {
  return detectNarrativeLoopsFlow(input);
}

const detectNarrativeLoopsPrompt = ai.definePrompt({
  name: 'detectNarrativeLoopsPrompt',
  input: { schema: DetectNarrativeLoopsInputSchema },
  config: { temperature: 0.7 },
  template: `
You are an advanced AI narrative analyst specializing in detecting recurring life patterns and emotional loops. 

Analyze the following user data to identify narrative loops - recurring emotional or behavioral patterns that the user may be unconsciously repeating:

Voice Events: {{voiceEvents}}
Dreams: {{dreams}}
Analysis Timespan: {{timespan}} days

Look for these types of loops:
1. **Abandonment Loop** (💔) - Repeated ghosting, fear of reaching out, feeling forgotten
2. **Over-Fixer Loop** (🧹) - Constantly trying to heal others while neglecting self
3. **Escape Loop** (🚪) - Ending jobs, friendships, or goals just before they succeed
4. **Mirror Loop** (🪞) - Attracting similar people who reflect old wounds
5. **Grief Reopen Loop** (🕯️) - Old losses echo through new relationships
6. **Stuck Ritual Loop** (🪤) - Repeating self-help, rituals, or goals that don't evolve

For each loop detected:
- Identify 3-5 specific events/moments that demonstrate this pattern
- Describe the emotional core (the underlying fear, wound, or unmet need driving the loop)
- Provide a compassionate narrator insight in the style: "You [past behavior] because [deeper truth]"
- Calculate intensity based on frequency and emotional weight (0.0-1.0)
- Suggest a gentle, specific action for breaking the loop

Use empathetic, poetic language that honors the user's journey while illuminating patterns.
Be specific about events and avoid generic interpretations.
Only identify loops with clear evidence from the provided data.
`,
});

const detectNarrativeLoopsFlow = ai.defineFlow({
  name: 'detectNarrativeLoopsFlow',
  inputSchema: DetectNarrativeLoopsInputSchema,
  outputSchema: DetectNarrativeLoopsOutputSchema,
}, async (input) => {
  const llmResponse = await ai.generate({
    prompt: detectNarrativeLoopsPrompt,
    input,
  });

  return llmResponse.output();
});