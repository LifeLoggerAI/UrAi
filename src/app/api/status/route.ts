export const dynamic = "force-static";
export const revalidate = false;

import { NextResponse } from "next/server";


export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "urai",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
