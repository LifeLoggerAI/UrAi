"use client";

import type { ChangeEvent } from "react";
import { requestPushPermission } from "@/lib/notifications/pushNotificationClient";
import type { UraiNotificationChannel, UraiNotificationType } from "@/lib/notifications/notificationTypes";
import { useUraiNotifications } from "@/providers/UraiNotificationProvider";

const CHANNEL_LABELS: Record<UraiNotificationChannel, string> = {
  in_app: "In-app",
  push: "Push",
  sms: "SMS",
  email: "Email",
};

export function NotificationControlPanel() {
  const notifications = useUraiNotifications();
  const permissions = Object.values(notifications.notificationPermissions);

  const toggleChannel = async (type: UraiNotificationType, channel: UraiNotificationChannel, checked: boolean) => {
    const current = notifications.notificationPermissions[type];
    if (channel === "push" && checked) await requestPushPermission();
    const channels = checked ? Array.from(new Set([...current.channels, channel])) : current.channels.filter((item) => item !== channel);
    notifications.updateNotificationPermission(type, { channels });
  };

  const updateNumber = (key: "maxPerDay" | "maxPerWeek", event: ChangeEvent<HTMLInputElement>) => {
    notifications.updateTimingProfile({ [key]: Math.max(0, Number(event.target.value || 0)) });
  };

  return (
    <section className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 text-slate-100 shadow-2xl shadow-black/25" aria-labelledby="notification-control-title">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Notifications</p>
          <h2 id="notification-control-title" className="mt-2 text-2xl font-semibold text-white">URAI should whisper only when it matters.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Notifications are off by default. In-app whispers stay generic, quiet, and permission-aware.</p>
        </div>
        <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-200">
          <input type="checkbox" checked={notifications.notificationsEnabled} onChange={(event) => notifications.setNotificationsEnabled(event.target.checked)} />
          Notifications enabled
        </label>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <label className="rounded-2xl bg-black/20 p-3 text-sm text-slate-200"><input className="mr-2" type="checkbox" checked={notifications.timingProfile.allowInApp} onChange={(event) => notifications.updateTimingProfile({ allowInApp: event.target.checked })} />In-app notifications</label>
        <label className="rounded-2xl bg-black/20 p-3 text-sm text-slate-200"><input className="mr-2" type="checkbox" checked={notifications.timingProfile.allowPush} onChange={async (event) => { if (event.target.checked) await requestPushPermission(); notifications.updateTimingProfile({ allowPush: event.target.checked }); }} />Push notifications</label>
        <label className="rounded-2xl bg-black/20 p-3 text-sm text-slate-200"><input className="mr-2" type="checkbox" checked={notifications.timingProfile.allowSms} onChange={(event) => notifications.updateTimingProfile({ allowSms: event.target.checked })} />SMS notifications</label>
        <label className="rounded-2xl bg-black/20 p-3 text-sm text-slate-200"><input className="mr-2" type="checkbox" checked={notifications.timingProfile.allowEmail} onChange={(event) => notifications.updateTimingProfile({ allowEmail: event.target.checked })} />Email notifications</label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <label className="rounded-2xl bg-black/20 p-3 text-sm text-slate-200"><input className="mr-2" type="checkbox" checked={notifications.timingProfile.reducedNotificationMode} onChange={(event) => notifications.updateTimingProfile({ reducedNotificationMode: event.target.checked })} />Gentle mode</label>
        <label className="rounded-2xl bg-black/20 p-3 text-sm text-slate-200"><input className="mr-2" type="checkbox" checked={notifications.timingProfile.quietHoursEnabled} onChange={(event) => notifications.updateTimingProfile({ quietHoursEnabled: event.target.checked })} />Quiet hours</label>
        <label className="rounded-2xl bg-black/20 p-3 text-sm text-slate-200">Start <input className="mt-1 w-full rounded bg-white/10 p-2" type="time" value={notifications.timingProfile.quietHoursStart} onChange={(event) => notifications.updateTimingProfile({ quietHoursStart: event.target.value })} /></label>
        <label className="rounded-2xl bg-black/20 p-3 text-sm text-slate-200">End <input className="mt-1 w-full rounded bg-white/10 p-2" type="time" value={notifications.timingProfile.quietHoursEnd} onChange={(event) => notifications.updateTimingProfile({ quietHoursEnd: event.target.value })} /></label>
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black/20 p-3 text-sm text-slate-200"><label>Day <input className="mt-1 w-full rounded bg-white/10 p-2" type="number" min={0} value={notifications.timingProfile.maxPerDay} onChange={(event) => updateNumber("maxPerDay", event)} /></label><label>Week <input className="mt-1 w-full rounded bg-white/10 p-2" type="number" min={0} value={notifications.timingProfile.maxPerWeek} onChange={(event) => updateNumber("maxPerWeek", event)} /></label></div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {permissions.map((permission) => (
          <article key={permission.type} className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">{permission.label}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">{permission.description}</p>
                <p className="mt-2 text-[0.68rem] uppercase tracking-[0.16em] text-slate-500">{permission.sensitivity}</p>
              </div>
              <label className="text-xs text-slate-300"><input className="mr-2" type="checkbox" checked={permission.enabled} onChange={(event) => notifications.updateNotificationPermission(permission.type, { enabled: event.target.checked })} />On</label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {permission.allowedChannels.map((channel) => (
                <label key={channel} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-xs text-slate-300">
                  <input className="mr-1.5" type="checkbox" checked={permission.channels.includes(channel)} onChange={(event) => void toggleChannel(permission.type, channel, event.target.checked)} />
                  {CHANNEL_LABELS[channel]}
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
