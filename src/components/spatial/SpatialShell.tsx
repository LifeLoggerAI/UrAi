import Link from "next/link";

import { resolveSpatialReadiness } from "@/lib/spatial/contracts";
import { isSpatialDemoEnabled, isSpatialPrivateBetaEnabled, isSpatialXrEnabled } from "@/lib/spatial/feature-flags";

type SpatialShellProps = {
  mode: "landing" | "demo" | "settings" | "assets";
};

export default function SpatialShell({ mode }: SpatialShellProps) {
  const readiness = resolveSpatialReadiness();

  return (
    <main className="spatial-shell" data-mode={mode} data-status={readiness.status}>
      <section className="spatial-hero" aria-label="URAI Spatial production shell">
        <p className="spatial-eyebrow">URAI Spatial</p>
        <h1>{mode === "demo" ? "Moonlit Spatial Demo" : "Spatial Home, safely staged for production"}</h1>
        <p className="spatial-lede">
          URAI Spatial is staged as a cohesive moonlit orb-platform world. Authenticated production access stays behind gates until consent, device QA, Asset Factory materialization, and smoke tests are green.
        </p>
        <div className="spatial-status-grid" aria-label="Spatial readiness flags">
          <span>Demo: {isSpatialDemoEnabled() ? "enabled" : "disabled"}</span>
          <span>Private beta: {isSpatialPrivateBetaEnabled() ? "enabled" : "blocked"}</span>
          <span>XR runtime: {isSpatialXrEnabled() ? "enabled" : "blocked"}</span>
          <span>Status: {readiness.status}</span>
        </div>
        <nav className="spatial-links" aria-label="Spatial routes">
          <Link href="/spatial">Home</Link>
          <Link href="/spatial/demo">Demo</Link>
          <Link href="/spatial/settings">Consent</Link>
          <Link href="/spatial/assets">Assets</Link>
          <Link href="/api/spatial/health">Health API</Link>
        </nav>
      </section>

      <section className="spatial-orb-stage" aria-label="Moonlit orb stage">
        <div className="spatial-moon" />
        <div className="spatial-platform">
          <div className="spatial-orb" />
          <div className="spatial-reflection" />
        </div>
      </section>

      <section className="spatial-cards" aria-label="Spatial production pillars">
        <article>
          <h2>Moonlit Life Map</h2>
          <p>Promotes the staging spatial UX into a production-controlled surface without calling it live before smoke proof exists.</p>
        </article>
        <article>
          <h2>Consent-first Spatial Data</h2>
          <p>Blocks capture, room semantics, XR anchors, and asset generation behind explicit consent contracts.</p>
        </article>
        <article>
          <h2>Asset Factory Pipeline</h2>
          <p>Connects spatial-scene-v1 to a worker-backed materialization path for glTF, GLB, USDZ, previews, and manifests.</p>
        </article>
      </section>

      <section className="spatial-readiness" aria-label="Definition of done checks">
        <h2>Live gate</h2>
        <ul>
          {readiness.checks.map((check) => (
            <li key={check.id} data-ok={check.ok}>
              <strong>{check.ok ? "PASS" : "BLOCKED"}: {check.label}</strong>
              <span>{check.message}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
