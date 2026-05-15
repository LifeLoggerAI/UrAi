"use client";

import { useEffect, useMemo, useState } from "react";
import HomeWebGLSky from "@/components/HomeWebGLSky";
import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { useEmotionalTone } from "@/components/lifemap/useEmotionalTone";
import { adamClampDemoProfile } from "@/lib/demo-data";
import { resolveUraiAssets, type UraiResolvedAsset, type UraiVisualSlot } from "@/lib/urai-assets";

type HomeMode = "home" | "transitioning" | "lifemap";
type HomePanel = "forecast" | "reflection" | "whisper" | "access" | null;

const HOME_VISUAL_SLOTS: UraiVisualSlot[] = [
  "home.sky.background",
  "home.sky.clouds",
  "home.aura.blob",
  "home.orb.core",
  "home.silhouette.body",
  "home.ground.base",
];

const TONE_COPY = {
  calm: { whisper: "A quiet pattern is becoming visible.", opening: "The sky is opening." },
  focused: { whisper: "A small signal is asking for attention.", opening: "The stars are drawing upward." },
  charged: { whisper: "Something bright is rising through the noise.", opening: "The active pattern is opening." },
  restorative: { whisper: "Recovery is returning softly.", opening: "The sky is lifting gently." },
};

function titleCase(value: string) {
  return value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function assetBackground(asset?: UraiResolvedAsset) {
  if (!asset?.src) return undefined;
  return { backgroundImage: `url(${asset.src})` };
}

function AvatarSilhouette() {
  return (
    <svg className="avatar-svg" viewBox="0 0 220 520" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="avatarFade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(234,247,255,.72)" />
          <stop offset=".32" stopColor="rgba(126,212,247,.34)" />
          <stop offset=".72" stopColor="rgba(42,105,138,.11)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <radialGradient id="avatarFace" cx="72%" cy="36%" r="58%">
          <stop offset="0" stopColor="rgba(255,255,255,.9)" />
          <stop offset=".4" stopColor="rgba(208,236,255,.34)" />
          <stop offset="1" stopColor="rgba(125,211,252,0)" />
        </radialGradient>
        <filter id="avatarBlur" x="-70%" y="-70%" width="240%" height="240%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <ellipse className="avatar-aura-svg" cx="112" cy="300" rx="82" ry="190" />
      <path className="avatar-body-svg" d="M116 62 C142 68 158 91 160 121 C162 153 148 179 128 197 C153 231 163 284 158 350 C154 408 151 463 157 505 C128 520 90 520 61 505 C67 463 69 408 63 350 C56 284 72 231 101 197 C82 179 72 153 76 122 C80 92 94 66 116 62 Z" />
      <path className="avatar-head-svg" d="M117 54 C139 56 154 77 154 103 C154 130 137 150 117 151 C96 151 82 132 85 108 C88 80 98 56 117 54 Z" />
      <path className="avatar-face-svg" d="M136 92 C150 100 161 114 170 132" />
      <path className="avatar-gaze-svg" d="M136 118 C166 155 181 204 186 251" />
      <circle className="avatar-heart-svg" cx="112" cy="267" r="5.5" />
      <ellipse className="avatar-shadow-svg" cx="110" cy="505" rx="58" ry="9" />
    </svg>
  );
}

export default function HomeScene() {
  const profile = adamClampDemoProfile;
  const [mode, setMode] = useState<HomeMode>("home");
  const [activePanel, setActivePanel] = useState<HomePanel>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const emotionalTone = useEmotionalTone();
  const visualAssets = useMemo(() => resolveUraiAssets(HOME_VISUAL_SLOTS), []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);
    return () => mq.removeEventListener("change", syncMotion);
  }, []);

  const transitionDuration = useMemo(() => {
    if (reduceMotion) return 0;
    if (emotionalTone === "restorative") return 1900;
    if (emotionalTone === "charged") return 1300;
    if (emotionalTone === "focused") return 1500;
    return 1650;
  }, [emotionalTone, reduceMotion]);

  useEffect(() => {
    if (mode !== "transitioning") return undefined;
    if (reduceMotion) {
      setMode("lifemap");
      return undefined;
    }
    const timer = window.setTimeout(() => setMode("lifemap"), transitionDuration);
    return () => window.clearTimeout(timer);
  }, [mode, reduceMotion, transitionDuration]);

  const openLifeMap = () => {
    if (mode !== "home") return;
    setActivePanel(null);
    setMode(reduceMotion ? "lifemap" : "transitioning");
  };

  const returnHome = () => {
    setActivePanel(null);
    setMode("home");
  };

  if (mode === "lifemap") {
    return (
      <div className="relative h-dvh w-full overflow-hidden bg-black">
        <LifeMapScene />
        <button type="button" onClick={returnHome} className="absolute left-4 top-4 z-50 rounded-full border border-white/24 bg-black/40 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10" aria-label="Return to home scene">
          Return home
        </button>
      </div>
    );
  }

  const isTransitioning = mode === "transitioning";
  const copy = TONE_COPY[emotionalTone];
  const forecast = profile.moodForecast;
  const reflection = profile.weeklyReflection;
  const forecastState = titleCase(forecast.rhythmState);
  const confidence = Math.round(forecast.confidence * 100);

  return (
    <main className={`home-scene tone-${emotionalTone} ${isTransitioning ? "is-transitioning" : ""}`} onClick={openLifeMap}>
      <button type="button" onClick={(event) => { event.stopPropagation(); openLifeMap(); }} disabled={isTransitioning} className="sky-trigger" aria-label="Ascend through the sky into the URAI Life Map">
        <span className="sr-only">Ascend through the sky into the URAI Life Map</span>
      </button>

      <div className="asset-layer asset-sky" style={assetBackground(visualAssets["home.sky.background"])} aria-hidden />
      <div className="sky-base" aria-hidden />
      <HomeWebGLSky />
      <div className="asset-layer asset-clouds" style={assetBackground(visualAssets["home.sky.clouds"])} aria-hidden />
      <div className="sky-depth" aria-hidden />
      <div className="sky-portal" aria-hidden><span className="portal-core" /><span className="portal-ring ring-one" /><span className="portal-ring ring-two" /></div>
      <div className="star-tunnel" aria-hidden><span /><span /><span /><span /><span /></div>
      <div className="asset-layer asset-ground" style={assetBackground(visualAssets["home.ground.base"])} aria-hidden />
      <div className="terrain-world" aria-hidden><span className="terrain-mist" /><span className="hill hill-back" /><span className="hill hill-front" /></div>
      <div className="orb-wash" style={assetBackground(visualAssets["home.aura.blob"])} aria-hidden />
      <div className="avatar-figure" aria-hidden>
        <div className="asset-avatar" style={assetBackground(visualAssets["home.silhouette.body"])} aria-hidden />
        <AvatarSilhouette />
      </div>

      <section className="world-stage" aria-label="URAI emotional home scene">
        <button type="button" className="companion-orb" onClick={(event) => { event.stopPropagation(); openLifeMap(); }} disabled={isTransitioning} aria-label="Ascend into Life Map">
          <span className="orb-glow" />
          <span className="asset-orb" style={assetBackground(visualAssets["home.orb.core"])} />
          <span className="orb-core" />
          <span className="orb-ring orb-ring-one" />
          <span className="orb-ring orb-ring-two" />
          <span className="orb-shadow" />
        </button>

        <p className="sky-whisper" aria-live="polite">{isTransitioning ? copy.opening : copy.whisper}</p>
        <p className="ascend-hint">Click the upper sky</p>

        <button type="button" className="explain-glyph" onClick={(event) => { event.stopPropagation(); setActivePanel(activePanel ? null : "whisper"); }} aria-label="What am I seeing?">?</button>
        <button type="button" className="access-glyph" onClick={(event) => { event.stopPropagation(); setActivePanel(activePanel === "access" ? null : "access"); }} aria-label="Open early access">demo</button>

        {activePanel && (
          <aside className="floating-panel" onClick={(event) => event.stopPropagation()}>
            {activePanel === "forecast" && <><p>Mood weather</p><h2>{forecastState}</h2><span>{forecast.summary}</span><small>Confidence {confidence}% · {forecast.nextBestAction}</small></>}
            {activePanel === "reflection" && <><p>Weekly scroll</p><h2>{reflection.title}</h2><span>{reflection.narratorSummary}</span><small>{reflection.highlights[0]}</small></>}
            {activePanel === "whisper" && <><p>What am I seeing?</p><h2>The sky is the doorway.</h2><span>The avatar and companion orb sit low in the emotional terrain. Click the upper sky to ascend into the Life Map. Local asset slots are now wired for sky, ground, silhouette, aura, and orb replacement.</span><div className="prompt-row"><button type="button" onClick={() => setActivePanel("forecast")}>Mood weather</button><button type="button" onClick={() => setActivePanel("reflection")}>Weekly scroll</button></div></>}
            {activePanel === "access" && <><p>Public demo</p><h2>Sample data only.</h2><span>No private user data is shown. Reflective insight only, not medical diagnosis.</span><div className="email-row"><input type="email" placeholder="you@example.com" aria-label="Email address" /><button type="button">Request access</button></div></>}
          </aside>
        )}
      </section>

      <style jsx>{`
        .home-scene{--tone-a:rgba(125,211,252,.18);--tone-b:rgba(196,181,253,.12);--tone-c:rgba(77,190,139,.1);--tone-speed:1;position:relative;min-height:100dvh;overflow:hidden;background:#000;color:white;isolation:isolate;user-select:none;cursor:zoom-in}.tone-focused{--tone-a:rgba(96,165,250,.2);--tone-b:rgba(45,212,191,.12);--tone-c:rgba(125,211,252,.12);--tone-speed:.9}.tone-charged{--tone-a:rgba(251,191,36,.14);--tone-b:rgba(244,114,182,.13);--tone-c:rgba(251,113,133,.1);--tone-speed:.82}.tone-restorative{--tone-a:rgba(167,139,250,.16);--tone-b:rgba(14,165,233,.12);--tone-c:rgba(110,231,183,.12);--tone-speed:1.25}
        .asset-layer,.sky-base,.sky-depth,.sky-portal,.terrain-world,.avatar-figure,.orb-wash,.star-tunnel{position:fixed;inset:0;pointer-events:none}.asset-layer{background-repeat:no-repeat;background-position:center;background-size:cover}.asset-sky{z-index:0;opacity:.22}.sky-base{z-index:1;background:radial-gradient(circle at 50% 8%,rgba(108,126,218,.34),transparent 24%),radial-gradient(ellipse at 50% 43%,rgba(50,86,148,.2),transparent 56%),linear-gradient(180deg,#01030c 0%,#071126 52%,#03110b 77%,#000 100%)}.asset-clouds{z-index:2;opacity:.16;mix-blend-mode:screen}.sky-depth{z-index:4;background:radial-gradient(circle at 50% 26%,rgba(230,242,255,.1),transparent 18%),linear-gradient(180deg,transparent 0%,rgba(0,0,0,.16) 70%,rgba(0,0,0,.84) 100%);mix-blend-mode:screen;opacity:.82}.sky-trigger{position:fixed;inset:0 0 50% 0;z-index:18;border:0;background:transparent;cursor:zoom-in}.sky-portal{z-index:12;display:grid;place-items:center;transform:translateY(-32vh);opacity:.44;transition:opacity 900ms ease,transform 1500ms cubic-bezier(.16,1,.3,1)}.portal-core{position:absolute;width:min(34vw,470px);height:min(34vw,470px);border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,.12),rgba(125,211,252,.055) 22%,transparent 62%);filter:blur(12px)}.portal-ring{position:absolute;width:min(39vw,540px);height:min(15vw,210px);border-radius:999px;border:1px solid rgba(210,232,255,.042)}.ring-one{transform:rotate(-14deg)}.ring-two{transform:rotate(18deg) scaleX(.82);opacity:.42}.star-tunnel{z-index:20;opacity:0;transform:scale(.75) translateY(12%);background:radial-gradient(circle at 50% 17%,rgba(205,225,255,.42),transparent 6%),radial-gradient(circle at 42% 38%,var(--tone-b),transparent 12%),radial-gradient(circle at 58% 42%,var(--tone-a),transparent 14%);transition:opacity 800ms ease,transform 1450ms cubic-bezier(.16,1,.3,1)}.star-tunnel span{position:absolute;width:.3rem;height:.3rem;border-radius:999px;background:white;box-shadow:0 0 14px rgba(255,255,255,.65),0 0 32px var(--tone-a);opacity:.7}.star-tunnel span:nth-child(1){left:30%;top:24%}.star-tunnel span:nth-child(2){left:45%;top:16%;width:.22rem;height:.22rem}.star-tunnel span:nth-child(3){left:58%;top:29%}.star-tunnel span:nth-child(4){left:66%;top:43%;width:.2rem;height:.2rem}.star-tunnel span:nth-child(5){left:38%;top:52%;width:.18rem;height:.18rem}
        .asset-ground{z-index:6;top:auto;height:38%;opacity:.18;background-position:center bottom;mix-blend-mode:screen}.terrain-world{z-index:8;top:auto;height:36%;bottom:0;overflow:hidden;transition:transform 1500ms cubic-bezier(.16,1,.3,1),opacity 1100ms ease}.terrain-world:before{content:"";position:absolute;inset:-44% -16% 0;background:radial-gradient(ellipse at 50% 0%,rgba(113,210,162,.08),transparent 23%),linear-gradient(180deg,transparent,rgba(2,20,13,.2) 34%,rgba(0,0,0,.99))}.terrain-mist,.hill{position:absolute}.terrain-mist{left:-12%;right:-12%;top:-48%;height:72%;background:radial-gradient(ellipse at 50% 78%,rgba(125,211,252,.06),transparent 70%);filter:blur(34px);opacity:.38}.hill{left:-22%;right:-22%;border-radius:52% 48% 0 0/16% 22% 0 0}.hill-back{bottom:52%;height:22%;background:linear-gradient(180deg,rgba(47,120,85,.05),rgba(0,0,0,0));opacity:.34;transform:rotate(-1.1deg)}.hill-front{bottom:-42%;height:84%;background:radial-gradient(ellipse at 50% 0%,rgba(91,184,132,.065),transparent 26%),linear-gradient(180deg,rgba(2,24,16,.3),rgba(0,0,0,.99));transform:rotate(-.3deg) scaleX(1.12)}
        .orb-wash{z-index:15;background-image:radial-gradient(circle at 54% 72%,rgba(210,238,255,.2),rgba(125,211,252,.11) 8%,transparent 23%),radial-gradient(circle at 40% 70%,rgba(180,226,255,.11),transparent 16%);background-size:cover;background-position:center;opacity:.9}.avatar-figure{z-index:16;left:calc(50% - min(14vw,196px));top:57%;right:auto;bottom:auto;width:clamp(178px,12vw,218px);height:clamp(390px,47vh,510px);transform:translate(-50%,-7%) rotate(-3deg);transition:transform 1500ms cubic-bezier(.16,1,.3,1),opacity 900ms ease,filter 900ms ease}.asset-avatar{position:absolute;inset:0;background-repeat:no-repeat;background-position:center bottom;background-size:contain;opacity:.14;filter:blur(.2px) drop-shadow(0 0 24px rgba(125,211,252,.12))}.avatar-svg{position:absolute;inset:0;overflow:visible;filter:drop-shadow(0 0 22px rgba(125,211,252,.14))}:global(.avatar-aura-svg){fill:rgba(125,211,252,.07);filter:url(#avatarBlur);opacity:.7}:global(.avatar-body-svg){fill:url(#avatarFade);stroke:rgba(230,245,255,.06);stroke-width:1;opacity:.74}:global(.avatar-head-svg){fill:url(#avatarFace);opacity:.7}:global(.avatar-face-svg){fill:none;stroke:rgba(230,248,255,.3);stroke-width:2;stroke-linecap:round;opacity:.56}:global(.avatar-gaze-svg){fill:none;stroke:rgba(210,240,255,.13);stroke-width:1;stroke-linecap:round;opacity:.16}:global(.avatar-heart-svg){fill:rgba(220,246,255,.44);filter:drop-shadow(0 0 12px rgba(125,211,252,.32));opacity:.56}:global(.avatar-shadow-svg){fill:rgba(125,211,252,.12);filter:blur(8px);opacity:.62}
        .world-stage{position:relative;z-index:22;min-height:100dvh;width:100%;display:grid;place-items:center;padding:2rem;transition:opacity 900ms ease,transform 1450ms cubic-bezier(.16,1,.3,1),filter 900ms ease;pointer-events:none}.world-stage button,.world-stage input,.floating-panel,.companion-orb{pointer-events:auto}.companion-orb{position:fixed;left:53%;top:74%;z-index:27;width:clamp(130px,9.5vw,168px);height:clamp(130px,9.5vw,168px);transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;cursor:zoom-in;transition:transform 1450ms cubic-bezier(.16,1,.3,1),opacity 900ms ease,filter 900ms ease}.orb-glow,.orb-core,.orb-ring,.orb-shadow,.asset-orb{position:absolute;border-radius:999px}.orb-glow{inset:-76%;background:radial-gradient(circle,rgba(255,255,255,.2),var(--tone-a) 30%,transparent 70%);filter:blur(18px);opacity:.96;animation:orbBreathe calc(5.8s * var(--tone-speed)) ease-in-out infinite}.asset-orb{inset:14%;background-repeat:no-repeat;background-size:contain;background-position:center;opacity:.32;mix-blend-mode:screen}.orb-core{inset:19%;background:radial-gradient(circle at 38% 32%,#fff,rgba(219,242,255,.96) 18%,rgba(125,211,252,.72) 48%,rgba(45,89,120,.2) 76%,transparent 100%);box-shadow:0 0 24px rgba(255,255,255,.8),0 0 84px rgba(125,211,252,.48),0 0 150px rgba(196,181,253,.15)}.orb-ring-one{inset:0;border:1px solid rgba(255,255,255,.2);box-shadow:inset 0 0 22px rgba(125,211,252,.07);animation:orbOrbit calc(18s * var(--tone-speed)) linear infinite}.orb-ring-two{inset:10%;border:1px solid rgba(196,181,253,.15);transform:rotate(32deg) scaleX(.74);animation:orbOrbit calc(24s * var(--tone-speed)) linear infinite reverse}.orb-shadow{left:50%;top:94%;width:138%;height:24%;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(160,225,255,.24),transparent 70%);filter:blur(9px);opacity:.92}
        .sky-whisper{position:fixed;left:50%;top:20%;z-index:29;width:min(520px,calc(100vw - 2rem));transform:translateX(-50%);margin:0;text-align:center;font-size:clamp(.9rem,1.12vw,1.04rem);line-height:1.45;color:rgba(255,255,255,.72);text-shadow:0 2px 24px rgba(0,0,0,.75);transition:opacity .8s ease,transform 1.2s ease}.ascend-hint{position:fixed;left:50%;top:26%;z-index:28;transform:translateX(-50%);margin:0;font-size:.54rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.1);animation:hintFade 5s ease-in-out infinite}.explain-glyph,.access-glyph{position:fixed;z-index:34;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.12);color:rgba(255,255,255,.42);backdrop-filter:blur(10px);cursor:pointer;opacity:.64;transition:opacity .2s ease,transform .2s ease,background .2s ease}.explain-glyph{right:1rem;bottom:1rem;width:2.1rem;height:2.1rem;border-radius:999px;font-weight:700}.access-glyph{left:1rem;bottom:1rem;border-radius:999px;padding:.45rem .75rem;font-size:.58rem;letter-spacing:.16em;text-transform:uppercase}.explain-glyph:hover,.access-glyph:hover{opacity:1;transform:translateY(-1px);background:rgba(255,255,255,.08)}.floating-panel{position:fixed;left:50%;bottom:4.6rem;z-index:38;width:min(520px,calc(100vw - 2rem));transform:translateX(-50%);border:1px solid rgba(255,255,255,.16);border-radius:28px;background:rgba(5,9,22,.72);padding:1.05rem;text-align:center;box-shadow:0 32px 90px rgba(0,0,0,.34);backdrop-filter:blur(18px);animation:panelIn .3s cubic-bezier(.19,1,.22,1) both}.floating-panel p{margin:0 0 .4rem;font-size:.66rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.45)}.floating-panel h2{margin:0 0 .5rem;font-size:clamp(1.25rem,2vw,1.8rem)}.floating-panel span{display:block;color:rgba(255,255,255,.76);line-height:1.55}.floating-panel small{display:block;margin-top:.7rem;color:rgba(255,255,255,.52);line-height:1.45}.prompt-row,.email-row{margin-top:.9rem;display:flex;justify-content:center;gap:.45rem;flex-wrap:wrap}.prompt-row button,.email-row button,.email-row input{border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(255,255,255,.08);color:white;padding:.56rem .75rem;font-size:.8rem}.email-row input{min-width:14rem;outline:none}.email-row input::placeholder{color:rgba(255,255,255,.4)}
        .home-scene.is-transitioning .world-stage{opacity:.14;transform:translateY(4rem) scale(.965);filter:blur(2px)}.home-scene.is-transitioning .companion-orb{transform:translate(-50%,-520%) scale(.58);opacity:.78;filter:drop-shadow(0 0 84px rgba(255,255,255,.55))}.home-scene.is-transitioning .avatar-figure{transform:translate(-50%,40vh) rotate(-3deg) scale(.72);opacity:.12;filter:blur(2px)}.home-scene.is-transitioning .terrain-world,.home-scene.is-transitioning .asset-ground{transform:translateY(86%);opacity:0}.home-scene.is-transitioning .sky-portal{opacity:1;transform:scale(1.5) translateY(-31vh)}.home-scene.is-transitioning .sky-depth{opacity:1;transform:scale(1.24) translateY(-6%)}.home-scene.is-transitioning .star-tunnel{opacity:.96;transform:scale(2.75) translateY(-18%)}.home-scene.is-transitioning .sky-whisper,.home-scene.is-transitioning .ascend-hint,.home-scene.is-transitioning .explain-glyph,.home-scene.is-transitioning .access-glyph,.home-scene.is-transitioning .floating-panel{opacity:0;pointer-events:none}
        @keyframes orbOrbit{to{transform:rotate(360deg) scaleX(.82)}}@keyframes orbBreathe{0%,100%{transform:scale(.96);opacity:.74}50%{transform:scale(1.06);opacity:1}}@keyframes panelIn{from{opacity:0;transform:translateX(-50%) translateY(.6rem) scale(.98)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}@keyframes hintFade{0%,100%{opacity:.03}50%{opacity:.14}}@media(max-width:900px){.companion-orb{left:54%;top:74%;width:124px;height:124px}.avatar-figure{left:calc(50% - 112px);top:57%;width:148px;height:400px}.terrain-world{height:36%}.asset-ground{height:38%}.sky-whisper{top:17%}.ascend-hint{top:23%}}@media(prefers-reduced-motion:reduce){.sky-depth,.star-tunnel,.companion-orb,.orb-ring,.orb-glow,.terrain-world,.sky-portal,.avatar-figure,.orb-wash{transition-duration:.01ms!important;animation:none!important}}
      `}</style>
    </main>
  );
}
