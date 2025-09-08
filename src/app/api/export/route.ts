import { NextResponse } from "next/server";
import { withApiAuth, type AuthenticatedRequest } from "@/lib/api-auth";

// Proxy POST requests to the Cloud Run exporter service. This allows local scripts
// to simply call `/api/export` instead of talking to the exporter directly and
// keeps Cloud Run credentials on the server.

const EXPORTER_URL =
  process.env.CLOUD_RUN_EXPORTER_URL || "http://localhost:8787/export";

export const POST = withApiAuth(async (req: AuthenticatedRequest) => {
  try {
    const body = await req.json().catch(() => ({}));

    const response = await fetch(EXPORTER_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: `Exporter error: ${response.status} ${text}` },
        { status: response.status }
      );
    }

    // Stream the MP4 (or other binary) result back to the client
    const arrayBuffer = await response.arrayBuffer();
    return new NextResponse(arrayBuffer, {
      headers: {
        "content-type":
          response.headers.get("content-type") || "application/octet-stream",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
});
