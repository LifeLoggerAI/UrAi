import { NextResponse } from "next/server";

import { resolveSpatialReadiness, SPATIAL_COLLECTIONS, SPATIAL_STORAGE_PATHS } from "@/lib/spatial/contracts";
import { isSpatialDemoEnabled, isSpatialPrivateBetaEnabled, isSpatialXrEnabled } from "@/lib/spatial/feature-flags";

export async function GET() {
  const generatedAt = new Date().toISOString();
  const readiness = resolveSpatialReadiness();

  return NextResponse.json({
    service: "urai-spatial",
    status: readiness.status,
    generatedAt,
    flags: {
      demo: isSpatialDemoEnabled(),
      privateBeta: isSpatialPrivateBetaEnabled(),
      xrRuntime: isSpatialXrEnabled(),
    },
    contracts: {
      collections: SPATIAL_COLLECTIONS,
      storagePaths: SPATIAL_STORAGE_PATHS,
    },
    readiness,
    note: "URAI Spatial remains staging-scaffolded until authenticated production smoke, consent, asset pipeline, and worker checks pass.",
  });
}
