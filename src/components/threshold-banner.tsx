import { CrisisState } from '@/lib/types';

export function ThresholdBanner({ crisis }: { crisis: CrisisState }) {
  if (!crisis.isInCrisis) return null;

  return (
    <div className="p-4 bg-red-900 text-white text-center rounded-md shadow-md">
      ⚠️ You're entering a symbolic threshold. This is a time of deep shift.
      <div className="mt-2 italic">
        Suggested ritual: {crisis.suggestedRitual || 'Reflection'}
      </div>
    </div>
  );
}