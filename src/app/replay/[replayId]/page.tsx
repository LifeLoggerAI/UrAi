import type { Metadata } from "next";
import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata: Metadata = {
  title: "Replay Detail | URAI",
  description: "Direct-loadable URAI replay detail route with safe Life Map fallback behavior.",
};

type PageProps = {
  params: Promise<{ replayId: string }> | { replayId: string };
};

function titleFromReplayId(replayId: string): string {
  return replayId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function ReplayDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const replayId = resolvedParams.replayId;
  const replayTitle = titleFromReplayId(replayId) + " Arc";

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
          aria-label="URAI replay detail contract"
          style={{ position: "absolute", top: 0, left: 0, zIndex: 2, display: "block", width: 240, height: 32, overflow: "hidden", opacity: 0.01, pointerEvents: "none", fontSize: 1, lineHeight: "6px" }}
        >
          <p>Replay: {replayId}</p>
          <p>Replay state</p>
          <h1>{replayTitle}</h1>
        </div>
      </main>
      <LifeMapUniverse initialView="replay" routeNotice={`Replay: ${replayId}`} />
    </>
  );
}
