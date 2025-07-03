
'use client';

import { useEffect, useState } from 'react';
import type { DashboardData, Person } from '@/lib/types';
import { getDashboardDataAction } from '@/app/actions';
import { useAuth } from './auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';
import { BotMessageSquare, Users, Sprout } from 'lucide-react';
import { InteractiveAvatar } from './interactive-avatar';
import { useToast } from '@/hooks/use-toast';
import { FacialEmotionCapture } from './facial-emotion-capture';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

// New Home screen, repurposed from DashboardView
export function DashboardView() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [data, setData] = useState<DashboardData | null>(null);
    const [people, setPeople] = useState<Person[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const unsubData = getDashboardDataAction(user.uid)
                .then(result => {
                    if (result.data) setData(result.data);
                })
                .finally(() => setIsLoading(false));

            const qPeople = query(collection(db, "people"), where("uid", "==", user.uid));
            const unsubPeople = onSnapshot(qPeople, (snapshot) => {
                setPeople(snapshot.docs.map(doc => doc.data() as Person));
            });

            return () => {
                unsubPeople();
            };
        }
    }, [user]);

    const handleZoneClick = (zone: string) => {
        toast({
            title: `Zone Clicked: ${zone}`,
            description: "This would navigate to a detailed view in a full implementation."
        });
    };

    const overallMood = data?.sentimentOverTime.length 
        ? data.sentimentOverTime[data.sentimentOverTime.length - 1].sentiment 
        : 0;

    // Forecast Sky effect
    const getSkyStyle = () => {
        const hue = (overallMood + 1) * 60; // red -> yellow -> green
        const lightness = 70 + Math.abs(overallMood) * 25; // Brighter for strong emotions
        return {
            background: `radial-gradient(ellipse at top, hsl(${hue}, 80%, ${lightness}%), hsl(var(--background)))`,
            opacity: 0.15
        };
    };
    
    // Ground Blooms
    const totalMemories = data?.stats.totalMemories || 0;
    const bloomCount = Math.min(Math.floor(totalMemories / 2), 10); // up to 10 blooms

    if (isLoading) {
        return <Skeleton className="h-[500px] w-full" />;
    }

    return (
        <div className="relative w-full min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-4 overflow-hidden">
            <div style={getSkyStyle()} className="absolute inset-0 z-0 transition-all duration-1000" />
            
            {/* Social Silhouettes */}
            <TooltipProvider>
              <div className="absolute inset-x-0 top-10 flex justify-center gap-8 opacity-50">
                  {people.slice(0, 5).map((person, i) => (
                      <Tooltip key={person.id}>
                          <TooltipTrigger>
                              <div className="flex flex-col items-center animate-fadeIn" style={{ animationDelay: `${i * 100}ms`}}>
                                  <Users className="h-6 w-6" />
                              </div>
                          </TooltipTrigger>
                          <TooltipContent><p>{person.name}</p></TooltipContent>
                      </Tooltip>
                  ))}
              </div>
            </TooltipProvider>

            <div className="relative z-10 w-full max-w-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 <InteractiveAvatar mood={overallMood} onZoneClick={handleZoneClick} />
                 <div className="space-y-8">
                    <Card>
                       <CardHeader>
                            <CardTitle>AI Companion</CardTitle>
                            <CardDescription>Your guide to self-discovery.</CardDescription>
                       </CardHeader>
                       <CardContent>
                            <div 
                                onClick={() => handleZoneClick('orb')} 
                                className="h-24 w-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center cursor-pointer transition-all duration-500 hover:scale-110"
                                style={{
                                    boxShadow: `0 0 20px 5px hsla(${overallMood * 60 + 60}, 100%, 70%, 0.5)`
                                }}
                            >
                                <BotMessageSquare className="h-10 w-10 text-primary animate-pulse" />
                            </div>
                       </CardContent>
                    </Card>
                    <FacialEmotionCapture />
                 </div>
            </div>

            {/* Ground Blooms */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-12 opacity-60">
                 {[...Array(bloomCount)].map((_, i) => (
                    <div key={i} className="animate-fadeIn" style={{ animationDelay: `${500 + i * 150}ms`}}>
                        <Sprout className="h-5 w-5 text-green-400" />
                    </div>
                ))}
            </div>
        </div>
    );
}
