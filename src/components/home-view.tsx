'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './auth-provider';
import { db, auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, onSnapshot, query, collection, where, orderBy, limit } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { InteractiveAvatar } from './interactive-avatar';
import { Skeleton } from './ui/skeleton';
import { Wand2, Cog, LogOut, BrainCircuit, Mic, Footprints, Hand, Cloud, Spade, BotMessageSquare, Users, Sprout } from 'lucide-react';

import HomeSidebar from './sidebar-home';
import TorsoView from './torso-view';
import { LegsView } from './legs-view';
import { GroundView } from './ground-view';
import { PassiveCameraCapture } from './passive-camera-capture';
import { SymbolicInsightsView } from './symbolic-insights-view';

import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { PersonCard } from './person-card';
import { CognitiveZoneView } from './cognitive-zone-view';
import { suggestRitualAction } from '@/app/actions';
import { CompanionChatView } from './companion-chat-view';
import { SettingsForm } from './settings-form';
import ArmsView from './arms-view';

import type {
  Person, AuraState, MemoryBloom, Dream, VoiceEvent, InnerVoiceReflection,
  Goal, Task, User, PersonaProfile
} from '@/lib/types';

type ActivePanel =
  | 'ritual' | 'bloom' | 'settings' | 'head' | 'torso' | 'legs'
  | 'arms' | 'companion' | 'person' | 'sky' | 'ground' | 'symbolic' | null;

