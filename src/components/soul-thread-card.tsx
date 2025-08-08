import { SoulThread } from '@/lib/types';

export function SoulThreadCard({ thread }: { thread: SoulThread }) {
  return (
    <div className="p-4 rounded-xl border shadow space-y-2 bg-gradient-to-r from-indigo-900 to-sky-900 text-white">
      <h3 className="text-xl font-semibold">{thread.threadLabel}</h3>
      <p>Status: {thread.status}</p>
      <p>Rebirths: {thread.rebirthCount}</p>
      <p className="italic text-sm">Symbol: {thread.coreSymbol}</p>
      <p className="text-xs text-muted">Archetype: {thread.dominantArchetype}</p>
    </div>
  );
}