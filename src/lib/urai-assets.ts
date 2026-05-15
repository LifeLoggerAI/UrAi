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
    kind: "image",
    src: "/assets/urai/sky/sky-default.webp",
    source: "local",
    alt: "URAI symbolic sky background",
  },
  "home.sky.clouds": {
    slot: "home.sky.clouds",
    kind: "image",
    src: "/assets/urai/sky/clouds-default.webp",
    source: "local",
    alt: "URAI symbolic cloud layer",
  },
  "home.aura.blob": {
    slot: "home.aura.blob",
    kind: "image",
    src: "/assets/urai/aura/aura-default.webp",
    source: "local",
    alt: "URAI aura field",
  },
  "home.orb.core": {
    slot: "home.orb.core",
    kind: "image",
    src: "/assets/urai/orb/orb-default.webp",
    source: "local",
    alt: "URAI companion orb",
  },
  "home.silhouette.body": {
    slot: "home.silhouette.body",
    kind: "image",
    src: "/assets/urai/silhouette/body-default.webp",
    source: "local",
    alt: "URAI human silhouette",
  },
  "home.ground.base": {
    slot: "home.ground.base",
    kind: "image",
    src: "/assets/urai/ground/ground-default.webp",
    source: "local",
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
    return `<svg id="${id}" viewBox="0 0 1440 3120" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="25%" r="85%"><stop offset="0%" stop-color="#243B73"/><stop offset="55%" stop-color="#101A3A"/><stop offset="100%" stop-color="#050713"/></radialGradient><filter id="${id}-blur"><feGaussianBlur stdDeviation="32"/></filter></defs><rect width="1440" height="3120" fill="url(#${id}-g)"/><circle cx="260" cy="520" r="180" fill="#7EA7FF" opacity="0.16" filter="url(#${id}-blur)"/><circle cx="1120" cy="860" r="260" fill="#B17CFF" opacity="0.12" filter="url(#${id}-blur)"/><circle cx="720" cy="1420" r="420" fill="#5EE6D2" opacity="0.06" filter="url(#${id}-blur)"/></svg>`;
  }

  if (slot.includes("aura")) {
    return `<svg id="${id}" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#F7E6FF" stop-opacity="0.95"/><stop offset="45%" stop-color="#8DDCFF" stop-opacity="0.42"/><stop offset="100%" stop-color="#7B61FF" stop-opacity="0"/></radialGradient><filter id="${id}-blur"><feGaussianBlur stdDeviation="18"/></filter></defs><ellipse cx="400" cy="400" rx="250" ry="310" fill="url(#${id}-g)" filter="url(#${id}-blur)"/></svg>`;
  }

  if (slot.includes("star")) {
    return `<svg id="${id}" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="45%" stop-color="#B9E8FF"/><stop offset="100%" stop-color="#8A6CFF" stop-opacity="0"/></radialGradient></defs><circle cx="64" cy="64" r="52" fill="url(#${id}-g)" opacity="0.9"/><path d="M64 8 L72 56 L120 64 L72 72 L64 120 L56 72 L8 64 L56 56 Z" fill="#FFFFFF" opacity="0.86"/></svg>`;
  }

  if (slot.includes("silhouette")) {
    return `<svg id="${id}" viewBox="0 0 720 1400" xmlns="http://www.w3.org/2000/svg" role="img"><defs><linearGradient id="${id}-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#10182F"/><stop offset="100%" stop-color="#04050C"/></linearGradient></defs><circle cx="360" cy="210" r="112" fill="url(#${id}-g)" opacity="0.92"/><path d="M260 350 C220 520 230 790 260 1120 C285 1260 435 1260 460 1120 C490 790 500 520 460 350 C420 320 300 320 260 350Z" fill="url(#${id}-g)" opacity="0.92"/></svg>`;
  }

  if (slot.includes("card")) {
    return `<svg id="${id}" viewBox="0 0 900 1200" xmlns="http://www.w3.org/2000/svg" role="img"><defs><linearGradient id="${id}-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#F7E6FF" stop-opacity="0.5"/><stop offset="50%" stop-color="#7EE7FF" stop-opacity="0.22"/><stop offset="100%" stop-color="#7B61FF" stop-opacity="0.36"/></linearGradient></defs><rect x="42" y="42" width="816" height="1116" rx="64" fill="none" stroke="url(#${id}-g)" stroke-width="24"/><rect x="84" y="84" width="732" height="1032" rx="42" fill="rgba(9,12,28,0.62)" stroke="rgba(255,255,255,0.2)" stroke-width="4"/></svg>`;
  }

  return `<svg id="${id}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="60%" stop-color="#7EE7FF" stop-opacity="0.45"/><stop offset="100%" stop-color="#7B61FF" stop-opacity="0"/></radialGradient></defs><circle cx="256" cy="256" r="210" fill="url(#${id}-g)"/></svg>`;
}
