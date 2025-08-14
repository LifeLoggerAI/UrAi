'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Loader2 } from "lucide-react";
import { HomeView } from "@/components/home-view";
import { LandingPage } from "@/components/landing-page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User as AppUser } from "@/lib/types";

// LocalStorage key for storing last seen deploy ID
const DEPLOY_CHECK_KEY = "lastDeployCheck";
// Placeholder — will be replaced by GitHub Action at deploy time
const DEPLOY_ID = "__DEPLOY_ID__";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // One-time deploy confirmation log
    const lastCheck = localStorage.getItem(DEPLOY_CHECK_KEY);
    if (lastCheck !== DEPLOY_ID) {
      console.log("🔥 Firebase auto-deploy confirmed:", new Date().toLocaleString());
      localStorage.setItem(DEPLOY_CHECK_KEY, DEPLOY_ID);
    }

    if (authLoading) return;
    if (!user) {
      setProfileLoading(false);
      return; // Not logged in — show landing page
    }

    const checkOnboardingStatus = async () => {
      setProfileLoading(true);
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as AppUser;
          const onboardingComplete = userData.onboardingComplete ?? false;

          if (!onboardingComplete) {
            router.push("/onboarding/permissions");
          }
        } else {
          // If the user document doesn't exist, they need to onboard.
          router.push("/onboarding/permissions");
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        router.push("/onboarding/permissions"); // Fail safe to onboarding
      } finally {
        setProfileLoading(false);
      }
    };

    checkOnboardingStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  if (authLoading || (user && profileLoading)) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8 md:p-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <main className="min-h-screen bg-background">
      <HomeView />
    </main>
  );
}
