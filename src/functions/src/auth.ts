import * as admin from "firebase-admin";
import type { Request } from "firebase-functions/v2/https";

export async function verifyAdminFromRequest(req: Request) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/i);
  if (!match) return null;
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(match[1]);
    return decodedToken?.isAdmin === true ? decodedToken : null;
  } catch (error) {
    console.warn("Admin token verification failed:", error);
    return null;
  }
}
