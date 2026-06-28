import type { Metadata } from "next";
import Link from "next/link";
import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";
import SystemRoutePage from "@/components/SystemRoutePage";
import { isPublicDemoReplayId } from "@/lib/publicDeepRoutes";

export const metadata: Metadata = {
  title: "Replay Preview | URAI",
  description: "Direct-loadable URAI replay preview route with private replay fallback behavior.",
};

type PageProps = {
  params: Promise<{ replayId: string }> | { replayId: string };
};

export default async function ReplayDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);

  if (!isPublicDemoReplayId(resolvedParams.replayId)) {
    return (
      <SystemRoutePage
        eyebrow="Replay boundary"
        title="Replay preview unavailable in the public demo."
        description="This replay link is not part of the Genesis sample set. URAI does not reveal replay identifiers, scripts, provider status, or generated media unless owner-scoped proof exists."
        status="guarded"
      >
        <nav className="mt-7 flex flex-wrap gap-3" aria-label="Replay boundary navigation">
          <Link className="rounded-full border border-cyan-100/20 bg-cyan-100/[0.08] px-5 py-3 text-sm font-bold text-cyan-50" href="/replay">Open Replay Preview</Link>
          <Link className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/75" href="/life-map">Life Map</Link>
          <Link className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/75" href="/passport">Passport</Link>
          <Link className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/75" href="/status">Status</Link>
        </nav>
      </SystemRoutePage>
    );
  }

  return (
    <>
      <main
        data-route-state="replay-detail"
        data-tier-one="true"
        data-tier-two="true"
        data-tier-three="true"
        data-tier-four="true"
        className="relative min-h-[1px] bg-black text-white"
      >
        <div
          aria-label="URAI replay preview contract"
          style={{ position: "absolute", top: 0, left: 0, zIndex: 2, display: "block", width: 240, height: 32, overflow: "hidden", opacity: 0.01, pointerEvents: "none", fontSize: 1, lineHeight: "6px" }}
        >
          <p>Replay preview</p>
          <p>Genesis sample state</p>
          <h1>Sample Replay Arc</h1>
        </div>
      </main>
      <LifeMapUniverse initialView="replay" routeNotice="Genesis sample replay preview" />
    </>
  );
}
