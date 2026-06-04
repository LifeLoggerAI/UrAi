"use client";

import Link from "next/link";

export function MaintenanceMode() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 p-5 text-white">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">URAI</p>
        <h1 className="mt-3 text-3xl font-medium">URAI is being tuned.</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">The demo will reopen soon.</p>
        <Link href="/launch" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-black">Return later</Link>
      </section>
    </main>
  );
}
