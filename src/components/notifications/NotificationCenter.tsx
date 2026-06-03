"use client";

import { useMemo, useState } from "react";
import type { UraiNotificationType } from "@/lib/notifications/notificationTypes";
import { useUraiNotifications } from "@/providers/UraiNotificationProvider";

export function NotificationCenter() {
  const notifications = useUraiNotifications();
  const [filter, setFilter] = useState<UraiNotificationType | "all">("all");
  const types = useMemo(() => Array.from(new Set(notifications.notifications.map((notification) => notification.type))), [notifications.notifications]);
  const visible = notifications.notifications.filter((notification) => filter === "all" || notification.type === filter);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-black/30 p-4 text-white shadow-2xl backdrop-blur-xl" aria-label="Notification Center">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Whispers</p>
          <h2 className="mt-1 text-xl font-medium text-white">Only the moments URAI was allowed to surface.</h2>
        </div>
        <button type="button" onClick={notifications.clearNotifications} className="rounded-full bg-white/[0.07] px-3 py-2 text-xs text-white/62">Clear all</button>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        <button type="button" onClick={() => setFilter("all")} className={`rounded-full px-3 py-2 text-xs ${filter === "all" ? "bg-white/16 text-white" : "bg-white/[0.07] text-white/58"}`}>All</button>
        {types.map((type) => <button key={type} type="button" onClick={() => setFilter(type)} className={`rounded-full px-3 py-2 text-xs ${filter === type ? "bg-white/16 text-white" : "bg-white/[0.07] text-white/58"}`}>{type.replace(/_/g, " ")}</button>)}
      </div>
      <div className="mt-4 space-y-2">
        {visible.length === 0 ? <p className="rounded-2xl bg-white/[0.05] p-3 text-sm text-white/58">No whispers here.</p> : visible.map((notification) => (
          <article key={notification.id} className="rounded-2xl bg-white/[0.055] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/38">{notification.type.replace(/_/g, " ")} · {notification.status}</p>
                <h3 className="mt-1 text-sm font-medium text-white/86">{notification.title}</h3>
                <p className="mt-1 text-sm leading-5 text-white/60">{notification.body}</p>
              </div>
              <button type="button" onClick={() => notifications.dismissNotification(notification.id)} className="rounded-full bg-white/[0.07] px-2 py-1 text-xs text-white/54">Dismiss</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
