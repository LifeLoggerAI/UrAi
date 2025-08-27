
import { onRequest } from "firebase-functions/v2/https";
import { ALLOWED_ORIGINS } from "./config";
import * as Sentry from "@sentry/node";

// Simple in-memory rate limiting (suitable for low-traffic functions)
const rateLimits = new Map<string, number[]>();
function checkRateLimit(ip: string | undefined): boolean {
    if (!ip) return true; // Don't block if IP is not available
    const now = Date.now();
    const windowStart = now - 60 * 1000; // 1 minute window
    const requests = (rateLimits.get(ip) || []).filter(t => t > windowStart);
    
    // Clean up old timestamps for the IP
    setTimeout(() => {
        const currentTimestamps = rateLimits.get(ip) || [];
        rateLimits.set(ip, currentTimestamps.filter(t => t > Date.now() - 2 * 60 * 1000));
    }, 2 * 60 * 1000);


    if (requests.length >= 30) { // Limit to 30 requests per minute per IP
        return false;
    }
    requests.push(now);
    rateLimits.set(ip, requests);
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
    if (!checkRateLimit(req.ip)) {
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
