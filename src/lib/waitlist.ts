const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const waitlistRateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

const ALLOWED_INTEREST_TYPES = new Set(["Early user", "Investor/supporter", "Accessibility partner", "Creator", "Research/clinical interest", "Other"]);

export type WaitlistRequest = {
  email?: unknown;
  name?: unknown;
  interestType?: unknown;
  source?: unknown;
  handle?: unknown;
  intent?: unknown;
};

export type NormalizedWaitlistSignup = {
  email: string;
  source: string;
  name?: string;
  interestType?: string;
  handle?: string;
  intent?: string;
};

export function isValidEmail(email: string): boolean { return EMAIL_PATTERN.test(email); }
export function cleanOptionalText(value: unknown, maxLength: number): string | undefined { if (typeof value !== "string") return undefined; const cleaned = value.trim().slice(0, maxLength); return cleaned || undefined; }

export function normalizeWaitlistSignup(body: WaitlistRequest): NormalizedWaitlistSignup | null {
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) return null;
  const requestedInterest = cleanOptionalText(body.interestType, 80);
  const interestType = requestedInterest && ALLOWED_INTEREST_TYPES.has(requestedInterest) ? requestedInterest : undefined;
  return { email, source: cleanOptionalText(body.source, 120) ?? "unknown", name: cleanOptionalText(body.name, 120), interestType, handle: cleanOptionalText(body.handle, 80), intent: cleanOptionalText(body.intent, 120) };
}

export function waitlistIdForEmail(email: string): string { return email.toLowerCase().replace(/[^a-z0-9._-]/g, "_").slice(0, 180); }
export function rateLimitKeyForRequest(req: Request): string { const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(); const realIp = req.headers.get("x-real-ip")?.trim(); const userAgent = req.headers.get("user-agent")?.trim().slice(0, 120) || "unknown-agent"; return `${forwardedFor || realIp || "unknown-ip"}:${userAgent}`; }
export function checkWaitlistRateLimit(key: string, now = Date.now()): { ok: true } | { ok: false; retryAfterSeconds: number } { const current = waitlistRateLimitBuckets.get(key); if (!current || current.resetAt <= now) { waitlistRateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }); return { ok: true }; } if (current.count >= RATE_LIMIT_MAX_ATTEMPTS) return { ok: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) }; current.count += 1; waitlistRateLimitBuckets.set(key, current); return { ok: true }; }
export function resetWaitlistRateLimitForTests(): void { waitlistRateLimitBuckets.clear(); }
