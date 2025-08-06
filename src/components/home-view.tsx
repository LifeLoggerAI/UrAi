'use client';

import { useEffect, useState } from 'react';
import type {
  Person,
  AuraState,
  MemoryBloom,
  Dream,
  VoiceEvent,
  InnerVoiceReflection,
  Goal,
  Task,
  User,
  PersonaProfile,
} from '@/lib/types';
import { suggestRitualAction } from '@/app/actions';
import { useAuth } from './auth-provider';
import { Skeleton } from './ui/skeleton';
import {
  BotMessageSquare,
  Users,
  Sprout,
  Wand2,
  Cog,
  LogOut,
  BrainCircuit,
  Mic,
  Footprints,
  Hand,
  Cloud,
  Spade,
} from 'lucide-react';
import { InteractiveAvatar } from './interactive-avatar';
import { useToast } from '@/hooks/use-toast';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { SettingsForm } from './settings-form';
import { CompanionChatView } from './companion-chat-view';
import { PersonCard } from './person-card';
import { CognitiveZoneView } from './cognitive-zone-view';
import { TorsoView } from './torso-view';
import { LegsView } from './legs-view';
import { ArmsView } from './arms-view';
import { GroundView } from './ground-view';
import { PassiveCameraCapture } from './passive-camera-capture';

type ActivePanel =
  | 'ritual'
  | 'bloom'
  | 'settings'
  | 'head'
  | 'torso'
  | 'legs'
  | 'arms'
  | 'companion'
  | 'person'
  | 'sky'
  | 'ground'
  | null;

