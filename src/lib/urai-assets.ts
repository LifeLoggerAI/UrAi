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
  "home.sky.background": { slot: "home.sky.background", kind: "svg", svg: proceduralSvg("home.sky.background"), source: "procedural", alt: "URAI deep night emotional sky" },
  "home.sky.clouds": { slot: "home.sky.clouds", kind: "svg", svg: proceduralSvg("home.sky.clouds"), source: "procedural", alt: "URAI drifting sky mist" },
  "home.aura.blob": { slot: "home.aura.blob", kind: "svg", svg: proceduralSvg("home.aura.blob"), source: "procedural", alt: "URAI aura field" },
  "home.orb.core": { slot: "home.orb.core", kind: "svg", svg: proceduralSvg("home.orb.core"), source: "procedural", alt: "URAI companion orb" },
  "home.silhouette.body": { slot: "home.silhouette.body", kind: "svg", svg: proceduralSvg("home.silhouette.body"), source: "procedural", alt: "URAI human silhouette" },
  "home.ground.base": { slot: "home.ground.base", kind: "svg", svg: proceduralSvg("home.ground.base"), source: "procedural", alt: "URAI emotional ground horizon" },
  "spatial.bloom.memory": { slot: "spatial.bloom.memory", kind: "image", src: "/assets/urai/bloom/memory-bloom-default.webp", source: "local", alt: "URAI memory bloom" },
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

export function resolveUraiAsset(slot: UraiVisualSlot, remote?: UraiRemoteAssetRecord | null): UraiResolvedAsset {
  const remoteUrl = remote?.url || remote?.storageUrl || remote?.publicUrl;
  if (remote?.active !== false && remote?.approved !== false && remoteUrl) {
    return { slot, kind: remote.kind || inferUraiAssetKind(remoteUrl), src: remoteUrl, source: "remote", alt: remote.alt || readableAlt(slot) };
  }
  const local = LOCAL_ASSETS[slot];
  if (local?.src || local?.svg) return local;
  return { slot, kind: "svg", svg: proceduralSvg(slot), source: "procedural", alt: readableAlt(slot) };
}

