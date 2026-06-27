"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import {
  genesisOnboardingFilm,
  genesisOnboardingSeedMemory,
  type GenesisOnboardingScene,
} from "@/data/genesisOnboardingFilm";
import { genesisOnboardingAssets } from "@/data/genesisOnboardingAssets";
import styles from "./GenesisOnboardingFilm.module.css";

function sceneImage(scene: GenesisOnboardingScene) {
  return `linear-gradient(180deg, rgba(2, 6, 23, .04), rgba(2, 6, 23, .76)), url("${scene.fallbackAssetPath}")`;
}

function assetStatusLabel(status?: string) {
  if (status === "final") return "Final visual";
  if (status === "generated") return "Generated visual";
  return "Genesis preview visual";
}

function sceneSystemLabel(scene: GenesisOnboardingScene) {
  if (scene.requiredLayers.includes("ground") || scene.requiredLayers.includes("council")) {
    return "Ground / AI Council";
  }
  if (scene.requiredLayers.includes("passport")) return "Passport / Ownership";
  if (scene.requiredLayers.includes("replay") || scene.requiredLayers.includes("life-films")) {
    return "Replay / Memory Cinema";
  }
  if (scene.requiredLayers.includes("spatial")) return "Spatial / XR Preview";
  if (scene.requiredLayers.includes("orb")) return "Orb / Interface Bridge";
  if (scene.requiredLayers.includes("sky") || scene.requiredLayers.includes("life-map")) {
    return "Sky / Life Map";
  }
  return "Home / Living World";
}

function sceneArtifacts(scene: GenesisOnboardingScene) {
  if (scene.id === "ground-council") {
    return ["Archivist", "Guardian", "Narrator", "Worldbuilder"];
  }
  if (scene.id === "passport-ownership") {
    return ["Private", "Export", "Delete", "Consent"];
  }
  if (scene.id === "symbolic-people") {
    return ["Symbolic", "Consent", "Mirror", "Not a clone"];
  }
  if (scene.id === "ar-vr-xr") {
    return ["AR preview", "VR preview", "XR gated", "Worlds"];
  }
  if (scene.requiredLayers.includes("replay") || scene.requiredLayers.includes("life-films")) {
    return ["Scene", "Film", "World", "Gated proof"];
  }
  if (scene.requiredLayers.includes("sky") || scene.requiredLayers.includes("life-map")) {
    return ["Stars", "Weather", "Threads", "Patterns"];
  }
  return ["Home", "Sky", "Ground", "Orb"];
}

