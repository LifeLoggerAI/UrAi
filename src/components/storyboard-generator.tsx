'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { generateStoryboard } from '@/app/actions';

interface StoryboardGeneratorProps {
  className?: string;
}

export function StoryboardGenerator({ className }: StoryboardGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const response = await generateStoryboard({ prompt });
      if (response.success) {
        setResult(response.data);
      } else {
        console.error('Storyboard generation failed:', response.error);
      }
    } catch (error) {
      console.error('Error generating storyboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Storyboard Generator</h2>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your prompt for storyboard generation..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
          
          <Button 
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Generating...' : 'Generate Storyboard'}
          </Button>
          
          {result && (
            <Card className="p-4 mt-4">
              <h3 className="font-medium mb-2">Generated Storyboard</h3>
              <pre className="text-sm text-gray-600 overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </Card>
          )}
        </div>
      </Card>
    </div>
  );
}