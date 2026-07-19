"use client";

import Link from "next/link";
import { PrivateHomeShell } from "@/components/launch/LaunchShell";
import { UraiAuthProvider, useUraiAuth } from "@/providers/UraiAuthProvider";

function AppHomeContent() {
  const auth = useUraiAuth();

  if (auth.authLoading) {
    return <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">Opening URAI Private…</main>;
  }

  if (!auth.isAuthenticated && !auth.isLocalOnly) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 p-5 text-white">
        <section className="max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">URAI Private</p>
          <h1 className="mt-3 text-2xl font-semibold">Private access required.</h1>
          <p className="mt-3 text-sm text-slate-400">Join the early list or sign in to open the private orb/home shell.</p>
          <Link href="/waitlist" className="mt-5 inline-flex rounded-full bg-cyan-200 px-5 py-3 text-sm font-semibold text-slate-950">Join Waitlist</Link>
        </section>
      </main>
    );
  }

  return <PrivateHomeShell />;
}

export default function AppHomePage() {
  return (
    <UraiAuthProvider>
      <AppHomeContent />
    </UraiAuthProvider>
  );
}
