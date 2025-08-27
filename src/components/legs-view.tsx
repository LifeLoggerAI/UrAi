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
        <div className="text-center text-muted-foreground p-4">
          <Map className="mx-auto h-12 w-12 text-primary/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Feature Coming Soon
          </h3>
          <p className="mt-1 text-sm">
            Your movement map will be displayed here.
          </p>
        </div>
      ),
    },
    {
      title: 'Behavioral Trajectory',
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      description:
        'An AI-powered forecast of your upcoming movement tendencies.',
      content: (
        <div className="text-center text-muted-foreground p-4">
          <TrendingUp className="mx-auto h-12 w-12 text-primary/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Feature Coming Soon
          </h3>
          <p className="mt-1 text-sm">
            Future movement predictions will be shown here.
          </p>
        </div>
      ),
    },
    {
      title: 'Stability Index',
      icon: <ShieldCheck className="h-6 w-6 text-primary" />,
      description: "A measure of your routine's consistency and groundedness.",
      content: (
        <div className="text-center text-muted-foreground p-4">
          <ShieldCheck className="mx-auto h-12 w-12 text-primary/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Feature Coming Soon
          </h3>
          <p className="mt-1 text-sm">
            Your routine stability score will appear here.
          </p>
        </div>
      ),
    },
    {
      title: 'Avoidance Zones',
      icon: <Cone className="h-6 w-6 text-primary" />,
      description:
        'Highlights places, apps, or topics you may be subconsciously avoiding.',
      content: (
        <div className="text-center text-muted-foreground p-4">
          <Cone className="mx-auto h-12 w-12 text-primary/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Feature Coming Soon
          </h3>
          <p className="mt-1 text-sm">
            AI-detected avoidance patterns will be surfaced here.
          </p>
        </div>
      ),
    },
    {
      title: 'Momentum Score',
      icon: <Forward className="h-6 w-6 text-primary" />,
      description:
        'Measures the proactivity and forward-drive in your actions.',
      content: (
        <div className="text-center text-muted-foreground p-4">
          <Forward className="mx-auto h-12 w-12 text-primary/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Feature Coming Soon
          </h3>
          <p className="mt-1 text-sm">
            Your forward momentum score will be calculated here.
          </p>
        </div>
      ),
    },
  ];

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] -mx-6">
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
