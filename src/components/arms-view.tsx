'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import {
  TrendingUp,
  Zap,
  Users,
  ListTodo,
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="bg-card p-6 rounded-lg shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Handshake className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Social Engagement</h3>
            <p className="text-muted-foreground">Interactions & Connections</p>
          </div>
        </div>
        <span className="text-3xl font-bold text-primary">{socialEngagement.toFixed(0)}%</span>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitPullRequestArrow className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Collaboration Metric</h3>
            <p className="text-muted-foreground">Teamwork & Contributions</p>
          </div>
        </div>
        <span className="text-3xl font-bold text-primary">{collabMetric.toFixed(0)}%</span>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md flex items-center justify-between col-span-1 md:col-span-2">
        <div className="flex items-center gap-3">
          <Waypoints className="h-8 w-8 text-primary" />
          <div>
            <h3 className="text-lg font-semibold">Action Completion Rate</h3>
            <p className="text-muted-foreground">Tasks Followed Through</p>
          </div>
        </div>
        <span className="text-3xl font-bold text-primary">{actionCompletionRate.toFixed(0)}%</span>
      </div>
    </div>
  );
}
