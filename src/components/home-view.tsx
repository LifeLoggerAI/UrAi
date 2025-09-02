
"use client";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { pickAsset } from "@/lib/assets";
import { requestNarrationQueue, preloadNarrations, playSequence } from "@/lib/narrator";
import { generateCombinedScript, Persona } from "@/lib/narrator-scripts";
import { runDummyUser } from "@/lib/dummyUser";
import OrbLottie from "@/components/OrbLottie";
import TiltScene from "@/components/tilt-scene";
import { useToasts } from "@/lib/useToasts";
import { useVideoPreloader } from "@/lib/useVideoPreloader";
import { trackEvent } from "@/lib/analytics";
import { getAuth } from "firebase/auth";

type Category =
  | "neutral" | "growth" | "fracture" | "healing" | "cosmic"
  | "bloom" | "shadow" | "energy" | "seasonal";
type Variant = "a" | "b" | "c" | undefined;

const CATEGORIES: Category[] = [
  "neutral","growth","fracture","healing","cosmic","bloom","shadow","energy","seasonal"
];

export function HomeView() {
  const { push: pushToast } = useToasts();
  const { enqueue: preloadVideo } = useVideoPreloader(2);

  const [syncMode, setSyncMode] = useState(true);

  const [skyCategory, setSkyCategory] = useState<Category>("seasonal");
  const [skyIndex, setSkyIndex] = useState<number>(20);
  const [skyVariant, setSkyVariant] = useState<Variant>("a");
  const [skySrc, setSkySrc] = useState<string>("");

  const [groundCategory, setGroundCategory] = useState<Category>("seasonal");
  const [groundIndex, setGroundIndex] = useState<number>(20);
  const [groundVariant, setGroundVariant] = useState<Variant>("a");
  const [groundSrc, setGroundSrc] = useState<string>("");

  const [persona, setPersona] = useState<Persona>("gentle");
  const [hasNarrated, setHasNarrated] = useState(false);
  const [seqCtl, setSeqCtl] = useState<{ cancel: ()=>void }|null>(null);
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");

  const [skyInfo, setSkyInfo] = useState<{nw:number, nh:number, bw:number, bh:number}|null>(null);
  const [groundInfo, setGroundInfo] = useState<{nw:number, nh:number, bw:number, bh:number}|null>(null);

  const [showGuides, setShowGuides] = useState(true);
  const [groundPlanePx, setGroundPlanePx] = useState(700);
  const [horizonPct, setHorizonPct] = useState(0.60);
  const [safeMarginPx, setSafeMarginPx] = useState(24);
  const [showAvatar, setShowAvatar] = useState(false);

  const [showOrb, setShowOrb] = useState(true);
  const [orbSpeed, setOrbSpeed] = useState(1);
  const [orbOpacity, setOrbOpacity] = useState(0.9);
  const [orbOffset, setOrbOffset] = useState(60);
  const [isOrbPlaying, setIsOrbPlaying] = useState(true);

  // New state for tilt scene mode
  const [useTiltScene, setUseTiltScene] = useState(false);
  const [tiltMode, setTiltMode] = useState<'sky' | 'horizon' | 'ground'>('horizon');


  const mainSceneRef = useRef<HTMLDivElement>(null);

  const skyRef = useCallback((el: HTMLVideoElement|null) => {
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSkyInfo({ nw: el.videoWidth, nh: el.videoHeight, bw: Math.round(r.width), bh: Math.round(r.height) });
    };
    el.addEventListener("loadedmetadata", update);
    window.addEventListener("resize", update);
    update();
  }, []);

  const groundRef = useCallback((el: HTMLVideoElement|null) => {
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setGroundInfo({ nw: el.videoWidth, nh: el.videoHeight, bw: Math.round(r.width), bh: Math.round(r.height) });
    };
    el.addEventListener("loadedmetadata", update);
    window.addEventListener("resize", update);
    update();
  }, []);

  const cycleVariant = (layer: "sky"|"ground") => {
    const cycle = (v: Variant): Variant =>
      v === undefined ? "a" : v === "a" ? "b" : v === "b" ? "c" : undefined;
    if (layer === "sky") {
        const newVar = cycle(skyVariant);
        setSkyVariant(newVar);
        if (syncMode) setGroundVariant(newVar);
    } else {
        setGroundVariant(cycle(groundVariant));
    }
  };

  const handleIndexChange = (layer: "sky" | "ground", value: number) => {
    const newIndex = Math.max(1, Math.min(20, value));
    if (layer === 'sky') {
      setSkyIndex(newIndex);
      if (syncMode) setGroundIndex(newIndex);
    } else {
      setGroundIndex(newIndex);
    }
  };

  const handleCategoryChange = (layer: "sky" | "ground", value: Category) => {
    if (layer === 'sky') {
      setSkyCategory(value);
      if (syncMode) setGroundCategory(value);
    } else {
      setGroundCategory(value);
    }
  };

  const randomizeScene = useCallback(() => {
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const randomIndex = Math.floor(Math.random() * 20) + 1;
    const randomVariant = ([undefined, "a", "b", "c"] as Variant[])[Math.floor(Math.random() * 4)];

    setSkyCategory(randomCategory);
    setSkyIndex(randomIndex);
    setSkyVariant(randomVariant);

    if (syncMode) {
      setGroundCategory(randomCategory);
      setGroundIndex(randomIndex);
      setGroundVariant(randomVariant);
    }
  }, [syncMode]);

  const randomizeWrapped = useCallback(() => {
    try {
      randomizeScene();
      trackEvent("randomize", {}).catch(()=>{});
    } catch {}
  },[randomizeScene]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, select, button')) return;
      if (e.key === "v") cycleVariant("sky");
      if (e.key === "[") handleIndexChange("sky", skyIndex - 1);
      if (e.key === "]") handleIndexChange("sky", skyIndex + 1);
      if (e.key === "r") randomizeWrapped();
       if (e.key.toLowerCase() === "f") {
        setFitMode(m => (m === "cover" ? "contain" : "cover"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [syncMode, skyIndex, cycleVariant, randomizeWrapped, handleIndexChange]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const s = await pickAsset("sky", skyCategory, skyIndex, skyVariant);
        if (!cancelled) setSkySrc(s);
      } catch (e) { console.error(e); if (!cancelled) setSkySrc(""); }
    })();
    return () => { cancelled = true; };
  }, [skyCategory, skyIndex, skyVariant]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const g = await pickAsset("ground", groundCategory, groundIndex, groundVariant);
        if (!cancelled) setGroundSrc(g);
      } catch (e) { console.error(e); if (!cancelled) setGroundSrc(""); }
    })();
    return () => { cancelled = true; };
  }, [groundCategory, groundIndex, groundVariant]);

  useEffect(() => {
    const ni = skyIndex === 20 ? 1 : skyIndex + 1;
    pickAsset("sky", skyCategory, ni, skyVariant).then(url => preloadVideo(url)).catch(()=>{});
    const gi = groundIndex === 20 ? 1 : groundIndex + 1;
    pickAsset("ground", groundCategory, gi, groundVariant).then(url => preloadVideo(url)).catch(()=>{});
  }, [skyCategory, skyIndex, skyVariant, groundCategory, groundIndex, groundVariant, preloadVideo]);
  
  useEffect(() => {
    if (skySrc && groundSrc) {
      trackEvent("scene_load", { skyCategory, skyIndex, skyVariant, groundCategory, groundIndex, groundVariant })
        .catch(()=>pushToast({ kind:"error", text:"Analytics: scene_load failed" }));
    }
  }, [skySrc, groundSrc, skyCategory, skyIndex, skyVariant, groundCategory, groundIndex, groundVariant, pushToast]);


  const startSceneNarration = useCallback(async () => {
    try {
      trackEvent("speak_start", {}).catch(()=>{});
      const { lines, preset } = generateCombinedScript(
        { category: skyCategory, index: skyIndex, variant: skyVariant },
        { category: groundCategory, index: groundIndex, variant: groundVariant },
        persona
      );
      const results = await requestNarrationQueue(lines, preset);
      const audioMap = await preloadNarrations(results);
      const ctl = playSequence(lines.map(i => i.clipId), audioMap);
      setSeqCtl(ctl);
      trackEvent("speak_success", {}).catch(()=>{});
    } catch (e: any) {
      console.error("Narration failed:", e);
      pushToast({ kind:"error", text: `Narration failed: ${e.message}` });
      trackEvent("speak_fail", { error: e.message }).catch(()=>{});
    }
  }, [skyCategory, skyIndex, skyVariant, groundCategory, groundIndex, groundVariant, persona, pushToast]);

  const speakSceneNow = useCallback(async () => {
    seqCtl?.cancel?.();
    setHasNarrated(true);
    await startSceneNarration();
  }, [seqCtl, startSceneNarration]);

  const stopSpeaking = useCallback(() => {
    seqCtl?.cancel?.();
  }, [seqCtl]);

  const onTap = useCallback(() => {
    if (syncMode) {
      const newVar = skyVariant === undefined ? "a" : skyVariant === "a" ? "b" : skyVariant === "b" ? "c" : undefined;
      setSkyVariant(newVar);
      setGroundVariant(newVar);
    } else {
      cycleVariant("sky");
    }
    if (!hasNarrated) {
      setHasNarrated(true);
      startSceneNarration();
    }
  }, [hasNarrated, startSceneNarration, syncMode, skyVariant, cycleVariant]);

  useEffect(()=>()=>{ seqCtl?.cancel?.(); }, [seqCtl]);

  const handleExport = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        pushToast({ kind: 'error', text: 'You must be signed in to export.' });
        return;
    }
    const idToken = await user.getIdToken();
    pushToast({ kind: 'info', text: 'Queueing export job...' });
    try {
        const res = await fetch('/api/export', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({
                skyUrl: new URL(skySrc, window.location.origin).href,
                groundUrl: new URL(groundSrc, window.location.origin).href,
                durationSec: 12,
            })
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Failed to queue export.');
        }
        const data = await res.json();
        pushToast({ kind: 'success', text: `Export job ${data.jobId} created!` });
    } catch(e: any) {
        pushToast({ kind: 'error', text: `Export failed: ${e.message}` });
    }
  };

  const ready = useMemo(() => !!skySrc && !!groundSrc, [skySrc, groundSrc]);

  return (
    <div
      ref={mainSceneRef}
      className="relative w-full h-dvh overflow-hidden bg-black select-none"
      onClick={onTap}
    >
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-white/70">
          Loading scene…
        </div>
      )}

      {/* Render either TiltScene or traditional video layers */}
      {useTiltScene ? (
        <TiltScene
          skyCategory={skyCategory}
          groundCategory={groundCategory}
          skyIndex={skyIndex}
          groundIndex={groundIndex}
          skyVariant={skyVariant}
          groundVariant={groundVariant}
          persona={persona}
          onModeChange={setTiltMode}
          enableBatteryOptimization={true}
          enablePerformanceOptimization={true}
          className="absolute inset-0"
        />
      ) : (
        <>
          {skySrc && (
            <video
              ref={skyRef}
              key={skySrc}
              className={`absolute inset-0 w-full h-full object-${fitMode} z-10`}
              src={skySrc}
              playsInline
              muted
              loop
              autoPlay
              onError={() => pushToast({ kind:"error", text:"Sky failed to load" })}
            />
          )}

          {groundSrc && (
            <video
              ref={groundRef}
              key={groundSrc}
              className={`absolute inset-0 w-full h-full object-${fitMode} z-20`}
              src={groundSrc}
              playsInline
              muted
              loop
              autoPlay
              onError={() => pushToast({ kind:"error", text:"Ground failed to load" })}
            />
          )}
        </>
      )}

      {showAvatar && (
        <img
          src="/assets/avatar/poses/avatar-neutral.png"
          alt="avatar"
          className="absolute left-1/2 -translate-x-1/2 w-[600px] z-30 pointer-events-none"
          style={{ bottom: groundPlanePx }}
        />
      )}
      
      {showOrb && (
        <OrbLottie
          jsonPath="/assets/orb/orb.json"
          width={192}
          height={192}
          opacity={orbOpacity}
          speed={orbSpeed}
          isPlaying={isOrbPlaying}
          bottom={groundPlanePx + orbOffset}
        />
      )}


      {showGuides && (
        <div className="pointer-events-none absolute inset-0 z-[55]">
          <div className="absolute inset-0" />
          <div
            className="absolute border border-white/30 rounded-xl"
            style={{
              top: safeMarginPx,
              left: safeMarginPx,
              right: safeMarginPx,
              bottom: safeMarginPx
            }}
          />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
          <div
            className="absolute left-0 right-0 h-px bg-emerald-300/70"
            style={{ top: `calc(${horizonPct * 100}% )` }}
          />
          <div
            className="absolute px-2 py-1 text-[10px] font-medium text-emerald-900 bg-emerald-300/80 rounded"
            style={{ top: `calc(${horizonPct * 100}% - 18px)`, left: 8 }}
          >
            horizon ~{Math.round(horizonPct * 100)}%
          </div>
          <div
            className="absolute left-0 right-0 bg-fuchsia-400/15 border-t border-fuchsia-400/70"
            style={{ bottom: 0, height: groundPlanePx }}
          />
          <div
            className="absolute px-2 py-1 text-[10px] font-medium text-fuchsia-900 bg-fuchsia-300/80 rounded"
            style={{ bottom: groundPlanePx + 6, left: 8 }}
          >
            ground plane {groundPlanePx}px
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={`h-${i}`}
              className="absolute left-0 right-0 h-px bg-white/20"
              style={{ top: `${((i + 1) * 100) / 3}%` }}
            />
          ))}
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={`v-${i}`}
              className="absolute top-0 bottom-0 w-px bg-white/20"
              style={{ left: `${((i + 1) * 100) / 3}%` }}
            />
          ))}
        </div>
      )}

      <div className="absolute top-3 left-3 z-[60] bg-black/60 text-white rounded-2xl px-4 py-3 space-y-3 shadow-lg backdrop-blur" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <div className="text-sm font-semibold">URAI Scene QA</div>
          <label className="flex items-center gap-1 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={syncMode}
              onChange={(e)=>{
                setSyncMode(e.target.checked);
                if (e.target.checked) {
                  setGroundCategory(skyCategory);
                  setGroundIndex(skyIndex);
                  setGroundVariant(skyVariant);
                }
              }}
            />
            Sync
          </label>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold">Sky</div>
          <select
            className="bg-white/10 rounded px-2 py-1 text-sm w-full"
            value={skyCategory}
            onChange={(e) => handleCategoryChange('sky', e.target.value as Category)}
          >
            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            min={1} max={20}
            className="w-full bg-white/10 rounded px-2 py-1 text-sm"
            value={skyIndex}
            onChange={e=>handleIndexChange('sky', Number(e.target.value))}
          />
        </div>

        {!syncMode && (
        <div className="space-y-1">
          <div className="text-xs font-semibold">Ground</div>
          <select
            disabled={syncMode}
            className="bg-white/10 rounded px-2 py-1 text-sm w-full"
            value={groundCategory}
            onChange={(e)=>setGroundCategory(e.target.value as Category)}
          >
            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            disabled={syncMode}
            min={1} max={20}
            className="w-full bg-white/10 rounded px-2 py-1 text-sm"
            value={groundIndex}
            onChange={e=>setGroundIndex(Number(e.target.value))}
          />
        </div>
        )}

        <div className="space-y-1">
          <div className="text-xs font-semibold">Persona</div>
          <select
            className="bg-white/10 rounded px-2 py-1 text-sm w-full"
            value={persona}
            onChange={(e)=>setPersona(e.target.value as Persona)}
          >
            <option value="gentle">Gentle</option>
            <option value="mythic">Mythic</option>
            <option value="playful">Playful</option>
            <option value="coach">Coach</option>
          </select>
        </div>

        <div className="space-y-1">
          <div className="text-xs font-semibold">Fit Mode</div>
          <select
            className="bg-white/10 rounded px-2 py-1 text-sm w-full"
            value={fitMode}
            onChange={(e)=>setFitMode(e.target.value as "cover"|"contain")}
          >
            <option value="cover">Cover (fill screen, crop edges)</option>
            <option value="contain">Contain (full video, may letterbox)</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            onClick={speakSceneNow}
            className="flex-1 bg-white/10 hover:bg-white/20 text-xs px-2 py-1 rounded"
            aria-label="Speak Scene Now"
          >
            🔊 Speak Scene Now
          </button>
          <button
            onClick={stopSpeaking}
            className="px-2 py-1 rounded text-xs bg-white/10 hover:bg-white/20"
            aria-label="Stop Narration"
          >
            ⏹ Stop
          </button>
        </div>
        
        <div className="space-y-2 pt-2 border-t border-white/10">
          <button onClick={handleExport} className="w-full bg-white/10 hover:bg-white/20 text-xs px-2 py-1 rounded">
            Export 10s Clip
          </button>
          <button
            className="w-full bg-white/10 hover:bg-white/20 text-xs px-2 py-1 rounded"
            onClick={async () => {
              try {
                const data = await runDummyUser("test-user-001", persona);
                pushToast({ kind: "success", text: "Dummy user run complete."});
                for (const clip of data.tts) {
                  const a = new Audio(clip.url);
                  await a.play();
                  await new Promise<void>(resolve => a.addEventListener("ended", () => resolve(), { once: true }));
                }
              } catch (e: any) {
                console.error(e);
                pushToast({ kind: "error", text: `Dummy user failed: ${e.message}`});
              }
            }}
          >
            🧪 Run Dummy User
          </button>
        </div>

        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Orb</div>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={showOrb} onChange={(e)=>setShowOrb(e.target.checked)} />
              Show
            </label>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={isOrbPlaying} onChange={(e)=>setIsOrbPlaying(e.target.checked)} />
            Playing
          </label>
          <label className="text-xs opacity-80">Speed: {orbSpeed.toFixed(2)}</label>
          <input type="range" min={0.2} max={3} step={0.05} value={orbSpeed} onChange={(e)=>setOrbSpeed(Number(e.target.value))} className="w-full" />
          <label className="text-xs opacity-80">Opacity: {Math.round(orbOpacity*100)}%</label>
          <input type="range" min={0.2} max={1} step={0.05} value={orbOpacity} onChange={(e)=>setOrbOpacity(Number(e.target.value))} className="w-full" />
          <label className="text-xs opacity-80">Orb Offset (px): {orbOffset}</label>
          <input type="range" min={20} max={120} step={2} value={orbOffset} onChange={(e)=>setOrbOffset(Number(e.target.value))} className="w-full" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="text-sm font-semibold">Tilt Scene</div>
          <label className="flex items-center gap-2 text-xs">
            <input 
              type="checkbox" 
              checked={useTiltScene} 
              onChange={(e) => setUseTiltScene(e.target.checked)} 
            />
            Enable
          </label>
        </div>

        {useTiltScene && (
          <div className="space-y-1">
            <div className="text-xs opacity-80">Current Mode: {tiltMode}</div>
            <div className="text-xs opacity-60">
              Tilt device up/down to switch between sky/horizon/ground
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="text-sm font-semibold">Guides</div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={showGuides} onChange={(e)=>setShowGuides(e.target.checked)} />
            Show
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Avatar</div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={showAvatar}
              onChange={(e)=>setShowAvatar(e.target.checked)}
            />
            Show
          </label>
        </div>

        <div className="space-y-1">
          <label className="text-xs opacity-80">Ground Plane (px): {groundPlanePx}</label>
          <input
            type="range" min={500} max={900} step={5}
            value={groundPlanePx}
            onChange={(e)=>setGroundPlanePx(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs opacity-80">Horizon (%): {Math.round(horizonPct*100)}</label>
          <input
            type="range" min={30} max={80} step={1}
            value={Math.round(horizonPct*100)}
            onChange={(e)=>setHorizonPct(Number(e.target.value)/100)}
            className="w-full"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs opacity-80">Safe Margin (px): {safeMarginPx}</label>
          <input
            type="range" min={0} max={64} step={2}
            value={safeMarginPx}
            onChange={(e)=>setSafeMarginPx(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="text-[11px] opacity-80 leading-tight max-w-[70vw] pt-2 border-t border-white/10">
          <div className="truncate">Sky: {skySrc || "…"}</div>
          <div className="truncate">Ground: {groundSrc || "…"}</div>
          <div className="mt-1 opacity-60">
            Fit: {fitMode} (press 'f' to toggle)
          </div>
        </div>

        <div className="text-[11px] opacity-80 leading-tight mt-2">
          {skyInfo && <div>Sky: natural {skyInfo.nw}×{skyInfo.nh} → box {skyInfo.bw}×{skyInfo.bh}</div>}
          {groundInfo && <div>Ground: natural {groundInfo.nw}×{groundInfo.nh} → box {groundInfo.bw}×{groundInfo.bh}</div>}
          <div className="opacity-60">Goal: natural ~1440×3240; box ≈ device viewport; fit=object-cover</div>
        </div>
      </div>
    </div>
  );
}
