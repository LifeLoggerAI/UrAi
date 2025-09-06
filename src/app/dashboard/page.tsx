'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { collection, query, where, onSnapshot, orderBy, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SideNav } from '@/components/side-nav';
import { DashboardView } from '@/components/dashboard-view';
import { CognitiveZoneView } from '@/components/cognitive-zone-view';
import { TorsoView } from '@/components/torso-view';
import ArmsView from '@/components/arms-view';
import { LegsView } from '@/components/legs-view';
import { GroundView } from '@/components/ground-view';
import { SettingsForm } from '@/components/settings-form';
import { SymbolicInsightsView } from '@/components/symbolic-insights-view';
import { CompanionChatView } from '@/components/companion-chat-view';
import { SkyView } from '@/components/sky-view';
import { ActionExecutionView } from '@/components/action-execution-view';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { suggestRitual } from '@/app/actions';
import type {
  Dream,
  InnerVoiceReflection,
  PersonaProfile,
  Goal,
  Task,
  VoiceEvent,
  WeeklyScroll,
  SuggestRitualOutput,
} from '@/lib/types';
import { getDashboardData } from '@/lib/data-access';
import type { DashboardData } from '@/lib/types';

type Panel =
  | 'sky'
  | 'dashboard'
  | 'head'
  | 'torso'
  | 'arms'
  | 'legs'
  | 'ground'
  | 'symbolic'
  | 'companion'
  | 'action-execution'
  | 'settings';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<Panel>('sky');
  const [loading, setLoading] = useState(true);

  // Data states
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [innerTexts, setInnerTexts] = useState<InnerVoiceReflection[]>([]);
  const [personaProfile, setPersonaProfile] = useState<PersonaProfile | undefined>(undefined);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [voiceEvents, setVoiceEvents] = useState<VoiceEvent[]>([]);
  const [weeklyScrolls, setWeeklyScrolls] = useState<WeeklyScroll[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const [ritualSuggestion, setRitualSuggestion] = useState<SuggestRitualOutput | null>(null);
  const [isRitualDialogOpen, setIsRitualDialogOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    
    getDashboardData(user.uid).then(data => {
        setDashboardData(data);
    });

    const unsubscribers: (() => void)[] = [];
    const collectionsToFetch = [
      { name: 'dreamEvents', setter: setDreams, orderByField: 'createdAt' },
      { name: 'innerTexts', setter: setInnerTexts, orderByField: 'createdAt' },
      { name: 'goals', setter: setGoals, orderByField: 'createdAt' },
      { name: 'tasks', setter: setTasks, orderByField: 'createdAt' },
      { name: 'voiceEvents', setter: setVoiceEvents, orderByField: 'createdAt' },
      { name: 'weeklyScrolls', setter: setWeeklyScrolls, orderByField: 'weekStart' },
    ];

    collectionsToFetch.forEach(({ name, setter, orderByField }) => {
      const q = query(
        collection(db, name),
        where('uid', '==', user.uid),
        orderBy(orderByField, 'desc')
      );
      const unsubscribe = onSnapshot(q, snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setter(data as any);
      });
      unsubscribers.push(unsubscribe);
    });

    const unsubPersona = onSnapshot(doc(db, 'personaProfiles', user.uid), doc => {
        if(doc.exists()) {
            setPersonaProfile(doc.data() as PersonaProfile);
        }
    });
    unsubscribers.push(unsubPersona);

    setLoading(false);
    return () => unsubscribers.forEach(unsub => unsub());
  }, [user, authLoading, router]);

  const handleSuggestRitual = async () => {
    if (!user) return;
    const result = await suggestRitual({ uid: user.uid, context: 'User requested a ritual from the dashboard.' });
    if (result.success) {
      setRitualSuggestion(result.data);
      setIsRitualDialogOpen(true);
    }
  };

  const renderActivePanel = () => {
    if (loading) {
        return <Skeleton className="h-full w-full" />
    }
    switch (activePanel) {
      case 'sky':
        return <SkyView voiceEvents={voiceEvents} innerTexts={innerTexts} />;
      case 'dashboard':
        return <DashboardView data={dashboardData} />;
      case 'head':
        return <CognitiveZoneView dreams={dreams} innerTexts={innerTexts} personaProfile={personaProfile} />;
      case 'torso':
        return <TorsoView goals={goals} tasks={tasks} voiceEvents={voiceEvents} />;
      case 'arms':
        return <ArmsView tasks={tasks} voiceEvents={voiceEvents} />;
      case 'legs':
        return <LegsView />;
      case 'ground':
        return <GroundView />;
      case 'symbolic':
        return <SymbolicInsightsView />;
      case 'companion':
        return <CompanionChatView />;
      case 'action-execution':
        return <ActionExecutionView tasks={tasks} voiceEvents={voiceEvents} />;
      case 'settings':
        return <SettingsForm />;
      default:
        return <DashboardView data={dashboardData} />;
    }
  };

  if (authLoading || !user) {
    return <div className="flex h-screen w-full items-center justify-center bg-background"><Skeleton className="h-full w-full" /></div>;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <SideNav onNavClick={panel => setActivePanel(panel as Panel)} />
      <main className="flex-1 p-6 relative overflow-y-auto">
        {renderActivePanel()}
        <div className="absolute bottom-6 right-6 z-50">
            <Button onClick={handleSuggestRitual}>
                <Wand2 className="mr-2 h-4 w-4" />
                Suggest a Ritual
            </Button>
        </div>
      </main>
      <AlertDialog open={isRitualDialogOpen} onOpenChange={setIsRitualDialogOpen}>
        <AlertDialogContent>
           {ritualSuggestion && (
            <>
            <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                    <Wand2 className="text-primary h-6 w-6" /> A Ritual is Suggested
                </AlertDialogTitle>
                <AlertDialogDescription className="pt-4">
                    <h3 className="font-bold text-lg text-foreground pb-2">{ritualSuggestion.title}</h3>
                    <p className="text-foreground/80">{ritualSuggestion.description}</p>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="p-6 pt-0 text-center">
                <p className="text-muted-foreground">{ritualSuggestion.suggestion}</p>
            </div>
            </>
           )}
            <AlertDialogFooter>
                <AlertDialogAction onClick={() => setIsRitualDialogOpen(false)}>Close</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
