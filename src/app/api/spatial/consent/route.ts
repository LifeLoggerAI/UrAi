import { NextRequest, NextResponse } from "next/server";

import { resolveSpatialRequestContext, unauthorizedSpatialResponse } from "@/lib/spatial/auth";
import { requireSpatialPrivateBeta } from "@/lib/spatial/feature-flags";
import type { SpatialConsentProfile } from "@/lib/spatial/contracts";

export async function GET(request: NextRequest) {
  const flag = requireSpatialPrivateBeta();
  if (!flag.enabled) return NextResponse.json({ error: "spatial_feature_flag_disabled", message: flag.reason }, { status: flag.status });

  const context = await resolveSpatialRequestContext(request);
  if (!context) return NextResponse.json(unauthorizedSpatialResponse(), { status: 401 });

  return NextResponse.json({
    consent: null,
    source: "firestore-contract-pending",
    context: { uid: context.uid, tenantId: context.tenantId, role: context.role, source: context.source },
    message: "No persisted consent profile is returned until Firestore rules/index ownership is verified.",
  });
}

export async function POST(request: NextRequest) {
  const flag = requireSpatialPrivateBeta();
  if (!flag.enabled) return NextResponse.json({ error: "spatial_feature_flag_disabled", message: flag.reason }, { status: flag.status });

  const context = await resolveSpatialRequestContext(request);
  if (!context) return NextResponse.json(unauthorizedSpatialResponse(), { status: 401 });

  const body = await request.json().catch(() => ({}));
  const consent: SpatialConsentProfile = {
    id: `consent_${Date.now().toString(36)}`,
    uid: context.uid,
    tenantId: context.tenantId,
    spatialCaptureAllowed: body.spatialCaptureAllowed === true,
    roomSemanticsAllowed: body.roomSemanticsAllowed === true,
    xrAnchorsAllowed: body.xrAnchorsAllowed === true,
    assetGenerationAllowed: body.assetGenerationAllowed === true,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    consent,
    persistence: "pending-firestore-write",
    message: "Consent contract accepted. Persist only after Firestore rules and deletion/export flows are verified.",
  }, { status: 201 });
}
