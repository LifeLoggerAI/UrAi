import type { Metadata } from "next";
import Link from "next/link";
import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";
import SystemRoutePage from "@/components/SystemRoutePage";
import { isPublicDemoStarId } from "@/lib/publicDeepRoutes";

export const metadata: Metadata = {
  title: "Life Map Star | URAI",
  description: "Direct-loadable Life Map star route with public-demo validation and safe private-star fallback.",
};

type PageProps = {
  params: Promise<{ starId: string }> | { starId: string };
};

export default async function LifeMapStarPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);

  if (!isPublicDemoStarId(resolvedParams.starId)) {
    return (
      <SystemRoutePage
        eyebrow="Life Map boundary"
        title="This memory star is unavailable in the public demo."
        description="URAI only opens known Genesis sample stars on public deep links. Private, deleted, locked, or unknown stars fail closed without exposing identifiers."
        status="guarded"
      >
        <nav className="mt-7 flex flex-wrap gap-3" aria-label="Unavailable star navigation">
          <Link className="rounded-full border border-cyan-100/20 bg-cyan-100/[0.08] px-5 py-3 text-sm font-bold text-cyan-50" href="/life-map">Return to Life Map</Link>
          <Link className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/75" href="/home">Home</Link>
          <Link className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/75" href="/passport">Passport</Link>
          <Link className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/75" href="/status">Status</Link>
        </nav>
      </SystemRoutePage>
    );
  }

  return <LifeMapUniverse initialView="lifeMap" selectedStarId={resolvedParams.starId} routeNotice="Genesis sample star preview" />;
}
