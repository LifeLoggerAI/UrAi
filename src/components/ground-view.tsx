'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import {
  Sprout,
  BarChartHorizontal,
  HeartHandshake,
  ScrollText,
} from 'lucide-react';
import { RecoveryGallery } from './recovery-gallery';

export function GroundView() {
  const panels = [
    {
      title: 'Weekly Scrolls',
      icon: <ScrollText className="h-6 w-6 text-primary" />,
      description:
        'Review your AI-generated weekly summaries and recovery stories.',
      content: <RecoveryGallery />,
    },
    {
      title: 'Emotional Garden',
      icon: <Sprout className="h-6 w-6 text-primary" />,
      description:
        'A visualization of your emotional growth, with flowers for joys and tangled roots for challenges.',
      content: (
        <div className="text-center text-muted-foreground p-4">
          <Sprout className="mx-auto h-12 w-12 text-primary/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Feature Coming Soon
          </h3>
          <p className="mt-1 text-sm">
            Your Emotional Garden will grow here.
          </p>
        </div>
      ),
    },
    {
      title: 'Soil Health',
      icon: <BarChartHorizontal className="h-6 w-6 text-primary" />,
      description:
        'An index of your foundational stability, based on routine, rest, and self-care.',
      content: (
        <div className="text-center text-muted-foreground p-4">
          <BarChartHorizontal className="mx-auto h-12 w-12 text-primary/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Feature Coming Soon
          </h3>
          <p className="mt-1 text-sm">
            Analysis of your foundational stability will appear here.
          </p>
        </div>
      ),
    },
    {
      title: 'Recovery Roots',
      icon: <HeartHandshake className="h-6 w-6 text-primary" />,
      description:
        'A timeline of your significant recovery events and the insights gained from them.',
      content: (
        <div className="text-center text-muted-foreground p-4">
          <HeartHandshake className="mx-auto h-12 w-12 text-primary/50" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Feature Coming Soon
          </h3>
          <p className="mt-1 text-sm">
            Your recovery timeline will be visualized here.
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
