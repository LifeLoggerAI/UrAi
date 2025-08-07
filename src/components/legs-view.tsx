'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Map, TrendingUp, ShieldCheck, Cone, Forward } from 'lucide-react';

export function LegsView() {
  const panels = [
    {
      title: 'Movement History',
      icon: <Map className="h-6 w-6 text-primary" />,
      description: 'Review your recent paths and travel patterns.',
      content: (
        <p className="text-center text-muted-foreground mt-8">
          Movement History map coming soon.
        </p>
      ),
    },
    {
      title: 'Behavioral Trajectory',
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      description:
        'An AI-powered forecast of your upcoming movement tendencies.',
      content: (
        <p className="text-center text-muted-foreground mt-8">
          Trajectory forecast coming soon.
        </p>
      ),
    },
    {
      title: 'Stability Index',
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      description: "A measure of your routine's consistency and groundedness.",
      content: (
        <p className="text-center text-muted-foreground mt-8">
          Stability Index insights coming soon.
        </p>
      ),
    },
    {
      title: 'Avoidance Zones',
      icon: <Cone className="h-6 w-6 text-primary" />,
      description:
        'Highlights places, apps, or topics you may be subconsciously avoiding.',
      content: (
        <p className="text-center text-muted-foreground mt-8">
          Avoidance Zone analysis coming soon.
        </p>
      ),
    },
    {
      title: 'Momentum Score',
      icon: <Forward className="h-6 w-6 text-primary" />,
      description:
        'Measures the proactivity and forward-drive in your actions.',
      content: (
        <p className="text-center text-muted-foreground mt-8">
          Momentum Score coming soon.
        </p>
      ),
    },
  ];

  return (
    <ScrollArea className="h-[70vh] -mx-6">
      <div className="px-6 space-y-4">
        {panels.map((panel, index) => (
          <Card
            key={index}
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                {panel.icon}
                <div>
                  <CardTitle>{panel.title}</CardTitle>
                  <CardDescription>{panel.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-4 min-h-[10rem]">
              {panel.content}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
