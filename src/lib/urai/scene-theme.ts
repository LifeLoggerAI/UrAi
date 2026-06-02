export type UraiScene = "home" | "life-map" | "ground" | "focus" | "replay";

export type TransitionDirection = "enter" | "return";

export const sceneThemes = {
  home: {
    id: "home",
    background: "radial-gradient(circle at 50% 30%, #203963 0%, #101a38 45%, #050714 100%)",
    accent: "#f8d98b",
    secondary: "#9fb7ff",
    glow: "rgba(248, 217, 139, 0.5)",
    copy: {
      eyebrow: "URAI Genesis",
      title: "Your world is awake.",
      body: "The center is quiet. The sky remembers.",
    },
  },
} as const;

export const getSceneTheme = (scene: UraiScene) => sceneThemes.home;
