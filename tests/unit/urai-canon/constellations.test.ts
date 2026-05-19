import {
  assertConstellationLayoutIntegrity,
  createConstellationLayout,
  createFocusLifeAreaLinks,
  createReplayArcs,
  filterVisibleConstellationStars,
  groupStarsIntoConstellations,
  resolveConstellationLod,
  type UraiConstellationStar,
} from "@/lib/urai-canon/constellations";

function makeStar(overrides: Partial<UraiConstellationStar> & { id: string }): UraiConstellationStar {
  return {
    id: overrides.id,
    title: overrides.title ?? overrides.id,
    lifeArea: overrides.lifeArea ?? "work",
    weight: overrides.weight ?? 30,
    privacyState: overrides.privacyState ?? "private",
    starState: overrides.starState ?? "unlocked",
    createdAt: overrides.createdAt ?? "2026-05-19T00:00:00.000Z",
    sourceRefs: overrides.sourceRefs ?? ["source-1"],
    replayIds: overrides.replayIds,
    focusSessionIds: overrides.focusSessionIds,
    hidden: overrides.hidden,
    pinned: overrides.pinned,
  };
}

describe("URAI Tier 3 constellation system", () => {
  it("filters deleted and hidden stars before layout", () => {
    const stars = [
      makeStar({ id: "visible", privacyState: "private" }),
      makeStar({ id: "deleted", privacyState: "deleted" }),
      makeStar({ id: "hidden", hidden: true }),
      makeStar({ id: "pref-hidden" }),
    ];

    expect(filterVisibleConstellationStars(stars, { pinnedStarIds: [], hiddenStarIds: ["pref-hidden"], reducedMotion: false }).map((star) => star.id)).toEqual(["visible"]);
  });

  it("groups stars deterministically by life area", () => {
    const stars = [
      makeStar({ id: "b", lifeArea: "health", weight: 10 }),
      makeStar({ id: "a", lifeArea: "health", weight: 10 }),
      makeStar({ id: "work-1", lifeArea: "work", weight: 90 }),
    ];

    const groups = groupStarsIntoConstellations(stars, { pinnedStarIds: [], hiddenStarIds: [], reducedMotion: false });
    expect(groups.map((group) => group.id)).toEqual(["constellation-work", "constellation-health"]);
    expect(groups.find((group) => group.id === "constellation-health")?.starIds).toEqual(["a", "b"]);
  });

  it("creates safe layout with LOD and shielded private opacity", () => {
    const stars = [
      makeStar({ id: "starter-star", lifeArea: "self", starState: "selected", weight: 80, pinned: true }),
      makeStar({ id: "locked-star", lifeArea: "self", starState: "locked", weight: 50 }),
      makeStar({ id: "vaulted-star", lifeArea: "relationships", privacyState: "vaulted", weight: 60 }),
    ];

    const layout = createConstellationLayout(stars, { pinnedStarIds: ["starter-star"], hiddenStarIds: [], reducedMotion: false }, 1280);
    expect(layout.lod).toBe("detail");
    expect(layout.nodes.find((node) => node.id === "starter-star")?.labelVisible).toBe(true);
    expect(layout.nodes.find((node) => node.id === "vaulted-star")?.interactive).toBe(false);
    expect(layout.privateShielded).toBe(3);
    expect(assertConstellationLayoutIntegrity(layout)).toEqual([]);
  });

  it("uses overview LOD for dense maps and mobile widths", () => {
    expect(resolveConstellationLod(50, 375)).toBe("overview");
    expect(resolveConstellationLod(300, 1440)).toBe("overview");
    expect(resolveConstellationLod(120, 1440)).toBe("regional");
    expect(resolveConstellationLod(24, 1440)).toBe("detail");
  });

  it("creates replay arcs and focus-to-life-area links without deleted content", () => {
    const stars = [
      makeStar({ id: "replay-a", lifeArea: "work", replayIds: ["replay-1"], focusSessionIds: ["focus-1"] }),
      makeStar({ id: "replay-b", lifeArea: "work", replayIds: ["replay-2"], focusSessionIds: ["focus-2"] }),
      makeStar({ id: "deleted-replay", lifeArea: "health", privacyState: "deleted", replayIds: ["replay-3"], focusSessionIds: ["focus-3"] }),
    ];

    expect(createReplayArcs(stars)).toHaveLength(1);
    expect(createReplayArcs(stars)[0]).toMatchObject({ from: "replay-a", to: "replay-b" });
    expect(createFocusLifeAreaLinks(stars)).toEqual({ work: ["focus-1", "focus-2"] });
  });

  it("supports dense-map fixtures without layout integrity failures", () => {
    const dense = Array.from({ length: 320 }, (_, index) =>
      makeStar({
        id: `dense-${index}`,
        lifeArea: ["self", "work", "health", "relationships", "creativity", "learning", "home"][index % 7] as UraiConstellationStar["lifeArea"],
        weight: (index % 100) + 1,
        starState: index % 29 === 0 ? "locked" : index % 53 === 0 ? "legendary" : "unlocked",
        privacyState: index % 31 === 0 ? "deleted" : index % 17 === 0 ? "vaulted" : "private",
        hidden: index % 37 === 0,
      }),
    );

    const layout = createConstellationLayout(dense, { pinnedStarIds: ["dense-1"], hiddenStarIds: ["dense-2"], reducedMotion: true }, 390);
    expect(layout.lod).toBe("overview");
    expect(layout.nodes.length).toBeLessThan(dense.length);
    expect(layout.deletedExcluded).toBeGreaterThan(0);
    expect(layout.hiddenExcluded).toBeGreaterThan(0);
    expect(assertConstellationLayoutIntegrity(layout)).toEqual([]);
  });
});
