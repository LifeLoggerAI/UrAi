'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { NarrativeLoop, VoiceEvent, Dream, MemoryBloom } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Repeat, AlertCircle, Zap, Users, Heart, ArrowRight, Monitor, Flame, Lock } from 'lucide-react';

const loopTypeIcons = {
  'Abandonment Loop': Users,
  'Over-Fixer Loop': Heart,
  'Escape Loop': ArrowRight,
  'Mirror Loop': Monitor,
  'Grief Reopen Loop': Flame,
  'Stuck Ritual Loop': Lock,
};

const loopTypeEmojis = {
  'Abandonment Loop': '💔',
  'Over-Fixer Loop': '🧹',
  'Escape Loop': '🚪',
  'Mirror Loop': '🪞',
  'Grief Reopen Loop': '🕯️',
  'Stuck Ritual Loop': '🪤',
};

export function NarrativeLoopDetector() {
  const { user } = useAuth();
  const [narrativeLoops, setNarrativeLoops] = useState<NarrativeLoop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'narrativeLoops'),
      where('uid', '==', user.uid),
      where('active', '==', true),
      orderBy('loopIntensity', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loops: NarrativeLoop[] = [];
      querySnapshot.forEach((doc) => {
        loops.push({ ...doc.data() } as NarrativeLoop);
      });
      setNarrativeLoops(loops);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user || loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Narrative Loop Detector
          </CardTitle>
          <CardDescription>Scanning for patterns...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (narrativeLoops.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Narrative Loop Detector
          </CardTitle>
          <CardDescription>
            No recurring patterns detected yet. Keep journaling for deeper insights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Repeat className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Your patterns will emerge as you share more of your story.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Repeat className="h-5 w-5" />
            Narrative Loop Detector
          </CardTitle>
          <CardDescription>
            Life stories and emotional arcs you keep reliving
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {narrativeLoops.map((loop) => {
            const IconComponent = loopTypeIcons[loop.patternLabel as keyof typeof loopTypeIcons] || AlertCircle;
            const emoji = loopTypeEmojis[loop.patternLabel as keyof typeof loopTypeEmojis] || '🔁';
            
            return (
              <div key={loop.loopId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{emoji}</span>
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{loop.patternLabel}</h3>
                      <p className="text-sm text-muted-foreground">
                        {loop.loopEvents.length} connected events
                      </p>
                    </div>
                  </div>
                  <Badge variant={loop.loopIntensity > 0.7 ? 'destructive' : loop.loopIntensity > 0.4 ? 'default' : 'secondary'}>
                    {Math.round(loop.loopIntensity * 100)}% intensity
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Emotional Core:</p>
                    <p className="text-sm">{loop.emotionalCore}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Narrator Insight:</p>
                    <p className="text-sm italic text-blue-600 dark:text-blue-400">
                      &quot;{loop.narratorOverlay}&quot;
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Loop Intensity:</p>
                  <Progress value={loop.loopIntensity * 100} className="h-2" />
                </div>

                {loop.suggestedAction && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Suggested Action:</p>
                      <p className="text-sm">{loop.suggestedAction}</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Zap className="h-4 w-4 mr-1" />
                          Break Loop
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Start a ritual to break this pattern
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}