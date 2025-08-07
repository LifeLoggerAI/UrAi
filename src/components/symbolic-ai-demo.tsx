'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateAuraScroll } from '@/ai/flows/generate-aura-scroll';
import { detectNarrativeLoops } from '@/ai/flows/detect-narrative-loops';
import { detectRebirthMoments } from '@/ai/flows/detect-rebirth-moments';
import { useToast } from '@/hooks/use-toast';

export function SymbolicAIDemo() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const testNarrativeLoops = async () => {
    setLoading(true);
    try {
      const sampleData = {
        voiceEvents: [
          {
            text: "I feel like I'm always letting people down. I don't want to reach out because they might be disappointed.",
            emotion: "anxious",
            timestamp: Date.now() - 86400000 * 7,
          },
          {
            text: "Another relationship ending. I think I sabotaged it again by pulling away when things got serious.",
            emotion: "sad",
            timestamp: Date.now() - 86400000 * 14,
          },
          {
            text: "I keep fixing everyone else's problems but I can't seem to fix my own.",
            emotion: "frustrated",
            timestamp: Date.now() - 86400000 * 21,
          }
        ],
        dreams: [
          {
            text: "I was in a house with doors that kept closing. Every time I opened one, another would shut.",
            themes: ["entrapment", "cycles", "doors"],
            timestamp: Date.now() - 86400000 * 10,
          }
        ],
        timespan: 30,
      };

      const result = await detectNarrativeLoops(sampleData);
      setResults({ type: 'loops', data: result });
      
      toast({
        title: "Narrative Loops Detected",
        description: `Found ${result?.loops?.length || 0} patterns in your data.`,
      });
    } catch (error) {
      console.error('Error detecting loops:', error);
      toast({
        title: "Error",
        description: "Failed to detect narrative loops. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testRebirthMoments = async () => {
    setLoading(true);
    try {
      const sampleData = {
        voiceEvents: [
          {
            text: "I feel broken after the breakup. I don't know who I am anymore.",
            emotion: "grief",
            sentimentScore: -0.8,
            timestamp: Date.now() - 86400000 * 90,
          },
          {
            text: "I'm starting to see things differently. I'm setting boundaries for the first time.",
            emotion: "determined",
            sentimentScore: 0.3,
            timestamp: Date.now() - 86400000 * 60,
          },
          {
            text: "I feel like a completely different person. Stronger, more authentic.",
            emotion: "confident",
            sentimentScore: 0.7,
            timestamp: Date.now() - 86400000 * 30,
          }
        ],
        moodData: [
          { emotion: "grief", intensity: 0.9, timestamp: Date.now() - 86400000 * 90 },
          { emotion: "reflective", intensity: 0.6, timestamp: Date.now() - 86400000 * 60 },
          { emotion: "renewed", intensity: 0.8, timestamp: Date.now() - 86400000 * 30 },
        ],
        significantEvents: [
          {
            description: "End of 3-year relationship",
            timestamp: Date.now() - 86400000 * 100,
            type: "relationship_loss",
          }
        ],
        timespan: 120,
      };

      const result = await detectRebirthMoments(sampleData);
      setResults({ type: 'rebirths', data: result });
      
      toast({
        title: "Rebirth Moments Detected",
        description: `Found ${result?.rebirthMoments?.length || 0} transformation moments.`,
      });
    } catch (error) {
      console.error('Error detecting rebirths:', error);
      toast({
        title: "Error",
        description: "Failed to detect rebirth moments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testAuraScroll = async () => {
    setLoading(true);
    try {
      const sampleData = {
        moodData: [
          { date: "2024-01-01", emotion: "anxious", intensity: 0.7, events: ["New year pressure"] },
          { date: "2024-01-08", emotion: "reflective", intensity: 0.5, events: ["Quiet week"] },
          { date: "2024-01-15", emotion: "hopeful", intensity: 0.6, events: ["Started therapy"] },
          { date: "2024-01-22", emotion: "calm", intensity: 0.4, events: ["Meditation practice"] },
        ],
        significantEvents: [
          {
            description: "Started therapy",
            date: "2024-01-15",
            emotional_impact: 0.8,
          }
        ],
        startDate: "2024-01-01",
        endDate: "2024-01-31",
      };

      const result = await generateAuraScroll(sampleData);
      setResults({ type: 'aura', data: result });
      
      toast({
        title: "Aura Scroll Generated",
        description: `Created scroll with ${result?.weeklyAuraData?.length || 0} weeks of data.`,
      });
    } catch (error) {
      console.error('Error generating aura scroll:', error);
      toast({
        title: "Error",
        description: "Failed to generate aura scroll. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Symbolic AI Demo</CardTitle>
          <CardDescription>
            Test the new symbolic life tracking AI features with sample data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={testNarrativeLoops} 
              disabled={loading}
              variant="outline"
            >
              Test Loop Detection
            </Button>
            <Button 
              onClick={testRebirthMoments} 
              disabled={loading}
              variant="outline"
            >
              Test Rebirth Detection
            </Button>
            <Button 
              onClick={testAuraScroll} 
              disabled={loading}
              variant="outline"
            >
              Test Aura Scroll
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>
              {results.type === 'loops' && 'Narrative Loops Results'}
              {results.type === 'rebirths' && 'Rebirth Moments Results'}
              {results.type === 'aura' && 'Aura Scroll Results'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(results.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}