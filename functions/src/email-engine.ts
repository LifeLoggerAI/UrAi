
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions/v2";
import type { FirestoreEvent, DocumentSnapshot } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as sgMail from "@sendgrid/mail";
import { defineSecret } from "firebase-functions/params";

// Initialize admin SDK if not already initialized
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

// Define SendGrid API key as a secret
const sendgridKey = defineSecret("SENDGRID_API_KEY");

/**
 * Sends transactional emails via SendGrid when documents are added to /emails collection
 */
export const sendTransactionalEmail = onDocumentCreated(
  {
    document: "emails/{emailId}",
    secrets: [sendgridKey],
  },
  async (event: FirestoreEvent<DocumentSnapshot | undefined, { emailId: string }>) => {
    const emailData = event.data?.data();

    if (!emailData || !emailData.to) {
      logger.error("Missing email data or recipient.");
      return null;
    }

    sgMail.setApiKey(sendgridKey.value());

    try {
      await sgMail.send({
        to: emailData.to,
        from: "noreply@urai.app", // Change to your verified SendGrid sender
        subject: emailData.subject,
        html: emailData.body,
      });

      await event.data?.ref.update({
        sent: true,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info(`✅ Email sent to ${emailData.to}`);
    } catch (error) {
      logger.error("❌ Error sending email:", error);

      await event.data?.ref.update({
        sent: false,
        error: String(error),
        errorAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return null;
  }
);

/**
 * Generates weekly summary emails for all active users
 * Runs every Monday at 9 AM
 */
export const sendWeeklySummaryEmails = onSchedule(
  {
    schedule: "0 9 * * 1", // Every Monday at 9 AM
    timeZone: "America/New_York",
  },
  async () => {
    logger.info("📅 Weekly Summary Email Job Started");

    const oneWeekAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    try {
      const usersSnapshot = await db.collection("users").get();
      const batch = db.batch();

      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data();
        if (!user.email || user.transactionalEmailOptOut) continue;

        // Mood data
        const moodSnap = await db
          .collection("moods")
          .where("userId", "==", userDoc.id)
          .where("timestamp", ">", oneWeekAgo)
          .get();

        let moodSummary = "No mood data this week";
        let avgMoodScore: number | null = null;
        let moodTrend = "";

        if (!moodSnap.empty) {
          const scores = moodSnap.docs.map((doc) => doc.data().score || 0);
          avgMoodScore =
            scores.reduce((a, b) => a + b, 0) / scores.length;

          if (avgMoodScore > 2) moodSummary = "Mostly positive & uplifting 🌞";
          else if (avgMoodScore >= 0) moodSummary = "Balanced & steady 🌤";
          else moodSummary = "A bit low-energy — take care 💙";

          moodTrend = buildMoodTrendSVG(moodSnap.docs);
        }

        // Activity data
        const activitySnap = await db
          .collection("activity")
          .where("userId", "==", userDoc.id)
          .where("timestamp", ">", oneWeekAgo)
          .get();

        let activitySummary = "No activity recorded this week";
        let activityChart = "";

        if (!activitySnap.empty) {
          const totalMinutes = activitySnap.docs
            .map((doc) => doc.data().duration || 0)
            .reduce((a, b) => a + b, 0);
          activitySummary = `You logged ${totalMinutes} minutes of activity`;
          activityChart = buildActivityBarSVG(activitySnap.docs);
        }

        // Highlights
        const highlightsList = `
          <li>Average mood score: ${
            avgMoodScore !== null ? avgMoodScore.toFixed(1) : "N/A"
          }</li>
          <li>Mood entries: ${moodSnap.size}</li>
          <li>Activity sessions: ${activitySnap.size}</li>
        `;

        // Week range
        const weekRange = getWeekRange();

        // Generate HTML
        const summaryHtml = generateWeeklySummaryHtml({
          displayName: user.displayName,
          weekRange,
          moodSummary:
            moodSummary + (moodTrend ? `<br>${moodTrend}` : ""),
          activitySummary:
            activitySummary + (activityChart ? `<br>${activityChart}` : ""),
          highlightsList,
          unsubscribeLink: "https://urai.app/settings",
        });

        // Queue for sending
        const emailRef = db.collection("emails").doc();
        batch.set(emailRef, {
          to: user.email,
          subject: "Your Weekly UrAi Update 🌱",
          body: summaryHtml,
          sent: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      await batch.commit();
      logger.info("✅ Weekly Summary Emails Queued");
    } catch (error) {
      logger.error("❌ Error generating weekly summaries:", error);
    }
  }
);

function getWeekRange(): string {
  const now = new Date();
  const startOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - now.getDay() + 1
  );
  const endOfWeek = new Date(
    startOfWeek.getFullYear(),
    startOfWeek.getMonth(),
    startOfWeek.getDate() + 6
  );

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return `${formatDate(startOfWeek)} – ${formatDate(
    endOfWeek
  )}, ${now.getFullYear()}`;
}

function buildMoodTrendSVG(moodDocs: any[]): string {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="40" style="font-family: Arial, sans-serif;">`;

  moodDocs.slice(0, 7).forEach((doc, i) => {
    const score = doc.data().score || 0;
    let color = "#9ca3af";
    if (score > 2) color = "#22c55e";
    else if (score > 0) color = "#3b82f6";
    else if (score > -2) color = "#f97316";
    else color = "#ef4444";

    svg += `<circle cx="${20 + i * 30}" cy="20" r="10" fill="${color}" />`;
    svg += `<text x="${20 + i * 30}" y="35" text-anchor="middle" font-size="10" fill="#666">${days[i]}</text>`;
  });

  svg += `</svg>`;
  return svg;
}

function buildActivityBarSVG(activityDocs: any[]): string {
  const dayMinutes = Array(7).fill(0);
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  activityDocs.forEach((doc) => {
    const data = doc.data();
    const dayIndex = data.timestamp.toDate().getDay();
    dayMinutes[(dayIndex + 6) % 7] += data.duration || 0;
  });

  const max = Math.max(...dayMinutes, 1);
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="40" style="font-family: Arial, sans-serif;">`;

  dayMinutes.slice(0, 7).forEach((minutes, i) => {
    const height = Math.max(2, (minutes / max) * 25);
    const y = 25 - height;
    svg += `<rect x="${15 + i * 30}" y="${y}" width="10" height="${height}" fill="#4f46e5" />`;
    svg += `<text x="${20 + i * 30}" y="35" text-anchor="middle" font-size="10" fill="#666">${days[i]}</text>`;
  });

  svg += `</svg>`;
  return svg;
}

function generateWeeklySummaryHtml({
  displayName,
  weekRange,
  moodSummary,
  activitySummary,
  highlightsList,
  unsubscribeLink,
}: {
  displayName: string;
  weekRange: string;
  moodSummary: string;
  activitySummary: string;
  highlightsList: string;
  unsubscribeLink: string;
}): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Weekly UrAi Update</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 10px !important; }
      .content { font-size: 16px !important; }
    }
  </style>
  </head>
  <body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color: #f3f4f6; color: #111;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden;">
            <tr>
              <td align="center" style="background-color: #4f46e5; padding: 20px;">
                <h1 style="margin: 0; font-size: 24px; color: #ffffff;">🌱 Your Weekly UrAi Update</h1>
                <p style="margin: 0; font-size: 14px; color: #e0e7ff;">Insight & reflection for ${weekRange}</p>
              </td>
            </tr>
            <tr>
              <td class="content" style="padding: 20px;">
                <h2 style="margin-top: 0; font-size: 20px; color: #111827;">Hi ${displayName || "there"},</h2>
                <p style="font-size: 16px; color: #374151;">Here's your personal snapshot for the week.</p>
                <div style="background-color: #eef2ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="margin: 0 0 5px 0; font-size: 18px; color: #4338ca;">🌤 Mood Forecast</h3>
                  <p style="margin: 0; font-size: 15px; color: #1e3a8a;">${moodSummary}</p>
                </div>
                <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="margin: 0 0 5px 0; font-size: 18px; color: #065f46;">🏃 Activity Overview</h3>
                  <p style="margin: 0; font-size: 15px; color: #064e3b;">${activitySummary}</p>
                </div>
                <div style="background-color: #fff7ed; padding: 15px; border-radius: 8px;">
                  <h3 style="margin: 0 0 5px 0; font-size: 18px; color: #9a3412;">✨ Weekly Highlights</h3>
                  <ul style="margin: 0; padding-left: 20px; font-size: 15px; color: #7c2d12;">
                    ${highlightsList}
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #f9fafb; padding: 15px; font-size: 12px; color: #6b7280;">
                <p style="margin: 0;">You are receiving this email because you have an active UrAi account.</p>
                <p style="margin: 0;"><a href="${unsubscribeLink}" style="color: #4f46e5; text-decoration: none;">Unsubscribe</a></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}
