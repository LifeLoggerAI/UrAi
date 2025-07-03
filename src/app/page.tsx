'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { VoiceEvent, Person } from "@/lib/types";
import { Recorder } from "@/components/note-form";
import { NoteList } from "@/components/note-list";
import { PeopleList } from "@/components/people-list";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { Loader2, LogOut, Users, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [voiceEvents, setVoiceEvents] = useState<VoiceEvent[]>([]);
  const [people, setPeople] = useState<Person[]>([]);

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

      return () => {
          unsubEvents();
          unsubPeople();
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

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center relative">
            <h1 className="text-4xl font-headline font-bold tracking-tight text-primary-foreground">Life Logger</h1>
            <p className="mt-2 text-lg text-muted-foreground">Capture your moments. Understand your life.</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="absolute top-0 right-0"
              aria-label="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
        </header>
        
        <Recorder userId={user.uid} />
        
        <Tabs defaultValue="memories" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="memories">
              <History className="mr-2 h-4 w-4" />
              Memory Stream
            </TabsTrigger>
            <TabsTrigger value="social">
              <Users className="mr-2 h-4 w-4" />
              Social Constellation
            </TabsTrigger>
          </TabsList>
          <TabsContent value="memories">
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
          </TabsContent>
          <TabsContent value="social">
             <section className="space-y-4 pt-4">
                <PeopleList people={people} />
              </section>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
