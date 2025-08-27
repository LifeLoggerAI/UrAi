type Layer = "sky" | "ground";
type Category =
  | "neutral" | "growth" | "fracture" | "healing" | "cosmic"
  | "bloom" | "shadow" | "energy" | "seasonal";

type Manifest = {
  defaults: { fps: number; width: number; height: number; floorSafeZonePx?: number; horizonSafeZonePx?: number };
  basePath: string; // accept '/public/assets/...' or '/assets/...'
  categories: Record<Category, string[]>;
};

const normalizeBasePath = (p: string) => p.replace(/^\/public/, "");

const manifestUrlFor = (layer: Layer) =>
  layer === "ground"
    ? "/assets/ground/manifests/ground.manifest.json"
    : "/assets/sky/manifests/sky.manifest.json";

const loadManifest = async (layer: Layer): Promise<Manifest> => {
  const res = await fetch(manifestUrlFor(layer));
  if (!res.ok) throw new Error(`Failed to load ${layer} manifest`);
  const m = (await res.json()) as Manifest;
  m.basePath = normalizeBasePath(m.basePath);
  return m;
};

export const pickAsset = async (
  layer: Layer,
  category: Category,
  index: number,           // 1..20
  variant?: "a" | "b" | "c"
): Promise<string> => {
  const manifest = await loadManifest(layer);
  const list = manifest.categories[category] || [];
  const id = String(index).padStart(2, "0");
  const base = `${layer}-${category}-${id}.mp4`;
  const withVar = variant ? `${layer}-${category}-${id}${variant}.mp4` : base;

  const pick =
    list.find(f => f.endsWith(withVar)) ??
    list.find(f => f.endsWith(base)) ??
    list[0];

  if (!pick) throw new Error(`No asset for ${layer}/${category}/${id}${variant ?? ""}`);
  return `${manifest.basePath}/${category}/${pick}`;
};
