'use client';

import { useState, useEffect } from "react";
import type { VoiceEvent } from "@/lib/types";
import { Recorder } from "@/components/note-form";
import { NoteList } from "@/components/note-list";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export default function Home() {
  const [voiceEvents, setVoiceEvents] = useState<VoiceEvent[]>([]);

  // In a real app with authentication, this would be the logged-in user's ID.
  const userId = 'user-placeholder';

  useEffect(() => {
    const qEvents = query(collection(db, "voiceEvents"), where("uid", "==", userId), orderBy("createdAt", "desc"));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      const events = snapshot.docs.map(doc => doc.data() as VoiceEvent);
      setVoiceEvents(events);
    }, console.error);

    return () => {
        unsubEvents();
    };
  }, [userId]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center">
            <h1 className="text-4xl font-headline font-bold tracking-tight text-primary-foreground">Life Logger</h1>
            <p className="mt-2 text-lg text-muted-foreground">Capture your moments. Understand your life.</p>
        </header>
        
        <Recorder userId={userId} />

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
