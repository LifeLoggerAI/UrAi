import { NextRequest } from "next/server";

import { getAdminAuth } from "@/lib/firebase-admin";

export type SpatialRequestContext = {
  uid: string;
  tenantId: string;
  role: "user" | "admin";
  source: "firebase-id-token";
};

function bearerToken(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function claimString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

export async function resolveSpatialRequestContext(request: NextRequest): Promise<SpatialRequestContext | null> {
  const auth = getAdminAuth();
  const token = bearerToken(request);
  if (!auth || !token) return null;

  try {
    const decoded = await auth.verifyIdToken(token, true);
    const tenantId = claimString(decoded.tenantId ?? decoded.tenant_id, "default");
    const role = decoded.admin === true || decoded.founder === true ? "admin" : "user";

    return {
      uid: decoded.uid,
      tenantId,
      role,
      source: "firebase-id-token",
    };
  } catch {
    return null;
  }
}

export function unauthorizedSpatialResponse() {
  return {
    error: "spatial_auth_required",
    message: "URAI Spatial private-beta routes require a verified Firebase ID token in the Authorization header.",
    requiredAuth: "Authorization: Bearer <firebase-id-token>",
  };
}

export function assertAdminSpatialContext(context: SpatialRequestContext | null) {
  return Boolean(context && context.role === "admin");
}
