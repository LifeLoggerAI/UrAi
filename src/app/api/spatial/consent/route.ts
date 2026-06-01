export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  return Response.json({
    ok: true,
    route: "spatial-consent",
    mode: "static-export",
    consentRequired: true,
    persistence: "client-or-firebase-required",
    message:
      "Static export placeholder: consent must be handled by the client or a Firebase-backed runtime endpoint in deployed environments.",
  });
}
