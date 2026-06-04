import type { UraiAdminRole } from "./adminTypes";

type AdminUserLike = { uid?: string | null; email?: string | null } | null | undefined;

function parseEmails(value?: string): string[] {
  return (value ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
}

export function getConfiguredAdminEmails(): string[] {
  const serverEmails = parseEmails(process.env.URAI_ADMIN_EMAILS);
  if (serverEmails.length) return serverEmails;
  return parseEmails(process.env.NEXT_PUBLIC_URAI_FOUNDER_EMAILS);
}

export function isFounderUser(user: AdminUserLike): boolean {
  const email = user?.email?.toLowerCase();
  if (!email) return false;
  return parseEmails(process.env.NEXT_PUBLIC_URAI_FOUNDER_EMAILS).includes(email) || parseEmails(process.env.URAI_ADMIN_EMAILS).includes(email);
}

export function isAdminUser(user: AdminUserLike): boolean {
  const email = user?.email?.toLowerCase();
  if (!email) return false;
  const configured = getConfiguredAdminEmails();
  if (!configured.length) return false;
  return configured.includes(email);
}

export function getAdminRole(user: AdminUserLike): UraiAdminRole | null {
  if (!isAdminUser(user)) return null;
  return isFounderUser(user) ? "founder" : "admin";
}

export function requireAdminAccess(user: AdminUserLike): { ok: true; role: UraiAdminRole } | { ok: false; reason: "signed_out" | "unauthorized" | "not_configured" } {
  if (!user?.email) return { ok: false, reason: "signed_out" };
  if (!getConfiguredAdminEmails().length) return { ok: false, reason: "not_configured" };
  const role = getAdminRole(user);
  if (!role) return { ok: false, reason: "unauthorized" };
  return { ok: true, role };
}
