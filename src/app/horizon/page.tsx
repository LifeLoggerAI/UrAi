import Link from "next/link";

export const metadata = {
  title: "Horizon | URAI",
  description: "Launch-safe URAI Horizon route between Ground and Life Map.",
};

export default function HorizonPage() {
  return (
    <main className="min-h-screen bg-[#02050c] text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-amber-100/70">Horizon route</p>
        <h1 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-6xl">The horizon keeps Ground and Sky honest.</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
          Horizon is the transition layer between the real-life Ground world and the Life Map sky. Public access remains route-true and preview-safe until private context is explicitly approved.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/ground" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950">Enter Ground</Link>
          <Link href="/sky" className="rounded-full border border-cyan-100/20 bg-cyan-100/10 px-5 py-3 text-sm font-bold text-cyan-50">Go to Sky</Link>
          <Link href="/home" className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white">Return Home</Link>
        </div>
      </section>
    </main>
  );
}
