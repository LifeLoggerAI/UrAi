import { NextRequest, NextResponse } from "next/server";

import { resolveSpatialRequestContext, unauthorizedSpatialResponse } from "@/lib/spatial/auth";
import { requireSpatialPrivateBeta } from "@/lib/spatial/feature-flags";
import type { SpatialScene } from "@/lib/spatial/contracts";

function newSceneId() {
  return `scene_${Date.now().toString(36)}`;
}

export async function GET(request: NextRequest) {
  const flag = requireSpatialPrivateBeta();
  if (!flag.enabled) return NextResponse.json({ error: "spatial_feature_flag_disabled", message: flag.reason }, { status: flag.status });

  const context = resolveSpatialRequestContext(request);
  if (!context) return NextResponse.json(unauthorizedSpatialResponse(), { status: 401 });

  return NextResponse.json({
    scenes: [],
    source: "firestore-contract-pending",
    context: { uid: context.uid, tenantId: context.tenantId, role: context.role },
    message: "Firestore-backed scene listing is intentionally blocked until production rules/indexes are verified.",
  });
}

export async function POST(request: NextRequest) {
  const flag = requireSpatialPrivateBeta();
  if (!flag.enabled) return NextResponse.json({ error: "spatial_feature_flag_disabled", message: flag.reason }, { status: flag.status });

  const context = resolveSpatialRequestContext(request);
  if (!context) return NextResponse.json(unauthorizedSpatialResponse(), { status: 401 });

  const body = await request.json().catch(() => ({}));
  const now = new Date().toISOString();
  const scene: SpatialScene = {
    id: newSceneId(),
    uid: context.uid,
    tenantId: context.tenantId,
    title: typeof body.title === "string" && body.title.trim() ? body.title.trim() : "Untitled Spatial Scene",
    status: "draft",
    rendererMode: "spatial-scene-v1",
    consentProfileId: typeof body.consentProfileId === "string" ? body.consentProfileId : "pending-consent-profile",
    createdAt: now,
    updatedAt: now,
  };

  return NextResponse.json({
    scene,
    persistence: "pending-firestore-write",
    message: "Scene contract accepted. Wire this response to Firestore once rules/index ownership is confirmed.",
  }, { status: 201 });
}
