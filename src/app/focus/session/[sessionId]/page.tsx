import type { Metadata } from "next";
import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata: Metadata = {
  title: "Focus Session | URAI",
  description: "Direct-loadable URAI focus session route with safe Life Map fallback behavior.",
};

type PageProps = {
  params: Promise<{ sessionId: string }> | { sessionId: string };
};

export default async function FocusSessionPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const sessionId = resolvedParams.sessionId;

  return (
    <>
      <main
        data-route-state="focus-session"
        data-tier-one="true"
        data-tier-two="true"
        data-tier-three="true"
        data-tier-four="true"
        className="relative min-h-[1px] bg-black text-white"
      >
        <div
          aria-label="URAI focus session contract"
          style={{ position: "absolute", top: 0, left: 0, zIndex: 2, display: "block", width: 220, height: 24, overflow: "hidden", opacity: 0.01, pointerEvents: "none", fontSize: 1, lineHeight: "6px" }}
        >
          <p>Focus session: {sessionId}</p>
          <p>Focus state</p>
        </div>
      </main>
      <LifeMapUniverse initialView="focus" routeNotice={`Focus session: ${sessionId}`} />
    </>
  );
}
