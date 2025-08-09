
'use client';

import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { Wand2 } from 'lucide-react';
import type { SuggestRitualOutput } from '@/lib/types';

interface RitualSuggestionProps {
  ritual: SuggestRitualOutput;
  onAccept: () => void;
  onDecline: () => void;
}

export function RitualSuggestion({
  ritual,
  onAccept,
  onDecline,
}: RitualSuggestionProps) {
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle className="flex items-center gap-2">
          <Wand2 className="text-primary h-6 w-6" />A Ritual is Suggested
        </AlertDialogTitle>
        <AlertDialogDescription className="pt-4">
          <h3 className="font-bold text-lg text-foreground pb-2">
            {ritual.title}
          </h3>
          <p className="text-foreground/80">{ritual.description}</p>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <div className="p-6 pt-0 text-center">
        <p className="text-muted-foreground">{ritual.suggestion}</p>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel asChild>
          <Button variant="ghost" onClick={onDecline}>
            Maybe Later
          </Button>
        </AlertDialogCancel>
        <AlertDialogAction asChild>
          <Button onClick={onAccept}>Accept Ritual</Button>
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}
