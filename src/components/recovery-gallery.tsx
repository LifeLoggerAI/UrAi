'use client';

import { useEffect, useState } from 'react';
import type { WeeklyScroll } from '@/lib/types';
import { useAuth } from './auth-provider';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { ScrollText, FileJson, FileImage, Mic, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function RecoveryGallery() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [scrolls, setScrolls] = useState<WeeklyScroll[] | undefined>(undefined);

    useEffect(() => {
        if (user) {
            const scrollsRef = collection(db, `weeklyScrolls/${user.uid}/scrolls`);
            const q = query(scrollsRef, orderBy('endDate', 'desc'));

            const unsubscribe = onSnapshot(q, (snapshot) => {
                setScrolls(snapshot.docs.map(doc => doc.data() as WeeklyScroll));
            }, (error) => {
                console.error("Error fetching weekly scrolls:", error);
                setScrolls([]);
            });

            return () => unsubscribe();
        }
    }, [user]);

    const handleExport = (format: string) => {
        toast({
            title: `Export Initiated (${format})`,
            description: "This feature is coming soon. In a real app, this would trigger a backend process."
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
                        <CardTitle>Weekly Scroll: {new Date(scroll.startDate).toLocaleDateString()}</CardTitle>
                        <CardDescription>A summary of your journey for the week ending {new Date(scroll.endDate).toLocaleDateString()}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap text-sm text-foreground/80">{scroll.summary}</p>
                    </CardContent>
                    <CardFooter className="flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleExport('Audio')}><Mic className="mr-2 h-4 w-4" /> Audio</Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport('Image')}><FileImage className="mr-2 h-4 w-4" /> Image</Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport('JSON')}><FileJson className="mr-2 h-4 w-4" /> JSON</Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport('Video')}><Film className="mr-2 h-4 w-4" /> Video</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
