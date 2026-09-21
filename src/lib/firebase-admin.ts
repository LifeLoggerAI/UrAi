import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

// Legacy repository quarantine: this repository is not current production authority.
// Firebase Admin access is intentionally disabled here so historical private-key
// environment variables cannot reactivate server-side provider access. Explicit
// nullable provider types preserve the legacy guarded caller contracts without
// enabling any runtime provider connection.

export function isFirebaseAdminConfigured(): boolean {
  return false;
}

export function getAdminDb(): Firestore | null {
  return null;
}

export function getAdminAuth(): Auth | null {
  return null;
}
