import type { Metadata } from "next";
import Link from "next/link";
import SystemRoutePage from "@/components/SystemRoutePage";
import { isPublicDemoMemoryId } from "@/lib/publicDeepRoutes";

export const metadata: Metadata = {
  title: "Memory Star Preview | URAI",
  description: "Public-safe URAI memory-star route with unavailable private-memory fallback.",
};

type MemoryPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

const navigation = [
  { href: "/life-map", label: "Life Map" },
  { href: "/home", label: "Home" },
  { href: "/passport", label: "Passport" },
  { href: "/status", label: "Status" },
] as const;

export default async function MemoryPage({ params }: MemoryPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const isDemoMemory = isPublicDemoMemoryId(resolvedParams.id);

  if (!isDemoMemory) {
    return (
      <SystemRoutePage
        eyebrow="Memory star boundary"
        title="This memory star is unavailable in the public demo."
        description="The requested memory may be private, deleted, locked, or simply not part of the Genesis sample set. URAI closes the route without revealing identifiers or private content."
        status="guarded"
      >
        <DeepRouteNav />
      </SystemRoutePage>
    );
  }

  return (
    <SystemRoutePage
      eyebrow="Genesis memory star"
      title="A sample memory star is open."
      description="This launch-safe route shows the shape of a Memory Star without exposing private user data. Real owner memories, evidence, generated media, and exports remain gated behind consent, auth, and production proof."
      status="demo"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <SamplePanel title="Signal" body="A symbolic sample moment, not a real private memory." />
        <SamplePanel title="Focus" body="Use the public Life Map to move from this sample star into a safe reflection path." />
        <SamplePanel title="Replay" body="Replay remains a Genesis preview until real owner-approved artifacts exist." />
      </div>
      <DeepRouteNav />
    </SystemRoutePage>
  );
}

function SamplePanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-5">
      <h2 className="text-xl font-semibold tracking-[-0.04em] text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-white/62">{body}</p>
    </section>
  );
}

function DeepRouteNav() {
  return (
    <nav className="mt-7 flex flex-wrap gap-3" aria-label="Deep route safety navigation">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="inline-flex min-h-11 items-center rounded-full border border-cyan-100/20 bg-cyan-100/[0.08] px-4 text-sm font-bold text-cyan-50 transition hover:border-cyan-100/44 hover:bg-cyan-100/[0.14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
