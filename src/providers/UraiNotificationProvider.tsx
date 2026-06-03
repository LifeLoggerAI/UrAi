"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getNotificationProfilePath } from "@/lib/firebase/firestoreCollections";
import { buildNotificationCopy } from "@/lib/notifications/buildNotificationCopy";
import { createDefaultNotificationPermissions } from "@/lib/notifications/notificationPermissionRegistry";
import { rankNotifications } from "@/lib/notifications/rankNotifications";
import { DEFAULT_NOTIFICATION_TIMING_PROFILE, shouldSurfaceNotification } from "@/lib/notifications/timingEngine";
import type { NotificationPermissionState, NotificationTimingProfile, UraiNotification, UraiNotificationType } from "@/lib/notifications/notificationTypes";
import { useUraiAuth } from "@/providers/UraiAuthProvider";
import { useUraiCloudSync } from "@/providers/UraiCloudSyncProvider";

type NotificationCloudProfile = {
  notificationsEnabled: boolean;
  timingProfile: NotificationTimingProfile;
  notificationPermissions: Record<UraiNotificationType, NotificationPermissionState>;
  updatedAt: string;
};

type UraiNotificationContextValue = {
  notifications: UraiNotification[];
  activeWhisper: UraiNotification | null;
  timingProfile: NotificationTimingProfile;
  notificationPermissions: Record<UraiNotificationType, NotificationPermissionState>;
  notificationsEnabled: boolean;
  createCandidateNotification: (candidate: UraiNotification) => UraiNotification;
  scheduleNotification: (notification: UraiNotification, scheduledFor?: string) => void;
  showInAppNotification: (notification: UraiNotification) => boolean;
  dismissNotification: (notificationId: string) => void;
  snoozeNotification: (notificationId: string, minutes?: number) => void;
  updateTimingProfile: (patch: Partial<NotificationTimingProfile>) => void;
  updateNotificationPermission: (type: UraiNotificationType, patch: Partial<NotificationPermissionState>) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  clearNotifications: () => void;
};

const UraiNotificationContext = createContext<UraiNotificationContextValue | null>(null);
const PROFILE_KEY = "urai.notifications.profile";
const PERMISSIONS_KEY = "urai.notifications.permissions";
const RECENT_KEY = "urai.notifications.recent";
const ENABLED_KEY = "urai.notifications.enabled";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) { if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value)); }
function readEnabled(): boolean { if (typeof window === "undefined") return false; return window.localStorage.getItem(ENABLED_KEY) === "true"; }
function writeEnabled(enabled: boolean) { if (typeof window !== "undefined") window.localStorage.setItem(ENABLED_KEY, String(enabled)); }

