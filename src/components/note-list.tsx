import type { Note } from "@/lib/types";
import { NoteCard } from "@/components/note-card";

export function NoteList({ notes }: { notes: Note[] }) {
  return (
    <div className="w-full space-y-4">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}