export function HomeView() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [people, setPeople] = useState<Person[]>();
  const [auraState, setAuraState] = useState<AuraState | null>();
  const [memoryBlooms, setMemoryBlooms] = useState<MemoryBloom[]>();
  const [dreams, setDreams] = useState<Dream[]>();
  const [voiceEvents, setVoiceEvents] = useState<VoiceEvent[]>();
  const [innerTexts, setInnerTexts] = useState<InnerVoiceReflection[]>();
  const [goals, setGoals] = useState<Goal[]>();
  const [tasks, setTasks] = useState<Task[]>();
  const [personaProfile, setPersonaProfile] = useState<PersonaProfile>();

  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [isRitualLoading, setIsRitualLoading] = useState(false);
  const [panelContent, setPanelContent] = useState<{
    title: string; description: string; content?: React.ReactNode
  } | null>(null);

  const overallMood = voiceEvents?.[0]?.sentimentScore ?? dreams?.[0]?.sentimentScore ?? 0;

  const moodDescription = () => {
    if (auraState?.currentEmotion) return `Currently feeling ${auraState.currentEmotion}.`;
    if (overallMood > 0.5) return 'Feeling bright and optimistic.';
    if (overallMood > 0.1) return 'A sense of calm and positivity.';
    if (overallMood < -0.5) return 'Reflecting on some challenges.';
    if (overallMood < -0.1) return 'A quiet, contemplative mood.';
    return 'A balanced and neutral state.';
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast({ title: 'Signed Out', description: 'You have been signed out.' });
      router.push('/login');
    } catch {
      toast({ variant: 'destructive', title: 'Sign Out Failed', description: 'Try again later.' });
    }
  };

  const handleZoneClick = async (zone: ActivePanel | 'aura') => {
    if (isRitualLoading || !user) return;

    if (zone === 'aura') {
      setIsRitualLoading(true);
      try {
        const result = await suggestRitualAction({ zone: 'aura', context: `Mood: ${moodDescription()}` });
        if (result?.suggestion) {
          setPanelContent({
            title: result.suggestion.title,
            description: result.suggestion.description,
            content: <p className="text-foreground">{result.suggestion.suggestion}</p>
          });
          setActivePanel('ritual');
        }
      } catch (err) {
        toast({ variant: 'destructive', title: 'Ritual Failed', description: (err as Error).message });
      } finally {
        setIsRitualLoading(false);
      }
      return;
    }

    const panelMap: Record<string, () => void> = {
      head: () => setPanelContent({
        title: 'Cognitive Zone',
        description: 'Control room for introspection and dream reflection.',
        content: <CognitiveZoneView dreams={dreams || []} innerTexts={innerTexts || []} personaProfile={personaProfile} />
      }),
      torso: () => setPanelContent({
        title: 'Core-Self View',
        description: 'Drives, rhythms, and emotional memory.',
        content: <TorsoView goals={goals || []} tasks={tasks || []} voiceEvents={voiceEvents || []} />
      }),
      legs: () => setPanelContent({
        title: 'Movement & Direction',
        description: 'Physical and symbolic forward motion.',
        content: <LegsView />
      }),
      arms: () => setPanelContent({
        title: 'Action & Connection',
        description: 'Patterns of action, effort, and social reach.',
        content: <ArmsView tasks={tasks || []} voiceEvents={voiceEvents || []} />
      }),
      sky: () => setPanelContent({
        title: 'Sky View',
        description: 'Emotional weather, forecasts, and celestial influence.',
        content: <p className="text-center text-muted-foreground mt-8">Sky animation coming soon...</p>
      }),
      ground: () => setPanelContent({
        title: 'Ground View',
        description: 'Your emotional soil, roots, and recovery moments.',
        content: <GroundView />
      })
    };

    if (zone && panelMap[zone]) {
      panelMap[zone]();
      setActivePanel(zone);
    }
  };

  const handleBloomClick = (bloom: MemoryBloom) => {
    setPanelContent({
      title: `A Memory of ${bloom.emotion}`,
      description: `Bloomed on ${new Date(bloom.triggeredAt).toLocaleDateString()}`,
      content: <p style={{ color: bloom.bloomColor }}>{bloom.description}</p>
    });
    setActivePanel('bloom');
  };

  const handlePersonClick = (person: Person) => {
    setPanelContent({
      title: person.name,
      description: `Your connection with ${person.name}`,
      content: <PersonCard person={person} />
    });
    setActivePanel('person');
  };

  const handleCompanionOrbClick = () => setActivePanel('companion');

  const getPanelSize = () => {
    switch (activePanel) {
      case 'settings': return 'max-w-3xl';
      case 'head':
      case 'torso':
      case 'arms': return 'max-w-6xl';
      case 'legs': return 'max-w-3xl';
      case 'sky':
      case 'ground': return 'max-w-4xl';
      case 'companion': return 'max-w-2xl h-[80vh] flex flex-col';
      case 'symbolic': return 'max-w-7xl';
      default: return 'max-w-lg';
    }
  };

  const getSkyStyle = () => {
    const hue = (overallMood + 1) * 60;
    const lightness = 70 + Math.abs(overallMood) * 25;
    return {
      background: `radial-gradient(ellipse at top, hsl(${hue}, 80%, ${lightness}%), hsl(var(--background)))`,
      opacity: 0.15,
    };
  };

  useEffect(() => {
    if (!user) return;
    const unsub: (() => void)[] = [];

    unsub.push(onSnapshot(query(collection(db, 'people'), where('uid', '==', user.uid), orderBy('lastSeen', 'desc'), limit(5)), snap => setPeople(snap.docs.map(d => d.data() as Person))));
    unsub.push(onSnapshot(doc(db, `users/${user.uid}/auraStates/current`), snap => setAuraState(snap.exists() ? snap.data() as AuraState : null)));
    unsub.push(onSnapshot(query(collection(db, 'users', user.uid, 'memoryBlooms'), orderBy('triggeredAt', 'desc'), limit(10)), snap => setMemoryBlooms(snap.docs.map(d => d.data() as MemoryBloom))));
    unsub.push(onSnapshot(query(collection(db, 'dreamEvents'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'), limit(10)), snap => setDreams(snap.docs.map(d => d.data() as Dream))));
    unsub.push(onSnapshot(query(collection(db, 'voiceEvents'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'), limit(10)), snap => setVoiceEvents(snap.docs.map(d => d.data() as VoiceEvent))));
    unsub.push(onSnapshot(query(collection(db, 'innerTexts'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'), limit(10)), snap => setInnerTexts(snap.docs.map(d => d.data() as InnerVoiceReflection))));
    unsub.push(onSnapshot(query(collection(db, 'goals'), where('uid', '==', user.uid), orderBy('createdAt', 'desc')), snap => setGoals(snap.docs.map(d => d.data() as Goal))));
    unsub.push(onSnapshot(query(collection(db, 'tasks'), where('uid', '==', user.uid), orderBy('dueDate', 'asc')), snap => setTasks(snap.docs.map(d => d.data() as Task))));
    unsub.push(onSnapshot(doc(db, 'users', user.uid), snap => snap.exists() && setPersonaProfile((snap.data() as User).personaProfile)));

    return () => unsub.forEach(u => u());
  }, [user]);

  return (
    <>
      <PassiveCameraCapture />

      <div className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden text-center">
        {/* Animated sky background */}
        <div style={getSkyStyle()} className="absolute inset-0 z-0 transition-all duration-1000" />

        {/* Clickable Sky & Ground zones */}
        <div className="absolute top-0 left-0 right-0 h-1/3 cursor-pointer z-10" onClick={() => handleZoneClick('sky')} />
        <div className="absolute bottom-0 left-0 right-0 h-1/4 cursor-pointer z-10" onClick={() => handleZoneClick('ground')} />

        {/* Top-right menu: Settings, Symbolic, SignOut */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setActivePanel('symbolic')}>
                  <Wand2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Symbolic Insights</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setActivePanel('settings')}>
                  <Cog className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign Out</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Mood Display */}
        <div className="relative z-10 w-full max-w-4xl animate-fadeIn">
          {voiceEvents === undefined || dreams === undefined ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">Today’s Emotional Outlook</h1>
              <p className="text-muted-foreground mt-2 mb-8">{moodDescription()}</p>
            </>
          )}
        </div>

        {/* People Silhouettes */}
        <TooltipProvider>
          <div className="absolute inset-x-0 top-10 flex justify-center gap-8 opacity-50 z-10">
            {people?.map((person, i) => (
              <Tooltip key={person.id}>
                <TooltipTrigger asChild>
                  <button onClick={() => handlePersonClick(person)} className="flex flex-col items-center cursor-pointer animate-fadeIn" style={{ animationDelay: `${i * 100}ms` }}>
                    <Users className="h-6 w-6" />
                    <span className="text-xs mt-1">{person.name}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Social Silhouette: {person.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Avatar */}
        <div className="relative z-10 w-full max-w-lg mt-4">
          {auraState === undefined ? (
            <Skeleton className="w-full h-full rounded-lg" />
          ) : (
            <InteractiveAvatar
              mood={overallMood}
              onZoneClick={handleZoneClick}
              isLoading={isRitualLoading}
              overlayColor={auraState?.overlayColor}
              overlayStyle={auraState?.overlayStyle}
            />
          )}
        </div>

        {/* Companion Orb */}
        <div
          onClick={handleCompanionOrbClick}
          className="relative z-20 mt-8 h-20 w-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center cursor-pointer hover:scale-110"
          style={{
            boxShadow: auraState?.overlayColor
              ? `0 0 20px 5px ${auraState.overlayColor}`
              : `0 0 20px 5px hsla(${overallMood * 60 + 60}, 100%, 70%, 0.5)`
          }}
        >
          <BotMessageSquare className="h-9 w-9 text-primary animate-pulse" />
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
          ) : (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  {activePanel === 'ritual' && <Wand2 className="text-primary h-5 w-5" />}
                  {activePanel === 'head' && <BrainCircuit className="text-primary h-5 w-5" />}
                  {activePanel === 'torso' && <Mic className="text-primary h-5 w-5" />}
                  {activePanel === 'legs' && <Footprints className="text-primary h-5 w-5" />}
                  {activePanel === 'arms' && <Hand className="text-primary h-5 w-5" />}
                  {activePanel === 'sky' && <Cloud className="text-primary h-5 w-5" />}
                  {activePanel === 'ground' && <Spade className="text-primary h-5 w-5" />}
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

      {/* Full-screen Symbolic Insights View */}
      {activePanel === 'symbolic' && (
        <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
          <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Symbolic Life Tracking</h1>
                <p className="text-muted-foreground">Advanced pattern recognition and mythic storytelling</p>
              </div>
              <Button variant="outline" onClick={() => setActivePanel(null)}>
                Close
              </Button>
            </div>
            <SymbolicInsightsView />
          </div>
        </div>
      )}
    </>
  );
}
