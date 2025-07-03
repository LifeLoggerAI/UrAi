
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { VoiceEvent, Person, Dream } from "@/lib/types";
import { Recorder } from "@/components/note-form";
import { NoteList } from "@/components/note-list";
import { PeopleList } from "@/components/people-list";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { Loader2, LogOut, Users, History, BotMessageSquare, NotebookPen, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SummarizationTool } from "@/components/summarization-tool";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { DreamForm } from "@/components/dream-form";
import { DreamList } from "@/components/dream-list";
import { SettingsForm } from "@/components/settings-form";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [voiceEvents, setVoiceEvents] = useState<VoiceEvent[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [activeView, setActiveView] = useState<'memories' | 'social' | 'dreams' | 'settings'>('memories');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const qEvents = query(collection(db, "voiceEvents"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
      const unsubEvents = onSnapshot(qEvents, (snapshot) => {
        const events = snapshot.docs.map(doc => doc.data() as VoiceEvent);
        setVoiceEvents(events);
      }, console.error);

      const qPeople = query(collection(db, "people"), where("uid", "==", user.uid), orderBy("lastSeen", "desc"));
      const unsubPeople = onSnapshot(qPeople, (snapshot) => {
          const peopleData = snapshot.docs.map(doc => doc.data() as Person);
          setPeople(peopleData);
      }, console.error);

      const qDreams = query(collection(db, "dreams"), where("uid", "==", user.uid), orderBy("createdAt", "desc"));
      const unsubDreams = onSnapshot(qDreams, (snapshot) => {
        const dreamsData = snapshot.docs.map(doc => doc.data() as Dream);
        setDreams(dreamsData);
      }, console.error);

      return () => {
          unsubEvents();
          unsubPeople();
          unsubDreams();
      };
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      router.push('/login');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign Out Failed",
        description: "An error occurred while signing out. Please try again.",
      });
    }
  };

  if (loading || !user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    )
  }

  const renderActiveView = () => {
    switch(activeView) {
      case 'memories':
        return (
          <>
            <Recorder userId={user.uid} />
            <SummarizationTool />
            {voiceEvents.length > 0 ? (
              <section className="space-y-4 pt-4">
                <NoteList items={voiceEvents} />
              </section>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No memories logged yet.</p>
                <p className="text-sm">Use the recorder to capture your first voice event.</p>
              </div>
            )}
          </>
        )
      case 'social':
        return <PeopleList people={people} />;
      case 'dreams':
        return (
          <>
            <DreamForm />
            <section className="space-y-4 pt-4">
              <DreamList dreams={dreams} />
            </section>
          </>
        );
      case 'settings':
        return <SettingsForm />;
      default:
        return null;
    }
  }

  const getActiveViewTitle = () => {
    switch(activeView) {
      case 'memories': return 'Memory Stream';
      case 'social': return 'Social Constellation';
      case 'dreams': return 'Dream Journal';
      case 'settings': return 'Settings';
      default: return 'Life Logger';
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <BotMessageSquare className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-headline font-bold tracking-tight">
              Life Logger
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('memories')}
                isActive={activeView === 'memories'}
                tooltip="View your recorded memories"
              >
                <History />
                Memory Stream
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('social')}
                isActive={activeView === 'social'}
                tooltip="View your social connections"
              >
                <Users />
                Social Constellation
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setActiveView('dreams')}
                isActive={activeView === 'dreams'}
                tooltip="Log and analyze your dreams"
              >
                <NotebookPen />
                Dream Journal
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveView('settings')}
                  isActive={activeView === 'settings'}
                  tooltip="Manage your profile and settings"
                >
                  <Cog />
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          <div className="flex items-center gap-2 p-2 border-t mt-2">
            <img src={user.photoURL || `https://placehold.co/128x128.png?text=${(user.displayName || user.email || "A").charAt(0).toUpperCase()}`} alt="User avatar" className="h-8 w-8 rounded-full" />
            <div className="flex flex-col text-sm overflow-hidden">
                <span className="font-semibold text-sidebar-foreground truncate">{user.displayName || 'Anonymous'}</span>
                <span className="text-muted-foreground text-xs truncate">{user.email}</span>
            </div>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} >
                  <LogOut />
                  Sign Out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="flex flex-1 flex-col bg-background">
            <header className="flex items-center justify-between md:justify-end p-4 md:p-6 border-b">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-lg font-semibold md:hidden">{getActiveViewTitle()}</h2>
               <div className="w-7 h-7"></div>
            </header>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
              <div className="w-full max-w-3xl mx-auto space-y-8">
                {renderActiveView()}
              </div>
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
