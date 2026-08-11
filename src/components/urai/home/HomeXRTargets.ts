export type HomeTargetId =
  | "life-map"
  | "ground"
  | "sky"
  | "horizon"
  | "replay"
  | "orb-chat"
  | "mirror"
  | "xr-preview";

export type HomeXRTarget = {
  id: HomeTargetId;
  label: string;
  helper: string;
  href: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
};

/**
 * Interaction anchors are physical world coordinates, not floating menu layout.
 * The Ground / Life Map / Orb positions match the accepted spatial Home authority.
 */
export const homeXRTargets: HomeXRTarget[] = [
  {
    id: "life-map",
    label: "Life Map",
    helper: "Ascend into the memory galaxy.",
    href: "/life-map",
    position: [4.9, 0.95, -7.2],
    scale: [1.7, 2.25, 0.62],
    color: "#67e8f9",
  },
  {
    id: "ground",
    label: "Ground",
    helper: "Descend into real-life support.",
    href: "/ground",
    position: [-4.9, 0.95, -7.2],
    scale: [1.7, 2.25, 0.62],
    color: "#86efac",
  },
  {
    id: "sky",
    label: "Sky",
    helper: "Ascend through the upper world.",
    href: "/life-map",
    position: [0, 3.4, -7.8],
    scale: [3.2, 1.4, 1.2],
    color: "#bae6fd",
  },
  {
    id: "horizon",
    label: "Horizon",
    helper: "See the route spine.",
    href: "/location-map",
    position: [7.4, 1.0, -1.4],
    scale: [1.8, 2.1, 1.2],
    color: "#fde68a",
  },
  {
    id: "replay",
    label: "Replay",
    helper: "Enter life replay.",
    href: "/replay",
    position: [-6.6, 1.0, -1.8],
    scale: [1.8, 2.1, 1.2],
    color: "#c4b5fd",
  },
  {
    id: "orb-chat",
    label: "Orb Chat",
    helper: "Talk to the orb companion.",
    href: "/ochat",
    position: [0, 1.45, -2.85],
    scale: [1.15, 1.15, 1.15],
    color: "#a5f3fc",
  },
  {
    id: "mirror",
    label: "Mirror",
    helper: "Open reflection mode.",
    href: "/mirror",
    position: [6.2, 1.0, 3.0],
    scale: [1.8, 2.1, 1.2],
    color: "#f0abfc",
  },
  {
    id: "xr-preview",
    label: "XR Preview",
    helper: "Check headset capability.",
    href: "/xr",
    position: [-6.0, 1.0, 3.4],
    scale: [1.8, 2.1, 1.2],
    color: "#93c5fd",
  },
];

export const homeXRInteractiveTargetLabels = homeXRTargets.map((target) => target.label);
