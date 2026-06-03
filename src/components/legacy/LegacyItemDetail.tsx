"use client";

import type { LegacyItem } from "@/lib/legacy/legacyTypes";

type LegacyItemDetailProps = {
  item: LegacyItem | null;
  onClose: () => void;
  onApprove?: (itemId: string) => void;
  onSeal?: (itemId: string) => void;
  onUnseal?: (itemId: string) => void;
  onRemove?: (itemId: string) => void;
  onOpenPassport?: () => void;
  onReflect?: () => void;
  onOpenLifeMap?: () => void;
  onOpenGround?: () => void;
};

function formatDate(value?: string): string {
  if (!value) return "Unknown";
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function LegacyItemDetail({ item, onClose, onApprove, onSeal, onUnseal, onRemove, onOpenPassport, onReflect, onOpenLifeMap, onOpenGround }: LegacyItemDetailProps) {
  if (!item) return <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 rounded-3xl border border-white/10 bg-black/35 p-4 text-sm text-white/75 backdrop-blur-xl md:left-auto md:right-6 md:top-24 md:w-[380px] md:bottom-auto">Select a chapter item to open it.</aside>;
  const locked = item.visibility === "requires_permission";
  const sealed = item.visibility === "sealed";
  return (
    <aside className="pointer-events-auto absolute inset-x-4 bottom-4 z-30 rounded-3xl border border-white/10 bg-black/44 p-4 text-white/82 shadow-2xl backdrop-blur-xl md:left-auto md:right-6 md:top-24 md:w-[390px] md:bottom-auto">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-white/45">{item.type.replace(/_/g, " ")}</p>
          <h3 className="mt-1 text-lg font-medium text-white">{item.title}</h3>
          {item.subtitle ? <p className="mt-1 text-sm text-white/62">{item.subtitle}</p> : null}
        </div>
        <button type="button" onClick={onClose} aria-label="Close Legacy item" className="rounded-full bg-white/10 px-2 py-1 text-white/70">×</button>
      </div>
      <p className="mt-4 text-sm leading-6 text-white/72">{locked ? "This item needs permission before it can be carried into Legacy." : item.summary}</p>
      <dl className="mt-4 grid gap-1 text-xs text-white/45">
        <div className="flex justify-between gap-3"><dt>Date</dt><dd>{formatDate(item.sourceCreatedAt ?? item.createdAt)}</dd></div>
        <div className="flex justify-between gap-3"><dt>Status</dt><dd>{sealed ? "sealed" : item.visibility}</dd></div>
        <div className="flex justify-between gap-3"><dt>Approval</dt><dd>{item.userApproved ? "approved" : "not approved"}</dd></div>
        <div className="flex justify-between gap-3"><dt>Export</dt><dd>{item.exportAllowed ? "allowed" : "off"}</dd></div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2">
        {locked ? <button type="button" onClick={onOpenPassport} className="rounded-full bg-sky-200/15 px-3 py-2 text-xs text-white/84">Open Passport</button> : null}
        {!item.userApproved ? <button type="button" onClick={() => onApprove?.(item.id)} className="rounded-full bg-amber-200/14 px-3 py-2 text-xs text-white/84">Approve</button> : null}
        {sealed ? <button type="button" onClick={() => onUnseal?.(item.id)} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/76">Unseal</button> : <button type="button" onClick={() => onSeal?.(item.id)} className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/76">Seal this item</button>}
        <button type="button" onClick={onReflect} className="rounded-full bg-white/[0.07] px-3 py-2 text-xs text-white/68">Reflect with URAI</button>
        {item.linkedLifeMapStarId ? <button type="button" onClick={onOpenLifeMap} className="rounded-full bg-white/[0.06] px-3 py-2 text-xs text-white/62">Open Life Map source</button> : null}
        {item.linkedGroundElementId ? <button type="button" onClick={onOpenGround} className="rounded-full bg-white/[0.06] px-3 py-2 text-xs text-white/62">Open Ground source</button> : null}
        <button type="button" onClick={() => onRemove?.(item.id)} className="rounded-full bg-white/[0.05] px-3 py-2 text-xs text-white/54">Remove</button>
      </div>
    </aside>
  );
}