export function HomeView() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Data states
  const [people, setPeople] = useState<Person[] | undefined>(undefined);
  const [auraState, setAuraState] = useState<AuraState | null | undefined>(undefined);
  const [memoryBlooms, setMemoryBlooms] = useState<MemoryBloom[] | undefined>(undefined);
  const [dreams, setDreams] = useState<Dream[] | undefined>(undefined);
  const [voiceEvents, setVoiceEvents] = useState<VoiceEvent[] | undefined>(undefined);
  const [innerTexts, setInnerTexts] = useState<InnerVoiceReflection[] | undefined>(undefined);
  const [goals, setGoals] = useState<Goal[] | undefined>(undefined);
  const [tasks, setTasks] = useState<Task[] | undefined>(undefined);
  const [personaProfile, setPersonaProfile] = useState<PersonaProfile | undefined>(undefined);

  const [isRitualLoading, setIsRitualLoading] = useState(false);

  // UI states
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [panelContent, setPanelContent] = useState<{ title: string; description: string; content?: React.ReactNode } | null>(null);

  const overallMood = voiceEvents?.[0]?.sentimentScore ?? dreams?.[0]?.sentimentScore ?? 0;

  // --- Sign Out ---
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
      router.push('/login');
    } catch {
      toast({
        variant: 'destructive',
        title: 'Sign Out Failed',
        description: 'An error occurred while signing out. Please try again.',
      });
    }
  };

  // --- Mood Description ---
  const moodDescription = () => {
    if (auraState?.currentEmotion) return `Currently feeling ${auraState.currentEmotion}.`;
    if (overallMood > 0.5) return 'Feeling bright and optimistic.';
    if (overallMood > 0.1) return 'A sense of calm and positivity.';
    if (overallMood < -0.5) return 'Reflecting on some challenges.';
    if (overallMood < -0.1) return 'A quiet, contemplative mood.';
    return 'A balanced and neutral state.';
  };

  // --- Zone Click ---
  const handleZoneClick = async (zone: 'head' | 'torso' | 'legs' | 'arms' | 'aura' | 'sky' | 'ground') => {
    if (isRitualLoading || !user) return;

    switch (zone) {
      case 'head':
        setPanelContent({
          title: 'Cognitive Zone',
          description: 'A symbolic control room for introspection and analysis.',
          content: <CognitiveZoneView dreams={dreams || []} innerTexts={innerTexts || []} personaProfile={personaProfile} />
        });
        setActivePanel('head');
        return;

      case 'torso':
        setPanelContent({
          title: 'Core-Self View',
          description: 'Explore your inner drive, rhythms, and somatic memories.',
          content: <TorsoView goals={goals || []} tasks={tasks || []} voiceEvents={voiceEvents || []} />
        });
        setActivePanel('torso');
        return;

      case 'legs':
        setPanelContent({
          title: 'Movement & Direction',
          description: 'Explore your physical path, stability, and forward momentum.',
          content: <LegsView />
        });
        setActivePanel('legs');
        return;

      case 'arms':
        setPanelContent({
          title: 'Action & Connection',
          description: 'Explore your patterns of action, effort, and social connection.',
          content: <ArmsView tasks={tasks || []} voiceEvents={voiceEvents || []} />
        });
        setActivePanel('arms');
        return;

      case 'sky':
        setPanelContent({
          title: 'Sky View',
          description: 'Explore the weather, time of day, and celestial patterns influencing your mood.',
          content: <p className="text-center text-muted-foreground mt-8">Sky view with weather animations and constellation overlays coming soon.</p>
        });
        setActivePanel('sky');
        return;

      case 'ground':
        setPanelContent({
          title: 'Ground View',
          description: 'Your emotional garden: soil health, recovery events, and roots of memory.',
          content: <GroundView />
        });
        setActivePanel('ground');
        return;

      case 'aura':
        setIsRitualLoading(true);
        try {
          const result = await suggestRitualAction({ zone, context: `Overall mood is ${moodDescription()}.` });
          if (result.error) throw new Error(result.error);
          if (result.suggestion) {
            setPanelContent({
              title: result.suggestion.title,
              description: result.suggestion.description,
              content: <p className="text-foreground">{result.suggestion.suggestion}</p>
            });
            setActivePanel('ritual');
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Suggestion Failed',
            description: (error as Error).message
          });
        } finally {
          setIsRitualLoading(false);
        }
        return;
    }
  };

  // --- Bloom Click ---
  const handleBloomClick = (bloom: MemoryBloom) => {
    setPanelContent({
      title: `A Memory of ${bloom.emotion}`,
      description: `This memory bloomed on ${new Date(bloom.triggeredAt).toLocaleDateString()}. ${bloom.trigger ? `Triggered by: ${bloom.trigger}` : ''}`,
      content: <p className="text-lg" style={{ color: bloom.bloomColor }}>{bloom.description}</p>
    });
    setActivePanel('bloom');
  };

  // --- Person Click ---
  const handlePersonClick = (person: Person) => {
    setPanelContent({
      title: person.name,
      description: `A summary of your relationship with ${person.name}.`,
      content: <PersonCard person={person} />
    });
    setActivePanel('person');
  };

  // --- Companion Click ---
  const handleCompanionOrbClick = () => {
    setActivePanel('companion');
  };

  // --- Panel Size ---
  const getPanelSize = () => {
    switch (activePanel) {
      case 'settings': return 'max-w-3xl';
      case 'head': return 'max-w-6xl';
      case 'torso': return 'max-w-6xl';
      case 'legs': return 'max-w-3xl';
      case 'arms': return 'max-w-6xl';
      case 'sky': return 'max-w-4xl';
      case 'ground': return 'max-w-4xl';
      case 'companion': return 'max-w-2xl h-[80vh] flex flex-col';
      default: return 'max-w-lg';
    }
  };

  // --- Sky Style ---
  const getSkyStyle = () => {
    const hue = (overallMood + 1) * 60;
    const lightness = 70 + Math.abs(overallMood) * 25;
    return {
      background: `radial-gradient(ellipse at top, hsl(${hue}, 80%, ${lightness}%), hsl(var(--background)))`,
      opacity: 0.15,
    };
  };

  // --- Firestore subscriptions ---
  useEffect(() => {
    if (!user) return;
    const unsubscribes: (() => void)[] = [];

    const qPeople = query(collection(db, 'people'), where('uid', '==', user.uid), orderBy('lastSeen', 'desc'), limit(5));
    unsubscribes.push(onSnapshot(qPeople, snap => setPeople(snap.docs.map(doc => doc.data() as Person))));

    const auraRef = doc(db, `users/${user.uid}/auraStates/current`);
    unsubscribes.push(onSnapshot(auraRef, docSnap => setAuraState(docSnap.exists() ? (docSnap.data() as AuraState) : null)));

    const qBlooms = query(collection(db, 'users', user.uid, 'memoryBlooms'), orderBy('triggeredAt', 'desc'), limit(10));
    unsubscribes.push(onSnapshot(qBlooms, snap => setMemoryBlooms(snap.docs.map(doc => doc.data() as MemoryBloom).sort((a, b) => a.triggeredAt - b.triggeredAt))));

    const qDreams = query(collection(db, 'dreamEvents'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'), limit(10));
    unsubscribes.push(onSnapshot(qDreams, snap => setDreams(snap.docs.map(d => d.data() as Dream))));

    const qVoice = query(collection(db, 'voiceEvents'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'), limit(10));
    unsubscribes.push(onSnapshot(qVoice, snap => setVoiceEvents(snap.docs.map(d => d.data() as VoiceEvent))));

    const qInner = query(collection(db, 'innerTexts'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'), limit(10));
    unsubscribes.push(onSnapshot(qInner, snap => setInnerTexts(snap.docs.map(d => d.data() as InnerVoiceReflection))));

    const qGoals = query(collection(db, 'goals'), where('uid', '==', user.uid), orderBy('createdAt', 'desc'));
    unsubscribes.push(onSnapshot(qGoals, snap => setGoals(snap.docs.map(doc => doc.data() as Goal))));

    const qTasks = query(collection(db, 'tasks'), where('uid', '==', user.uid), orderBy('dueDate', 'asc'));
    unsubscribes.push(onSnapshot(qTasks, snap => setTasks(snap.docs.map(doc => doc.data() as Task))));

    const userRef = doc(db, 'users', user.uid);
    unsubscribes.push(onSnapshot(userRef, snap => {
      if (snap.exists()) {
        const userData = snap.data() as User;
        setPersonaProfile(userData.personaProfile);
      }
    }));

    return () => unsubscribes.forEach(unsub => unsub());
  }, [user]);

  return (
    <>
      <PassiveCameraCapture />
      {/* Sky background */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden text-center">
        <div style={getSkyStyle()} className="absolute inset-0 z-0 transition-all duration-1000" />

        {/* Click zones */}
        <div className="absolute top-0 left-0 right-0 h-1/3 cursor-pointer z-10" onClick={() => handleZoneClick('sky')} />
        <div className="absolute bottom-0 left-0 right-0 h-1/4 cursor-pointer z-10" onClick={() => handleZoneClick('ground')} />

        {/* Settings / Sign out */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <TooltipProvider>
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

        {/* Mood */}
        <div className="relative z-10 w-full max-w-4xl animate-fadeIn">
          {voiceEvents === undefined || dreams === undefined ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">Today&apos;s Emotional Outlook</h1>
              <p className="text-muted-foreground mt-2 mb-8">{moodDescription()}</p>
            </>
          )}
        </div>

        {/* People */}
        <TooltipProvider>
          <div className="absolute inset-x-0 top-10 flex justify-center gap-8 opacity-50 z-10">
            {people?.slice(0, 5).map((person, i) => (
              <Tooltip key={person.id}>
                <TooltipTrigger asChild>
                  <button onClick={() => handlePersonClick(person)} className="flex flex-col items-center animate-fadeIn cursor-pointer" style={{ animationDelay: `${i * 100}ms` }}>
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
            <InteractiveAvatar mood={overallMood} onZoneClick={handleZoneClick} isLoading={isRitualLoading} overlayColor={auraState?.overlayColor} overlayStyle={auraState?.overlayStyle} />
          )}
        </div>

        {/* Companion orb */}
        <div onClick={handleCompanionOrbClick} className="relative z-20 mt-8 h-20 w-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center cursor-pointer hover:scale-110" style={{ boxShadow: auraState?.overlayColor ? `0 0 20px 5px ${auraState.overlayColor}` : `0 0 20px 5px hsla(${overallMood * 60 + 60}, 100%, 70%, 0.5)` }}>
          <BotMessageSquare className="h-9 w-9 text-primary animate-pulse" />
        </div>

        {/* Memory blooms */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-12 opacity-60 z-10">
          <TooltipProvider>
            {memoryBlooms?.map((bloom, i) => (
              <Tooltip key={bloom.bloomId}>
                <TooltipTrigger asChild>
                  <button onClick={() => handleBloomClick(bloom)} className="animate-fadeIn" style={{ animationDelay: `${500 + i * 150}ms` }}>
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
          <p>Tap your avatar to explore your inner world. The sky reflects your mood. The blooms are moments of recovery.</p>
        </div>
      </div>

      {/* Panel dialog */}
      <AlertDialog open={!!activePanel} onOpenChange={open => !open && setActivePanel(null)}>
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
                {panelContent?.description && <AlertDialogDescription className="pt-2">{panelContent.description}</AlertDialogDescription>}
              </AlertDialogHeader>

              {activePanel === 'settings' ? (
                <div className="max-h-[60vh] overflow-y-auto p-1 pr-4 -mr-4">
                  <SettingsForm />
                </div>
              ) : (
                panelContent?.content && <div className="py-4 my-2 text-sm rounded-md">{panelContent.content}</div>
              )}

              <AlertDialogFooter>
                {activePanel !== 'settings' ? (
                  <AlertDialogAction onClick={() => setActivePanel(null)}>Done</AlertDialogAction>
                ) : (
                  <AlertDialogCancel onClick={() => setActivePanel(null)}>Close</AlertDialogCancel>
                )}
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
