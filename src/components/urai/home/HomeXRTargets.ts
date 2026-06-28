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

export const homeXRTargets: HomeXRTarget[] = [
  {
    id: "life-map",
    label: "Life Map",
    helper: "Open the memory galaxy.",
    href: "/life-map",
    position: [-2.7, 2.45, -2.2],
    scale: [1.25, 0.42, 0.08],
    color: "#67e8f9",
  },
  {
    id: "ground",
    label: "Ground",
    helper: "Enter real-life support.",
    href: "/ground",
    position: [0, -0.32, -2.6],
    scale: [1.5, 0.42, 0.08],
    color: "#86efac",
  },
  {
    id: "sky",
    label: "Sky",
    helper: "Ascend through the upper world.",
    href: "/life-map",
    position: [0, 2.72, -3.15],
    scale: [1.45, 0.42, 0.08],
    color: "#bae6fd",
  },
  {
    id: "horizon",
    label: "Horizon",
    helper: "See the route spine.",
    href: "/location-map",
    position: [2.7, 1.22, -2.35],
    scale: [1.35, 0.42, 0.08],
    color: "#fde68a",
  },
  {
    id: "replay",
    label: "Replay",
    helper: "Open life replay.",
    href: "/replay",
    position: [-2.8, 1.32, -2.25],
    scale: [1.18, 0.38, 0.08],
    color: "#c4b5fd",
  },
  {
    id: "orb-chat",
    label: "Orb Chat",
    helper: "Talk to the orb companion.",
    href: "/ochat",
    position: [0, 1.35, -2.05],
    scale: [1.28, 0.38, 0.08],
    color: "#a5f3fc",
  },
  {
    id: "mirror",
    label: "Mirror",
    helper: "Open reflection mode.",
    href: "/mirror",
    position: [2.82, 2.2, -2.18],
    scale: [1.16, 0.38, 0.08],
    color: "#f0abfc",
  },
  {
    id: "xr-preview",
    label: "XR Preview",
    helper: "Check headset capability.",
    href: "/xr",
    position: [0, 0.42, -1.95],
    scale: [1.32, 0.38, 0.08],
    color: "#93c5fd",
  },
];

export const homeXRInteractiveTargetLabels = homeXRTargets.map((target) => target.label);
