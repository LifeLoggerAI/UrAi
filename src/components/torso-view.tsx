
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { Flame, Activity, Repeat, HeartPulse, Scan } from "lucide-react";

export function TorsoView() {

    const panels = [
        {
            title: 'Inner Drive',
            icon: <Flame className="h-6 w-6 text-primary" />,
            description: "Motivation, goals, and your core values.",
            content: <p className="text-center text-muted-foreground mt-8">Inner Drive insights coming soon.</p>
        },
        {
            title: 'Rhythm Map',
            icon: <Activity className="h-6 w-6 text-primary" />,
            description: "Sleep cycles, energy levels, and daily rhythms.",
            content: <p className="text-center text-muted-foreground mt-8">Rhythm Map coming soon.</p>
        },
        {
            title: 'Habit Engine',
            icon: <Repeat className="h-6 w-6 text-primary" />,
            description: "Timeline of your recurring habits and loops.",
            content: <p className="text-center text-muted-foreground mt-8">Habit Engine coming soon.</p>
        },
        {
            title: 'Health Echo',
            icon: <HeartPulse className="h-6 w-6 text-primary" />,
            description: "Strain, recovery, and physical wellness signals.",
            content: <p className="text-center text-muted-foreground mt-8">Health Echo coming soon.</p>
        },
        {
            title: 'Body Memory',
            icon: <Scan className="h-6 w-6 text-primary" />,
            description: "Somatic traces and physical memory insights.",
            content: <p className="text-center text-muted-foreground mt-8">Body Memory insights coming soon.</p>
        }
    ];

    return (
        <Carousel className="w-full">
            <CarouselContent>
                {panels.map((panel, index) => (
                     <CarouselItem key={index}>
                        <div className="p-1">
                            <Card className="border-none shadow-none bg-transparent">
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        {panel.icon}
                                        <div>
                                            <CardTitle>{panel.title}</CardTitle>
                                            <CardDescription>{panel.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="h-[55vh] flex items-center justify-center p-4">
                                    {panel.content}
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}

    