
'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Loader2 } from "lucide-react";
import { HomeView } from "@/components/home-view";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User as AppUser, Permissions } from "@/lib/types";
import { savePermissionsAction } from "./actions";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [profileLoading, setProfileLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const syncPermissions = async () => {
        const pendingData = localStorage.getItem('pending_permissions');
        if (!pendingData) return;

        try {
            const { userId, permissions } = JSON.parse(pendingData) as { userId: string; permissions: Permissions };
            
            if (userId === user.uid) {
                console.log("Syncing pending permissions from onboarding...");
                const result = await savePermissionsAction({ userId, permissions });
                
                if (result.success) {
                    toast({ title: 'Onboarding data synced', description: 'Your permissions have been saved to the cloud.' });
                    localStorage.removeItem('pending_permissions');
                } else {
                    toast({ variant: 'destructive', title: 'Background Sync Failed', description: `Could not sync permissions: ${result.error}. Will try again later.` });
                }
            } else {
                localStorage.removeItem('pending_permissions');
            }
        } catch (error) {
            console.error("Error syncing permissions:", error);
            localStorage.removeItem('pending_permissions');
        }
    };

    const checkOnboardingStatus = async () => {
      setProfileLoading(true);
      try {
        await syncPermissions(); // Attempt to sync permissions before checking status
        
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as AppUser;
          if (userData.onboardingComplete) {
            setOnboardingComplete(true);
          } else {
            // If onboarding isn't complete, check if permissions have at least been stored locally.
            const hasPendingPermissions = !!localStorage.getItem('pending_permissions');
            if(window.location.pathname.includes('/onboarding/voice') || hasPendingPermissions){
               // User is already in the final stages, let them continue
            } else {
               router.push('/onboarding/permissions');
            }
          }
        } else {
          router.push('/onboarding/permissions');
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        router.push('/onboarding/permissions');
      } finally {
        setProfileLoading(false);
      }
    };

    checkOnboardingStatus();

  }, [user, authLoading, router, toast]);

  if (authLoading || profileLoading || !onboardingComplete) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <HomeView />
    </main>
  );
}
