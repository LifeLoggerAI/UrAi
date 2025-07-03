
'use client';

import { useEffect, useState } from 'react';
import type { DashboardData, Person, SuggestRitualOutput, AuraState, MemoryBloom } from '@/lib/types';
import { getDashboardDataAction, suggestRitualAction } from '@/app/actions';
import { useAuth } from './auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { BotMessageSquare, Users, Sprout, Wand2 } from 'lucide-react';
import { InteractiveAvatar } from './interactive-avatar';
import { useToast } from '@/hooks/use-toast';
import { FacialEmotionCapture } from './facial-emotion-capture';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

export function HomeView() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [data, setData] = useState<DashboardData | null>(null);
    const [people, setPeople] = useState<Person[]>([]);
    const [auraState, setAuraState] = useState<AuraState | null>(null);
    const [memoryBlooms, setMemoryBlooms] = useState<MemoryBloom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRitualLoading, setIsRitualLoading] = useState(false);
    const [ritualSuggestion, setRitualSuggestion] = useState<SuggestRitualOutput | null>(null);
    const [isRitualDialogOpen, setIsRitualDialogOpen] = useState(false);

    useEffect(() => {
        if (user) {
            const unsubscribes: (() => void)[] = [];

            getDashboardDataAction(user.uid)
                .then(result => {
                    if (result.data) setData(result.data);
                })
                .finally(() => setIsLoading(false));

            const qPeople = query(collection(db, "people"), where("uid", "==", user.uid));
            unsubscribes.push(onSnapshot(qPeople, (snapshot) => {
                setPeople(snapshot.docs.map(doc => doc.data() as Person));
            }));

            const auraRef = doc(db, 'users', user.uid, 'auraStates', 'current');
            unsubscribes.push(onSnapshot(auraRef, (doc) => {
                setAuraState(doc.data() as AuraState);
            }));

            const bloomsRef = collection(db, 'users', user.uid, 'memoryBlooms');
            unsubscribes.push(onSnapshot(bloomsRef, (snapshot) => {
                setMemoryBlooms(snapshot.docs.map(doc => doc.data() as MemoryBloom));
            }));

            return () => {
                unsubscribes.forEach(unsub => unsub());
            };
        }
    }, [user]);

    const moodDescription = () => {
        if (auraState?.currentEmotion) {
            return `Currently feeling ${auraState.currentEmotion}.`;
        }
        if (overallMood > 0.5) return "Feeling bright and optimistic.";
        if (overallMood > 0.1) return "A sense of calm and positivity.";
        if (overallMood < -0.5) return "Reflecting on some challenges.";
        if (overallMood < -0.1) return "A quiet, contemplative mood.";
        return "A balanced and neutral state.";
    }

    const handleZoneClick = async (zone: 'head' | 'torso' | 'limbs' | 'aura') => {
        if (isRitualLoading) return;
        setIsRitualLoading(true);
        const context = `Overall mood is ${moodDescription()}.`;
        
        try {
            const result = await suggestRitualAction({ zone, context });
            if (result.error) {
                throw new Error(result.error);
            }
            if (result.suggestion) {
                setRitualSuggestion(result.suggestion);
                setIsRitualDialogOpen(true);
            }
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Suggestion Failed',
                description: (error as Error).message
            });
        } finally {
            setIsRitualLoading(false);
        }
    };

    const overallMood = data?.sentimentOverTime.length 
        ? data.sentimentOverTime[data.sentimentOverTime.length - 1].sentiment 
        : 0;

    const getSkyStyle = () => {
        const hue = (overallMood + 1) * 60; // red -> yellow -> green
        const lightness = 70 + Math.abs(overallMood) * 25; // Brighter for strong emotions
        return {
            background: `radial-gradient(ellipse at top, hsl(${hue}, 80%, ${lightness}%), hsl(var(--background)))`,
            opacity: 0.15
        };
    };
    
    if (isLoading) {
        return (
            <div className="w-full min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-4">
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-6 w-96 mb-8" />
                <Skeleton className="h-[500px] w-full max-w-lg" />
            </div>
        );
    }

    return (
        <>
            <div className="relative w-full min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-4 overflow-hidden text-center">
                <div style={getSkyStyle()} className="absolute inset-0 z-0 transition-all duration-1000" />
                
                <div className="relative z-10 w-full max-w-4xl animate-fadeIn">
                    <h1 className="text-3xl font-bold font-headline text-foreground">Today's Emotional Outlook</h1>
                    <p className="text-muted-foreground mt-2 mb-8">{moodDescription()}</p>
                </div>

                <TooltipProvider>
                <div className="absolute inset-x-0 top-10 flex justify-center gap-8 opacity-50 z-10">
                    {people.slice(0, 5).map((person, i) => (
                        <Tooltip key={person.id}>
                            <TooltipTrigger>
                                <div className="flex flex-col items-center animate-fadeIn" style={{ animationDelay: `${i * 100}ms`}}>
                                    <Users className="h-6 w-6" />
                                    <span className="text-xs mt-1">{person.name}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent><p>Social Silhouette: {person.name}</p></TooltipContent>
                        </Tooltip>
                    ))}
                </div>
                </TooltipProvider>

                <div className="relative z-10 w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-4">
                    <InteractiveAvatar 
                        mood={overallMood} 
                        onZoneClick={handleZoneClick} 
                        isLoading={isRitualLoading}
                        overlayColor={auraState?.overlayColor}
                        overlayStyle={auraState?.overlayStyle}
                    />
                    <div className="space-y-8">
                        <Card>
                        <CardHeader>
                                <CardTitle>AI Companion</CardTitle>
                                <CardDescription>Your guide to self-discovery.</CardDescription>
                        </CardHeader>
                        <CardContent>
                                <div 
                                    onClick={() => handleZoneClick('aura')} 
                                    className="h-24 w-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110"
                                    style={{
                                        boxShadow: auraState?.overlayColor ? `0 0 20px 5px ${auraState.overlayColor}` : `0 0 20px 5px hsla(${overallMood * 60 + 60}, 100%, 70%, 0.5)`
                                    }}
                                >
                                    <BotMessageSquare className="h-10 w-10 text-primary animate-pulse" />
                                </div>
                        </CardContent>
                        </Card>
                        <FacialEmotionCapture />
                    </div>
                </div>

                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-12 opacity-60 z-10">
                    <TooltipProvider>
                        {memoryBlooms.map((bloom, i) => (
                            <Tooltip key={bloom.bloomId}>
                                <TooltipTrigger>
                                    <div className="animate-fadeIn" style={{ animationDelay: `${500 + i * 150}ms`}}>
                                        <Sprout className="h-5 w-5" style={{color: bloom.bloomColor}} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent><p>{bloom.description}</p></TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>

                <div className="absolute bottom-8 text-center z-10 text-xs text-muted-foreground w-full max-w-md">
                    <p>The sky reflects your overall mood. The blooms represent positive memories. Your avatar is a mirror to your inner world.</p>
                </div>
            </div>

            <AlertDialog open={isRitualDialogOpen} onOpenChange={setIsRitualDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Wand2 className="text-primary h-5 w-5"/>
                            {ritualSuggestion?.title || 'A Moment for You'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="pt-2">
                            {ritualSuggestion?.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4 px-4 my-2 text-sm bg-muted/50 rounded-md border">
                        <p className="text-foreground">{ritualSuggestion?.suggestion}</p>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setIsRitualDialogOpen(false)}>Done</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
