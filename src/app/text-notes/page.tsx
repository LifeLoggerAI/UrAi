'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import type { InnerVoiceReflection } from '@/lib/types';
import { TextEntryForm } from '@/components/text-entry-form';
import { TextEntryList } from '@/components/text-entry-list';
import { PenLine, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function TextNotesPage() {
  const { user, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState<InnerVoiceReflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      if (!authLoading) {
        setIsLoading(false);
      }
      return;
    }

    const entriesRef = collection(db, 'innerTexts');
    const q = query(entriesRef, where('uid', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const entriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InnerVoiceReflection));
      setEntries(entriesData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <PenLine className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-headline font-bold">Inner Voice</h1>
          <p className="text-muted-foreground">A private space for your written thoughts and reflections.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TextEntryForm />
        </div>
        <div className="lg:col-span-2">
          <TextEntryList entries={entries} />
        </div>
      </div>
    </main>
  );
}
