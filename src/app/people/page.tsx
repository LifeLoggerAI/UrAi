'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import type { Person } from '@/lib/types';
import { PeopleList } from '@/components/people-list';
import { Users, Loader2 } from 'lucide-react';

export default function PeoplePage() {
  const { user, loading: authLoading } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      if (!authLoading) {
        setIsLoading(false);
      }
      return;
    }

    const peopleRef = collection(db, 'people');
    const q = query(peopleRef, where('uid', '==', user.uid), orderBy('lastSeen', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const peopleData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Person));
      setPeople(peopleData);
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
        <Users className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-headline font-bold">Social Constellation</h1>
          <p className="text-muted-foreground">The people who shape your world, detected from your voice.</p>
        </div>
      </div>
      <PeopleList people={people} />
    </main>
  );
}
