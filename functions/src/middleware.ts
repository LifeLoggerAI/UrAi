
import { onRequest } from "firebase-functions/v2/https";
import { ALLOWED_ORIGINS } from "./config";
import * as Sentry from "@sentry/node";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export async function checkRateLimit(ip: string | undefined): Promise<boolean> {
  if (!ip) return true;

  const ref = db.collection('rateLimits').doc(ip);
  const doc = await ref.get();
  const now = Date.now();
  const windowMs = 60 * 1000;

  if (doc.exists) {
    const data = doc.data() as { count: number; expiresAt: admin.firestore.Timestamp };
    if (data.expiresAt.toMillis() > now) {
      if (data.count >= 30) return false;
      await ref.update({ count: data.count + 1 });
      return true;
    }
  }

  await ref.set({ count: 1, expiresAt: new Date(now + windowMs) });
  return true;
}


export function withGuards(handler: (req: any, res: any) => Promise<void> | void) {
  // Use 'any' for req, res to align with onRequest's flexible signature
  return onRequest({ enforceAppCheck: true, region: "us-central1" }, async (req, res) => {
    
    // 1. CORS
    const origin = req.headers.origin || "";
    if (ALLOWED_ORIGINS.includes(origin)) {
      res.set("Access-Control-Allow-Origin", origin);
    }
    res.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    // 2. Rate Limiting
    if (!(await checkRateLimit(req.ip))) {
      res.status(429).json({ error: "Too many requests." });
      return;
    }
    
    // 3. Sentry and Error Handling
    try {
        await handler(req, res);
    } catch (e: any) {
        console.error("Unhandled error in function:", e);
        Sentry.captureException(e);
        if (!res.headersSent) {
            res.status(500).json({ error: "An internal error occurred." });
        }
    }
  });
}
