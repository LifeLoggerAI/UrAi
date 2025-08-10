
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getDoc,
  doc,
} from 'firebase/firestore';
import type {
  Goal,
  Task,
  VoiceEvent,
  AuraState,
  MemoryBloom,
  Dream,
  InnerVoiceReflection,
  Person,
  User as AppUser,
} from '@/lib/types';

import { InteractiveAvatar } from './interactive-avatar';
import { RitualSuggestion } from './ritual-suggestion';
import { CompanionChatView } from './companion-chat-view';
import { DashboardView } from './dashboard-view';
import { SettingsForm } from './settings-form';
import { TorsoView } from './torso-view';
import { LegsView } from './legs-view';
import ArmsView from './arms-view';
import { GroundView } from './ground-view';
import { CognitiveZoneView } from './cognitive-zone-view';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  BrainCircuit,
  Cloud,
  Footprints,
  Hand,
  Mic,
  Settings,
  Spade,
  Sprout,
  User as UserIcon,
  Wand2,
} from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { suggestRitualAction } from '@/app/actions';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { SymbolicInsightsView } from './symbolic-insights-view';

type PanelType =
  | 'head'
  | 'torso'
  | 'legs'
  | 'arms'
  | 'ritual'
  | 'companion'
  | 'sky'
  | 'ground'
  | 'settings'
  | 'symbolic'
  | null;

