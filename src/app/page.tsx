'use client';

import { useState, useEffect } from "react";
import type { AppData, EmotionState, Transcription, VoiceEvent } from "@/lib/types";
import { Recorder } from "@/components/note-form";
import { NoteList } from "@/components/note-list";
import { Separator } from "@/components/ui/separator";
import { TrendsSummary } from "@/components/trends-summary";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

export default function Home() {
  const [voiceEvents, setVoiceEvents] = useState<VoiceEvent[]>([]);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [emotionStates, setEmotionStates] = useState<EmotionState[]>([]);
  const [appData, setAppData] = useState<AppData[]>([]);

  // In a real app with authentication, this would be the logged-in user's ID.
  const userId = 'user-placeholder';

  useEffect(() => {
    const qEvents = query(collection(db, "voiceEvents"), where("userId", "==", userId), orderBy("timestamp", "desc"));
    const unsubEvents = onSnapshot(qEvents, (snapshot) => {
      const events = snapshot.docs.map(doc => doc.data() as VoiceEvent);
      setVoiceEvents(events);
    }, console.error);

    const qTranscriptions = query(collection(db, "transcriptions"), where("userId", "==", userId));
    const unsubTranscriptions = onSnapshot(qTranscriptions, (snapshot) => {
        const trans = snapshot.docs.map(doc => doc.data() as Transcription);
        setTranscriptions(trans);
    }, console.error);

    const qEmotions = query(collection(db, "emotionStates"), where("userId", "==", userId));
    const unsubEmotions = onSnapshot(qEmotions, (snapshot) => {
        const emotions = snapshot.docs.map(doc => doc.data() as EmotionState);
        setEmotionStates(emotions);
    }, console.error);

    return () => {
        unsubEvents();
        unsubTranscriptions();
        unsubEmotions();
    };
  }, [userId]);

  useEffect(() => {
    if (voiceEvents.length === 0) {
      setAppData([]);
      return;
    }

    const transcriptMap = new Map(transcriptions.map(t => [t.voiceEventId, t]));
    const emotionStateMap = new Map(emotionStates.map(e => [e.voiceEventId, e]));

    const combinedData = voiceEvents.map(ve => {
      const transcription = transcriptMap.get(ve.id);
      const emotionState = emotionStateMap.get(ve.id);
      
      if (transcription && emotionState) {
        return {
          voiceEvent: ve,
          transcription,
          emotionState,
        };
      }
      return null;
    }).filter((item): item is AppData => item !== null);
    
    setAppData(combinedData);
  }, [voiceEvents, transcriptions, emotionStates]);


  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center">
            <h1 className="text-4xl font-headline font-bold tracking-tight text-primary-foreground">Life Logger</h1>
            <p className="mt-2 text-lg text-muted-foreground">Capture your moments. Understand your life.</p>
        </header>
        
        <Recorder userId={userId} />

        {appData.length > 0 && (
          <section className="space-y-4">
            <Separator className="bg-border/50" />
            <TrendsSummary items={appData} />
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline text-center">Your Memory Stream</h2>
              <NoteList items={appData} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
