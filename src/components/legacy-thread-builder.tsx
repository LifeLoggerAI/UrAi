'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { collection, query, where, onSnapshot, orderBy, limit, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { LegacyThreadNew } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { BookOpen, Share2, Lock, Globe, Plus, Download, Play, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const legacyTypes = [
  { value: 'personal', label: 'Personal Scroll', icon: '🔮', description: 'Reflective journey for your own healing & understanding' },
  { value: 'shared', label: 'Shared Scroll', icon: '🪶', description: 'Wisdom for friends, partners, future self' },
  { value: 'public', label: 'Public Legacy', icon: '🏛️', description: 'A symbolic gift to the world, anonymously or named' },
  { value: 'shadow', label: 'Shadow Scroll', icon: '👁️', description: 'The hard truths and wounds that shaped your empathy' },
];

const narratorTones = [
  'Warm. Honest. Mythic.',
  'Gentle. Reflective. Wise.',
  'Raw. Authentic. Vulnerable.',
  'Poetic. Mystical. Deep.',
  'Calm. Centered. Grounded.',
];

export function LegacyThreadBuilder() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [legacyThreads, setLegacyThreads] = useState<LegacyThreadNew[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    introNarration: '',
    narratorTone: narratorTones[0],
    publicVisibility: false,
    sharedWith: [] as string[],
    finalSymbol: '',
  });

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'legacyThreads'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const threads: LegacyThreadNew[] = [];
      querySnapshot.forEach((doc) => {
        threads.push({ ...doc.data() } as LegacyThreadNew);
      });
      setLegacyThreads(threads);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateThread = async () => {
    if (!user || !newThread.title.trim()) return;

    try {
      setIsCreating(true);
      
      const threadData: Omit<LegacyThreadNew, 'threadId'> = {
        uid: user.uid,
        title: newThread.title,
        introNarration: newThread.introNarration,
        momentsIncluded: [], // Would be populated from existing user data
        publicVisibility: newThread.publicVisibility,
        sharedWith: newThread.sharedWith,
        narratorTone: newThread.narratorTone,
        finalSymbol: newThread.finalSymbol,
        createdAt: Date.now(),
      };

      const docRef = await addDoc(collection(db, 'legacyThreads'), {
        ...threadData,
        threadId: `legacy_${user.uid}_${Date.now()}`,
      });

      toast({
        title: "Legacy Thread Created",
        description: "Your mythic scroll has been woven into existence.",
      });

      // Reset form
      setNewThread({
        title: '',
        introNarration: '',
        narratorTone: narratorTones[0],
        publicVisibility: false,
        sharedWith: [],
        finalSymbol: '',
      });

    } catch (error) {
      console.error('Error creating legacy thread:', error);
      toast({
        title: "Error",
        description: "Failed to create legacy thread. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (!user || loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Legacy Thread Builder
          </CardTitle>
          <CardDescription>Loading your mythic scrolls...</CardDescription>
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

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Legacy Thread Builder
          </CardTitle>
          <CardDescription>
            Weave your profound rituals, crises, and insights into mythic scrolls
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Create New Thread */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Weave New Legacy Thread
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Legacy Thread</DialogTitle>
                <DialogDescription>
                  Your life isn't just a story — it's a teaching.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Thread Title</Label>
                  <Input
                    id="title"
                    placeholder="When Silence Became Strength"
                    value={newThread.title}
                    onChange={(e) => setNewThread(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="intro">Opening Narration</Label>
                  <Textarea
                    id="intro"
                    placeholder="You learned to survive before you ever learned to breathe..."
                    value={newThread.introNarration}
                    onChange={(e) => setNewThread(prev => ({ ...prev, introNarration: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tone">Narrator Tone</Label>
                  <select
                    id="tone"
                    className="w-full p-2 border rounded-md"
                    value={newThread.narratorTone}
                    onChange={(e) => setNewThread(prev => ({ ...prev, narratorTone: e.target.value }))}
                  >
                    {narratorTones.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="symbol">Final Symbol</Label>
                  <Input
                    id="symbol"
                    placeholder="Spiral Tree in Rainlight"
                    value={newThread.finalSymbol}
                    onChange={(e) => setNewThread(prev => ({ ...prev, finalSymbol: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={newThread.publicVisibility}
                    onCheckedChange={(checked) => setNewThread(prev => ({ ...prev, publicVisibility: checked }))}
                  />
                  <Label htmlFor="public">Make publicly visible</Label>
                </div>

                <Button 
                  onClick={handleCreateThread} 
                  disabled={isCreating || !newThread.title.trim()}
                  className="w-full"
                >
                  {isCreating ? 'Weaving...' : 'Create Legacy Thread'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Existing Threads */}
          {legacyThreads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No legacy threads yet. Create your first mythic scroll.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {legacyThreads.map((thread) => (
                <div key={thread.threadId} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{thread.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {thread.momentsIncluded.length} moments woven
                      </p>
                      {thread.introNarration && (
                        <p className="text-sm italic mt-2 text-blue-600 dark:text-blue-400">
                          "{thread.introNarration.slice(0, 100)}..."
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {thread.publicVisibility ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <Globe className="h-4 w-4 text-green-600" />
                          </TooltipTrigger>
                          <TooltipContent>Public Legacy</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger>
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Private Thread</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Narrator Tone:</p>
                      <p>{thread.narratorTone}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Final Symbol:</p>
                      <p>{thread.finalSymbol || 'Not set'}</p>
                    </div>
                  </div>

                  {thread.sharedWith && thread.sharedWith.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Shared with:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {thread.sharedWith.map((recipient, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {recipient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      Created {new Date(thread.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Read scroll</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit thread</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Export scroll</TooltipContent>
                      </Tooltip>
                      {thread.publicVisibility && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Share thread</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}