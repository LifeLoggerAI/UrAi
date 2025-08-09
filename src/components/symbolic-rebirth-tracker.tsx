'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { RebirthMoment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Sparkles, Bird, Sprout, Waves, Hammer, Users2, Play, Star } from 'lucide-react';

const rebirthTypeIcons = {
  'Phoenix Burn': Bird,
  'Quiet Bloom': Sprout,
  'Emotional Wave': Waves,
  'Reconstruction Era': Hammer,
  'Persona Fusion': Users2,
};

const rebirthTypeEmojis = {
  'Phoenix Burn': '🔥',
  'Quiet Bloom': '🌱',
  'Emotional Wave': '🌊',
  'Reconstruction Era': '🛠',
  'Persona Fusion': '🎭',
};

export function SymbolicRebirthTracker() {
  const { user } = useAuth();
  const [rebirthMoments, setRebirthMoments] = useState<RebirthMoment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'rebirthMoments'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const moments: RebirthMoment[] = [];
      querySnapshot.forEach((doc) => {
        moments.push({ ...doc.data() } as RebirthMoment);
      });
      setRebirthMoments(moments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const calculateGrowthScore = (before: Record<string, number>, after: Record<string, number>) => {
    const beforeSum = Object.values(before).reduce((sum, val) => sum + val, 0);
    const afterSum = Object.values(after).reduce((sum, val) => sum + val, 0);
    const beforeAvg = beforeSum / Object.keys(before).length;
    const afterAvg = afterSum / Object.keys(after).length;
    return Math.round(((afterAvg - beforeAvg) / beforeAvg) * 100);
  };

  if (!user || loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Symbolic Rebirth Tracker
          </CardTitle>
          <CardDescription>Detecting transformation moments...</CardDescription>
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

  if (rebirthMoments.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Symbolic Rebirth Tracker
          </CardTitle>
          <CardDescription>
            No transformation moments detected yet. Major inner changes will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Your rebirths will be captured as you evolve.</p>
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
            <Sparkles className="h-5 w-5" />
            Symbolic Rebirth Tracker
          </CardTitle>
          <CardDescription>
            Major inner transformations and moments of becoming
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {rebirthMoments.map((moment) => {
            const IconComponent = rebirthTypeIcons[moment.symbolicForm as keyof typeof rebirthTypeIcons] || Sparkles;
            const emoji = rebirthTypeEmojis[moment.symbolicForm as keyof typeof rebirthTypeEmojis] || '✨';
            const growthScore = calculateGrowthScore(moment.traitsBefore, moment.traitsAfter);
            
            return (
              <div key={moment.rebirthId} className="border rounded-lg p-4 space-y-3 relative overflow-hidden">
                {moment.bloomUnlocked && (
                  <div className="absolute top-2 right-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
                
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{emoji}</span>
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{moment.symbolicForm}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(moment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={growthScore > 50 ? 'default' : growthScore > 0 ? 'secondary' : 'outline'}>
                    {growthScore > 0 ? '+' : ''}{growthScore}% growth
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trigger Event:</p>
                    <p className="text-sm">{moment.eventTrigger}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Narrator Insight:</p>
                    <p className="text-sm italic text-purple-600 dark:text-purple-400">
                      &quot;{moment.narratorInsight}&quot;
                    </p>
                  </div>
                </div>

                {moment.linkedLoopsBroken && moment.linkedLoopsBroken.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Loops Broken:</p>
                    <div className="flex flex-wrap gap-1">
                      {moment.linkedLoopsBroken.map((loop, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {loop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-2 border-t text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">Before:</p>
                    <div className="space-y-1">
                      {Object.entries(moment.traitsBefore).slice(0, 3).map(([trait, value]) => (
                        <div key={trait} className="flex justify-between">
                          <span className="capitalize">{trait.replace('_', ' ')}:</span>
                          <span>{Math.round(value * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground mb-1">After:</p>
                    <div className="space-y-1">
                      {Object.entries(moment.traitsAfter).slice(0, 3).map(([trait, value]) => (
                        <div key={trait} className="flex justify-between">
                          <span className="capitalize">{trait.replace('_', ' ')}:</span>
                          <span className="text-green-600">{Math.round(value * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Rebirth #{moment.rebirthId.split('_').pop()}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Replay
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Experience this transformation again
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}