import type { UraiNotification } from "./notificationTypes";

export function canUsePushNotifications(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getPushPermissionState(): NotificationPermission | "unsupported" {
  if (!canUsePushNotifications()) return "unsupported";
  return Notification.permission;
}

export async function requestPushPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!canUsePushNotifications()) return "unsupported";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

export async function registerServiceWorkerForPush(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

export function showLocalBrowserNotification(notification: UraiNotification): boolean {
  if (!canUsePushNotifications() || Notification.permission !== "granted") return false;
  const body = notification.body.slice(0, 140);
  const title = notification.title.slice(0, 64);
  new Notification(title, { body, silent: notification.priority === "silent" || notification.priority === "low" });
  return true;
}
