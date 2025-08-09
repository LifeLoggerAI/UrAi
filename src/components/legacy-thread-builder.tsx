
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, PlusCircle } from 'lucide-react';

export function LegacyThreadBuilder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Legacy Thread Builder
        </CardTitle>
        <CardDescription>
          Weave your most important memories, insights, and transformations into a shareable story.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <div className="text-center text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12 text-primary/50" />
            <h3 className="mt-4 text-lg font-medium text-foreground">
            Create Your First Legacy Thread
            </h3>
            <p className="mt-1 text-sm max-w-sm mx-auto">
            Combine key moments from your timeline to build a narrative that represents your journey. This feature is coming soon.
            </p>
            <Button className="mt-6" disabled>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Thread
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
