
import { onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { sendTransactionalEmail } from "./email-engine";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

export const generateWeeklyScroll = onCall(async (request: any) => {
  const uid = request.auth?.uid;
  if (!uid) {
    logger.error("User not authenticated.");
    return { success: false, message: "User not authenticated." };
  }

  logger.info("generateWeeklyScroll called for user:", uid);
  
  try {
    // In a real implementation, you would:
    // 1. Gather data for the user for the last week.
    // 2. Call an AI flow to generate the scroll content.
    // 3. Save the scroll to Firestore.
    const scrollId = "placeholder-scroll-id";
    const scrollTitle = "Your Story from the Past Week";
    
    const userDoc = await db.collection("users").doc(uid).get();
    const userEmail = userDoc.data()?.email;

    if (userEmail) {
      await sendTransactionalEmail(
        userEmail,
        "Your Weekly UrAi Scroll is Ready!",
        `<h1>${scrollTitle}</h1><p>Your weekly summary is ready to view in the app.</p>`
      );
    }
    
    return {
      success: true,
      message: "Weekly scroll generated successfully (placeholder)",
      scrollId: scrollId,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error("Error generating weekly scroll:", error);
    return { success: false, message: "Failed to generate weekly scroll." };
  }
});
