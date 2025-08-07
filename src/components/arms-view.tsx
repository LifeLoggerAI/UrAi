'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { ScrollArea } from "./ui/scroll-area";
import { ListTodo, Handshake, Scale, GitPullRequestArrow, Waypoints } from "lucide-react";
import { ActionExecutionView } from "./action-execution-view";
import type { Task, VoiceEvent } from "@/lib/types";

interface ArmsViewProps {
  tasks: Task[];
  voiceEvents: VoiceEvent[];
}

export function ArmsView({ tasks, voiceEvents }: ArmsViewProps) {
  const panels = [
    {
      title: 'Action Execution',
      icon: <ListTodo className="h-6 w-6 text-primary" />,
      description: "Follow-through on tasks and intentions.",
      content: (
        <ScrollArea className="h-[55vh] -mr-4 pr-4">
          <ActionExecutionView tasks={tasks} voiceEvents={voiceEvents} />
        </ScrollArea>
      )
    },
    {
      title: 'Relational Gesture Map',
      icon: <Handshake className="h-6 w-6 text-primary" />,
      description: "Patterns of reaching out, supporting, and withdrawing.",
      content: <p className="text-center text-muted-foreground mt-8">Gesture Map coming soon.</p>
    },
    {
      title: 'Effort Allocation',
      icon: <Scale className="h-6 w-6 text-primary" />,
      description: "Balance of emotional and practical effort.",
      content: <p className="text-center text-muted-foreground mt-8">Effort Allocation analysis coming soon.</p>
    },
    {
      title: 'Help vs. Handoff',
      icon: <GitPullRequestArrow className="h-6 w-6 text-primary" />,
      description: "Analysis of delegation and support requests.",
      content: <p className="text-center text-muted-foreground mt-8">Delegation Index coming soon.</p>
    },
    {
      title: 'Connection Echoes',
      icon: <Waypoints className="h-6 w-6 text-primary" />,
      description: "The emotional impact of your interactions.",
      content: <p className="text-center text-muted-foreground mt-8">Connection Echo scores coming soon.</p>
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
