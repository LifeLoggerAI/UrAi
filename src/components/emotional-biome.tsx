
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Leaf } from 'lucide-react';

export function EmotionalBiome() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5" />
          Emotional Biome
        </CardTitle>
        <CardDescription>
          A living ecosystem that reflects your inner world.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="text-center text-muted-foreground">
            <Leaf className="mx-auto h-12 w-12 text-primary/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Your Emotional Biome is Growing
            </h3>
            <p className="mt-1 text-sm max-w-sm mx-auto">
              This feature is coming soon. It will visualize your emotional patterns as a unique, evolving digital garden.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
