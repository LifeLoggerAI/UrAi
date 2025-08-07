'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ThresholdMoment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Mountain, Heart, Lightbulb, MapPin, Zap, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

const thresholdTypeIcons = {
  'Relationship Collapse': Heart,
  'Death or Loss': Mountain,
  'Sudden Insight': Lightbulb,
  'Big Life Pivot': MapPin,
  'Breakdown → Breakthrough': Zap,
};

const thresholdTypeEmojis = {
  'Relationship Collapse': '💔',
  'Death or Loss': '🪦',
  'Sudden Insight': '⚡',
  'Big Life Pivot': '🔁',
  'Breakdown → Breakthrough': '🧱',
};

export function ThresholdModePlayback() {
  const { user } = useAuth();
  const [thresholdMoments, setThresholdMoments] = useState<ThresholdMoment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [selectedMoment, setSelectedMoment] = useState<ThresholdMoment | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'thresholdMoments'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const moments: ThresholdMoment[] = [];
      querySnapshot.forEach((doc) => {
        moments.push({ ...doc.data() } as ThresholdMoment);
      });
      setThresholdMoments(moments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handlePlayback = (moment: ThresholdMoment) => {
    setSelectedMoment(moment);
    setIsPlaying(true);
    setPlaybackProgress(0);
    
    // Simulate playback progress
    const duration = parseDuration(moment.replayDuration);
    const interval = setInterval(() => {
      setPlaybackProgress(prev => {
        if (prev >= 100) {
          setIsPlaying(false);
          clearInterval(interval);
          return 100;
        }
        return prev + (100 / (duration * 10)); // Update every 100ms
      });
    }, 100);
  };

  const parseDuration = (duration: string): number => {
    const match = duration.match(/(\d+)m/);
    return match ? parseInt(match[1]) * 60 : 180; // default 3 minutes
  };

  const resetPlayback = () => {
    setPlaybackProgress(0);
    setIsPlaying(false);
  };

  if (!user || loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5" />
            Threshold Mode Playback
          </CardTitle>
          <CardDescription>Loading threshold moments...</CardDescription>
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

  if (thresholdMoments.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-5 w-5" />
            Threshold Mode Playback
          </CardTitle>
          <CardDescription>
            No threshold moments detected yet. Major life transitions will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Mountain className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Your threshold crossings will be preserved for reflection.</p>
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
            <Mountain className="h-5 w-5" />
            Threshold Mode Playback
          </CardTitle>
          <CardDescription>
            Life-altering moments with symbolic overlays and narrator experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {thresholdMoments.map((moment) => {
            const IconComponent = thresholdTypeIcons[moment.triggerEvent as keyof typeof thresholdTypeIcons] || Mountain;
            const emoji = thresholdTypeEmojis[moment.triggerEvent as keyof typeof thresholdTypeEmojis] || '🌫️';
            
            return (
              <div key={moment.thresholdId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{emoji}</span>
                      <IconComponent className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{moment.triggerEvent}</h3>
                      <p className="text-sm text-muted-foreground">
                        {moment.thresholdState}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {moment.replayDuration}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Core Insight:</p>
                    <p className="text-sm font-medium">{moment.coreInsight}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Narrator Voice:</p>
                      <p>{moment.narratorVoice}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Visual Transition:</p>
                      <p>{moment.visualTransition}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aura Shift:</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: moment.auraColorShift.split(' → ')[0] || '#666' }}
                      />
                      <span className="text-xs">→</span>
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: moment.auraColorShift.split(' → ')[1] || '#gold' }}
                      />
                      <span className="text-sm ml-2">{moment.auraColorShift}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {moment.playbackMode} • {new Date(moment.createdAt).toLocaleDateString()}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Enter Threshold
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <span className="text-2xl">{emoji}</span>
                          {moment.triggerEvent}
                        </DialogTitle>
                        <DialogDescription>
                          {moment.thresholdState}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        <div className="text-center">
                          <div 
                            className="w-full h-32 rounded-lg relative overflow-hidden"
                            style={{
                              background: `linear-gradient(45deg, ${moment.auraColorShift.split(' → ')[0] || '#666'}, ${moment.auraColorShift.split(' → ')[1] || '#gold'})`,
                              opacity: 0.7
                            }}
                          >
                            <div className="absolute inset-0 flex items-center justify-center">
                              <p className="text-lg font-medium text-white drop-shadow-lg">
                                {moment.symbolicOverlay}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-lg italic text-muted-foreground mb-4">
                            "{moment.coreInsight}"
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Playback Progress</span>
                            <span className="text-sm text-muted-foreground">
                              {Math.round(playbackProgress)}%
                            </span>
                          </div>
                          <Progress value={playbackProgress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePlayback(moment)}
                            disabled={isPlaying}
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={resetPlayback}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Volume2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}