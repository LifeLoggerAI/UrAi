import Script from "next/script";

const arModelPath = "/assets/ar/urai-genesis-orb.gltf";

export function ARModelViewerPreview() {
  return (
    <section className="rounded-[2rem] border border-cyan-100/15 bg-white/[0.045] p-4 text-white shadow-2xl shadow-black/20 backdrop-blur-2xl" aria-label="Supported mobile AR preview">
      <Script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" strategy="afterInteractive" />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[0.64rem] font-black uppercase tracking-[0.3em] text-cyan-100/64">AR preview gated to supported mobile devices</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Real model-based AR entry, no fake canvas button.</h2>
        </div>
        <a href={arModelPath} className="rounded-full border border-white/15 bg-white/7 px-4 py-2 text-sm font-bold text-white/72 transition hover:bg-white/12">
          Open 3D asset
        </a>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/65">
        <div
          dangerouslySetInnerHTML={{
            __html: `<model-viewer src="${arModelPath}" ar ar-modes="webxr scene-viewer" camera-controls auto-rotate interaction-prompt="auto" ar-placement="floor" shadow-intensity="0.55" exposure="0.9" alt="URAI Genesis minimal AR proof asset" style="display:block;width:100%;height:28rem;background:radial-gradient(circle at 50% 20%, rgba(125,211,252,0.18), transparent 32%), #020617;"></model-viewer>`,
          }}
        />
      </div>

      <div className="mt-4 grid gap-3 text-sm leading-6 text-white/66 md:grid-cols-2">
        <p className="rounded-2xl border border-cyan-100/12 bg-cyan-100/[0.055] p-3">
          The 3D model preview is available anywhere the web component loads. AR entry is delegated to supported browser paths only: WebXR immersive-ar or Android Scene Viewer. iOS Quick Look remains gated until a verified USDZ asset is added.
        </p>
        <p className="rounded-2xl border border-amber-100/14 bg-amber-100/[0.055] p-3 text-amber-50/74">
          If the browser/device does not support AR, this stays a normal 3D model preview and does not claim headset/mobile AR compatibility.
        </p>
      </div>
    </section>
  );
}
