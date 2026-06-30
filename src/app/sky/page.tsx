import Link from "next/link";

export const metadata = {
  title: "Sky Route | URAI",
  description: "Launch-safe URAI Sky Route preview for the Life Map galaxy.",
};

export default function SkyPage() {
  return (
    <main className="min-h-screen bg-[#02050c] text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-100/70">Sky route</p>
        <h1 className="mt-5 text-5xl font-black tracking-[-0.06em] sm:text-6xl">The sky opens the Life Map preview.</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
          Sky is the upward route from Ground into the sample-safe Life Map galaxy. It stays preview-labeled until private memory, account data, and generated media pass consent and proof gates.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/life-map" className="rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950">Open Life Map preview</Link>
          <Link href="/home" className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-bold text-white">Return Home</Link>
        </div>
      </section>
    </main>
  );
}
