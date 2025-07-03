'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { VoiceEvent } from "@/lib/types";
import { Recorder } from "@/components/note-form";
import { NoteList } from "@/components/note-list";
import { Separator } from "@/components/ui/separator";
import { db, auth } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "@/components/auth-provider";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [voiceEvents, setVoiceEvents] = useState<VoiceEvent[]>([]);

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

      return () => {
          unsubEvents();
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

        {voiceEvents.length > 0 && (
          <section className="space-y-4">
            <Separator className="bg-border/50" />
            <div className="space-y-4 pt-4">
              <h2 className="text-2xl font-bold font-headline text-center">Your Memory Stream</h2>
              <NoteList items={voiceEvents} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
