'use client';

import { useState } from "react";
import type { AppData } from "@/lib/types";
import { NoteForm } from "@/components/note-form";
import { NoteList } from "@/components/note-list";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [appData, setAppData] = useState<AppData[]>([]);

  const handleVoiceEventAdded = (newData: AppData) => {
    setAppData((prevData) => [newData, ...prevData]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center">
            <h1 className="text-4xl font-headline font-bold tracking-tight text-accent">Life Logger</h1>
            <p className="mt-2 text-lg text-muted-foreground">Capture your moments. Understand your life.</p>
        </header>
        
        <NoteForm onNoteAdded={handleVoiceEventAdded} />

        {appData.length > 0 && (
          <section className="space-y-8">
            <Separator className="bg-border/50" />
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
