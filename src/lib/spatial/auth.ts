import { NextRequest } from "next/server";

export type SpatialRequestContext = {
  uid: string;
  tenantId: string;
  role: "user" | "admin";
  source: "headers";
};

export function resolveSpatialRequestContext(request: NextRequest): SpatialRequestContext | null {
  const uid = request.headers.get("x-urai-uid") || request.headers.get("x-user-id");
  const tenantId = request.headers.get("x-urai-tenant-id") || request.headers.get("x-tenant-id");
  const roleHeader = request.headers.get("x-urai-role") || request.headers.get("x-user-role") || "user";
  const role = roleHeader === "admin" ? "admin" : "user";

  if (!uid || !tenantId) return null;

  return {
    uid,
    tenantId,
    role,
    source: "headers",
  };
}

export function unauthorizedSpatialResponse() {
  return {
    error: "spatial_auth_required",
    message: "URAI Spatial production routes require an authenticated user and tenant context.",
    requiredHeaders: ["x-urai-uid", "x-urai-tenant-id"],
  };
}

export function assertAdminSpatialContext(context: SpatialRequestContext | null) {
  return Boolean(context && context.role === "admin");
}