export function HomeView() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // Data states
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [voiceEvents, setVoiceEvents] = useState<VoiceEvent[]>([]);
  const [auraState, setAuraState] = useState<AuraState | null>(null);
  const [memoryBlooms, setMemoryBlooms] = useState<MemoryBloom[] | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [innerTexts, setInnerTexts] = useState<InnerVoiceReflection[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

  // UI States
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [ritual, setRitual] = useState(null);
  const [isRitualLoading, setIsRitualLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Data fetching effects
  useEffect(() => {
    if (!user) return;

    setDataLoading(true);
    const unsubscribes: (() => void)[] = [];

    const setupSubscription = (
      path: string,
      setter: Function,
      options: {
        isSingleDoc?: boolean;
        limit?: number;
      } = {}
    ) => {
      if (options.isSingleDoc) {
        const docRef = doc(db, path);
        const unsubscribe = onSnapshot(docRef, docSnap => {
          setter(docSnap.exists() ? docSnap.data() : null);
        });
        unsubscribes.push(unsubscribe);
      } else {
        const collRef = collection(db, path);
        const q = query(
          collRef,
          where('uid', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(options.limit || 10)
        );
        const unsubscribe = onSnapshot(q, snapshot => {
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setter(items);
        });
        unsubscribes.push(unsubscribe);
      }
    };
    
    // User Profile
    setupSubscription(`users/${user.uid}`, setAppUser, { isSingleDoc: true });
    // Aura State
    setupSubscription(`users/${user.uid}/auraStates/current`, setAuraState, { isSingleDoc: true });
    // Memory Blooms
    setupSubscription(`users/${user.uid}/memoryBlooms`, setMemoryBlooms, { limit: 5 });

    // Other collections
    setupSubscription('goals', setGoals, { limit: 1 });
    setupSubscription('tasks', setTasks, { limit: 5 });
    setupSubscription('voiceEvents', setVoiceEvents);
    setupSubscription('dreamEvents', setDreams, { limit: 5 });
    setupSubscription('innerTexts', setInnerTexts, { limit: 5 });
    setupSubscription('people', setPeople);

    setDataLoading(false);

    return () => unsubscribes.forEach(unsub => unsub());
  }, [user]);

  const handleZoneClick = async (zone: string) => {
    if (isRitualLoading) return;
    setIsRitualLoading(true);

    try {
      const result = await suggestRitualAction({
        zone: zone,
        context: `User is feeling ${auraState?.currentEmotion || 'neutral'}`,
      });
      if (result.error || !result.suggestion) {
        throw new Error(result.error || 'Failed to get suggestion');
      }
      setRitual(result.suggestion);
      setActivePanel('ritual');
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Could not generate a ritual',
        description: (e as Error).message,
      });
    } finally {
      setIsRitualLoading(false);
    }
  };

  const handleBloomClick = (bloom: MemoryBloom) => {
    toast({
      title: bloom.emotion,
      description: bloom.description,
    });
  };

  const getPanelSize = () => {
    switch (activePanel) {
      case 'companion':
        return 'h-full md:h-[80vh] max-w-2xl';
      case 'head':
      case 'settings':
      case 'sky':
      case 'symbolic':
        return 'max-w-4xl';
      case 'torso':
      case 'legs':
      case 'arms':
      case 'ground':
        return 'max-w-xl h-full md:h-auto';
      default:
        return 'max-w-lg';
    }
  };

  const panelContent = {
    head: {
      title: 'Cognitive Zone',
      description: 'Dreams, thoughts, and your inner voice.',
      content: (
        <CognitiveZoneView
          dreams={dreams}
          innerTexts={innerTexts}
          personaProfile={appUser?.personaProfile}
        />
      ),
    },
    torso: {
      title: 'Core Self',
      description: 'Your goals, recent voice notes, and habits.',
      content: <TorsoView goals={goals} tasks={tasks} voiceEvents={voiceEvents} />,
    },
    legs: {
      title: 'Foundation & Movement',
      description: 'Your stability, direction, and interaction with the world.',
      content: <LegsView />,
    },
    arms: {
      title: 'Action & Connection',
      description: 'How you interact, connect, and follow through.',
      content: <ArmsView tasks={tasks} voiceEvents={voiceEvents} />,
    },
    sky: {
      title: 'Cognitive Mirror',
      description: "An overview of your mind's landscape.",
      content: <DashboardView />,
    },
    ground: {
      title: 'Inner Ground',
      description: 'Your recovery stories and emotional foundation.',
      content: <GroundView />,
    },
    symbolic: {
      title: 'Symbolic Insights',
      description: 'Advanced life pattern recognition',
      content: <SymbolicInsightsView />,
    },
  }[activePanel as string];

  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden flex flex-col items-center justify-center bg-background text-foreground transition-colors duration-1000">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center w-full">
          <InteractiveAvatar
            mood={auraState?.energy || 0}
            onZoneClick={handleZoneClick}
            isLoading={isRitualLoading}
            overlayColor={auraState?.overlayColor}
            overlayStyle={auraState?.overlayStyle}
          />
        </div>

        {/* Top-right controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setActivePanel('settings')}>
            <Settings />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setActivePanel('symbolic')}>
            <Sprout />
          </Button>
        </div>

        {/* Bottom-center controls */}
        <div className="absolute bottom-16 inset-x-0 flex justify-center z-10">
          <Button
            variant="secondary"
            size="lg"
            className="rounded-full px-6 py-6"
            onClick={() => setActivePanel('companion')}
          >
            <UserIcon className="h-6 w-6" />
          </Button>
        </div>

        {/* Overlay buttons for main interaction areas */}
        <div className="absolute top-1/4 w-full text-center z-10">
          <Button variant="ghost" className="text-muted-foreground" onClick={() => setActivePanel('sky')}>
            The Sky
          </Button>
        </div>
        <div className="absolute bottom-1/4 w-full text-center z-10">
          <Button variant="ghost" className="text-muted-foreground" onClick={() => setActivePanel('ground')}>
            The Ground
          </Button>
        </div>
        
        {/* Pulsing Orb for Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
          <div className="h-9 w-9 text-primary animate-pulse" />
        </div>

        {/* Memory Blooms */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-12 opacity-60 z-10">
          <TooltipProvider>
            {memoryBlooms?.map((bloom, i) => (
              <Tooltip key={bloom.bloomId}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleBloomClick(bloom)}
                    className="animate-fadeIn"
                    style={{ animationDelay: `${500 + i * 150}ms` }}
                  >
                    <Sprout className="h-5 w-5 hover:scale-125 transition-transform" style={{ color: bloom.bloomColor }} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{bloom.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>

        {/* Hint */}
        <div className="absolute bottom-8 text-center z-10 text-xs text-muted-foreground w-full max-w-md">
          <p>Tap your avatar to explore. The sky reflects your mood. Blooms are memory moments.</p>
        </div>
      </div>

      {/* Active Panel Dialog */}
      <AlertDialog open={!!activePanel} onOpenChange={(open) => !open && setActivePanel(null)}>
        <AlertDialogContent className={getPanelSize()}>
          {activePanel === 'companion' ? (
            <CompanionChatView />
          ) : activePanel === 'ritual' && ritual ? (
            <RitualSuggestion
              ritual={ritual}
              onAccept={() => {
                toast({ title: 'Ritual Accepted', description: 'May it bring you clarity.' });
                setActivePanel(null);
              }}
              onDecline={() => setActivePanel(null)}
            />
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  {activePanel === 'head' && <BrainCircuit className="text-primary h-5 w-5" />}
                  {activePanel === 'torso' && <Mic className="text-primary h-5 w-5" />}
                  {activePanel === 'legs' && <Footprints className="text-primary h-5 w-5" />}
                  {activePanel === 'arms' && <Hand className="text-primary h-5 w-5" />}
                  {activePanel === 'sky' && <Cloud className="text-primary h-5 w-5" />}
                  {activePanel === 'ground' && <Spade className="text-primary h-5 w-5" />}
                  {activePanel === 'symbolic' && <Sprout className="text-primary h-5 w-5" />}
                  {panelContent?.title}
                </AlertDialogTitle>
                {panelContent?.description && (
                  <AlertDialogDescription className="pt-2">
                    {panelContent.description}
                  </AlertDialogDescription>
                )}
              </AlertDialogHeader>

              {activePanel === 'settings' ? (
                <div className="max-h-[60vh] overflow-y-auto p-1 pr-4 -mr-4">
                  <SettingsForm />
                </div>
              ) : (
                panelContent?.content && <div className="py-4 my-2 text-sm rounded-md">{panelContent.content}</div>
              )}

              <AlertDialogFooter>
                {activePanel === 'settings' ? (
                  <AlertDialogCancel onClick={() => setActivePanel(null)}>Close</AlertDialogCancel>
                ) : (
                  <AlertDialogAction onClick={() => setActivePanel(null)}>Done</AlertDialogAction>
                )}
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
