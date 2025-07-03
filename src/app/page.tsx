'use client';

import { useState } from "react";
import type { Note } from "@/lib/types";
import { NoteForm } from "@/components/note-form";
import { NoteList } from "@/components/note-list";
import { TrendsSummary } from "@/components/trends-summary";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);

  const handleNoteAdded = (newNote: Note) => {
    setNotes((prevNotes) => [newNote, ...prevNotes]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
            <h1 className="text-4xl font-headline font-bold tracking-tight text-primary">LifeLogger-Clean</h1>
            <p className="mt-2 text-lg text-muted-foreground">A clean space for your thoughts.</p>
        </header>
        
        <NoteForm onNoteAdded={handleNoteAdded} />

        {notes.length > 0 && (
          <section className="space-y-8">
            <TrendsSummary notes={notes} />
            <Separator />
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-headline text-center">Your Notes</h2>
              <NoteList notes={notes} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
