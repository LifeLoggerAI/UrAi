import type { AppData } from "@/lib/types";
import { NoteCard } from "@/components/note-card";

export function NoteList({ items }: { items: AppData[] }) {
  return (
    <div className="w-full space-y-4">
      {items.map((item) => (
        <NoteCard key={item.voiceEvent.id} item={item} />
      ))}
    </div>
  );
}
