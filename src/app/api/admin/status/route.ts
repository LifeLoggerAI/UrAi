import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin/adminAccess";
import { DEFAULT_LAUNCH_STATUS, getDefaultFeatureFlags } from "@/lib/admin/featureFlags";

function adminUserFromRequest(request: Request) {
  return { email: request.headers.get("x-urai-admin-email") };
}

export async function GET(request: Request) {
  const access = requireAdminAccess(adminUserFromRequest(request));
  if (!access.ok) return NextResponse.json({ ok: false }, { status: 403 });
  return NextResponse.json({
    ok: true,
    role: access.role,
    launchStatus: DEFAULT_LAUNCH_STATUS,
    flags: getDefaultFeatureFlags().map(({ id, label, enabled, safetyCritical, updatedAt }) => ({ id, label, enabled, safetyCritical, updatedAt })),
    environment: {
      firebaseConfigured: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID),
      aiProviderConfigured: Boolean(process.env.OPENAI_API_KEY),
      storageConfigured: Boolean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET),
      waitlistConfigured: true,
    },
    updatedAt: new Date().toISOString(),
  });
}
