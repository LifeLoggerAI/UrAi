
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User, Sparkles } from 'lucide-react';

export function MirrorOfBecoming() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Mirror of Becoming
        </CardTitle>
        <CardDescription>
          Reflections on your evolving self-image and core identity.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="text-center text-muted-foreground">
            <User className="mx-auto h-12 w-12 text-primary/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
              Gazing into the Mirror
            </h3>
            <p className="mt-1 text-sm max-w-sm mx-auto">
              This feature is coming soon. It will provide insights into your persona, archetype, and how your self-perception changes over time.
            </p>
        </div>
      </CardContent>
    </Card>
  );
}
