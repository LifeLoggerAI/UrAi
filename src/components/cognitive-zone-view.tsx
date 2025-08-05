'use client';

import { Dream, InnerVoiceReflection, PersonaProfile } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { DashboardView } from './dashboard-view';
import { DreamForm } from './dream-form';
import { DreamList } from './dream-list';
import { TextEntryForm } from './text-entry-form';
import { TextEntryList } from './text-entry-list';
import { ScrollArea } from './ui/scroll-area';
import { BrainCircuit, NotebookPen, PenLine, User } from 'lucide-react';
import { PersonaView } from './persona-view';

interface CognitiveZoneViewProps {
  dreams: Dream[];
  innerTexts: InnerVoiceReflection[];
  personaProfile?: PersonaProfile;
}

export function CognitiveZoneView({
  dreams,
  innerTexts,
  personaProfile,
}: CognitiveZoneViewProps) {
  const panels = [
    {
      title: 'Cognitive Mirror',
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      description:
        'An AI-generated overview of your recent mental and emotional state.',
      content: <DashboardView />,
    },
    {
      title: 'Dream Fusion',
      icon: <NotebookPen className="h-6 w-6 text-primary" />,
      description: 'Log and analyze your dreams to uncover symbolic patterns.',
      content: (
        <div className="flex flex-col gap-4 h-full">
          <DreamForm />
          <ScrollArea className="h-[40vh]">
            <DreamList dreams={dreams} />
          </ScrollArea>
        </div>
      ),
    },
    {
      title: 'Inner Voice',
      icon: <PenLine className="h-6 w-6 text-primary" />,
      description:
        'Capture and reflect on your fleeting thoughts and feelings.',
      content: (
        <div className="flex flex-col gap-4 h-full">
          <TextEntryForm />
          <ScrollArea className="h-[40vh]">
            <TextEntryList entries={innerTexts} />
          </ScrollArea>
        </div>
      ),
    },
    {
      title: 'Persona & Traits',
      icon: <User className="h-6 w-6 text-primary" />,
      description: 'Understand your core personality traits and archetypes.',
      content: (
        <ScrollArea className="h-[60vh] -mr-4 pr-4">
          <PersonaView profile={personaProfile} />
        </ScrollArea>
      ),
    },
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
                <CardContent className="h-[65vh] overflow-y-auto p-4">
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
