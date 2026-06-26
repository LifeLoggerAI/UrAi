import { NextResponse } from "next/server";

function hasValidBearerToken(request: Request) {
  const apiKey = process.env.TRANSCRIBE_API_KEY;
  if (!apiKey) return true;

  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  return authHeader.slice("Bearer ".length).trim() === apiKey;
}

export async function POST(request: Request) {
  if (!hasValidBearerToken(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart audio request" }, { status: 400 });
  }

  const audio = formData.get("audio");
  if (!audio || typeof audio === "string") {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  return NextResponse.json(
    {
      error: "Transcription provider is not configured for public launch.",
      status: "provider_not_configured",
      next: "Keep recordings local until the privacy-gated upload, storage, retention, export/delete, and provider flow is wired.",
    },
    { status: 501 },
  );
}