export function UraiNotificationProvider({ children }: { children: ReactNode }) {
  const auth = useUraiAuth();
  const cloud = useUraiCloudSync();
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [notifications, setNotifications] = useState<UraiNotification[]>([]);
  const [activeWhisper, setActiveWhisper] = useState<UraiNotification | null>(null);
  const [timingProfile, setTimingProfile] = useState<NotificationTimingProfile>(DEFAULT_NOTIFICATION_TIMING_PROFILE);
  const [notificationPermissions, setNotificationPermissions] = useState<Record<UraiNotificationType, NotificationPermissionState>>(() => createDefaultNotificationPermissions());

  const pushPreferenceProfile = useCallback((enabled: boolean, timing: NotificationTimingProfile, permissions: Record<UraiNotificationType, NotificationPermissionState>) => {
    if (!auth.userId || !cloud.syncEnabled) return;
    const profile: NotificationCloudProfile = { notificationsEnabled: enabled, timingProfile: timing, notificationPermissions: permissions, updatedAt: new Date().toISOString() };
    void cloud.pushToCloud(getNotificationProfilePath(auth.userId), profile);
  }, [auth.userId, cloud]);

  useEffect(() => {
    const localEnabled = readEnabled();
    const localTiming = readJson(PROFILE_KEY, DEFAULT_NOTIFICATION_TIMING_PROFILE);
    const localPermissions = readJson(PERMISSIONS_KEY, createDefaultNotificationPermissions());
    setNotificationsEnabledState(localEnabled);
    setTimingProfile(localTiming);
    setNotificationPermissions(localPermissions);
    const recent = readJson<{ items?: UraiNotification[] }>(RECENT_KEY, { items: [] });
    setNotifications(Array.isArray(recent.items) ? recent.items : []);
    if (!auth.userId || !cloud.syncEnabled) return;
    void cloud.pullFromCloud<NotificationCloudProfile>(getNotificationProfilePath(auth.userId)).then((remote) => {
      if (!remote) return;
      setNotificationsEnabledState(remote.notificationsEnabled);
      setTimingProfile(remote.timingProfile);
      setNotificationPermissions(remote.notificationPermissions);
      writeEnabled(remote.notificationsEnabled);
      writeJson(PROFILE_KEY, remote.timingProfile);
      writeJson(PERMISSIONS_KEY, remote.notificationPermissions);
    });
  }, [auth.userId, cloud]);

  const persistNotifications = useCallback((next: UraiNotification[]) => { setNotifications(next); writeJson(RECENT_KEY, { items: next.slice(0, 40).map((notification) => ({ ...notification, body: notification.body.slice(0, 140), title: notification.title.slice(0, 64) })) }); }, []);
  const createCandidateNotification = useCallback((candidate: UraiNotification) => { const copy = buildNotificationCopy(candidate); return { ...candidate, title: copy.title, body: copy.body, status: candidate.status ?? "draft", channels: candidate.channels.length ? candidate.channels : ["in_app"] }; }, []);
  const scheduleNotification = useCallback((notification: UraiNotification, scheduledFor?: string) => { const safe = createCandidateNotification({ ...notification, scheduledFor, status: "scheduled" }); persistNotifications([safe, ...notifications]); }, [createCandidateNotification, notifications, persistNotifications]);
  const showInAppNotification = useCallback((notification: UraiNotification): boolean => { const safe = createCandidateNotification(notification); if (!notificationsEnabled && safe.type !== "system") return false; const decision = shouldSurfaceNotification({ candidate: safe, timingProfile, notificationPermissions, recentNotifications: notifications, passportProfile: { notificationsEnabled, shadowEnabled: notification.sourceType !== "shadow", legacyEnabled: true, exportEnabled: true }, reducedSensoryMode: timingProfile.reducedNotificationMode }); if (!decision.allowed) { persistNotifications([{ ...safe, status: "blocked" }, ...notifications]); return false; } const shown: UraiNotification = { ...safe, status: "shown", shownAt: new Date().toISOString(), channels: decision.adjustedChannel ?? ["in_app"] }; setActiveWhisper(shown); setTimingProfile((profile) => { const next = { ...profile, lastShownAt: shown.shownAt }; writeJson(PROFILE_KEY, next); pushPreferenceProfile(notificationsEnabled, next, notificationPermissions); return next; }); persistNotifications([shown, ...notifications]); return true; }, [createCandidateNotification, notificationPermissions, notifications, notificationsEnabled, persistNotifications, pushPreferenceProfile, timingProfile]);
  const dismissNotification = useCallback((notificationId: string) => { if (activeWhisper?.id === notificationId) setActiveWhisper(null); persistNotifications(notifications.map((notification) => notification.id === notificationId ? { ...notification, status: "dismissed" } : notification)); }, [activeWhisper?.id, notifications, persistNotifications]);
  const snoozeNotification = useCallback((notificationId: string, minutes = 60) => { const scheduledFor = new Date(Date.now() + minutes * 60 * 1000).toISOString(); if (activeWhisper?.id === notificationId) setActiveWhisper(null); persistNotifications(notifications.map((notification) => notification.id === notificationId ? { ...notification, status: "snoozed", scheduledFor } : notification)); }, [activeWhisper?.id, notifications, persistNotifications]);
  const updateTimingProfile = useCallback((patch: Partial<NotificationTimingProfile>) => { setTimingProfile((current) => { const next = { ...current, ...patch }; writeJson(PROFILE_KEY, next); pushPreferenceProfile(notificationsEnabled, next, notificationPermissions); return next; }); }, [notificationPermissions, notificationsEnabled, pushPreferenceProfile]);
  const updateNotificationPermission = useCallback((type: UraiNotificationType, patch: Partial<NotificationPermissionState>) => { setNotificationPermissions((current) => { const next = { ...current, [type]: { ...current[type], ...patch } }; writeJson(PERMISSIONS_KEY, next); pushPreferenceProfile(notificationsEnabled, timingProfile, next); return next; }); }, [notificationsEnabled, pushPreferenceProfile, timingProfile]);
  const setNotificationsEnabled = useCallback((enabled: boolean) => { setNotificationsEnabledState(enabled); writeEnabled(enabled); pushPreferenceProfile(enabled, timingProfile, notificationPermissions); }, [notificationPermissions, pushPreferenceProfile, timingProfile]);
  const clearNotifications = useCallback(() => { setActiveWhisper(null); persistNotifications([]); }, [persistNotifications]);
  const value = useMemo<UraiNotificationContextValue>(() => ({ notifications: rankNotifications(notifications), activeWhisper, timingProfile, notificationPermissions, notificationsEnabled, createCandidateNotification, scheduleNotification, showInAppNotification, dismissNotification, snoozeNotification, updateTimingProfile, updateNotificationPermission, setNotificationsEnabled, clearNotifications }), [activeWhisper, clearNotifications, createCandidateNotification, dismissNotification, notificationPermissions, notifications, notificationsEnabled, scheduleNotification, setNotificationsEnabled, showInAppNotification, snoozeNotification, timingProfile, updateNotificationPermission, updateTimingProfile]);
  return <UraiNotificationContext.Provider value={value}>{children}</UraiNotificationContext.Provider>;
}

export function useUraiNotifications(): UraiNotificationContextValue { const context = useContext(UraiNotificationContext); if (!context) throw new Error("useUraiNotifications must be used inside UraiNotificationProvider"); return context; }
