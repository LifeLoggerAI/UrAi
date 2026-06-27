import type { Metadata } from "next";
import Link from "next/link";
import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";
import SystemRoutePage from "@/components/SystemRoutePage";
import { isPublicDemoFocusSessionId } from "@/lib/publicDeepRoutes";

export const metadata: Metadata = {
  title: "Focus Session | URAI",
  description: "Direct-loadable URAI focus session route with safe sample-session fallback behavior.",
};

type PageProps = {
  params: Promise<{ sessionId: string }> | { sessionId: string };
};

export default async function FocusSessionPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);

  if (!isPublicDemoFocusSessionId(resolvedParams.sessionId)) {
    return (
      <SystemRoutePage
        eyebrow="Focus boundary"
        title="Focus session unavailable in the public demo."
        description="This session may be private, expired, or outside the Genesis sample set. URAI closes direct links without exposing session identifiers or private reflection context."
        status="guarded"
      >
        <nav className="mt-7 flex flex-wrap gap-3" aria-label="Focus boundary navigation">
          <Link className="rounded-full border border-cyan-100/20 bg-cyan-100/[0.08] px-5 py-3 text-sm font-bold text-cyan-50" href="/focus">Open Focus</Link>
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
          <p>Focus preview</p>
          <p>Genesis sample state</p>
        </div>
      </main>
      <LifeMapUniverse initialView="focus" routeNotice="Genesis sample focus session" />
    </>
  );
}
