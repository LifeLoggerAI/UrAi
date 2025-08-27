'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import type { Dream } from '@/lib/types';
import { DreamForm } from '@/components/dream-form';
import { DreamList } from '@/components/dream-list';
import { BrainCircuit, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function DreamsPage() {
  const { user, loading: authLoading } = useAuth();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      if (!authLoading) {
        setIsLoading(false);
      }
      return;
    }

    const dreamsRef = collection(db, 'dreamEvents');
    const q = query(dreamsRef, where('uid', '==', user.uid), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dreamsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dream));
      setDreams(dreamsData);
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
        <BrainCircuit className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-headline font-bold">Dream Journal</h1>
          <p className="text-muted-foreground">Capture and understand the stories of your subconscious.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <DreamForm />
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-headline font-bold mb-4">Recent Dreams</h2>
          <Separator className="mb-4" />
          <DreamList dreams={dreams} />
        </div>
      </div>
    </main>
  );
}
