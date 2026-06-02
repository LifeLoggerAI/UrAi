export type UraiScene = "home" | "life-map" | "ground" | "focus" | "replay";

export type TransitionDirection = "enter" | "return";

export type SceneTheme = {
  id: UraiScene;
  background: string;
  accent: string;
  secondary: string;
  glow: string;
  copy: { eyebrow: string; title: string; body: string };
};

export const sceneThemes: Record<UraiScene, SceneTheme> = {
  home: {
    id: "home",
    background: "radial-gradient(circle at 50% 30%, #203963 0%, #101a38 45%, #050714 100%)",
    accent: "#f8d98b",
    secondary: "#9fb7ff",
    glow: "rgba(248, 217, 139, 0.5)",
    copy: { eyebrow: "URAI Genesis", title: "Your world is awake.", body: "The center is quiet. The sky remembers." },
  },
  "life-map": {
    id: "life-map",
    background: "radial-gradient(circle at 50% 20%, #1f2f66 0%, #0b102a 48%, #03040b 100%)",
    accent: "#f6c967",
    secondary: "#b9a7ff",
    glow: "rgba(246, 201, 103, 0.55)",
    copy: { eyebrow: "Life Map", title: "Your memories are forming constellations.", body: "Move through the stars of your becoming." },
  },
  ground: {
    id: "ground",
    background: "radial-gradient(circle at 50% 50%, #254447 0%, #122420 52%, #070b0c 100%)",
    accent: "#f3b86a",
    secondary: "#71d1c4",
    glow: "rgba(243, 184, 106, 0.45)",
    copy: { eyebrow: "Ground", title: "Return to the place that holds you.", body: "Warmth gathers where your world becomes safe again." },
  },
  focus: {
    id: "focus",
    background: "radial-gradient(circle at 50% 45%, #5b3c25 0%, #1a1d2b 52%, #07080d 100%)",
    accent: "#ffd38a",
    secondary: "#8fd7ff",
    glow: "rgba(255, 211, 138, 0.55)",
    copy: { eyebrow: "Focus", title: "Breathe with the center.", body: "Let the noise fall away from the orb." },
  },
  replay: {
    id: "replay",
    background: "radial-gradient(circle at 50% 35%, #3a2054 0%, #11132d 48%, #05050b 100%)",
    accent: "#ffd27a",
    secondary: "#ff9fbf",
    glow: "rgba(255, 210, 122, 0.6)",
    copy: { eyebrow: "Replay", title: "Enter the memory.", body: "A moment opens when the light remembers it." },
  },
};

export const getSceneTheme = (scene: UraiScene): SceneTheme => sceneThemes[scene];
