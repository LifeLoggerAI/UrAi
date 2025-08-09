'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from './auth-provider';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AuraScroll } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Download, Share2, Palette } from 'lucide-react';

const moodColors = {
  anxious: '#FF4444',
  grief: '#552288',
  reflective: '#3377AA',
  renewal: '#33CC88',
  joyful: '#FFD700',
  calm: '#87CEEB',
  energetic: '#FF6347',
  melancholy: '#9370DB',
  hopeful: '#98FB98',
  frustrated: '#CD5C5C',
};

const moodOverlays = {
  crack: '⚡',
  fog: '🌫️',
  rain: '🌧️',
  eclipse: '🌑',
  mirror: '🪞',
  drift: '💨',
  bloom: '🌸',
  light: '✨',
  storm: '⛈️',
  wave: '🌊',
};

export function AuraScrollPlayer() {
  const { user } = useAuth();
  const [auraScrolls, setAuraScrolls] = useState<AuraScroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScroll, setSelectedScroll] = useState<AuraScroll | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'auraScrolls'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const scrolls: AuraScroll[] = [];
      querySnapshot.forEach((doc) => {
        scrolls.push({ ...doc.data() } as AuraScroll);
      });
      setAuraScrolls(scrolls);
      if (scrolls.length > 0 && !selectedScroll) {
        setSelectedScroll(scrolls[0]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, selectedScroll]);

  useEffect(() => {
    if (isPlaying && selectedScroll) {
      intervalRef.current = setInterval(() => {
        setCurrentWeek(prev => {
          if (prev >= selectedScroll.weeklyAuraData.length - 1) {
            setIsPlaying(false);
            return selectedScroll.weeklyAuraData.length - 1;
          }
          return prev + 1;
        });
      }, 2000); // 2 seconds per week
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, selectedScroll]);

  const handlePlay = () => {
    if (!selectedScroll) return;
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    setCurrentWeek(prev => Math.max(0, prev - 1));
  };

  const handleSkipForward = () => {
    if (!selectedScroll) return;
    setCurrentWeek(prev => Math.min(selectedScroll.weeklyAuraData.length - 1, prev + 1));
  };

  const handleSeek = (value: number[]) => {
    if (!selectedScroll) return;
    const newWeek = Math.floor((value[0] / 100) * (selectedScroll.weeklyAuraData.length - 1));
    setCurrentWeek(newWeek);
  };

  const getCurrentMoodData = () => {
    if (!selectedScroll || !selectedScroll.weeklyAuraData[currentWeek]) return null;
    return selectedScroll.weeklyAuraData[currentWeek];
  };

  const getProgressPercentage = () => {
    if (!selectedScroll || selectedScroll.weeklyAuraData.length === 0) return 0;
    return (currentWeek / (selectedScroll.weeklyAuraData.length - 1)) * 100;
  };

  if (!user || loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Aura Scroll Player
          </CardTitle>
          <CardDescription>Loading your emotional journey...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (auraScrolls.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Aura Scroll Player
          </CardTitle>
          <CardDescription>
            No aura scrolls available yet. Your emotional journey will be visualized here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Palette className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Your life in color, in motion, in feeling.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentMood = getCurrentMoodData();

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Aura Scroll Player
          </CardTitle>
          <CardDescription>
            Watch your emotional life journey in color and motion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Scroll Selection */}
          {auraScrolls.length > 1 && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Select Scroll:</label>
              <select
                className="w-full p-2 border rounded-md mt-1"
                value={selectedScroll?.scrollId || ''}
                onChange={(e) => {
                  const scroll = auraScrolls.find(s => s.scrollId === e.target.value);
                  if (scroll) {
                    setSelectedScroll(scroll);
                    setCurrentWeek(0);
                    setIsPlaying(false);
                  }
                }}
              >
                {auraScrolls.map(scroll => (
                  <option key={scroll.scrollId} value={scroll.scrollId}>
                    {scroll.scrollId} ({scroll.weeklyAuraData.length} weeks)
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedScroll && (
            <>
              {/* Main Aura Display */}
              <div className="relative h-48 rounded-lg overflow-hidden border">
                <div
                  className="absolute inset-0 transition-all duration-1000"
                  style={{
                    background: currentMood ? 
                      `linear-gradient(135deg, ${currentMood.color}40, ${currentMood.color}80)` :
                      'linear-gradient(135deg, #66666640, #66666680)',
                  }}
                >
                  {/* Overlays */}
                  {currentMood?.overlays && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-30 filter blur-sm">
                        {currentMood.overlays.map(overlay => moodOverlays[overlay as keyof typeof moodOverlays] || '✨').join(' ')}
                      </div>
                    </div>
                  )}
                  
                  {/* Mood Info */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">
                            {currentMood?.week || 'Week 1'}
                          </p>
                          <p className="text-sm opacity-90 capitalize">
                            {currentMood?.mood || 'Unknown mood'}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: currentMood?.color + '40' }}
                        >
                          {currentMood?.overlays?.join(', ') || 'No overlays'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Week {currentWeek + 1}</span>
                  <span>{selectedScroll.weeklyAuraData.length} weeks total</span>
                </div>
                <Slider
                  value={[getProgressPercentage()]}
                  onValueChange={handleSeek}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Aura Timeline */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Aura Timeline:</p>
                <div className="flex gap-1 overflow-x-auto pb-2">
                  {selectedScroll.weeklyAuraData.map((weekData, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <button
                          className={`flex-shrink-0 w-4 h-8 rounded-sm border transition-all ${
                            index === currentWeek ? 'ring-2 ring-primary scale-110' : ''
                          }`}
                          style={{ backgroundColor: weekData.color }}
                          onClick={() => setCurrentWeek(index)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-medium">{weekData.week}</p>
                          <p className="text-sm capitalize">{weekData.mood}</p>
                          {weekData.overlays.length > 0 && (
                            <p className="text-xs">{weekData.overlays.join(', ')}</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleSkipBack}>
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handlePlay}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleSkipForward}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Narration Info */}
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm italic text-muted-foreground">
                  Narrated by: {selectedScroll.narrationVoice}
                </p>
                {isPlaying && (
                  <p className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                    &quot;Your emotions are painting the story of your becoming...&quot;
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}