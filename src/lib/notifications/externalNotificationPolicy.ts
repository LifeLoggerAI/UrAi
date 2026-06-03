import type { UraiNotification } from "./notificationTypes";

export type ExternalNotificationResult = {
  sent: boolean;
  reason: "not_configured" | "disabled" | "unsafe_content" | "sent";
};

function safeForExternal(notification: UraiNotification): boolean {
  if (notification.sourceType === "shadow") return false;
  if (notification.body.length > 160) return false;
  return !/transcript|location|gmail|health|diagnos/i.test(`${notification.title} ${notification.body}`);
}

export async function sendSmsNotification(notification: UraiNotification, configured = false): Promise<ExternalNotificationResult> {
  if (!configured) return { sent: false, reason: "not_configured" };
  if (!notification.channels.includes("sms")) return { sent: false, reason: "disabled" };
  if (!safeForExternal(notification)) return { sent: false, reason: "unsafe_content" };
  return { sent: false, reason: "not_configured" };
}

export async function sendEmailNotification(notification: UraiNotification, configured = false): Promise<ExternalNotificationResult> {
  if (!configured) return { sent: false, reason: "not_configured" };
  if (!notification.channels.includes("email")) return { sent: false, reason: "disabled" };
  if (!safeForExternal(notification)) return { sent: false, reason: "unsafe_content" };
  return { sent: false, reason: "not_configured" };
}
