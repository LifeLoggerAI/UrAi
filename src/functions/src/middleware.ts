
import { ALLOWED_ORIGINS, REQUIRE_ADMIN_TOKEN } from "./config";
import { verifyAdminFromRequest } from "./auth";

export type GuardResult = { ok: true; admin?: any } | { ok: false; code: number; body: any };

export function applyCors(req: any, res: any): boolean {
  const origin = req.headers.origin || "";
  const allowed = ALLOWED_ORIGINS.includes(origin);
  res.set("Vary", "Origin");
  if (allowed) res.set("Access-Control-Allow-Origin", origin);
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  return allowed;
}

export async function guardRequest(req: any): Promise<GuardResult> {
  if (REQUIRE_ADMIN_TOKEN) {
    const admin = await verifyAdminFromRequest(req);
    if (!admin) return { ok: false, code: 401, body: { error: "Admin token required" } };
    return { ok: true, admin };
  }
  return { ok: true };
}

// Convenience wrapper for onRequest handlers
export function withGuards(handler: (req: any, res: any, admin?: any) => Promise<void> | void) {
  return async (req: any, res: any) => {
    const allowed = applyCors(req, res);
    if (req.method === "OPTIONS") return res.status(204).send();
    if (!allowed) return res.status(403).json({ error: "Origin not allowed" });
    if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });

    const guard = await guardRequest(req);
    if (!guard.ok) return res.status(guard.code).json(guard.body);

    return handler(req, res, (guard as any).admin);
  };
}
