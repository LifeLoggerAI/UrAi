import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import logger from "./logger";

/**
 * Queues a transactional email to be sent by the backend Cloud Function.
 * @param to Recipient email
 * @param subject Email subject
 * @param html HTML email body
 */
export async function sendTransactionalEmail(
  to: string,
  subject: string,
  html: string
) {
  try {
    await addDoc(collection(db, "emails"), {
      to,
      subject,
      body: html,
      sent: false,
      createdAt: serverTimestamp(),
    });
    logger.info(`Transactional email queued for ${to}`);
  } catch (err) {
    logger.error("Error queuing transactional email:", err);
    throw err;
  }
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(userEmail: string, displayName?: string) {
  const welcomeHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
        <h1>🌱 Welcome to UrAi!</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Hi ${displayName || "there"},</h2>
        <p>Welcome to UrAi! Your journey of self-discovery and growth starts now.</p>
        <p>We're excited to help you track your moods, activities, and personal insights.</p>
        <p>Get started by logging your first mood or activity in the app!</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://urai.app" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Open UrAi
          </a>
        </div>
      </div>
    </div>
  `;

  return sendTransactionalEmail(userEmail, "Welcome to UrAi 🎉", welcomeHtml);
}

/**
 * Send a security alert email
 */
export async function sendSecurityAlert(userEmail: string, alertType: string, details: string) {
  const securityHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
        <h1>🔒 Security Alert</h1>
      </div>
      <div style="padding: 20px;">
        <h2>Security Alert: ${alertType}</h2>
        <p>We detected unusual activity on your UrAi account:</p>
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 15px 0;">
          ${details}
        </div>
        <p>If this was you, no action is needed. If you didn't authorize this activity, please secure your account immediately.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://urai.app/settings" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
            Review Account Security
          </a>
        </div>
      </div>
    </div>
  `;

  return sendTransactionalEmail(userEmail, `Security Alert - ${alertType}`, securityHtml);
}
