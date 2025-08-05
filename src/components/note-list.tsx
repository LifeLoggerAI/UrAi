import type { VoiceEvent } from '@/lib/types';
import { NoteCard } from '@/components/note-card';

export function NoteList({ items }: { items: VoiceEvent[] }) {
  return (
    <div className='w-full space-y-4'>
      {items.map(item => (
        <NoteCard key={item.id} item={item} />
      ))}
    </div>
  );
}