export function resolveUraiAssets(slots: readonly UraiVisualSlot[] = URAI_DEFAULT_VISUAL_SLOTS, remoteAssets: readonly UraiRemoteAssetRecord[] = []): Record<UraiVisualSlot, UraiResolvedAsset> {
  const bySlot = new Map<UraiVisualSlot, UraiRemoteAssetRecord>();
  for (const asset of remoteAssets) bySlot.set(asset.slot, asset);
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

  if (slot === "home.sky.background") {
    return `<svg id="${id}" viewBox="0 0 1440 3120" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-sky" cx="50%" cy="31%" r="82%"><stop offset="0%" stop-color="#203F86"/><stop offset="38%" stop-color="#0E265F"/><stop offset="72%" stop-color="#071431"/><stop offset="100%" stop-color="#020613"/></radialGradient><radialGradient id="${id}-center" cx="50%" cy="52%" r="42%"><stop offset="0%" stop-color="#76DDF4" stop-opacity="0.34"/><stop offset="38%" stop-color="#497BCF" stop-opacity="0.18"/><stop offset="100%" stop-color="#000000" stop-opacity="0"/></radialGradient><filter id="${id}-blur"><feGaussianBlur stdDeviation="36"/></filter></defs><rect width="1440" height="3120" fill="url(#${id}-sky)"/><rect width="1440" height="3120" fill="url(#${id}-center)"/><ellipse cx="720" cy="1730" rx="520" ry="430" fill="#7EE7FF" opacity="0.12" filter="url(#${id}-blur)"/><ellipse cx="720" cy="2460" rx="980" ry="440" fill="#020617" opacity="0.6"/><g opacity="0.42"><circle cx="210" cy="1290" r="3" fill="#CFF5FF"/><circle cx="390" cy="875" r="2" fill="#E5FAFF"/><circle cx="610" cy="620" r="2" fill="#E5FAFF"/><circle cx="745" cy="520" r="3" fill="#FFFFFF"/><circle cx="1040" cy="1110" r="3" fill="#DDF4FF"/><circle cx="1190" cy="1450" r="3" fill="#CFF5FF"/><circle cx="1260" cy="1466" r="2" fill="#BFEAFF"/></g></svg>`;
  }

  if (slot === "home.sky.clouds") {
    return `<svg id="${id}" viewBox="0 0 1440 3120" xmlns="http://www.w3.org/2000/svg" role="img"><defs><filter id="${id}-blur"><feGaussianBlur stdDeviation="54"/></filter><linearGradient id="${id}-mist" x1="0" x2="1"><stop offset="0%" stop-color="#7EE7FF" stop-opacity="0"/><stop offset="48%" stop-color="#BFEAFF" stop-opacity="0.22"/><stop offset="100%" stop-color="#BFA8FF" stop-opacity="0"/></linearGradient></defs><g filter="url(#${id}-blur)"><ellipse cx="470" cy="1460" rx="470" ry="250" fill="#7EA7FF" opacity="0.18"/><ellipse cx="940" cy="1510" rx="410" ry="230" fill="#A78BFA" opacity="0.12"/><ellipse cx="720" cy="1800" rx="620" ry="260" fill="#7EE7FF" opacity="0.11"/><path d="M90 1760 C320 1680 520 1770 720 1718 C970 1652 1150 1740 1360 1660 L1360 1880 C1080 1980 840 1850 640 1910 C390 1985 230 1880 90 1940 Z" fill="url(#${id}-mist)" opacity="0.7"/></g></svg>`;
  }

  if (slot === "home.ground.base") {
    return `<svg id="${id}" viewBox="0 0 1440 900" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-glow" cx="50%" cy="8%" r="60%"><stop offset="0%" stop-color="#DFF9FF" stop-opacity="0.34"/><stop offset="32%" stop-color="#7EE7FF" stop-opacity="0.13"/><stop offset="100%" stop-color="#020617" stop-opacity="0"/></radialGradient><linearGradient id="${id}-deep" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#17366B" stop-opacity="0.18"/><stop offset="38%" stop-color="#071D3C" stop-opacity="0.72"/><stop offset="100%" stop-color="#020617"/></linearGradient><filter id="${id}-soft"><feGaussianBlur stdDeviation="10"/></filter></defs><rect width="1440" height="900" fill="transparent"/><ellipse cx="720" cy="145" rx="740" ry="150" fill="url(#${id}-glow)"/><path d="M-20 250 C260 210 430 250 720 226 C1010 202 1190 228 1460 196 L1460 900 L-20 900 Z" fill="url(#${id}-deep)" opacity="0.9"/><path d="M80 250 C420 226 610 248 790 234 C1010 217 1160 224 1360 206" stroke="#EAFBFF" stroke-opacity="0.22" stroke-width="2" fill="none" filter="url(#${id}-soft)"/><ellipse cx="720" cy="290" rx="390" ry="44" fill="#7EE7FF" opacity="0.08" filter="url(#${id}-soft)"/></svg>`;
  }

  if (slot === "home.orb.core") {
    return `<svg id="${id}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-orb" cx="34%" cy="28%" r="74%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="18%" stop-color="#E9FDFF"/><stop offset="46%" stop-color="#7EE7FF"/><stop offset="72%" stop-color="#246F8B"/><stop offset="100%" stop-color="#061826"/></radialGradient><radialGradient id="${id}-shine" cx="34%" cy="25%" r="35%"><stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.96"/><stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient><filter id="${id}-shadow"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000814" flood-opacity="0.55"/></filter></defs><circle cx="256" cy="256" r="186" fill="url(#${id}-orb)" filter="url(#${id}-shadow)"/><circle cx="206" cy="178" r="118" fill="url(#${id}-shine)"/><path d="M108 274 C174 334 302 358 400 274" stroke="#082338" stroke-opacity="0.25" stroke-width="28" fill="none" stroke-linecap="round"/><circle cx="256" cy="256" r="204" fill="none" stroke="#DDF9FF" stroke-opacity="0.22" stroke-width="8"/></svg>`;
  }

  if (slot.includes("star")) {
    return `<svg id="${id}" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="34%" stop-color="#DDF8FF"/><stop offset="100%" stop-color="#7EA7FF" stop-opacity="0"/></radialGradient><filter id="${id}-blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="64" cy="64" r="46" fill="url(#${id}-g)" opacity="0.82"/><path d="M64 14 L69 58 L114 64 L69 70 L64 114 L59 70 L14 64 L59 58 Z" fill="#FFFFFF" opacity="0.72" filter="url(#${id}-blur)"/></svg>`;
  }

  if (slot === "home.silhouette.body") {
    return `<svg id="${id}" viewBox="0 0 720 1400" xmlns="http://www.w3.org/2000/svg" role="img"><defs><linearGradient id="${id}-body" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#CDEFFF" stop-opacity="0.42"/><stop offset="52%" stop-color="#72B7D8" stop-opacity="0.22"/><stop offset="100%" stop-color="#03111C" stop-opacity="0"/></linearGradient><filter id="${id}-glow"><feGaussianBlur stdDeviation="6"/></filter></defs><path d="M374 92 C454 108 500 176 500 258 C500 350 438 412 360 412 C286 412 238 354 248 276 C260 176 300 102 374 92Z" fill="url(#${id}-body)" opacity="0.92"/><path d="M360 430 C486 586 526 884 474 1320 C402 1372 304 1372 236 1320 C184 884 224 586 340 430Z" fill="url(#${id}-body)" opacity="0.82"/><path d="M286 446 C214 616 196 906 236 1320" stroke="#DDF8FF" stroke-opacity="0.1" stroke-width="8" filter="url(#${id}-glow)"/><path d="M424 446 C500 630 512 910 474 1320" stroke="#DDF8FF" stroke-opacity="0.08" stroke-width="8" filter="url(#${id}-glow)"/></svg>`;
  }

  if (slot.includes("aura")) {
    return `<svg id="${id}" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#F7E6FF" stop-opacity="0.64"/><stop offset="42%" stop-color="#8DDCFF" stop-opacity="0.28"/><stop offset="100%" stop-color="#7B61FF" stop-opacity="0"/></radialGradient><filter id="${id}-blur"><feGaussianBlur stdDeviation="22"/></filter></defs><ellipse cx="400" cy="400" rx="250" ry="310" fill="url(#${id}-g)" filter="url(#${id}-blur)"/></svg>`;
  }

  if (slot.includes("card")) {
    return `<svg id="${id}" viewBox="0 0 900 1200" xmlns="http://www.w3.org/2000/svg" role="img"><defs><linearGradient id="${id}-g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#F7E6FF" stop-opacity="0.5"/><stop offset="50%" stop-color="#7EE7FF" stop-opacity="0.22"/><stop offset="100%" stop-color="#7B61FF" stop-opacity="0.36"/></linearGradient></defs><rect x="42" y="42" width="816" height="1116" rx="64" fill="none" stroke="url(#${id}-g)" stroke-width="24"/><rect x="84" y="84" width="732" height="1032" rx="42" fill="rgba(9,12,28,0.62)" stroke="rgba(255,255,255,0.2)" stroke-width="4"/></svg>`;
  }

  return `<svg id="${id}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img"><defs><radialGradient id="${id}-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="60%" stop-color="#7EE7FF" stop-opacity="0.45"/><stop offset="100%" stop-color="#7B61FF" stop-opacity="0"/></radialGradient></defs><circle cx="256" cy="256" r="210" fill="url(#${id}-g)"/></svg>`;
}
