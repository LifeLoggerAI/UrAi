
'use client';

import { useEffect, useState } from 'react';
import type { WeeklyScroll } from '@/lib/types';
import { useAuth } from './auth-provider';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { ScrollText, FileImage, Mic, Lightbulb, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

export function RecoveryGallery() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [scrolls, setScrolls] = useState<WeeklyScroll[] | undefined>(undefined);

    useEffect(() => {
        if (user) {
            const scrollsRef = collection(db, `weeklyScrolls/${user.uid}/scrolls`);
            const q = query(scrollsRef, orderBy('weekEnd', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                setScrolls(snapshot.docs.map(doc => doc.data() as WeeklyScroll));
            }, (error) => {
                console.error("Error fetching weekly scrolls:", error);
                setScrolls([]);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handleExport = (path: string) => {
        toast({
            title: `Export Initiated`,
            description: `This feature is coming soon. In a real app, this would export from: ${path}`
        });
    };

    if (scrolls === undefined) {
        return <Skeleton className="h-48 w-full" />;
    }

    if (scrolls.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-16 px-4 bg-muted/50 border rounded-lg animate-fadeIn">
                <ScrollText className="mx-auto h-12 w-12 text-primary/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No Weekly Scrolls Yet</h3>
                <p className="mt-1 text-sm">Your first automated weekly story will be generated on Sunday. Keep logging memories!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {scrolls.map(scroll => (
                <Card key={scroll.id} className="animate-fadeIn">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Weekly Scroll: {new Date(scroll.weekStart).toLocaleDateString()}</CardTitle>
                                <CardDescription>A summary for the week ending {new Date(scroll.weekEnd).toLocaleDateString()}.</CardDescription>
                            </div>
                            <Badge variant="secondary" className="capitalize">{scroll.summaryMood}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <h4 className="font-semibold text-sm mb-2">Narration</h4>
                            <p className="whitespace-pre-wrap text-sm text-foreground/80 italic">"{scroll.narrationScript}"</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Lightbulb className="text-primary"/> Highlights</h4>
                            <ul className="list-none space-y-2">
                                {scroll.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-center gap-3 text-sm text-foreground/80 p-2 bg-muted rounded-md">
                                        {highlight.type === 'recovery' ? <Droplets className="h-4 w-4 text-green-500 flex-shrink-0"/> : <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0"/>}
                                        <span>{highlight.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleExport(scroll.exportLinks.audio)}><Mic className="mr-2 h-4 w-4" /> Export Audio</Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport(scroll.exportLinks.image)}><FileImage className="mr-2 h-4 w-4" /> Export Image</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
