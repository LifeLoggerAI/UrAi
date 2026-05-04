import Link from "next/link";

export type SystemRoutePageProps = {
  title: string;
  eyebrow?: string;
  description: string;
  status?: "wired" | "guarded" | "demo";
  children?: React.ReactNode;
};

export default function SystemRoutePage({
  title,
  eyebrow = "URAI System of Systems",
  description,
  status = "wired",
  children,
}: SystemRoutePageProps) {
  return (
    <main className="min-h-dvh bg-black text-white">
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center gap-6 px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-white/50">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/70">{description}</p>
          <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
            {status}
          </div>
          {children ? <div className="mt-6">{children}</div> : null}
          <nav className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
            <Link className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/15" href="/app/home">Home</Link>
            <Link className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/15" href="/app/life-map">Life Map</Link>
            <Link className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/15" href="/app/council">Council</Link>
            <Link className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/15" href="/app/settings">Settings</Link>
            <Link className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/15" href="/admin/system">Admin Health</Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
