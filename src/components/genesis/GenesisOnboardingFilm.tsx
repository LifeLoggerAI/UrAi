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
              {scene.timestampRange} / {asset?.assetStatus ?? "placeholder"} asset
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
            role="img"
            aria-label={asset?.altText ?? scene.visualDirection}
            style={{ "--scene-image": sceneImage(scene) } as CSSProperties}
          >
            <div className={styles.visualOverlay}>
              <p>Genesis onboarding film</p>
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
