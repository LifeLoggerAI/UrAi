"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import HomeWebGLSky from "@/components/HomeWebGLSky";
import LifeMapScene from "@/components/lifemap/LifeMapScene";
import { useEmotionalTone } from "@/components/lifemap/useEmotionalTone";
import { resolveUraiAssets, type UraiResolvedAsset, type UraiVisualSlot } from "@/lib/urai-assets";

type ImmersiveState = "home" | "ascendingToLifeMap" | "lifeMap" | "orbChat" | "groundZoom" | "unwindingToHome";
type OrbMessage = { id: string; role: "user" | "urai"; text: string };

const HOME_VISUAL_SLOTS: UraiVisualSlot[] = [
  "home.sky.background",
  "home.sky.clouds",
  "home.aura.blob",
  "home.orb.core",
  "home.silhouette.body",
  "home.ground.base",
];

const TONE_COPY = {
  calm: { whisper: "The sky is quiet. Your Life Map is above you.", opening: "The sky is opening." },
  focused: { whisper: "A signal is forming overhead.", opening: "The stars are drawing upward." },
  charged: { whisper: "Something bright wants to be understood.", opening: "The active pattern is opening." },
  restorative: { whisper: "Recovery is returning softly.", opening: "The sky is lifting gently." },
};

function assetBackground(asset?: UraiResolvedAsset) {
  if (asset?.src) return { backgroundImage: `url(${asset.src})` };
  if (asset?.svg) return { backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(asset.svg)}")` };
  return undefined;
}

