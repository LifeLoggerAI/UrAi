'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Mic, Square } from 'lucide-react';

type RecordingState = 'idle' | 'requesting' | 'recording' | 'processing';

interface RecordButtonProps {
  recordingState: RecordingState;
  disabled?: boolean;
  onClick: () => void;
}

export function RecordButton({
  recordingState,
  disabled,
  onClick,
}: RecordButtonProps) {
  const getButtonContent = () => {
    switch (recordingState) {
      case 'processing':
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        );
      case 'recording':
        return (
          <>
            <Square className="mr-2 h-4 w-4 fill-current" />
            Stop Recording
          </>
        );
      case 'requesting':
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Requesting...
          </>
        );
      case 'idle':
      default:
        return (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </>
        );
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`bg-accent text-accent-foreground hover:bg-accent/90 min-w-[160px] transition-all duration-300 ${recordingState === 'recording' ? 'bg-red-500 hover:bg-red-600' : ''}`}
    >
      {getButtonContent()}
    </Button>
  );
}
