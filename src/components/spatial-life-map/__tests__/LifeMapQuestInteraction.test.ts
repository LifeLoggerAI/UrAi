import { readFileSync } from "node:fs";
import { join } from "node:path";

const readSource = (relativePath: string) => readFileSync(join(process.cwd(), relativePath), "utf8");

describe("Life Map Quest interaction wiring", () => {
  it("keeps Life Map stars selectable through explicit VR raycast targets", () => {
    const starSource = readSource("src/components/spatial-life-map/LifeStar.tsx");

    expect(starSource).toContain("lifeMapStarId: star.id");
    expect(starSource).toContain("onPointerOver");
    expect(starSource).toContain("onClick");
  });

  it("provides Quest controller rays, trigger selection, and grip close handling", () => {
    const questSource = readSource("src/components/spatial-life-map/LifeMapQuestInteraction.tsx");

    expect(questSource).toContain("getController(0)");
    expect(questSource).toContain("getController(1)");
    expect(questSource).toContain("life-map-quest-controller-ray");
    expect(questSource).toContain("selectstart");
    expect(questSource).toContain("squeezestart");
    expect(questSource).toContain("raycaster.intersectObjects");
  });

  it("renders VR-safe instruction, selected-node panel, menu, and fallback controller copy", () => {
    const questSource = readSource("src/components/spatial-life-map/LifeMapQuestInteraction.tsx");

    expect(questSource).toContain("Point + trigger to select. Grip/back to close.");
    expect(questSource).toContain("Choose a Life Map star");
    expect(questSource).toContain("Life Map VR menu");
    expect(questSource).toContain("Quest controllers not detected yet");
    expect(questSource).toContain("XR Preview");
  });

  it("wires the VR interaction layer into the existing LifeGalaxyScene without replacing scene visuals", () => {
    const sceneSource = readSource("src/components/spatial-life-map/LifeGalaxyScene.tsx");

    expect(sceneSource).toContain("<NebulaBackdrop");
    expect(sceneSource).toContain("<StarField");
    expect(sceneSource).toContain("<ConstellationLines");
    expect(sceneSource).toContain("<LifeStar");
    expect(sceneSource).toContain("<LifeMapQuestInteractionLayer");
  });

  it("does not append the Life Map VR entry until immersive-vr support is proven", () => {
    const sceneSource = readSource("src/components/spatial-life-map/LifeGalaxyScene.tsx");

    expect(sceneSource).toContain('xr.isSessionSupported("immersive-vr")');
    expect(sceneSource).toContain("if (cancelled || !immersiveVrSupported) return");
    expect(sceneSource).toContain("VRButton.createButton(gl)");
    expect(sceneSource).toContain("Enter spatial Life Map");
  });
});
