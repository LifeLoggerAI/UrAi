import Link from "next/link";

export const metadata = {
  title: "Orb Chat | URAI",
  description: "Launch-safe URAI Orb Chat preview with clear companion and autonomy boundaries.",
};

export default function OrbChatPage() {
  return (
    <main className="min-h-screen bg-[#02050c] text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-100/70">URAI companion preview</p>
        <h1 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-6xl">Orb Chat is staged, not autonomous.</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
          The orb is the doorway companion for URAI Spatial. This public route is intentionally safe: no private account memory, live sensing, or autonomous actions open from here.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/home" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950">Return Home</Link>
          <Link href="/status" className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-5 py-3 text-sm font-bold text-cyan-50">Check status</Link>
        </div>
      </section>
    </main>
  );
}
