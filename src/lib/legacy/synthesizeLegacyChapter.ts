import type { LegacyChapter, LegacyItem, LegacyTone } from "./legacyTypes";
import type { PassportDataLayerId } from "@/lib/lifemap/lifeMapTypes";

function uniqueLayers(items: LegacyItem[]): PassportDataLayerId[] {
  return Array.from(new Set(items.flatMap((item) => item.sourceLayerIds)));
}

function chooseTone(items: LegacyItem[]): LegacyTone {
  if (items.some((item) => item.tone === "luminous")) return "luminous";
  if (items.some((item) => item.tone === "hopeful")) return "hopeful";
  if (items.some((item) => item.tone === "grounded")) return "grounded";
  if (items.some((item) => item.tone === "solemn")) return "solemn";
  return "warm";
}

function dateRange(items: LegacyItem[]): { startDate: string; endDate?: string } {
  const dates = items.map((item) => item.sourceCreatedAt ?? item.createdAt).sort();
  return { startDate: dates[0] ?? new Date().toISOString(), endDate: dates.length > 1 ? dates[dates.length - 1] : undefined };
}

export function synthesizeLegacyChapter(items: LegacyItem[]): LegacyChapter {
  const approved = items.filter((item) => item.userApproved && item.visibility !== "sealed");
  const sourceItems = approved.length > 0 ? approved : items;
  const range = dateRange(sourceItems);
  const tone = chooseTone(sourceItems);

  return {
    id: "legacy-chapter-genesis",
    title: sourceItems.length > 1 ? "A Quiet Beginning" : "Genesis",
    subtitle: "Only what you chose to carry forward.",
    summary: "This chapter gathers approved signs of orientation, permission-setting, and meaning. It is not the whole story — only what you chose to carry forward.",
    startDate: range.startDate,
    endDate: range.endDate,
    tone,
    itemIds: sourceItems.map((item) => item.id),
    sourceLayerIds: uniqueLayers(sourceItems),
    userApproved: sourceItems.every((item) => item.userApproved),
    exportAllowed: sourceItems.every((item) => item.exportAllowed),
  };
}
