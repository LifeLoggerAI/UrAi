import type { NotificationPermissionState, NotificationSurfaceDecision, NotificationTimingProfile, UraiNotification, UraiNotificationChannel, UraiNotificationType } from "./notificationTypes";

type TimingPassportProfile = {
  shadowEnabled?: boolean;
  legacyEnabled?: boolean;
  exportEnabled?: boolean;
  notificationsEnabled?: boolean;
};

type UserActivityState = {
  activeInApp?: boolean;
  recentlyOpenedFeature?: UraiNotification["sourceType"];
  recentlyDismissedTypes?: UraiNotificationType[];
};

type ShouldSurfaceInput = {
  candidate: UraiNotification;
  timingProfile: NotificationTimingProfile;
  passportProfile?: TimingPassportProfile | null;
  notificationPermissions?: Partial<Record<UraiNotificationType, NotificationPermissionState>>;
  recentNotifications?: UraiNotification[];
  userActivityState?: UserActivityState;
  moodState?: string;
  reducedSensoryMode?: boolean;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_WEEK = 7 * MS_PER_DAY;

function minutesFromClock(value: string): number {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function isQuietHours(profile: NotificationTimingProfile, now = new Date()): boolean {
  if (!profile.quietHoursEnabled) return false;
  const current = now.getHours() * 60 + now.getMinutes();
  const start = minutesFromClock(profile.quietHoursStart || "22:00");
  const end = minutesFromClock(profile.quietHoursEnd || "08:00");
  if (start < end) return current >= start && current < end;
  return current >= start || current < end;
}

function countSince(recent: UraiNotification[], ms: number): number {
  const floor = Date.now() - ms;
  return recent.filter((notification) => notification.shownAt && new Date(notification.shownAt).getTime() >= floor).length;
}

function duplicateRecent(candidate: UraiNotification, recent: UraiNotification[]): boolean {
  const floor = Date.now() - 2 * 60 * 60 * 1000;
  return recent.some((notification) => notification.type === candidate.type && new Date(notification.shownAt ?? notification.createdAt).getTime() >= floor);
}

function allowedChannels(candidate: UraiNotification, profile: NotificationTimingProfile, reducedSensoryMode?: boolean, activeInApp?: boolean): UraiNotificationChannel[] {
  let channels = candidate.channels.filter((channel) => {
    if (channel === "in_app") return profile.allowInApp;
    if (channel === "push") return profile.allowPush;
    if (channel === "sms") return profile.allowSms;
    if (channel === "email") return profile.allowEmail;
    return false;
  });
  if (reducedSensoryMode || profile.reducedNotificationMode || activeInApp) channels = channels.filter((channel) => channel === "in_app");
  return channels.length ? channels : profile.allowInApp ? ["in_app"] : [];
}

export function shouldSurfaceNotification({ candidate, timingProfile, passportProfile, notificationPermissions, recentNotifications = [], userActivityState = {}, reducedSensoryMode }: ShouldSurfaceInput): NotificationSurfaceDecision {
  if (passportProfile?.notificationsEnabled === false) return { allowed: false, reason: "notifications_disabled" };
  const permission = notificationPermissions?.[candidate.type];
  if (permission && !permission.enabled) return { allowed: false, reason: "category_disabled" };
  if (candidate.sourceType === "shadow" || candidate.type === "shadow_boundary") {
    if (!passportProfile?.shadowEnabled) return { allowed: false, reason: "shadow_closed" };
  }
  if (candidate.sourceType === "legacy" || candidate.type === "legacy_prompt") {
    if (!passportProfile?.legacyEnabled) return { allowed: false, reason: "legacy_closed" };
  }
  if (candidate.type === "export_ready" && !passportProfile?.exportEnabled) return { allowed: false, reason: "export_closed" };
  if (candidate.status === "dismissed" || candidate.status === "blocked") return { allowed: false, reason: "candidate_inactive" };
  if (isQuietHours(timingProfile) && candidate.priority !== "important") return { allowed: false, reason: "quiet_hours", suggestedTime: timingProfile.quietHoursEnd };
  if (countSince(recentNotifications, MS_PER_DAY) >= timingProfile.maxPerDay) return { allowed: false, reason: "daily_limit" };
  if (countSince(recentNotifications, MS_PER_WEEK) >= timingProfile.maxPerWeek) return { allowed: false, reason: "weekly_limit" };
  if (duplicateRecent(candidate, recentNotifications)) return { allowed: false, reason: "duplicate_recent" };
  if (userActivityState.recentlyDismissedTypes?.filter((type) => type === candidate.type).length && userActivityState.recentlyDismissedTypes.filter((type) => type === candidate.type).length >= 2) return { allowed: false, reason: "similar_dismissed" };
  if (userActivityState.activeInApp && userActivityState.recentlyOpenedFeature === candidate.sourceType) return { allowed: false, reason: "already_in_feature" };
  const adjustedChannel = allowedChannels(candidate, timingProfile, reducedSensoryMode, userActivityState.activeInApp);
  if (adjustedChannel.length === 0) return { allowed: false, reason: "no_allowed_channel" };
  return { allowed: true, adjustedChannel };
}

export const DEFAULT_NOTIFICATION_TIMING_PROFILE: NotificationTimingProfile = {
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
  maxPerDay: 2,
  maxPerWeek: 7,
  allowPush: false,
  allowSms: false,
  allowEmail: false,
  allowInApp: true,
  reducedNotificationMode: true,
};
