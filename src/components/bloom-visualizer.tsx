import { RecoveryBloom } from '@/lib/types';

export function BloomVisualizer({ bloom }: { bloom: RecoveryBloom }) {
  return (
    <div className="relative w-full h-64 bg-black flex flex-col items-center justify-center rounded-xl overflow-hidden shadow-lg">
      <div className="text-white text-2xl mb-2">🌸 Recovery Bloom</div>
      <div className="text-sm text-muted-foreground italic">
        From {bloom.moodBefore} to {bloom.moodAfter} in {bloom.recoveryDuration} days.
      </div>
      <div className="absolute inset-0 opacity-60 pointer-events-none animate-pulse"
           style={{ 
             backgroundImage: `url(/aura/${bloom.auraVisual}.png)`, 
             backgroundSize: 'cover',
             backgroundColor: bloom.bloomColor === 'lavender-glow' ? '#9333ea' : '#6366f1'
           }}>
      </div>
    </div>
  );
}