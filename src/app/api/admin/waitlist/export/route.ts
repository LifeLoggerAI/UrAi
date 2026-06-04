import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin/adminAccess";

function adminUserFromRequest(request: Request) {
  return { email: request.headers.get("x-urai-admin-email") };
}

export async function GET(request: Request) {
  const access = requireAdminAccess(adminUserFromRequest(request));
  if (!access.ok) return NextResponse.json({ ok: false }, { status: 403 });
  const csv = "email,name,interestType,source,createdAt\n";
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename=urai-waitlist-${new Date().toISOString().slice(0, 10)}.csv`,
    },
  });
}
