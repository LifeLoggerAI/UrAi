import { getUraiAssetRuntimePath, getUraiRouteAssets } from "@/lib/uraiAssetFactory";

type AssetFactoryRoutePanelProps = {
  route: string;
  title?: string;
  compact?: boolean;
};

function statusCopy(status: string) {
  if (status === "ready") return "Ready";
  if (status === "placeholder") return "Placeholder";
  if (status === "missing") return "Missing";
  return status;
}

export function AssetFactoryRoutePanel({ route, title = "Launch Asset Pipeline", compact = false }: AssetFactoryRoutePanelProps) {
  const assets = getUraiRouteAssets(route);
  const ready = assets.filter((asset) => asset.status === "ready").length;
  const placeholders = assets.filter((asset) => asset.status === "placeholder").length;
  const missing = assets.filter((asset) => !getUraiAssetRuntimePath(asset)).length;

  return (
    <section className="relative z-30 mx-auto max-w-7xl px-5 pb-6 md:px-8" aria-label={`${title} route assets`}>
      <div className="rounded-[1.6rem] border border-cyan-100/16 bg-slate-950/62 p-4 text-white shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[0.6rem] font-black uppercase tracking-[0.28em] text-cyan-100/62">{title}</p>
            <h2 className="mt-1 text-lg font-black tracking-[-0.04em] text-white">{route} world asset slots</h2>
          </div>
          <div className="flex flex-wrap gap-2 text-[0.62rem] font-black uppercase tracking-[0.16em]">
            <span className="rounded-full border border-emerald-100/20 bg-emerald-100/8 px-3 py-1 text-emerald-50/78">{ready} ready</span>
            <span className="rounded-full border border-amber-100/20 bg-amber-100/8 px-3 py-1 text-amber-50/78">{placeholders} placeholder</span>
            <span className="rounded-full border border-rose-100/20 bg-rose-100/8 px-3 py-1 text-rose-50/78">{missing} missing</span>
          </div>
        </div>

        {!compact ? (
          <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => (
              <article key={asset.asset_id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-black leading-5 text-white">{asset.name}</h3>
                  <span className="rounded-full border border-white/10 bg-black/24 px-2 py-1 text-[0.52rem] font-black uppercase tracking-[0.14em] text-white/58">
                    {statusCopy(asset.status)}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-5 text-white/58">{asset.purpose}</p>
                <p className="mt-2 truncate text-[0.58rem] font-bold uppercase tracking-[0.14em] text-cyan-100/48">
                  Runtime: {getUraiAssetRuntimePath(asset) ?? "none"}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
