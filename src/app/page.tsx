'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { RequirePro } from '@/components/RequirePro';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { HomeView } from '@/components/home-view';

/**
 * HomePage with Pro gating demo and onboarding enforcement.
 */
export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to onboarding if the user exists but hasn't completed it.
    if (user && !loading) {
      const userDocRef = doc(db, 'users', user.uid);
      getDoc(userDocRef).then(docSnap => {
        if (!docSnap.exists() || !docSnap.data()?.onboardingComplete) {
          router.push('/onboarding/permissions');
        }
      });
    } else if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return null; // AuthProvider shows a loader, so we can return null here.
  }

  return (
    <div className="relative w-screen h-screen">
      <HomeView />
    </div>
  );
}
