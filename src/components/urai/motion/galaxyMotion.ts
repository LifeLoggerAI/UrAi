import { cinematicEase, softEase, type CubicBezier } from "./ascentMotion";

export const GALAXY_ZOOM = {
  min: 0.62,
  max: 2.85,
  wheelSensitivity: 0.0012,
  keyboardStep: 0.15,
};

export const GALAXY_CAMERA = {
  recenterDuration: 0.85,
  interactionDuration: 0.42,
  cinematicEase,
  softEase,
} satisfies Record<string, number | CubicBezier>;

export const STAR_FOCUS_TIMING = {
  pulse: 0.18,
  portal: 0.52,
  panel: 0.34,
  panelDelay: 0.2,
};
