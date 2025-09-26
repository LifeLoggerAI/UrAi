"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { useAuth } from "../auth";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, userStatus, claimsStatus, error, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const isLoading = useMemo(
    () => userStatus === "loading" || (userStatus === "authenticated" && claimsStatus === "loading"),
    [userStatus, claimsStatus]
  );

  useEffect(() => {
    if (user && !user.isAnonymous && userStatus === "authenticated") {
      router.replace("/home");
    }
  }, [router, user, userStatus]);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  };

  if (isLoading || isSigningIn) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black text-white">
        <h1 className="text-2xl font-semibold">Preparing your experience…</h1>
        <p className="mt-4 text-sm text-white/60">We are checking your account details.</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-black text-white px-6">
      <h1 className="text-4xl font-bold mb-4">URAI</h1>
      <p className="text-lg mb-8 text-white/80">Your Emotional Media OS</p>

      {error ? (
        <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error.message}
        </div>
      ) : null}

      <Button variant="primary" onClick={handleSignIn} disabled={isSigningIn}>
        {isSigningIn ? "Connecting…" : "Continue with Google"}
      </Button>
    </div>
  );
}