export default function GenesisOnboardingFilm() {
  const [sceneIndex, setSceneIndex] = useState(0);

  const scene = genesisOnboardingFilm.scenes[sceneIndex];
  const asset = useMemo(
    () => genesisOnboardingAssets.find((entry) => entry.sceneId === scene.id),
    [scene.id],
  );
  const isFinalScene = sceneIndex === genesisOnboardingFilm.scenes.length - 1;

  function nextScene() {
    setSceneIndex((current) =>
      Math.min(current + 1, genesisOnboardingFilm.scenes.length - 1),
    );
  }

  function previousScene() {
    setSceneIndex((current) => Math.max(current - 1, 0));
  }

  function replayFilm() {
    setSceneIndex(0);
  }

  function skipToPassport() {
    const passportIndex = genesisOnboardingFilm.scenes.findIndex(
      (candidate) => candidate.id === "passport-ownership",
    );
    setSceneIndex(passportIndex >= 0 ? passportIndex : genesisOnboardingFilm.scenes.length - 1);
  }

  return (
    <main className={styles.film} data-genesis-onboarding-film="true">
      <section className={styles.shell} aria-labelledby="genesis-onboarding-title">
        <nav className={styles.nav} aria-label="Genesis onboarding routes">
          <Link className={styles.brand} href="/home">
            URAI Genesis
          </Link>
          <div className={styles.navLinks}>
            <Link href="/home">Home</Link>
            <Link href="/life-map">Life Map</Link>
            <Link href="/passport">Passport</Link>
            <Link href="/waitlist">Waitlist</Link>
          </div>
        </nav>

        <div className={styles.stage}>
          <div className={styles.copy}>
            <span className={styles.pill}>
              {scene.timestampRange} / {assetStatusLabel(asset?.assetStatus)}
            </span>
            <h1 id="genesis-onboarding-title">{scene.title}</h1>
            <p className={styles.subtitle}>{genesisOnboardingFilm.subtitle}</p>
            <p className={styles.coreLine}>{genesisOnboardingFilm.coreLine}</p>
            <div className={styles.sceneMeta} aria-label="Scene layers and safety">
              {scene.requiredLayers.map((layer) => (
                <span key={layer}>{layer}</span>
              ))}
              <span>{asset?.safeClaimTag ?? "launch-safe"}</span>
            </div>
          </div>

          <article
            className={styles.visualCard}
            data-scene-id={scene.id}
            role="img"
            aria-label={asset?.altText ?? scene.visualDirection}
            style={{ "--scene-image": sceneImage(scene) } as CSSProperties}
          >
            <div className={styles.worldSystem} aria-hidden="true">
              <span className={styles.skyThread} />
              <span className={styles.skyThread} />
              <span className={styles.skyThread} />
              <span className={styles.orbPulse} />
              <span className={styles.groundHorizon} />
              <span className={styles.memoryStar} />
              <span className={styles.memoryStar} />
              <span className={styles.memoryStar} />
              {sceneArtifacts(scene).map((label, index) => (
                <span
                  key={`${label}-${index}`}
                  className={styles.systemChip}
                  style={{ "--chip-index": index } as CSSProperties}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className={styles.visualOverlay}>
              <p>{sceneSystemLabel(scene)} / Genesis preview</p>
              <h2>{scene.onScreenText[0]}</h2>
              <div className={styles.screenText}>
                {scene.onScreenText.slice(1, 5).map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>
          </article>
        </div>

        <section className={styles.caption} aria-label="Scene voiceover and safety receipt">
          <article className={styles.voice}>
            <p>Voiceover / captions</p>
            <blockquote>{scene.voiceover}</blockquote>
            <span className={styles.visuallyHidden}>{scene.visualDirection}</span>
          </article>

          <article className={styles.receipt}>
            <p>Trust rules</p>
            <ul>
              {scene.trustSafetyNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
              {scene.id === "focus-image" && (
                <li>
                  Seed memory: {genesisOnboardingSeedMemory.title}; privacy:{" "}
                  {genesisOnboardingSeedMemory.privacy}.
                </li>
              )}
              {scene.id === "passport-ownership" && (
                <li>
                  {genesisOnboardingSeedMemory.privacyReceipt.title}. Source:{" "}
                  {genesisOnboardingSeedMemory.privacyReceipt.source}. User control:{" "}
                  {genesisOnboardingSeedMemory.privacyReceipt.userControl.join(" / ")}.
                </li>
              )}
            </ul>
          </article>
        </section>

        <footer className={styles.controls} aria-label="Onboarding film controls">
          <div className={styles.spine} aria-label="Genesis product spine">
            <span>Home</span>
            <span>Life Map</span>
            <span>Focus</span>
            <span>Replay</span>
            <span>Passport</span>
          </div>

          <div className={styles.timeline} aria-label="Scene timeline">
            {genesisOnboardingFilm.scenes.map((timelineScene, index) => (
              <button
                key={timelineScene.id}
                type="button"
                aria-label={`Open scene ${index + 1}: ${timelineScene.title}`}
                aria-current={index === sceneIndex ? "true" : undefined}
                onClick={() => setSceneIndex(index)}
              />
            ))}
          </div>

          <div className={styles.buttons}>
            <button
              className={styles.ghostButton}
              type="button"
              onClick={previousScene}
              disabled={sceneIndex === 0}
            >
              Back
            </button>
            <button className={styles.ghostButton} type="button" onClick={skipToPassport}>
              Skip to Passport
            </button>
            {isFinalScene ? (
              <>
                <button className={styles.ghostButton} type="button" onClick={replayFilm}>
                  Replay Film
                </button>
                <Link className={styles.cta} href="/life-map">
                  Begin Your Life Map
                </Link>
              </>
            ) : (
              <button className={styles.button} type="button" onClick={nextScene}>
                Next
              </button>
            )}
          </div>
        </footer>
      </section>
    </main>
  );
}
