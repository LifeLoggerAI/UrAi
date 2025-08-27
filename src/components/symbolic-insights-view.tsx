
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Sprout, FileText, Bot } from 'lucide-react';
import { LegacyThreadBuilder } from './legacy-thread-builder';
import { EmotionalBiome } from './emotional-biome';
import { MirrorOfBecoming } from './mirror-of-becoming';

export function SymbolicInsightsView() {
  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto p-1 pr-4 -mr-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI-Powered Narrative Analysis
          </CardTitle>
          <CardDescription>
            Discover deep-seated patterns and stories emerging from your life
            logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled>
            <FileText className="mr-2 h-4 w-4" />
            Generate Narrative Report (Coming Soon)
          </Button>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <EmotionalBiome />
        <MirrorOfBecoming />
      </div>
      <LegacyThreadBuilder />
    </div>
  );
}
