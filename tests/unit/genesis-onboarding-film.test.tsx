import fs from "node:fs";
import path from "node:path";
import { fireEvent, render, screen } from "@testing-library/react";
import GenesisOnboardingFilm from "@/components/genesis/GenesisOnboardingFilm";
import {
  genesisOnboardingFilm,
  genesisOnboardingSeedMemory,
} from "@/data/genesisOnboardingFilm";
import { genesisOnboardingAssets } from "@/data/genesisOnboardingAssets";

const requiredSceneIds = [
  "scattered-life",
  "urai-appears",
  "you-live",
  "life-map-sky",
  "orb-speaks",
  "focus-image",
  "replay-begins",
  "ground-council",
  "private-nudges",
  "life-films",
  "memory-music-videos",
  "symbolic-people",
  "ar-vr-xr",
  "passport-ownership",
  "global-emotional-map",
  "accessibility-legacy",
  "final-home-return",
];

const disallowedClaims = [
  "fully reconstructs reality",
  "recreates real people",
  "knows everything automatically",
  "autonomous agents act without permission",
  "passive sensing creates exact life movies for everyone",
  "guaranteed diagnosis",
  "medical treatment",
  "legal advice",
  "Home experience stalled",
  "Life map is out of orbit",
];

describe("Genesis onboarding film", () => {
  it("defines every required scene with voiceover, captions, trust notes, and fallback assets", () => {
    expect(genesisOnboardingFilm.coreLine).toBe(
      "You live. URAI remembers. You choose what becomes real.",
    );
    expect(genesisOnboardingFilm.scenes.map((scene) => scene.id)).toEqual(requiredSceneIds);

    for (const scene of genesisOnboardingFilm.scenes) {
      expect(scene.voiceover.length).toBeGreaterThan(20);
      expect(scene.onScreenText.length).toBeGreaterThan(0);
      expect(scene.trustSafetyNotes.length).toBeGreaterThan(0);
      expect(scene.fallbackAssetPath).toMatch(/^\/genesis\/onboarding\//);
      expect(scene.assetPrompt).toContain("no real private data");
    }
  });

  it("keeps the seed memory launch-safe and owner-controlled", () => {
    expect(genesisOnboardingSeedMemory).toMatchObject({
      id: "genesis-first-light",
      type: "onboarding_seed",
      privacy: "no_private_user_data",
      mode: "genesis_symbolic_replay",
    });
    expect(genesisOnboardingSeedMemory.privacyReceipt.userControl).toEqual([
      "export",
      "delete",
      "keep",
    ]);
  });

  it("maps every scene to a manifest asset whose fallback exists", () => {
    const assetIds = genesisOnboardingAssets.map((asset) => asset.sceneId);
    expect(assetIds).toEqual(requiredSceneIds);

    for (const asset of genesisOnboardingAssets) {
      expect(asset.assetStatus).toBe("placeholder");
      expect(asset.negativePrompt).toContain("no real person cloning");
      expect(asset.altText.length).toBeGreaterThan(20);

      const absoluteFallback = path.join(
        process.cwd(),
        "public",
        asset.fallbackImagePath.replace(/^\//, ""),
      );
      expect(fs.existsSync(absoluteFallback)).toBe(true);
    }
  });

  it("renders the film and reaches the final Life Map CTA", () => {
    render(<GenesisOnboardingFilm />);

    expect(screen.getByText("A Life Is Scattered")).toBeInTheDocument();
    expect(screen.getByText("You live. URAI remembers. You choose what becomes real.")).toBeInTheDocument();

    for (let index = 0; index < requiredSceneIds.length - 1; index += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
    }

    expect(screen.getByText("Final Return Home")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Begin Your Life Map" })).toHaveAttribute(
      "href",
      "/life-map",
    );
  });

  it("does not include unsupported launch claims", () => {
    const combinedText = JSON.stringify({
      film: genesisOnboardingFilm,
      assets: genesisOnboardingAssets,
      seedMemory: genesisOnboardingSeedMemory,
    });

    for (const claim of disallowedClaims) {
      expect(combinedText.toLowerCase()).not.toContain(claim.toLowerCase());
    }

    expect(combinedText).toContain("Symbolic. Consent-based. Not a replacement for real people.");
    expect(combinedText).toContain("Private by default");
    expect(combinedText).toContain("no private data used");
  });
});
