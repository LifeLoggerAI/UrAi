
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Loader2 } from "lucide-react";
import { HomeView } from "@/components/home-view";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User as AppUser } from "@/lib/types";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(true);
  
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const checkOnboardingStatus = async () => {
      setProfileLoading(true);
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as AppUser;
          if (!userData.onboardingComplete) {
            router.push('/onboarding/permissions');
          }
        } else {
          // If the user doc doesn't exist, something is wrong with user creation.
          // Route to onboarding to be safe.
          router.push('/onboarding/permissions');
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // Fallback to onboarding in case of error.
        router.push('/onboarding/permissions');
      } finally {
        setProfileLoading(false);
      }
    };

    checkOnboardingStatus();

  }, [user, authLoading, router]);

  if (authLoading || profileLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    )
  }

  // If we reach here, user is authenticated and onboarding is complete.
  return (
    <main className="min-h-screen bg-background">
      <HomeView />
    </main>
  );
}
