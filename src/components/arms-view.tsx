
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import {
  Handshake,
  GitPullRequestArrow,
  Waypoints,
} from 'lucide-react';

interface ArmsViewProps {
  tasks: any[]; // Replace with actual Task type
  voiceEvents: any[]; // Replace with actual VoiceEvent type
}

export default function ArmsView({ tasks, voiceEvents }: ArmsViewProps) {
  const { user } = useAuth();
  const [socialEngagement, setSocialEngagement] = useState<number>(0);
  const [collabMetric, setCollabMetric] = useState<number>(0);
  const [actionCompletionRate, setActionCompletionRate] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    // Simulate data fetching and processing
    const calculateMetrics = () => {
      // Example calculations (replace with real logic)
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((task: any) => task.completed).length;
      setActionCompletionRate(totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0);

      const totalVoiceEvents = voiceEvents.length;
      const socialVoiceEvents = voiceEvents.filter((event: any) => event.people && event.people.length > 0).length;
      setSocialEngagement(totalVoiceEvents > 0 ? (socialVoiceEvents / totalVoiceEvents) * 100 : 0);

      const collaborationVoiceEvents = voiceEvents.filter((event: any) => event.context && event.context.includes('collaboration')).length;
      setCollabMetric(totalVoiceEvents > 0 ? (collaborationVoiceEvents / totalVoiceEvents) * 100 : 0);
    };

    calculateMetrics();

    // You might also subscribe to real-time updates for tasks and voiceEvents here if needed
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {metrics.map((metric) => (
        <div key={metric.key} className="bg-card p-6 rounded-lg shadow-md flex items-center justify-between col-span-1 md:col-span-2">
          <div className="flex items-center gap-3">
            {metric.icon}
            <div>
              <h3 className="text-lg font-semibold">{metric.title}</h3>
              <p className="text-muted-foreground">{metric.description}</p>
            </div>
          </div>
          <span className="text-3xl font-bold text-primary">{metric.value}</span>
        </div>
      ))}
    </div>
  );
}
