import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata = {
  title: "Life Map | UrAi",
  description:
    "The UrAi Life Map is a cinematic memory galaxy for reflection, recovery, purpose, emotional weather, and legacy.",
};

export default function Page() {
  return <LifeMapUniverse initialView="lifeMap" />;
}
