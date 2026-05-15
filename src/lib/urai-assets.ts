export type UraiVisualSlot =
  | "home.sky.background"
  | "home.sky.clouds"
  | "home.aura.blob"
  | "home.orb.core"
  | "home.silhouette.body"
  | "home.ground.base"
  | "spatial.star.default"
  | "spatial.star.ritual"
  | "spatial.star.memory"
  | "spatial.bloom.memory"
  | "companion.avatar"
  | "ritual.card.frame";

export type UraiAssetKind = "image" | "svg" | "lottie" | "rive";

export type UraiAssetSource = "remote" | "local" | "procedural";

export type UraiRemoteAssetRecord = {
  slot: UraiVisualSlot;
  kind?: UraiAssetKind;
  url?: string | null;
  storageUrl?: string | null;
  publicUrl?: string | null;
  approved?: boolean | null;
  active?: boolean | null;
  alt?: string | null;
};

export type UraiResolvedAsset = {
  slot: UraiVisualSlot;
  kind: UraiAssetKind;
  src?: string;
  svg?: string;
  source: UraiAssetSource;
  alt: string;
};

const LOCAL_ASSETS: Partial<Record<UraiVisualSlot, UraiResolvedAsset>> = {
  "home.sky.background": {
    slot: "home.sky.background",
    kind: "svg",
    svg: proceduralSvg("home.sky.background"),
    source: "procedural",
    alt: "URAI symbolic sky background",
  },
  "home.sky.clouds": {
    slot: "home.sky.clouds",
    kind: "svg",
    svg: proceduralSvg("home.sky.clouds"),
    source: "procedural",
    alt: "URAI symbolic cloud layer",
  },
  "home.aura.blob": {
    slot: "home.aura.blob",
    kind: "svg",
    svg: proceduralSvg("home.aura.blob"),
    source: "procedural",
    alt: "URAI aura field",
  },
  "home.orb.core": {
    slot: "home.orb.core",
    kind: "svg",
    svg: proceduralSvg("home.orb.core"),
    source: "procedural",
    alt: "URAI companion orb",
  },
  "home.silhouette.body": {
    slot: "home.silhouette.body",
    kind: "svg",
    svg: proceduralSvg("home.silhouette.body"),
    source: "procedural",
    alt: "URAI human silhouette",
  },
  "home.ground.base": {
    slot: "home.ground.base",
    kind: "svg",
    svg: proceduralSvg("home.ground.base"),
    source: "procedural",
    alt: "URAI symbolic ground plane",
  },
  "spatial.bloom.memory": {
    slot: "spatial.bloom.memory",
    kind: "image",
    src: "/assets/urai/bloom/memory-bloom-default.webp",
    source: "local",
    alt: "URAI memory bloom",
  },
};

export const URAI_DEFAULT_VISUAL_SLOTS: readonly UraiVisualSlot[] = [
  "home.sky.background",
  "home.sky.clouds",
  "home.aura.blob",
  "home.orb.core",
  "home.silhouette.body",
  "home.ground.base",
  "spatial.star.default",
  "spatial.star.ritual",
  "spatial.star.memory",
  "spatial.bloom.memory",
  "companion.avatar",
  "ritual.card.frame",
] as const;

export function resolveUraiAsset(
  slot: UraiVisualSlot,
  remote?: UraiRemoteAssetRecord | null
): UraiResolvedAsset {
  const remoteUrl = remote?.url || remote?.storageUrl || remote?.publicUrl;

  if (remote?.active !== false && remote?.approved !== false && remoteUrl) {
    return {
      slot,
      kind: remote.kind || inferUraiAssetKind(remoteUrl),
      src: remoteUrl,
      source: "remote",
      alt: remote.alt || readableAlt(slot),
    };
  }

  const local = LOCAL_ASSETS[slot];
  if (local?.src || local?.svg) return local;

  return {
    slot,
    kind: "svg",
    svg: proceduralSvg(slot),
    source: "procedural",
    alt: readableAlt(slot),
  };
}

export function resolveUraiAssets(
  slots: readonly UraiVisualSlot[] = URAI_DEFAULT_VISUAL_SLOTS,
  remoteAssets: readonly UraiRemoteAssetRecord[] = []
): Record<UraiVisualSlot, UraiResolvedAsset> {
  const bySlot = new Map<UraiVisualSlot, UraiRemoteAssetRecord>();

  for (const asset of remoteAssets) {
    bySlot.set(asset.slot, asset);
  }

  return slots.reduce((resolved, slot) => {
    resolved[slot] = resolveUraiAsset(slot, bySlot.get(slot));
    return resolved;
  }, {} as Record<UraiVisualSlot, UraiResolvedAsset>);
}

export function inferUraiAssetKind(url: string): UraiAssetKind {
  const normalized = url.split("?")[0]?.toLowerCase() || url.toLowerCase();

  if (normalized.endsWith(".json")) return "lottie";
  if (normalized.endsWith(".riv")) return "rive";
  if (normalized.endsWith(".svg")) return "svg";

  return "image";
}

function readableAlt(slot: UraiVisualSlot): string {
  return slot.replaceAll(".", " ");
}

