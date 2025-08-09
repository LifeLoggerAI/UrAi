'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { NarrativeLoopDetector } from './narrative-loop-detector';
import { SymbolicRebirthTracker } from './symbolic-rebirth-tracker';
import { ThresholdModePlayback } from './threshold-mode-playback';
import { LegacyThreadBuilder } from './legacy-thread-builder';
import { AuraScrollPlayer } from './aura-scroll-player';
import { Sparkles, Repeat, Mountain, BookOpen, Palette, Brain, Play, Download } from 'lucide-react';

export function SymbolicInsightsView() {
  const [activeTab, setActiveTab] = useState('loops');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            Symbolic Life Tracking
          </CardTitle>
          <CardDescription>
            Advanced pattern recognition and mythic storytelling for your life journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <Repeat className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold">Pattern Detection</h3>
              <p className="text-sm text-muted-foreground">
                Identify recurring emotional loops and behavioral patterns
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Mountain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold">Transformation Moments</h3>
              <p className="text-sm text-muted-foreground">
                Track rebirths and threshold crossings in your journey
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold">Legacy Creation</h3>
              <p className="text-sm text-muted-foreground">
                Weave your experiences into mythic stories and wisdom
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="loops" className="flex items-center gap-2">
            <Repeat className="h-4 w-4" />
            <span className="hidden sm:inline">Loops</span>
          </TabsTrigger>
          <TabsTrigger value="rebirths" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Rebirths</span>
          </TabsTrigger>
          <TabsTrigger value="thresholds" className="flex items-center gap-2">
            <Mountain className="h-4 w-4" />
            <span className="hidden sm:inline">Thresholds</span>
          </TabsTrigger>
          <TabsTrigger value="legacy" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Legacy</span>
          </TabsTrigger>
          <TabsTrigger value="aura" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Aura</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="loops" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Narrative Loop Detector</h2>
                <p className="text-muted-foreground">
                  &quot;You&apos;ve lived this story before &mdash; let&apos;s name it.&quot;
                </p>
              </div>
              <Badge variant="secondary">AI Pattern Recognition</Badge>
            </div>
            <NarrativeLoopDetector />
          </div>
        </TabsContent>

        <TabsContent value="rebirths" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Symbolic Rebirth Tracker</h2>
                <p className="text-muted-foreground">
                  &quot;This is where everything changed &mdash; quietly, or all at once.&quot;
                </p>
              </div>
              <Badge variant="secondary">Transformation Detection</Badge>
            </div>
            <SymbolicRebirthTracker />
          </div>
        </TabsContent>

        <TabsContent value="thresholds" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Threshold Mode Playback</h2>
                <p className="text-muted-foreground">
                  &quot;You stood at the edge of everything &mdash; and chose to walk through.&quot;
                </p>
              </div>
              <Badge variant="secondary">Immersive Replay</Badge>
            </div>
            <ThresholdModePlayback />
          </div>
        </TabsContent>

        <TabsContent value="legacy" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Legacy Thread Builder</h2>
                <p className="text-muted-foreground">
                  &quot;Your life isn&apos;t just a story &mdash; it&apos;s a teaching.&quot;
                </p>
              </div>
              <Badge variant="secondary">Mythic Storytelling</Badge>
            </div>
            <LegacyThreadBuilder />
          </div>
        </TabsContent>

        <TabsContent value="aura" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Aura Scroll Player</h2>
                <p className="text-muted-foreground">
                  &quot;Watch your life in color, in motion, in feeling.&quot;
                </p>
              </div>
              <Badge variant="secondary">Emotional Visualization</Badge>
            </div>
            <AuraScrollPlayer />
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Brain className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Advanced symbolic AI processing your life patterns
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Generate Scroll
              </Button>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}