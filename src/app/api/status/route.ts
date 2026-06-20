import { NextResponse } from "next/server";

export async function GET() {
  const generatedAt = new Date().toISOString();

  return NextResponse.json({
    ok: true,
    service: "urai",
    generatedAt,
    services: [
      {
        id: "web-app",
        label: "URAI web app",
        status: "ok",
        generatedAt,
      },
      {
        id: "public-demo",
        label: "Public demo",
        status: "ok",
        generatedAt,
      },
      {
        id: "life-map",
        label: "Life Map routes",
        status: "ok",
        generatedAt,
      },
    ],
  });
}
