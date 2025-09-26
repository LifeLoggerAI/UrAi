"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import { useAuth } from "../auth";

const ROLE_CONTENT: Record<string, { title: string; description: string; cta: string }> = {
  admin: {
    title: "Admin Mission Control",
    description: "Monitor cohorts, adjust rituals, and keep the constellation aligned.",
    cta: "Open Control Surface",
  },
  guide: {
    title: "Guide Dashboard",
    description: "Review member reflections and respond with tailored prompts.",
    cta: "Review Journeys",
  },
  member: {
    title: "Welcome back to your Sky",
    description: "Tap into your rituals, narrate your day, and track the rhythm of your life.",
    cta: "Tap the sky",
  },
};

export default function HomePage() {
  const router = useRouter();
  const { user, claims, userStatus, claimsStatus, error, signOut } = useAuth();

  const isUserLoading = userStatus === "loading";
  const isClaimsLoading = userStatus === "authenticated" && claimsStatus !== "ready";

  useEffect(() => {
    if (!isUserLoading && (!user || user.isAnonymous)) {
      router.replace("/onboarding");
    }
  }, [router, user, isUserLoading]);

  const roles = useMemo(() => {
    const claimRoles = claims?.roles ?? claims?.role;
    if (Array.isArray(claimRoles)) {
      return claimRoles as string[];
    }
    if (typeof claimRoles === "string") {
      return [claimRoles];
    }
    return [] as string[];
  }, [claims]);

  const activeRoleKey = roles[0]?.toLowerCase() ?? "member";
  const roleContent = ROLE_CONTENT[activeRoleKey] ?? ROLE_CONTENT.member;

  if (isUserLoading || isClaimsLoading) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <span className="text-sm uppercase tracking-[0.3em] text-white/50">Loading</span>
        <h1 className="mt-3 text-2xl font-semibold">Warming the constellation…</h1>
        <p className="mt-2 text-sm text-white/60">Preparing your personalized home experience.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
        <h1 className="text-2xl font-semibold">We hit a snag.</h1>
        <p className="mt-3 max-w-md text-sm text-white/60">{error.message}</p>
        <div className="mt-6 flex gap-4">
          <Button variant="secondary" onClick={() => router.replace("/onboarding")}>Try again</Button>
          <Button variant="tertiary" onClick={() => signOut()}>Sign out</Button>
        </div>
      </div>
    );
  }

  if (!user || user.isAnonymous) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-white/60">Redirecting you to onboarding…</p>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center text-center">
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4 text-white/70">
        <span className="text-sm">Signed in as {user.email ?? user.displayName ?? user.uid}</span>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => router.push("/profile-and-privacy")}>Profile</Button>
          <Button variant="tertiary" onClick={() => signOut()}>Sign out</Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-white">
        <div className="mb-6 rounded-full border border-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
          {activeRoleKey === "member" ? "Local mode" : `${activeRoleKey} mode`}
        </div>
        <div className="mb-4 h-60 w-40 rounded-full bg-white/10"></div>
        <div className="mb-8 h-16 w-16 rounded-full bg-blue-500 shadow-lg"></div>

        <Button variant="primary" onClick={() => router.push("/life-map")}>{roleContent.cta}</Button>
        <p className="mt-4 max-w-sm text-sm text-white/70">{roleContent.description}</p>
      </div>

      <div className="mb-24 flex flex-wrap items-center justify-center gap-3 text-white/80">
        {[roleContent.title, ...roles.filter((role) => role.toLowerCase() !== activeRoleKey)].map((label) => (
          <Chip key={label}>{label}</Chip>
        ))}
      </div>
    </div>
  );
}