function proceduralSvg(slot: UraiVisualSlot): string {
  const id = `urai-${slot.replaceAll(".", "-")}`;

  if (slot.includes("sky")) {
    return `<svg id="${id}" viewBox="0 0 1440 3120" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="22%" r="80%"><stop offset="0%" stop-color="#273B77"/><stop offset="46%" stop-color="#0B1834"/><stop offset="100%" stop-color="#02040B"/></radialGradient><filter id="${id}-blur"><feGaussianBlur stdDeviation="24"/></filter></defs><rect width="1440" height="3120" fill="url(#${id}-g)"/><g opacity="0.65"><circle cx="220" cy="520" r="3" fill="#DDF4FF"/><circle cx="1160" cy="410" r="4" fill="#DDF4FF"/><circle cx="1050" cy="900" r="2" fill="#BFEAFF"/><circle cx="420" cy="980" r="3" fill="#BFEAFF"/><circle cx="720" cy="760" r="4" fill="#FFFFFF"/><circle cx="880" cy="1180" r="2" fill="#DDF4FF"/><circle cx="520" cy="1320" r="2" fill="#DDF4FF"/><circle cx="1220" cy="1320" r="3" fill="#FFFFFF"/><circle cx="300" cy="1500" r="2" fill="#BFEAFF"/></g><circle cx="720" cy="900" r="330" fill="#7EA7FF" opacity="0.12" filter="url(#${id}-blur)"/><circle cx="720" cy="1640" r="420" fill="#5EE6D2" opacity="0.045" filter="url(#${id}-blur)"/></svg>`;
  }

  if (slot.includes("ground")) {
    return `<svg id="${id}" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" role="img"><defs><linearGradient id="${id}-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#0B2A1D" stop-opacity="0"/><stop offset="44%" stop-color="#0B2A1D" stop-opacity="0.2"/><stop offset="100%" stop-color="#000000" stop-opacity="0.95"/></linearGradient><radialGradient id="${id}-mist" cx="50%" cy="24%" r="58%"><stop offset="0%" stop-color="#7EE7FF" stop-opacity="0.13"/><stop offset="100%" stop-color="#7EE7FF" stop-opacity="0"/></radialGradient></defs><rect width="1440" height="900" fill="url(#${id}-g)"/><ellipse cx="720" cy="210" rx="780" ry="170" fill="url(#${id}-mist)"/><path d="M0 376 C260 314 448 398 720 354 C980 312 1180 360 1440 310 L1440 900 L0 900 Z" fill="#03120C" opacity="0.5"/><path d="M0 520 C320 470 560 540 870 492 C1100 456 1260 494 1440 462 L1440 900 L0 900 Z" fill="#010705" opacity="0.84"/></svg>`;
  }

  if (slot.includes("aura")) {
    return `<svg id="${id}" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#F7E6FF" stop-opacity="0.78"/><stop offset="42%" stop-color="#8DDCFF" stop-opacity="0.34"/><stop offset="100%" stop-color="#7B61FF" stop-opacity="0"/></radialGradient><filter id="${id}-blur"><feGaussianBlur stdDeviation="18"/></filter></defs><ellipse cx="400" cy="400" rx="250" ry="310" fill="url(#${id}-g)" filter="url(#${id}-blur)"/></svg>`;
  }

  if (slot.includes("orb")) {
    return `<svg id="${id}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="38%" cy="31%" r="62%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="24%" stop-color="#DDF5FF"/><stop offset="58%" stop-color="#7DD7F7"/><stop offset="100%" stop-color="#102638" stop-opacity="0"/></radialGradient></defs><circle cx="256" cy="256" r="176" fill="url(#${id}-g)"/><circle cx="256" cy="256" r="205" fill="none" stroke="#DDF5FF" stroke-opacity="0.28" stroke-width="10"/></svg>`;
  }

  if (slot.includes("star")) {
    return `<svg id="${id}" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="45%" stop-color="#B9E8FF"/><stop offset="100%" stop-color="#8A6CFF" stop-opacity="0"/></radialGradient></defs><circle cx="64" cy="64" r="52" fill="url(#${id}-g)" opacity="0.9"/><path d="M64 8 L72 56 L120 64 L72 72 L64 120 L56 72 L8 64 L56 56 Z" fill="#FFFFFF" opacity="0.86"/></svg>`;
  }

  if (slot.includes("silhouette")) {
    return `<svg id="${id}" viewBox="0 0 720 1400" xmlns="http://www.w3.org/2000/svg" role="img"><defs><linearGradient id="${id}-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#BDEBFF" stop-opacity="0.5"/><stop offset="100%" stop-color="#021018" stop-opacity="0"/></linearGradient></defs><path d="M382 92 C456 110 504 176 504 262 C504 350 444 414 368 416 C292 418 242 356 250 280 C258 188 304 100 382 92Z" fill="url(#${id}-g)" opacity="0.9"/><path d="M380 430 C512 590 548 884 488 1310 C420 1375 302 1376 232 1310 C172 884 220 590 330 430Z" fill="url(#${id}-g)" opacity="0.82"/></svg>`;
  }

  if (slot.includes("card")) {
    return `<svg id="${id}" viewBox="0 0 900 1200" xmlns="http://www.w3.org/2000/svg" role="img"><defs><linearGradient id="${id}-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#F7E6FF" stop-opacity="0.5"/><stop offset="50%" stop-color="#7EE7FF" stop-opacity="0.22"/><stop offset="100%" stop-color="#7B61FF" stop-opacity="0.36"/></linearGradient></defs><rect x="42" y="42" width="816" height="1116" rx="64" fill="none" stroke="url(#${id}-g)" stroke-width="24"/><rect x="84" y="84" width="732" height="1032" rx="42" fill="rgba(9,12,28,0.62)" stroke="rgba(255,255,255,0.2)" stroke-width="4"/></svg>`;
  }

  return `<svg id="${id}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="60%" stop-color="#7EE7FF" stop-opacity="0.45"/><stop offset="100%" stop-color="#7B61FF" stop-opacity="0"/></radialGradient></defs><circle cx="256" cy="256" r="210" fill="url(#${id}-g)"/></svg>`;
}
