
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import * as admin from "firebase-admin";
import { sendTransactionalEmail } from "./email-engine";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Generates a weekly scroll for all users and sends a notification email.
 * Runs every Monday at 9 AM.
 */
export const generateWeeklyScroll = onSchedule(
  {
    schedule: "0 9 * * 1",
    timeZone: "America/New_York",
  },
  async () => {
    logger.info("Starting weekly scroll generation for all users.");

    try {
      const usersSnapshot = await db.collection("users").get();

      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data();
        const uid = userDoc.id;

        if (!user.email) {
          logger.warn(`User ${uid} has no email, skipping weekly scroll.`);
          continue;
        }

        // In a real implementation, you would:
        // 1. Gather data for the user for the last week.
        // 2. Call an AI flow to generate the scroll content.
        // 3. Save the scroll to Firestore.
        const scrollId = "placeholder-scroll-id";
        const scrollTitle = "Your Story from the Past Week";

        // For now, we just create a placeholder record and send an email
        await db.collection(`weeklyScrolls/${uid}/scrolls`).add({
          id: scrollId,
          uid: uid,
          title: scrollTitle,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          status: "generated",
        });

        await sendTransactionalEmail(
          user.email,
          "Your Weekly UrAi Scroll is Ready!",
          `<h1>${scrollTitle}</h1><p>Your weekly summary is ready to view in the app.</p>`
        );
        logger.info(`Successfully generated scroll and queued email for ${uid}`);
      }
    } catch (error) {
      logger.error("Error generating weekly scrolls:", error);
    }
  }
);
