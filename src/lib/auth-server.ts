// src/lib/auth-server.ts (server-only)
import { admin } from './firebase-admin';

/**
 * Server-side authentication utilities using Firebase Admin SDK
 * Only use this in server-side code (API routes, server actions, etc.)
 */

/**
 * Verify an ID token on the server
 */
export async function verifyIdToken(idToken: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return { success: true, uid: decodedToken.uid, user: decodedToken };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get user by UID
 */
export async function getUserByUid(uid: string) {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return { success: true, user: userRecord };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * List users (admin only)
 */
export async function listUsers(maxResults: number = 1000) {
  try {
    const listUsersResult = await admin.auth().listUsers(maxResults);
    return { success: true, users: listUsersResult.users };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}