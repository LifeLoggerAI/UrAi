
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import {
  Handshake,
  GitPullRequestArrow,
  Waypoints,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import type { Task, VoiceEvent } from '@/lib/types';

interface ArmsViewProps {
  tasks: Task[];
  voiceEvents: VoiceEvent[];
}

export default function ArmsView({ tasks, voiceEvents }: ArmsViewProps) {
  const { user } = useAuth();
  const [socialEngagement, setSocialEngagement] = useState<number>(0);
  const [collabMetric, setCollabMetric] = useState<number>(0);
  const [actionCompletionRate, setActionCompletionRate] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const calculateMetrics = () => {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task: Task) => task.isCompleted).length;
      setActionCompletionRate(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0);

      const totalVoiceEvents = voiceEvents.length;
      const socialVoiceEvents = voiceEvents.filter((event: VoiceEvent) => event.people && event.people.length > 0).length;
      setSocialEngagement(totalVoiceEvents > 0 ? (socialVoiceEvents / totalVoiceEvents) * 100 : 0);

      const collaborationVoiceEvents = voiceEvents.filter((event: VoiceEvent) => event.tasks && event.tasks.length > 0).length;
      setCollabMetric(totalVoiceEvents > 0 ? (collaborationVoiceEvents / totalVoiceEvents) * 100 : 0);
    };

    calculateMetrics();
  }, [user, tasks, voiceEvents]);

  const metrics = [
    {
      key: 'socialEngagement',
      icon: <Handshake className="h-8 w-8 text-primary" />,
      title: 'Social Engagement',
      description: 'Interactions & Connections',
      value: `${socialEngagement.toFixed(0)}%`,
    },
    {
      key: 'collabMetric',
      icon: <GitPullRequestArrow className="h-8 w-8 text-primary" />,
      title: 'Collaboration Metric',
      description: 'Teamwork & Contributions',
      value: `${collabMetric.toFixed(0)}%`,
    },
    {
      key: 'actionCompletionRate',
      icon: <Waypoints className="h-8 w-8 text-primary" />,
      title: 'Action Completion Rate',
      description: 'Tasks Followed Through',
      value: `${actionCompletionRate.toFixed(0)}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 p-4">
      {metrics.map((metric) => (
        <Card key={metric.key}>
            <CardHeader>
                <div className="flex items-center gap-3">
                    {metric.icon}
                    <div>
                        <h3 className="text-lg font-semibold">{metric.title}</h3>
                        <p className="text-muted-foreground text-sm">{metric.description}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <span className="text-3xl font-bold text-primary">{metric.value}</span>
            </CardContent>
        </Card>
      ))}
    </div>
  );
}
