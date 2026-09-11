// Legacy repository quarantine: this repository is not current production authority.
// Firebase Admin access is intentionally disabled here so historical private-key
// environment variables cannot reactivate server-side provider access.

export function isFirebaseAdminConfigured(): boolean {
  return false;
}

export function getAdminDb() {
  return null;
}

export function getAdminAuth() {
  return null;
}
