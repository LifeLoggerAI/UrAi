import { NextResponse } from "next/server";

import { resolveSpatialReadiness, SPATIAL_COLLECTIONS, SPATIAL_STORAGE_PATHS } from "@/lib/spatial/contracts";
import { isSpatialDemoEnabled, isSpatialPrivateBetaEnabled, isSpatialXrEnabled } from "@/lib/spatial/feature-flags";

export async function GET() {
  const generatedAt = new Date().toISOString();
  const readiness = resolveSpatialReadiness();

  return NextResponse.json({
    service: "urai-spatial",
    status: readiness.status,
    mode: readiness.mode,
    liveReady: readiness.liveReady,
    publicDemoReady: readiness.publicDemoReady,
    privateBetaReady: readiness.privateBetaReady,
    generatedAt,
    flags: {
      demo: isSpatialDemoEnabled(),
      privateBeta: isSpatialPrivateBetaEnabled(),
      xrRuntime: isSpatialXrEnabled(),
    },
    blockers: readiness.blocking,
    deferredCapabilities: readiness.deferredCapabilities,
    requiredV1Surfaces: readiness.requiredV1Surfaces,
    contracts: {
      collections: SPATIAL_COLLECTIONS,
      storagePaths: SPATIAL_STORAGE_PATHS,
    },
    readiness,
    note: readiness.liveReady
      ? "URAI Spatial is reporting live readiness because the explicit live mode and required checks are green."
      : "URAI Spatial remains staged until auth, consent, provider, rules, and pipeline checks pass.",
  });
}
