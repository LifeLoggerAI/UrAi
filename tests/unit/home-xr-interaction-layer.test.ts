import { homeXRInteractiveTargetLabels } from "../../src/components/urai/home/HomeXRInteractionLayer";

describe("Home XR interaction layer", () => {
  it("exposes the required in-world Home targets", () => {
    expect(homeXRInteractiveTargetLabels).toEqual([
      "Life Map",
      "Ground",
      "Sky",
      "Horizon",
      "Replay",
      "Orb Chat",
      "Mirror",
      "XR Preview",
    ]);
  });
});
