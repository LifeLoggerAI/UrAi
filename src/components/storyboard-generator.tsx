'use client';

import React, { useState } from 'react';
import { generateStoryboard } from '@/ai/flows/generate-storyboard';
import { useAuth } from '@/components/auth-provider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Film, Camera, Sparkles, Copy, Eye } from 'lucide-react';
import type { GenerateStoryboardOutput } from '@/lib/types';
<<<<<<< HEAD

export function StoryboardGenerator() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [eventDescription, setEventDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [storyboard, setStoryboard] = useState<GenerateStoryboardOutput | null>(null);
=======
import { generateStoryboard as generateStoryboardAction } from '@/app/actions';


export function StoryboardGenerator() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [eventDescription, setEventDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyboard, setStoryboard] = useState<GenerateStoryboardOutput | null>(null);
>>>>>>> 5be23281 (Commit before pulling remote changes)

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !eventDescription.trim()) {
            toast({
                variant: "destructive",
                title: "Missing Information",
                description: "Please enter an event description before generating.",
            });
            return;
        }

<<<<<<< HEAD
        setIsGenerating(true);
        try {
            const result = await generateStoryboard({ eventDescription });
            if (!result) {
                throw new Error("AI storyboard generation failed.");
            }

            setStoryboard(result);
            toast({
                title: "Storyboard Generated",
                description: `Created ${result.scenes.length} scenes with detailed shots.`,
            });
=======
    setIsGenerating(true);
    try {
      const result = await generateStoryboardAction({ eventDescription });
      
      if(result.error || !result.data) {
        throw new Error(result.error || 'AI storyboard generation failed.');
      }
      
      setStoryboard(result.data);
      toast({
        title: 'Storyboard Generated',
        description: `Created ${result.data.scenes.length} scenes with detailed shots.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: (error as Error).message,
      });
    } finally {
      setIsGenerating(false);
    }
  };
>>>>>>> 5be23281 (Commit before pulling remote changes)

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: (error as Error).message,
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const copyImagePrompt = (prompt: string) => {
        navigator.clipboard.writeText(prompt);
        toast({
            title: "Copied to Clipboard",
            description: "Image prompt copied successfully.",
        });
    };

    const getShotTypeIcon = (shotType: string) => {
        switch (shotType.toLowerCase()) {
            case 'close-up':
                return <Eye className="h-4 w-4" />;
            case 'medium':
                return <Camera className="h-4 w-4" />;
            case 'wide':
            case 'extreme-wide':
                return <Film className="h-4 w-4" />;
            case 'tracking':
            case 'dolly':
            case 'crane':
                return <Camera className="h-4 w-4" />;
            default:
                return <Camera className="h-4 w-4" />;
        }
    };

    return (
        <div className="w-full space-y-6">
            <form onSubmit={handleGenerate} className="space-y-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>AI Storyboard Generator</CardTitle>
                                <CardDescription>
                                    Transform your event descriptions into cinematic storyboards with photo-realistic prompts
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Describe your event... (e.g., 'Sarah's 25th birthday party at a rooftop garden in downtown. About 20 friends gathered as the sun set over the city skyline. There was acoustic music, string lights, and a surprise cake moment.')"
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            disabled={isGenerating}
                            rows={6}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isGenerating || !eventDescription.trim()}>
                            {isGenerating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Film className="mr-2 h-4 w-4" />
                            )}
                            Generate Storyboard
                        </Button>
                    </CardFooter>
                </Card>
            </form>

            {storyboard && (
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Film className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-headline font-bold">Generated Storyboard</h2>
                        <Badge variant="secondary">{storyboard.scenes.length} scenes</Badge>
                    </div>

                    <ScrollArea className="max-h-[80vh]">
                        <div className="space-y-6">
                            {storyboard.scenes.map((scene, sceneIndex) => (
                                <Card key={sceneIndex} className="border-l-4 border-l-primary">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-bold">
                                                Scene {sceneIndex + 1}
                                            </span>
                                        </CardTitle>
                                        {scene.sceneHeader && (
                                            <CardDescription className="text-base">
                                                {scene.sceneHeader}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {scene.dialogue && (
                                            <div className="p-3 bg-secondary/50 rounded-lg border-l-2 border-l-accent">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Dialogue/Voice-over:</p>
                                                <p className="italic">&ldquo;{scene.dialogue}&rdquo;</p>
                                            </div>
                                        )}
                                        
                                        <div className="space-y-3">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <Camera className="h-4 w-4" />
                                                Shots ({scene.shots.length})
                                            </h4>
                                            {scene.shots.map((shot, shotIndex) => (
                                                <Card key={shotIndex} className="bg-card/50">
                                                    <CardContent className="p-4">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center gap-2">
                                                                {getShotTypeIcon(shot.type)}
                                                                <span className="font-medium">Shot {shotIndex + 1}</span>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {shot.type}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="space-y-2 text-sm">
                                                            <div><strong>Subject:</strong> {shot.subject}</div>
                                                            <div><strong>Action:</strong> {shot.action}</div>
                                                            <div><strong>Camera:</strong> {shot.camera}</div>
                                                            <div><strong>Lighting:</strong> {shot.lighting}</div>
                                                        </div>

                                                        {shot.imagePrompt && (
                                                            <div className="space-y-2">
                                                                <Separator />
                                                                <div className="flex items-center justify-between">
                                                                    <h5 className="text-sm font-medium">Image Prompt:</h5>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="sm"
                                                                        onClick={() => copyImagePrompt(shot.imagePrompt!)}
                                                                    >
                                                                        <Copy className="h-3 w-3 mr-1" />
                                                                        Copy
                                                                    </Button>
                                                                </div>
                                                                <div className="p-3 bg-background border rounded text-sm font-mono">
                                                                    {shot.imagePrompt}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}