function AvatarSilhouette() {
  return (
    <svg className="avatar-svg" viewBox="0 0 220 520" role="presentation" aria-hidden="true">
      <defs>
        <linearGradient id="avatarFade" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(234,247,255,.74)" />
          <stop offset=".36" stopColor="rgba(126,212,247,.34)" />
          <stop offset=".76" stopColor="rgba(42,105,138,.11)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <radialGradient id="avatarFace" cx="72%" cy="36%" r="58%">
          <stop offset="0" stopColor="rgba(255,255,255,.88)" />
          <stop offset=".45" stopColor="rgba(208,236,255,.32)" />
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

function nextOrbReply(text: string) {
  const normalized = text.trim();
  if (!normalized) return "I am here. Touch one honest signal and I will help you hold it gently.";
  return `I hear: “${normalized}”. I am holding it as a symbolic signal, not a verdict. When the Life Map opens, look for the quiet star that keeps returning.`;
}

export default function HomeScene() {
  const [state, setState] = useState<ImmersiveState>("home");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [orbInput, setOrbInput] = useState("");
  const [messages, setMessages] = useState<OrbMessage[]>([
    { id: "welcome", role: "urai", text: "I am awake in the orb. Ask what your Life Map is trying to show you." },
  ]);
  const historyGuard = useRef(false);
  const emotionalTone = useEmotionalTone();
  const visualAssets = useMemo(() => resolveUraiAssets(HOME_VISUAL_SLOTS), []);
  const copy = TONE_COPY[emotionalTone];

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(mq.matches);
    syncMotion();
    mq.addEventListener("change", syncMotion);
    return () => mq.removeEventListener("change", syncMotion);
  }, []);

  const settleHome = (replace = false) => {
    historyGuard.current = replace;
    setState("home");
    if (replace && typeof window !== "undefined") window.history.replaceState({ uraiImmersive: "home" }, "", window.location.pathname);
  };

  const pushState = (next: ImmersiveState) => {
    if (typeof window !== "undefined") window.history.pushState({ uraiImmersive: next }, "", window.location.pathname);
    setState(next);
  };

  const beginAscent = () => {
    if (state !== "home") return;
    const next = reduceMotion ? "lifeMap" : "ascendingToLifeMap";
    pushState(next);
    if (reduceMotion) return;
    window.setTimeout(() => setState("lifeMap"), emotionalTone === "restorative" ? 1850 : 1550);
  };

  const beginUnwind = () => {
    if (state !== "lifeMap") {
      settleHome();
      return;
    }
    if (reduceMotion) {
      settleHome(true);
      return;
    }
    setState("unwindingToHome");
    window.setTimeout(() => settleHome(true), 1050);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (state === "orbChat" || state === "groundZoom") {
        event.preventDefault();
        settleHome(true);
      } else if (state === "lifeMap") {
        event.preventDefault();
        beginUnwind();
      } else if (state === "ascendingToLifeMap" || state === "unwindingToHome") {
        event.preventDefault();
        settleHome(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state, reduceMotion]);

  useEffect(() => {
    const onPopState = () => {
      if (historyGuard.current) {
        historyGuard.current = false;
        return;
      }
      if (state !== "home") settleHome(true);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [state]);

  const submitOrbMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = orbInput.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", text },
      { id: `urai-${Date.now()}`, role: "urai", text: nextOrbReply(text) },
    ]);
    setOrbInput("");
  };

  const isHomeWorldVisible = state !== "lifeMap";
  const isAscent = state === "ascendingToLifeMap";
  const isGround = state === "groundZoom";
  const isChat = state === "orbChat";
  const isUnwinding = state === "unwindingToHome";

  if (state === "lifeMap") {
    return (
      <div className="relative h-dvh w-full overflow-hidden bg-black">
        <LifeMapScene onRequestHome={beginUnwind} />
        <button type="button" onClick={beginUnwind} className="absolute left-4 top-4 z-50 rounded-full border border-white/24 bg-black/40 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10" aria-label="Reverse ascent and return home">
          Return home
        </button>
      </div>
    );
  }

  return (
    <main className={`home-scene tone-${emotionalTone} state-${state}`} aria-label="URAI immersive home world">
      {isHomeWorldVisible && (
        <>
          <button type="button" onClick={beginAscent} disabled={state !== "home"} className="sky-trigger" aria-label="Ascend through the sky into the URAI Life Map">
            <span>Ascend</span>
          </button>
          <button type="button" onClick={(event) => { event.stopPropagation(); if (state === "home") pushState("orbChat"); }} disabled={state !== "home"} className="orb-trigger" aria-label="Open URAI companion chat from the orb" />
          <button type="button" onClick={(event) => { event.stopPropagation(); if (state === "home") pushState("groundZoom"); }} disabled={state !== "home"} className="ground-trigger" aria-label="Enter the ground and foundation layer" />
        </>
      )}

      <div className="asset-layer asset-sky" style={assetBackground(visualAssets["home.sky.background"])} aria-hidden />
      <div className="sky-base" aria-hidden />
      <HomeWebGLSky />
      <div className="asset-layer asset-clouds" style={assetBackground(visualAssets["home.sky.clouds"])} aria-hidden />
      <div className="sky-depth" aria-hidden />
      <div className="sky-portal" aria-hidden><span className="portal-core" /><span className="portal-ring ring-one" /><span className="portal-ring ring-two" /></div>
      <div className="star-tunnel" aria-hidden><span /><span /><span /><span /><span /><span /><span /></div>
      <div className="asset-layer asset-ground" style={assetBackground(visualAssets["home.ground.base"])} aria-hidden />
      <div className="terrain-world" aria-hidden><span className="terrain-mist" /><span className="hill hill-back" /><span className="hill hill-front" /></div>
      <div className="orb-wash" style={assetBackground(visualAssets["home.aura.blob"])} aria-hidden />
      <div className="avatar-figure" aria-hidden><div className="asset-avatar" style={assetBackground(visualAssets["home.silhouette.body"])} aria-hidden /><AvatarSilhouette /></div>

      <section className="world-stage" aria-hidden={isAscent || isUnwinding}>
        <div className="companion-orb" aria-hidden>
          <span className="orb-glow" />
          <span className="asset-orb" style={assetBackground(visualAssets["home.orb.core"])} />
          <span className="orb-core" />
          <span className="orb-ring orb-ring-one" />
          <span className="orb-ring orb-ring-two" />
          <span className="orb-shadow" />
        </div>
        <p className="sky-whisper" aria-live="polite">{isAscent ? copy.opening : isGround ? "The foundation layer is opening beneath you." : isChat ? "The orb is awake." : copy.whisper}</p>
        <p className="zone-hints"><span>Sky: Life Map</span><span>Orb: Companion</span><span>Ground: Foundation</span></p>
      </section>

      {isChat && (
        <section className="orb-chat-layer" onClick={() => settleHome(true)} aria-label="URAI orb companion chat">
          <div className="orb-chat" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-layer" onClick={() => settleHome(true)} aria-label="Close companion chat">Return</button>
            <div className="chat-orb-bloom" aria-hidden />
            <p>Orb Companion</p>
            <h1>URAI is listening.</h1>
            <div className="chat-stream">
              {messages.map((message) => <div key={message.id} className={`chat-message ${message.role}`}>{message.text}</div>)}
            </div>
            <form onSubmit={submitOrbMessage} className="chat-form">
              <input value={orbInput} onChange={(event) => setOrbInput(event.target.value)} placeholder="Ask the orb what is forming..." aria-label="Message URAI companion" />
              <button type="submit">Send</button>
            </form>
          </div>
        </section>
      )}

      {isGround && (
        <section className="ground-layer" onClick={() => settleHome(true)} aria-label="URAI foundation layer">
          <div className="ground-sanctum" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-layer" onClick={() => settleHome(true)} aria-label="Return home from foundation layer">Return</button>
            <div className="root-field" aria-hidden>{Array.from({ length: 18 }, (_, index) => <span key={index} />)}</div>
            <p>Foundation</p>
            <h1>What is beneath the map.</h1>
            <span className="ground-copy">Roots, body-memory, rhythm, silence, and buried signal live here. This layer is spatial and symbolic: a quiet base under the constellation above.</span>
            <div className="foundation-signals"><span>Breath rhythm steadying</span><span>Recurring evening reflection</span><span>Unspoken threshold memory</span></div>
          </div>
        </section>
      )}

      <style jsx>{`
        .home-scene{--tone-a:rgba(125,211,252,.18);--tone-b:rgba(196,181,253,.12);--tone-c:rgba(77,190,139,.1);--tone-speed:1;position:relative;min-height:100dvh;overflow:hidden;background:#000;color:white;isolation:isolate;user-select:none}.tone-focused{--tone-a:rgba(96,165,250,.2);--tone-b:rgba(45,212,191,.12);--tone-c:rgba(125,211,252,.12);--tone-speed:.9}.tone-charged{--tone-a:rgba(251,191,36,.14);--tone-b:rgba(244,114,182,.13);--tone-c:rgba(251,113,133,.1);--tone-speed:.82}.tone-restorative{--tone-a:rgba(167,139,250,.16);--tone-b:rgba(14,165,233,.12);--tone-c:rgba(110,231,183,.12);--tone-speed:1.25}.asset-layer,.sky-base,.sky-depth,.sky-portal,.terrain-world,.avatar-figure,.orb-wash,.star-tunnel{position:fixed;inset:0;pointer-events:none}.asset-layer{background-repeat:no-repeat;background-position:center;background-size:cover}.asset-sky{z-index:0;opacity:.72}.sky-base{z-index:1;background:radial-gradient(circle at 50% 8%,rgba(108,126,218,.28),transparent 24%),radial-gradient(ellipse at 50% 43%,rgba(50,86,148,.15),transparent 56%),linear-gradient(180deg,rgba(1,3,12,.7),rgba(7,17,38,.6) 52%,rgba(3,17,11,.76) 77%,#000 100%)}.asset-clouds{z-index:2;opacity:.28;mix-blend-mode:screen}.sky-depth{z-index:4;background:radial-gradient(circle at 50% 26%,rgba(230,242,255,.1),transparent 18%),linear-gradient(180deg,transparent 0%,rgba(0,0,0,.14) 70%,rgba(0,0,0,.84) 100%);mix-blend-mode:screen;opacity:.82}.sky-trigger{position:fixed;inset:0 0 52% 0;z-index:32;border:0;background:transparent;cursor:zoom-in}.sky-trigger span{position:absolute;left:50%;top:42%;transform:translateX(-50%);border:1px solid rgba(255,255,255,.1);border-radius:999px;padding:.45rem .8rem;background:rgba(0,0,0,.08);font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.18);opacity:0;transition:opacity .25s ease,background .25s ease}.sky-trigger:hover span,.sky-trigger:focus-visible span{opacity:1;background:rgba(255,255,255,.06)}.orb-trigger{position:fixed;left:53%;top:74%;z-index:36;width:clamp(138px,10vw,184px);height:clamp(138px,10vw,184px);transform:translate(-50%,-50%);border:0;border-radius:999px;background:transparent;cursor:pointer}.ground-trigger{position:fixed;left:0;right:0;bottom:0;height:36%;z-index:34;border:0;background:transparent;cursor:zoom-in}.sky-portal{z-index:12;display:grid;place-items:center;transform:translateY(-32vh);opacity:.48;transition:opacity 900ms ease,transform 1500ms cubic-bezier(.16,1,.3,1)}.portal-core{position:absolute;width:min(34vw,470px);height:min(34vw,470px);border-radius:999px;background:radial-gradient(circle,rgba(255,255,255,.12),rgba(125,211,252,.055) 22%,transparent 62%);filter:blur(12px)}.portal-ring{position:absolute;width:min(39vw,540px);height:min(15vw,210px);border-radius:999px;border:1px solid rgba(210,232,255,.042)}.ring-one{transform:rotate(-14deg)}.ring-two{transform:rotate(18deg) scaleX(.82);opacity:.42}.star-tunnel{z-index:20;opacity:0;transform:scale(.75) translateY(12%);background:radial-gradient(circle at 50% 17%,rgba(205,225,255,.42),transparent 6%),radial-gradient(circle at 42% 38%,var(--tone-b),transparent 12%),radial-gradient(circle at 58% 42%,var(--tone-a),transparent 14%);transition:opacity 800ms ease,transform 1450ms cubic-bezier(.16,1,.3,1)}.star-tunnel span{position:absolute;width:.3rem;height:.3rem;border-radius:999px;background:white;box-shadow:0 0 14px rgba(255,255,255,.65),0 0 32px var(--tone-a);opacity:.7}.star-tunnel span:nth-child(1){left:30%;top:24%}.star-tunnel span:nth-child(2){left:45%;top:16%;width:.22rem;height:.22rem}.star-tunnel span:nth-child(3){left:58%;top:29%}.star-tunnel span:nth-child(4){left:66%;top:43%;width:.2rem;height:.2rem}.star-tunnel span:nth-child(5){left:38%;top:52%;width:.18rem;height:.18rem}.star-tunnel span:nth-child(6){left:52%;top:56%;width:.16rem;height:.16rem}.star-tunnel span:nth-child(7){left:73%;top:22%;width:.18rem;height:.18rem}.asset-ground{z-index:6;top:auto;height:42%;opacity:.58;background-position:center bottom;mix-blend-mode:screen}.terrain-world{z-index:8;top:auto;height:36%;bottom:0;overflow:hidden;transition:transform 1500ms cubic-bezier(.16,1,.3,1),opacity 1100ms ease}.terrain-world:before{content:"";position:absolute;inset:-44% -16% 0;background:radial-gradient(ellipse at 50% 0%,rgba(113,210,162,.08),transparent 23%),linear-gradient(180deg,transparent,rgba(2,20,13,.2) 34%,rgba(0,0,0,.99))}.terrain-mist,.hill{position:absolute}.terrain-mist{left:-12%;right:-12%;top:-48%;height:72%;background:radial-gradient(ellipse at 50% 78%,rgba(125,211,252,.06),transparent 70%);filter:blur(34px);opacity:.38}.hill{left:-22%;right:-22%;border-radius:52% 48% 0 0/16% 22% 0 0}.hill-back{bottom:52%;height:22%;background:linear-gradient(180deg,rgba(47,120,85,.05),rgba(0,0,0,0));opacity:.34;transform:rotate(-1.1deg)}.hill-front{bottom:-42%;height:84%;background:radial-gradient(ellipse at 50% 0%,rgba(91,184,132,.065),transparent 26%),linear-gradient(180deg,rgba(2,24,16,.3),rgba(0,0,0,.99));transform:rotate(-.3deg) scaleX(1.12)}.orb-wash{z-index:15;background-image:radial-gradient(circle at 54% 72%,rgba(210,238,255,.2),rgba(125,211,252,.11) 8%,transparent 23%),radial-gradient(circle at 40% 70%,rgba(180,226,255,.11),transparent 16%);background-size:cover;background-position:center;opacity:.9}.avatar-figure{z-index:16;left:calc(50% - min(14vw,196px));top:57%;right:auto;bottom:auto;width:clamp(178px,12vw,218px);height:clamp(390px,47vh,510px);transform:translate(-50%,-7%) rotate(-3deg);transition:transform 1500ms cubic-bezier(.16,1,.3,1),opacity 900ms ease,filter 900ms ease}.asset-avatar{position:absolute;inset:0;background-repeat:no-repeat;background-position:center bottom;background-size:contain;opacity:.32;filter:blur(.2px) drop-shadow(0 0 24px rgba(125,211,252,.12))}.avatar-svg{position:absolute;inset:0;overflow:visible;filter:drop-shadow(0 0 22px rgba(125,211,252,.14))}:global(.avatar-aura-svg){fill:rgba(125,211,252,.07);filter:url(#avatarBlur);opacity:.7}:global(.avatar-body-svg){fill:url(#avatarFade);stroke:rgba(230,245,255,.06);stroke-width:1;opacity:.74}:global(.avatar-head-svg){fill:url(#avatarFace);opacity:.7}:global(.avatar-face-svg){fill:none;stroke:rgba(230,248,255,.3);stroke-width:2;stroke-linecap:round;opacity:.56}:global(.avatar-gaze-svg){fill:none;stroke:rgba(210,240,255,.13);stroke-width:1;stroke-linecap:round;opacity:.16}:global(.avatar-heart-svg){fill:rgba(220,246,255,.44);filter:drop-shadow(0 0 12px rgba(125,211,252,.32));opacity:.56}:global(.avatar-shadow-svg){fill:rgba(125,211,252,.12);filter:blur(8px);opacity:.62}.world-stage{position:relative;z-index:22;min-height:100dvh;width:100%;display:grid;place-items:center;padding:2rem;transition:opacity 900ms ease,transform 1450ms cubic-bezier(.16,1,.3,1),filter 900ms ease;pointer-events:none}.companion-orb{position:fixed;left:53%;top:74%;z-index:27;width:clamp(130px,9.5vw,168px);height:clamp(130px,9.5vw,168px);transform:translate(-50%,-50%);border-radius:999px;transition:transform 1450ms cubic-bezier(.16,1,.3,1),opacity 900ms ease,filter 900ms ease}.orb-glow,.orb-core,.orb-ring,.orb-shadow,.asset-orb{position:absolute;border-radius:999px}.orb-glow{inset:-76%;background:radial-gradient(circle,rgba(255,255,255,.2),var(--tone-a) 30%,transparent 70%);filter:blur(18px);opacity:.96;animation:orbBreathe calc(5.8s * var(--tone-speed)) ease-in-out infinite}.asset-orb{inset:9%;background-repeat:no-repeat;background-size:contain;background-position:center;opacity:.5;mix-blend-mode:screen}.orb-core{inset:19%;background:radial-gradient(circle at 38% 32%,#fff,rgba(219,242,255,.96) 18%,rgba(125,211,252,.72) 48%,rgba(45,89,120,.2) 76%,transparent 100%);box-shadow:0 0 24px rgba(255,255,255,.8),0 0 84px rgba(125,211,252,.48),0 0 150px rgba(196,181,253,.15)}.orb-ring-one{inset:0;border:1px solid rgba(255,255,255,.2);box-shadow:inset 0 0 22px rgba(125,211,252,.07);animation:orbOrbit calc(18s * var(--tone-speed)) linear infinite}.orb-ring-two{inset:10%;border:1px solid rgba(196,181,253,.15);transform:rotate(32deg) scaleX(.74);animation:orbOrbit calc(24s * var(--tone-speed)) linear infinite reverse}.orb-shadow{left:50%;top:94%;width:138%;height:24%;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(160,225,255,.24),transparent 70%);filter:blur(9px);opacity:.92}.sky-whisper{position:fixed;left:50%;top:20%;z-index:29;width:min(560px,calc(100vw - 2rem));transform:translateX(-50%);margin:0;text-align:center;font-size:clamp(.9rem,1.12vw,1.04rem);line-height:1.45;color:rgba(255,255,255,.72);text-shadow:0 2px 24px rgba(0,0,0,.75);transition:opacity .8s ease,transform 1.2s ease}.zone-hints{position:fixed;left:50%;bottom:1rem;z-index:29;display:flex;gap:.45rem;flex-wrap:wrap;justify-content:center;transform:translateX(-50%);margin:0;color:rgba(255,255,255,.18);font-size:.56rem;letter-spacing:.14em;text-transform:uppercase}.zone-hints span{border:1px solid rgba(255,255,255,.08);border-radius:999px;padding:.45rem .6rem;background:rgba(0,0,0,.12)}.state-ascendingToLifeMap .world-stage{opacity:.14;transform:translateY(4rem) scale(.965);filter:blur(2px)}.state-ascendingToLifeMap .companion-orb{transform:translate(-50%,-520%) scale(.58);opacity:.78;filter:drop-shadow(0 0 84px rgba(255,255,255,.55))}.state-ascendingToLifeMap .avatar-figure{transform:translate(-50%,40vh) rotate(-3deg) scale(.72);opacity:.12;filter:blur(2px)}.state-ascendingToLifeMap .terrain-world,.state-ascendingToLifeMap .asset-ground{transform:translateY(86%);opacity:0}.state-ascendingToLifeMap .sky-portal{opacity:1;transform:scale(1.5) translateY(-31vh)}.state-ascendingToLifeMap .sky-depth{opacity:1;transform:scale(1.24) translateY(-6%)}.state-ascendingToLifeMap .star-tunnel{opacity:.96;transform:scale(2.75) translateY(-18%)}.state-unwindingToHome .star-tunnel{opacity:.64;transform:scale(1.4) translateY(-6%)}.state-unwindingToHome .sky-portal{opacity:.9;transform:scale(1.08) translateY(-31vh)}.state-orbChat .companion-orb{transform:translate(-50%,-50%) scale(1.18);filter:drop-shadow(0 0 110px rgba(210,240,255,.72))}.state-groundZoom .terrain-world,.state-groundZoom .asset-ground{transform:translateY(-18%) scale(1.16);opacity:1}.state-groundZoom .avatar-figure{transform:translate(-50%,-20%) rotate(-3deg) scale(.82);opacity:.3}.orb-chat-layer,.ground-layer{position:fixed;inset:0;z-index:60;display:grid;place-items:center;padding:1rem;background:radial-gradient(circle at 50% 70%,rgba(125,211,252,.1),rgba(0,0,0,.62) 42%,rgba(0,0,0,.88));backdrop-filter:blur(10px);animation:layerIn .38s cubic-bezier(.16,1,.3,1) both}.orb-chat,.ground-sanctum{position:relative;width:min(720px,calc(100vw - 2rem));border:1px solid rgba(210,235,255,.18);border-radius:36px;background:linear-gradient(180deg,rgba(8,14,34,.78),rgba(0,3,14,.66));box-shadow:0 40px 140px rgba(0,0,0,.55),0 0 120px rgba(125,211,252,.12);padding:1.1rem;overflow:hidden}.close-layer{position:absolute;right:1rem;top:1rem;z-index:4;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(0,0,0,.24);color:white;padding:.45rem .72rem;cursor:pointer}.chat-orb-bloom{position:absolute;left:50%;top:-2rem;width:20rem;height:20rem;transform:translateX(-50%);border-radius:999px;background:radial-gradient(circle,#fff,rgba(125,211,252,.25) 20%,transparent 66%);filter:blur(18px);opacity:.55}.orb-chat p,.ground-sanctum p{position:relative;margin:0;text-transform:uppercase;letter-spacing:.32em;font-size:.62rem;color:rgba(255,255,255,.45)}.orb-chat h1,.ground-sanctum h1{position:relative;margin:.4rem 0 1rem;font-size:clamp(2rem,5vw,4.8rem);line-height:.92;letter-spacing:-.06em}.chat-stream{position:relative;display:grid;gap:.55rem;max-height:44vh;overflow:auto;padding:.3rem 0 1rem}.chat-message{max-width:82%;border:1px solid rgba(255,255,255,.12);border-radius:22px;padding:.75rem .9rem;color:rgba(255,255,255,.82);line-height:1.45}.chat-message.urai{justify-self:start;background:rgba(125,211,252,.08)}.chat-message.user{justify-self:end;background:rgba(255,255,255,.09)}.chat-form{position:relative;display:grid;grid-template-columns:1fr auto;gap:.5rem}.chat-form input,.chat-form button{border:1px solid rgba(255,255,255,.16);border-radius:999px;background:rgba(0,0,0,.24);color:white;padding:.85rem 1rem}.chat-form input{outline:none}.chat-form button{cursor:pointer;background:rgba(255,255,255,.1)}.ground-layer{align-items:end;padding-bottom:4vh;background:radial-gradient(ellipse at 50% 100%,rgba(66,225,160,.18),rgba(0,0,0,.84) 55%)}.ground-sanctum{min-height:min(640px,82vh);display:grid;align-content:end;background:linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,12,13,.72)),radial-gradient(ellipse at 50% 100%,rgba(103,232,249,.12),transparent 60%)}.root-field{position:absolute;inset:0;overflow:hidden;opacity:.7}.root-field span{position:absolute;left:50%;bottom:-6%;width:1px;height:68%;transform-origin:bottom;background:linear-gradient(0deg,rgba(180,255,226,.48),transparent);filter:drop-shadow(0 0 14px rgba(125,211,252,.36))}.root-field span:nth-child(3n){height:78%;opacity:.55}.root-field span:nth-child(4n){height:48%;opacity:.4}.root-field span:nth-child(1){transform:rotate(-42deg)}.root-field span:nth-child(2){transform:rotate(-33deg)}.root-field span:nth-child(3){transform:rotate(-24deg)}.root-field span:nth-child(4){transform:rotate(-16deg)}.root-field span:nth-child(5){transform:rotate(-9deg)}.root-field span:nth-child(6){transform:rotate(-4deg)}.root-field span:nth-child(7){transform:rotate(4deg)}.root-field span:nth-child(8){transform:rotate(11deg)}.root-field span:nth-child(9){transform:rotate(18deg)}.root-field span:nth-child(10){transform:rotate(26deg)}.root-field span:nth-child(11){transform:rotate(35deg)}.root-field span:nth-child(12){transform:rotate(43deg)}.root-field span:nth-child(n+13){transform:rotate(calc(-50deg + var(--i, 0deg)))}.ground-copy{position:relative;display:block;max-width:620px;color:rgba(255,255,255,.72);line-height:1.6}.foundation-signals{position:relative;display:flex;flex-wrap:wrap;gap:.45rem;margin-top:1rem}.foundation-signals span{border:1px solid rgba(255,255,255,.12);border-radius:999px;background:rgba(255,255,255,.06);padding:.55rem .75rem;color:rgba(255,255,255,.7)}@keyframes orbOrbit{to{transform:rotate(360deg) scaleX(.82)}}@keyframes orbBreathe{0%,100%{transform:scale(.96);opacity:.74}50%{transform:scale(1.06);opacity:1}}@keyframes layerIn{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:scale(1)}}@media(max-width:900px){.companion-orb{left:54%;top:74%;width:124px;height:124px}.orb-trigger{left:54%;top:74%;width:142px;height:142px}.avatar-figure{left:calc(50% - 112px);top:57%;width:148px;height:400px}.terrain-world{height:36%}.asset-ground{height:38%}.sky-whisper{top:17%}.zone-hints{bottom:.6rem}.chat-form{grid-template-columns:1fr}.orb-chat,.ground-sanctum{border-radius:28px}.ground-sanctum{min-height:76vh}}@media(prefers-reduced-motion:reduce){.sky-depth,.star-tunnel,.companion-orb,.orb-ring,.orb-glow,.terrain-world,.sky-portal,.avatar-figure,.orb-wash,.orb-chat-layer,.ground-layer{transition-duration:.01ms!important;animation:none!important}}
      `}</style>
    </main>
  );
}
