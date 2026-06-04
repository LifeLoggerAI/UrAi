"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminAccess } from "@/lib/admin/adminAccess";
import { useUraiAuth } from "@/providers/UraiAuthProvider";

export default function AdminPage() {
  const auth = useUraiAuth();
  const access = requireAdminAccess({ uid: auth.userId, email: auth.profile?.email ?? auth.user?.email });

  if (auth.authLoading) {
    return <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-300">Checking access…</main>;
  }

  if (!access.ok) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 p-5 text-white">
        <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Private</p>
          <h1 className="mt-3 text-2xl font-semibold">This area is private.</h1>
          <p className="mt-3 text-sm text-slate-400">Sign in with an authorized founder or admin account.</p>
        </section>
      </main>
    );
  }

  return <AdminShell />;
}
