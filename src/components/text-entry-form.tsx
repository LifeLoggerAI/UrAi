'use client';

import React, { useState } from 'react';
import { analyzeTextSentiment } from '@/ai/flows/analyze-text-sentiment';
import { useAuth } from '@/components/auth-provider';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PenLine } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import type { InnerVoiceReflection } from '@/lib/types';

export function TextEntryForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter your thoughts before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await analyzeTextSentiment({ text });
      if (!result) {
        throw new Error('AI analysis of the text failed.');
      }

      const reflectionId = doc(collection(db, 'innerTexts')).id;
      const timestamp = Date.now();

      const newReflection: InnerVoiceReflection = {
        id: reflectionId,
        uid: user.uid,
        text,
        createdAt: timestamp,
        sentimentScore: result.sentimentScore,
      };

      await setDoc(doc(db, 'innerTexts', newReflection.id), newReflection);

      toast({
        title: 'Reflection Logged',
        description: 'Your entry has been saved.',
      });
      setText('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: (error as Error).message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded-lg bg-background"
    >
      <div className="space-y-4">
        <h3 className="font-headline text-xl">Inner Voice</h3>
        <Textarea
          placeholder="What's on your mind?..."
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={isSubmitting}
          rows={6}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || !text.trim()}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PenLine className="mr-2 h-4 w-4" />
            )}
            Save Reflection
          </Button>
        </div>
      </div>
    </form>
  );
}
